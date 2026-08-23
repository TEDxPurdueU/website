<script>
	import ComingSoon from '$lib/components/ComingSoon.svelte';
	import Placeholder from '$lib/components/Placeholder.svelte';
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
	<div class="hero-media">
		<Placeholder ratio="4/3" src="/img/salon.webp" label="A salon in session" />
	</div>
</section>

<section class="sec">
	<div class="wrap">
		<h2 class="list-heading">Upcoming</h2>
		<ComingSoon />
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
</style>
