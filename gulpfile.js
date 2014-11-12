var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var angularInjector = require('gulp-angular-injector');
var templateCache = require('gulp-angular-templatecache');
var sass = require('gulp-sass');
var bower = require('gulp-bower');
var browserSync = require('browser-sync');
var streamqueue = require('streamqueue');
// var imagemin = require('gulp-imagemin');
// var pngcrush = require('imagemin-pngcrush');


gulp.task('home', function () {
    gulp.src('./src/html/index.html')
        // .pipe(jade())
        .pipe(gulp.dest('./app/'));
});

gulp.task('imagemove', ['home'], function () {
    gulp.src('./src/images/**/*')
        // .pipe(jade())
        .pipe(gulp.dest('./app/assets/images/'));
});

gulp.task('json', ['imagemove'], function () {
    gulp.src('./src/data/data.json')
        .pipe(gulp.dest('./app/assets/data/'));
    gulp.src('./src/projects/*.html')
        // .pipe(jade())
        .pipe(gulp.dest('./app/projects/'));
});

gulp.task('templates', ['json'], function () {
    return streamqueue({ objectMode: true },
        gulp.src('./src/html/*.html')
        )
        .pipe(templateCache('./temp/templateCache.js', { module: 'templatescache', standalone: true }))
        .pipe(gulp.dest('./src/js/'));
});

gulp.task('scripts', ['templates'], function () {
    return streamqueue({ objectMode: true },

        gulp.src('./src/js/app.js'),
        gulp.src('./src/js/temp/templateCache.js')
    )
        .pipe(concat('app.js'))
        .pipe(angularInjector())
        .pipe(uglify())
        .pipe(gulp.dest('./app/assets/js/'));
});


gulp.task('build', ['scripts'], function () {
    gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./app/assets/css/'));
});

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest('./app/assets/js/lib/'))
});

gulp.task('watch', function () {
    gulp.watch(
        ['./src/html/*.html', './src/js/*.js', './src/scss/*.scss', './src/data/*.json','./src/projects/*.html','./bower_components'],
        ['build']
    )
});

gulp.task('sync', function () {
    var files = [
        'app/*.html',
        'app/*.html',
        'app/assets/js/*.js',
        'app/assets/css/*.css',
        'app/assets/data/*.json'
        'app/projects*.html'
    ];

    browserSync.init(files, {
        server: {
            baseDir: './app'
        }
    });
});

gulp.task('default', ['build', 'bower', 'watch', 'sync']);


// gulp.task('images', ['scripts'], function () {
//     return gulp.src('./src/images/*/**')
//         .pipe(imagemin({
//             progressive: false,
//             svgoPlugins: [
//                 {removeViewBox: false}
//             ],
//             use: [pngcrush()]
//         }))
//         .pipe(gulp.dest('./app/assets/images/'));
// });