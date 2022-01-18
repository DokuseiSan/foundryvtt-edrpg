const eslint      = require("gulp-eslint7");
const gulp        = require("gulp");
const gulpIf      = require("gulp-if");
const mergeStream = require("merge-stream");

const parsedArgs  = require("yargs").argv;

const LINTING_PATHS = ["./edrpg/edrpg.js", "./edrpg/module/"];

// eslint-disable-next-line jsdoc/require-jsdoc
function lintJavascript() {
	const applyFixes = !!parsedArgs.fix;

	const tasks = LINTING_PATHS.map(path => {
		const src = path.endsWith("/")
			? `${path}**/*.js`
			: path;

		const dest = path.endsWith("/")
			? path
			: `${path.split("/").slice(0, -1).join("/")}/`;

		return gulp
			.src(src)
			.pipe(eslint({fix: applyFixes}))
			.pipe(eslint.format())
			.pipe(gulpIf(file => file.eslint != null && file.eslint.fixed, gulp.dest(dest)));
	});

	// eslint-disable-next-line no-useless-call
	return mergeStream.call(null, tasks);
}

exports.lint = lintJavascript;
