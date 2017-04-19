var fs = require('fs');
var packageJson = fs.readFileSync("config.json", "utf8");
packageJson = JSON.parse(packageJson);
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: packageJson,
        jshint: {
            options: {
                jshintrc: './.jshintrc'
            },
            dev: {
                src: ['./www/assets/js/**/*.js', '!./www/assets/js/*all.js']
            }
        },
        less: {
            dev: {
                options: {
                    sourceMap: false
                },
                expand: true,
                cwd: 'www/assets/less',
                src: ['**/*.less'],
                dest: 'www/assets/css',
                ext: '.css',
                extDot: 'last'

            },
            min: {
                options: {
                    sourceMap: false,
                    compress: true
                },
                src: ['www/assets/sm/min.less'],
                dest: 'www/assets/css/min.css',
                extDot: 'last'
            },
            test: {
                options: {
                    sourceMap: false,
                    compress: true
                },
                expand: true,
                cwd: 'assets/less',
                src: ['**/*.less'],
                dest: 'assets/css/',
                ext: '.css',
                extDot: 'last'
            }
        },
        postcss: {
            options: {
                map: false,
                processors: [require('autoprefixer')({browsers: ['last 4 versions']})]
            },
            dev: {
                src: 'www/assets/css/**/*.css'
            },
            test: {
                src: 'assets/css/**/*.css'
            }
        },
        watch: {
            less: {
                files: ['www/assets/less/*.less'],
                tasks: ['less:dev', 'postcss:dev']
            },
            js: {
                files: [
                    'www/assets/js/**/*.js', '!www/assets/js/**/*.all.js'
                ],
                tasks: ['concat:dev', 'concat:devApp']
            }
        },
        concat: {
            dev: {
                src: ['www/assets/modules/**/*.js'],
                dest: 'www/assets/js/modules.all.js'
            },
            devApp: {
                src: [
                    'www/assets/js/app.js',
                    'www/assets/js/main.js',
                    'www/assets/js/constant.js',
                    'www/assets/js/router.js',
                    'www/assets/js/wechat-api.js',
                    'www/assets/js/filters/*.js',
                    'www/assets/js/directives/*.js',
                    'www/assets/js/services/*.js'
                ],
                dest: 'www/assets/js/app.all.js'
            },
            dist: {
                src: ['assets/modules/**/*.js'],
                dest: 'assets/js/modules.all.js'

            },
            distApp: {
                src: [
                    'assets/js/app.js',
                    'assets/js/main.js',
                    'assets/js/constant.js',
                    'assets/js/router.js',
                    'assets/js/wechat-api.js',
                    'assets/js/filters/*.js',
                    'assets/js/directives/*.js',
                    'assets/js/services/*.js'
                ],
                dest: 'assets/js/app.all.js'
            }
        },
        copy: {
            test: {
                files: [
                    // makes all src relative to cwd
                    {
                        expand: true,
                        cwd: 'www/',
                        src: [
                            'index.html', 'template/**/*.html'
                        ],
                        dest: 'html/',
                        filter: 'isFile'
                    },
                    // makes all src relative to cwd
                    {
                        expand: true,
                        cwd: 'www/assets/',
                        src: ['**'],
                        dest: 'assets/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        clean: {
            test: {
                src: ['html/', 'assets/', '.tmp/']
            },
            less: {
                src: ['assets/less']
            }
        },
        replace: {
            test: {
                src: [
                    'html/**/*.html', 'assets/js/**/*.js', 'assets/less/*.less'
                ],
                overwrite: true,
                replacements: [
                    {
                        from: /(\.*\/)?\.*\/img(.)*\.(png|jpg|ico|gif)/g,
                        to: function (matchedWord) {
                            return matchedWord + '?v=' + version;
                        }
                    }, {
                        from: /(\.*\/)?\.*\/assets\//g,
                        to: "<%= pkg.staticTestUrl %>"
                    }
                ]
            },
            release: {
                src: [
                    'html/**/*.html', 'assets/js/**/*.js', 'assets/less/*.less'
                ],
                overwrite: true,
                replacements: [
                    {
                        from: /(\.*\/)?\.*\/img(.)*\.(png|jpg|ico|gif)/g,
                        to: function (matchedWord) {
                            return matchedWord + '?v=' + version;
                        }
                    }, {
                        from: /(\.*\/)?\.*\/assets\//g,
                        to: "<%= pkg.staticReleaseUrl %>"
                    }
                ]
            },
            config: {
                src: ['assets/js/config.all.js'],
                overwrite: true,
                replacements: [
                    {
                        from: /v=\d+/g,
                        to: function () {
                            return 'v=' + version;
                        }
                    }/*, {
                    from: /http(s)?:\/\/(\w|\.|:)+/g,
                    to: function () {
                        if (packageJson.MODE == 'test') {
                            return packageJson.apiTestUrl;
                        } else {
                            return packageJson.apiReleaseUrl;
                        }
                    }
                }*/
                ]
            }
        },
        uglify: {
            test: {
                options: {
                    sourceMap: false,
                    compress: {
                        drop_console: true
                    }
                },
                expand: true,
                cwd: 'assets/js',
                src: ['**/*.js'],
                dest: 'assets/js',
                ext: '.js'
            }
        },
        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            test: {
                src: ['assets/js/*all.js', 'assets/css/*all.css']
            }

        },
        usemin: {
            html: ['html/*.html'],
            options: {
                blockReplacements: {
                    css: function (block) {
                        var serverUrl = '';
                        if (packageJson.MODE == 'test') {
                            serverUrl = packageJson.staticTestUrl;
                        }
                        if (packageJson.MODE == 'release') {
                            serverUrl = packageJson.staticReleaseUrl;
                        }
                        if (/win/i.test(platform)) {
                            var filename = 'assets' + block.dest.replace(/\//g, '\\');
                            var destFile = grunt.filerev.summary[filename].replace(/\\/g, '/').replace('assets/', '');
                        } else {
                            var filename = 'assets' + block.dest;
                            var destFile = grunt.filerev.summary[filename].replace('assets/', '');
                        }
                        return '<link rel="stylesheet" href="' + serverUrl + destFile + '">';
                    },
                    js: function (block) {
                        var serverUrl = '';
                        if (packageJson.MODE == 'test') {
                            serverUrl = packageJson.staticTestUrl;
                        }
                        if (packageJson.MODE == 'release') {
                            serverUrl = packageJson.staticReleaseUrl;
                        }
                        if (/win/i.test(platform)) {
                            var filename = 'assets' + block.dest.replace(/\//g, '\\');
                            var destFile = grunt.filerev.summary[filename].replace(/\\/g, '/').replace('assets/', '');
                        } else {
                            var filename = 'assets' + block.dest;
                            var destFile = grunt.filerev.summary[filename].replace('assets/', '');
                        }
                        return '<script src="' + serverUrl + destFile + '"></script>';
                    }
                }
            }
        }
    });

    grunt.registerTask('dev', 'dev', function () {
        grunt.task.run(['less:dev', 'concat:dev', 'concat:devApp', 'postcss:dev', 'watch']);
    });
}
