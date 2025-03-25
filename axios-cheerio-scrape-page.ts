import axios from "axios";
import * as cheerio from "cheerio";

const url = "https://www.scrapingcourse.com/ecommerce/";

// In general I find the then-catch a bit fugly this way.
// So I prefer the other try-catch.
axios.get(url)
    .then(response => {
        // console.log(response);
        const $ = cheerio.load(response.data);

        const images = $("body").find("img");

        for(let i = 0; i < images.length; i++) {
            console.log(images.attr("src")) // huh???
        }

    })
    .catch(err => {
        console.log(err);
    })
