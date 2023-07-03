const { normalizeURL, getURLsFromHTML } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("normalizeURL strip protocol from URL", () => {
  const input = "https://blog.alvinwanjala.com/posts/2014";
  const actual = normalizeURL(input);
  const expected = "blog.alvinwanjala.com/posts/2014";
  expect(actual).toEqual(expected);
});

test("normalizeURL strip trailing slash from URL", () => {
  const input = "https://blog.alvinwanjala.com/posts/2014/";
  const actual = normalizeURL(input);
  const expected = "blog.alvinwanjala.com/posts/2014";
  expect(actual).toEqual(expected);
});

test("normalizeURL remove capitalization", () => {
  const input = "https://blog.ALvinwanjala.com/posts/2014";
  const actual = normalizeURL(input);
  const expected = "blog.alvinwanjala.com/posts/2014";
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML for absolute URLs", () => {
  const inputHTMLBody = `
  <html>
    <body>
        <a href="https://blog.alvinwanjala.com/">Alvin's Blog</a>
    </body>
  </html>
  `;
  const inputBaseURL = `https://blog.alvinwanjala.com`;
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.alvinwanjala.com/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML for relative URLs", () => {
  const inputHTMLBody = `
  <html>
    <body>
        <a href="/posts/2014/">Alvin's Blog</a>
    </body>
  </html>
  `;
  const inputBaseURL = `https://blog.alvinwanjala.com`;
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.alvinwanjala.com/posts/2014/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML for multiple URLs", () => {
  const inputHTMLBody = `
  <html>
    <body>
        <a href="https://blog.alvinwanjala.com/posts/2014/">Alvin's Blog</a>
        <a href="/posts/2014/1">First blog post</a>
    </body>
  </html>
  `;
  const inputBaseURL = `https://blog.alvinwanjala.com`;
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [
    "https://blog.alvinwanjala.com/posts/2014/",
    "https://blog.alvinwanjala.com/posts/2014/1",
  ];
  expect(actual).toEqual(expected);
});
