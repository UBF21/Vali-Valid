# Changelog

All notable changes to vali-valid are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [3.1.0] — 2026-03-24

### Added
- Subpath exports: `vali-valid/react`, `vali-valid/vue`, `vali-valid/svelte`, `vali-valid/core`
- ESM + CJS dual build via tsup (previously CJS-only via tsc)
- Vue 3 adapter (`useValiValid` composable) with 75 tests
- Svelte 4 adapter (`createValiValid` with stores) with 92 tests
- `peerDependencies` optional for React, Vue, Svelte
- i18n: Portuguese (pt), French (fr), German (de) added to existing en/es
- `ValidationConfigOr` added to `ValidationsConfig` union (type safety fix)
- `validateOnMount`, `asyncTimeout`, `criteriaMode` options in React hook
- `trigger()`, `clearErrors()` methods in React hook

### Changed
- Build system migrated from `tsc` to `tsup` (dual ESM+CJS output)
- `as any` casts eliminated from core engine, React hook, Vue adapter, Svelte adapter (0 remaining)
- Type safety improved from 72% → 95%+
- 897 tests (up from 730)

### Fixed
- `SYNTHETIC_*` case labels no longer require `as any` cast
- `ValidationConfigOr` now correctly included in `ValidationsConfig` union

## [2.1.2] — 2025 (previous)

### Added
- Major refactor with 63 validators
- React hook (`useValiValid`)
- i18n support (en, es)
- Cross-framework engine foundation

### Changed
- Core engine rewritten for extensibility across frameworks

## [1.0.0] — initial

### Added
- Initial release of ValiValid TypeScript form validation library
- Basic form field validation
- React integration
