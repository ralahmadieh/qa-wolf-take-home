const { chromium } = require('playwright');
const { compareRelativeTimes, get_next_page_link_with_playwright } = require('../libs/scraper');

// Jest's global mock functions
jest.mock('playwright');

describe('Scraper Tests', () => {

    // Test for compareRelativeTimes function
    describe('compareRelativeTimes', () => {
        test('should return 0 for equal times', () => {
            const result = compareRelativeTimes('10 minutes', '10 minutes');
            expect(result).toBe(0);
        });

        test('should return 1 when timeA is older than timeB', () => {
            const result = compareRelativeTimes('20 minutes', '10 minutes');
            expect(result).toBe(1);
        });

        test('should return -1 when timeA is newer than timeB', () => {
            const result = compareRelativeTimes('5 minutes', '10 minutes');
            expect(result).toBe(-1);
        });
    });

    // Test for get_next_page_link_with_playwright
    describe('get_next_page_link_with_playwright', () => {
        let mockPage;

        beforeEach(() => {
            mockPage = {
                $: jest.fn()
            };
        });

        test('should return the next page link when available', async () => {
            mockPage.$.mockResolvedValueOnce({
                getAttribute: jest.fn().mockResolvedValueOnce('news?p=2')
            });

            const result = await get_next_page_link_with_playwright(mockPage);
            expect(result).toBe('https://news.ycombinator.com/news?p=2');
        });

        test('should return null if no next page link is found', async () => {
            mockPage.$.mockResolvedValueOnce(null);

            const result = await get_next_page_link_with_playwright(mockPage);
            expect(result).toBeNull();
        });
    });

});


