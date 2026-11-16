<script>
	import Placeholder from '$lib/components/Placeholder.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { applicationUrl, contactEmail } from '$lib/nav.js';
	import { site } from '$lib/seo.js';
	import { members, team } from '$lib/team.js';

	const description =
		'Meet the Purdue students who lead TEDxPurdueU across curation, operations, marketing, salons, outreach, design, and partnerships.';
	const teamStructuredData = {
		'@type': 'ItemList',
		name: 'TEDxPurdueU student leadership team',
		itemListElement: team.map((member, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			item: {
				'@type': 'Person',
				name: member.name,
				jobTitle: member.role,
				image: member.photo ? `${site.url}${member.photo}` : undefined,
				memberOf: { '@id': `${site.url}/#organization` }
			}
		}))
	};
</script>

<Seo
	title="Team | TEDxPurdueU"
	{description}
	path="/team"
	structuredData={teamStructuredData}
/>

<section class="hero section--ruled">
	<div class="hero-inner">
		<h1 class="page-title">The team</h1>
		<p class="lede">
			Logistics, marketing, design, partnerships, and the talks — every aspect of the
			TEDxPurdueU conference is built by Purdue students.
		</p>
	</div>
</section>

<section class="sec section--ruled">
	<h2 class="sec-title">Leadership</h2>
	<div class="roster">
		{#each team as member (member.name)}
			<div class="member">
				<Placeholder
					ratio="1/1"
					label={member.name}
					src={member.photo ?? undefined}
					alt="{member.name}, {member.role}"
				/>
				<div>
					<div class="member-name">{member.name}</div>
					<div class="member-role">{member.role}</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<section class="sec section--ruled">
	<h2 class="sec-title">General Members</h2>
	<div class="roster">
		{#each members as member (member.name)}
			<div class="member">
				<Placeholder
					ratio="1/1"
					label={member.name}
					src={member.photo ?? undefined}
					alt="{member.name}, Member"
				/>
				<div>
					<div class="member-name">{member.name}</div>
					<div class="member-role">Member</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<section class="sec">
	<div class="join">
		<h2>Join us</h2>
		<p class="join-body">
			We recruit every year in Fall for students to join one of our committees — curations,
			operations, marketing, salons, and outreach. Fill out our application below by the
			deadline.
		</p>
		<a
			class="btn btn--primary"
			href={applicationUrl}
			target="_blank"
			rel="noopener noreferrer"
		>
			Apply to join
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

	.sec-title {
		font-size: var(--title-size);
		letter-spacing: -0.02em;
		margin-bottom: var(--title-gap);
	}

	/* Explicit column counts (2 / 3 / 4 / 6) instead of auto-fit: auto-fit gave 5
	   columns on a laptop and stranded one headshot on a row of its own. Two-up
	   on a phone because six full-width square headshots would be most of the
	   page. */
	.roster {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--card-gap);
	}

	@media (min-width: 600px) {
		.roster {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (min-width: 900px) {
		.roster {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (min-width: 1280px) {
		.roster {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
	}

	.member {
		display: flex;
		flex-direction: column;
		gap: var(--card-copy-gap);
	}

	.member-name {
		font-size: 17px;
		font-weight: 700;
	}

	/* Bold because red text under 18px is kept bold for legibility. */
	.member-role {
		font-size: 14px;
		font-weight: 700;
		color: var(--red-accessible);
		letter-spacing: 0.06em;
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

	/* .join is a flex column, so the button would otherwise stretch the full
	   760px of it. .link-rule below already sets this on itself. */
	.join .btn {
		align-self: flex-start;
	}
</style>
