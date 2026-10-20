<script>
	import { absoluteUrl, site } from '$lib/seo.js';
	import { UTM_KEYS } from '$lib/utm.js';

	const destinations = [
		{ path: '/', label: 'Home' },
		{ path: '/2027-event', label: 'Unseen 2027' },
		{ path: '/apply', label: 'Apply' },
		{ path: '/nominate', label: 'Nominate a speaker' },
		{ path: '/yc-event', label: 'YC at Purdue' },
		{ path: '/sponsors', label: 'Sponsors' },
		{ path: '/team', label: 'Team' }
	];

	/** @type {{ key: string, label: string, hint: string, options?: string[], required?: boolean }[]} */
	const fields = [
		{
			key: 'utm_source',
			label: 'Source',
			hint: 'Where the link will live.',
			options: ['flyer', 'instagram', 'email', 'linkedin', 'newsletter', 'poster'],
			required: true
		},
		{
			key: 'utm_medium',
			label: 'Medium',
			hint: 'How people get to it.',
			options: ['qr', 'social', 'email', 'print', 'bio']
		},
		{
			key: 'utm_campaign',
			label: 'Campaign',
			hint: 'The push it belongs to, like yc-purdue-2026. Also names the QR file.'
		},
		{
			key: 'utm_content',
			label: 'Content',
			hint: 'Optional. Tells two versions of one placement apart, like red-flyer.'
		}
	];

	const blank = Object.fromEntries(UTM_KEYS.map((key) => [key, '']));

	let path = $state('/');
	let values = $state({ ...blank });
	let svg = $state('');
	let qrFailed = $state(false);
	let status = $state('');
	/** @type {HTMLTextAreaElement | undefined} */
	let field = $state();
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let timer;

	/**
	 * Analytics counts `Spring Flyer` and `spring-flyer` as two different
	 * sources, so every tag is forced to one shape.
	 *
	 * @param {string} text
	 */
	const slug = (text) =>
		text
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');

	const tags = $derived(Object.fromEntries(UTM_KEYS.map((key) => [key, slug(values[key])])));

	// Without a source the link would be untagged, which is just the plain page.
	const url = $derived.by(() => {
		if (!tags.utm_source) return '';
		const link = new URL(absoluteUrl(path));
		for (const [key, value] of Object.entries(tags)) {
			if (value) link.searchParams.set(key, value);
		}
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

	function fillYcFlyer() {
		path = '/yc-event';
		values = {
			...blank,
			utm_source: 'flyer',
			utm_medium: 'qr',
			utm_campaign: 'yc-purdue-2026'
		};
	}

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
		link.download = `${tags.utm_campaign || tags.utm_source}-qr.svg`;
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
	<div class="layout">
		<form class="stack form" onsubmit={(event) => event.preventDefault()}>
			<h2 class="col-title">Link details</h2>

			<div class="preset">
				<span class="label">Quick fill</span>
				<button type="button" class="btn btn--outline" onclick={fillYcFlyer}>YC flyer QR</button>
			</div>

			<div class="field">
				<label class="label" for="path">Destination</label>
				<select id="path" bind:value={path}>
					{#each destinations as destination (destination.path)}
						<option value={destination.path}>{destination.label} ({destination.path})</option>
					{/each}
				</select>
			</div>

			{#each fields as item (item.key)}
				<div class="field">
					<label class="label" for={item.key}>
						{item.label}
						{#if item.required}<span class="required">Required</span>{/if}
					</label>
					<input
						id={item.key}
						type="text"
						list={item.options ? `${item.key}-options` : undefined}
						bind:value={values[item.key]}
						onblur={() => (values[item.key] = slug(values[item.key]))}
						required={item.required}
						autocomplete="off"
						autocapitalize="none"
						spellcheck="false"
						aria-describedby="{item.key}-hint"
					/>
					{#if item.options}
						<datalist id="{item.key}-options">
							{#each item.options as option (option)}
								<option value={option}></option>
							{/each}
						</datalist>
					{/if}
					<p class="hint" id="{item.key}-hint">{item.hint}</p>
				</div>
			{/each}
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
	.output {
		gap: 24px;
	}

	.col-title {
		font-size: 22px;
		letter-spacing: 0.02em;
	}

	.preset {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 20px;
		padding-bottom: 24px;
		border-bottom: 1px solid var(--rule);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	/* Bold because red text under 18px is kept bold for legibility. */
	.required {
		margin-left: 8px;
		font-weight: 700;
		color: var(--red-accessible);
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

	/* The site's .btn is built for links, so the two <button>s here need the
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
