# eleventy-plugin-wordpress

<!-- BEGIN mktoc -->

- [What is this plugin?](#what-is-this-plugin)
- [Support](#support)
  - [Goals](#goals)
  - [Non-goals](#non-goals)
- [Usage](#usage)
  - [Installatiomn](#installatiomn)
  - [Configuration](#configuration)
  - [Template usage](#template-usage)
<!-- END mktoc -->

## What is this plugin?

This plugin loads various things out of WordPress and makes it available as data-source in 11ty.

## Support

This plugin is **very unsupported** and intended for my own usage. I'm open-sourcing it as I like to share all the code I write, and if you find it useful feel free to use the plugin with your own website(s).

**Expect breaking changes as I build the plugin to fits my needs**

The plugin is also quite slow, it takes between 4-5 seconds to load data from a relativly small wordpress page (~300 Tags, 16 Pages, 138 posts)

### Goals

- Load content (Pages, Posts, Tags, Categories) out of wordpress and use it to render a static website with 11ty

### Non-goals

- Load Media files

## Usage

### Installatiomn
Install the plugin via npm, then configure it.

```sh
npm install --save @kevingimbel/eleventy-plugin-wordpress
```

### Configuration

```js
const  EleventyWP = require('@kevingimbel/eleventy-plugin-wordpress');

module.exports = (eleventyConfig, options) => {
    
    eleventyConfig.addPlugin(EleventyWP, {
        base_url: "https://example.com"
    });
    // [rest of config]
};
```

### Template usage

The plugin provides the following data sets:

- `wp.pages` containing all pages
- `wp.posts` containing all posts
- `wp.tags` containing all tags

See files in the `dev` folder for an example.