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

const { apiUrl, buildVideoReferences, normalizeModelRecords, parseLinkedNewApiSettings, setTestDraftMedia, setTestSettings } = require("../app.js");

test("NewAPI hash settings support source-compatible address encoding", () => {
  const raw = parseLinkedNewApiSettings({
    hash: '#/?settings={"key":"sk-test","url":"https://newapi.example.com/v1"}',
  });
  const encoded = parseLinkedNewApiSettings({
    hash: `#/?settings=${encodeURIComponent(JSON.stringify({ key: "sk-encoded", url: "https://api.example.com" }))}`,
  });
  const sourceCompatible = parseLinkedNewApiSettings({
    hash: '#/?settings={"key":"sk-source","url":"https%3A%2F%2Fwww.deeprouter.top"}',
  });

  assert.deepEqual(raw, { key: "sk-test", url: "https://newapi.example.com/v1" });
  assert.deepEqual(encoded, { key: "sk-encoded", url: "https://api.example.com" });
  assert.deepEqual(sourceCompatible, { key: "sk-source", url: "https://www.deeprouter.top" });
});

test("www.deeprouter.top is normalized to the working gateway route", () => {
  setTestSettings({ baseUrl: "https://www.deeprouter.top/", apiKey: "test-key" });
  assert.equal(apiUrl("/v1/images/generations"), "https://deeprouter.top/v1/images/generations");
});

test("MJ model records remain hidden", () => {
  const records = normalizeModelRecords([
    { id: "mj_imagine", type: "image" },
    { id: "niji-6", type: "image" },
    { id: "gpt-image-2", type: "image" },
  ]);

  assert.deepEqual(records.map((record) => record.id), ["gpt-image-2"]);
});

test("generated images become video reference images", () => {
  setTestDraftMedia({
    videoImages: [
      {
        name: "generated.png",
        mime: "image/png",
        size: 1024,
        dataUrl: "data:image/png;base64,YWJjZA==",
      },
    ],
  });

  assert.deepEqual(buildVideoReferences(), [
    {
      role: "reference_image",
      name: "generated.png",
      mime_type: "image/png",
      size: 1024,
      data_url: "data:image/png;base64,YWJjZA==",
    },
  ]);
});
