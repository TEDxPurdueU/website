<script>
	import { page } from '$app/state';
	import { pages } from '$lib/nav.js';

	/** @param {string} href */
	const isCurrent = (href) => page.url.pathname === href;
</script>

<header>
	<a href="/" class="logo" aria-label="TEDx Purdue U — home">
		<img src="/whitetext.png" alt="TEDx Purdue U" width="492" height="92" />
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
		background: rgba(13, 13, 13, 0.92);
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

	/* On narrow screens the logo keeps its row and the links wrap beneath it. */
	@media (max-width: 720px) {
		header {
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
		}

		nav {
			gap: 18px 20px;
		}
	}
</style>
