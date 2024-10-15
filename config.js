// config.js
class Config {
  constructor(url, num_articles) {
    this.url = url;
    this.num_articles = num_articles;
  }
}

const global_config = new Config("https://news.ycombinator.com", 100);

module.exports = { global_config };
