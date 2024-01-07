const http = require('node:https');

class WordPressAPI {
    constructor(options) {
        this.base_url = options.base_url;

        return this;
    }

    log(msg) {
        console.log(`[ wp ] ${msg}`)
    }

    async call_api(type, params) {
        let data = await fetch(`${this.base_url}/wp-json/wp/v2/${type}?${params}`).then((response) => {
            return response.json();
        }).catch(err => {
            this.log("Error retrieving data: ", err);
            return false;
        });
        
        if (type == "tags") {
            // The WP API returns an empty array for tags if there are no more,
            // there's probably a better way to handle this.
            // Pages and Posts will return a JSON object which is handled in the calling function
            if (JSON.stringify(data) == "[]") {
                return false;
            }
        }
        return data;
    }

    responseHasData(resp_json) {
        // if the page number is wrong a empty page with an error is returned.
        if (!resp_json.code) {
            return true;
        }

        return resp_json.code != 'rest_post_invalid_page_number';
    }

    async query_loop(type, params) {
        let got_data = true;
        let page = 1;
        let return_data = [];
        let cleaned_return_data = []

        while(got_data) {
            got_data = await this.call_api(type,`${params}&page=${page}`);
            if (this.responseHasData(got_data)) {
                return_data.push(got_data);
                page++;
            } else {
                got_data = false; // break loop
            }
        }
        
        // Clean-up links
        for (let idx in return_data[0]) {
            let entry = return_data[0][idx];
            if (entry.link) {
                entry.link = entry.link.replace(`${this.base_url}/`, '');
            }
            cleaned_return_data.push(entry);
        }

        return cleaned_return_data;
    }

    async getPages() {
        this.log("Getting Pages");
        return await this.query_loop("pages",`orderby=date&order=desc&per_page=100`);
    }

    async getTags() {
        this.log("Getting Tags");
        return await this.query_loop("tags", "per_page=100");
    }

    async getPosts() {
        this.log("Getting Posts");
        return await this.query_loop("posts", "orderby=date&order=desc&per_page=100");
    }
}

module.exports = (eleventyConfig, pluginOptions) => {
    let wp_api = new WordPressAPI(pluginOptions);
    let options = pluginOptions;

    eleventyConfig.addGlobalData("wp", async function() {
        // WP data fetching must be disabled explicitly
        const pages = options.include?.pages == false ? [] : await wp_api.getPages();
        const posts = options.include?.posts == false ? [] : await wp_api.getPosts();
        const tags = options.include?.tags == false ? [] : await wp_api.getTags();

        return {pages, posts, tags}
    });

    return eleventyConfig
};
