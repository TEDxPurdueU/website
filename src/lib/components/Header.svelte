<script>
	import { page } from '$app/state';
	import { applicationOpen, applicationUrl, pages, socials } from '$lib/nav.js';

	/** @param {string} href */
	const isCurrent = (href) => page.url.pathname === href;

	/**
	 * Read once per render rather than from a module constant: the site is
	 * prerendered, so this is evaluated on the build machine for the served
	 * HTML and again in the browser when that HTML hydrates. The second read is
	 * the one that counts — a build that predates the deadline still stops
	 * offering the form once the reader's own clock passes it.
	 */
	const joinOpen = applicationOpen();

	/**
	 * Below the breakpoint the link row is replaced by a toggle that reveals a
	 * full-height panel. Four links do not need a scrolling drawer or a scrim —
	 * an opaque sheet that fills everything under the sticky bar reads as one
	 * deliberate slab, and leaves the logo and the X in place above it.
	 */
	let open = $state(false);

	/** Measured so the panel starts exactly at the sticky bar's bottom rule. */
	let headerHeight = $state(0);

	/** @type {HTMLButtonElement | undefined} */
	let toggle = $state();
	/** @type {HTMLElement | undefined} */
	let menu = $state();

	const pathname = $derived(page.url.pathname);

	/**
	 * Client-side routing never reloads the page, so a panel left open would sit
	 * on top of the destination. Depending on the pathname is what subscribes
	 * this effect to navigation — a menu link, the logo, a back gesture.
	 * Links also close on click, which covers tapping the current page (where
	 * the pathname never changes).
	 */
	$effect(() => {
		if (pathname) open = false;
	});

	/**
	 * A viewport that grows past the breakpoint hides the toggle, so anything
	 * left open would strand the reader behind a panel with no visible close.
	 */
	$effect(() => {
		const desktop = window.matchMedia('(min-width: 1025px)');
		/** @param {MediaQueryListEvent} event */
		const onChange = (event) => {
			if (event.matches) open = false;
		};
		desktop.addEventListener('change', onChange);
		return () => desktop.removeEventListener('change', onChange);
	});

	// Effects only run in the browser, so `document` is safe here on a
	// prerendered build.
	$effect(() => {
		if (!open) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		// Landing on the first link rather than the panel keeps the focus ring
		// meaningful and puts the reader straight into the set.
		menu?.querySelector('a')?.focus();

		return () => {
			document.body.style.overflow = previousOverflow;
			toggle?.focus();
		};
	});

	/**
	 * Bound to the window rather than the panel so Escape still works if a tap
	 * drops focus to the body.
	 * @param {KeyboardEvent} event
	 */
	function onKeydown(event) {
		if (!open) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			open = false;
			return;
		}
		if (event.key !== 'Tab' || !menu || !toggle) return;

		// The toggle is the panel's own close control and sits immediately before
		// it in the DOM, so it belongs inside the ring — trapping the links alone
		// would leave a keyboard user with no way back to the X.
		const stops = [toggle, ...Array.from(menu.querySelectorAll('a'))];
		const first = stops[0];
		const last = stops[stops.length - 1];
		const active = document.activeElement;
		const inside = stops.some((stop) => stop === active);

		if (event.shiftKey && (active === first || !inside)) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && (active === last || !inside)) {
			event.preventDefault();
			first.focus();
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

<header bind:offsetHeight={headerHeight}>
	<a href="/" class="logo" aria-label="TEDxPurdueU — home">
		<img src="/logo-dark.png" alt="TEDxPurdueU" width="1275" height="240" />
	</a>
	<nav class="nav" aria-label="Primary">
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
	<div class="actions">
		<div class="socials">
			{#each socials as social (social.name)}
				<a
					href={social.href}
					class="social"
					target="_blank"
					rel="noopener noreferrer"
					aria-label={social.name}
				>
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d={social.icon} /></svg>
				</a>
			{/each}
		</div>
		{#if joinOpen}
			<a
				class="join"
				href={applicationUrl}
				target="_blank"
				rel="noopener noreferrer"
			>
				Join
			</a>
		{/if}
		<button
			type="button"
			class="toggle"
			aria-label="Menu"
			aria-expanded={open}
			aria-controls="site-menu"
			onclick={() => (open = !open)}
			bind:this={toggle}
		>
			<span class="toggle__bars" aria-hidden="true">
				<span></span>
				<span></span>
			</span>
		</button>
	</div>
</header>

<!-- Always rendered so `aria-controls` resolves; `display: none` keeps it out of
     the accessibility tree, and `inert` stops it taking focus either way. -->
<nav
	id="site-menu"
	class="menu"
	class:menu--open={open}
	aria-label="Menu"
	inert={!open}
	style:top="{headerHeight}px"
	bind:this={menu}
>
	{#each pages as item, i (item.href)}
		<a
			href={item.href}
			class="menu__link"
			class:active={isCurrent(item.href)}
			aria-current={isCurrent(item.href) ? 'page' : undefined}
			onclick={() => (open = false)}
		>
			<span class="menu__index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
			<span>{item.label}</span>
		</a>
	{/each}

	<div class="menu__socials">
		{#each socials as social (social.name)}
			<a
				href={social.href}
				class="menu__social"
				target="_blank"
				rel="noopener noreferrer"
				aria-label={social.name}
				onclick={() => (open = false)}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d={social.icon} /></svg>
			</a>
		{/each}
	</div>
</nav>

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

	.nav {
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
		color: var(--red-accessible);
	}

	/* The right-hand group. Holding the social set and the toggle together
	   keeps the bar a three-part row at every width, so the two never have to
	   negotiate for the same slot. */
	.actions {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-shrink: 0;
	}

	/* A hairline in front of the set is what makes three marks in the bar read
	   as their own group rather than as more nav. */
	.socials {
		display: flex;
		align-items: center;
		padding-left: 14px;
		border-left: 1px solid var(--rule);
	}

	/* The breathing room lives in each link's padding rather than in a gap, so
	   every mark has a real pointer target while the set still reads as one
	   cluster. */
	.social {
		display: inline-flex;
		padding: 8px;
		color: var(--text);
		transition: color 0.15s ease;
	}

	.social:hover {
		color: var(--red);
	}

	/* currentColor carries the link colour and its hover into the glyph. */
	.social svg {
		width: 20px;
		height: 20px;
		display: block;
		fill: currentColor;
	}

	/* Shorter and tighter than the page buttons: it has to hold its own beside
	   the logo on a 320px phone, where the full .btn padding would not fit. */
	.join {
		flex-shrink: 0;
		padding: 12px 18px;
		background: var(--red-accessible);
		color: #fff;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		white-space: nowrap;
		transition: background-color 0.15s ease;
	}

	.join:hover {
		background: var(--text);
		color: #fff;
	}

	/* Hairline square, same control language as the lightbox buttons. */
	.toggle {
		display: none;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		flex-shrink: 0;
		padding: 0;
		background: none;
		border: 1px solid var(--border-strong);
		color: var(--text);
		cursor: pointer;
		transition:
			color 0.15s ease,
			border-color 0.15s ease;
	}

	.toggle:hover,
	.toggle[aria-expanded='true'] {
		color: var(--red);
		border-color: var(--red);
	}

	.toggle__bars {
		position: relative;
		display: block;
		width: 20px;
		height: 12px;
	}

	/* Two bars, not three: they meet in the middle and cross into the X, so the
	   glyph morphs rather than swaps. */
	.toggle__bars span {
		position: absolute;
		left: 0;
		width: 100%;
		height: 2px;
		background: currentColor;
		transition: transform 0.25s ease;
	}

	.toggle__bars span:first-child {
		top: 0;
	}

	.toggle__bars span:last-child {
		bottom: 0;
	}

	.toggle[aria-expanded='true'] .toggle__bars span:first-child {
		transform: translateY(5px) rotate(45deg);
	}

	.toggle[aria-expanded='true'] .toggle__bars span:last-child {
		transform: translateY(-5px) rotate(-45deg);
	}

	/* Sits under the sticky bar (z-index 50) so the logo and the X stay live and
	   the bar's rule reads as the panel's top edge. `top` is set inline from the
	   measured header height. */
	.menu {
		display: none;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 40;
		flex-direction: column;
		padding: 4px var(--gutter) calc(var(--gutter) + 20px);
		background: var(--bg);
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.menu__link {
		display: flex;
		align-items: baseline;
		gap: 16px;
		min-height: 44px;
		padding: 20px 0;
		border-bottom: 1px solid var(--rule);
		color: var(--text);
		font-size: clamp(26px, 8vw, 40px);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
		text-transform: uppercase;
		transition: color 0.15s ease;
	}

	.menu__link:hover,
	.menu__link.active {
		color: var(--red-accessible);
	}

	/* Bigger than the bar's set and sized for thumbs: the panel has the room,
	   and these are the only social links a phone reader is offered. */
	.menu__socials {
		display: flex;
		align-items: center;
		margin-top: 24px;
		margin-inline: -12px;
	}

	.menu__social {
		display: inline-flex;
		padding: 12px;
		color: var(--text);
		transition: color 0.15s ease;
	}

	.menu__social:hover {
		color: var(--red);
	}

	.menu__social svg {
		width: 26px;
		height: 26px;
		display: block;
		fill: currentColor;
	}

	.menu__index {
		flex-shrink: 0;
		font-family: var(--mono);
		font-size: 12px;
		font-weight: 400;
		letter-spacing: 0.08em;
		color: var(--text-faint);
	}

	/* Between the breakpoint and roughly 1200px the row fits, but only just.
	   Tightening every gap there keeps the full bar on small laptops instead of
	   spending another 175px of viewport on the hamburger. */
	@media (min-width: 1025px) and (max-width: 1200px) {
		header {
			gap: 18px;
		}

		.nav {
			gap: 14px;
		}

		.actions {
			gap: 12px;
		}

		.socials {
			padding-left: 10px;
		}

		.social {
			padding: 6px;
		}

		.join {
			padding: 11px 15px;
		}
	}

	/* The logo, the five links and the social set need ~1025px of viewport;
	   below that the single row wraps and strands a link, so the links and the
	   social set move into the panel and the bar keeps the logo and the
	   toggle. */
	@media (max-width: 1024px) {
		header {
			/* 44px control plus 8px either side — a tighter bar than the two-row
			   stack this replaces, which is the point. */
			padding: 8px var(--gutter);
			/* The desktop gap is generous because it separates the logo from a
			   link row; here it only has to separate two controls, and on a
			   320px phone the logo, the CTA and the toggle need every pixel of
			   the difference. */
			gap: 12px;
		}

		.actions {
			gap: 10px;
		}

		.logo img {
			height: 28px;
		}

		.nav {
			display: none;
		}

		/* No room beside the logo, the CTA and the toggle, and the panel already
		   carries the set at a size worth tapping. */
		.socials {
			display: none;
		}

		/* The CTA stays out of the panel: it is the one time-limited thing in
		   the bar, so it should not need a tap to find. */
		.join {
			padding: 11px 13px;
			font-size: 11px;
		}

		.toggle {
			display: inline-flex;
		}

		.menu--open {
			display: flex;
			animation: menu-in 0.25s ease;
		}

		/* Links arrive just behind the panel, top to bottom. */
		.menu--open .menu__link {
			animation: menu-link-in 0.25s ease backwards;
		}

		.menu--open .menu__link:nth-child(1) {
			animation-delay: 0.03s;
		}

		.menu--open .menu__link:nth-child(2) {
			animation-delay: 0.07s;
		}

		.menu--open .menu__link:nth-child(3) {
			animation-delay: 0.11s;
		}

		.menu--open .menu__link:nth-child(4) {
			animation-delay: 0.15s;
		}

		.menu--open .menu__link:nth-child(5) {
			animation-delay: 0.19s;
		}

		.menu--open .menu__socials {
			animation: menu-link-in 0.25s ease backwards;
			animation-delay: 0.23s;
		}
	}

	@keyframes menu-in {
		from {
			opacity: 0;
		}
	}

	@keyframes menu-link-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}

	/* The global block neutralises durations but not delays, which would leave
	   the links blank for a beat. */
	@media (prefers-reduced-motion: reduce) {
		.menu--open .menu__link,
		.menu--open .menu__socials {
			animation-delay: 0s !important;
		}
	}
</style>
