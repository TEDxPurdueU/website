<script>
	import { onMount } from 'svelte';
	import { absoluteUrl, site } from '$lib/seo.js';

	// A static site has no server to check a password against, so this is a soft
	// lock: it keeps casual visitors out of a team tool, and nothing secret sits
	// behind it. To change the password: printf '%s' 'new password' | shasum -a 256
	const PASSWORD_SHA256 = '0894012affbb630bb196cdee6a5c1d7fcf4510720800f20e65180a94a5735c54';
	const UNLOCK_KEY = 'tedx_links_unlocked';

	const destinations = [
		{ path: '/', label: 'Home' },
		{ path: '/2027-event', label: 'Unseen 2027' },
		{ path: '/apply', label: 'Apply' },
		{ path: '/nominate', label: 'Nominate a speaker' },
		{ path: '/yc-event', label: 'YC at Purdue' },
		{ path: '/sponsors', label: 'Sponsors' },
		{ path: '/team', label: 'Team' }
	];

	const sources = ['flyer', 'instagram', 'email', 'linkedin', 'newsletter', 'poster'];

	let unlocked = $state(false);
	let entered = $state('');
	let wrong = $state(false);

	let path = $state('/');
	let source = $state('');
	let svg = $state('');
	let qrFailed = $state(false);
	let status = $state('');
	/** @type {HTMLTextAreaElement | undefined} */
	let field = $state();
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let timer;

	onMount(() => {
		try {
			unlocked = sessionStorage.getItem(UNLOCK_KEY) === '1';
		} catch {
			// Storage can be blocked (private mode); the password is then asked each visit.
		}
	});

	/** @param {SubmitEvent} event */
	async function unlock(event) {
		event.preventDefault();
		try {
			const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(entered));
			const hash = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
			if (hash !== PASSWORD_SHA256) throw new Error('wrong password');
		} catch {
			wrong = true;
			entered = '';
			return;
		}
		unlocked = true;
		try {
			sessionStorage.setItem(UNLOCK_KEY, '1');
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

	// Without a source the link would be untagged, which is just the plain page.
	const url = $derived.by(() => {
		if (!tag) return '';
		const link = new URL(absoluteUrl(path));
		link.searchParams.set('utm_source', tag);
		return link.toString();
	});

	// "Open" stays on whichever site this page is running on, so testing a link on a
	// local run visits the local site instead of adding a visit to production.
	const testHref = $derived(url.slice(site.url.length));

	// The QR library is only needed here, so it loads on demand instead of joining
	// the shared bundle. Its output is solid black on white, which is what scanners
	// read best, and carries a pixel size so the downloaded file opens at a sensible
	// size (the page itself stretches it to fit).
	$effect(() => {
		const text = url;
		if (!text) {
			svg = '';
			return;
		}
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
				if (!stale) qrFailed = true;
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

	function downloadQr() {
		const link = document.createElement('a');
		link.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
		link.download = `${tag}-qr.svg`;
		link.click();
		setTimeout(() => URL.revokeObjectURL(link.href));
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
			Make a tagged link for a flyer, QR code, Instagram bio or email, so we can see which one
			brought people in.
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
			<form class="stack form" onsubmit={(event) => event.preventDefault()}>
				<h2 class="col-title">Link details</h2>

				<div class="field">
					<label class="label" for="path">Destination</label>
					<select id="path" bind:value={path}>
						{#each destinations as destination (destination.path)}
							<option value={destination.path}>{destination.label} ({destination.path})</option>
						{/each}
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
						Where the link will live, like flyer or instagram. Also names the QR file.
					</p>
				</div>
			</form>

			<div class="stack output">
				<h2 class="col-title">Your link</h2>

				{#if url}
					<div class="field">
						<label class="label" for="url">Tagged link</label>
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

					<button type="button" class="btn btn--outline download" onclick={downloadQr} disabled={!svg}>
						Download SVG
					</button>
					<p class="hint">Test-scan every printed QR code with a phone before it goes to the printer.</p>
				{:else}
					<p class="body-text">Add a source and your link and QR code will show up here.</p>
				{/if}
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

	.download {
		align-self: flex-start;
	}
</style>
