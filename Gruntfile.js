var grunt = require('grunt');

require('load-grunt-tasks')(grunt);

grunt.initConfig({
    clean: {
        dist: ['dist'],
    },
    concat: {
        options: {
            sourceMap: true
        },
        dist: {
            src: ['src/sidenav.js'],
            dest: 'dist/sidenav.js',
        },
    },
    uglify: {
        options: {
            sourceMap: false
        },
        dist: {
            files: {
                'dist/sidenav.min.js': ['src/sidenav.js'],
            }
        }
    },
    cssmin: {
        options: {
            sourceMap: false
        },
        dist: {
            files: {
                'dist/sidenav.min.css': ['src/sidenav.css'],
            }
        }
    }
});

grunt.task.registerTask('build', ['clean', 'concat', 'uglify', 'cssmin']);
