// Pulls events and team from the portal's Google Sheet into src/lib/events.json and
// src/lib/team.json (and image files into static/cms/) before a build.
// Needs EVENTS_CSV_URL and TEAM_CSV_URL (the Sheet tabs, "Publish to web" as CSV).
// If they're unset, unreachable or look wrong, the committed JSON is kept and the build
// carries on, so the site never breaks because of the portal.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const { EVENTS_CSV_URL, TEAM_CSV_URL } = process.env;
if (!EVENTS_CSV_URL || !TEAM_CSV_URL) {
	console.log('events: no sheet configured; using committed snapshot');
	process.exit(0);
}

/** Minimal CSV parser (quoted fields, escaped quotes, newlines inside quotes). */
function parseCsv(text) {
	const rows = [];
	let row = [], cell = '', q = false;
	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		if (q) {
			if (c === '"' && text[i + 1] === '"') (cell += '"', i++);
			else if (c === '"') q = false;
			else cell += c;
		} else if (c === '"') q = true;
		else if (c === ',') (row.push(cell), (cell = ''));
		else if (c === '\n' || c === '\r') {
			if (c === '\r' && text[i + 1] === '\n') i++;
			row.push(cell); rows.push(row); row = []; cell = '';
		} else cell += c;
	}
	if (cell || row.length) (row.push(cell), rows.push(row));
	const [head, ...body] = rows;
	return body.filter((r) => r.some(Boolean)).map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

const get = async (url) => {
	const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
	if (!res.ok) throw new Error(`${res.status} from ${new URL(url).host}`);
	return res;
};
const yes = (v) => v.toUpperCase() === 'TRUE';

/** Drive/other links become files under static/cms so pages never depend on Drive. */
async function localImage(url) {
	if (!url || url.startsWith('/')) return url || null;
	const id = (url.match(/[?&]id=([\w-]+)/) || url.match(/\/d\/([\w-]+)/) || [])[1];
	if (!id) return url;
	const file = `static/cms/${id}.webp`;
	if (!existsSync(new URL(file, root))) {
		try {
		const buf = Buffer.from(await (await get(`https://drive.google.com/uc?export=download&id=${id}`)).arrayBuffer());
		mkdirSync(new URL('static/cms/', root), { recursive: true });
		writeFileSync(new URL(file, root), buf);
		} catch (e) {
			console.warn(`events: image ${id} skipped (${e.message})`);
			return null;
		}
	}
	return `/cms/${id}.webp`;
}

try {
	const events = parseCsv(await (await get(EVENTS_CSV_URL)).text());
	const team = parseCsv(await (await get(TEAM_CSV_URL)).text());
	if (!events.length || !events[0].slug || !events[0].title || !team.length || !team[0].name) throw new Error('sheet columns look wrong');

	const eventsOut = [];
	for (const e of events.filter((e) => yes(e.published) && !yes(e.deleted))) {
		eventsOut.push({
			slug: e.slug,
			type: e.type === 'main' ? 'main' : e.type,
			title: e.title,
			blurb: e.blurb,
			start: e.start,
			end: e.end,
			venue: e.venue || null,
			collab: e.collab || null,
			rsvp: e.rsvp || null,
			button: e.button_url ? { label: e.button_label || 'Learn more', url: e.button_url } : null,
			image: await localImage(e.image),
			imageAlt: e.image_alt
		});
	}

	const people = team.filter((t) => yes(t.visible) && !yes(t.deleted)).sort((a, b) => (+a.order || 0) - (+b.order || 0));
	const mk = async (p) => ({ name: p.name, role: p.role, photo: await localImage(p.photo) });
	const teamOut = {
		team: await Promise.all(people.filter((p) => p.group === 'leadership').map(mk)),
		members: await Promise.all(people.filter((p) => p.group === 'member').map(async (p) => ({ name: p.name, photo: (await mk(p)).photo })))
	};

	writeFileSync(new URL('src/lib/events.json', root), JSON.stringify(eventsOut, null, '\t') + '\n');
	writeFileSync(new URL('src/lib/team.json', root), JSON.stringify(teamOut, null, '\t') + '\n');
	console.log(`events: synced ${eventsOut.length} events, ${people.length} people from the sheet`);
} catch (e) {
	console.warn(`events: SHEET SYNC FAILED (${e.message}); using committed snapshot. The site may be out of date.`);
}
