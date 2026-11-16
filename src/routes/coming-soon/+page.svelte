<script>
	import ComingSoon from '$lib/components/ComingSoon.svelte';
</script>

<svelte:head>
	<title>TEDxPurdueU</title>
	<meta name="description" content="This part of TEDxPurdueU isn't open yet — check back soon." />
	<!-- Nothing here to index; the page exists only as a landing spot for
	     links whose real destination doesn't exist yet. -->
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="sec">
	<div class="wrap">
		<div class="eyebrow">Not open yet</div>
		<h1 class="page-title">Coming soon</h1>
		<ComingSoon
			label="We're still building this"
			note="This part of the site isn't ready yet. Everything we've announced so far lives on the pages below."
		/>
		<div class="actions">
			<a class="btn btn--primary" href="/">Back to home</a>
			<a class="btn btn--outline" href="/2027-event">Unseen 2027</a>
		</div>
	</div>
</section>

<style>
	.sec {
		padding: var(--hero-top) var(--gutter) var(--section-y);
	}

	.wrap {
		max-width: var(--measure);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--stack);
	}

	.actions {
		display: flex;
		gap: var(--space-4);
		flex-wrap: wrap;
	}

	@media (max-width: 560px) {
		.actions {
			width: 100%;
		}

		.actions .btn {
			flex: 1 1 100%;
			text-align: center;
		}
	}
</style>
