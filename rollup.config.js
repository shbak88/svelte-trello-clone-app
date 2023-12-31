import path from 'path';

import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import strip from '@rollup/plugin-strip';

import { spawn } from 'child_process';
import svelte from 'rollup-plugin-svelte';
import livereload from 'rollup-plugin-livereload';

import sveltePreprocess from 'svelte-preprocess';

import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import replace from 'rollup-plugin-replace';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,

			css: css => {
				css.write('bundle.css');
			},
			
			preprocess : sveltePreprocess({
				scss: {
					prependData: '@import "./src/scss/main.scss";',
				},
				postcss: {
					plugins: [
						require('autoprefixer')()
					]
				}
			}),

			
		}),

		replace({
			values: {
				'crypto.randomBytes': 'require("randomBytes")'
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),

		commonjs(),

		globals(),
		
		builtins(),

		alias({
			entries: [
				{ 
					find: '~',
					replacement: path.resolve(__dirname, 'src/')
				}
			]
		}),


		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		production && strip({
			include: '**/*.(svelte|js)',
		})

	],
	watch: {
		clearScreen: false
	}
};
