const esbuild = require('esbuild');

const isWatch = process.argv.includes('--watch');

const buildOptions = {
    entryPoints: ['./src/extension.ts'],
    bundle: true,
    outfile: 'out/extension.js',
    external: ['vscode'],
    format: 'cjs',
    platform: 'node',
    target: 'node16',
    sourcemap: false,  // Không cần sourcemap cho production
    minify: true,      // Minify code để giảm size
    treeShaking: true, // Loại bỏ dead code
};

async function build() {
    try {
        if (isWatch) {
            console.log('👀 Starting esbuild in watch mode...');
            const ctx = await esbuild.context(buildOptions);
            await ctx.watch();
            console.log('✅ Watching for changes...');
        } else {
            console.log('🔨 Building production bundle...');
            await esbuild.build(buildOptions);
            console.log('✅ Production build complete!');
        }
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

build();
