interface ImportMetaEnv {
  readonly VITE_BACKEND_API: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}