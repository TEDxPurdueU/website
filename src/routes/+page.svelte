<script>
	import Placeholder from '$lib/components/Placeholder.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';

	const programmes = [
		{
			number: '01',
			href: '/unseen',
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

	// TODO: replace with the real past speakers — their names and talk titles, the
	// YouTube URL for each talk, the live view count, and a stage photo per card.
	const pastSpeakers = [
		{
			name: 'Speaker One',
			talk: 'Talk title one',
			views: '0K',
			href: '#',
			photoLabel: 'Speaker 1 on stage'
		},
		{
			name: 'Speaker Two',
			talk: 'Talk title two',
			views: '0K',
			href: '#',
			photoLabel: 'Speaker 2 on stage'
		},
		{
			name: 'Speaker Three',
			talk: 'Talk title three',
			views: '0K',
			href: '#',
			photoLabel: 'Speaker 3 on stage'
		}
	];

	// Add or remove entries freely — the grid reflows and repaginates to whatever
	// length this is. Drop photos into static/ and set `src` (and ideally `alt`)
	// on each to fill a slot: { label: 'Photo 1', src: '/gallery-01.jpg' }.
	/** @type {{ label: string, src?: string, alt?: string }[]} */
	const gallery = [
		{ label: 'Photo 1' },
		{ label: 'Photo 2' },
		{ label: 'Photo 3' },
		{ label: 'Photo 4' },
		{ label: 'Photo 5' },
		{ label: 'Photo 6' },
		{ label: 'Photo 7' },
		{ label: 'Photo 8' },
		{ label: 'Photo 9' },
		{ label: 'Photo 10' },
		{ label: 'Photo 11' },
		{ label: 'Photo 12' },
		{ label: 'Photo 13' },
		{ label: 'Photo 14' },
		{ label: 'Photo 15' },
		{ label: 'Photo 16' },
		{ label: 'Photo 17' },
		{ label: 'Photo 18' },
		{ label: 'Photo 19' },
		{ label: 'Photo 20' }
	];

	const PER_PAGE = 12;

	let page = $state(0);
	// -1 is "closed"; anything else is an index into the whole gallery, not into
	// the current page, so the lightbox can run past a page boundary.
	let openIndex = $state(-1);

	const pageCount = $derived(Math.ceil(gallery.length / PER_PAGE));
	const pageStart = $derived(page * PER_PAGE);
	const pagePhotos = $derived(gallery.slice(pageStart, pageStart + PER_PAGE));
	/** @type {number[]} */
	const pageNumbers = $derived(Array.from({ length: pageCount }, (_, i) => i));
</script>

<svelte:head>
	<title>TEDxPurdueU</title>
	<meta
		name="description"
		content="TEDxPurdueU is a student-run organization at Purdue University that curates one independently organized TED event each year, plus salons and a student speaker competition."
	/>
</svelte:head>

<section class="hero">
	<div class="hero-copy">
		<h1>Ideas worth<br />spreading.</h1>
		<p class="hero-lede">
			One independently organized TED event each year, salons all semester, and a competition that
			puts a student in the spotlight.
		</p>
		<div class="actions">
			<a class="btn btn--primary" href="/unseen">Unseen 2027</a>
			<a class="btn btn--outline" href="/speakers">Speak on our stage</a>
		</div>
	</div>

	<div class="hero-media">
		<div class="hero-photo">
			<Placeholder ratio="16/10" label="Drop a photo from the last conference" />
		</div>
		<div class="next-card">
			<div class="next-card__label">Next event</div>
			<div class="next-card__title">Unseen</div>
			<div class="next-card__meta">Spring 2027</div>
		</div>
	</div>
</section>

<div class="hero-rule"><div class="hero-rule__line"></div></div>

<section class="who">
	<div class="section-label">Who we are</div>
	<div class="who__copy">
		<p class="who__lead">
			TEDxPurdueU is the official TEDx chapter at Purdue University.
		</p>
		<p class="who__body">
			We organize an official TEDx conference every year with 300+ attendees, curating six
			speakers from all across the world to share their ideas with the Greater Lafayette
			community. Past speakers have included Las Vegas headliners, researchers, and founders.
		</p>
		<a class="link-rule" href="/team">Meet the team</a>
	</div>
</section>

<section class="programmes">
	<div class="programmes__head">
		<div class="section-label">What we do</div>
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
		<h2>Past speakers</h2>
		<p>Every talk from our stage lives on the TEDx YouTube channel.</p>
	</div>
	<div class="speakers__grid">
		{#each pastSpeakers as speaker (speaker.name)}
			<article class="speaker">
				<Placeholder ratio="4/3" label={speaker.photoLabel} />
				<div class="speaker__copy">
					<h3>{speaker.name}</h3>
					<p class="speaker__talk">{speaker.talk}</p>
					<p class="speaker__views">
						<span class="speaker__count">{speaker.views}</span> views on YouTube
					</p>
				</div>
				<a
					class="btn btn--primary speaker__cta"
					href={speaker.href}
					target="_blank"
					rel="noopener noreferrer"
				>
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
	<div class="gallery__grid">
		{#each pagePhotos as photo, i (photo.label)}
			<button
				class="gallery__item"
				type="button"
				aria-label="View {photo.label} larger"
				onclick={() => (openIndex = pageStart + i)}
			>
				<Placeholder ratio="3/4" label={photo.label} src={photo.src} alt={photo.alt} />
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
		photos={gallery}
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
		position: relative;
		padding: 0 0 clamp(54px, 7vw, 82px) clamp(26px, 4vw, 56px);
	}

	.hero-photo {
		min-width: 0;
	}

	/* The red tile that fills the fourth cell of the hero collage. */
	.next-card {
		position: absolute;
		left: 0;
		bottom: 0;
		width: clamp(150px, 34%, 210px);
		aspect-ratio: 4 / 3;
		/* Once the tile is phone-narrow the label wraps and the 4/3 box can no
		   longer hold the copy; letting it outgrow the ratio beats clipping. */
		min-height: min-content;
		background: var(--red);
		color: #fff;
		/* The tile is a quarter of the collage, so on a phone it is only ~130px
		   across — desktop's fixed padding and gap would clip the date out. */
		padding: clamp(13px, 4vw, 22px);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: clamp(6px, 2vw, 16px);
		overflow: hidden;
	}

	@media (max-width: 520px) {
		.hero-media {
			padding-left: 20px;
			padding-bottom: 62px;
		}
	}

	.next-card__label {
		font-size: 12px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		opacity: 0.85;
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
		opacity: 0.9;
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
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--red);
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
		color: var(--red);
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

	.speakers__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
		gap: 28px;
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
		color: var(--red);
	}

	/* Pinned to the card foot so the buttons line up across cards whose talk
	   titles wrap to different heights. */
	.speaker__cta {
		align-self: flex-start;
		margin-top: auto;
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
		border-color: var(--red);
		color: var(--red);
	}

	.pager__page[aria-current='page'] {
		background: var(--red);
		border-color: var(--red);
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
