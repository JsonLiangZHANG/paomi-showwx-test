//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    sass = require('gulp-sass');

//编译sass
gulp.task('copy',function () {//定义一个任务  拷贝一个文件
    gulp.src('/src/main/webapp/static/sass/*.scss')//指定要成功优酷的文件
        .pipe(gulp.dest('./src/main/webapp/static/css'))//指定要输出的文件路径 指定目录不是文件
})