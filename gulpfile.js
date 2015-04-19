/**
 * Created by linjie on 2014/10/30.
 */
    /*
        gulp --path=home 设置对应路劲目录下的gulp 自动化 默认是home  可定义
        gulp   在本地目录生产对应文件
        gulp watch   测试调试
        gulp bulid   上线文件发布 以及版本号控制
     */

var gulp = require('gulp');
var less = require('gulp-less');
var mincss = require('gulp-minify-css');
var minhtml = require('gulp-minify-html');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imgmin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var htmlreplace = require('gulp-html-replace');
var includer = require('gulp-html-ssi');
var argv  = require('yargs').argv;

var  path = argv.path || "static";

/*
    获取当前时间
 */
function getTime(){
    var d = new Date();
    var y = d.getFullYear().toString();
    var m = d.getMonth()+1;
    var r = d.getDate();
    var h = d.getHours();
    var n = d.getMinutes();
    n = n >= 10 ? n : "0" + n;
    return y + m + r + h + n;
}

function setNewPath(){
    var t = getTime();
    path = path + t;
    paths_after = {
        html: './' + path + '/',
        css: './' + path + '/css',
        js: './' + path + '/js',
        img: './' + path + '/images'
    };
    return t;
}
/*
    路劲定义
 */
var paths_before = {
    html : './views/*.html',
    js : './static/js/*.js',
    img : './static/images/*'
};
/*
    自动化生产后的路劲
 */
var paths_after = {
    html : ' ./views/',
    js : './static/js',
    img : './static/images'
}
/*
    less 文件解析成 css 文件
    css 压缩
*/
// gulp.task('less',function(){
//     return gulp.src(paths_before.css)
//         .pipe(less())
//         .pipe(mincss())
//         .pipe(gulp.dest(paths_after.css));
// });

/*
    js检测
    合并js文件
    压缩js
 */
gulp.task('minjs',function(){
    return gulp.src(paths_before.js)
        .pipe(jshint())
        .pipe(concat('mobvista.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths_after.js))
});

/*
    图片压缩
 */
gulp.task('minimg',function(){
    return gulp.src(paths_before.img)
        .pipe(imgmin())
        .pipe(gulp.dest(paths_after.img))
});

/*
    监听 less 修改和 js修改
 */
gulp.task('watch',function(){
    gulp.watch(paths_before.js,['minjs']);
});


/*
 给html页面上的css和js 添加版本号
 压缩html
 */
gulp.task('minhtml',function(){
    var t = setNewPath();
    return gulp.src(paths_before.html)
        .pipe(htmlreplace({
            'css': 'style/mobvista.min.css?v=' + t,
            'js': 'js/mobvista.min.js?v=' + t
        }))
        .pipe(minhtml())
        .pipe(gulp.dest(paths_after.html))
});


/*
    测试环境生产版本
 */
gulp.task('default', ['minjs',]);

/*
    上线版本发布 以及 对应的版本号控制
 */
gulp.task('bulid',['minhtml','minjs','minimg']);