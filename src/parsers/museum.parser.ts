import {
  DateType,
  type ParsedTargetDetail,
  type ParsedTargetListItem,
} from '@llm-newsletter-kit/core';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

import { cleanUrl, getDate } from './utils';

export const parseMuseumList = (
  html: string,
  hrefPrefix: string,
): ParsedTargetListItem[] => {
  const $ = cheerio.load(html);
  const posts: ParsedTargetListItem[] = [];
  const baseUrl = 'https://www.museum.go.kr';

  $('div.board-list-tbody ul').each((index, element) => {
    const columns = $(element).find('li');
    if (columns.length === 0) {
      return;
    }

    const titleElement = columns.eq(3).find('a');
    const relativeHref = titleElement.attr('href');

    if (!relativeHref) {
      return;
    }

    const fullUrl = new URL(`${hrefPrefix}${relativeHref}`, baseUrl);
    const detailUrl = fullUrl.href;
    const uniqId = fullUrl.searchParams.get('arcId') ?? undefined;

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

export const parseMuseumPressList = (html: string): ParsedTargetListItem[] => {
  const $ = cheerio.load(html);
  const posts: ParsedTargetListItem[] = [];
  const baseUrl = 'https://www.museum.go.kr';

  $('div.board-list-tbody ul').each((index, element) => {
    const columns = $(element).find('li');
    if (columns.length === 0) {
      return;
    }

    const titleElement = columns.eq(1).find('a');
    const relativeHref = titleElement.attr('href');

    if (!relativeHref) {
      return;
    }

    const fullUrl = new URL(
      `/MUSEUM/contents/M0701040000.do${relativeHref}`,
      baseUrl,
    );
    const detailUrl = fullUrl.href;
    const uniqId = fullUrl.searchParams.get('arcId') ?? undefined;

    const title = titleElement.text()?.trim() ?? '';
    const date = getDate(columns.eq(3).text().trim());

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

export const parseMuseumRecruitList = (
  html: string,
): ParsedTargetListItem[] => {
  const $ = cheerio.load(html);
  const posts: ParsedTargetListItem[] = [];
  const baseUrl = 'https://www.museum.go.kr';

  $('div.board-list-tbody ul').each((index, element) => {
    const columns = $(element).find('li');
    if (columns.length === 0) {
      return;
    }

    const titleElement = columns.eq(2).find('a');
    const relativeHref = titleElement.attr('href');

    if (!relativeHref) {
      return;
    }

    const fullUrl = new URL(
      `/MUSEUM/contents/M0701030000.do${relativeHref}`,
      baseUrl,
    );
    const detailUrl = fullUrl.href;
    const uniqId = fullUrl.searchParams.get('arcId') ?? undefined;

    const title = titleElement.text()?.trim() ?? '';
    const date = getDate(columns.eq(3).text().trim().replace('~ ', ' ~ '));

    posts.push({
      uniqId,
      title,
      date,
      detailUrl: cleanUrl(detailUrl),
      dateType: DateType.DURATION,
    });
  });

  return posts;
};

export const parseMuseumDetail = (html: string): ParsedTargetDetail => {
  const $ = cheerio.load(html);

  const content = $('div.viewStyle1');

  return {
    detailContent: new TurndownService().turndown(content.html() ?? ''),
    hasAttachedFile: $('div.flie-down-area ul li').length > 0,
    hasAttachedImage: content.find('img').length > 0,
  };
};
