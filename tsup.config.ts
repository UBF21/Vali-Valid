import { defineConfig } from 'tsup';

export default defineConfig([
    {
        entry: { index: 'src/index.ts', core: 'src/core/index.ts' },
        outDir: 'dist/esm',
        format: ['esm'],
        dts: true,
        outExtension: () => ({ js: '.mjs' }),
        clean: true,
        splitting: false,
        sourcemap: true,
        treeshake: true,
    },
    {
        entry: { index: 'src/index.ts' },
        outDir: 'dist/cjs',
        format: ['cjs'],
        dts: true,
        clean: false,
        splitting: false,
        sourcemap: true,
    },
]);
