# TEDxPurdueU portal

A small web page where members edit **events** (main event, student speaker competition,
salons) and the **team** without code. The data lives in a Google Sheet; the portal
edits that Sheet; the website reads it at build time. Everything is free tier.

```
Editor -> Portal (Cloudflare Worker, Google sign-in) -> Google Sheet + Drive folder
                                                              |
Publish site -> Vercel rebuild -> scripts/sync-events.js reads the Sheet -> website
```

If the portal ever breaks, officers can edit the Sheet directly; the site doesn't need the portal.

## For editors

1. Open the portal link and sign in with your Google account (an officer must have added your email).
2. **Events** or **Team** tab -> **+ New**, **Edit** or **Delete**.
3. Pick the event type (main event, competition, salon). Times are Purdue time.
4. Upload a flyer or headshot (it is shrunk automatically), or leave it empty.
5. **Save**, then click **Publish site** once you're done. The website updates in about 7 minutes (Google refreshes the Sheet's public copy every few minutes).

"Show on website" off hides something without deleting it. "Visible from" (optional) keeps it off the site until that date and time. It is hidden in the visitor's browser, so the details are still in the page source early; do not use it for secrets. Delete also hides it, and the row stays in the Sheet (use the Sheet's version history to undo).
If an image upload fails, the error says so; ask an officer to check the Drive folder (see Troubleshooting).

## One-time setup (officer, using the club Google account and club Cloudflare account)

No payment method is needed anywhere. Do not use a personal account.

1. **Sheet.** Create a Google Sheet with two tabs named exactly `Events` and `Team`. Import `seed/Events.csv` and `seed/Team.csv` (File -> Import -> replace current sheet) to start with the current data.
2. **Drive folder** for images. Make it, copy its id from the URL.
3. **Service account.** Google Cloud console -> new project -> enable the Sheets API and Drive API -> IAM -> Service accounts -> create one -> Keys -> add a JSON key. **Share the Sheet and the Drive folder with the service account's email as Editor.** Note: if uploads fail with a storage-quota error, make the folder a Shared drive, or ask editors to paste image links instead.
4. **Publish the tabs for the site build.** In the Sheet: File -> Share -> Publish to web -> pick the `Events` tab, format CSV, publish; repeat for `Team`. Those two URLs are `EVENTS_CSV_URL` and `TEAM_CSV_URL`.
5. **Deploy the portal.**
   ```
   cd portal
   # fill the [vars] in wrangler.toml (SHEET_ID, DRIVE_FOLDER_ID; the Access values come in step 6)
   npx wrangler login
   npx wrangler deploy
   npx wrangler secret put GOOGLE_SA        # paste the whole JSON key
   npx wrangler secret put DEPLOY_HOOK_URL  # from Vercel -> Settings -> Git -> Deploy Hooks
   ```
6. **Sign-in.** Cloudflare dashboard -> Zero Trust -> Access -> Applications -> add self-hosted app for the Worker's address. Policy: allow the editors' emails. Copy the app's AUD tag and your team domain into `wrangler.toml` (`POLICY_AUD`, `TEAM_DOMAIN`) and run `npx wrangler deploy` again. Until this is done the portal refuses everything.
7. **Website.** In Vercel project settings add environment variables `EVENTS_CSV_URL` and `TEAM_CSV_URL`, then redeploy.

## Handover checklist (every year when officers change)

- [ ] Add new editors' emails in Cloudflare Access; remove people who left.
- [ ] Two officers can sign in to the club Google and Cloudflare accounts.
- [ ] The Sheet is still shared with the service account.
- [ ] Press **Publish site** and confirm the website updates.

## Troubleshooting

- **Site shows old data.** The build prints `SHEET SYNC FAILED` and keeps the last good copy. Check the Vercel build log, and that the two published CSV links still work.
- **Portal says "Sign in required".** Your email isn't in the Access policy, or the Access values in `wrangler.toml` are empty.
- **Edits don't save.** The Sheet is no longer shared with the service account, or its key was deleted (create a new key and run `wrangler secret put GOOGLE_SA`).
- **Image upload fails.** See setup step 3, or paste an image link into the Sheet's `image` column.

## Known limits

- Published-to-web CSV links are unguessable but not private: anyone with the link can read the Sheet's rows, including hidden events.
- Published-to-web copies lag by up to about 5 minutes, so publish a few minutes after your last save for the build to see it.
- Last save wins if two people edit the same row; the `updated_by` column shows who saved last.
- There is no staleness alert yet. If the site looks old, see "Site shows old data".
