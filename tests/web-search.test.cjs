const assert = require("node:assert/strict");
const test = require("node:test");

global.localStorage = {
  getItem() {
    return null;
  },
  setItem() {},
};
global.document = {
  addEventListener() {},
};

const { isWebSearchModel, resolveWebSearchModel } = require("../app.js");

test("search-preview models keep their selected model", () => {
  assert.equal(isWebSearchModel("gpt-4o-mini-search-preview"), true);
  assert.equal(resolveWebSearchModel("gpt-4o-mini-search-preview"), "gpt-4o-mini-search-preview");
});

test("regular chat models route to DeepRouter's documented search model", () => {
  assert.equal(isWebSearchModel("gpt-4o-mini"), false);
  assert.equal(resolveWebSearchModel("gpt-4o-mini"), "gpt-4o-search-preview");
});
