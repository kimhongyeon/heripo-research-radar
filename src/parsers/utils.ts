/**
 * Formats a date string by replacing dots with dashes.
 * If the string contains a newline (indicating a date range),
 * it formats it as "start ~ end".
 *
 * Examples:
 * - "2024.01.15" → "2024-01-15"
 * - "2024.01.15\n2024.01.20" → "2024-01-15 ~ 2024-01-20"
 *
 * @param str The date string to format
 * @returns The formatted date string with dashes instead of dots
 */
export function getDate(str: string) {
  if (str.includes('\n')) {
    const textArr = str.split('\n');
    return `${textArr[0]} ~ ${textArr[1].trim()}`.replaceAll('.', '-');
  }

  return str.replaceAll('.', '-');
}

/**
 * Removes unnecessary parts from a URL such as session IDs and pagination parameters.
 * The following items are removed:
 * - Session IDs like ;jsessionid=xxx
 * - Query parameters: pageIndex, pageUnit, strWhere, searchWrd, sdate, edate
 *
 * Example: https://example.com/path;jsessionid=123456?id=123&pageIndex=1 → https://example.com/path?id=123
 *
 * @param url The URL string to clean
 * @returns The cleaned URL with unnecessary parts removed
 */
export function cleanUrl(url: string): string {
  if (!url) {
    return url;
  }

  try {
    // Remove all session ID information from semicolon (;) to before question mark (?) or hash (#)
    let cleaned = url.replace(/;[^?#]*/g, '');

    // Create URL object for parsing
    const urlObj = new URL(cleaned);

    // List of parameters to remove
    const paramsToRemove = [
      'pageIndex',
      'pageUnit',
      'strWhere',
      'searchWrd',
      'sdate',
      'edate',
    ];

    // Remove each unnecessary parameter
    paramsToRemove.forEach((param) => {
      urlObj.searchParams.delete(param);
    });

    // Return the cleaned URL string
    cleaned = urlObj.toString();

    return cleaned;
  } catch {
    return url; // Return original URL if an error occurs
  }
}
