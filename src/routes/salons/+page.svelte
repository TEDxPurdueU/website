<script>
	// TODO: fill in the real date once the fall salon is scheduled, and move
	// each salon into `past` after it happens.
	const upcoming = {
		when: 'Fall 2026 · date TBA',
		title: 'Salon 01 — Blind Spots',
		body: 'A warm-up for Unseen: two students on what their field systematically fails to notice, then open discussion.',
		status: 'RSVP soon'
	};

	const past = [
		{
			term: 'Spring 2026',
			title: 'Attention, for sale',
			body: 'Screening + discussion on the economics of what we look at.'
		},
		{
			term: 'Fall 2025',
			title: 'Failing in public',
			body: "Three researchers on experiments that didn't work."
		},
		{
			term: 'Spring 2025',
			title: 'The city we walk past',
			body: 'A walking salon through West Lafayette with an urban planning student.'
		}
	];
</script>

<svelte:head>
	<title>Salons · TEDx Purdue U</title>
	<meta
		name="description"
		content="Salons are TEDx Purdue U's mini-events: one idea, one small room, one long conversation. Free and open to everyone at Purdue."
	/>
</svelte:head>

<section class="hero section--ruled">
	<div class="hero-inner">
		<div class="eyebrow">Between conferences</div>
		<h1 class="page-title">Salons</h1>
		<p class="lede">
			Our mini-events. One idea, one small room, one long conversation — usually a short talk or a
			TED screening, then discussion over food. Free, open to everyone at Purdue, no ticket needed.
		</p>
	</div>
</section>

<section class="sec section--ruled">
	<div class="wrap">
		<h2 class="list-heading">Upcoming</h2>
		<div class="card">
			<div class="card-copy">
				<div class="card-when">{upcoming.when}</div>
				<h3>{upcoming.title}</h3>
				<p class="body-text">{upcoming.body}</p>
			</div>
			<div class="card-status">{upcoming.status}</div>
		</div>
	</div>
</section>

<section class="sec">
	<div class="wrap">
		<h2 class="list-heading">Past salons</h2>
		<div class="past">
			{#each past as salon (salon.title)}
				<div class="past-row">
					<div class="past-term">{salon.term}</div>
					<div class="past-copy">
						<div class="past-title">{salon.title}</div>
						<div class="past-body">{salon.body}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.hero {
		padding: 10vh var(--gutter) 7vh;
	}

	.hero-inner {
		max-width: 900px;
		display: flex;
		flex-direction: column;
		gap: 26px;
	}

	.sec {
		padding: 7vh var(--gutter);
	}

	.wrap {
		max-width: 1100px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.list-heading {
		font-size: 22px;
		letter-spacing: 0.02em;
	}

	.card {
		border: 1px solid var(--red);
		padding: 36px;
		display: flex;
		flex-wrap: wrap;
		gap: 32px;
		justify-content: space-between;
		align-items: center;
	}

	.card-copy {
		display: flex;
		flex-direction: column;
		gap: 10px;
		max-width: 600px;
	}

	.card-when {
		font-size: 13px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--red);
	}

	.card h3 {
		font-size: 26px;
		letter-spacing: -0.01em;
	}

	/* A status badge, not a button — there's nothing to click until RSVPs open. */
	.card-status {
		padding: 14px 26px;
		background: var(--red);
		color: #fff;
		font-size: 13px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-weight: 700;
	}

	.past {
		display: flex;
		flex-direction: column;
	}

	.past-row {
		display: flex;
		gap: 28px;
		padding: 22px 0;
		border-top: 1px solid var(--rule);
		flex-wrap: wrap;
	}

	.past-row:last-child {
		border-bottom: 1px solid var(--rule);
	}

	.past-term {
		min-width: 150px;
		font-size: 14px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.past-copy {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.past-title {
		font-size: 18px;
		font-weight: 700;
	}

	.past-body {
		font-size: 15px;
		color: var(--text-dim);
	}
</style>
