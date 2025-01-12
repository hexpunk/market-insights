import * as cheerio from 'cheerio';
import * as fs from 'node:fs/promises';
import range from '../range';
import Thunk from '../thunk';

const INITIAL_URL =
  'https://www.builtinchicago.org/jobs/remote/hybrid/office/dev-engineering';

function getNumberOfPages($: cheerio.CheerioAPI): number {
  return $('#pagination nav a')
    .toArray()
    .reduce((acc, el) => {
      if (el.firstChild?.type === 'text') {
        const num = parseInt(el.firstChild.nodeValue, 10);

        if (isNaN(num)) {
          return acc;
        }

        return Math.max(acc, num);
      }

      return acc;
    }, 1); // Start with 1 because if a page was received, there is at least one page.
}

function getJobCardsFromListPage($: cheerio.CheerioAPI): cheerio.Element[] {
  return $('[data-id=job-card]').toArray();
}

function fetchListPage(url: string): Thunk {
  return async () => {
    const response = await fetch(url);
    const $ = cheerio.load(await response.text());

    // TODO: Extract job listings from the page
  };
}

export const startCrawl: Thunk = async () => {
  const response = await fetch(INITIAL_URL);
  const $ = cheerio.load(await response.text());

  const numberOfPages = getNumberOfPages($);
  const pageThunks =
    numberOfPages > 1
      ? range(2, numberOfPages).map((i) => fetchListPage(`${INITIAL_URL}?page=${i}`))
      : [];

  return pageThunks;
};

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe('getNumberOfPages', async () => {
    const $ = cheerio.load(
      await fs.readFile(__dirname + '/__fixtures__/first_page.html', 'utf-8'),
    );

    it('returns the number of pages', async () => {
      expect(getNumberOfPages($)).toBe(15);
    });
  });

  describe('getJobCardsFromListPage', async () => {
    const $ = cheerio.load(
      await fs.readFile(__dirname + '/__fixtures__/first_page.html', 'utf-8'),
    );

    it('returns the job cards', async () => {
      expect(getJobCardsFromListPage($)).toHaveLength(11);
    });
  });
}
