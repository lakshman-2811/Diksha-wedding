# A Wedding Story — Luxury invitation website

A responsive, editorial-style wedding invitation built with React, Vite, TypeScript, Tailwind CSS and Framer Motion. The project includes a cinematic welcome, timezone-aware countdown, story timeline, local-image gallery with keyboard-accessible lightbox, wedding-film modal, venue directions and optional user-controlled music.

## 1. Personalize the invitation

All event details and media references live in **`src/config.ts`**. Update:

- `bride` and `groom`
- `date.year` (month is 1–12; December is `12`), day, hour and minute (24-hour clock)
- `timezone` using an IANA timezone such as `Asia/Kolkata`
- `venue`, `address`, `mapsUrl`, invitation and closing copy
- hero, gallery, video and music asset paths

The countdown converts the configured local wall-clock time into an absolute timestamp using `Intl.DateTimeFormat` and the configured IANA timezone. It ticks once per second, handles invalid dates/timezones, and switches to a celebration message at zero. No duration is hardcoded.

## 2. Add your photographs and film

Replace the sample SVGs in `public/assets/` with your own optimized assets. Keep the filenames and paths in `config.ts`, or update the paths there. Recommended: WebP or AVIF photos, sensible mobile/desktop dimensions, and compressed MP4 (H.264) video. The sample SVG artwork is locally stored and works offline; it is deliberately a placeholder, not a real couple photograph.

- `hero-art.svg`: full-screen cover image
- `gallery-1.svg` … `gallery-6.svg`: gallery and story photographs
- `video-poster.svg`: film poster / thumbnail
- `wedding-film.mp4`: add your local film here; the file is intentionally not included
- `our-song.mp3`: add an audio file here; the file is intentionally not included

### Video providers

In `src/config.ts`, set `video.type` to `local`, `youtube`, or `vimeo`.

- `local`: `video.src` is a path such as `/assets/wedding-film.mp4`
- `youtube`: `video.src` is the YouTube video ID (not the full URL)
- `vimeo`: `video.src` is the Vimeo video ID

The video opens only after the visitor presses play. Background audio also requires a manual click; it never autoplays.

## 3. Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## 4. Production build

```bash
npm run build
npm run preview
```

Vite writes the deployable site to `dist/`.

## 5. Deploy to Netlify

This repository includes `netlify.toml` with the correct build command and publish directory.

1. Push the project to a GitHub repository.
2. In Netlify, choose **Add new site → Import an existing project** and select the repository.
3. Keep build command `npm run build` and publish directory `dist` (Netlify also reads these from `netlify.toml`).
4. Deploy. Future pushes to the connected branch trigger new deployments.

## Project structure

```text
wedding-invitation/
├── public/
│   └── assets/                 # Replaceable local placeholder media
├── src/
│   ├── components/
│   │   ├── Countdown.tsx       # Live, timezone-aware countdown
│   │   └── Reveal.tsx          # Accessible scroll reveal
│   ├── lib/
│   │   └── countdown.ts        # Date conversion and validation
│   ├── App.tsx                 # Page sections and interactions
│   ├── config.ts               # All wedding details and media paths
│   ├── main.tsx
│   └── styles.css
├── index.html                  # SEO and Open Graph metadata
├── netlify.toml
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## Notes

- The countdown date/time is interpreted in `wedding.timezone`, regardless of the visitor's device timezone.
- The weekday in the venue date label is calculated from the configured date and timezone.
- Replace the generic Open Graph image and metadata in `index.html` before sharing publicly.
- Gallery controls support Escape and arrow keys. The site respects `prefers-reduced-motion` and uses native lazy loading for below-the-fold imagery.
