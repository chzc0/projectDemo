// 引入 gulp及组件
var set = { src: 'project/src', dist: 'project/static' },
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),       //压缩css
    spriter = require('gulp-css-spriter'),       //css合并雪碧图
    jshint = require('gulp-jshint'),          //js代码校验
    uglify = require('gulp-uglify'),          //压缩JS
    imagemin = require('gulp-imagemin'),      //压缩图片
    base64 = require('gulp-base64'),
    rename = require('gulp-rename'),          //合并js文件
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    cache = require('gulp-cache'),
    less = require('gulp-less'),
    htmlmin = require('gulp-htmlmin'),
    livereload = require('gulp-livereload'),
    RevAll = require('gulp-rev-all'),
    del = require('del');

gulp.task('styles', function () {
    return gulp.src(set.src + '/css/*.css')
    //.pipe(rename({ suffix: '.min' }))
    .pipe(minifycss({
        advanced: true, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
        compatibility: 'ie7',//类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
        keepBreaks: false //类型：Boolean 默认：false [是否保留换行]
    }))
    //.pipe(base64({
    //    //baseDir: 'hlwdh/images',
    //    extensions: ['svg', 'png', 'jpg', 'gif'],
    //    exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
    //    maxImageSize: 2 * 1024, // bytes 
    //    debug: true
    //}))
    //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    //.pipe(autoprefixer({
    //    browsers: ['> 1%'],
    //    cascade: true, //是否美化属性值 默认：true 像这样：
    //    //-webkit-transform: rotate(45deg);
    //    //        transform: rotate(45deg);
    //    remove: true //是否去掉不必要的前缀 默认：true 
    //}))
    .pipe(gulp.dest(set.dist + '/css/'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('cssSpriter', function () {
    //需要自动合并雪碧图的样式文件
    return gulp.src(set.src + '/css/*.css')
        .pipe(spriter({
            // 生成的spriter的位置
            'spriteSheet': set.dist + '/images/sprite.png',
            // 生成样式文件图片引用地址的路径
            // 如下将生产：backgound:url(../images/sprite20324232.png)
            'pathToSpriteSheetFromCSS': '../images/sprite.png'
        }))
        //.pipe(rename({ suffix: '.sprite.min' }))
        .pipe(minifycss({
            advanced: true,
            compatibility: 'ie7',
            keepBreaks: false
        }))
        //产出路径
        .pipe(gulp.dest(set.dist + '/css/'))
        .pipe(notify({ message: 'cssSpriter task complete' }));
});
// Scripts
gulp.task('scripts', function () {
    return gulp.src(set.src + '/js/project/*.js')
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('default'))
      //.pipe(concat('main.js'))
      //.pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(gulp.dest(set.dist + '/js/project/'))
      .pipe(notify({ message: 'Scripts task complete' }));
});
gulp.task('js_lib', function () {
    var lib_src = set.src + '/js/lib/*.js',
    lib_dst = set.dist + '/js/lib/';
    gulp.src(lib_src)
        .pipe(gulp.dest(lib_dst))
        .pipe(notify({ message: 'js_lib task complete' }));
});
// Images
gulp.task('images', function () {
    var src = set.src + '/images/*', dst = set.dist + '/images/';
    return gulp.src(src)
      .pipe(imagemin({
          optimizationLevel: 5,
          progressive: true,
          interlaced: true,
          multipass: true
      }))
      .pipe(gulp.dest(dst))
      .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('html', function () {
    var src = set.src + '/html/*.html',dst = set.dist + '/html/';
    gulp.src(src)
        .pipe(htmlmin())
        .pipe(gulp.dest(dst))
        .pipe(notify({ message: 'html task complete' }));
});
gulp.task('less', function () {
    var src = set.src + '/less/*.less', dst = set.dist + '/css/';
    gulp.src(src)
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(less())
        .pipe(gulp.dest(dst));
});

// Clean  任务执行前，先清除之前生成的文件
gulp.task('clean', function (cb) {
    del([set.dist + '/css/', set.dist + '/js/project/', set.dist + '/images/']);
    cb();
});

// Default task  设置默认任务
gulp.task('default', ['clean'], function () {
    gulp.start('cssSpriter', 'less', 'scripts', 'js_lib', 'images', 'html');
});

// Watch
gulp.task('watch', function () {
    // Watch .scss files
    gulp.watch(set.src + '/css/*.css', ['cssSpriter']);
    // Watch html files
    gulp.watch(set.src + '/less/*.less', ['less']);
    // Watch .js files
    gulp.watch(set.src + '/js/project/*.js', ['scripts']);
    // Watch image files
    gulp.watch(set.src + '/images/*', ['images']);
    // Watch html files
    gulp.watch(set.src + '/html/*.html', ['html']);
    // Create LiveReload server
    livereload.listen();
    // Watch any files in hlwdh/, reload on change
    gulp.watch([set.dist + '/**']).on('change', livereload.changed);

});
