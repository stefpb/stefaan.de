import gulp from 'gulp';
import util from 'gulp-util';
import rename from "gulp-rename";
// clean
import del from 'del';
// scripts
import babel from 'gulp-babel';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel';
// import exec from 'child_process').exe;

// tpl
import jade from 'gulp-jade';

// style
import sass from 'gulp-sass';
import gulpif from 'gulp-if';
import minifyCss from 'gulp-minify-css';
import sourcemaps from 'gulp-sourcemaps';

// images
import imagemin from 'gulp-imagemin';
import imageResize from 'gulp-image-resize';

// watch
import browser_sync from 'browser-sync';
const browserSync = browser_sync.create();

// init
const production = util.env.production

const paths = {
	allScripts: 'src/scripts/*.js',
	script: 'src/scripts/index.js',
	allStyles: 'src/styles/**/*.scss',
	style: 'src/styles/index.scss',
	allTemplates: 'src/templates/**/*.jade',
	template: 'src/templates/index.jade',
	allPhotos: 'src/photos/**/*',
	svgs: 'src/logo/**/*',
	publicDir: 'public/',
	assetsDir: 'public/assets/',
	imagesDir: 'public/assets/images/',
};

// Tasks

gulp.task('clean', () => {
	return del(paths.publicDir);
});

gulp.task('scripts', () => {
	gulp.src(paths.script)
	    .pipe(webpack(webpackConfig))
	    .pipe(gulp.dest(paths.assetsDir))
	/*
	return gulp.src(paths.allScripts)
		.pipe(babel())
		.pipe(rename('scripts.js'))
		.pipe(gulp.dest(paths.assetsDir));
	*/
});

gulp.task('styles', () => {
	return gulp.src(paths.style)
		.pipe(gulpif(!production, sourcemaps.init()))
		.pipe(sass().on('error', sass.logError))
		.pipe(gulpif(!production, sourcemaps.write('./maps')))
		.pipe(gulpif(production, minifyCss({compatibility: 'ie9'})))
		.pipe(rename('styles.css'))
		.pipe(gulp.dest(paths.assetsDir))
		.pipe(browserSync.stream());
})

gulp.task('templates', () => {
	return gulp.src(paths.template)
		.pipe(jade({
			pretty: !production,
			locals: {
				email: "<script>document.write('stefan@novemo.de')</script>"
			}
		}))
		.pipe(gulp.dest(paths.publicDir));
})

gulp.task('favicon', () => {
	return gulp.src('./src/favicon/**')
		.pipe(gulp.dest(paths.assetsDir + 'favicon/'));
})

gulp.task('resize', () => {
	return gulp.src(paths.allPhotos)
		.pipe(imageResize({
			width: 600,
			height: 400,
			upscale: false,
			// crop: true,
			// format: 'jpg'
		}))
		.pipe(imagemin())
		.pipe(gulp.dest(paths.imagesDir))
})

gulp.task('fonts', () => {
	return gulp.src([
		'bower_components/open-sans-fontface/fonts/**',
		'bower_components/font-awesome/fonts/**'
	])
		.pipe(gulp.dest('public/assets/fonts'))
})

gulp.task('watch', () => {
	gulp.watch(paths.allScripts, ['scripts']);
	gulp.watch(paths.allStyles, ['styles']);
	gulp.watch(paths.allTemplates, ['templates']);
	gulp.watch(paths.allPhotos, ['resize']);
});

gulp.task('browser-sync', () => {
	browserSync.init({
		open: false,
		server: {
			baseDir: paths.publicDir
		}
	})
});

gulp.task('copy', () => {
	gulp.src(paths.svgs)
		.pipe(gulp.dest(paths.imagesDir))
})

gulp.task('default', () => {
	gulp.start('favicon');
	gulp.start('templates');
	gulp.start('styles');
	gulp.start('resize');
	gulp.start('scripts');
	gulp.start('fonts');
	gulp.start('copy');
	
	if (!production) {
		gulp.start('watch')
		gulp.start('browser-sync')
	}
});
