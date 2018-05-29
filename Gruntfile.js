module.exports = function (grunt) {
    grunt.initConfig({
        eslint: {
            files: ["**/*.js", "!node_modules/**", "!src/3rdparty/**", "!src/mockGenerator/OdataMockGenerator.js", "!working/**", "!tests/fixtures/**"]
        }
    });

    grunt.loadNpmTasks("grunt-eslint");

    grunt.registerTask("default", ["eslint"]);
};
