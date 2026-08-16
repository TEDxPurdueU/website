<script>
	/**
	 * The diagonally-hatched box that stands in for photography the club hasn't
	 * supplied yet (conference shots, speaker portraits, team headshots).
	 * Swap each one for a real <img> as the assets arrive.
	 */
	/** @type {{ ratio?: '4/3' | '3/4' | '1/1', label: string }} */
	let { ratio = '4/3', label } = $props();

	// Padding and caption size track the box size, per the design.
	const sizing = {
		'4/3': { padding: '18px', fontSize: '12px' },
		'3/4': { padding: '16px', fontSize: '11px' },
		'1/1': { padding: '14px', fontSize: '11px' }
	};

	const { padding, fontSize } = $derived(sizing[ratio]);
</script>

<div class="placeholder" style:aspect-ratio={ratio} style:padding>
	<span style:font-size={fontSize}>[ {label} ]</span>
</div>

<style>
	.placeholder {
		background-color: var(--fill);
		background-image: repeating-linear-gradient(
			135deg,
			var(--fill-hatch) 0 10px,
			var(--fill) 10px 20px
		);
		border: 1px solid var(--border);
		display: flex;
		align-items: flex-end;
	}

	span {
		font-family: var(--mono);
		color: var(--text-fainter);
	}
</style>
