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

const {
  buildVideoRequest,
  effectiveVideoAspectRatio,
  effectiveVideoCount,
  effectiveVideoResolution,
  isSeedance2Model,
  isSeedance2FastModel,
  isSeedance20UnifiedModel,
  normalizeSeedDanceDuration,
  setTestDraftMedia,
  setTestSettings,
  videoStatusEndpointForTask,
} = require("../app.js");

function build(model, overrides = {}) {
  setTestSettings({
    baseUrl: "https://deeprouter.top",
    apiKey: "test-key",
    videoModel: model,
    videoAspectRatio: "16:9",
    videoResolution: "720p",
    videoDuration: 5,
    videoEndpoint: "/v1/video/generations",
    ...overrides,
  });
  setTestDraftMedia(overrides.draftMedia || {});
  return buildVideoRequest("测试视频提示词", {
    provider: "seedance",
    vendor: "Doubao",
  });
}

test("Seedance 2.0 Fast and Mini aliases support only 480p and 720p", () => {
  [
    "doubao-seedance-2-0-fast-260128",
    "doubao-seedance-2-0-mini-260615",
    "dreamina-seedance-2-0-260128-fast",
  ].forEach((model) => {
    const request = build(model, { videoResolution: "480p", videoAspectRatio: "adaptive", videoDuration: -1 });
    const body = JSON.parse(request.body);
    assert.equal(isSeedance2FastModel(body.model), true);
    assert.equal(request.endpoint, "/v1/video/generations");
    assert.equal(body.metadata.resolution, "480p");
    assert.equal(body.metadata.ratio, "adaptive");
    assert.equal(body.metadata.duration, -1);
    assert.equal(body.seconds, undefined);
    assert.equal(body.duration_seconds, undefined);
    assert.equal(body.metadata.seconds, undefined);
    assert.equal(body.metadata.duration_seconds, undefined);

    const repaired = JSON.parse(build(model, { videoResolution: "4k" }).body);
    assert.equal(repaired.metadata.resolution, "720p");
  });
});

test("Seedance 2.0 standard aliases support adaptive ratio, automatic duration, and 4K", () => {
  [
    "doubao-seedance-2.0",
    "doubao-seedance-2-0-260128",
    "dreamina-seedance-2-0-260128",
    "seedance-2.0",
  ].forEach((model) => {
    const body = JSON.parse(build(model, {
      videoResolution: "4k",
      videoAspectRatio: "adaptive",
      videoDuration: -1,
    }).body);
    assert.equal(isSeedance2Model(model), true);
    assert.equal(isSeedance2FastModel(model), false);
    assert.equal(body.resolution || body.metadata?.resolution, "4k");
    assert.equal(body.ratio || body.metadata?.ratio, "adaptive");
    assert.equal(body.metadata?.duration ?? body.duration, -1);
    if (body.metadata) {
      assert.equal(body.seconds, undefined);
      assert.equal(body.duration_seconds, undefined);
      assert.equal(body.metadata.seconds, undefined);
      assert.equal(body.metadata.duration_seconds, undefined);
    }
  });
});

test("Seedance 2.0 standard preserves supported ratio and resolution", () => {
  const request = build("doubao-seedance-2-0-260128", {
    videoAspectRatio: "3:4",
    videoResolution: "1080p",
    videoDuration: 12,
  });
  const body = JSON.parse(request.body);

  assert.equal(body.seconds, "12");
  assert.equal(body.duration, 12);
  assert.equal(body.duration_seconds, 12);
  assert.equal(body.metadata.duration, 12);
  assert.equal(body.metadata.seconds, 12);
  assert.equal(body.metadata.duration_seconds, 12);
  assert.deepEqual(body.metadata, {
    ratio: "3:4",
    resolution: "1080p",
    duration: 12,
    seconds: 12,
    duration_seconds: 12,
  });
});

test("all Seedance models support 21:9 and repair unsupported persisted parameters", () => {
  build("doubao-seedance-2-0-260128", {
    videoAspectRatio: "21:9",
    videoResolution: "2k",
  });

  assert.equal(effectiveVideoAspectRatio(), "21:9");
  assert.equal(effectiveVideoResolution(), "720p");

  build("seedance-1.0-pro", { videoAspectRatio: "2:1" });
  assert.equal(effectiveVideoAspectRatio(), "16:9");
});

test("Seedance 2.0 duration supports automatic mode and 5 through 15 seconds on dated aliases", () => {
  assert.equal(normalizeSeedDanceDuration(2, "doubao-seedance-2-0-260128"), 5);
  assert.equal(normalizeSeedDanceDuration(30, "doubao-seedance-2-0-260128"), 15);
  assert.equal(normalizeSeedDanceDuration(9.6, "doubao-seedance-2-0-260128"), 10);
  assert.equal(normalizeSeedDanceDuration(-1, "doubao-seedance-2-0-260128"), -1);
});

test("doubao-seedance-2.0 uses the NewAPI task protocol on DeepRouter", () => {
  const request = build("doubao-seedance-2.0", {
    videoAspectRatio: "adaptive",
    videoResolution: "1080p",
    videoDuration: 4,
    videoAudio: true,
  });
  const body = JSON.parse(request.body);

  assert.equal(body.model, "doubao-seedance-2.0");
  assert.equal(request.endpoint, "/v1/video/generations");
  assert.equal(body.prompt, "测试视频提示词");
  assert.equal(body.duration, 4);
  assert.equal(body.seconds, "4");
  assert.equal(body.duration_seconds, 4);
  assert.equal(body.ratio, "adaptive");
  assert.equal(body.resolution, "1080p");
  assert.deepEqual(body.metadata.content, [{ type: "text", text: "测试视频提示词" }]);
  assert.equal(body.metadata.duration, 4);
  assert.equal(body.metadata.seconds, 4);
  assert.equal(body.metadata.duration_seconds, 4);
  assert.equal(body.metadata.ratio, "adaptive");
  assert.equal(body.metadata.resolution, "1080p");
  assert.equal(body.metadata.generate_audio, true);
  assert.equal(body.metadata.watermark, false);
  assert.equal(body.content, undefined);
  assert.equal(videoStatusEndpointForTask({
    provider: "seedance",
    requestEndpoint: request.endpoint,
  }), "/v1/video/generations/{id}");
});

test("doubao-seedance-2.0 retains the same task protocol outside DeepRouter", () => {
  const request = build("doubao-seedance-2.0", {
    baseUrl: "https://api.bananarouter.com",
    videoAspectRatio: "adaptive",
    videoResolution: "1080p",
    videoDuration: 4,
    videoAudio: true,
  });
  const body = JSON.parse(request.body);

  assert.equal(isSeedance20UnifiedModel(body.model), true);
  assert.equal(request.endpoint, "/api/v3/contents/generations/tasks");
  assert.equal(body.prompt, undefined);
  assert.deepEqual(body.content, [{ type: "text", text: "测试视频提示词" }]);
  assert.equal(body.duration, 4);
  assert.equal(body.ratio, "adaptive");
  assert.equal(body.resolution, "1080p");
  assert.equal(body.generate_audio, true);
  assert.equal(body.watermark, false);
  assert.equal(body.seconds, undefined);
  assert.equal(body.metadata, undefined);
});

test("doubao-seedance-2.0 supports 4 through 15 seconds", () => {
  setTestSettings({ baseUrl: "https://api.bananarouter.com", videoModel: "doubao-seedance-2.0" });
  assert.equal(normalizeSeedDanceDuration(-1, "doubao-seedance-2.0"), -1);
  assert.equal(normalizeSeedDanceDuration(2, "doubao-seedance-2.0"), 4);
  assert.equal(normalizeSeedDanceDuration(20, "doubao-seedance-2.0"), 15);
});

test("DeepRouter Seedance 2.0 keeps automatic duration in metadata", () => {
  const body = JSON.parse(build("doubao-seedance-2.0", { videoDuration: -1 }).body);
  assert.equal(body.duration, undefined);
  assert.equal(body.seconds, undefined);
  assert.equal(body.duration_seconds, undefined);
  assert.equal(body.metadata.duration, -1);
  assert.equal(body.metadata.seconds, undefined);
  assert.equal(body.metadata.duration_seconds, undefined);
});

test("Seedance 2.0 generation count supports 1 through 8 without affecting other video models", () => {
  setTestSettings({ videoModel: "dreamina-seedance-2-0-260128", videoCount: 8 });
  assert.equal(effectiveVideoCount(), 8);

  setTestSettings({ videoModel: "doubao-seedance-2-0-mini-260615", videoCount: 12 });
  assert.equal(effectiveVideoCount(), 8);

  setTestSettings({ videoModel: "grok-video-3", videoCount: 8 });
  assert.equal(effectiveVideoCount(), 1);
});
