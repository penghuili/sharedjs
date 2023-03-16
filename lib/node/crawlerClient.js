import { load } from 'cheerio';
import { gotScraping } from 'got-scraping';
import url from 'url';

const crawlerClient = {
  async getContent(link, selector) {
    const trimmedLink = link.trim();
    const { body } = await gotScraping.get(trimmedLink);
    const $ = load(body);

    return getOneContent($, trimmedLink, selector);
  },

  async getContents(link, selectors) {
    const trimmedLink = link.trim();
    const { body } = await gotScraping.get(trimmedLink);
    const $ = load(body);

    return selectors.map(selector => getOneContent($, trimmedLink, selector));
  },

  async getMeta(link) {
    const trimmedLink = link.trim();
    const { body } = await gotScraping.get(trimmedLink);
    const $ = load(body);

    const title = getElementContent($('head title'));
    const description = getElementContent($('head meta[name="description"]'), 'content');
    const iconLink = getIconLink($, trimmedLink);

    return { title, description, iconLink };
  },
};

function getIconLink($, trimmedLink) {
  const rawElements = $('head link[rel*="icon"]');
  const arrElements = [...rawElements];
  const iconsWithSize = [];
  const iconsWithoutSize = [];
  arrElements.forEach((element, index) => {
    const size = +($(element).attr('sizes') || '').split('x')[0];
    if (size) {
      iconsWithSize.push({ size, index });
    } else {
      iconsWithoutSize.push({ index });
    }
  });

  if (iconsWithSize.length) {
    const maxSize = Math.max(...iconsWithSize.map(icon => icon.size));
    const maxIndex = iconsWithSize.find(icon => icon.size === maxSize).index;
    const iconHref = rawElements.eq(maxIndex).attr('href');
    if (iconHref) {
      const iconLink = addDomain(trimmedLink, iconHref);
      return iconLink;
    }
  }

  if (iconsWithoutSize.length) {
    const hrefs = iconsWithoutSize
      .map(icon => rawElements.eq(icon.index).attr('href'))
      .filter(href => href);

    if (hrefs[0]) {
      return addDomain(trimmedLink, hrefs[0]);
    }
  }

  return null;
}

function getElementContent(element, prop = 'innerText') {
  return (element.prop(prop) || '').trim().replace(/\s+/g, ' ');
}

function getOneContent($, link, selector) {
  const trimmedSelector = selector?.trim();
  const element = $(trimmedSelector).first();
  const content = getElementContent(element);
  const contentLink = getContentLink(link, element);

  return { selector: trimmedSelector, content, contentLink };
}

function addDomain(link, contentLink) {
  if (!contentLink.includes('://')) {
    const { origin } = new url.URL(link);
    const path = contentLink.startsWith('/') ? contentLink : `/${contentLink}`;
    return `${origin}${path}`;
  }

  return contentLink;
}

function getContentLink(link, element) {
  if (!element.is('a')) {
    return null;
  }

  const contentLink = element.attr('href') || '';
  if (!contentLink) {
    return null;
  }

  return addDomain(link, contentLink);
}

export default crawlerClient;
