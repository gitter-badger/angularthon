module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        config: {
            src: 'client',
            dist: 'dist'
        },
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            html: {
                expand: true,
                cwd: '<%= config.src %>/',
                src: '**/*.html',
                dest: 'dist/'
            },
            assets: {
                expand: true,
                cwd: '<%= config.src %>/',
                src: ['assets/**/*', '!assets/**/*.scss'],
                dest: 'dist/'
            },
            i18n: {
                expand: true,
                cwd: '<%= config.src %>/',
                src: ['i18n/**/*'],
                dest: 'dist/'
            },
            bootstrapfonts: {
                expand: true,
                cwd: './node_modules/bootstrap-sass/assets/fonts/bootstrap/',
                src: ['**/*'],
                dest: '<%= config.dist %>/assets/fonts/'
            },
            fontawesome: {
                expand: true,
                cwd: './node_modules/font-awesome/fonts/',
                src: ['**/*'],
                dest: '<%= config.dist %>/assets/fonts/'
            },
            ngscripts: {
                src: [
                    './node_modules/angular2/bundles/angular2-polyfills.js',
                    './node_modules/systemjs/dist/system.src.js',
                    './node_modules/rxjs/**/*js',
                    './node_modules/ng2-translate/**/*',
                    './node_modules/angular2/bundles/angular2.dev.js',
                    './node_modules/angular2/bundles/router.dev.js',
                    './node_modules/angular2/bundles/http.dev.js',
                    './node_modules/jquery/dist/jquery.js',
                    './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
                ],
                dest: 'dist/'
            }
        },
        ts: {
            components : {
                src: ['<%= config.src %>/app/**/*.ts'],
                dest: '<%= config.dist %>/app/',
                options: {
                    fast: 'never',
                    target: "es5",
                    module: "system",
                    moduleResolution: "node",
                    sourceMap: true,
                    removeComments: false,
                    noImplicitAny: false,
                    exclude: [
                       "node_modules"
                    ],
                    emitDecoratorMetadata: true,
                    experimentalDecorators: true,
                }
            }
        },
        sass: {
            options: {
                //sourceMap: true,
            },
            dev: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/',
                    src: ['**/*.scss'],
                    dest: '<%= config.dist %>/',
                    ext: '.css'
                }]
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: '**/*',
                    }
                ]
            },
            distHTML: {
                files: [
                    {
                        src: '<%= config.dist %>/**/*html'
                    }
                ]
            },
            distSass: {
                files: [
                    {
                        src: '<%= config.dist %>/**/*css'
                    }
                ]
            },
            baseDirTs: {
                files: [
                    {
                        src: './src/app/.baseDir.ts'
                    }
                ]
            },
        },
        watch: {
            html: {
                files: ['<%= config.src %>/**/*.html'],
                tasks: ['clean:distHTML', 'copy:html']
            },
            sass: {
                files: ['<%= config.src %>/**/*.scss'],
                tasks: ['clean:distSass', 'sass']
            },
            ts: {
                files: ['<%= config.src %>/**/*.ts'],
                tasks: ['ts:components', 'clean:baseDirTs']
            }
        }
    });


    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', ['clean:dist', 'copy', 'sass', 'ts', 'clean:baseDirTs']);
    grunt.registerTask('default', ['build', 'watch']);
}
Blog
