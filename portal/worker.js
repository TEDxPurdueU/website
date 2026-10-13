// TEDxPurdueU events + team portal: a Cloudflare Worker that edits a Google Sheet.
// The Sheet is the database; the website build reads it. No dependencies.
// Secrets/vars: see wrangler.toml and README.md.

const TABS = {
	Events: ['slug', 'type', 'title', 'blurb', 'start', 'end', 'venue', 'collab', 'rsvp', 'button_label', 'button_url', 'image', 'image_alt', 'published', 'deleted', 'updated_by', 'updated_at'],
	Team: ['id', 'name', 'role', 'group', 'photo', 'order', 'visible', 'deleted', 'updated_by', 'updated_at']
};
const KEY = { Events: 'slug', Team: 'id' };
const J = { 'content-type': 'application/json' };
const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: J });

const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const json64 = (o) => b64u(new TextEncoder().encode(JSON.stringify(o)));

/** Verifies the Cloudflare Access JWT and returns the editor's email. Fails closed. */
async function editor(req, env) {
	const jwt = req.headers.get('cf-access-jwt-assertion');
	if (!jwt || !env.TEAM_DOMAIN || !env.POLICY_AUD) return null;
	try {
		const [h, p, sig] = jwt.split('.');
		const head = JSON.parse(new TextDecoder().decode(unb64u(h)));
		const body = JSON.parse(new TextDecoder().decode(unb64u(p)));
		const certs = await (await fetch(`https://${env.TEAM_DOMAIN}/cdn-cgi/access/certs`, { cf: { cacheTtl: 3600 } })).json();
		const key = await crypto.subtle.importKey('jwk', certs.keys.find((k) => k.kid === head.kid), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
		const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, unb64u(sig), new TextEncoder().encode(`${h}.${p}`));
		if (!ok || ![].concat(body.aud).includes(env.POLICY_AUD) || body.exp * 1000 < Date.now()) return null;
		return body.email || null;
	} catch {
		return null;
	}
}

/** Google access token for the service account (Sheets + Drive). Cached per isolate. */
let cached = { token: '', exp: 0 };
async function google(env) {
	if (cached.exp > Date.now() + 60000) return cached.token;
	const sa = JSON.parse(env.GOOGLE_SA);
	const now = Math.floor(Date.now() / 1000);
	const unsigned = `${json64({ alg: 'RS256', typ: 'JWT' })}.${json64({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })}`;
	const pem = sa.private_key.replace(/-----[^-]+-----|\s/g, '');
	const key = await crypto.subtle.importKey('pkcs8', Uint8Array.from(atob(pem), (c) => c.charCodeAt(0)), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
	const sig = b64u(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned)));
	const res = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${sig}` })
	});
	const data = await res.json();
	if (!data.access_token) throw new Error('Google sign-in failed: ' + JSON.stringify(data));
	cached = { token: data.access_token, exp: Date.now() + data.expires_in * 1000 };
	return cached.token;
}

async function sheets(env, path, init = {}) {
	const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${env.SHEET_ID}${path}`, {
		...init,
		headers: { authorization: `Bearer ${await google(env)}`, 'content-type': 'application/json' }
	});
	if (!res.ok) throw new Error(`Sheets ${res.status}: ${await res.text()}`);
	return res.json();
}

const col = (n) => String.fromCharCode(65 + n); // tabs have fewer than 26 columns

async function rows(env, tab) {
	const { values = [] } = await sheets(env, `/values/${tab}!A2:${col(TABS[tab].length - 1)}`);
	return values.map((v) => Object.fromEntries(TABS[tab].map((c, i) => [c, v[i] ?? ''])));
}

async function save(env, tab, item, who) {
	const cols = TABS[tab];
	const all = await rows(env, tab);
	const idx = all.findIndex((r) => r[KEY[tab]] === item[KEY[tab]]);
	const row = { ...(idx >= 0 ? all[idx] : {}), ...item, updated_by: who, updated_at: new Date().toISOString() };
	const values = [cols.map((c) => (row[c] === undefined || row[c] === null ? '' : String(row[c])))];
	if (idx >= 0) {
		await sheets(env, `/values/${tab}!A${idx + 2}:${col(cols.length - 1)}${idx + 2}?valueInputOption=RAW`, { method: 'PUT', body: JSON.stringify({ values }) });
	} else {
		await sheets(env, `/values/${tab}!A2:${col(cols.length - 1)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, { method: 'POST', body: JSON.stringify({ values }) });
	}
}

function check(tab, i) {
	if (tab === 'Events') {
		if (!/^[a-z0-9-]+$/.test(i.slug || '')) return 'Slug: lowercase letters, numbers and dashes only.';
		if (!['main', 'competition', 'salon'].includes(i.type)) return 'Pick an event type.';
		if (!i.title?.trim()) return 'Title is required.';
		const dt = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
		if (!dt.test(i.start || '') || !dt.test(i.end || '')) return 'Start and end are required.';
		if (i.end < i.start) return 'End must be after start.';
		if (i.button_url && !/^https?:\/\//.test(i.button_url)) return 'Button link must start with http.';
		if (i.rsvp && !/^https?:\/\//.test(i.rsvp)) return 'RSVP link must start with http.';
	} else {
		if (!/^[a-z0-9-]+$/.test(i.id || '')) return 'Bad id.';
		if (!i.name?.trim()) return 'Name is required.';
		if (!['leadership', 'member'].includes(i.group)) return 'Pick a group.';
	}
	return null;
}

async function upload(env, req) {
	const bytes = await req.arrayBuffer();
	if (bytes.byteLength > 600 * 1024) throw new Error('Image too large (600KB max).');
	const type = req.headers.get('content-type') || '';
	if (!/^image\/(webp|png|jpeg|gif)$/.test(type)) throw new Error('Only webp, png, jpeg or gif images.');
	const boundary = 'tedx' + crypto.randomUUID();
	const meta = JSON.stringify({ name: `${crypto.randomUUID()}.${type.split('/')[1] || 'webp'}`, parents: [env.DRIVE_FOLDER_ID] });
	const body = new Blob([`--${boundary}\r\ncontent-type: application/json\r\n\r\n${meta}\r\n--${boundary}\r\ncontent-type: ${type}\r\n\r\n`, bytes, `\r\n--${boundary}--`]);
	const auth = { authorization: `Bearer ${await google(env)}` };
	const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true', {
		method: 'POST',
		headers: { ...auth, 'content-type': `multipart/related; boundary=${boundary}` },
		body
	});
	if (!res.ok) throw new Error(`Image upload failed (${res.status}). Paste an image link instead. ${await res.text()}`);
	const { id } = await res.json();
	await fetch(`https://www.googleapis.com/drive/v3/files/${id}/permissions?supportsAllDrives=true`, {
		method: 'POST',
		headers: { ...auth, 'content-type': 'application/json' },
		body: JSON.stringify({ role: 'reader', type: 'anyone' })
	});
	return `https://drive.google.com/uc?export=download&id=${id}`;
}

export default {
	async fetch(req, env) {
		const url = new URL(req.url);
		const who = await editor(req, env);
		if (!who) return new Response('Sign in required (Cloudflare Access not configured or session expired).', { status: 401 });
		try {
			if (url.pathname === '/') return new Response(PAGE, { headers: { 'content-type': 'text/html;charset=utf-8' } });

			const m = url.pathname.match(/^\/api\/(events|team)$/);
			if (m) {
				const tab = m[1] === 'events' ? 'Events' : 'Team';
				if (req.method === 'GET') return reply((await rows(env, tab)).filter((r) => r.deleted !== 'TRUE'));
				if (req.method === 'PUT' || req.method === 'DELETE') {
					const item = await req.json();
					if (req.method === 'DELETE') {
						await save(env, tab, { [KEY[tab]]: item[KEY[tab]], deleted: 'TRUE', ...(tab === 'Events' ? { published: 'FALSE' } : { visible: 'FALSE' }) }, who);
					} else {
						const err = check(tab, item);
						if (err) return reply({ error: err }, 400);
						await save(env, tab, { ...item, deleted: 'FALSE' }, who);
					}
					return reply({ ok: true });
				}
			}
			if (url.pathname === '/api/image' && req.method === 'POST') return reply({ url: await upload(env, req) });
			if (url.pathname === '/api/publish' && req.method === 'POST') {
				if (!env.DEPLOY_HOOK_URL) return reply({ error: 'Publishing is not set up yet (DEPLOY_HOOK_URL).' }, 500);
				await fetch(env.DEPLOY_HOOK_URL, { method: 'POST' });
				return reply({ ok: true });
			}
			return new Response('Not found', { status: 404 });
		} catch (e) {
			return reply({ error: String(e.message || e) }, 500);
		}
	}
};

const PAGE = `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>TEDxPurdueU portal</title>
<style>
:root{--bg:#faf9f8;--text:#14100f;--dim:#5f5852;--red:#c82100;--rule:#e4dfd9;--bs:#cbc4bc}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.4 "Helvetica Neue",Helvetica,Arial,sans-serif}
header{display:flex;gap:24px;align-items:center;padding:0 24px;height:64px;border-bottom:1px solid var(--rule)}
header b{font-size:20px;letter-spacing:-.03em}header b i{color:var(--red);font-style:normal}
nav button{height:64px;border:0;border-bottom:3px solid transparent;background:none;font:inherit;font-size:13px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;color:var(--dim)}
nav button.on{color:var(--text);border-color:#ff2b06;font-weight:700}
main{max-width:860px;margin:0 auto;padding:32px 24px}h1{font-size:48px;letter-spacing:-.045em;margin:0 0 16px;line-height:.95}
.top{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap}
button.b,a.b{min-height:44px;padding:0 20px;font:inherit;font-size:13px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;border:2px solid var(--bs);background:none;cursor:pointer;color:var(--text)}
button.b.p{background:var(--red);border-color:var(--red);color:#fff}button.b:hover{border-color:var(--red);color:var(--red)}button.b.p:hover{background:var(--text);border-color:var(--text);color:#fff}
.row{display:flex;gap:12px;align-items:center;padding:14px 0;border-bottom:1px solid var(--rule)}.row .t{flex:1;font-weight:700;font-size:18px}.row small{color:var(--dim);display:block;font-weight:400;font-size:13px}
.list{border-top:3px solid #ff2b06;margin-top:16px}
label{display:block;margin:16px 0 4px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:700}
input,select,textarea{width:100%;min-height:44px;padding:10px 12px;font:inherit;border:2px solid var(--bs);border-radius:0;background:#fff}
.two{display:grid;grid-template-columns:1fr 1fr;gap:16px}#msg{color:var(--red);min-height:1.4em}.hint{color:var(--dim);font-size:14px}
form{border-top:3px solid #ff2b06;margin-top:24px;padding-top:8px}
</style>
<header><b><i>TEDx</i>PurdueU <span style="font-weight:400;color:var(--dim)">Portal</span></b>
<nav><button id=tab-events class=on onclick="tab('events')">Events</button><button id=tab-team onclick="tab('team')">Team</button></nav></header>
<main>
<div class=top><h1 id=title>Events.</h1><div><button class=b onclick=publish()>Publish site</button> <button class="b p" onclick="edit()">+ New</button></div></div>
<p class=hint>Save stores your edit. <b>Publish site</b> puts all saved edits on the website (about 7 minutes).</p>
<div id=list class=list></div>
<form id=f hidden></form>
</main>
<script>
const $=id=>document.getElementById(id);let cur='events',data=[],form=null;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const slug=t=>t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const api=async(m,p,b,h)=>{const r=await fetch(p,{method:m,body:b,headers:h});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Something went wrong');return j};
async function tab(t){cur=t;$('tab-events').className=t=='events'?'on':'';$('tab-team').className=t=='team'?'on':'';$('title').textContent=t=='events'?'Events.':'Team.';$('f').hidden=true;await load()}
async function load(){data=await api('GET','/api/'+cur);if(cur=='team')data.sort((a,b)=>(a.group==b.group?0:a.group=='leadership'?-1:1)||(+a.order||0)-(+b.order||0));else data.sort((a,b)=>b.start.localeCompare(a.start));
$('list').innerHTML=data.map((e,i)=>cur=='events'?'<div class=row><div class=t>'+esc(e.title)+'<small>'+esc(e.type)+' · '+esc(e.start.slice(0,10))+' · '+(e.published=='TRUE'?'live after publish':'hidden')+'</small></div><button class=b onclick="edit('+i+')">Edit</button><button class=b onclick="del('+i+')">Delete</button></div>':'<div class=row><div class=t>'+esc(e.name)+'<small>'+esc(e.role)+' · '+esc(e.group)+(e.visible=='TRUE'?'':' · hidden')+'</small></div><button class=b aria-label="Move up" onclick="move('+i+',-1)">↑</button><button class=b aria-label="Move down" onclick="move('+i+',1)">↓</button><button class=b onclick="edit('+i+')">Edit</button><button class=b onclick="del('+i+')">Delete</button></div>').join('')||'<p class=hint>Nothing here yet.</p>'}
const inp=(k,l,v,t='text')=>'<label>'+l+'</label><input name='+k+' type='+t+' value="'+esc(v)+'">';
function edit(i){const e=i==null?{}:data[i];form=e;let h;
if(cur=='events'){h='<label>Type</label><select name=type>'+[['main','Main event'],['competition','Student speaker competition'],['salon','Salon']].map(o=>'<option value='+o[0]+(e.type==o[0]?' selected':'')+'>'+o[1]).join('')+'</select>'+inp('title','Title',e.title)+'<label>Description</label><textarea name=blurb rows=4>'+esc(e.blurb)+'</textarea><div class=two><div>'+inp('start','Starts (Purdue time)',e.start,'datetime-local')+'</div><div>'+inp('end','Ends',e.end,'datetime-local')+'</div></div>'+inp('venue','Venue (optional)',e.venue)+inp('collab','Hosted with (optional)',e.collab)+inp('rsvp','RSVP link (optional)',e.rsvp,'url')+'<div class=two><div>'+inp('button_label','Button text (optional)',e.button_label)+'</div><div>'+inp('button_url','Button link',e.button_url,'url')+'</div></div>'+img(e.image)+inp('image_alt','Image description (for screen readers)',e.image_alt)+'<label><input type=checkbox name=published style="width:auto;min-height:0" '+(e.published!='FALSE'?'checked':'')+'> Show on website</label>'}
else{h=inp('name','Name',e.name)+inp('role','Role',e.role)+'<label>Group</label><select name=group><option value=leadership'+(e.group=='leadership'?' selected':'')+'>Leadership<option value=member'+(e.group=='member'?' selected':'')+'>Member</select>'+img(e.photo,'photo')+'<label><input type=checkbox name=visible style="width:auto;min-height:0" '+(e.visible!='FALSE'?'checked':'')+'> Show on website</label>'}
$('f').innerHTML='<h2>'+(i==null?'New':'Edit')+'</h2>'+h+'<p id=msg></p><button class="b p">Save</button> <button type=button class=b onclick="$(\\'f\\').hidden=true">Cancel</button>';$('f').hidden=false;$('f').scrollIntoView()}
function img(v,k='image'){return '<label>'+(k=='photo'?'Headshot':'Flyer / image')+'</label><input type=hidden name='+k+' value="'+esc(v)+'"><input type=file accept="image/*" onchange="pick(this,\\''+k+'\\')"><span class=hint id=imgnote>'+(v?'Image set. Choose a file to replace it.':'')+'</span>'}
async function pick(el,k){const f=el.files[0];if(!f)return;$('imgnote').textContent='Uploading...';try{const bmp=await createImageBitmap(f),s=Math.min(1,1200/bmp.width),c=document.createElement('canvas');c.width=bmp.width*s;c.height=bmp.height*s;c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
const blob=await new Promise(r=>c.toBlob(r,'image/webp',.82));const j=await api('POST','/api/image',blob,{'content-type':'image/webp'});document.querySelector('[name='+k+']').value=j.url;$('imgnote').textContent='Uploaded.'}catch(e){$('imgnote').textContent=e.message}}
$('f').onsubmit=async x=>{x.preventDefault();const d=Object.fromEntries(new FormData($('f')));
for(const c of ['published','visible'])if(c in form||(cur=='events'&&c=='published')||(cur=='team'&&c=='visible'))d[c]=$('f').elements[c]?.checked?'TRUE':'FALSE';
if(cur=='events'){d.slug=form.slug||slug(d.title)}else{d.id=form.id||(()=>{let b=slug(d.name),n=b,k=2;while(data.some(r=>r.id==n))n=b+'-'+k++;return n})();d.order=form.order||String(data.length+1)}
try{await api('PUT','/api/'+cur,JSON.stringify(d));$('f').hidden=true;await load()}catch(e){$('msg').textContent=e.message}};
async function del(i){const k=cur=='events'?data[i].title:data[i].name;if(!confirm('Delete "'+k+'"? It will be removed from the website after the next publish.'))return;await api('DELETE','/api/'+cur,JSON.stringify(data[i]));load()}
async function move(i,d){const j=i+d;if(j<0||j>=data.length||data[i].group!=data[j].group)return;const a=data[i],b=data[j],o=a.order;
await api('PUT','/api/team',JSON.stringify({...a,order:String(j+1)}));await api('PUT','/api/team',JSON.stringify({...b,order:String(i+1)}));load()}
async function publish(){try{await api('POST','/api/publish');alert('Publishing. The website updates in about 7 minutes (Google refreshes the Sheet copy every few minutes).')}catch(e){alert(e.message)}}
load().catch(e=>{$('list').innerHTML='<p class=hint>'+esc(e.message)+'</p>'});
</script>`;
