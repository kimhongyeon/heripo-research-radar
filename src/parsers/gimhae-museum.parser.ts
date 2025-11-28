import {
  DateType,
  type ParsedTargetDetail,
  type ParsedTargetListItem,
} from '@llm-newsletter-kit/core';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

import { cleanUrl, getDate } from './utils';

export const parseGimhaeMuseumList = (
  html: string,
  hrefPrefix: string,
): ParsedTargetListItem[] => {
  const $ = cheerio.load(html);
  const posts: ParsedTargetListItem[] = [];
  const baseUrl = 'https://gimhae.museum.go.kr';

  $('table.board_list tbody tr').each((index, element) => {
    const columns = $(element).find('td');
    if (columns.length === 0) {
      return;
    }

    const titleElement = columns.eq(1).find('a');
    const relativeHref = titleElement.attr('href');

    if (!relativeHref) {
      return;
    }

    const fullUrl = new URL(`${hrefPrefix}${relativeHref}`, baseUrl);
    const detailUrl = fullUrl.href;
    const uniqId = fullUrl.searchParams.get('no') ?? undefined;

    const title = titleElement.text()?.trim() ?? '';
    const date = getDate(columns.eq(5).text().trim());

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

export const parseGimhaeMuseumDetail = (html: string): ParsedTargetDetail => {
  const $ = cheerio.load(html);

  const content = $('div.bbs--view--content');

  return {
    detailContent: new TurndownService().turndown(content.html() ?? ''),
    hasAttachedFile: $('div.bbs--view--file').length > 0,
    hasAttachedImage: content.find('img').length > 0,
  };
};
