I bought the [canonni.website](https://canonni.website) domain in mid 2024 for a whopping sum of $20. Why .website? Because it's, shocklingly, you know, a website, and because registration fees for niche TLDs are slightly cheaper than .com. After setting up [my blog](https://blog.canonni.website), I wrote some simple HTML at 2am and alled it a day; some of its contents are still stored on [Wayback Machine](https://web.archive.org/web/20240901163441/http://canonni.website/), but the rest are lost to history, probably for the better.

A few months later, while googling my own name for... reasons, I decided to do a proper makeover using simple some React, creating [this monstrosity](https://old.canonni.website) that barely even worked. This survived surprisingly long, and it would be half a year before I realized its ugliness, watched two Vue tutorials, and spent half a day making [this... design?](https://web.archive.org/web/20250514212102/http://canonni.website/)

I honestly don't know what I was going for, but I'm glad I came to my senses and did a redesign a couple months later, making the design used now. After realizing I'm not smart enough to view Vue, I rewrote the website with React again. The weirdly green Vue design is still available at [this repo](https://github.com/canonnizq/vue.canonni.website) if anyone wants it.

I might do a total makeover in the future, or even scrap the website entirely since it only gets a dozen or so visits a month. But at least for now, `canonni.website` is my website.

## Stack

- React 19 + TypeScript + Vite, deployed on [Vercel](https://vercel.com).
- A single Vercel function (`api/feeds.ts`) that collects social updates. No more
  Cloudflare Worker: the site is no longer a static export, so the proxy lives
  next to the app and is deployed with it.
- [RSSHub](https://rsshub.app) for platforms without a usable native feed.

## Social updates

Every platform is a small declarative file in `src/routes/`:

```ts
export default {
  id: 'bluesky',
  title: 'Bluesky',
  icon: 'bluesky',
  link: 'bsky.app/profile/canonni.website',
  feed: [
    { rsshub: '/bsky/profile/canonni.website' },
    { url: 'https://bsky.app/profile/canonni.website/rss' },
  ],
} satisfies Route;
```

`feed` is an ordered list of sources, tried in parallel and used in order: an
RSSHub route path, or an absolute native feed/API URL for platforms RSSHub
can't serve from a public instance. Platforms with no public feed (Discord,
email, Steam, ...) omit `feed` and their card simply links to the profile.

`server/feeds.ts` fetches the sources server-side, normalises RSS, Atom, JSON
Feed and GitHub public events into a tiny `{ items: FeedItem[] }` payload,
caches it per warm instance, and `api/feeds.ts` serves it at `GET /api/feeds`
with CDN cache headers. The browser never talks to RSSHub directly.

### Configuration

`RSSHUB_BASE` (server-side, no `VITE_` prefix) points the function at an RSSHub
instance; it defaults to `https://rsshub.app`. Set it in the Vercel project's
environment variables, or in `.env.local` for local development — see
`.env.example`.

The public RSSHub instance is shared and rate-limited, and some routes need
server-side configuration (cookies, API keys, a headless browser) or are
anti-bot protected. Bilibili, Instagram and YouTube are the most likely to fail
there. If those cards show "Couldn't load updates.", point `RSSHUB_BASE` at a
[self-hosted RSSHub](https://docs.rsshub.app/install) or add a native feed URL
to that route's `feed` array. Each source is tried by the server; a failing
source only affects its own card.

Platforms with no public update feed at all (Discord, email, Steam, the
Geocaching profile, X/Twitter without server credentials) omit `feed` and their
cards explain that instead of showing a placeholder.

## Development

```sh
npm install
npm run dev          # Vite dev server, /api/feeds served by the dev middleware
npm run build        # typecheck + production build
npm run lint
npm run typecheck
```

## Deployment

Pushed to `master`; Vercel builds with `npm run build`, serves `dist/`, and
deploys `api/feeds.ts` as a Node function.
