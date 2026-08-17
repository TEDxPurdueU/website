<script>
	const facts = [
		{ label: 'Date', value: '27 February 2027' },
		{ label: 'Venue', value: 'Loeb Playhouse' },
		{ label: 'Tickets', value: 'On sale now' }
	];

	// TODO: point these at the real ticketing page and nomination form.
	const ticketsUrl = '#';
	const nominateUrl = '#';
</script>

<svelte:head>
	<title>TEDxPurdueU</title>
	<meta
		name="description"
		content="Unseen is the theme of the 2027 TEDxPurdueU annual conference — about what sits just outside our attention, and what changes the moment we look."
	/>
</svelte:head>

<section class="hero section--ruled">
	<div class="hero-inner">
		<h1>Unseen</h1>
		<p class="lede theme-lede">
			The work nobody claps for. The data we never collected. The people in the room who were never
			asked. Unseen is about what sits just outside our attention — and what changes the moment we
			look.
		</p>
		<div class="facts">
			{#each facts as fact (fact.label)}
				<div class="fact">
					<div class="label">{fact.label}</div>
					<div class="fact-value">{fact.value}</div>
				</div>
			{/each}
			<a class="btn btn--primary tickets" href={ticketsUrl}>Get tickets now</a>
		</div>
	</div>
</section>

<section class="sec section--ruled">
	<div class="speakers-wrap">
		<h2 class="section-title">Speakers</h2>
		<p class="coming-soon">Coming soon.</p>
		<p class="speakers-pitch">
			Know someone with an idea worth spreading — or is it you? Put a name forward, and if
			you're a Purdue student, take your shot at the stage through our competition.
		</p>
		<div class="speaker-actions">
			<a class="btn btn--primary" href={nominateUrl}>Nominate a speaker</a>
			<a class="btn btn--outline" href="/speakers">Students: enter the competition</a>
		</div>
	</div>
</section>

<section class="sec">
	<div class="schedule-wrap">
		<h2 class="section-title">Timeline</h2>
		<p class="coming-soon">Coming soon.</p>
	</div>
</section>

<style>
	.hero {
		padding: 10vh var(--gutter) 8vh;
	}

	.hero-inner {
		max-width: 1150px;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	h1 {
		font-size: clamp(72px, 17vw, 240px);
		line-height: 0.82;
		letter-spacing: -0.05em;
		text-transform: uppercase;
		color: var(--red);
		/* Optical correction: the U's left side bearing would otherwise sit the
		   word visibly right of the copy beneath it. Em-relative so it tracks
		   the clamped size. */
		margin-left: -0.05em;
	}

	.theme-lede {
		max-width: 660px;
	}

	.facts {
		display: flex;
		gap: 40px;
		flex-wrap: wrap;
		align-items: center;
		padding-top: 12px;
	}

	/* Sits on the same row as the date/venue/tickets facts, pushed to the end. */
	.tickets {
		margin-left: auto;
	}

	@media (max-width: 720px) {
		.tickets {
			margin-left: 0;
		}
	}

	.fact {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.fact-value {
		font-size: 18px;
		font-weight: 700;
	}

	.sec {
		padding: 8vh var(--gutter);
	}

	.schedule-wrap {
		max-width: 900px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.coming-soon {
		font-size: 17px;
		color: var(--text-faint);
	}

	.speakers-wrap {
		max-width: 900px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.speakers-pitch {
		font-size: 17px;
		line-height: 1.7;
		color: var(--text-dim);
		max-width: 60ch;
		text-wrap: pretty;
	}

	/* Stacked so the general nomination reads as the primary route and the
	   student competition as the follow-on. */
	.speaker-actions {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 14px;
		padding-top: 4px;
	}
</style>
