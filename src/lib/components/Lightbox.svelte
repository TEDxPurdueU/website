<script>
	import Placeholder from './Placeholder.svelte';

	/**
	 * Modal photo viewer for the gallery.
	 *
	 * It navigates the whole gallery, not the page of thumbnails it was opened
	 * from, so the pagination never traps the reader mid-set.
	 */
	/**
	 * @type {{
	 *   photos: { label: string, src?: string, alt?: string }[],
	 *   index: number,
	 *   onclose: () => void,
	 *   onnavigate: (index: number) => void
	 * }}
	 */
	let { photos, index, onclose, onnavigate } = $props();

	/** @type {HTMLDivElement | undefined} */
	let dialog = $state();
	/** @type {HTMLButtonElement | undefined} */
	let closeButton = $state();

	const photo = $derived(photos[index]);

	function prev() {
		onnavigate((index - 1 + photos.length) % photos.length);
	}

	function next() {
		onnavigate((index + 1) % photos.length);
	}

	/**
	 * Escape / arrows are bound to the window rather than the dialog so they keep
	 * working even if a click lands somewhere that drops focus to the body.
	 * @param {KeyboardEvent} event
	 */
	function onKeydown(event) {
		if (event.key === 'Escape') {
			event.preventDefault();
			onclose();
			return;
		}
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			prev();
			return;
		}
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			next();
			return;
		}
		if (event.key !== 'Tab' || !dialog) return;

		// Every focusable in the dialog is a button, so this is the whole ring.
		const stops = Array.from(dialog.querySelectorAll('button'));
		if (stops.length === 0) return;

		const first = stops[0];
		const last = stops[stops.length - 1];
		const active = document.activeElement;

		if (event.shiftKey && (active === first || active === dialog || !dialog.contains(active))) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
			event.preventDefault();
			first.focus();
		}
	}

	// Only ever runs in the browser: the component is mounted behind an {#if}
	// that is false during prerender, and effects do not run on the server.
	$effect(() => {
		const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const previousOverflow = document.body.style.overflow;

		document.body.style.overflow = 'hidden';
		// Landing on a real control rather than the panel keeps the focus ring
		// meaningful; screen readers still announce the dialog on entry.
		closeButton?.focus();

		return () => {
			document.body.style.overflow = previousOverflow;
			opener?.focus();
		};
	});
</script>

<svelte:window onkeydown={onKeydown} />

<div class="lightbox">
	<!-- Not a tab stop: keyboard users close with Escape or the close button. -->
	<button
		class="lightbox__scrim"
		type="button"
		tabindex="-1"
		aria-label="Close photo viewer"
		onclick={onclose}
	></button>

	<div
		class="lightbox__panel"
		role="dialog"
		aria-modal="true"
		aria-label="Gallery photo viewer"
		tabindex="-1"
		bind:this={dialog}
	>
		<div class="lightbox__bar lightbox__bar--top">
			<span class="lightbox__count" aria-live="polite">{index + 1} / {photos.length}</span>
			<button
				class="ctrl"
				type="button"
				onclick={onclose}
				aria-label="Close"
				bind:this={closeButton}
			>
				<span aria-hidden="true">×</span>
			</button>
		</div>

		<div class="lightbox__frame">
			<Placeholder ratio="3/4" label={photo.label} src={photo.src} alt={photo.alt} />
		</div>

		<div class="lightbox__bar lightbox__bar--foot">
			<span class="lightbox__label">{photo.label}</span>
			<div class="lightbox__nav">
				<button class="ctrl" type="button" onclick={prev} aria-label="Previous photo">
					<span aria-hidden="true">←</span>
				</button>
				<button class="ctrl" type="button" onclick={next} aria-label="Next photo">
					<span aria-hidden="true">→</span>
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: grid;
		place-items: center;
		padding: clamp(12px, 4vw, 44px);
	}

	/* The one place on the site a near-black field is right — the photo needs a
	   dark ground to read against. Tinted from the ink token, not pure black. */
	.lightbox__scrim {
		position: absolute;
		inset: 0;
		border: 0;
		padding: 0;
		background: var(--text);
		opacity: 0.94;
		cursor: zoom-out;
	}

	.lightbox__panel {
		position: relative;
		z-index: 1;
		min-width: 0;
		max-width: min(92vw, 1100px);
		background: var(--bg);
		border: 1px solid var(--border);
		display: flex;
		flex-direction: column;
	}

	.lightbox__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 8px 10px;
		min-width: 0;
	}

	.lightbox__bar--top {
		border-bottom: 1px solid var(--rule);
	}

	.lightbox__bar--foot {
		border-top: 1px solid var(--rule);
		flex-wrap: wrap;
	}

	.lightbox__count {
		font-family: var(--mono);
		font-size: 12px;
		letter-spacing: 0.08em;
		color: var(--text-faint);
		padding-left: 4px;
	}

	.lightbox__label {
		min-width: 0;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		overflow-wrap: anywhere;
		padding-left: 4px;
	}

	.lightbox__nav {
		display: flex;
		gap: 8px;
		margin-left: auto;
	}

	.lightbox__frame {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--fill);
		min-width: 0;
		/* Height-driven rather than width-driven so the bars above and below stay
		   on screen whatever the photo's shape or the viewport's. */
		height: min(62vh, 620px);
	}

	/* Placeholder sizes itself to fill its slot; in here the fixed frame height
	   drives it instead, so the photo is never cropped. */
	.lightbox__frame :global(img.photo),
	.lightbox__frame :global(div.placeholder) {
		height: 100%;
		width: auto;
		max-width: 100%;
		object-fit: contain;
	}

	.ctrl {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		padding: 0;
		background: none;
		border: 1px solid var(--border-strong);
		color: var(--text);
		font-family: inherit;
		font-size: 18px;
		line-height: 1;
		cursor: pointer;
		transition:
			border-color 0.25s ease,
			color 0.25s ease;
	}

	.ctrl:hover {
		border-color: var(--red);
		color: var(--red);
	}
</style>
