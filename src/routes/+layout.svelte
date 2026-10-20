<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { pageview, startAnalytics, track } from '$lib/analytics.js';
	import { rememberUtm, tagOutbound } from '$lib/utm.js';

	let { children } = $props();

	// /vision is a standalone read with its own logo, so it drops the site chrome.
	const standalone = $derived(page.url.pathname === '/vision');

	onMount(startAnalytics);

	// Runs on the first load and after every client-side navigation, so this one
	// callback is every page view. The tags are remembered first so a tagged
	// landing page carries them.
	afterNavigate(() => {
		rememberUtm();
		pageview();
	});

	/**
	 * Links to the forms and the YC page leave the site, so they get the visit's
	 * tags here instead of from their own page. Middle-click opens a new tab
	 * without a `click`, hence `auxclick`.
	 *
	 * @param {MouseEvent} event
	 */
	function onLinkClick(event) {
		if (event.button > 1) return;
		const destination = tagOutbound(event);
		if (!destination) return;
		const recorded = track('outbound_click', { destination }, true);
		const link = /** @type {Element} */ (event.target).closest('a[href]');
		// A same-tab click unloads the page, which can drop the event if PostHog is
		// still loading, so hold the click briefly (capped) like Redirect.svelte does.
		if (
			!(link instanceof HTMLAnchorElement) ||
			event.type !== 'click' ||
			event.button !== 0 ||
			event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
			(link.target && link.target !== '_self') ||
			link.hasAttribute('download')
		)
			return;
		event.preventDefault();
		const cap = new Promise((resolve) => setTimeout(resolve, 1200));
		Promise.race([recorded, cap]).then(() => location.assign(link.href));
	}
</script>

<svelte:document onclick={onLinkClick} onauxclick={onLinkClick} />

<div class="shell">
	<a class="skip-link" href="#main-content">Skip to main content</a>
	{#if !standalone}
		<Header />
	{/if}
	<main id="main-content" tabindex="-1">
		{@render children()}
	</main>
	{#if !standalone}
		<Footer />
	{/if}
</div>

<style>
	.shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--bg);
	}

	main {
		flex: 1;
		scroll-margin-top: 24px;
	}

	.skip-link {
		position: fixed;
		top: 12px;
		left: var(--gutter);
		z-index: 200;
		padding: 12px 16px;
		background: var(--text);
		color: var(--bg);
		font-weight: 700;
		transform: translateY(-200%);
		transition: transform 0.15s ease;
	}

	.skip-link:focus-visible {
		transform: translateY(0);
	}

</style>
