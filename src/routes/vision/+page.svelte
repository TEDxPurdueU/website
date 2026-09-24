<script>
	import Seo from '$lib/components/Seo.svelte';

	const description =
		'The vision and values behind TEDxPurdueU: spread ideas as far as possible that change the way people think.';

	const values = [
		{
			title: 'Believe in the power of Ideas',
			body: "One idea can spark enormous change: a new company, a new career, a new way of seeing the world. We believe that deeply, and it's the reason behind everything we do."
		},
		{
			title: 'Be open to different perspectives',
			body: "Great ideas come from fields and people we don't usually hear from. We seek them out, and we judge ideas by their content, not by who holds them.",
			practice: [
				'Curation looks beyond engineering and business, to artists, doctors, athletes, founders and more.',
				'Every main event includes a Purdue student speaker.',
				'In meetings, a new member’s idea gets the same hearing as an exec’s.'
			],
			callout: {
				lead: 'We stay viewpoint neutral within TED’s guidelines.',
				text: "We never turn away a speaker because we disagree with them. Being open doesn't mean tolerating falsehoods, hatred, or someone else's intolerance."
			}
		},
		{
			title: 'Take pride in all that you do',
			body: 'People experience everything we make, not just the talks. Every detail reflects on all of us, starting with who we put on stage.',
			practice: [
				'A poster or a sponsor email deserves the same effort as the main stage.',
				'If you’re responsible for something, give it your all, no matter how small the task may seem.'
			],
			bar: {
				lead: 'We want the best speakers for our event.',
				text: 'We focus on people with genuine ideas to share and stories to tell, and we look for people who are incredibly talented and accomplished.'
			}
		},
		{
			title: "Don't be afraid",
			body: "You can question anything and anyone. Who suggested an idea, or the fact that we've done it before, is never on its own a reason to go with it.",
			practice: [
				'If you think a plan is wrong, say so, even if an exec made it.',
				'“We’ve always done it this way” is never a reason by itself.',
				'Try the new format, even if it might flop.'
			]
		},
		{
			title: 'Aim for the stars',
			body: 'Be bold to the point of being shameless. Start with the biggest possible version of every goal and work from there.',
			practice: [
				'Speaker lists start with the names everyone says are out of reach.',
				'Reach out to anyone. Never rule someone out before you ask.',
				'Follow up, then follow up again. Emails are free.'
			]
		},
		{
			title: 'Have fun',
			body: "We're students building a conference together. It should be one of the best parts of your week, not a chore.",
			practice: [
				'Celebrate every win, from a speaker’s yes to curtain call.',
				'Get to know your committee outside of meetings.',
				'Enjoy everything you do in the club.'
			]
		}
	];
</script>

<Seo title="TEDxPurdueU Vision" {description} path="/vision" />

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@700;800&family=Inter:wght@400;500;600;700&display=swap"
	/>
</svelte:head>

<!-- Deliberately its own look (fonts, column, dark mode) rather than the site
     theme, matching the published vision artifact. Tokens are scoped to this
     wrapper so nothing leaks into the header, footer or other routes. -->
<div class="vision">
	<div class="col">
		<a class="mark" href="/" aria-label="TEDxPurdueU — home">
			<picture>
				<source srcset="/logo-light.png" media="(prefers-color-scheme: dark)" />
				<img src="/logo-dark.png" alt="TEDxPurdueU" width="1275" height="240" />
			</picture>
		</a>
		<p class="kicker">Our vision</p>
		<h1>Spread ideas as far as possible that change the way people think.</h1>

		<section>
			<h2>We believe that ideas hold immense potential.</h2>
			<p>
				Ideas are more than thoughts—they are people’s stories, experiences, lessons, and journeys. We
				believe these ideas should be shared as widely as possible because you never know how deeply
				they might resonate with someone. An idea might inspire a new business, give someone the push
				they need, or simply change the way they see the world.
			</p>
		</section>

		<section>
			<h2>Our values</h2>
			<ol class="values">
				{#each values as value, i (value.title)}
					<li class="value">
						<h3><span class="num">{String(i + 1).padStart(2, '0')}</span>{value.title}</h3>
						<p>{value.body}</p>
						{#if value.practice}
							<p class="tag">In practice</p>
							<ul>
								{#each value.practice as item (item)}<li>{item}</li>{/each}
							</ul>
						{/if}
						{#if value.callout}
							<div class="callout">
								<p><strong>{value.callout.lead}</strong> {value.callout.text}</p>
							</div>
						{/if}
						{#if value.bar}
							<div class="bar">
								<p><strong>{value.bar.lead}</strong> {value.bar.text}</p>
							</div>
						{/if}
					</li>
				{/each}
			</ol>
		</section>

		<section>
			<p class="close">Every talk we put on should be one someone remembers years later.</p>
		</section>
	</div>
</div>

<style>
	.vision {
		--v-bg: #faf9f8;
		--v-text: #14100f;
		--v-muted: #443e3a;
		--v-faint: #756e67;
		--v-rule: #e4dfd9;
		--v-chip: #f1ede8;
		--display: 'Inter Tight', 'Helvetica Neue', Arial, sans-serif;
		--body: 'Inter', 'Helvetica Neue', Arial, sans-serif;

		background: var(--v-bg);
		color: var(--v-text);
		font-family: var(--body);
		font-size: 17px;
		line-height: 1.6;
		padding-inline: var(--gutter);
		padding-block: 72px 96px;
	}

	@media (prefers-color-scheme: dark) {
		.vision {
			color-scheme: dark;
			--v-bg: #0b0a0a;
			--v-text: #faf9f8;
			--v-muted: #d9d3cc;
			--v-faint: #a39b94;
			--v-rule: #2e2b29;
			--v-chip: #1c1a19;
		}
	}

	.col {
		max-width: 680px;
		margin: 0 auto;
	}

	.mark {
		display: inline-block;
		margin: 0 0 56px;
	}

	.mark img {
		display: block;
		height: 34px;
		width: auto;
	}

	.kicker {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--v-faint);
		margin: 0 0 14px;
	}

	h1 {
		font-family: var(--display);
		font-weight: 800;
		font-size: clamp(36px, 7.5vw, 60px);
		line-height: 1.02;
		letter-spacing: -0.035em;
		margin: 0;
		text-wrap: balance;
	}

	section {
		padding-top: 44px;
		margin-top: 44px;
		border-top: 1px solid var(--v-rule);
	}

	h2 {
		font-family: var(--display);
		font-weight: 800;
		font-size: 28px;
		letter-spacing: -0.02em;
		line-height: 1.15;
		margin: 0 0 16px;
		text-wrap: balance;
	}

	p {
		margin: 0 0 14px;
		color: var(--v-muted);
		max-width: 65ch;
	}

	strong {
		color: var(--v-text);
		font-weight: 700;
	}

	.callout {
		border-left: 3px solid var(--v-text);
		padding: 2px 0 2px 18px;
		margin: 20px 0 0;
	}

	.callout p {
		margin-bottom: 0;
	}

	.values {
		list-style: none;
		margin: 8px 0 0;
		padding: 0;
	}

	.value {
		padding: 28px 0;
		border-top: 1px solid var(--v-rule);
	}

	.value:first-child {
		border-top: 0;
		padding-top: 8px;
	}

	h3 {
		font-family: var(--display);
		font-weight: 800;
		font-size: 22px;
		letter-spacing: -0.015em;
		line-height: 1.2;
		margin: 0 0 10px;
		display: flex;
		gap: 12px;
		align-items: baseline;
	}

	.num {
		font-size: 15px;
		color: var(--v-faint);
		font-variant-numeric: tabular-nums;
	}

	.tag {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--v-faint);
		margin: 16px 0 8px;
	}

	.value ul {
		margin: 0;
		padding-left: 20px;
		color: var(--v-muted);
		display: grid;
		gap: 6px;
	}

	.bar {
		display: grid;
		gap: 16px;
		margin: 20px 0 0;
		background: var(--v-chip);
		border-radius: 12px;
		padding: 20px 22px;
	}

	.bar p {
		margin: 0;
	}

	.close {
		font-family: var(--display);
		font-weight: 800;
		font-size: clamp(26px, 5vw, 34px);
		line-height: 1.12;
		letter-spacing: -0.025em;
		color: var(--v-text);
		margin: 0;
		max-width: 18em;
		text-wrap: balance;
	}
</style>
