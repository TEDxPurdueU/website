<script>
	import { onMount } from 'svelte';
	import { PASSWORD_SHA256 } from '$lib/linkspassword.js';
	import { absoluteUrl, site } from '$lib/seo.js';
	import { shortLinks } from '$lib/shortlinks.js';

	// This page only hides the builder from casual visitors (the check runs in the
	// browser). Creating a short link is checked again on the server, in
	// api/shortlinks.js, so the password is kept for the tab and sent along.
	const UNLOCK_KEY = 'tedx_links_password';

	// Short links come from the shared list, so a new one shows up here as soon as it is added.
	/** @param {string} what */
	const label = (what) => what.charAt(0).toUpperCase() + what.slice(1);
	const links = $state(shortLinks.map(({ slug, what }) => ({ path: `/${slug}`, label: label(what) })));

	const pages = [
		{ path: '/', label: 'Home' },
		{ path: '/2027-event', label: 'Unseen 2027' },
		{ path: '/sponsors', label: 'Sponsors' },
		{ path: '/team', label: 'Team' }
	];

	const sources = ['flyer', 'instagram', 'email', 'linkedin', 'newsletter', 'poster'];

	let unlocked = $state(false);
	// A preview or local copy: its links and QR codes point at the real site, where a link
	// made here (or this whole version) does not exist until it is merged.
	let offSite = $state(false);
	let password = $state('');
	let entered = $state('');
	let wrong = $state(false);

	let newUrl = $state('');
	let newName = $state('');
	let creating = $state(false);
	let createError = $state('');
	let createNote = $state('');

	let path = $state(links[0].path);
	let source = $state('');
	let svg = $state('');
	let qrFailed = $state(false);
	let status = $state('');
	/** @type {HTMLTextAreaElement | undefined} */
	let field = $state();
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let timer;

	/** @param {string} text */
	async function isPassword(text) {
		try {
			const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
			const hash = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
			return hash === PASSWORD_SHA256;
		} catch {
			return false;
		}
	}

	onMount(async () => {
		offSite = !['tedxpurdueu.org', 'www.tedxpurdueu.org'].includes(location.hostname);
		try {
			const saved = sessionStorage.getItem(UNLOCK_KEY);
			if (saved && (await isPassword(saved))) {
				password = saved;
				unlocked = true;
			}
		} catch {
			// Storage can be blocked (private mode); the password is then asked each visit.
		}
	});

	/** @param {SubmitEvent} event */
	async function unlock(event) {
		event.preventDefault();
		if (!(await isPassword(entered))) {
			wrong = true;
			entered = '';
			return;
		}
		password = entered;
		unlocked = true;
		try {
			sessionStorage.setItem(UNLOCK_KEY, entered);
		} catch {
			// Not remembered; the next visit asks again.
		}
	}

	/**
	 * Analytics counts `Spring Flyer` and `spring-flyer` as two different
	 * sources, so the tag is forced to one shape.
	 *
	 * @param {string} text
	 */
	const slug = (text) =>
		text
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');

	const tag = $derived(slug(source));

	/**
	 * The new link is a commit that Vercel has to build, so it is not reachable for a
	 * minute or so. Ask for it every few seconds and say when it is.
	 *
	 * @param {string} name
	 */
	async function watchLive(name) {
		createNote = `/${name} is created. It goes live in about a minute.`;
		for (let tries = 0; tries < 36; tries++) {
			await new Promise((resolve) => setTimeout(resolve, 5000));
			try {
				const res = await fetch(`/${name}?live=${Date.now()}`, { method: 'HEAD', cache: 'no-store' });
				if (res.ok) return (createNote = `/${name} is live.`);
			} catch {
				// Offline for a moment; try again.
			}
		}
		createNote = `/${name} is created but is taking longer than usual to go live.`;
	}

	/** @param {SubmitEvent} event */
	async function createLink(event) {
		event.preventDefault();
		const name = slug(newName);
		createError = createNote = '';
		creating = true;
		try {
			const res = await fetch('/api/shortlinks', {
				method: 'POST',
				headers: { 'content-type': 'application/json', 'x-links-password': password },
				body: JSON.stringify({ slug: name, url: newUrl.trim() })
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				createError =
					data.error ??
					(res.status === 404
						? 'The short link service is not available here. It only runs on the live site and previews.'
						: 'Could not create the link. Try again.');
				return;
			}
			links.push({ path: `/${name}`, label: label(name.replaceAll('-', ' ')) });
			path = `/${name}`;
			newUrl = newName = '';
			watchLive(name);
		} catch {
			createError = 'Could not reach the short link service. Check your connection and try again.';
		} finally {
			creating = false;
		}
	}

	// With no source this is the plain link, which is what a generic QR code wants.
	const url = $derived.by(() => {
		const link = new URL(absoluteUrl(path));
		if (tag) link.searchParams.set('utm_source', tag);
		return link.toString();
	});

	// What the downloaded QR files are called, without the extension.
	const fileName = $derived([path.replace(/^\//, '') || 'home', tag, 'qr'].filter(Boolean).join('-'));

	// "Open" stays on whichever site this page is running on, so testing a link on a
	// local run visits the local site instead of adding a visit to production.
	const testHref = $derived(url.slice(site.url.length));

	// The QR library is only needed here, so it loads on demand instead of joining
	// the shared bundle. Its output is solid black on white, which is what scanners
	// read best, and carries a pixel size so the downloaded file opens at a sensible
	// size (the page itself stretches it to fit).
	$effect(() => {
		const text = url;
		let stale = false;
		import('qrcode-generator')
			.then(({ default: qrcode }) => {
				const qr = qrcode(0, 'M');
				qr.addData(text);
				qr.make();
				return qr.createSvgTag({ cellSize: 16, margin: 32 });
			})
			.then((out) => {
				if (stale) return;
				svg = out;
				qrFailed = false;
			})
			.catch(() => {
				if (stale) return;
				// Drop the previous link's QR so the downloads cannot save it under this name.
				svg = '';
				qrFailed = true;
			});
		return () => (stale = true);
	});

	/** @param {string} message */
	function announce(message) {
		status = message;
		clearTimeout(timer);
		timer = setTimeout(() => (status = ''), 3000);
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(url);
		} catch {
			// The clipboard API needs a secure context and permission. Fall back to
			// the old copy command, and if that fails too leave the text selected.
			field?.select();
			if (!document.execCommand('copy')) return announce('Press Ctrl+C to copy');
		}
		announce('Copied');
	}

	/**
	 * @param {Blob} blob
	 * @param {string} name
	 */
	function save(blob, name) {
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = name;
		link.click();
		setTimeout(() => URL.revokeObjectURL(link.href));
	}

	const downloadSvg = () => save(new Blob([svg], { type: 'image/svg+xml' }), `${fileName}.svg`);

	// The PNG is the same QR code drawn at a whole-number multiple of its size, so every
	// square lands on exact pixels, and at least 1024px wide so it holds up in print.
	async function downloadPng() {
		const image = new Image();
		image.src = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
		try {
			await image.decode();
		} finally {
			URL.revokeObjectURL(image.src);
		}
		const size = image.naturalWidth * Math.ceil(1024 / image.naturalWidth);
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = size;
		const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
		context.fillStyle = '#fff';
		context.fillRect(0, 0, size, size);
		context.drawImage(image, 0, 0, size, size);
		canvas.toBlob((blob) => blob && save(blob, `${fileName}.png`));
	}
</script>

<svelte:head>
	<title>TEDxPurdueU Link Builder</title>
	<!-- A team tool, not a page for visitors: it is linked from nowhere and kept out of search. -->
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="hero section--ruled">
	<div class="hero-inner">
		<div class="eyebrow">Team only</div>
		<h1 class="page-title">Link builder</h1>
		<p class="lede">
			Turn any link into a short link, then make a QR code for a flyer, slide, Instagram bio or
			email. Add a source to see which one brought people in.
		</p>
	</div>
</section>

<section class="sec">
	{#if !unlocked}
		<form class="stack gate" onsubmit={unlock}>
			<h2 class="col-title">Team password</h2>
			<div class="field">
				<label class="label" for="password">Password</label>
				<input
					id="password"
					type="password"
					bind:value={entered}
					oninput={() => (wrong = false)}
					required
					autocomplete="current-password"
					aria-invalid={wrong}
					aria-describedby={wrong ? 'password-error' : undefined}
				/>
				{#if wrong}
					<p class="error" id="password-error" role="alert">That password is not right.</p>
				{/if}
			</div>
			<button type="submit" class="btn btn--primary">Unlock</button>
		</form>
	{:else}
		<div class="layout">
			<div class="left">
				<form class="stack form" onsubmit={createLink}>
					<h2 class="col-title">New short link</h2>

					<div class="field">
						<label class="label" for="new-url">Where should it go?</label>
						<input
							id="new-url"
							type="url"
							bind:value={newUrl}
							required
							placeholder="https://"
							autocomplete="off"
							autocapitalize="none"
							spellcheck="false"
						/>
					</div>

					<div class="field">
						<label class="label" for="new-name">Short name</label>
						<input
							id="new-name"
							type="text"
							bind:value={newName}
							onblur={() => (newName = slug(newName))}
							required
							autocomplete="off"
							autocapitalize="none"
							spellcheck="false"
							aria-describedby="new-name-hint"
						/>
						<p class="hint" id="new-name-hint">The link will be {site.url.replace('https://', '')}/{slug(newName) || 'name'}</p>
					</div>

					<button type="submit" class="btn btn--primary create" disabled={creating}>
						{creating ? 'Creating' : 'Create short link'}
					</button>
					{#if createError}
						<p class="error" role="alert">{createError}</p>
					{/if}
					<!-- Always in the page so screen readers announce the text when it appears. -->
					<p class="note" role="status">{createNote}</p>
				</form>

				<form class="stack form" onsubmit={(event) => event.preventDefault()}>
					<h2 class="col-title">Link details</h2>

					<div class="field">
						<label class="label" for="path">Destination</label>
						<select id="path" bind:value={path}>
							<optgroup label="Short links">
								{#each links as destination (destination.path)}
									<option value={destination.path}>{destination.label} ({destination.path})</option>
								{/each}
							</optgroup>
							<optgroup label="Site pages">
								{#each pages as destination (destination.path)}
									<option value={destination.path}>{destination.label} ({destination.path})</option>
								{/each}
							</optgroup>
						</select>
					</div>

					<div class="field">
						<label class="label" for="source">Source</label>
						<input
							id="source"
							type="text"
							list="source-options"
							bind:value={source}
							onblur={() => (source = slug(source))}
							autocomplete="off"
							autocapitalize="none"
							spellcheck="false"
							aria-describedby="source-hint"
						/>
						<datalist id="source-options">
							{#each sources as option (option)}
								<option value={option}></option>
							{/each}
						</datalist>
						<p class="hint" id="source-hint">
							Optional. Where the link will live, like flyer or instagram. Leave it empty for a plain
							link.
						</p>
					</div>
				</form>
			</div>

			<div class="stack output">
				<h2 class="col-title">Your link</h2>

				<div class="field">
					<label class="label" for="url">Link</label>
					<textarea
						id="url"
						class="url"
						rows="4"
						readonly
						value={url}
						bind:this={field}
						onfocus={(event) => event.currentTarget.select()}
					></textarea>
				</div>

				<div class="actions">
					<button type="button" class="btn btn--primary" onclick={copy}>Copy</button>
					<a
						class="btn btn--outline"
						href={testHref}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Open link in a new tab"
					>
						Open
					</a>
					<!-- Always in the page so screen readers announce the text when it appears. -->
					<p class="status" role="status">{status}</p>
				</div>

				<div class="field">
					<span class="label">QR code</span>
					<div class="qr" role="img" aria-label="QR code for the link above">
						{@html svg}
					</div>
					{#if qrFailed}
						<p class="hint">The QR code could not load. Reload the page and try again.</p>
					{/if}
				</div>

				<div class="actions">
					<button type="button" class="btn btn--outline" onclick={downloadPng} disabled={!svg}>
						Download PNG
					</button>
					<button type="button" class="btn btn--outline" onclick={downloadSvg} disabled={!svg}>
						Download SVG
					</button>
				</div>
				{#if offSite}
					<p class="hint">
						This is not the live site. The link and QR code point at {site.url.replace('https://', '')},
						so they only work there once this version is merged.
					</p>
				{/if}
				<p class="hint">Test-scan every printed QR code with a phone before it goes to the printer.</p>
			</div>
		</div>
	{/if}
</section>

<style>
	.hero {
		padding: 9vh var(--gutter) 6vh;
	}

	.hero-inner {
		max-width: 900px;
		display: flex;
		flex-direction: column;
		gap: 26px;
	}

	.sec {
		padding: 7vh var(--gutter) 10vh;
	}

	.layout {
		max-width: 1200px;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 56px;
	}

	@media (min-width: 900px) {
		.layout {
			grid-template-columns: minmax(0, 5fr) minmax(0, 4fr);
			gap: 72px;
			align-items: start;
		}
	}

	.left {
		display: flex;
		flex-direction: column;
		gap: 56px;
	}

	.form,
	.output,
	.gate {
		gap: 24px;
	}

	.gate {
		max-width: 420px;
		align-items: flex-start;
	}

	.col-title {
		font-size: 22px;
		letter-spacing: 0.02em;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
	}

	/* 16px stops iOS zooming the page when a field is focused. The edge is
	   --text-faint rather than the lighter rules: a form field's border has to
	   reach 3:1 against the page to be seen at all. */
	input,
	select,
	textarea {
		width: 100%;
		padding: 14px 16px;
		font: inherit;
		font-size: 16px;
		color: var(--text);
		background: var(--bg);
		border: 1px solid var(--text-faint);
		border-radius: 0;
	}

	input:hover,
	select:hover,
	input:focus,
	select:focus {
		border-color: var(--text);
	}

	select {
		appearance: none;
		padding-right: 44px;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%23000' stroke-width='1.8'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 16px center;
		background-size: 12px 8px;
		cursor: pointer;
	}

	.hint {
		font-size: 14px;
		line-height: 1.5;
		color: var(--text-dim);
	}

	/* Bold because red text under 18px is kept bold for legibility. */
	.error {
		font-size: 14px;
		font-weight: 700;
		color: var(--red-accessible);
	}

	.url {
		resize: none;
		font-family: var(--mono);
		font-size: 14px;
		line-height: 1.55;
		background: var(--fill);
		overflow-wrap: anywhere;
		/* Grows with the link where supported; rows="4" is the fallback. */
		field-sizing: content;
		min-height: 6.5em;
	}

	/* The site's .btn is built for links, so the <button>s here need the
	   native chrome stripped. The transparent border keeps Copy as tall as the
	   outlined buttons beside it. */
	button.btn {
		font-family: inherit;
	}

	button.btn--outline {
		background: none;
	}

	.btn--primary {
		border: 2px solid transparent;
	}

	.btn {
		text-align: center;
	}

	.btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}

	.status {
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.06em;
		color: var(--red-accessible);
	}

	.note {
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.06em;
	}

	.qr {
		width: min(100%, 280px);
		aspect-ratio: 1;
		background: var(--bg);
		border: 1px solid var(--border);
	}

	.qr :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
	}

	.create {
		align-self: flex-start;
	}
</style>
