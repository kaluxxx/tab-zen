import type { GroupCategory } from '../types';

/**
 * Domain patterns for automatic tab classification
 * Each category contains domain patterns that help identify the type of website
 */
export const groupingHeuristics = {
  domainPatterns: {
    development: [
      'github.com',
      'gitlab.com',
      'stackoverflow.com',
      'stackexchange.com',
      'codepen.io',
      'jsfiddle.net',
      'codesandbox.io',
      'repl.it',
      'vercel.app',
      'netlify.app',
      'heroku.com',
      'dev.to',
      'medium.com/tag/programming',
      'hackernews.ycombinator.com',
      'npm.js.com',
      'packagephobia.com',
      'bundlephobia.com',
      'caniuse.com',
      'mdn.io',
      'developer.mozilla.org',
      'w3schools.com',
      'freecodecamp.org',
      'codecademy.com',
      'leetcode.com',
      'codewars.com',
      'atlassian.net',
      'bitbucket.org',
    ],
    social: [
      'facebook.com',
      'instagram.com',
      'twitter.com',
      'x.com',
      'linkedin.com',
      'tiktok.com',
      'snapchat.com',
      'reddit.com',
      'discord.com',
      'slack.com',
      'teams.microsoft.com',
      'zoom.us',
      'meet.google.com',
      'telegram.org',
      'whatsapp.com',
      'pinterest.com',
      'tumblr.com',
      'vk.com',
      'weibo.com',
    ],
    media: [
      'youtube.com',
      'youtu.be',
      'vimeo.com',
      'twitch.tv',
      'netflix.com',
      'hulu.com',
      'disneyplus.com',
      'primevideo.com',
      'spotify.com',
      'soundcloud.com',
      'apple.com/music',
      'music.google.com',
      'deezer.com',
      'pandora.com',
      'podcasts.google.com',
      'podcasts.apple.com',
      'anchor.fm',
      'imgur.com',
      'flickr.com',
      'unsplash.com',
      'pexels.com',
      'giphy.com',
    ],
    shopping: [
      'amazon.com',
      'amazon.fr',
      'amazon.co.uk',
      'ebay.com',
      'etsy.com',
      'shopify.com',
      'aliexpress.com',
      'alibaba.com',
      'walmart.com',
      'target.com',
      'bestbuy.com',
      'zalando.com',
      'asos.com',
      'zara.com',
      'h&m.com',
      'nike.com',
      'adidas.com',
      'booking.com',
      'airbnb.com',
      'expedia.com',
      'tripadvisor.com',
    ],
    productivity: [
      'google.com/docs',
      'docs.google.com',
      'drive.google.com',
      'sheets.google.com',
      'slides.google.com',
      'office.com',
      'outlook.com',
      'onedrive.com',
      'sharepoint.com',
      'notion.so',
      'airtable.com',
      'trello.com',
      'asana.com',
      'monday.com',
      'clickup.com',
      'todoist.com',
      'evernote.com',
      'onenote.com',
      'dropbox.com',
      'box.com',
      'figma.com',
      'canva.com',
      'miro.com',
      'lucidchart.com',
    ],
    documentation: [
      'docs.',
      'documentation.',
      'wiki.',
      'help.',
      'support.',
      'guides.',
      'manual.',
      'api.',
      'reference.',
      'confluence.atlassian.com',
      'gitbook.io',
      'readthedocs.io',
      'docusaurus.io',
      'mkdocs.org',
      'swagger.io',
      'postman.com',
    ],
    news: [
      'bbc.com',
      'cnn.com',
      'nytimes.com',
      'theguardian.com',
      'reuters.com',
      'ap.org',
      'lemonde.fr',
      'lefigaro.fr',
      'liberation.fr',
      'franceinfo.fr',
      'rfi.fr',
      'france24.com',
      'techcrunch.com',
      'theverge.com',
      'wired.com',
      'arstechnica.com',
      'engadget.com',
      'cnet.com',
    ],
    entertainment: [
      'imdb.com',
      'rottentomatoes.com',
      'metacritic.com',
      'goodreads.com',
      'letterboxd.com',
      'myanimelist.net',
      'crunchyroll.com',
      'funimation.com',
      'steam.com',
      'epicgames.com',
      'origin.com',
      'uplay.com',
      'gog.com',
      '9gag.com',
      'buzzfeed.com',
      'vice.com',
      'kotaku.com',
      'ign.com',
      'gamespot.com',
    ],
    education: [
      'coursera.org',
      'edx.org',
      'udemy.com',
      'udacity.com',
      'khanacademy.org',
      'pluralsight.com',
      'lynda.com',
      'skillshare.com',
      'masterclass.com',
      'duolingo.com',
      'babbel.com',
      'rosettastone.com',
      'wikipedia.org',
      'britannica.com',
      'scholar.google.com',
      'researchgate.net',
      'academia.edu',
      'jstor.org',
      'arxiv.org',
      'pubmed.ncbi.nlm.nih.gov',
      '.edu',
      'university',
      'college',
      'school',
    ],
  } as Record<GroupCategory, string[]>,

  /**
   * Get the priority order for categories
   * Higher priority categories are checked first
   */
  getPriorityOrder(): GroupCategory[] {
    return [
      'development',
      'productivity',
      'documentation',
      'education',
      'social',
      'media',
      'shopping',
      'news',
      'entertainment',
      'other',
    ];
  },

  /**
   * Get patterns for a specific category
   */
  getPatternsForCategory(category: GroupCategory): string[] {
    return this.domainPatterns[category] || [];
  },

  /**
   * Add custom pattern for a category
   */
  addPattern(category: GroupCategory, pattern: string): void {
    if (!this.domainPatterns[category]) {
      this.domainPatterns[category] = [];
    }
    if (!this.domainPatterns[category].includes(pattern)) {
      this.domainPatterns[category].push(pattern);
    }
  },

  /**
   * Remove pattern from a category
   */
  removePattern(category: GroupCategory, pattern: string): void {
    if (this.domainPatterns[category]) {
      const index = this.domainPatterns[category].indexOf(pattern);
      if (index > -1) {
        this.domainPatterns[category].splice(index, 1);
      }
    }
  },
};