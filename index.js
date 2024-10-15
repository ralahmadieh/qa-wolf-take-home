// Import the necessary modules
const { fetch_articles } = require('./libs/scraper');
const { write_articles_to_csv } = require('./libs/csv');
const { global_config } = require('./config');

// URL to scrape from and filename
const url = global_config.url;
const filename = 'articles.csv';  // The CSV file to save the articles

async function sortHackerNewsArticles() {
    // Fetch articles with pagination and check order
    const result = await fetch_articles(url, global_config.num_articles);

    // Check the result, and if articles are in order, write them to CSV
    if (typeof result === 'string') {
        // If result is a string, it means something went wrong (e.g., articles out of order)
        console.log(result);  // Output the error message
    } else  {
        // If result contains articles, they are in order and can be written to CSV
        console.log(result.message);  // Log the message that articles are in order
        write_articles_to_csv(filename, result.articles);  // Write to CSV
        console.log(`Articles successfully written to ${filename}`);
    }
}

// Main function call
(async () => {
    await sortHackerNewsArticles();
})();




