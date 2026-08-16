<script>
	import Placeholder from '$lib/components/Placeholder.svelte';
	import { contactEmail } from '$lib/nav.js';

	// TODO: swap "Name Here" for real names and drop each headshot in place of
	// the hatched placeholder.
	const team = [
		{ name: 'Name Here', role: 'Licensee & Organizer' },
		{ name: 'Name Here', role: 'Curation Lead' },
		{ name: 'Name Here', role: 'Production Lead' },
		{ name: 'Name Here', role: 'Design Lead' },
		{ name: 'Name Here', role: 'Marketing Lead' },
		{ name: 'Name Here', role: 'Partnerships Lead' }
	];
</script>

<svelte:head>
	<title>Team · TEDx Purdue U</title>
	<meta
		name="description"
		content="Curation, production, design, marketing, and partnerships — every part of the TEDx Purdue U conference is built by Purdue students."
	/>
</svelte:head>

<section class="hero section--ruled">
	<div class="hero-inner">
		<div class="eyebrow">Entirely student-run</div>
		<h1 class="page-title">The team</h1>
		<p class="lede">
			Curation, production, design, marketing, and partnerships — every part of the conference is
			built by Purdue students who volunteer their semesters to it.
		</p>
	</div>
</section>

<section class="sec section--ruled">
	<div class="roster">
		{#each team as member (member.role)}
			<div class="member">
				<Placeholder ratio="1/1" label="headshot" />
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
			We recruit new organizers at the start of every fall semester — curation, video, graphic
			design, sponsorship, and event ops. Email us or reach out on Instagram and we'll tell you
			what's open.
		</p>
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

	.roster {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
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
</style>
