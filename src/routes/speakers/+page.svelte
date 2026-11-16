<script>
	import Placeholder from '$lib/components/Placeholder.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const description =
		'Eight Purdue students took the stage at the 2026 Student Speaker Competition. Watch every talk; the winner speaks at our main event.';

	const playlistUrl = 'https://www.youtube.com/playlist?list=PLcob9f23kNyI';

	// Names and one-line summaries come from the TEDxPurdueU YouTube uploads, in
	// playlist order. The talks have no titles of their own: each video is named
	// after its speaker. Photos live in static/talks (not static/img, which
	// `npm run images` rewrites from scratch).
	/** @type {{ name: string, blurb: string, href: string, photo: string }[]} */
	const talks = [
		{
			name: 'Maria Regina Jaga',
			blurb:
				'Grew up in Eastern Indonesia with textbooks that left her home out. Education has to learn to recognize the knowledge communities already hold.',
			href: 'https://youtu.be/RoXVUiE4d7Q',
			photo: '/talks/maria.webp'
		},
		{
			name: 'Taylor Marin',
			blurb:
				'Uses the fig tree, which survives drought by reshaping itself, to argue that we are strong because we struggle.',
			href: 'https://youtu.be/K2XpunZRLZo',
			photo: '/talks/taylor.webp'
		},
		{
			name: 'Max Rosenwasser',
			blurb:
				'How the U.S. interstate highway system was routed through Black neighborhoods. Intent is hard to prove, impact is not.',
			href: 'https://youtu.be/GglpCfWrYdA',
			photo: '/talks/max.webp'
		},
		{
			name: 'Chris Kim',
			blurb:
				"Scored 28 out of 100 on a freshman exam. Never compare your beginning to someone else's middle.",
			href: 'https://youtu.be/txEb2gVUchQ',
			photo: '/talks/chris.webp'
		},
		{
			name: 'Stephen Mawuli Amuzu',
			blurb: 'A PhD student from Ghana on why every visible result begins with an unseen decision.',
			href: 'https://youtu.be/vkXf9udrGT8',
			photo: '/talks/stephen.webp'
		},
		{
			name: 'Matthew Schilt',
			blurb:
				'Uses his own colorblindness to show that everyone has blind spots, and that much important work goes unrecognized.',
			href: 'https://youtu.be/mDtoqhuoJuM',
			photo: '/talks/matthew.webp'
		},
		{
			name: 'Rai Shayaan Kharal',
			blurb:
				'A freshman from Singapore, opening with a rap verse, on how small daily actions build momentum when no one sees them.',
			href: 'https://youtu.be/-FX9aq0pM00',
			photo: '/talks/rai.webp'
		},
		{
			name: 'Evelyn Wong',
			blurb: 'What feels like common sense depends on what a curriculum chose to teach.',
			href: 'https://youtu.be/bvXK1J1Eqs0',
			photo: '/talks/evelyn.webp'
		}
	];

	const winners = [
		{
			year: '2026',
			name: 'Aastha Patel',
			talk: 'To Learn a Language is to Live It',
			href: 'https://youtu.be/X00wenuNgtc',
			photo: '/img/winner-2026.webp'
		},
		{
			year: '2025',
			name: 'Giselle Ferrao',
			talk: 'Rising Beyond Limits: The Power of Perspective',
			href: 'https://youtu.be/YOTD5AarNxw',
			photo: '/img/winner-2025-a.webp'
		},
		{
			year: '2025',
			name: 'Jyotisman Rath',
			talk: "What You Don't See is Definitely True!",
			href: 'https://youtu.be/fM4kM2u3znY',
			photo: '/img/winner-2025-b.webp'
		}
	];
</script>

<Seo
	title="Student Speaker Competition | TEDxPurdueU"
	{description}
	path="/speakers"
	image="/img/student-speaker-hero.webp"
	imageAlt="A Purdue student delivering a TEDxPurdueU talk on stage"
/>

<section class="hero section--ruled">
	<div class="hero-copy">
		<h1>Student Speaker Competition</h1>
		<p class="lede">
			Eight Purdue students took the stage, each with one idea to defend. Watch every talk. The
			winner goes on to speak at Unseen.
		</p>
		<div class="actions">
			<a class="btn btn--primary" href={playlistUrl} target="_blank" rel="noopener noreferrer">
				Watch all 8 talks
			</a>
			<a class="btn btn--outline" href="/2027-event">Unseen 2027</a>
		</div>
	</div>
	<div class="hero-media">
		<Placeholder
			ratio="4/3"
			src="/img/student-speaker-hero.webp"
			label="A student speaker on the Loeb Playhouse stage"
		/>
	</div>
</section>

<section class="sec section--ruled">
	<div class="talks-wrap">
		<div class="talks-head">
			<h2 class="sub-title">2026 Student Speaker Competition Participants</h2>
			<a class="link-rule" href={playlistUrl} target="_blank" rel="noopener noreferrer">
				Full playlist on YouTube
				<svg class="ext" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
			</a>
		</div>
		<div class="talks">
			{#each talks as talk (talk.href)}
				<article class="talk">
					<Placeholder
						ratio="4/5"
						src={talk.photo}
						label={talk.name}
						alt="{talk.name} giving their talk at the Student Speaker Competition"
					/>
					<div class="talk__copy">
						<h3 class="talk__name">{talk.name}</h3>
						<p class="talk__blurb">{talk.blurb}</p>
					</div>
					<a
						class="talk__cta"
						href={talk.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Watch the talk by {talk.name}"
					>
						<svg class="cta__play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
						Watch the talk
					</a>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="sec">
	<div class="winners-wrap">
		<h2 class="sub-title">Past winners</h2>
		<div class="winners">
			{#each winners as winner (winner.photo)}
				<article class="winner">
					<Placeholder
						ratio="4/3"
						src={winner.photo}
						label="{winner.year} winner"
						alt="The {winner.year} student speaker on stage"
					/>
					<div class="winner__year">{winner.year}</div>
					<h3 class="winner__name">{winner.name}</h3>
					<p class="winner__talk">{winner.talk}</p>
					<a class="winner__cta" href={winner.href} target="_blank" rel="noopener noreferrer">
						<svg class="cta__play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
						Watch the talk
					</a>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.hero {
		padding: var(--hero-top) var(--gutter) var(--section-y);
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
		gap: var(--space-7);
		align-items: center;
	}

	.hero-copy {
		display: flex;
		flex-direction: column;
		gap: var(--stack);
		min-width: 0;
	}

	.hero-copy .lede {
		max-width: 34em;
	}

	.actions {
		display: flex;
		gap: 14px;
		flex-wrap: wrap;
	}

	.hero-media {
		min-width: 0;
	}

	h1 {
		font-size: clamp(40px, 6.5vw, 86px);
		line-height: 0.98;
		letter-spacing: -0.03em;
		text-wrap: balance;
	}

	.sec {
		padding: var(--section-y) var(--gutter);
	}

	.winners-wrap {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.sub-title {
		font-size: clamp(24px, 2.8vw, 34px);
		letter-spacing: -0.02em;
	}

	/* ---- The eight talks ---------------------------------------------- */

	.talks-wrap {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.talks-head {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px 32px;
	}

	/* .link-rule is built for a column; in this row it sits on the heading's baseline. */
	.talks-head .link-rule {
		align-self: auto;
	}

	/* The "opens elsewhere" cue: a stroked arrow leaving a corner, in the link's colour. */
	.ext {
		width: 13px;
		height: 13px;
		margin-left: 4px;
		vertical-align: -1px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2.4;
		stroke-linecap: square;
	}

	/* Four across on desktop, two on a tablet, one on a phone: eight talks never leave a
	   short last row. */
	.talks {
		display: grid;
		grid-template-columns: 1fr;
		gap: 48px 28px;
	}

	@media (min-width: 560px) {
		.talks {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1000px) {
		.talks {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.talk {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.talk__copy {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
	}

	.talk__name {
		font-size: 20px;
		letter-spacing: -0.02em;
	}

	.talk__blurb {
		font-size: 15px;
		line-height: 1.5;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	/* ---- Past winners --------------------------------------------------- */

	/* Three winners: all in one row from tablet up, stacked on a phone. */
	.winners {
		display: grid;
		grid-template-columns: 1fr;
		gap: 32px;
	}

	@media (min-width: 700px) {
		.winners {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.winner {
		display: flex;
		flex-direction: column;
		gap: 12px;
		min-width: 0;
	}

	.winner__year {
		font-size: 13px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--text-faint);
		padding-top: 4px;
	}

	.winner__name {
		font-size: 20px;
		letter-spacing: -0.01em;
	}

	.winner__talk {
		font-size: 15px;
		line-height: 1.6;
		color: var(--text-dim);
	}

	/* A quiet text link rather than a filled button: a row of red slabs
	   overwhelmed the cards and the photos they sit under. */
	.winner__cta,
	.talk__cta {
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

	.winner__cta:hover,
	.talk__cta:hover {
		color: var(--red-accessible);
	}

	.cta__play {
		width: 15px;
		height: 15px;
		flex-shrink: 0;
		fill: var(--red);
	}
</style>
