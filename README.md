# Daily Health Ledger 🌿

A gentle, private daily tracker for meals, medicines, water and movement — built around a real dietician's chart.

Runs in your browser. Adds to your iPhone home screen as a real-feeling app. Saves your data locally on your phone, never sent anywhere. Works offline once installed.

---

## ✨ Features

- 🌅 **Morning veggie check-in** — tell it what's in your kitchen, it builds the day's meals around what you have
- 🥗 **Smart meal picker** — ~50 meals from the dietician's chart, with one-tap "swap" if you don't want today's pick
- 💊 **Medicine tracker** — Thyroxine (with the empty-stomach timing rule built in) + Folic Acid post-dinner
- 💧 **Water tracker** — 14 glass slots = 3.5L goal, tap to fill
- 🏃 **Exercise + weight log** — quick fields, no ceremony
- 💬 **WhatsApp summary** — one tap to copy a formatted day summary, paste it in a chat with yourself or a family member
- ❤️ **Share button** — pass the link to friends/family who might want their own copy

---

## 📱 Deploy this in ~15 minutes (Vercel — free)

You don't need to know any code. You'll need:
- A free Vercel account ([vercel.com](https://vercel.com))
- A free GitHub account (recommended, but Vercel also accepts direct uploads)

### Step 1 — Get the code online

**Option A: Drag-and-drop (easiest)**

1. Zip this entire folder (or download the zip if it was given to you).
2. Go to [vercel.com/new](https://vercel.com/new) → sign up / log in.
3. Click **"Import"** → drag the zipped folder onto the page (or use the upload button).
4. Vercel detects it's a Vite project automatically. Hit **"Deploy"**.
5. Wait ~30 seconds. You'll get a URL like `health-tracker-abc123.vercel.app`.

**Option B: Through GitHub (recommended for easy updates)**

1. Create a new repo on [github.com](https://github.com).
2. Upload all the files in this folder (use the "Add file → Upload files" button).
3. Go to [vercel.com/new](https://vercel.com/new) → "Import Git Repository" → pick your repo.
4. Hit **"Deploy"**. Same result.

### Step 2 — Add to iPhone home screen

1. On your iPhone, open **Safari** (must be Safari for iOS PWA install — Chrome won't work).
2. Go to your Vercel URL.
3. Tap the **Share** button (square with arrow up).
4. Scroll down → **"Add to Home Screen"**.
5. Name it something nice (e.g. "Health") and tap **Add**.

Done. You'll see the leaf-and-drop icon on your home screen. Tap it — opens fullscreen, no Safari bars, feels like a real app.

### Step 3 — Share with friends and family

In the app, scroll to the **"Share the love"** card and tap **"Share with a friend"**. It'll open the native share sheet (or copy a link). Send it via WhatsApp, iMessage, anything.

Anyone who opens your URL on their iPhone Safari can install it the same way — Step 2 above.

---

## 🛠️ Local development (only if you want to change things)

```bash
npm install
npm run dev
# Opens http://localhost:5173
```

To build for production:

```bash
npm run build
# Output goes to dist/
```

---

## 🤔 FAQ

**"Can I edit the meals/medicines/diet plan?"**
Yes — open `src/HealthTracker.jsx`, scroll to the `MEALS = { ... }` object at the top, and edit. The structure is hopefully self-explanatory. Push the change to your repo (or re-upload to Vercel) and it updates within seconds.

**"Will my data sync between devices?"**
No — data is saved per-device in browser localStorage. This is intentional: nothing leaves your phone, and there's no server, so there's no privacy risk and no monthly cost. If you want sync, that's a future upgrade.

**"What if I clear my Safari cache?"**
Your daily logs would be wiped. The app itself stays installed. If you care about long-term tracking, copy the WhatsApp summary at end of each day into a self-chat — it's your archive.

**"Can I get push notifications / reminders?"**
Not on iPhone, no. Apple restricts PWA notifications heavily. The WhatsApp summary copy-paste is the workaround. For real reminders, you'd need a native app or a WhatsApp bot (a much bigger build).

**"Is the icon by you, or did you steal it?"**
Generated programmatically — see `make_icon.py` if you want to regenerate at different sizes or change colors.

---

## 📝 Credits

Built around Mrs. Vaishnavi Vedantham's diet plans by **Ms. K. Shivani** (vegetarian) and the eggetarian plan from **Fit Mom Club / V Max**. Diet content belongs to them — this is just a tracking shell.

Eat clean · be happy. 🌿
