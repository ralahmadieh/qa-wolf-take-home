const { chromium } = require('playwright');
const { write_articles_to_csv } = require('./csv');

// Helper function to convert units to seconds for easy comparison
function parseTimeString(timeString) {
    const [value, unit] = timeString.split(' ');
    const numValue = parseInt(value, 10);

    switch (unit) {
        case 'second':
        case 'seconds':
            return numValue;
        case 'minute':
        case 'minutes':
            return numValue * 60;
        case 'hour':
        case 'hours':
            return numValue * 3600;
        case 'day':
        case 'days':
            return numValue * 86400; // 60 * 60 * 24
        case 'month':
        case 'months':
            return numValue * 2628000; // 30.44 days (average)
        case 'year':
        case 'years':
            return numValue * 31536000; // 365.25 days (average)
        default:
            throw new Error('Unknown time unit: ' + unit);
    }
}
// Helper function to compare relative times
function compareRelativeTimes(timeA, timeB) {
    const timeAInSeconds = parseTimeString(timeA);
    const timeBInSeconds = parseTimeString(timeB);

    // Compare the total seconds
    if (timeAInSeconds < timeBInSeconds) {
        return -1; // timeA is newer
    } else if (timeAInSeconds > timeBInSeconds) {
        return 1; // timeA is older
    }
    return 0; // Both are equal
}


// Function to extract HTML content from a webpage using Playwright
async function get_articles(page) {
    let articles = [];

    try {
        // Use Playwright's API to get all article elements
        const articleElements = await page.$$('.athing');  // Select all elements with class '.athing'

        for (let index = 0; index < articleElements.length; index++) {
            const element = articleElements[index];
            // Extract the title text using Playwright
            const titleElement = await element.$('.titleline a');
            const title = titleElement ? (await titleElement.textContent()).trim() : null;
            // Extract relative time by navigating to the next 'tr' element and finding '.subtext .age'
            const relativeTimeElement = await element.evaluateHandle(el => el.closest('tr').nextElementSibling.querySelector('.subtext .age'));
            const relativeTime = relativeTimeElement ? (await relativeTimeElement.textContent()).trim() : null;

            // Handle missing or empty title cases
            if (!title) {
                console.warn(`Skipping article at index ${index}: No title text found.`);
                continue;  // Skip this iteration
            }

            // Check if relative time exists
            if (!relativeTime) {
                console.warn(`Skipping article at index ${index}: No relative time found.`);
                continue;  // Skip this iteration
            }

            // Add the article with its title and relative time to the array
            articles.push({ title, relativeTime });
        }
    } catch (error) {
        console.error('Error extracting articles:', error);
    }

    return articles;
}

/**
 * Fetches articles from the specified URL and checks if they are in the correct order.
 * If the articles are in order, it returns a list of articles along with their relative time.
 * If they are out of order, it returns an appropriate error message.
 */
async function fetch_articles(url, num_articles) {
    let all_articles = [];
    let current_page_url = url;
    let lastTime = null;

    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        while (all_articles.length < num_articles) {
            // Navigate to the current page URL
            await page.goto(current_page_url);

            // Get the articles using the page object
            const articles = await get_articles(page);

            if (!articles || articles.length === 0) {
                console.warn(`No articles found on ${current_page_url}`);
                break;
            }

            for (let article of articles) {
                const currentTime = article.relativeTime;

                if (lastTime && compareRelativeTimes(lastTime, currentTime) > 0) {
                    return 'Articles are not in the correct order';  // Return an error message
                }

                lastTime = currentTime;
            }

            all_articles = all_articles.concat(articles);

            if (all_articles.length >= num_articles) {
                break;
            }

            // Use Playwright to navigate to the next page
            const nextPageLink = await get_next_page_link_with_playwright(page);
            if (!nextPageLink) {
                console.warn('No more pages to navigate to.');
                break;
            }
            current_page_url = nextPageLink; // Update to the next page URL
        }
    } finally {
        await browser.close();  // Close the browser after fetching the articles
    }

    return {
        message: 'Articles are successfully fetched and in the correct order',
        articles: all_articles.slice(0, num_articles)
    };
}


// Helper function to get the next page link using Playwright
async function get_next_page_link_with_playwright(page) {
    let nextLink = null;
    try {
        const moreLink = await page.$('.morelink');
        if (moreLink) {
            nextLink = await moreLink.getAttribute('href');
            nextLink = `https://news.ycombinator.com/${nextLink}`;
        }
    } catch (error) {
        console.error('Error fetching next page link:', error);
    }
    return nextLink;
}

module.exports = { fetch_articles, compareRelativeTimes, get_next_page_link_with_playwright };

