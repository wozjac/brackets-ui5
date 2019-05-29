module.exports = function (grunt) {
    require("load-grunt-tasks")(grunt);

    const options = {
        distDir: "dist"
    };

    grunt.initConfig({
        clean: {
            dist: ["dist"]
        },

        zip: {
            dist: {
                src: ["assets/**", "src/**", "nls/**", "node/**", "main.js", "strings.js", "package.json", "*.md"],
                dest: `${options.distDir}/wozjac.ui5.zip`
            }
        }
    });

    grunt.registerTask("dist", ["clean:dist", "zip:dist"]);
};
