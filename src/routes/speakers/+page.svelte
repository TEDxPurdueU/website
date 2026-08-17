<script>
	import Placeholder from '$lib/components/Placeholder.svelte';

	const steps = [
		{
			step: 'Step 01',
			title: 'Apply',
			body: 'Submit your application.'
		},
		{
			step: 'Step 02',
			title: 'The competition',
			body: 'Selected students give a shortened version of their talk.'
		},
		{
			step: 'Step 03',
			title: 'Coaching',
			body: 'Winner gets mentored and coached by our team.'
		},
		{
			step: 'Step 04',
			title: 'The stage',
			body: 'The winner speaks at the conference, filmed for the TEDx channel.'
		}
	];

	const eligibility = [
		'Any currently enrolled Purdue undergraduate or graduate student',
		'Any discipline — engineering to art history'
	];

	const criteria = [
		'One clear idea, not a summary of a field',
		'Evidence you actually did the thinking',
		'A reason this audience should care today'
	];
</script>

<svelte:head>
	<title>TEDxPurdueU</title>
	<meta
		name="description"
		content="Every Purdue student can compete for a speaking slot at the TEDxPurdueU conference. Pitch an idea, get coached, and take the Unseen stage."
	/>
</svelte:head>

<section class="hero section--ruled">
	<div class="hero-copy">
		<h1>Student Speaker Competition</h1>
		<p class="lede">
			One slot on the Unseen stage goes to a student. You don't need a title, a lab, or a startup —
			you need one idea you can defend in six minutes.
		</p>
		<!-- TODO: once the application form exists, make this an <a href="…">
		     with the .btn .btn--primary classes so it becomes a real CTA. -->
		<div class="status-badge">Applications open soon</div>
	</div>
	<div class="hero-media">
		<Placeholder ratio="4/3" label="A student speaker mid-talk" />
	</div>
</section>

<section class="sec section--ruled">
	<div class="steps-wrap">
		<h2 class="sub-title">How it works</h2>
		<div class="steps">
			{#each steps as item (item.step)}
				<div class="step">
					<div class="step-label">{item.step}</div>
					<h3>{item.title}</h3>
					<p class="step-body">{item.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="band">
	<Placeholder ratio="16/6" label="Competition finalists on stage" />
</section>

<section class="sec">
	<div class="rules">
		<div class="rule-col">
			<h2>Who can enter</h2>
			<ul>
				{#each eligibility as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
		<div class="rule-col">
			<h2>What judges look for</h2>
			<ul>
				{#each criteria as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	.hero {
		padding: 10vh var(--gutter) 7vh;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 56px;
		align-items: center;
	}

	.hero-copy {
		display: flex;
		flex-direction: column;
		gap: 26px;
		min-width: 0;
	}

	.hero-media {
		min-width: 0;
	}

	/* Cinematic strip breaking the run of text between steps and rules. */
	.band {
		padding: 0 var(--gutter) 7vh;
	}

	h1 {
		font-size: clamp(40px, 6.5vw, 86px);
		line-height: 0.98;
		letter-spacing: -0.03em;
		text-wrap: balance;
	}

	/* Announcement, not a control — there's nowhere to send applicants yet. */
	.status-badge {
		align-self: flex-start;
		padding: 15px 30px;
		background: var(--red);
		color: #fff;
		font-size: 14px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-weight: 700;
	}

	.sec {
		padding: 7vh var(--gutter);
	}

	.steps-wrap {
		max-width: 1100px;
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.sub-title {
		font-size: clamp(24px, 2.8vw, 34px);
		letter-spacing: -0.02em;
	}

	.steps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
		gap: 36px;
	}

	.step {
		display: flex;
		flex-direction: column;
		gap: 12px;
		border-top: 3px solid var(--red);
		padding-top: 18px;
	}

	.step-label {
		font-size: 13px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.step h3 {
		font-size: 19px;
	}

	.step-body {
		font-size: 15px;
		line-height: 1.6;
		color: var(--text-dim);
	}

	.rules {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 48px;
		max-width: 1100px;
	}

	.rule-col {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.rule-col h2 {
		font-size: 24px;
		letter-spacing: -0.01em;
	}

	ul {
		margin: 0;
		padding-left: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		font-size: 16px;
		line-height: 1.6;
		color: var(--text-dim);
	}
</style>
