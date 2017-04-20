module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
                stripBanners: true
            },
            dist: {
                src: ["public/js/*.js"],
                dest: "public/js/base.js"
            }
        },
        // uglify: {
        //     options: {},
        //     dist: {
        //         files: {
        //             'public/js/base.min.js': 'public/js/*.js'
        //         }
        //     }
        // },
        autoprefixer: {
            dist: {
                files: {
                    'build/style.css': 'style.css'
                }
            }
        },
        less: {
            main: {
                expand: true,
                cwd: 'public/less/',
                src: ['**/*.less'],
                dest: 'public/css',
                ext: '.css',
                extDot: 'last'
            },
            dev: {
                options: {
                    compress: true,
                    yuicompress: false,
                    sourceMap: false
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'public/css/all.min.css': ['public/css/*.css']
                }
            }
        },
        clean: {
            css: {
                src: ['public/css/all.min.css']
            }
        },
        watch: {
            client: { //用于监听less文件,当改变时自动编译成css文件
                files: ['public/less/**.less'],
                tasks: [
                    'clean:css', 'cssmin', 'less', 'autoprefixer'
                ],
                options: {
                    livereload: true
                }
            },
            build: {
                files: [
                    'js/*.js', 'public/css/*.css'
                ],
                options: {
                    spawn: false
                }
            }
        }
    });

    // grunt.loadNpmTasks('grunt-contrib-concat');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-autoprefixer');

    // grunt.registerTask('default', ['concat', 'cssmin', 'uglify']);
    grunt.registerTask('default', ['clean:css', 'cssmin', 'less', 'watch']);
}
