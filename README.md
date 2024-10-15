# README file for Web Scraper Assignment

### Overview

This assignment involves building a web scraper that fetches articles from the Hacker News website, extracts relevant data, and stores it in a CSV file. The scraper will ensure that the articles are in chronological order based on their relative time and handle pagination to gather multiple articles.

File Structure
1. libs/
  - scraper.js: Contains functions for fetching articles, extracting data, and comparing relative times.
  - csv.js: Handles writing the extracted articles to a CSV file.
2. config.js: Defines a configuration class to manage the URL and the number of articles to fetch.
3. index.js: The main script that orchestrates the fetching of articles and writing them to CSV.
4. tests/
  - scraper.test.js: Contains unit tests for the functions in scraper.js.
  - csv.test.js: Contains unit tests for the write_articles_to_csv function in csv.js.

Module Descriptions
1. scraper.js
  - Functions:
   - compareRelativeTimes(timeA, timeB): Compares two relative time strings (e.g., "2 minutes", "1 hour") and returns:
     - 1 if timeA is older than timeB
     - -1 if timeA is newer than timeB
     - 0 if both times are equal.
   - get_articles(page): retrieves articles from a webpage using Playwright, extracting each article's title and relative time. It skips articles without titles or relative times and logs warnings.
   - fetch_articles(url, num_articles): Fetches articles from the specified URL, checking for chronological order. It handles pagination until the desired number of articles is collected. If the articles are not in chronological order, it returns a message indicating this. If the articles are in order, it logs a success message and creates a CSV file containing the articles.
2. csv.js
   - Functions:
     - write_articles_to_csv(filename, articles): Writes the extracted articles into a CSV file. It logs an error message if writing to the file fails.
3. config.js
   - Class: Config
     - Properties:
       - url: The URL to scrape articles from.
       - num_articles: The desired number of articles to fetch.
   - Instance: global_config: A global instance of the Config class initialized with the Hacker News "newest" page URL and the number of articles to fetch.
4. index.js
   - Function: sortHackerNewsArticles
     - Orchestrates the fetching of articles and writing to CSV. If articles are out of order, it logs an error message. If they are in order, it writes them to the specified CSV file and logs a success message.

Testing
   1. File: tests/scraper.test.js
     - Contains unit tests for the compareRelativeTimes and get_next_page_link_with_playwright functions to ensure they perform as expected.
   2. File: tests/csv.test.js
     - Contains unit tests for the write_articles_to_csv function. Tests include:
        - Ensuring the function successfully writes articles to a CSV file.
        - Logging an error message if writing to the CSV fails.

Error Handling
   1. The get_html() function handles errors when fetching HTML content and logs appropriate error messages.
   2. The get_articles() function warns when articles are skipped due to missing titles or relative times.

Execution
   1. To run the scraper, execute the index.js script using Node.js:
      -  node index.js
   2. To run the testing files, use:
      -  npx jest
   3. Testing for Articles Not in Order: If you want to test the case when the URL has articles not in order, you can modify the config.js file. Change the line:
      const global_config = new Config("https://news.ycombinator.com/newest", 100);
      to:
      const global_config = new Config("https://news.ycombinator.com", 100);

Dependencies
   2. Playwright: For parsing and manipulating HTML.
   3. jest: For testing.
   4. json2csv: For converting JSON data to CSV format.
