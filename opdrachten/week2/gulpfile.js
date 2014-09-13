var gulp    = require('gulp'),
	gutil   = require('gulp-util'),
	uglify  = require('gulp-uglify'),
	less	= require('gulp-less'),
	concat  = require('gulp-concat'),
	minifycss = require('gulp-minify-css')
	notify	= require('gulp-notify');

gulp.task("bundle-css-plugins", function() {
	gulp.src("themes/lgwebdevelopment/assets/css/plugins/*.css")
		.pipe(minifycss().on('error', gutil.log))
		.pipe(concat('assets.min.css'))
		.pipe(gulp.dest("themes/lgwebdevelopment/assets/css/"))
});

gulp.task("bundle-js-plugins", function() {
	gulp.src("themes/lgwebdevelopment/assets/js/plugins/*.js")
		.pipe(uglify().on('error', gutil.log))
		.pipe(concat('assets.min.js'))
		.pipe(gulp.dest("themes/lgwebdevelopment/assets/js/"))
});

gulp.task("minify-script", function() {
	gulp.src("themes/lgwebdevelopment/assets/js/script.js")
	.pipe(uglify().on('error', gutil.log))
	.pipe(concat('script.min.js'))
	.pipe(gulp.dest("themes/lgwebdevelopment/assets/js/"))
});

gulp.task("less", function() {
	gulp.src("themes/lgwebdevelopment/assets/less/style.less")
		.pipe(less({
			"compress": true
		}).on('error', gutil.log))
		.pipe(notify('Less Compiled'))
		.pipe(gulp.dest("themes/lgwebdevelopment/assets/css/"))
		.pipe(minifycss().on('error', gutil.log))	
});

gulp.task("watch", function() {
	gulp.watch('themes/lgwebdevelopment/assets/less/style.less', ['less']);
})

gulp.task('default', ['watch','less']);