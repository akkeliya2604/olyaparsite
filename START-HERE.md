# Start here

This is the Race Ready website. This guide takes you from a fresh computer to
publishing a change, assuming no prior setup.

You do **not** need to understand the code to change the words on the site.

---

## How the site works, in one picture

```
   your computer                 GitHub                  Cloudflare
   ------------                  ------                  ----------
   edit a file      ──push──►    stores the    ──►       builds it and puts
   see it locally                code                    it on the internet
```

Three ideas, and that is genuinely all:

| Thing | What it is | Why you need it |
|---|---|---|
| **Node.js** | A program that builds the website from the code | Lets you preview changes on your own computer |
| **Git** | Records every version of the site | Lets you undo anything, and sends changes to GitHub |
| **GitHub** | Online storage for the code | Cloudflare watches it and republishes automatically |

Nothing is ever published until you deliberately push. You cannot break the
live site by editing on your computer.

> **Account owner?** Two one-time admin tasks must happen first — granting
> push access and turning on automatic publishing. See
> **[docs/owner-setup.md](docs/owner-setup.md)**.

---

## Part 1 — One-time setup

Do this once. Budget about 20 minutes.

### 1.1 Install Node.js

Go to **<https://nodejs.org>** and download the version marked **LTS**.
Run the installer and accept every default.

### 1.2 Install Git

- **Windows:** <https://git-scm.com/download/win> — run it, accept every default.
- **Mac:** open Terminal and type `git --version`. If it is not installed, macOS
  offers to install it. Say yes.

### 1.3 Install a code editor

**VS Code**: <https://code.visualstudio.com> — accept the defaults.

### 1.4 Check it worked

Open your terminal:

- **Windows:** Start menu → type `Git Bash` → open it
- **Mac:** Spotlight (Cmd+Space) → type `Terminal` → open it

Type each line, pressing Enter after each:

```bash
node --version
```

```bash
git --version
```

Each should print a version number like `v22.18.0`. If either says "not found",
the install did not finish — restart the computer and check again.

### 1.5 Tell Git who you are

Replace the name and email with your own. This is only used to label your
changes.

```bash
git config --global user.name "Olya Parashuk"
```

```bash
git config --global user.email "you@example.com"
```

### 1.6 Download the site

This creates a folder called `olyaparsite` wherever you currently are:

```bash
git clone https://github.com/akkeliya2604/olyaparsite.git
```

```bash
cd olyaparsite
```

The first time GitHub asks you to sign in, a browser window opens. Sign in with
the account that owns the repository.

### 1.7 Install the site's building blocks

```bash
npm install
```

This takes a few minutes and prints a lot of text. That is normal. It downloads
everything the site needs, including Wrangler — **you never install Wrangler
separately.**

---

## Part 2 — Working on the site

### See the site on your computer

```bash
npm run dev
```

Then open **<http://localhost:4321>** in your browser.

Leave this running while you work. Every time you save a file, the browser
updates by itself.

To stop it, click the terminal and press **Ctrl+C**.

### Change some words

Open the folder in VS Code. The text lives in the files listed in
[docs/content-map.md](docs/content-map.md) — that page tells you exactly which
file holds which part of the page.

Change the words between the tags, save, and watch the browser update.

> **Safe to edit:** anything that reads like a normal sentence.
> **Leave alone:** anything inside `<style>` blocks, or lines starting with
> `import`. If you are unsure, ask Codex — see Part 4.

### Check nothing broke

```bash
npm test
```

Despite the name, this checks the whole site builds correctly. **If it prints
errors, do not publish.** Copy the error text and give it to Codex.

---

## Part 3 — Publishing

Once your change looks right locally and `npm test` passes:

```bash
git add -A
```

```bash
git commit -m "Update the hero headline"
```

```bash
git push
```

That is it. Cloudflare notices the push, rebuilds, and updates the live site in
roughly one to two minutes.

Write the commit message as a short description of what you changed. It becomes
your history, and it is how you find your way back if something goes wrong.

### Watching it publish

Cloudflare dashboard → **Workers & Pages** → **race-ready-site** → **Deployments**.

Green means live. Red means the build failed — the live site keeps running the
previous version, so nothing is broken for visitors. Open the failed build, copy
the error, and give it to Codex.

---

## Part 4 — Working with Codex

Codex reads [AGENTS.md](AGENTS.md) automatically, which tells it how this project
works and asks it to explain things in plain language and to check with you
before making assumptions.

Ask for what you want in ordinary words:

- "Change the headline on the hero to X"
- "The FAQ answers are placeholders — here are the real ones"
- "Add a fourth testimonial with this quote from this person"
- "npm test failed with this error: [paste it]"

Good habits:

- **One change at a time.** Easier to check, easier to undo.
- **Run `npm test` after** anything Codex changes.
- **Ask it to explain** if you do not understand what it did. That is a
  reasonable request, not a silly question.

---

## If something goes wrong

### Undo everything since your last publish

This throws away local changes and returns to the last published state:

```bash
git restore .
```

### Roll back the live site

Cloudflare dashboard → **race-ready-site** → **Deployments** → find the last
good one → **Rollback**. Immediate, and it needs no code changes.

### The dev server will not start

Stop it with Ctrl+C, then:

```bash
npm install
```

```bash
npm run dev
```

### Still stuck

Give Codex the exact error text. "It does not work" is hard to help with; the
error message is usually enough to fix it in one step.

---

## Things worth knowing

- **You cannot break the live site by editing locally.** Only `git push` publishes.
- **Every version is kept.** Anything can be undone.
- **The fonts are deliberate.** The design specifies Graphik, which is a paid
  font we are not licensed to publish, so Inter is used instead. Do not swap it
  without reading [docs/figma-to-web.md](docs/figma-to-web.md).
- **Search the code for `TODO(figma)`** to find every place the design was
  incomplete — missing FAQ answers, missing testimonials, the logo.
