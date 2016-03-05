import gulp from 'gulp';
import path from 'path';
import gulpAutoprefixer from 'gulp-autoprefixer';
import gulpInject from 'gulp-inject';
import gulpSourcemaps from 'gulp-sourcemaps';
import gulpSass from 'gulp-sass';
import wiredep from 'wiredep';
import webpackStream from 'webpack-stream';

import conf from './conf';

gulp.task('build', [ 'merge-js', 'merge-css' ],
          function() { return createIndexFile(conf.paths.serve); });

function createIndexFile(indexPath) {
  let css = gulp.src(path.join(indexPath, '**/*.css'), {read : false});

  let js = gulp.src(path.join(indexPath, '**/*.js'), {read : false});

  let injectOptions = {
    // Make the dependencies relative
    ignorePath : [ path.relative(conf.paths.base, indexPath) ],
    addRootSlash : false,
    quiet : true
  };

  let wiredepOptions = {
    // Make wiredep dependencies begin with "bower_components/" not "../../...".
    ignorePath : `${path.relative(conf.paths.src, conf.paths.base)}/`
  };

  return gulp.src(path.join(conf.paths.src, 'index.html'))
      .pipe(gulpInject(css, injectOptions))
      .pipe(gulpInject(js, injectOptions))
      .pipe(wiredep.stream(wiredepOptions))
      .pipe(gulp.dest(indexPath))
      .pipe(gulp.dest(conf.paths.base));
}

gulp.task('merge-js', function() {
  let webpackOptions = {
    devtool : 'inline-source-map',
    module : {
      loaders : [
        {
          test : /\.js$/,
          exclude : /node_modules/,
          loaders : [ 'babel-loader' ]
        }
      ]
    },
    output : {filename : 'app-merged.js'},
    resolve : {root : conf.paths.src},
    quiet : true
  };

  return gulp.src(path.join(conf.paths.src, 'app.js'))
      .pipe(webpackStream(webpackOptions))
      .pipe(gulp.dest(conf.paths.serve))
      .pipe(gulp.dest(conf.paths.base));
});

gulp.task('merge-css', function() {
  let sassOptions = {style : 'expanded'};

  return gulp.src(path.join(conf.paths.src, '**/*.scss'))
      .pipe(gulpSourcemaps.init())
      .pipe(gulpSass(sassOptions))
      .pipe(gulpAutoprefixer())
      .pipe(gulpSourcemaps.write("."))
      .pipe(gulp.dest(conf.paths.serve))
      .pipe(gulp.dest(conf.paths.base));
});
