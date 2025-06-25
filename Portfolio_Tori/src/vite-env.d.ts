/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL_PRODUCTION: string;
  readonly VITE_API_BASE_URL_DEV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}