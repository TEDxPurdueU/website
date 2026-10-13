<script>
	import { onMount } from 'svelte';
	import Placeholder from '$lib/components/Placeholder.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { salons } from '$lib/salons.js';

	const description =
		'Salons are free events hosted throughout the year aimed at community engagement and bonding.';
	const tz = 'America/Indiana/Indianapolis';

	// Prerendered at build time, then re-split in the browser so a salon that
	// has ended moves to Past without waiting for a redeploy.
	let now = $state(new Date());
	onMount(() => (now = new Date()));

	// Local wall-clock strings sort correctly as plain text, so compare against
	// "now" expressed in Purdue time.
	const stamp = $derived(now.toLocaleString('sv-SE', { timeZone: tz }).replace(' ', 'T').slice(0, 16));
	const upcoming = $derived(
		salons.filter((s) => s.end >= stamp).sort((a, b) => a.start.localeCompare(b.start))
	);
	const past = $derived(
		salons.filter((s) => s.end < stamp).sort((a, b) => b.start.localeCompare(a.start))
	);

	/** @param {string} local e.g. 2026-10-17T12:00 */
	const asDate = (local) => new Date(`${local}:00Z`);
	/** @param {string} local */
	const day = (local) =>
		asDate(local)
			.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })
			.replace(',', '')
			.toUpperCase();
	/** @param {string} local */
	const time = (local) =>
		asDate(local).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
	/** @param {string} local */
	const longDay = (local) =>
		asDate(local).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
	/** @param {string} local */
	const compact = (local) => local.replace(/[-:]/g, '') + '00';

	/** @param {(typeof salons)[number]} s */
	function calendarUrl(s) {
		const q = new URLSearchParams({
			action: 'TEMPLATE',
			text: s.title,
			details: s.blurb,
			dates: `${compact(s.start)}/${compact(s.end)}`,
			ctz: tz
		});
		return `https://calendar.google.com/calendar/render?${q}`;
	}

	let copied = $state('');
	/** @param {(typeof salons)[number]} s */
	async function share(s) {
		const url = `${location.origin}/salons#${s.slug}`;
		try {
			if (navigator.share) {
				await navigator.share({ title: s.title, text: s.blurb, url });
			} else {
				await navigator.clipboard.writeText(url);
				copied = s.slug;
				setTimeout(() => (copied = ''), 2000);
			}
		} catch {
			// Share sheet dismissed, or clipboard blocked: nothing to do.
		}
	}
</script>

<Seo
	title="TEDxPurdueU Salons"
	{description}
	path="/salons"
	image="/img/salon.webp"
	imageAlt="A TEDxPurdueU Salon discussion in progress"
/>

<section class="hero section--ruled">
	<div class="hero-copy">
		<h1 class="page-title">Salons</h1>
		<p class="lede">
			Our mini-events. One idea, one small room, one long conversation — usually a short talk or a
			TED screening, then discussion over food. Free, open to everyone at Purdue, no ticket needed.
		</p>
	</div>
	<div class="hero-media">
		<Placeholder ratio="4/3" src="/img/salon.webp" label="A salon in session" />
	</div>
</section>

<section class="sec">
	<div class="wrap">
		<h2 class="list-heading">Upcoming</h2>
		{#if upcoming.length}
			<div class="events">
				{#each upcoming as s (s.slug)}
					<article class="event" id={s.slug}>
						<div class="portrait">
							<Placeholder ratio="4/5" src={s.image ?? undefined} alt={s.imageAlt} label="Portrait image" />
						</div>
						<div class="info">
							<div class="when">
								<span class="date">{day(s.start)}</span>
								<span class="time">{time(s.start)}</span>
							</div>
							<h3 class="event-title">{s.title}</h3>
							<p class="body-text">{s.blurb}</p>
							{#if s.collab}
								<p class="collab">
									In collaboration with <strong>{s.collab}</strong>
								</p>
							{/if}
							<div class="actions">
								{#if s.rsvp}
									<a class="btn btn--primary" href={s.rsvp}>RSVP</a>
								{/if}
								<a
									class="icon-btn"
									href={calendarUrl(s)}
									target="_blank"
									rel="noopener"
									aria-label="Add {s.title} to calendar"
									title="Add to calendar"
								>
									<svg viewBox="0 0 24 24" aria-hidden="true">
										<rect x="3" y="5" width="18" height="16" rx="1" />
										<path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5" />
									</svg>
								</a>
								<button
									class="icon-btn"
									type="button"
									onclick={() => share(s)}
									aria-label="Share {s.title}"
									title={copied === s.slug ? 'Link copied' : 'Share this event'}
								>
									<svg viewBox="0 0 24 24" aria-hidden="true">
										<path d="M12 15V3M7 8l5-5 5 5M5 13v7h14v-7" />
									</svg>
								</button>
								{#if copied === s.slug}<span class="copied" role="status">Link copied</span>{/if}
							</div>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<p class="body-text">No salons scheduled right now. Check back soon.</p>
		{/if}
	</div>
</section>

{#if past.length}
	<section class="sec sec--past">
		<div class="wrap">
			<h2 class="list-heading">Past</h2>
			<div class="grid">
				{#each past as s (s.slug)}
					<article class="card">
						<Placeholder ratio="4/5" src={s.image ?? undefined} alt={s.imageAlt} label="Portrait image" />
						<span class="label">{longDay(s.start)}</span>
						<h3 class="card-title">{s.title}</h3>
						{#if s.collab}<p class="body-text">With {s.collab}</p>{/if}
					</article>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.hero {
		padding: 10vh var(--gutter) 7vh;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
		gap: 56px;
		align-items: center;
	}

	.hero-copy {
		display: flex;
		flex-direction: column;
		gap: 26px;
		min-width: 0;
	}

	.hero-media {
		min-width: 0;
	}

	.sec {
		padding: 7vh var(--gutter);
	}

	.sec--past {
		padding-top: 0;
	}

	.wrap {
		max-width: 1100px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.list-heading {
		font-size: 22px;
		letter-spacing: 0.02em;
		border-top: 2px solid var(--text);
		padding-top: 18px;
	}

	.events {
		display: flex;
		flex-direction: column;
		gap: 44px;
	}

	.event {
		display: flex;
		flex-wrap: wrap;
		gap: clamp(24px, 4vw, 56px);
		align-items: flex-start;
		padding-bottom: 44px;
		border-bottom: 1px solid var(--rule);
		scroll-margin-top: 24px;
	}

	.event:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}

	.portrait {
		flex: 0 1 280px;
		width: 280px;
		max-width: 100%;
	}

	.info {
		flex: 1 1 360px;
		min-width: 0;
		max-width: 620px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.when {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		align-items: center;
	}

	.date {
		background: var(--red);
		color: var(--bg);
		font-weight: 700;
		font-size: 13px;
		letter-spacing: 0.06em;
		padding: 6px 10px;
	}

	.time {
		font-weight: 700;
		font-size: 15px;
	}

	.event-title {
		font-size: clamp(28px, 4vw, 44px);
		line-height: 1.05;
		letter-spacing: -0.02em;
	}

	.collab {
		font-size: 15px;
		color: var(--text-dim);
	}

	.collab strong {
		color: var(--text);
		border-bottom: 2px solid var(--red);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
	}

	.icon-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border: 2px solid var(--text);
		background: none;
		color: var(--text);
		cursor: pointer;
		padding: 0;
		transition:
			border-color 0.15s ease,
			color 0.15s ease;
	}

	.icon-btn:hover {
		border-color: var(--red);
		color: var(--red);
	}

	.icon-btn svg {
		width: 22px;
		height: 22px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.copied {
		font-size: 14px;
		color: var(--text-dim);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(240px, 100%), 1fr));
		gap: 36px 28px;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.card-title {
		font-size: 20px;
		line-height: 1.15;
	}
</style>
