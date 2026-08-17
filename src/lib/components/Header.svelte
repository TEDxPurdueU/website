<script>
	import { page } from '$app/state';
	import { pages } from '$lib/nav.js';

	/** @param {string} href */
	const isCurrent = (href) => page.url.pathname === href;
</script>

<header>
	<a href="/" class="logo" aria-label="TEDxPurdueU — home">
		<img src="/logo-dark.png" alt="TEDxPurdueU" width="1275" height="240" />
	</a>
	<nav aria-label="Primary">
		{#each pages as item (item.href)}
			<a
				href={item.href}
				class="nav-link"
				class:active={isCurrent(item.href)}
				aria-current={isCurrent(item.href) ? 'page' : undefined}
			>
				{item.label}
			</a>
		{/each}
	</nav>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 32px;
		padding: 20px var(--gutter);
		background: rgba(250, 249, 248, 0.94);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--rule);
	}

	.logo {
		display: block;
		flex-shrink: 0;
	}

	.logo img {
		height: 34px;
		width: auto;
		display: block;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 28px;
		flex-wrap: wrap;
	}

	.nav-link {
		font-size: 13px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-muted);
		transition: color 0.15s ease;
	}

	.nav-link:hover,
	.nav-link.active {
		color: var(--red);
	}

	/* Logo plus the five links needs ~820px of viewport; below that the single
	   row wraps and strands a link, so the links move beneath the logo instead.
	   The bar is sticky, so everything tightens to keep it off a phone's
	   viewport — and the nav's row gap moves into the links themselves, which
	   buys taller tap targets at the same visual rhythm. */
	@media (max-width: 820px) {
		header {
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;
			padding: 14px var(--gutter);
		}

		.logo img {
			height: 28px;
		}

		nav {
			gap: 0 20px;
			margin-block: -8px;
		}

		.nav-link {
			padding: 8px 0;
		}
	}
</style>
