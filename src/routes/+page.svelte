<script>
	import Placeholder from '$lib/components/Placeholder.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { gallery as galleryPhotos } from '$lib/gallery.js';
	import { site } from '$lib/seo.js';
	import { socials } from '$lib/nav.js';

	const description =
		'TEDxPurdueU is the official TEDx chapter at Purdue University. We organize a TEDx conference every year, drawing 500+ attendees.';
	const homeStructuredData = [
		{
			'@type': 'WebSite',
			'@id': `${site.url}/#website`,
			url: `${site.url}/`,
			name: site.name,
			alternateName: 'TEDx Purdue U',
			description
		},
		{
			'@type': 'Organization',
			'@id': `${site.url}/#organization`,
			name: site.name,
			alternateName: 'TEDx Purdue U',
			url: `${site.url}/`,
			logo: `${site.url}/logo-dark.png`,
			image: `${site.url}${site.image}`,
			description,
			email: 'tedx@purdue.edu',
			sameAs: socials.map(({ href }) => href)
		}
	];

	const programmes = [
		{
			number: '01',
			href: '/2027-event',
			title: 'TEDxPurdueU: Unseen',
			body: 'The Annual TEDx Conference.'
		},
		{
			number: '02',
			href: '/salons',
			title: 'Salons',
			body: 'Small events for the community bonding, free to attend.'
		},
		{
			number: '03',
			href: '/speakers',
			title: 'Student Speaker Competition',
			body: 'An opportunity for Purdue students to give an official TEDx talk while still in college.'
		}
	];

	// Talk titles and speaker names are taken from the TEDxPurdueU YouTube
	// uploads. `views` is optional — add a figure to surface it on the card.
	/** @type {{ name: string, talk: string, href: string, photo: string, views?: string }[]} */
	const pastSpeakers = [
		{
			name: 'Bo Parfet',
			talk: 'How Do You Light Your Soul on Fire?',
			href: 'https://youtu.be/DoqgKo-wfhU',
			photo: '/img/speaker-bo.webp'
		},
		{
			name: 'Prady Modukuru',
			talk: 'From Building to Founding',
			href: 'https://youtu.be/2xmzJzK44b4',
			photo: '/img/speaker-prady.webp'
		},
		{
			name: 'Aastha Patel',
			talk: 'To Learn a Language is to Live It',
			href: 'https://youtu.be/X00wenuNgtc',
			photo: '/img/speaker-aastha.webp'
		},
		{
			name: 'Chase Boehringer',
			talk: 'How to do impossible things',
			href: 'https://youtu.be/8dD20w6lrRQ',
			photo: '/img/speaker-chase.webp'
		},
		{
			name: 'Nicole Johnston',
			talk: 'When Being \'Too Much\' Is Actually Just Enough',
			href: 'https://youtu.be/4vCDnJiGDaA',
			photo: '/img/speaker-nicole.webp'
		},
		{
			name: 'Sid Thatham',
			talk: 'Energy for AI and Everybody Else',
			href: 'https://youtu.be/zTFQAHrZHxA',
			photo: '/img/speaker-sid.webp'
		}
	];

	const galleryImageAlt = 'Image from TEDxPurdueU Odyssey 2026';

	// Keep the generated gallery metadata untouched while giving every image and
	// its interactive thumbnail the same accurate, non-speculative accessible name.
	const accessibleGalleryPhotos = galleryPhotos.map((photo) => ({
		...photo,
		label: galleryImageAlt,
		alt: galleryImageAlt
	}));

	// The prerendered HTML carries one fixed order, so the reshuffle has to wait
	// until after hydration or the client markup would disagree with it. Fifty-odd
	// array items cost nothing to shuffle, and the image URLs are unchanged, so
	// the browser cache still hits.
	let photos = $state(accessibleGalleryPhotos);

	$effect(() => {
		const next = [...accessibleGalleryPhotos];
		for (let i = next.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[next[i], next[j]] = [next[j], next[i]];
		}
		photos = next;
	});

	let page = $state(0);
	/** @type {HTMLDivElement | undefined} */
	let galleryGrid = $state();
	// This SSR-safe baseline preserves the existing ten-photo markup until the
	// browser measures the real CSS grid after hydration.
	let galleryColumns = $state(5);
	let galleryIsMobile = $state(false);
	let previousPerPage = $state(10);
	// -1 is "closed"; anything else is an index into the whole gallery, not into
	// the current page, so the lightbox can run past a page boundary.
	let openIndex = $state(-1);

	const galleryRows = $derived(galleryIsMobile ? 3 : 2);
	const perPage = $derived(galleryColumns * galleryRows);
	const pageCount = $derived(Math.ceil(photos.length / perPage));
	const pageStart = $derived(page * perPage);
	const pagePhotos = $derived(photos.slice(pageStart, pageStart + perPage));
	/** @type {number[]} */
	const pageNumbers = $derived(Array.from({ length: pageCount }, (_, i) => i));

	// The grid uses auto-fit, so its column count is a layout result rather than
	// a breakpoint we can safely duplicate in JavaScript. Observe it instead:
	// desktop gets two complete rows and the touch layout gets three.
	$effect(() => {
		if (!galleryGrid) return;

		const grid = galleryGrid;
		const mobile = window.matchMedia('(max-width: 720px)');
		const updatePagination = () => {
			galleryIsMobile = mobile.matches;
			const tracks = getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/);
			galleryColumns = Math.max(1, tracks.filter(Boolean).length);
		};
		const observer = new ResizeObserver(updatePagination);

		updatePagination();
		observer.observe(grid);
		mobile.addEventListener('change', updatePagination);

		return () => {
			observer.disconnect();
			mobile.removeEventListener('change', updatePagination);
		};
	});

	// On reflow retain the first item of the current page instead of resetting a
	// visitor to the beginning of the gallery.
	$effect(() => {
		const nextPage = Math.min(
			Math.floor((page * previousPerPage) / perPage),
			Math.max(0, pageCount - 1)
		);
		previousPerPage = perPage;
		if (page !== nextPage) page = nextPage;
	});
</script>

<Seo
	title="TEDxPurdueU"
	{description}
	path="/"
	structuredData={homeStructuredData}
/>

<section class="hero">
	<div class="hero-copy">
		<h1>Ideas worth<br />spreading.</h1>
		<p class="hero-lede">
			One independently organized TED event each year, salons all semester, and a competition that
			puts a student in the spotlight.
		</p>
		<div class="actions">
			<a class="btn btn--primary" href="/2027-event">Unseen 2027</a>
			<a class="btn btn--outline" href="/speakers">Speak on our stage</a>
		</div>
	</div>

	<div class="hero-media">
		<div class="hero-media__wide">
			<Placeholder
				ratio="16/10"
				src="/img/conference-group.webp"
				label="The TEDxPurdueU team on stage"
			/>
		</div>
		<Placeholder ratio="4/3" src="/img/audience.webp" label="The audience at Odyssey" />
		<a class="next-card" href="/2027-event">
			<div class="next-card__label">Next event</div>
			<div class="next-card__title">Unseen</div>
			<div class="next-card__meta">Spring 2027</div>
		</a>
	</div>
</section>

<div class="hero-rule"><div class="hero-rule__line"></div></div>

<section class="who">
	<h2 class="section-label">Who we are</h2>
	<div class="who__copy">
		<p class="who__lead">
			TEDxPurdueU is the official TEDx chapter at Purdue University.
		</p>
		<p class="who__body">
			We organize an official TEDx conference every year with 300+ attendees, curating six
			speakers from all across the world to share their ideas with the Greater Lafayette
			community. Past speakers have included Las Vegas headliners, researchers, and founders.
		</p>
	</div>
</section>

<section class="programmes">
	<div class="programmes__head">
		<h2 class="section-label">What we do</h2>
	</div>
	{#each programmes as item (item.number)}
		<a class="programme" href={item.href}>
			<div class="programme__number">{item.number}</div>
			<div class="programme__copy">
				<h3>{item.title}</h3>
				<p>{item.body}</p>
			</div>
			<div class="programme__arrow" aria-hidden="true">→</div>
		</a>
	{/each}
</section>

<section class="speakers">
	<div class="speakers__head">
		<h2>Odyssey 2026 Talks</h2>
		<p>Every talk from our stage lives on the TEDx YouTube channel.</p>
	</div>
	<div class="speakers__grid">
		{#each pastSpeakers as speaker (speaker.href)}
			<article class="speaker">
				<Placeholder
					ratio="4/3"
					src={speaker.photo}
					label={speaker.name}
					alt="{speaker.name} on stage"
				/>
				<div class="speaker__copy">
					<h3>{speaker.name}</h3>
					<p class="speaker__talk">{speaker.talk}</p>
					{#if speaker.views}
						<p class="speaker__views">
							<span class="speaker__count">{speaker.views}</span> views on YouTube
						</p>
					{/if}
				</div>
				<a class="speaker__cta" href={speaker.href} target="_blank" rel="noopener noreferrer">
					<svg class="cta__play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
					Watch the talk
				</a>
			</article>
		{/each}
	</div>
</section>

<section class="gallery">
	<div class="gallery__head">
		<h2>Gallery</h2>
	</div>
	<div class="gallery__grid" bind:this={galleryGrid}>
		{#each pagePhotos as photo, i (photo.src)}
			<button
				class="gallery__item"
				type="button"
				aria-label={photo.alt}
				onclick={() => (openIndex = pageStart + i)}
			>
				<Placeholder ratio="3/4" label={photo.label} src={photo.thumb} alt={photo.alt} />
			</button>
		{/each}
	</div>

	{#if pageCount > 1}
		<nav class="gallery__pager" aria-label="Gallery pages">
			<button
				class="pager__step"
				type="button"
				disabled={page === 0}
				onclick={() => (page = Math.max(0, page - 1))}
			>
				Prev
			</button>
			<div class="pager__pages">
				{#each pageNumbers as n (n)}
					<button
						class="pager__page"
						type="button"
						aria-label="Page {n + 1}"
						aria-current={n === page ? 'page' : undefined}
						onclick={() => (page = n)}
					>
						{n + 1}
					</button>
				{/each}
			</div>
			<button
				class="pager__step"
				type="button"
				disabled={page === pageCount - 1}
				onclick={() => (page = Math.min(pageCount - 1, page + 1))}
			>
				Next
			</button>
		</nav>
	{/if}
</section>

{#if openIndex >= 0}
	<Lightbox
		{photos}
		index={openIndex}
		onclose={() => (openIndex = -1)}
		onnavigate={(i) => (openIndex = i)}
	/>
{/if}

<style>
	/* ---- Hero -------------------------------------------------------- */

	.hero {
		padding: 9vh var(--gutter) 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(340px, 100%), 1fr));
		gap: 56px;
		align-items: center;
	}

	.hero-copy {
		display: flex;
		flex-direction: column;
		gap: 32px;
		min-width: 0;
	}

	h1 {
		font-size: clamp(44px, 6.4vw, 104px);
		line-height: 0.92;
		letter-spacing: -0.045em;
		text-wrap: balance;
	}

	.hero-lede {
		max-width: 44ch;
		font-size: 18px;
		line-height: 1.65;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.actions {
		display: flex;
		gap: 14px;
		flex-wrap: wrap;
	}

	.hero-media {
		min-width: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}

	.hero-media__wide {
		grid-column: span 2;
		min-width: 0;
	}

	/* The red tile that fills the fourth cell of the hero collage. Links to the
	   event page, so it overrides the global red link colour. */
	.next-card {
		min-width: 0;
		aspect-ratio: 4/3;
		/* Once the tile is phone-narrow the label wraps and the 4/3 box can no
		   longer hold the copy; letting it outgrow the ratio beats clipping. */
		min-height: min-content;
		background: var(--red-accessible);
		color: #fff;
		/* The tile is a quarter of the collage, so on a phone it is only ~130px
		   across — desktop's fixed padding and gap would clip the date out. */
		padding: clamp(13px, 4vw, 22px);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: clamp(6px, 2vw, 16px);
		overflow: hidden;
		transition: background-color 0.25s ease;
	}

	.next-card:hover {
		background: var(--text);
		color: #fff;
	}

	.next-card__label {
		font-size: 12px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.next-card__title {
		font-size: clamp(22px, 2.6vw, 44px);
		line-height: 0.95;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: -0.03em;
		overflow-wrap: anywhere;
	}

	.next-card__meta {
		font-size: 13px;
		letter-spacing: 0.06em;
	}

	/* The hairline that closes the hero, inset to the page gutter. */
	.hero-rule {
		padding: 9vh var(--gutter) 0;
	}

	.hero-rule__line {
		border-bottom: 1px solid var(--rule);
	}

	/* ---- Who we are -------------------------------------------------- */

	.who {
		padding: 11vh var(--gutter);
		border-bottom: 1px solid var(--rule);
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
		gap: 64px;
		max-width: 1300px;
	}

	/* Shared label for the two paired sections — "Who we are" / "What we do". */
	.section-label {
		font-size: 13px;
		/* h2 supplies the document structure; this keeps the former plain-label
		   weight so the visual hierarchy does not change. */
		font-weight: 400;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--red-accessible);
	}

	.who__copy {
		grid-column: span 2;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 26px;
	}

	.who__lead {
		font-size: clamp(22px, 2.4vw, 32px);
		line-height: 1.35;
		letter-spacing: -0.015em;
		color: var(--text);
		text-wrap: pretty;
	}

	.who__body {
		font-size: 17px;
		line-height: 1.7;
		color: var(--text-dim);
		max-width: 70ch;
		text-wrap: pretty;
	}

	/* Below the three-column threshold the label already sits on its own row, so
	   the copy's span would only conjure an implicit track and push the page
	   sideways. Collapse to a single column and let both stack full width. */
	@media (max-width: 900px) {
		.who {
			grid-template-columns: 1fr;
		}

		.who__copy {
			grid-column: auto;
		}
	}

	/* ---- Programme rows ---------------------------------------------- */

	.programmes {
		border-bottom: 1px solid var(--rule);
	}

	/* Introduces the numbered rows so they don't start cold off the section
	   rule above them. */
	.programmes__head {
		padding: 10vh var(--gutter) 44px;
	}

	.programme {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 40px;
		align-items: baseline;
		padding: 44px var(--gutter);
		border-bottom: 1px solid var(--rule);
		color: inherit;
		transition: background-color 0.25s ease;
	}

	/* The red marker wipes in from the page edge, so the hover reads as a
	   pointer at one row rather than a slab dropped over the whole band. */
	.programme::before {
		content: '';
		position: absolute;
		left: 0;
		top: -1px;
		bottom: -1px;
		width: 0;
		background: var(--red);
		transition: width 0.25s ease;
	}

	.programme:last-child {
		border-bottom: none;
	}

	.programme:hover {
		background: var(--row-wash);
		color: inherit;
	}

	.programme:hover::before {
		width: 6px;
	}

	.programme__number {
		font-size: 14px;
		color: var(--red-accessible);
		font-weight: 700;
		letter-spacing: 0.1em;
	}

	.programme__copy {
		display: flex;
		flex-direction: column;
		gap: 10px;
		min-width: 0;
	}

	.programme__copy h3 {
		font-size: clamp(26px, 3.4vw, 46px);
		letter-spacing: -0.025em;
	}

	.programme__copy p {
		font-size: 16px;
		line-height: 1.6;
		color: var(--text-dim);
	}

	.programme__arrow {
		font-size: 26px;
		color: var(--red);
		transition: transform 0.25s ease;
	}

	.programme:hover .programme__arrow {
		transform: translateX(8px);
	}

	/* The number and arrow columns plus two 40px gaps take ~130px, which leaves
	   the title nothing on a phone. Lift the number onto its own line and pull
	   the gap in so the copy gets the full measure. */
	@media (max-width: 620px) {
		.programme {
			grid-template-columns: 1fr auto;
			gap: 10px 20px;
			padding: 34px var(--gutter);
		}

		.programme__number {
			grid-column: 1 / -1;
		}
	}

	/* ---- Past speakers ------------------------------------------------ */

	.speakers {
		padding: 10vh var(--gutter);
		border-bottom: 1px solid var(--rule);
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.speakers__head {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.speakers__head h2 {
		font-size: clamp(24px, 2.6vw, 34px);
		letter-spacing: -0.02em;
	}

	.speakers__head p {
		font-size: 16px;
		line-height: 1.6;
		color: var(--text-dim);
	}

	/* Fixed three across so the six talks read as two even rows rather than
	   reflowing to four-and-two. */
	.speakers__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 28px;
	}

	@media (max-width: 900px) {
		.speakers__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 560px) {
		.speakers__grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.speaker {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.speaker__copy {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
	}

	.speaker__copy h3 {
		font-size: 20px;
		letter-spacing: -0.02em;
	}

	.speaker__talk {
		font-size: 15px;
		line-height: 1.5;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.speaker__views {
		font-size: 13px;
		color: var(--text-faint);
		padding-top: 2px;
	}

	.speaker__count {
		font-weight: 700;
		color: var(--red-accessible);
	}

	/* A quiet text link rather than a filled button: six red slabs in a row
	   overwhelmed the cards and the photos they sit under. */
	.speaker__cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		align-self: flex-start;
		margin-top: auto;
		min-height: 44px;
		font-size: 13px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--text);
		transition: color 0.15s ease;
	}

	.speaker__cta:hover {
		color: var(--red-accessible);
	}

	.cta__play {
		width: 15px;
		height: 15px;
		flex-shrink: 0;
		fill: var(--red);
	}

	/* ---- Gallery ------------------------------------------------------ */

	/* Last section on the page, so it carries its own bottom space off the
	   footer rather than borrowing it from a section below. */
	.gallery {
		padding: 9vh 0;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.gallery__head {
		padding: 0 var(--gutter);
	}

	.gallery__head h2 {
		font-size: clamp(24px, 2.6vw, 34px);
		letter-spacing: -0.02em;
	}

	/* The 45% floor keeps the portrait frames two-up on a phone — one 3/4 photo
	   per row would run most of a screen tall. Above ~490px the 220px min wins
	   again, so wider layouts are untouched. */
	.gallery__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(220px, 45%), 1fr));
		gap: 12px;
		padding: 0 var(--gutter);
	}

	/* The thumbnail is a real button so it is keyboard-operable; everything the
	   UA gives a button is stripped back to a bare photo frame. */
	.gallery__item {
		position: relative;
		display: block;
		width: 100%;
		min-width: 0;
		padding: 0;
		border: 0;
		background: none;
		font: inherit;
		color: inherit;
		cursor: pointer;
	}

	/* A red hairline laid over the frame rather than a border on it, so hovering
	   never nudges the grid by a pixel. */
	.gallery__item::after {
		content: '';
		position: absolute;
		inset: 0;
		border: 2px solid transparent;
		pointer-events: none;
		transition: border-color 0.25s ease;
	}

	.gallery__item:hover::after {
		border-color: var(--red);
	}

	.gallery__pager {
		padding: 4px var(--gutter) 0;
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
	}

	.pager__step,
	.pager__page {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		background: none;
		border: 1px solid var(--border-strong);
		color: var(--text);
		font-family: inherit;
		font-weight: 700;
		cursor: pointer;
		transition:
			background-color 0.25s ease,
			border-color 0.25s ease,
			color 0.25s ease;
	}

	.pager__step {
		/* Tightened on narrow screens so Prev / numbers / Next still share one
		   row inside a 320px gutter rather than orphaning Next onto its own. */
		padding: 0 clamp(14px, 5vw, 22px);
		font-size: 13px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.pager__page {
		min-width: 44px;
		font-family: var(--mono);
		font-size: 13px;
	}

	.pager__step:hover:not(:disabled),
	.pager__page:hover {
		border-color: var(--red-accessible);
		color: var(--red-accessible);
	}

	.pager__page[aria-current='page'] {
		background: var(--red-accessible);
		border-color: var(--red-accessible);
		color: #fff;
	}

	.pager__step:disabled {
		border-color: var(--rule);
		color: var(--text-fainter);
		cursor: default;
	}

	.pager__pages {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
</style>
