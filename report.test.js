const { sortPages } = require("./report.js");
const { test, expect } = require("@jest/globals");

test("sortPages", () => {
  const input = {
    "https://alvinwanjala.com/path": 1,
    "https://alvinwanjala.com": 3,
  };
  const actual = sortPages(input);
  const expected = [
    ["https://alvinwanjala.com", 3],
    ["https://alvinwanjala.com/path", 1],
  ];
  expect(actual).toEqual(expected);
});
