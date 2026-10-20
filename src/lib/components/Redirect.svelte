<script>
	import { onMount } from 'svelte';
	import { boundedWait, track } from '$lib/analytics.js';
	import { rememberUtm, withUtm } from '$lib/utm.js';

	/**
	 * A short link. The site is prerendered with no server runtime, so there is
	 * nowhere to send a real 3xx from; this is the host-agnostic stand-in. The
	 * meta refresh covers crawlers and no-JS visitors, `location.replace` covers
	 * everyone else, and the visible link covers the case where both are blocked.
	 * Everyone else is first recorded and handed their UTM tags, so a tagged flyer
	 * link shows up in analytics and the tags carry on to the destination.
	 *
	 * `what` names the destination: "application form", "event page" ...
	 *
	 * @type {{ url: string, what: string }}
	 */
	let { url, what } = $props();

	/** The destination with this visit's tags; known only once we are in the browser. */
	let tagged = $state('');

	// `replace`, not `assign`, so Back returns the reader where they came from
	// instead of bouncing them through the redirect again.
	onMount(() => {
		rememberUtm();
		const destination = withUtm(url);
		tagged = destination;
		let left = false;
		const recorded = track('redirect', { destination: url, path: location.pathname }, true);
		boundedWait(recorded).then(() => {
			if (!left) location.replace(destination);
		});
		// If the reader picks another page first (the header's home link), that wins.
		return () => (left = true);
	});
</script>

<svelte:head>
	<title>Taking you to the {what} | TEDxPurdueU</title>
	<meta name="description" content="Redirecting to the {what}." />
	<!-- Only for crawlers and no-JS visitors. It must outlast the JS path above (which
	     records the visit, then leaves within MAX_WAIT_MS), or the page is gone before
	     the tags are saved and the destination never sees them. -->
	<meta http-equiv="refresh" content="3; url={url}" />
	<!-- Nothing to index here: the page is a signpost, not a destination. -->
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="sec">
	<div class="wrap">
		<div class="eyebrow">Redirecting</div>
		<h1 class="page-title">Taking you to the {what}</h1>
		<p class="lede">If nothing happens in a moment, open the {what} directly.</p>
		<a class="btn btn--primary" href={tagged || url}>Open the {what}</a>
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
