<script>
	import Placeholder from '$lib/components/Placeholder.svelte';

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

	// TODO: drop the four gallery photos into static/ and set `src` on each.
	const gallery = [
		{ label: 'Photo 1' },
		{ label: 'Photo 2' },
		{ label: 'Photo 3' },
		{ label: 'Photo 4' }
	];

	const stats = [
		{ value: '6', label: 'Speakers per conference' },
		{ value: '300+', label: 'Attendees each year' },
		{ value: '30+', label: 'Student organizers' },
		{ value: '4', label: 'Salons each year' }
	];
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
		<div class="hero-media__wide">
			<Placeholder ratio="16/10" label="Drop a photo from the last conference" />
		</div>
		<Placeholder ratio="4/3" label="Speaker on stage" />
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
			<a class="speaker" href={speaker.href} target="_blank" rel="noopener noreferrer">
				<Placeholder ratio="4/3" label={speaker.photoLabel} />
				<div class="speaker__copy">
					<h3>{speaker.name}</h3>
					<p class="speaker__talk">{speaker.talk}</p>
				</div>
				<div class="speaker__views">
					<span class="speaker__count">{speaker.views}</span>
					<span class="speaker__unit">views on YouTube</span>
				</div>
			</a>
		{/each}
	</div>
</section>

<section class="gallery">
	<div class="gallery__head">
		<h2>From the last conference</h2>
	</div>
	<div class="gallery__grid">
		{#each gallery as photo (photo.label)}
			<Placeholder ratio="3/4" label={photo.label} />
		{/each}
	</div>
</section>

<section class="stats">
	{#each stats as stat (stat.label)}
		<div class="stat">
			<div class="stat__value">{stat.value}</div>
			<div class="stat__label">{stat.label}</div>
		</div>
	{/each}
</section>

<style>
	/* ---- Hero -------------------------------------------------------- */

	.hero {
		padding: 9vh var(--gutter) 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
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

	/* The red tile that fills the fourth cell of the hero collage. */
	.next-card {
		min-width: 0;
		aspect-ratio: 4/3;
		background: var(--red);
		color: #fff;
		padding: 22px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 16px;
		overflow: hidden;
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
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 28px;
	}

	.speaker {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 18px;
		color: inherit;
		transition: transform 0.25s ease;
	}

	.speaker:hover {
		color: inherit;
		transform: translateY(-4px);
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

	/* The view count is the reason this section exists, so it is set at stat
	   scale rather than as a caption under the talk title. */
	.speaker__views {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding-top: 16px;
		border-top: 1px solid var(--rule);
		margin-top: auto;
	}

	.speaker__count {
		font-size: clamp(30px, 3.2vw, 42px);
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--red);
	}

	.speaker__unit {
		font-size: 12px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	/* ---- Gallery ------------------------------------------------------ */

	.gallery {
		padding: 9vh 0 0;
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

	.gallery__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 12px;
		padding: 0 var(--gutter);
	}

	/* ---- Stats -------------------------------------------------------- */

	.stats {
		padding: 9vh var(--gutter);
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 40px;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.stat__value {
		font-size: clamp(34px, 3.6vw, 52px);
		font-weight: 700;
		letter-spacing: -0.03em;
	}

	.stat__label {
		font-size: 13px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--text-faint);
	}
</style>
