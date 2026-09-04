<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<div class="shell">
	<a class="skip-link" href="#main-content">Skip to main content</a>
	<Header />
	<main id="main-content" tabindex="-1">
		{@render children()}
	</main>
	<Footer />
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
