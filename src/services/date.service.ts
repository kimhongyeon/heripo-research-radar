import type { DateService as CoreDateService, IsoDateString } from '@llm-newsletter-kit/core';

/**
 * Date service implementation
 * - Provides current date and display date strings
 */
export class DateService implements CoreDateService {
  /**
   * Get current date in ISO format (YYYY-MM-DD)
   * @returns ISO date string (e.g., "2024-10-15")
   */
  getCurrentISODateString(): IsoDateString {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}` as IsoDateString;
  }

  /**
   * Get formatted display date string
   * @returns Korean formatted date (e.g., "2024년 10월 15일")
   */
  getDisplayDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return `${year}년 ${month}월 ${day}일`;
  }
}
