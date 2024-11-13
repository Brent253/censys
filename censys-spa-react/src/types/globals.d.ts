// src/types/global.d.ts

declare global {
  // Define the structure of `import.meta.env`
  interface ImportMetaEnv {
    VITE_API_URL: string;
    VITE_API_KEY: string;
    VITE_API_SECRET: string;
  }

  interface ImportMeta {
    env: ImportMetaEnv;
  }

  // Extend globalThis to include `import.meta`
  var import: ImportMeta;
}

export {};  // To make this file a module, otherwise it won't work
