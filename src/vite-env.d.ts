/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the feed proxy (Cloudflare Worker). */
  readonly VITE_FEED_PROXY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
