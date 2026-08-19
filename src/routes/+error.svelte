<script>
	import { page } from '$app/state';

	const isNotFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{isNotFound ? 'Page not found' : 'Something went wrong'} | TEDxPurdueU</title>
</svelte:head>

<section class="error-page">
	<div class="error-inner">
		<div class="error-copy">
			<div class="eyebrow">Error {page.status}</div>
			<h1>{isNotFound ? 'Page not found.' : 'Something went wrong.'}</h1>
			<p class="lede">
				{isNotFound
					? "The page you're looking for isn't here."
					: (page.error?.message ?? 'Please try again in a moment.')}
			</p>
			<a class="btn btn--primary" href="/">Back to home</a>
		</div>

		{#if isNotFound}
			<img
				class="error-illustration"
				src="/illustrations/page-not-found.svg"
				alt="A document marked 404 under a red magnifying glass"
			/>
		{/if}
	</div>
</section>

<style>
	.error-page {
		padding: 10vh var(--gutter);
		border-bottom: 1px solid var(--rule);
	}

	.error-inner {
		max-width: 1180px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
		gap: clamp(40px, 7vw, 88px);
		align-items: center;
	}

	.error-copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 24px;
		min-width: 0;
	}

	h1 {
		font-size: clamp(44px, 7vw, 92px);
		line-height: 0.95;
		letter-spacing: -0.03em;
		text-wrap: balance;
	}

	.error-illustration {
		display: block;
		width: 100%;
		aspect-ratio: 10 / 7;
		border: 1px solid var(--border);
	}
</style>
