This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# WebAR Wedding Invitation

The existing invitation stays at `/`. A separate browser-based AR experience lives at `/ar`. Guests do not install an app. Tracking runs locally in the phone browser with MindAR.

## 1. Install dependencies

```bash
npm install
```

`mind-ar` lists native `canvas` for its Node compiler. This project stubs that package (see `vendor/canvas-stub`) because AR runs entirely in the browser.

## 2. Generate MindAR target

The physical invitation is the image target. Do not skip this step — there is no placeholder `targets.mind` in the repo.

1. Export the final wedding invitation as a high-quality JPG or PNG. Unique artwork tracks better than large blocks of plain text.
2. Open the free [MindAR Image Target Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile).
3. Upload the invitation image (one image, target index `0`).
4. Generate the `.mind` file.
5. Download it.
6. Rename it to `targets.mind`.
7. Put it here: `public/ar/targets.mind`

The app loads `/ar/targets.mind`. Until that file exists, `/ar` still opens; starting the camera shows a friendly “not ready yet” message.

Optional later: add `public/ar/videos/story.mp4` for a muted video plane after detection.

## 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the invitation and [http://localhost:3000/ar](http://localhost:3000/ar) for AR. Camera access needs HTTPS in production; localhost is allowed.

## 4. Production build

```bash
npm run build
```

## 5. Deploy

This site deploys on Netlify with `@netlify/plugin-nextjs` (`netlify.toml`). `/ar` is a normal App Router page. `public/ar/targets.mind` is served as a static file at `/ar/targets.mind`. No extra Netlify redirects are required.

Set `NEXT_PUBLIC_SITE_URL` (already used for invite links) and optionally `NEXT_PUBLIC_AR_URL` if the AR URL should differ.

The same layout works on Vercel.

## 6. QR code

Print a QR code that points to:

```text
https://YOUR-DOMAIN/ar
```

Or set:

```text
NEXT_PUBLIC_AR_URL=https://your-wedding-domain.com/ar
```

If that variable is empty, the on-page QR uses `NEXT_PUBLIC_SITE_URL/ar`, then the current origin. The `/ar` intro screen already renders a printable QR. Keep decorations off the code itself and leave a quiet white margin around it.
