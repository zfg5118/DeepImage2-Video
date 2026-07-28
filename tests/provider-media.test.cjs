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
  encodeVideoTaskId,
  extractErrorMessage,
  extractJobId,
  extractTaskStatus,
  extractVideoUrls,
  normalizeModelRecords,
  normalizeState,
  setTestDraftMedia,
  setTestSettings,
  videoStatusHeadersForTask,
  videoStatusEndpointForTask,
} = require("../app.js");

function media(name = "reference.png") {
  return {
    name,
    mime: "image/png",
    size: 4,
    dataUrl: "data:image/png;base64,YWJjZA==",
  };
}

function buildVideo(model, provider, overrides = {}, draft = {}) {
  setTestSettings({
    baseUrl: "https://deeprouter.top",
    apiKey: "test-key",
    videoModel: model,
    videoAspectRatio: "16:9",
    videoResolution: "720p",
    videoDuration: 8,
    videoAudio: true,
    videoApiStyle: "auto",
    videoEndpoint: "/v1/video/generations",
    videoStatusEndpoint: "/v1/video/generations/{id}",
    ...overrides,
  });
  setTestDraftMedia(draft);
  const vendor = provider === "veo" ? "Google" : provider === "sora" ? "OpenAI" : "xAI";
  return buildVideoRequest("测试视频提示词", { id: model, provider, vendor });
}

test("Grok Imagine 1.5 supports text-to-video on the DeepRouter multipart endpoint", () => {
  const request = buildVideo("grok-imagine-video-1.5-preview", "xai", {
    videoResolution: "720p",
    videoDuration: 20,
  });

  assert.equal(request.endpoint, "/v1/videos");
  assert.equal(request.headers.Authorization, "test-key");
  assert.equal(request.body instanceof FormData, true);
  assert.equal(request.body.get("model"), "grok-imagine-video-1.5-preview");
  assert.equal(request.body.get("prompt"), "测试视频提示词");
  assert.equal(request.body.get("seconds"), "20");
  assert.equal(request.body.get("resolution"), "720p");
  assert.equal(request.body.has("input_reference"), false);
});

test("Grok Imagine 1.5 uses the documented multipart endpoint with an image", () => {
  const reference = media();
  reference.file = new Blob(["abcd"], { type: "image/png" });
  const request = buildVideo("grok-imagine-video-1.5-preview", "xai", {
    videoAspectRatio: "3:2",
    videoResolution: "1080p",
    videoDuration: 20,
  }, { firstFrame: reference });

  assert.equal(request.endpoint, "/v1/videos");
  assert.equal(request.headers.Authorization, "test-key");
  assert.equal(request.body instanceof FormData, true);
  assert.equal(request.body.get("model"), "grok-imagine-video-1.5-preview");
  assert.equal(request.body.get("size"), "3:2");
  assert.equal(request.body.get("resolution"), "720p");
  assert.equal(request.body.get("seconds"), "20");
  assert.equal(request.body.get("duration"), "20");
  assert.equal(request.body.get("input_reference") instanceof Blob, true);
  assert.equal(videoStatusHeadersForTask({ provider: "xai", requestEndpoint: request.endpoint }).Authorization, "test-key");
});

test("nested video task errors expose the upstream cause", () => {
  const failure = {
    code: "fail_to_fetch_task",
    message: JSON.stringify({
      code: "fail_to_fetch_task",
      message: JSON.stringify({ status: "failed", error: { message: "上游视频生成失败" } }),
    }),
  };
  assert.equal(extractErrorMessage(failure), "上游视频生成失败");
  assert.equal(extractTaskStatus(failure), "failed");
});

test("nested queued video responses expose their task ID", () => {
  const response = {
    code: "fail_to_fetch_task",
    message: JSON.stringify({
      id: "29d48f1857d04674a663ff00e5750689",
      model: "doubao-seedance-2.0",
      status: "queued",
    }),
  };
  assert.equal(extractJobId(response), "29d48f1857d04674a663ff00e5750689");
  assert.equal(extractTaskStatus(response), "queued");
});

test("stringified task payloads expose completed video URLs", () => {
  const response = {
    message: JSON.stringify({ status: "succeeded", content: { video_url: "https://example.com/result.mp4" } }),
  };
  assert.equal(extractTaskStatus(response), "succeeded");
  assert.deepEqual(extractVideoUrls(response), ["https://example.com/result.mp4"]);
});

test("completed DeepRouter tasks prefer the directly playable upstream video URL", () => {
  setTestSettings({ baseUrl: "https://deeprouter.top" });
  const response = {
    data: {
      result_url: "https://www.deeprouter.top/v1/videos/task_public/content",
      data: {
        video_url: "https://api.huandutech.com/v1/videos/task_upstream/content",
      },
      status: "SUCCESS",
    },
  };
  assert.deepEqual(extractVideoUrls(response), [
    "https://api.huandutech.com/v1/videos/task_upstream/content",
  ]);
});

test("Grok Imagine 1.5 supports the official JSON endpoint when configured", () => {
  const request = buildVideo("grok-imagine-video-1.5-preview", "xai", {
    videoEndpoint: "/v1/videos/generations",
    videoAspectRatio: "2:3",
    videoResolution: "1080p",
    videoDuration: 20,
  }, { videoImages: [media()] });
  const body = JSON.parse(request.body);

  assert.equal(request.endpoint, "/v1/videos/generations");
  assert.equal(request.headers.Authorization, "Bearer test-key");
  assert.deepEqual(body, {
    model: "grok-imagine-video-1.5-preview",
    prompt: "测试视频提示词",
    duration: 20,
    aspect_ratio: "2:3",
    resolution: "720p",
    image: { url: "data:image/png;base64,YWJjZA==" },
  });
  assert.equal(videoStatusHeadersForTask({ provider: "xai", requestEndpoint: request.endpoint }).Authorization, "Bearer test-key");
});

test("all Grok video models use the shared supported duration and resolution values", () => {
  [6, 10, 12, 16, 20].forEach((duration) => {
    const request = buildVideo("grok-video-3", "xai", { videoDuration: duration });
    assert.equal(request.body.get("seconds"), String(duration));
    assert.equal(request.body.get("duration"), String(duration));
  });

  const standard = buildVideo("grok-video-3", "xai", { videoDuration: 20, videoResolution: "480p" });
  assert.equal(standard.body.get("seconds"), "20");
  assert.equal(standard.body.get("duration"), "20");
  assert.equal(standard.body.get("resolution"), "480p");

  const pro = buildVideo("grok-video-3-pro", "xai", { videoDuration: 20, videoAspectRatio: "9:16" });
  assert.equal(pro.body.get("seconds"), "20");
  assert.equal(pro.body.get("size"), "9:16");

  const repaired = buildVideo("grok-video-3", "xai", {
    videoAspectRatio: "21:9",
    videoResolution: "1080p",
    videoDuration: 15,
  });
  assert.equal(repaired.body.get("size"), "16:9");
  assert.equal(repaired.body.get("resolution"), "720p");
  assert.equal(repaired.body.get("seconds"), "16");
  assert.equal(repaired.body.get("duration"), "16");
});

test("DeepRouter Veo uses the documented multipart video endpoint", () => {
  const reference = media();
  reference.file = new Blob(["abcd"], { type: "image/png" });
  const request = buildVideo("veo_3_1-fast", "veo", {
    videoAspectRatio: "9:16",
    videoResolution: "4k",
    videoDuration: 4,
  }, { firstFrame: reference });

  assert.equal(request.endpoint, "/v1/videos");
  assert.equal(request.headers.Authorization, "test-key");
  assert.equal(request.body instanceof FormData, true);
  assert.equal(request.body.get("model"), "veo_3_1-fast");
  assert.equal(request.body.get("prompt"), "测试视频提示词");
  assert.equal(request.body.get("size"), "1080x1920");
  assert.equal(request.body.get("seconds"), "8");
  assert.equal(request.body.get("duration"), "8");
  assert.equal(request.body.get("resolution"), null);
  assert.equal(request.body.get("input_reference") instanceof Blob, true);
  const task = { provider: "veo", requestEndpoint: request.endpoint };
  assert.equal(videoStatusEndpointForTask(task), "/v1/videos/{id}");
  assert.equal(videoStatusHeadersForTask(task).Authorization, "test-key");
});

test("compact Veo aliases use the working multipart compatibility route", () => {
  const request = buildVideo("veo3.1-fast", "veo", {
    videoAspectRatio: "9:16",
    videoResolution: "720p",
    videoDuration: 4,
  });
  assert.equal(request.endpoint, "/v1/videos");
  assert.equal(request.headers.Authorization, "test-key");
  assert.equal(request.body instanceof FormData, true);
  assert.equal(request.body.get("model"), "veo3.1-fast");
  assert.equal(request.body.get("size"), "1080x1920");
  assert.equal(request.body.get("seconds"), "8");
  assert.equal(request.body.get("duration"), "8");
  const task = { provider: "veo", requestEndpoint: request.endpoint };
  assert.equal(videoStatusEndpointForTask(task), "/v1/videos/{id}");
  assert.equal(videoStatusHeadersForTask(task).Authorization, "test-key");
});

test("official Veo model IDs retain NewAPI metadata controls", () => {
  const request = buildVideo("veo-3.1-fast-generate-preview", "veo", {
    videoAspectRatio: "9:16",
    videoResolution: "4k",
    videoDuration: 4,
  });
  const body = JSON.parse(request.body);

  assert.equal(request.endpoint, "/v1/video/generations");
  assert.equal(request.headers.Authorization, "Bearer test-key");
  assert.equal(body.metadata.aspectRatio, "9:16");
  assert.equal(body.metadata.resolution, "4k");
  assert.equal(body.metadata.durationSeconds, 8);
});

test("Veo 3.1 uses predictLongRunning on a native Gemini service", () => {
  const request = buildVideo("veo-3.1-generate-preview", "veo", {
    baseUrl: "https://generativelanguage.googleapis.com",
    videoAspectRatio: "4:3",
    videoResolution: "4k",
    videoDuration: 4,
  });
  const body = JSON.parse(request.body);

  assert.equal(request.endpoint, "/v1beta/models/veo-3.1-generate-preview:predictLongRunning");
  assert.deepEqual(body, {
    instances: [{ prompt: "测试视频提示词" }],
    parameters: { aspectRatio: "16:9", durationSeconds: 8, resolution: "4k" },
  });
});

test("Veo 3.1 maps first frame, last frame, and reference images", () => {
  const request = buildVideo("veo-3.1-generate-preview", "veo", {
    baseUrl: "https://generativelanguage.googleapis.com",
  }, {
    firstFrame: media("first.png"),
    lastFrame: media("last.png"),
    videoImages: [media("asset.png")],
  });
  const body = JSON.parse(request.body);

  assert.equal(body.parameters.durationSeconds, 8);
  assert.equal(body.instances[0].image.inlineData.data, "YWJjZA==");
  assert.equal(body.instances[0].lastFrame.inlineData.data, "YWJjZA==");
  assert.equal(body.instances[0].referenceImages[0].referenceType, "asset");
});

test("Veo 2 omits its unsupported resolution parameter", () => {
  const request = buildVideo("veo-2", "veo", {
    baseUrl: "https://generativelanguage.googleapis.com",
    videoDuration: 7,
    videoResolution: "1080p",
  });
  const body = JSON.parse(request.body);
  assert.deepEqual(body.parameters, { aspectRatio: "16:9", durationSeconds: 6 });
});

test("Veo 3.1 Lite is restricted to its supported 720p output", () => {
  const request = buildVideo("veo-3.1-lite-generate-preview", "veo", {
    baseUrl: "https://generativelanguage.googleapis.com",
    videoResolution: "4k",
    videoDuration: 6,
  }, { videoImages: [media("first.png"), media("extra.png")] });
  const body = JSON.parse(request.body);

  assert.equal(body.parameters.resolution, "720p");
  assert.equal(body.parameters.durationSeconds, 6);
  assert.equal(body.instances[0].referenceImages, undefined);
});

test("Sora-2 text generation uses multipart duration aliases", () => {
  const request = buildVideo("sora-2", "sora", {
    videoAspectRatio: "1024x1792",
    videoDuration: 12,
  });
  assert.equal(request.endpoint, "/v1/videos");
  assert.equal(request.headers.Authorization, "Bearer test-key");
  assert.equal(request.body instanceof FormData, true);
  assert.equal(request.body.get("model"), "sora-2");
  assert.equal(request.body.get("size"), "1280x720");
  assert.equal(request.body.get("seconds"), "12");
  assert.equal(request.body.get("duration"), "12");
  const task = { provider: "sora", requestEndpoint: request.endpoint };
  assert.equal(videoStatusEndpointForTask(task), "/v1/videos/{id}");
  assert.equal(videoStatusHeadersForTask(task).Authorization, "Bearer test-key");
});

test("Sora-2 fixes old duration settings to the upstream 12-second default and filters Sora-2 Pro", () => {
  const request = buildVideo("sora-2", "sora", {
    videoAspectRatio: "9:16",
    videoDuration: 10,
  });
  assert.equal(request.body.get("size"), "1280x720");
  assert.equal(request.body.get("seconds"), "12");
  assert.equal(request.body.get("duration"), "12");

  const records = normalizeModelRecords([
    { id: "sora-2", type: "model" },
    { id: "sora-2-pro", type: "model" },
  ]);
  assert.deepEqual(records.map(({ id, vendor, type, provider }) => [id, vendor, type, provider]), [
    ["sora-2", "OpenAI", "video", "sora"],
  ]);
});

test("Sora-2 image generation retains multipart input and duration fields", () => {
  const reference = media();
  reference.file = new Blob(["abcd"], { type: "image/png" });
  const request = buildVideo("sora-2", "sora", { videoDuration: 4 }, { firstFrame: reference });

  assert.equal(request.body instanceof FormData, true);
  assert.equal(request.headers.Authorization, "Bearer test-key");
  assert.equal(request.body.get("size"), "1280x720");
  assert.equal(request.body.get("seconds"), "12");
  assert.equal(request.body.get("duration"), "12");
  assert.equal(request.body.get("input_reference") instanceof Blob, true);
});

test("video providers are classified and operation paths remain pollable", () => {
  const records = normalizeModelRecords([
    { id: "grok-imagine-video-1.5-preview", type: "model" },
    { id: "veo-3.1-generate-preview", type: "model" },
    { id: "veo3.1-fast", type: "model" },
  ]);
  assert.deepEqual(records.map(({ vendor, type, provider }) => [vendor, type, provider]), [
    ["xAI", "video", "xai"],
    ["Google", "video", "veo"],
    ["Google", "video", "veo"],
  ]);
  assert.deepEqual(records[0].capabilities, ["文生视频", "图生视频"]);
  assert.equal(extractJobId({ name: "models/veo/operations/op-123" }), "models/veo/operations/op-123");
  setTestSettings({
    baseUrl: "https://generativelanguage.googleapis.com",
    videoStatusEndpoint: "/v1/video/generations/{id}",
  });
  assert.equal(videoStatusEndpointForTask({ provider: "veo", requestEndpoint: "/v1beta/models/veo:predictLongRunning" }), "/v1beta/{id}");
  assert.equal(encodeVideoTaskId("models/veo/operations/op-123", { provider: "veo" }), "models/veo/operations/op-123");
});

test("persisted Veo selections survive state normalization", () => {
  const normalized = normalizeState({ settings: { videoModel: "veo-3.1" } });
  assert.equal(normalized.settings.videoModel, "veo-3.1");
});

test("official Grok JSON endpoint survives state normalization", () => {
  const normalized = normalizeState({ settings: { videoEndpoint: "/v1/videos/generations" } });
  assert.equal(normalized.settings.videoEndpoint, "/v1/videos/generations");
});
