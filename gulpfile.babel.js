import gulp from 'gulp';
import mjml from'gulp-mjml';
import imagemin from 'gulp-imagemin';
import browser from 'browser-sync';


function reload(done) {
  browser.reload();
  done();
}


function browserServe(done) {
  browser.init({
    server: 'dist'
  });
  done();
}


const basePaths = {
    src: 'src/',
    dest: 'dist/'
};

const paths = {
    html: {
        src: basePaths.src + '*.mjml',
        dest: basePaths.dest + ''
    },
    includes: {
        src: basePaths.src + 'includes/*.mjml'
    },
    components: {
        src: basePaths.src + 'components/*.mjml'
    }
};


// Watch for file changes
function watchFiles() {
  gulp.watch(paths.html.src).on('change', gulp.series(mjmlBuild, reload));
  gulp.watch(paths.includes.src).on('change', gulp.series(mjmlBuild, reload));
  gulp.watch(paths.components.src).on('change', gulp.series(mjmlBuild, reload));
}

function mjmlBuild() {
  return gulp.src(paths.html.src)
    .pipe(mjml())
    .pipe(gulp.dest(paths.html.dest))
}

function optimizeImgs () {
   return gulp.src('src/images/**/*.{jpg,png,svg}')
		.pipe(imagemin([
			imagemin.mozjpeg({quality: 80, progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({
					plugins: [
						{removeViewBox: true},
						{cleanupIDs: false}
					]
				})
		]))
    .pipe(gulp.dest('dist/images'));
}


gulp.task('default', gulp.series(mjmlBuild, browserServe, watchFiles));
gulp.task('build', gulp.series(mjmlBuild, optimizeImgs, watchFiles));


