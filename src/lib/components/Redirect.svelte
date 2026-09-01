<script>
	import { onMount } from 'svelte';

	/**
	 * A short link. The site is prerendered with no server runtime, so there is
	 * nowhere to send a real 3xx from; this is the host-agnostic stand-in. The
	 * meta refresh covers crawlers and no-JS visitors, `location.replace` covers
	 * everyone else, and the visible link covers the case where both are blocked.
	 *
	 * @type {{ url: string, title: string, heading: string, what: string }}
	 */
	let { url, title, heading, what } = $props();

	// `replace`, not `assign`, so Back returns the reader where they came from
	// instead of bouncing them through the redirect again.
	onMount(() => {
		location.replace(url);
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content="Redirecting to the {what}." />
	<meta http-equiv="refresh" content="0; url={url}" />
	<!-- Nothing to index here: the page is a signpost, not a destination. -->
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="sec">
	<div class="wrap">
		<div class="eyebrow">Redirecting</div>
		<h1 class="page-title">{heading}</h1>
		<p class="lede">If nothing happens in a moment, open the form directly.</p>
		<a class="btn btn--primary" href={url}>Open the {what}</a>
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
