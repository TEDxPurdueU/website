<script>
	/**
	 * The empty state for sections we haven't announced yet.
	 *
	 * The mark borrows the site's placeholder language: anything not here yet
	 * sits behind a diagonal-hatched field. So the announcement is a flat red
	 * disc pushing out from behind one — most of it already in view, the rest
	 * traced in hairline. Unseen, until it isn't.
	 */
	/** @type {{ label?: string, note?: string }} */
	let { label = 'Coming soon', note } = $props();

	// clip-path ids must be document-unique and this component renders more
	// than once per page.
	const uid = $props.id();

	// 45° stripes on a 20-unit period, mirroring the Placeholder hatch. The
	// clip does the cropping, so endpoints only need to overshoot the field.
	/** @type {number[]} */
	const stripes = [];
	for (let c = 14; c <= 340; c += 20 * Math.SQRT2) stripes.push(c);
</script>

<div class="panel">
	<svg class="mark" viewBox="0 0 260 200" aria-hidden="true">
		<defs>
			<clipPath id="{uid}-field">
				<rect x="0" y="0" width="140" height="200" />
			</clipPath>
		</defs>
		<circle class="disc" cx="168" cy="100" r="72" />
		<g clip-path="url(#{uid}-field)">
			<rect class="field" x="0" y="0" width="140" height="200" />
			{#each stripes as c (c)}
				<line class="hatch" x1={c + 10} y1="-10" x2="-10" y2={c + 10} />
			{/each}
		</g>
		<rect class="field-edge" x="0.75" y="0.75" width="138.5" height="198.5" />
		<path class="ghost" d="M 140 33.7 A 72 72 0 0 0 140 166.3" />
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
		width: clamp(120px, 26vw, 270px);
		flex-shrink: 0;
	}

	.disc {
		fill: var(--red);
	}

	/* Same tone as the panel so the field reads as hatching, not a grey slab. */
	.field {
		fill: var(--fill);
	}

	.hatch {
		stroke: var(--fill-hatch);
		stroke-width: 10;
	}

	.field-edge {
		fill: none;
		stroke: var(--border-strong);
		stroke-width: 1.5;
	}

	/* The still-hidden remainder of the disc, kept to a hairline. */
	.ghost {
		fill: none;
		stroke: var(--border-strong);
		stroke-width: 1.5;
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
</style>
