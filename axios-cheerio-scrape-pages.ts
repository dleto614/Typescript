import axios from "axios";
import * as cheerio from "cheerio";

const url = "https://www.scrapingcourse.com/ecommerce/";

async function GetImages(url: string): Promise<void> {

    const response = await axios.get(url)
    
    try {

        const $ = cheerio.load(response.data);

        const images = $("body").find("img");

        for (let i = 0; i < images.length; i++) {
            console.log(images.attr("src")) // huh???
        }

        const NextPage = $(".next").attr("href");

        // Go to next page so we can scrape everything till 404 is reached.
        if( NextPage ) {
            const page = NextPage;
            await GetImages(page);
        }

    } catch (err) {
        console.log(err.message);
    }

}

(async() => {
    await GetImages(url);
})();
