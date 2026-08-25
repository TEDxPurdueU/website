<script>
	import Placeholder from '$lib/components/Placeholder.svelte';
	import { contactEmail } from '$lib/nav.js';
	import { team } from '$lib/team.js';

	const applicationUrl =
		'https://docs.google.com/forms/d/e/1FAIpQLSf-SRXWs6FQpU1LTH3kL_09_m6OxzovRzeSJYTuRoXSsRn6sg/viewform';
</script>

<svelte:head>
	<title>TEDxPurdueU</title>
	<meta
		name="description"
		content="Logistics, marketing, design, partnerships, and the talks — every aspect of the TEDxPurdueU conference is built by Purdue students."
	/>
</svelte:head>

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
		padding: 10vh var(--gutter) 7vh;
	}

	.hero-inner {
		max-width: 900px;
		display: flex;
		flex-direction: column;
		gap: 26px;
	}

	.sec {
		padding: 7vh var(--gutter);
	}

	/* The 42% floor holds the roster two-up on a phone — six full-width square
	   headshots would otherwise be most of the page. Above ~450px the 210px min
	   takes over again, so wider layouts are untouched. */
	.roster {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(210px, 42%), 1fr));
		gap: 32px;
		max-width: 1200px;
	}

	.member {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.member-name {
		font-size: 17px;
		font-weight: 700;
	}

	.member-role {
		font-size: 14px;
		color: var(--red);
		letter-spacing: 0.06em;
	}

	.join {
		max-width: 760px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.join h2 {
		font-size: clamp(24px, 2.8vw, 34px);
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
