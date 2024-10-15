const fs = require('fs');
const { parse } = require('json2csv');

// Function to write articles to a CSV file
function write_articles_to_csv(filename, articles) {
    // Define the fields for the CSV
    const fields = ['title', 'relativeTime'];
    const opts = { fields };

    try {
        // Convert articles (JSON) to CSV format
        const csv = parse(articles, opts);

        // Write the CSV to a file
        fs.writeFileSync(filename, csv);
        console.log(`CSV file successfully created at: ${filename}`);
    } catch (error) {
        console.error('Error writing to CSV file:', error);
    }
}

module.exports = { write_articles_to_csv };
