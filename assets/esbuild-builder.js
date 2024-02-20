import esbuild from "esbuild";
import sveltePlugin from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";

const context = {
  entryPoints: ["./js/app.js", "./svelte/pages/**/*.svelte"],
  mainFields: ["svelte", "browser", "module", "main"],
  conditions: ["svelte", "browser"],
  bundle: true,
  format: "esm",
  outdir: "../priv/static/assets",
  splitting: true,
  plugins: [
    sveltePlugin({
      preprocess: sveltePreprocess({ typescript: true }),
    }),
  ],
  logLevel: "info",
};

const ssrContext = {
  entryPoints: ["./svelte/pages/**/*.svelte"],
  platform: "node",
  mainFields: ["svelte", "main"],
  conditions: ["svelte"],
  bundle: true,
  format: "esm",
  outdir: "../priv/ssr/svelte/pages",
  plugins: [
    sveltePlugin({
      preprocess: sveltePreprocess({ typescript: true }),
      compilerOptions: { generate: "ssr" },
    }),
  ],
  logLevel: "info",
};

async function watch() {
  let ctx = await esbuild.context(context);
  await ctx.watch();
  let ssrCtx = await esbuild.context(ssrContext);
  await ssrCtx.watch();
  console.log("ESBuild is watching for changes...");
}

if (process.argv.includes("--watch")) {
  watch();
} else {
  esbuild
    .build({
      minify: true,
      treeShaking: true,
      ...context,
    })
    .catch(() => process.exit(1));

  esbuild.build(ssrContext).catch(() => process.exit(1));
}
