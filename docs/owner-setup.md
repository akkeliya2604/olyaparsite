# Owner setup — two one-time tasks

These two things can only be done by the person who owns the GitHub and
Cloudflare accounts. They take about five minutes together and are done once.

Everything else — the code, the site, the deployment config — is already
finished and waiting on these.

---

## Task 1 — Let Yurii push the code

The website code currently only exists on Yurii's computer. The repository is
yours, so only you can let him upload it.

1. Go to <https://github.com/akkeliya2604/olyaparsite/settings/access>
2. Click the green **Add people** button
3. Type **`Yurii-Tor`** and select that account
4. Choose the **Write** role
5. Click **Add Yurii-Tor to this repository**

That is it. Tell him when it is done, and he will push the site.

> **Why this is needed:** GitHub treats "can read" and "can upload" as separate
> permissions. He currently has read only, so uploading is refused.

---

## Task 2 — Turn on automatic publishing

This makes Cloudflare rebuild the live site every time a change is pushed.

**Do this after Task 1, once the code is actually in the repository** — the
setup screen needs to see the real files.

1. Sign in at <https://dash.cloudflare.com> with your Cloudflare account
   (the one the site already lives under)
2. In the left sidebar choose **Workers & Pages**
3. Click **race-ready-site** (it already exists — the site is live)
4. Go to the **Settings** tab, then **Builds** in the side menu
5. Click **Connect**
6. Choose **GitHub**. A GitHub window opens asking to install the Cloudflare
   app — approve it, and when it asks which repositories, you can pick **Only
   select repositories** and choose `olyaparsite`
7. Back in Cloudflare, choose the `akkeliya2604/olyaparsite` repository
8. Fill the build settings in exactly:

| Field | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |
| Production branch | `main` |

9. Save

From then on, every push republishes the site automatically in a minute or two.

> **Do not rename the Worker.** The name `race-ready-site` has to match a file
> inside the code. If they ever differ, builds succeed and publishing fails with
> a confusing error.

---

## Checking it worked

After the next push, go to **Workers & Pages → race-ready-site → Deployments**.

- **Green** — live.
- **Red** — the build failed and the previous version is still serving, so
  visitors see no problem. Open it, copy the error, and give it to Codex.

---

## What you do not need

- **You do not need to install Wrangler.** It comes with the project when you
  run `npm install`.
- **You do not need to deploy by hand.** Once Task 2 is done, pushing is
  publishing.
- **You do not need to touch Cloudflare again** after this, except to watch
  deployments or roll one back.

Next: [START-HERE.md](../START-HERE.md) covers installing everything on your own
computer and making your first change.
