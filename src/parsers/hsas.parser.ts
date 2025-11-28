import {
  DateType,
  type ParsedTargetDetail,
  type ParsedTargetListItem,
} from '@llm-newsletter-kit/core';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

import { cleanUrl, getDate } from './utils';

export const parseHsasList = (html: string): ParsedTargetListItem[] => {
  const $ = cheerio.load(html);
  const posts: ParsedTargetListItem[] = [];
  const baseUrl = 'http://www.hsas.or.kr';

  $('table#bbs_list tbody tr').each((index, element) => {
    const columns = $(element).find('td');
    if (columns.length === 0) {
      return;
    }

    const titleElement = columns.eq(1).find('a');
    const relativeHref = titleElement.attr('href');

    if (!relativeHref) {
      return;
    }

    const fullUrl = new URL(
      relativeHref.replace('./?ref', '/flow/?ref'),
      baseUrl,
    );
    const detailUrl = fullUrl.href;
    const uniqId = fullUrl.searchParams.get('eb_idx') ?? undefined;

    const title = titleElement.text()?.trim() ?? '';
    const date = getDate(`20${columns.eq(3).text().trim()}`);

    posts.push({
      uniqId,
      title,
      date,
      detailUrl: cleanUrl(detailUrl),
      dateType: DateType.REGISTERED,
    });
  });

  return posts;
};

export const parseHsasDetail = (html: string): ParsedTargetDetail => {
  const $ = cheerio.load(html);

  const content = $('div#view_content');

  return {
    detailContent: new TurndownService().turndown(content.html() ?? ''),
    hasAttachedFile: false,
    hasAttachedImage: content.find('img').length > 0,
  };
};
