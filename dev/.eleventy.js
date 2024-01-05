const  EleventyWP = require('eleventy-plugin-wordpress');
const inspect = require('util').inspect;

module.exports = (eleventyConfig, options) => {
    
    eleventyConfig.addPlugin(EleventyWP, {
        base_url: "https://art.atarijunge.de",
        include: {
            tags: true,
        }
    });

    eleventyConfig.addFilter("debug", (content) => `<pre>${inspect(content)}</pre>`);

    return {
        dir: {
            input: "src",
        }
    }
};
