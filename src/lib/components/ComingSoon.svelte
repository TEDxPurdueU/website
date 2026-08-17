<script>
	/**
	 * The empty state for sections we haven't announced yet.
	 *
	 * The mark is a Müller-Brockmann-style radial engine: concentric arcs whose
	 * radii all sit on one geometric ladder, so every size in the composition —
	 * ring widths, the core, even the disc column at the right — derives from a
	 * single ratio. Rhythm and repetition carry the energy; the red circle is
	 * already TED's own shorthand, so the vocabulary stays on-brand without
	 * illustrating anything.
	 */
	/** @type {{ label?: string, note?: string }} */
	let { label = 'Coming soon', note } = $props();

	const CX = 92;
	const CY = 104;

	// One ratio governs every radius; the outer rings bleed off the frame on
	// purpose — cropping is what gives the system its momentum.
	const RATIO = 1.32;
	/** @type {number[]} */
	const radii = [];
	for (let r = 8; r <= 172; r *= RATIO) radii.push(r);

	/** @param {number} r @param {number} aDeg */
	const pt = (r, aDeg) => {
		const a = (aDeg * Math.PI) / 180;
		return `${(CX + r * Math.cos(a)).toFixed(2)} ${(CY + r * Math.sin(a)).toFixed(2)}`;
	};
	/** @param {number} r @param {number} a0 @param {number} sweep */
	const arcPath = (r, a0, sweep) =>
		`M ${pt(r, a0)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 ${sweep > 180 ? 1 : 0} 1 ${pt(r, a0 + sweep)}`;

	// Each arc fills the annulus between two ladder radii. Start angles advance
	// by a fixed 75° per ring so the gaps spiral; the two outermost are aimed at
	// the visible frame rather than rotated on, since most of their circle is
	// off-canvas. tone: 1 solid, 2 mid, 3 wash.
	/** @type {{ i: number, a0: number, sweep: number, tone: number }[]} */
	const ringSpec = [
		{ i: 2, a0: -90, sweep: 300, tone: 1 },
		{ i: 3, a0: -15, sweep: 240, tone: 1 },
		{ i: 4, a0: 60, sweep: 285, tone: 2 },
		{ i: 5, a0: 135, sweep: 210, tone: 1 },
		{ i: 6, a0: 210, sweep: 255, tone: 2 },
		{ i: 7, a0: 285, sweep: 165, tone: 1 },
		{ i: 8, a0: 95, sweep: 140, tone: 3 },
		{ i: 9, a0: -60, sweep: 120, tone: 1 }
	];
	const arcs = ringSpec.map(({ i, a0, sweep, tone }) => ({
		d: arcPath((radii[i] + radii[i + 1]) / 2, a0, sweep),
		w: +(radii[i + 1] - radii[i]).toFixed(2),
		tone
	}));

	// Calibration ticks straddling the hairline-red ring.
	/** @type {{ x1: number, y1: number, x2: number, y2: number }[]} */
	const ticks = [];
	for (let a = 0; a < 360; a += 15) {
		const rad = (a * Math.PI) / 180;
		ticks.push({
			x1: +(CX + (radii[8] - 5) * Math.cos(rad)).toFixed(2),
			y1: +(CY + (radii[8] - 5) * Math.sin(rad)).toFixed(2),
			x2: +(CX + (radii[8] + 5) * Math.cos(rad)).toFixed(2),
			y2: +(CY + (radii[8] + 5) * Math.sin(rad)).toFixed(2)
		});
	}

	// The index at the right: solid discs stepping down the same ladder.
	/** @type {{ cy: number, r: number }[]} */
	const discs = [];
	{
		let y = 47.5;
		let r = radii[1];
		for (let k = 0; k < 5; k++) {
			discs.push({ cy: +(y + r).toFixed(2), r: +r.toFixed(2) });
			y += 2 * r + 12;
			r /= RATIO;
		}
	}
</script>

<div class="panel">
	<svg class="mark" viewBox="0 0 280 200" aria-hidden="true">
		{#each radii as r (r)}
			<circle class="grid" cx={CX} cy={CY} r={r.toFixed(2)} />
		{/each}
		{#each ticks as t, i (i)}
			<line class="tick" x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
		{/each}
		{#each arcs as a, i (i)}
			<path class="arc" class:t2={a.tone === 2} class:t3={a.tone === 3} d={a.d} stroke-width={a.w} />
		{/each}
		<circle class="ringline" cx={CX} cy={CY} r={radii[8].toFixed(2)} />
		<circle class="disc" cx={CX} cy={CY} r={radii[1].toFixed(2)} />
		{#each discs as d, i (i)}
			<circle class="disc" cx="254" cy={d.cy} r={d.r} />
		{/each}
	</svg>

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
		width: clamp(120px, 26vw, 270px);
		flex-shrink: 0;
	}

	/* The fine circular grid stays a shade below the ticks so the red carries
	   the composition rather than the scaffolding. */
	.grid {
		fill: none;
		stroke: var(--rule);
		stroke-width: 1;
	}

	.tick {
		stroke: var(--border-strong);
		stroke-width: 1;
	}

	.arc {
		fill: none;
		stroke: var(--red);
	}

	.t2 {
		opacity: 0.4;
	}

	.t3 {
		opacity: 0.15;
	}

	.ringline {
		fill: none;
		stroke: var(--red);
		stroke-width: 1.5;
	}

	.disc {
		fill: var(--red);
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
