<script>
	import Placeholder from '$lib/components/Placeholder.svelte';

	const pillars = [
		{
			title: 'The annual conference',
			body: 'A full day of talks from students, faculty, alumni, and guests — one theme, eight speakers, one room of people who want to be changed by an idea.'
		},
		{
			title: 'Salons',
			body: 'Smaller evening gatherings through the semester: one short talk or screening, then a conversation that runs as long as it needs to.'
		},
		{
			title: 'Student Speaker Competition',
			body: 'Every Purdue student gets a shot at the stage. Pitch an idea, get coached, and compete for a speaking slot at the conference.'
		}
	];

	const stats = [
		{ value: '8', label: 'Speakers per conference' },
		{ value: '400', label: 'Seats in the room' },
		{ value: '30+', label: 'Student organizers' },
		{ value: '4', label: 'Salons each year' }
	];
</script>

<svelte:head>
	<title>TEDx Purdue U</title>
	<meta
		name="description"
		content="TEDx Purdue U is a student-run organization at Purdue University that curates one independently organized TED event each year, plus salons and a student speaker competition."
	/>
</svelte:head>

<section class="hero section--ruled">
	<div class="hero-inner">
		<div class="eyebrow">West Lafayette, Indiana</div>
		<h1>Ideas worth spreading, <span class="accent">Purdue built</span>.</h1>
		<p class="lede hero-lede">
			We are a student-run organization that curates one independently organized TED event each
			year, plus salons and a speaker competition that give the Purdue community a stage for its
			boldest thinking.
		</p>
		<div class="actions">
			<a class="btn btn--primary" href="/unseen">Unseen 2027</a>
			<a class="btn btn--outline" href="/speakers">Speak on our stage</a>
		</div>
	</div>
</section>

<section class="section section--ruled">
	<div class="pillars">
		{#each pillars as pillar (pillar.title)}
			<div class="pillar">
				<div class="tick"></div>
				<h3>{pillar.title}</h3>
				<p class="body-text">{pillar.body}</p>
			</div>
		{/each}
	</div>
</section>

<section class="section section--ruled">
	<div class="stats">
		{#each stats as stat (stat.label)}
			<div class="stat">
				<div class="stat-value">{stat.value}</div>
				<div class="stat-label">{stat.label}</div>
			</div>
		{/each}
	</div>
</section>

<section class="section">
	<div class="explainer">
		<div class="explainer-copy">
			<h2>What TEDx means</h2>
			<p class="explainer-body">
				In the spirit of ideas worth spreading, TEDx is a program of local, self-organized events
				that bring people together to share a TED-like experience. Ours is run entirely by Purdue
				students, under license from TED.
			</p>
			<a class="link-rule" href="/team">Meet the team</a>
		</div>
		<Placeholder ratio="4/3" label="photo — audience at last year's conference" />
	</div>
</section>

<style>
	.hero {
		padding: 12vh var(--gutter) 10vh;
	}

	.hero-inner {
		max-width: 1100px;
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	h1 {
		font-size: clamp(44px, 7vw, 104px);
		line-height: 0.95;
		letter-spacing: -0.03em;
		text-wrap: balance;
	}

	.accent {
		color: var(--red);
	}

	.hero-lede {
		max-width: 620px;
		line-height: 1.6;
	}

	.actions {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
		padding-top: 8px;
	}

	.pillars {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 48px;
		max-width: 1200px;
	}

	.pillar {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.pillar h3 {
		font-size: 22px;
		letter-spacing: -0.01em;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 40px;
		max-width: 1200px;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.stat-value {
		font-size: clamp(38px, 4vw, 58px);
		font-weight: 700;
		color: var(--red);
		letter-spacing: -0.03em;
	}

	.stat-label {
		font-size: 14px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.explainer {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 56px;
		align-items: center;
		max-width: 1200px;
	}

	.explainer-copy {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.explainer-copy h2 {
		font-size: clamp(28px, 3.4vw, 44px);
		line-height: 1.1;
		letter-spacing: -0.02em;
	}

	.explainer-body {
		font-size: 17px;
		line-height: 1.7;
		color: var(--text-dim);
		text-wrap: pretty;
	}
</style>
