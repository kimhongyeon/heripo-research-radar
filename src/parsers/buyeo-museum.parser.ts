import type { Cheerio } from 'cheerio';

import {
  DateType,
  type ParsedTargetDetail,
  type ParsedTargetListItem,
} from '@llm-newsletter-kit/core';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

import { cleanUrl, getDate } from './utils';

export const parseBuyeoMuseumList = (
  html: string,
  listId: string,
): ParsedTargetListItem[] => {
  const $ = cheerio.load(html);
  const posts: ParsedTargetListItem[] = [];
  const baseUrl = 'https://buyeo.museum.go.kr';

  $('table.tableType1 tbody tr').each((index, element) => {
    const columns = $(element).find('td');
    if (columns.length === 0) {
      return;
    }

    const titleElement = columns.eq(1).find('a');
    const uniqId = getUniqIdFromBuyeoMuseum(columns.eq(1));
    const detailUrl = `${baseUrl}/bbs/view.do?pstSn=${uniqId}&key=${listId}`;

    const title =
      titleElement
        .clone() // 원본을 수정하지 않도록 복사
        .find('span, i') // span과 i 태그 선택
        .remove() // 제거
        .end() // 원래 요소로 돌아감
        .text() // 텍스트 추출
        .trim() ||
      titleElement.attr('title')?.trim() ||
      '';

    const date = getDate(columns.eq(4).text().trim());

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

export const parseBuyeoMuseumDetail = (html: string): ParsedTargetDetail => {
  const $ = cheerio.load(html);

  const content = $('div.cont');

  return {
    detailContent: new TurndownService().turndown(content.html() ?? ''),
    hasAttachedFile: $('div.attachmentWrap ul.noList').length === 0,
    hasAttachedImage: content.find('img').length > 0,
  };
};

function getUniqIdFromBuyeoMuseum(element: Cheerio<any>) {
  return (element.attr('onclick') ?? '').match(/goView\('(.*)'\)/)?.[1] ?? '';
}
