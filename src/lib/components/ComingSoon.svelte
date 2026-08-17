<script>
	/**
	 * The empty state for sections we haven't announced yet.
	 *
	 * The mark is a point with arcs radiating out of it — the club's "ideas
	 * worth spreading" line, drawn. The arcs pulse outward in sequence so the
	 * panel reads as pending rather than broken.
	 */
	/** @type {{ label?: string, note?: string }} */
	let { label = 'Coming soon', note } = $props();
</script>

<div class="panel">
	<svg class="mark" viewBox="0 0 120 110" aria-hidden="true">
		<circle class="source" cx="18" cy="55" r="6" />
		<path class="arc arc--1" d="M32.8,36.1 A24,24 0 0,1 32.8,73.9" />
		<path class="arc arc--2" d="M45.1,20.3 A44,44 0 0,1 45.1,89.7" />
		<path class="arc arc--3" d="M57.4,4.6 A64,64 0 0,1 57.4,105.4" />
	</svg>

	<div class="copy">
		<div class="label">{label}</div>
		{#if note}<p class="note">{note}</p>{/if}
	</div>
</div>

<style>
	.panel {
		display: flex;
		align-items: center;
		gap: 36px;
		flex-wrap: wrap;
		padding: 40px;
		border: 1px dashed var(--border-strong);
		background: var(--fill);
	}

	.mark {
		width: 96px;
		height: 88px;
		flex-shrink: 0;
		overflow: visible;
	}

	.source {
		fill: var(--red);
	}

	.arc {
		fill: none;
		stroke: var(--red);
		stroke-width: 4;
		stroke-linecap: round;
		transform-origin: 18px 55px;
		animation: ripple 2.8s ease-out infinite;
	}

	/* Each arc trails the one inside it, so the pulse reads as travelling out. */
	.arc--1 {
		animation-delay: 0s;
	}

	.arc--2 {
		animation-delay: 0.35s;
	}

	.arc--3 {
		animation-delay: 0.7s;
	}

	@keyframes ripple {
		0% {
			opacity: 0;
			transform: scale(0.82);
		}
		30% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: scale(1.1);
		}
	}

	.copy {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}

	.label {
		font-size: clamp(24px, 2.6vw, 34px);
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: 1;
	}

	.note {
		font-size: 16px;
		line-height: 1.6;
		color: var(--text-dim);
		max-width: 46ch;
	}

	/* Without motion the arcs would sit invisible at opacity 0 — hold them at
	   a static fade instead of animating. */
	@media (prefers-reduced-motion: reduce) {
		.arc {
			animation: none;
			opacity: 1;
		}

		.arc--2 {
			opacity: 0.6;
		}

		.arc--3 {
			opacity: 0.3;
		}
	}
</style>
