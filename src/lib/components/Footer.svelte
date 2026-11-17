<script>
	import { pages, socials } from '$lib/nav.js';
</script>

<footer>
	<div class="columns">
		<div class="about">
			<img src="/logo-dark.png" alt="TEDxPurdueU" width="1275" height="151" />
			<p>
				This independent TEDx event is operated under license from TED.
			</p>
		</div>

		<div class="col">
			<div class="col-head">Follow</div>
			<div class="socials">
				{#each socials as social (social.name)}
					<a
						href={social.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={social.name}
					>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d={social.icon} /></svg>
					</a>
				{/each}
			</div>
		</div>

		<div class="col">
			<div class="col-head">Pages</div>
			<div class="page-links">
				{#each pages as item (item.href)}
					<a href={item.href}>{item.footerLabel}</a>
				{/each}
			</div>
		</div>
	</div>

	<div class="colophon">© 2026 TEDxPurdueU</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--rule);
		padding: var(--space-8) var(--gutter) var(--space-7);
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.columns {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-6);
		justify-content: space-between;
	}

	/* From a tablet up the three columns stay in one row (the brand text shrinks
	   to make room); wrapping dropped "Pages" under the brand at ~768px. */
	@media (min-width: 640px) {
		.columns {
			flex-wrap: nowrap;
		}

		.col {
			flex-shrink: 0;
		}
	}

	.about {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		max-width: 360px;
	}

	/* align-self stops the column's default stretch from pulling the wordmark
	   out to the container width while its height stays fixed. */
	.about img {
		height: 18.9px;
		width: auto;
		align-self: flex-start;
		display: block;
	}

	.about p {
		font-size: 14px;
		line-height: 1.6;
		color: var(--text-faint);
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.col-head {
		font-size: 12px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--text-fainter);
	}

	.socials {
		display: flex;
		align-items: center;
		gap: var(--space-5);
		flex-wrap: wrap;
	}

	/* Overrides the global red link colour: three red glyphs in a row pulled
	   more attention than a footer warrants. Red is kept for the hover. */
	.socials a {
		display: inline-flex;
		color: var(--text);
		transition: color 0.15s ease;
	}

	.socials a:hover {
		color: var(--red);
	}

	/* currentColor carries the link colour and its hover state into the glyph. */
	.socials svg {
		width: 21px;
		height: 21px;
		display: block;
		fill: currentColor;
	}

	.page-links {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.page-links a {
		font-size: 15px;
		color: var(--text-muted);
		transition: color 0.15s ease;
	}

	/* Ink plus a red underline: 15px regular is too small for red text. */
	.page-links a:hover {
		color: var(--text);
		text-decoration: underline;
		text-decoration-color: var(--red);
		text-decoration-thickness: 2px;
		text-underline-offset: 4px;
	}

	.colophon {
		font-size: 13px;
		color: var(--text-faintest);
	}

	/* On touch-sized screens the gaps move inside the links so each one is a
	   comfortable tap target while the visual rhythm stays put. */
	@media (max-width: 720px) {
		.page-links {
			gap: 0;
			margin-block: -11px;
		}

		.page-links a {
			padding: 11px 0;
		}

		.socials {
			gap: 0;
			margin-inline: -10px;
		}

		.socials a {
			padding: 10px;
		}
	}
</style>
