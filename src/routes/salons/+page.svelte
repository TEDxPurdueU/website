<script>
	import Placeholder from '$lib/components/Placeholder.svelte';

	// TODO: drop the salon photos into static/ and set `src` on each entry.
	const past = [
		{
			term: 'Spring 2026',
			title: 'Attention, for sale',
			body: 'Screening + discussion on the economics of what we look at.',
			photo: 'Attention, for sale'
		},
		{
			term: 'Fall 2025',
			title: 'Failing in public',
			body: "Three researchers on experiments that didn't work.",
			photo: 'Failing in public'
		},
		{
			term: 'Spring 2025',
			title: 'The city we walk past',
			body: 'A walking salon through West Lafayette with an urban planning student.',
			photo: 'The city we walk past'
		}
	];
</script>

<svelte:head>
	<title>Salons · TEDxPurdueU</title>
	<meta
		name="description"
		content="Salons are TEDxPurdueU's mini-events: one idea, one small room, one long conversation. Free and open to everyone at Purdue."
	/>
</svelte:head>

<section class="hero section--ruled">
	<div class="hero-copy">
		<h1 class="page-title">Salons</h1>
		<p class="lede">
			Our mini-events. One idea, one small room, one long conversation — usually a short talk or a
			TED screening, then discussion over food. Free, open to everyone at Purdue, no ticket needed.
		</p>
	</div>
	<div class="hero-media">
		<Placeholder ratio="4/3" label="A salon in progress" />
		<div class="hero-tile">
			<div class="hero-tile__label">Always</div>
			<div class="hero-tile__value">Free</div>
			<div class="hero-tile__meta">No ticket needed</div>
		</div>
	</div>
</section>

<section class="sec section--ruled">
	<div class="wrap">
		<h2 class="list-heading">Upcoming</h2>
		<p class="coming-soon">Coming soon.</p>
	</div>
</section>

<section class="sec">
	<div class="wrap">
		<h2 class="list-heading">Past salons</h2>
		<div class="past">
			{#each past as salon (salon.title)}
				<article class="salon">
					<Placeholder ratio="4/3" label={salon.photo} />
					<div class="salon__term">{salon.term}</div>
					<h3 class="salon__title">{salon.title}</h3>
					<p class="salon__body">{salon.body}</p>
				</article>
			{/each}
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
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 16px;
		min-width: 0;
	}

	/* Red tile carrying the one fact that matters most about a salon. */
	.hero-tile {
		background: var(--red);
		color: #fff;
		padding: 22px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 16px;
		min-width: 0;
		overflow: hidden;
	}

	.hero-tile__label {
		font-size: 12px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		opacity: 0.85;
	}

	.hero-tile__value {
		font-size: clamp(28px, 3vw, 44px);
		font-weight: 700;
		line-height: 0.95;
		letter-spacing: -0.03em;
		text-transform: uppercase;
	}

	.hero-tile__meta {
		font-size: 13px;
		letter-spacing: 0.06em;
		opacity: 0.9;
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

	.coming-soon {
		font-size: 17px;
		color: var(--text-faint);
	}

	.past {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 32px;
	}

	.salon {
		display: flex;
		flex-direction: column;
		gap: 12px;
		min-width: 0;
	}

	.salon__term {
		font-size: 13px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--text-faint);
		padding-top: 4px;
	}

	.salon__title {
		font-size: 20px;
		letter-spacing: -0.01em;
	}

	.salon__body {
		font-size: 15px;
		line-height: 1.6;
		color: var(--text-dim);
	}
</style>
