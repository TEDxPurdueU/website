<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	// /vision is a standalone read with its own logo, so it drops the site chrome.
	const standalone = $derived(page.url.pathname === '/vision');
</script>

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
		color: #fff;
		font-weight: 700;
		transform: translateY(-200%);
		transition: transform 0.15s ease;
	}

	.skip-link:focus-visible {
		transform: translateY(0);
	}

</style>
