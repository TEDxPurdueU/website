<script>
	import { onMount } from 'svelte';
	import { applicationUrl } from '$lib/nav.js';

	// The site is prerendered with no server runtime, so there is nowhere to send
	// a real 3xx from. This page is the host-agnostic stand-in: the meta refresh
	// below covers crawlers and no-JS visitors, and this covers everyone else,
	// replacing the history entry so Back returns where the reader came from
	// instead of bouncing them through the redirect again.
	onMount(() => {
		location.replace(applicationUrl);
	});
</script>

<svelte:head>
	<title>Apply to join TEDxPurdueU</title>
	<meta name="description" content="Redirecting to the TEDxPurdueU application form." />
	<meta http-equiv="refresh" content="0; url={applicationUrl}" />
	<!-- Nothing to index here: the page is a signpost, not a destination. -->
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="sec">
	<div class="wrap">
		<div class="eyebrow">Redirecting</div>
		<h1 class="page-title">Taking you to the application</h1>
		<p class="lede">If nothing happens in a moment, open the form directly.</p>
		<a class="btn btn--primary" href={applicationUrl}>Open the application form</a>
	</div>
</section>

<style>
	.sec {
		padding: 10vh var(--gutter);
	}

	.wrap {
		max-width: 900px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 26px;
	}
</style>
