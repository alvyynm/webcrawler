const { JSDOM } = require("jsdom");

async function crawlPage(baseUrl, currentUrl, pages) {
  const baseUrlObject = new URL(baseUrl);
  const currentUrlObject = new URL(currentUrl);

  if (baseUrlObject.hostname !== currentUrlObject.hostname) {
    return pages;
  }

  const normalizedCurrentUrl = normalizeURL(currentUrl);
  if (pages[normalizedCurrentUrl] > 0) {
    pages[normalizedCurrentUrl]++;
    return pages;
  }

  pages[normalizedCurrentUrl] = 1;

  console.log(`crawling ${currentUrl}`);

  try {
    const responseObj = await fetch(currentUrl);

    if (responseObj.status > 399) {
      console.log(
        `Error in fetch with status code ${responseObj.status} on page ${currentUrl}`
      );
      return pages;
    }

    const contentType = responseObj.headers.get("content-type");

    if (!contentType.includes("text/html")) {
      console.log(
        `Non-html response with content type ${contentType} on page ${currentUrl}`
      );
      return pages;
    }
    const htmlBody = await responseObj.text();

    const nextUrls = getURLsFromHTML(htmlBody, baseUrl);

    for (const nextUrl of nextUrls) {
      pages = await crawlPage(baseUrl, nextUrl, pages);
    }
  } catch (error) {
    console.log(`Error in fetching provided URL: ${error.message}`);
  }

  return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.startsWith("/")) {
      // relative url
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (error) {
        console.log(`invalid relative url found: ${error.message}`);
      }
    } else {
      // absolute url
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
      } catch (error) {
        console.log(`invalid absolute url found: ${error.message}`);
      }
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  let hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
