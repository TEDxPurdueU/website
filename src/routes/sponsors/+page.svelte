<script>
	import Seo from '$lib/components/Seo.svelte';
	import { contactEmail } from '$lib/nav.js';
	import { site } from '$lib/seo.js';
	import { sponsors } from '$lib/sponsors.js';

	const description =
		'The organizations whose support makes TEDxPurdueU possible, and how to join them.';
	const sponsorsStructuredData = {
		'@type': 'ItemList',
		name: 'TEDxPurdueU sponsors',
		itemListElement: sponsors.map((sponsor, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			item: {
				'@type': 'Organization',
				name: sponsor.name,
				url: sponsor.url ?? undefined,
				logo: sponsor.logo ? `${site.url}${sponsor.logo}` : undefined
			}
		}))
	};
</script>

<Seo
	title="Sponsors | TEDxPurdueU"
	{description}
	path="/sponsors"
	structuredData={sponsorsStructuredData}
/>

<section class="hero section--ruled">
	<div class="hero-inner">
		<h1 class="page-title">Sponsors</h1>
		<p class="lede">
			Our sponsors enable us to host such events and provide a platform for the Purdue
			community to share their ideas and stories.
		</p>
	</div>
</section>

<section class="sec section--ruled">
	<div class="wrap">
		<h2 class="list-heading">Sponsors</h2>
		<ul class="grid">
			{#each sponsors as sponsor (sponsor.name)}
				<li>
					<svelte:element
						this={sponsor.url ? 'a' : 'div'}
						class="tile"
						href={sponsor.url ?? undefined}
						target={sponsor.url ? '_blank' : undefined}
						rel={sponsor.url ? 'noopener noreferrer' : undefined}
					>
						<div class="mark">
							{#if sponsor.logo}
								<!-- The name is printed in the caption, so the mark itself is decorative. -->
								<img src={sponsor.logo} alt="" />
							{:else}
								<span class="wordmark">{sponsor.name}</span>
							{/if}
						</div>
						{#if sponsor.logo}
							<div class="caption">
								<span class="name">{sponsor.name}</span>
							</div>
						{/if}
					</svelte:element>
				</li>
			{/each}
		</ul>
	</div>
</section>

<section class="sec">
	<div class="join">
		<h2>Become a sponsor</h2>
		<p class="join-body">
			Partner with us to reach 500+ attendees and the wider Purdue community. Our sponsorship
			packet covers the tiers and what each one includes.
		</p>
		<a class="btn btn--primary" href="/sponsor.pdf" target="_blank" rel="noopener">
			View sponsorship packet
		</a>
		<a class="link-rule" href="mailto:{contactEmail}">{contactEmail}</a>
	</div>
</section>

<style>
	.hero {
		padding: var(--hero-top) var(--gutter) var(--section-y);
	}

	.hero-inner {
		max-width: var(--measure);
		display: flex;
		flex-direction: column;
		gap: var(--stack);
	}

	.sec {
		padding: var(--section-y) var(--gutter);
	}

	.wrap {
		display: flex;
		flex-direction: column;
		gap: var(--title-gap);
	}

	.list-heading {
		font-size: var(--title-size);
		letter-spacing: -0.02em;
	}

	.grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
		gap: var(--card-gap);
	}

	.tile {
		height: 100%;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--border);
		color: var(--text);
		transition: border-color 0.15s ease;
	}

	a.tile:hover {
		border-color: var(--red-accessible);
	}

	.mark {
		aspect-ratio: 16 / 9;
		display: grid;
		place-items: center;
		padding: var(--space-5);
		background: var(--fill);
		text-align: center;
	}

	/* A fixed box with object-fit lets square and wide marks share one tile
	   size without either one dictating the other's scale. */
	.mark img {
		width: 100%;
		height: 150px;
		object-fit: contain;
	}

	.wordmark {
		font-size: clamp(22px, 2.4vw, 30px);
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	.caption {
		padding: var(--space-4) var(--space-5);
		border-top: 1px solid var(--border);
	}

	.name {
		font-size: 17px;
		font-weight: 700;
	}

	.join {
		max-width: var(--measure-prose);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.join h2 {
		font-size: var(--title-size);
		letter-spacing: -0.02em;
	}

	.join-body {
		font-size: 17px;
		line-height: 1.7;
		color: var(--text-dim);
	}

	.join .btn {
		align-self: flex-start;
	}
</style>
