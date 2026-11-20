# Best Number Card – notes for development

- Lovelace custom card (HACS category "Dashboard"), TypeScript + Lit, bundled with Rollup to `dist/best-number-card.js`.
- `npm run typecheck`, `npm test`, `npm run build` must pass; commit the rebuilt `dist/`.
- **Versioning:** every change to the card (src/dist) bumps `version` in `package.json`
  (patch for fixes, minor for features). Merging to `main` then creates the release `vX.Y.Z` automatically,
  which is what HACS offers as an update. CI fails if a PR changes the card while its version is already released.
- UI strings: English + German in `src/localize.ts`.
- Keep the data loading cheap: one `history/stream` subscription, long-term statistics for long ranges, in-memory cache.
