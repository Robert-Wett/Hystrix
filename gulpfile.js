/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulp/tasks. Any files in that directory get
  automatically required below.
  To add a new task, simply add a new task file that directory.
  gulp/tasks/default.js specifies the default set of tasks to run
  when you run `gulp`.
*/
require('babel-register');
var require_dir = require('require-dir'),
    gulp        = require('gulp'),
    del         = require('del'),
    config      = require('./tasks/config');


require_dir('./tasks/tasks',{recurse:true});

// CLEAN
gulp.task('clean', function (cb) {
  del([config.build.path], cb);
});
