/**
 * Newsletter content configuration
 */
export const contentOptions = {
  outputLanguage: '한국어',
  expertField: ['문화유산'],
};

/**
 * Newsletter brand configuration
 */
export const newsletterConfig = {
  brandName: '문화유산 리서치 레이더',
  subscribePageUrl: 'https://heripo.com/research-radar/subscribe',
  publicationCriteria: {
    minimumArticleCountForIssue: 5,
    priorityArticleScoreThreshold: 8,
  },
};

/**
 * LLM configuration
 */
export const llmConfig = {
  maxRetries: 5,
  chainStopAfterAttempt: 3,
  generation: {
    temperature: 0.3,
  },
};

/**
 * Crawling target configuration
 */
export { crawlingTargetGroups } from './crawling-targets';
