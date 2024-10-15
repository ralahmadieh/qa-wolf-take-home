const fs = require('fs');
const { write_articles_to_csv } = require('../libs/csv');
const { parse } = require('json2csv');

// Mock articles array
const articles = [
    { title: 'Article 1', date: '2024-01-01' },
    { title: 'Article 2', date: '2024-02-01' },
];

describe('write_articles_to_csv()', () => {
    const mockFilename = 'test.csv';

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    test('should write articles to a CSV file successfully', () => {
        // Mock fs.writeFileSync to succeed
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

        // Call the function
        write_articles_to_csv(mockFilename, articles);

        // Expect fs.writeFileSync to have been called with the correct arguments
        expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    });

    test('should log an error if writing to CSV fails', () => {
        // Mock fs.writeFileSync to throw an error
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
            throw new Error('File system error');
        });

        // Spy on console.error to check if it logs the error
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        // Call the function and expect an error to be logged
        expect(() => write_articles_to_csv(mockFilename, articles)).not.toThrow();
        expect(consoleSpy).toHaveBeenCalledWith('Error writing to CSV file:', expect.any(Error));

        consoleSpy.mockRestore(); // Restore console.error to its original state
    });
});