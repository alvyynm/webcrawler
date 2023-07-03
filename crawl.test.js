const { normalizeURL } = require("./crawl.js");
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
