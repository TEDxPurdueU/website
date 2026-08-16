<script>
	import { pages, socials } from '$lib/nav.js';
</script>

<footer>
	<div class="columns">
		<div class="about">
			<img src="/whitetext.png" alt="TEDx Purdue U" width="492" height="92" />
			<p>
				This independent TEDx event is operated under license from TED. West Lafayette, Indiana.
			</p>
		</div>

		<div class="col">
			<div class="col-head">Follow</div>
			<div class="socials">
				{#each socials as social (social.name)}
					<a href={social.href} target="_blank" rel="noopener noreferrer">{social.name}</a>
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

	<div class="colophon">© 2026 TEDx Purdue U · x = independently organized TED event</div>
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

	.about img {
		height: 30px;
		width: auto;
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
		gap: 24px;
		flex-wrap: wrap;
	}

	.socials a {
		font-size: 15px;
		letter-spacing: 0.04em;
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
</style>
