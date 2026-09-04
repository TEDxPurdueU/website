<script>
	import { pages, socials } from '$lib/nav.js';
</script>

<footer>
	<div class="columns">
		<div class="about">
			<img src="/logo-dark.png" alt="TEDxPurdueU" width="1275" height="240" />
			<p>
				This independent TEDx event is operated under license from TED. West Lafayette, Indiana.
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
						aria-label={social.handle ? `${social.name} ${social.handle}` : social.name}
					>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d={social.icon} /></svg>
						{#if social.handle}<span class="social-handle">{social.handle}</span>{/if}
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

	<div class="colophon">© 2026 TEDxPurdueU · x = independently organized TED event</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--rule);
		padding: 56px var(--gutter) 40px;
		display: flex;
		flex-direction: column;
		gap: 36px;
	}

	.columns {
		display: flex;
		flex-wrap: wrap;
		gap: 40px;
		justify-content: space-between;
	}

	.about {
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-width: 360px;
	}

	/* align-self stops the column's default stretch from pulling the wordmark
	   out to the container width while its height stays fixed. */
	.about img {
		height: 30px;
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
		gap: 12px;
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
		gap: 20px;
		flex-wrap: wrap;
	}

	/* Overrides the global red link colour: three red glyphs in a row pulled
	   more attention than a footer warrants. Red is kept for the hover. */
	.socials a {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		color: var(--text);
		transition: color 0.15s ease;
	}

	.social-handle {
		font-size: 14px;
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
		gap: 8px;
	}

	.page-links a {
		font-size: 15px;
		color: var(--text-muted);
		transition: color 0.15s ease;
	}

	.page-links a:hover {
		color: var(--red);
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
