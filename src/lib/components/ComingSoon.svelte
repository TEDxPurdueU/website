<script>
	/**
	 * The empty state for sections we haven't announced yet.
	 * The calendar and clock make the pending timing literal while the visible
	 * label carries the accessible meaning.
	 */
	/** @type {{ label?: string, note?: string }} */
	let { label = 'Coming soon', note } = $props();
</script>

<div class="panel">
	<img class="mark" src="/illustrations/coming-soon.svg" alt="" aria-hidden="true" />

	<div class="copy">
		<div class="panel__label">{label}</div>
		{#if note}<p class="note">{note}</p>{/if}
	</div>
</div>

<style>
	.panel {
		display: flex;
		align-items: center;
		gap: clamp(20px, 5vw, 48px);
		flex-wrap: wrap;
		padding: clamp(24px, 4.6vw, 44px) clamp(20px, 5vw, 48px);
		border: 1px dashed var(--border-strong);
		background: var(--fill);
	}

	/* Once the panel wraps, the mark sits above the copy rather than beside it —
	   the desktop floor would then take most of a phone screen's width, so it
	   scales down with the viewport instead. */
	.mark {
		display: block;
		width: clamp(160px, 30vw, 310px);
		aspect-ratio: 10 / 7;
		flex-shrink: 0;
	}

	.copy {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}

	.panel__label {
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
</style>
