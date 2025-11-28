import type { Cheerio } from 'cheerio';

import {
  DateType,
  type ParsedTargetDetail,
  type ParsedTargetListItem,
} from '@llm-newsletter-kit/core';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

import { getDate } from './utils';

export const parseExcavationStatusList = (
  html: string,
): ParsedTargetListItem[] => {
  const $ = cheerio.load(html);
  const posts: ParsedTargetListItem[] = [];
  const baseUrl = 'https://www.e-minwon.go.kr';

  $('table.td_left tbody tr.list_tr').each((index, element) => {
    const columns = $(element).find('td');
    if (columns.length === 0) {
      return;
    }

    const titleElement = columns.eq(1).find('a');
    const relativeHref = titleElement.attr('href');

    if (!relativeHref) {
      return;
    }

    const uniqId = getUniqIdFromExcavationItem(titleElement);
    const title =
      titleElement.attr('title')?.trim() ?? titleElement.text().trim() ?? '';
    const date = getDate(columns.eq(4).text().trim());

    const detailUrl = `${baseUrl}/ge/ee/getEcexmPrmsnAply.do?ecexmRcno=${uniqId}`;

    posts.push({
      uniqId,
      title,
      date,
      detailUrl,
      dateType: DateType.REGISTERED,
    });
  });

  return posts;
};

export const parseExcavationReportList = (
  html: string,
): ParsedTargetListItem[] => {
  const $ = cheerio.load(html);
  const posts: ParsedTargetListItem[] = [];
  const baseUrl = 'https://www.e-minwon.go.kr';

  $('table.td_left tbody tr.list_tr').each((index, element) => {
    const columns = $(element).find('td');
    if (columns.length === 0) {
      return;
    }

    const titleElement = columns.eq(2).find('a');
    const relativeHref = titleElement.attr('href');

    if (!relativeHref) {
      return;
    }

    const uniqId = getUniqIdFromExcavationItem(titleElement);
    const title =
      titleElement.attr('title')?.trim() ?? titleElement.text().trim() ?? '';
    const date = getDate(columns.eq(6).text().trim());

    const detailUrl = `${baseUrl}/ge/ee/getEcexmRptp.do?ecexmRcno=${uniqId}`;

    posts.push({
      uniqId,
      title,
      date,
      detailUrl,
      dateType: DateType.REGISTERED,
    });
  });

  return posts;
};

export const parseExcavationSiteList = (
  html: string,
): ParsedTargetListItem[] => {
  const $ = cheerio.load(html);
  const posts: ParsedTargetListItem[] = [];
  const baseUrl = 'https://www.e-minwon.go.kr';

  $('table.td_left tbody tr.list_tr').each((index, element) => {
    const columns = $(element).find('td');
    if (columns.length === 0) {
      return;
    }

    const titleElement = columns.eq(1).find('a');
    const relativeHref = titleElement.attr('href');

    if (!relativeHref) {
      return;
    }

    const uniqId = getUniqIdFromExcavationItem(titleElement);
    const title =
      titleElement.attr('title')?.trim() ?? titleElement.text().trim() ?? '';
    const date = getDate(columns.eq(4).text().trim());

    const detailUrl = `${baseUrl}/ge/ee/getLinkGrndsRls.do?grndsRlsSeqc=${uniqId}`;

    posts.push({
      uniqId,
      title,
      date,
      detailUrl,
      dateType: DateType.DURATION,
    });
  });

  return posts;
};

export const parseExcavationStatusDetail = (
  html: string,
): ParsedTargetDetail => {
  const $ = cheerio.load(html);

  const content = $('table.td_left').parent();

  return {
    detailContent: new TurndownService().turndown(content.html() ?? ''),
    hasAttachedFile: false,
    hasAttachedImage: false,
  };
};

export const parseExcavationReportDetail = (
  html: string,
): ParsedTargetDetail => {
  const $ = cheerio.load(html);

  const content = $('table.td_left').parent();

  const trList = content.find('table tbody tr');
  trList.each((index, element) => {
    if (trList.length === index + 1) {
      $(element).remove();
    }
  });

  return {
    detailContent: new TurndownService().turndown(content.html() ?? ''),
    hasAttachedFile: true,
    hasAttachedImage: false,
  };
};

export const parseExcavationSiteDetail = (html: string): ParsedTargetDetail => {
  const $ = cheerio.load(html);

  const content = $('div.board_view').parent();

  const dlList = content.find('div dl');
  dlList.each((index, element) => {
    if (dlList.length === index + 1) {
      $(element).remove();
    }
  });

  return {
    detailContent: new TurndownService().turndown(content.html() ?? ''),
    hasAttachedFile: true,
    hasAttachedImage: false,
  };
};

function getUniqIdFromExcavationItem(element: Cheerio<any>) {
  return (
    (element.attr('onclick') ?? '').match(/dataSelected\('(.*)'\)/)?.[1] ?? ''
  );
}
