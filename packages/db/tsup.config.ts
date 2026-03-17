import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    utils: 'src/utils.ts',
  },
  format: ['cjs', 'esm'],
  dts: false,
  sourcemap: true,
  clean: true,
  bundle: false,
  target: 'es2022',
  outDir: 'dist',
  onSuccess:
    'node -e "const fs=require(\'fs\');const path=require(\'path\');const src=path.resolve(\'src/generated\');const dst=path.resolve(\'dist/generated\');if(!fs.existsSync(src)){console.warn(\'@pytholit/db: src/generated is missing. Run: pnpm --filter @pytholit/db db:generate\');process.exit(0);}fs.mkdirSync(path.dirname(dst),{recursive:true});fs.rmSync(dst,{recursive:true,force:true});fs.cpSync(src,dst,{recursive:true});console.log(\'@pytholit/db: copied generated prisma client to dist/generated\');"',
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.js',
    };
  },
});
