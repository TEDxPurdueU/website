<script>
	/**
	 * A photo slot — the implementation of the design's <image-slot>.
	 *
	 * Once `src` is supplied it renders the real photo; until then it shows the
	 * diagonally-hatched box from the design, captioned with `label` so it stays
	 * obvious which asset is still outstanding. Drop a file into `static/` and
	 * pass its path to fill a slot.
	 */
	/** @type {{ ratio?: string, label: string, src?: string, alt?: string }} */
	let { ratio = '4/3', label, src, alt } = $props();

	// The taller, narrower boxes get tighter padding and a smaller caption.
	const compact = $derived(ratio === '3/4' || ratio === '1/1');
</script>

{#if src}
	<img class="photo" {src} alt={alt ?? label} style:aspect-ratio={ratio} loading="lazy" />
{:else}
	<div class="placeholder" class:compact style:aspect-ratio={ratio}>
		<span>[ {label} ]</span>
	</div>
{/if}

<style>
	/* height:auto leaves `aspect-ratio` in charge, so every slot with the same
	   ratio renders at identical dimensions whatever the source photo's shape;
	   object-fit crops rather than distorts. The lightbox overrides both to fit
	   the photo to its frame instead. */
	.photo {
		display: block;
		width: 100%;
		height: auto;
		object-fit: cover;
	}

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
		/* Small collage tiles can be ~130px wide on a phone; fixed padding would
		   leave the caption almost no room. */
		padding: clamp(10px, 4vw, 18px);
	}

	.placeholder.compact {
		padding: clamp(8px, 3vw, 14px);
	}

	span {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--text-fainter);
	}

	.placeholder.compact span {
		font-size: 11px;
	}
</style>
