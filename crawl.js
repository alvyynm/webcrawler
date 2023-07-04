const { JSDOM } = require("jsdom");

async function crawlPage(currentUrl) {
  console.log(`crawling ${currentUrl}`);

  try {
    const responseObj = await fetch(currentUrl);

    if (responseObj.status > 399) {
      console.log(
        `Error in fetch with status code ${responseObj.status} on page ${currentUrl}`
      );
      return;
    }

    const contentType = responseObj.headers.get("content-type");

    if (!contentType.includes("text/html")) {
      console.log(
        `Non-html response with content type ${contentType} on page ${currentUrl}`
      );
      return;
    }
    console.log(await responseObj.text());
  } catch (error) {
    console.log(`Error in fetching provided URL: ${error.message}`);
  }
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
