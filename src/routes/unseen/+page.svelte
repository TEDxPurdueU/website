<script>
	import Placeholder from '$lib/components/Placeholder.svelte';

	// TODO: confirm the date and ticket status once they're locked in.
	const facts = [
		{ label: 'Date', value: 'Spring 2027 — TBA' },
		{ label: 'Venue', value: 'Purdue Memorial Union' },
		{ label: 'Tickets', value: 'On sale later this year' }
	];

	const questions = [
		{
			number: '01',
			title: 'Who is missing?',
			body: 'Labor, care, and expertise that hold systems up without appearing in them.'
		},
		{
			number: '02',
			title: "What can't we measure?",
			body: 'The limits of instruments, models, and the metrics we mistake for reality.'
		},
		{
			number: '03',
			title: 'What do we refuse to see?',
			body: 'Attention as a choice — and the cost of looking away on purpose.'
		}
	];

	const schedule = [
		{ time: 'Morning', detail: 'Doors, coffee, and Session I — three talks' },
		{ time: 'Midday', detail: 'Lunch, exhibits, and conversations with speakers' },
		{ time: 'Afternoon', detail: 'Session II — three talks and a performance' },
		{ time: 'Evening', detail: 'Closing talk and reception' }
	];

	// TODO: replace with real speaker portraits and names as they're announced.
	const speakerSlots = ['speaker 1', 'speaker 2', 'speaker 3'];
</script>

<svelte:head>
	<title>Unseen 2027 · TEDx Purdue U</title>
	<meta
		name="description"
		content="Unseen is the theme of the 2027 TEDx Purdue U annual conference — about what sits just outside our attention, and what changes the moment we look."
	/>
</svelte:head>

<section class="hero section--ruled">
	<div class="hero-inner">
		<div class="eyebrow">2027 Annual Conference · Theme</div>
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
		</div>
	</div>
</section>

<section class="sec section--ruled">
	<div class="questions-wrap">
		<h2 class="section-title">Three questions we're building the day around</h2>
		<div class="questions">
			{#each questions as question (question.number)}
				<div class="question">
					<div class="question-number">{question.number}</div>
					<h3>{question.title}</h3>
					<p class="question-body">{question.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="sec section--ruled">
	<div class="schedule-wrap">
		<h2 class="section-title">Day at a glance</h2>
		<div class="schedule">
			{#each schedule as slot (slot.time)}
				<div class="slot">
					<div class="slot-time">{slot.time}</div>
					<div class="slot-detail">{slot.detail}</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="sec">
	<div class="speakers-wrap">
		<div class="speakers-head">
			<h2 class="section-title">Speakers</h2>
			<span class="speakers-note">Announced on a rolling basis</span>
		</div>
		<div class="speakers">
			{#each speakerSlots as slot (slot)}
				<Placeholder ratio="3/4" label={slot} />
			{/each}
			<div class="open-slot">
				<span>
					Could be you —<br />
					<a href="/speakers">enter the competition</a>
				</span>
			</div>
		</div>
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
	}

	.theme-lede {
		max-width: 660px;
	}

	.facts {
		display: flex;
		gap: 40px;
		flex-wrap: wrap;
		padding-top: 12px;
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

	.questions-wrap {
		max-width: 1200px;
		display: flex;
		flex-direction: column;
		gap: 36px;
	}

	/* The 1px grid gap over a light border paints the hairline rules between
	   cells without doubling up at the edges. */
	.questions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1px;
		background: var(--border);
		border: 1px solid var(--border);
	}

	.question {
		background: var(--bg);
		padding: 34px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.question-number {
		font-size: 13px;
		color: var(--red);
		font-weight: 700;
	}

	.question h3 {
		font-size: 20px;
	}

	.question-body {
		font-size: 15px;
		line-height: 1.6;
		color: var(--text-dim);
	}

	.schedule-wrap {
		max-width: 900px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.schedule {
		display: flex;
		flex-direction: column;
	}

	.slot {
		display: flex;
		gap: 28px;
		padding: 20px 0;
		border-bottom: 1px solid var(--rule);
	}

	.slot:last-child {
		border-bottom: none;
	}

	.slot-time {
		min-width: 120px;
		font-size: 15px;
		color: var(--red);
		font-weight: 700;
	}

	.slot-detail {
		font-size: 16px;
		color: var(--text-muted);
	}

	.speakers-wrap {
		max-width: 1200px;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.speakers-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 24px;
		flex-wrap: wrap;
	}

	.speakers-note {
		font-size: 14px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.speakers {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 24px;
	}

	.open-slot {
		aspect-ratio: 3/4;
		border: 1px dashed var(--border-strong);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px;
		text-align: center;
	}

	.open-slot span {
		font-size: 14px;
		color: var(--text-faint);
		line-height: 1.5;
	}

	.open-slot a {
		font-weight: 700;
	}
</style>
