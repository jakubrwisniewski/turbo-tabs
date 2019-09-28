const gulp = require('gulp');
const concat = require('gulp-concat');
const less = require('gulp-less');
const minifyCSS = require('gulp-clean-css');
const terser = require('gulp-terser');

const scripts = './source/*.js';
const styles = './source/*.less';

const dest = './dist';

const error = (stream, e) => {
    console.log(e);
	stream.end();
}

gulp.task('default', () => {
    gulp.watch(scripts, () => {

		let stream = gulp.src(scripts);
		stream
			.pipe(concat('turbo-tabs.js'))
			.pipe(gulp.dest(dest));

		// production
		stream = gulp.src(scripts);
		stream
			.pipe(concat('turbo-tabs.min.js'))
			.pipe(terser())
            .pipe(gulp.dest(dest));

        return stream;
    });

    gulp.watch(styles, () => {

		let stream = gulp.src(styles);
        stream
            .pipe(less())
			.pipe(concat('turbo-tabs.css'))
			.pipe(gulp.dest(dest));

		// production
		stream = gulp.src(styles);
		stream
            .pipe(less())
			.pipe(concat('turbo-tabs.min.css'))
			.pipe(minifyCSS())
            .pipe(gulp.dest(dest));

        return stream;
    });
});


// return;

// const gutil = require('gulp-util');
// const minifyCSS = require('gulp-clean-css');
// const sourcemaps = require('gulp-sourcemaps');
// const wrap = require('gulp-wrap');
// const replace = require('gulp-replace');
// // const debug = require('gulp-debug');

// const config = require('./gulp-config.js');
// const tasks = new Map();

// // fix media path in all bundles
// Object.values(config.bundles).forEach(function(bundle) {
// 	if(bundle.js) {
// 		bundle.js = bundle.js.map(x => `media/${x}`);
// 	}

// 	if(bundle.less) {
// 		bundle.less = bundle.less.map(x => `media/${x}`);
// 	}
// });

// //fix tesing paths
// config.testing = config.testing.map(path => `media/${path}`);

// function error(stream, e) {
// 	gutil.log(e);
// 	stream.end();
// }

// function createJavaScriptTask(bundle) {
// 	const taskName = `bundle:js:${bundle.name}`;

// 	gulp.task(taskName, function() {
// 		//development
// 		let stream = gulp.src(bundle.js);
// 		stream
// 			.pipe(sourcemaps.init())
// 			.pipe(wrap('(function(){<%= contents %>})();'))
// 			.pipe(concat(`${bundle.name}.js`))
// 			.pipe(sourcemaps.write(config.path.maps))
// 			.pipe(gulp.dest(config.path.static));

// 		// production
// 		stream = gulp.src(bundle.js);
// 		stream
// 			.pipe(wrap('(function(){<%= contents %>})();'))
// 			.pipe(concat(`${bundle.name}.min.js`))
// 			.pipe(uglify().on('error', error.bind(error, stream)))
// 			.pipe(gulp.dest(config.path.static));
// 	});

// 	tasks.set(taskName, {
// 		name: taskName,
// 		watch: bundle.js
// 	});

// 	gutil.log('Task ' + taskName + ' prepared');

// 	return taskName;
// }

// function createLessTask(bundle) {
// 	const taskName = `bundle:less:${bundle.name}`;

// 	gulp.task(taskName, function() {
// 		// development
// 		let stream = gulp.src(bundle.less);
// 		stream
// 			.pipe(sourcemaps.init())
// 			.pipe(less().on('error', error.bind(error, stream)))
// 			.pipe(concat(`${bundle.name}.css`))
// 			.pipe(minifyCSS().on('error', error.bind(error, stream)))
// 			.pipe(sourcemaps.write(config.path.maps))
// 			.pipe(gulp.dest(config.path.static));

// 		// production
// 		stream = gulp.src(bundle.less);
// 		stream
// 			.pipe(less().on('error', error.bind(error, stream)))
// 			.pipe(concat(`${bundle.name}.min.css`))
// 			.pipe(minifyCSS().on('error', error.bind(error, stream)))
// 			.pipe(gulp.dest(config.path.static));
// 	});

// 	tasks.set(taskName, {
// 		name: taskName,
// 		watch: bundle.less
// 	});

// 	gutil.log('Task ' + taskName + ' prepared');

// 	return taskName;
// }

// function start(name) {
// 	setTimeout(() => gulp.start(name), 0);
// }

// function prepareTasks(props) {
// 	const tasks = [];

// 	Object.keys(config.bundles).map(function(name) {
// 		config.bundles[name].name = name;
// 		return config.bundles[name];
// 	}).forEach(function(bundle) {
// 		if(props.less && bundle.less) {
// 			tasks.push(createLessTask(bundle));
// 		}

// 		if(props.js && bundle.js) {
// 			tasks.push(createJavaScriptTask(bundle));
// 		}
// 	});

// 	return tasks;
// }

// gulp.task('bundle:less', function() {
// 	prepareTasks({ less: true }).forEach(start);
// });

// gulp.task('bundle:js', function() {
// 	prepareTasks({ js: true }).forEach(start);
// });

// gulp.task('bundle', function() {
// 	prepareTasks({ less: true, js: true }).forEach(start);
// });

// gulp.task('watch', function() {
// 	prepareTasks({ less: true, js: true}).map(function(task) {
// 		return tasks.get(task);
// 	}).forEach(function(task) {
// 		start(task.name);
// 		gulp.watch(task.watch, [task.name]);
// 	});
// });

// gulp.task('mocha:build', function() {
// 	gulp.src(config.testing)
// 		.pipe(wrap('(function(){<%= contents %>})();'))
// 		.pipe(concat('all.js'))
// 		.pipe(replace('= require(', '= ui.require('))
// 		.pipe(replace('define(', 'ui.define('))
// 		.pipe(gulp.dest('media/testing'));
// });

// gulp.task('mocha', function() {
// 	gulp.watch(config.testing, ['mocha:build']);
// 	start('mocha:build');
// });
