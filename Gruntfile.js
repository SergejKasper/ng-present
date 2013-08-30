/* global module:false */
module.exports = function(grunt) {

	// Dependencies
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-zip');

    var userConfig = require( './build.config.js' );
    // Project configuration
    var taskConfig = {
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*!\n' + ' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' + ' * http://lab.hakim.se/reveal-js\n' + ' * MIT licensed\n' + ' *\n' + ' * Copyright (C) 2013 Hakim El Hattab, http://hakim.se\n' + ' */'
        },

        /**
         * The directories to delete when `grunt clean` is executed.
         */
        clean: [
            '<%= build_dir%>'
        ],
        /**
         * Build index.html
         */
        wrap: {
            html: {
                header: 'header.html',
                footer: 'footer.html',
                src: ['slides/*.html'],
                dest: '<%= build_dir%>/'  // destination *directory*, probably better than specifying same file names twice
            },
            mobile: {
                header: 'header.html',
                footer: 'footer.html',
                src: ['slides/*.mobile.html'],
                dest: '.'  // destination *directory*, probably better than specifying same file names twice
            }
        },

        /**
         * The `copy` task just copies files from A to B. We use it here to copy
         * our project assets (images, fonts, etc.) and javascripts into
         * `build_dir`, and then to copy the assets to `compile_dir`.
         */
        copy: {
            build_deployment: {
                files: [{
                    src: ['**'],
                    dest: '<%= build_dir%>/',
                    cwd: 'deployment/',
                    expand: true
                }]
            },
            build_custom_components: {
                files: [{
                    src: ['**'],
                    dest: '<%= build_dir%>/custom_components/',
                    cwd: 'custom_components/',
                    expand: true
                }]
            },
            build_assets: {
                files: [{
                    src: ['**'],
                    dest: '<%= build_dir%>/assets/',
                    cwd: 'assets/',
                    expand: true
                }]
            },
            build_js: {
                files: [{
                    src: ['**'],
                    dest: '<%= build_dir%>/js/',
                    cwd: 'js/',
                    expand: true
                }]
            },
            build_css: {
                files: [{
                    src: ['**'],
                    dest: '<%= build_dir%>/css/',
                    cwd: 'css/',
                    expand: true
                }]
            },
            build_img: {
                files: [{
                    src: ['**'],
                    dest: '<%= build_dir%>/img/',
                    cwd: 'img/',
                    expand: true
                }]
            },

            build_components: {
                files: [{
                    src : [ '<%= vendor_files.js %>' ],
                    dest: '<%= build_dir%>/lib/',
                    cwd: '.',
                    expand: true
                }]
            },

            build_lib: {
                files: [{
                    src: ['**'],
                    dest: '<%= build_dir%>/lib/',
                    cwd: 'lib/',
                    expand: true
                }]
            },

            build_plugin: {
                files: [{
                    src: ['**'],
                    dest: '<%= build_dir%>/plugin/',
                    cwd: 'plugin/',
                    expand: true
                }]
            }
        },

        // Tests will be added soon
        qunit: {
            files: ['test/**/*.html']
        },

        uglify: {
            options: {
                banner: '<%= meta.banner %>\n'
            },
            build: {
                src: 'js/reveal.js',
                dest: 'js/reveal.min.js'
            }
        },

        cssmin: {
            compress: {
                files: {
                    'css/reveal.min.css': ['css/reveal.css']
                }
            }
        },

        sass: {
            main: {
                files: {
                    'css/theme/default.css': 'css/theme/source/default.scss',
                    'css/theme/beige.css': 'css/theme/source/beige.scss',
                    'css/theme/night.css': 'css/theme/source/night.scss',
                    'css/theme/serif.css': 'css/theme/source/serif.scss',
                    'css/theme/simple.css': 'css/theme/source/simple.scss',
                    'css/theme/sky.css': 'css/theme/source/sky.scss',
                    'css/theme/moon.css': 'css/theme/source/moon.scss',
                    'css/theme/solarized.css': 'css/theme/source/solarized.scss'
                }
            }
        },

        jshint: {
            options: {
                curly: false,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                eqnull: true,
                browser: true,
                expr: true,
                globals: {
                    head: false,
                    module: false,
                    console: false,
                    require: false
                }
            },
            files: ['Gruntfile.js', 'js/reveal.js']
        },

        connect: {
            server: {
                options: {
                    port: 8080,
                    base: '<%= build_dir %>'
                }
            }
        },
        zip: {
            'reveal-js-presentation.zip': [
                'index.html',
                'css/**',
                'js/**',
                'lib/**',
                'images/**',
                'plugin/**'
            ]
        },

        watch: {
            main: {
                files: ['Gruntfile.js', 'js/**', 'lib/**', 'images/**', 'plugin/**', 'slides/**'],
                tasks: 'default',
                options: {
                    livereload: true
                }
            }
        }

    };
    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));


    grunt.registerMultiTask('wrap', 'Wraps source files', function() {
        //
        var data = this.data,
            dest = grunt.template.process(data.dest),
            path = dest + '/index.html',
            files = grunt.file.expandFiles(this.file.src),
            header = grunt.file.read(grunt.template.process(data.header)),
            footer = grunt.file.read(grunt.template.process(data.footer)),
            sep = grunt.utils.linefeed,
            content = "";
        files.forEach(function(f) {
            content = content + grunt.file.read(f);
        });
        grunt.log.writeln('File "' + path + '" created.');
        grunt.file.write(path, header + sep + content + sep + footer);
    });

    // Default task
    grunt.registerTask('default', ['jshint', 'sass', 'cssmin', 'uglify', 'clean', 'copy', 'wrap:html']);

    // Mobile slides
    grunt.registerTask('mobile', ['jshint', 'sass', 'cssmin', 'uglify', 'clean', 'copy', 'wrap:mobile']);

    // Package presentation to archive
    grunt.registerTask('package', ['default', 'zip']);

    // Serve presentation locally
    grunt.registerTask('update', ['wrap:html', 'clean', 'copy', 'connect', 'watch']);

    // Serve presentation locally
    grunt.registerTask('serve', [ 'default','connect', 'watch']);
};
