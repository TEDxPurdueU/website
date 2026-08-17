<script>
	import ComingSoon from '$lib/components/ComingSoon.svelte';
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
	<title>TEDxPurdueU</title>
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
	<div class="hero-media illustration-frame">
		<img
			src="/illustrations/salon-conversation.svg"
			alt="Four people exchanging ideas around a table"
		/>
	</div>
</section>

<section class="sec section--ruled">
	<div class="wrap">
		<h2 class="list-heading">Upcoming</h2>
		<ComingSoon />
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
		grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
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

	.illustration-frame {
		border: 1px solid var(--border);
	}

	.illustration-frame img {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
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

	.past {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
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
