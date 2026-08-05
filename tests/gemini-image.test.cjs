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
  apiUrl,
  buildImageRequest,
  extractImageUrls,
  imageGenerationModeForReferences,
  imageQualityOptionsForModel,
  imageSizeOptionsForModel,
  imageStyleOptionsForModel,
  normalizeGptImageSize,
  resolveGeminiImageRoute,
  setTestSettings,
} = require("../app.js");

test("image generation mode is inferred only from uploaded references", () => {
  assert.equal(imageGenerationModeForReferences([]), "text-to-image");
  assert.equal(imageGenerationModeForReferences([{ name: "reference.png" }]), "image-to-image");
});

function build(model, overrides = {}, references = [], isEdit = false) {
  setTestSettings({
    baseUrl: "https://deeprouter.top",
    apiKey: "test-key",
    imageModel: model,
    imageApiStyle: "auto",
    imageAspectRatio: "9:16",
    imageSize: "1024x1792",
    imageQuality: "auto",
    ...overrides,
  });
  return buildImageRequest("测试提示词", references, isEdit);
}

test("Gemini 3.1 Flash image generation uses chat completions", () => {
  const request = build("gemini-3.1-flash-image-preview", { imageApiStyle: "openai" });
  const body = JSON.parse(request.body);

  assert.equal(resolveGeminiImageRoute(body.model), "chat");
  assert.equal(request.endpoint, "/v1/chat/completions");
  assert.equal(body.stream, false);
  assert.match(body.messages[0].content[0].text, /测试提示词[\s\S]*输出尺寸：2K[\s\S]*画面比例：9:16/);
  assert.equal(body.input, undefined);
});

test("Gemini 2.5 image generation uses native generateContent", () => {
  const request = build("gemini-2.5-flash-image-preview", {
    imageAspectRatio: "3:2",
    imageSize: "1K",
  });
  const body = JSON.parse(request.body);

  assert.equal(resolveGeminiImageRoute("gemini-2.5-flash-image-preview"), "native");
  assert.equal(request.endpoint, "/v1beta/models/gemini-2.5-flash-image-preview:generateContent");
  assert.deepEqual(body.generationConfig.imageConfig, { aspectRatio: "3:2", imageSize: "1K" });
});

test("Gemini 2.5 maps persisted pixel dimensions to a supported size", () => {
  const request = build("gemini-2.5-flash-image-preview", {
    imageAspectRatio: "16:9",
    imageSize: "2048x2048",
  });
  assert.equal(JSON.parse(request.body).generationConfig.imageConfig.imageSize, "2K");
});

test("GPT Image 1.5 uses non-streaming JSON responses", () => {
  const request = build("gpt-image-1.5");
  const body = JSON.parse(request.body);

  assert.equal(request.endpoint, "/v1/images/generations");
  assert.equal(body.stream, undefined);
  assert.equal(body.output_format, undefined);
  assert.equal(body.response_format, "url");
});

test("GPT Image 2 uses synchronous JSON responses", () => {
  const request = build("gpt-image-2", { imageSize: "1025x769" });
  const body = JSON.parse(request.body);

  assert.equal(body.stream, undefined);
  assert.equal(body.output_format, undefined);
  assert.equal(body.response_format, "url");
  assert.equal(body.size, "1024x768");
});

test("GPT Image dimensions are normalized to channel constraints", () => {
  assert.equal(normalizeGptImageSize("1001x1001"), "1008x1008");
  assert.equal(normalizeGptImageSize("1024×1024"), "1024x1024");
  const [width, height] = normalizeGptImageSize("255x255").split("x").map(Number);
  assert.equal(width % 16, 0);
  assert.equal(height % 16, 0);
  assert.ok(width * height >= 655360);
});

test("Gemini 3 Pro image generation uses native ratio and image size", () => {
  const request = build("gemini-3-pro-image-preview", { imageQuality: "high" });
  const body = JSON.parse(request.body);

  assert.equal(request.endpoint, "/v1beta/models/gemini-3-pro-image-preview:generateContent");
  assert.equal(apiUrl(request.endpoint), "https://deeprouter.top/v1beta/models/gemini-3-pro-image-preview:generateContent");
  assert.deepEqual(body.generationConfig, {
    responseModalities: ["TEXT", "IMAGE"],
    imageConfig: { aspectRatio: "9:16", imageSize: "4K" },
  });
  assert.match(body.contents[0].parts[0].text, /测试提示词[\s\S]*质量：高质量精细渲染[\s\S]*输出尺寸：4K/);
});

test("modern Gemini native image models use their selected image size", () => {
  const request = build("gemini-3.1-flash-image-preview", {
    baseUrl: "https://api.bananarouter.com",
    imageAspectRatio: "4:5",
    imageSize: "2K",
  });
  const body = JSON.parse(request.body);

  assert.equal(request.endpoint, "/v1beta/models/gemini-3.1-flash-image-preview:generateContent");
  assert.deepEqual(body.generationConfig.imageConfig, { aspectRatio: "4:5", imageSize: "2K" });
});

test("Gemini 2.0 native edit strips the reference data URL prefix", () => {
  const base64 = "YWJjZA==";
  const request = build(
    "gemini-2.0-flash-exp-image-generation",
    {},
    [{ name: "reference.jpg", mime: "image/jpeg", dataUrl: `data:image/jpeg;base64,${base64}` }],
    true
  );
  const body = JSON.parse(request.body);

  assert.equal(request.endpoint, "/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent");
  assert.deepEqual(body.contents[0].parts[1], {
    inline_data: { mime_type: "image/jpeg", data: base64 },
  });
  assert.deepEqual(body.generationConfig, { responseModalities: ["TEXT", "IMAGE"] });
});

test("image editing preserves multiple uploaded reference images", () => {
  const references = ["YWJjZA==", "ZWZnaA=="].map((data, index) => ({
    name: `reference-${index + 1}.png`,
    mime: "image/png",
    size: 4,
    dataUrl: `data:image/png;base64,${data}`,
    file: new Blob([data], { type: "image/png" }),
  }));

  const openai = build("gpt-image-2", {}, references, true);
  assert.equal(openai.body instanceof FormData, true);
  assert.equal(openai.body.getAll("image").length, 2);

  const gemini = build("gemini-2.5-flash-image-preview", {}, references, true);
  const body = JSON.parse(gemini.body);
  assert.equal(body.contents[0].parts.length, 3);
  assert.equal(body.contents[0].parts[1].inline_data.data, "YWJjZA==");
  assert.equal(body.contents[0].parts[2].inline_data.data, "ZWZnaA==");
});

test("native and chat Gemini responses expose displayable images", () => {
  const nativeBase64 = "a".repeat(240);
  const chatBase64 = "b".repeat(240);
  const native = {
    candidates: [{ content: { parts: [{ inlineData: { mimeType: "image/jpeg", data: nativeBase64 } }] } }],
  };
  const chat = {
    choices: [{ message: { content: `完成\n![image](data:image/png;base64,${chatBase64})` } }],
  };

  assert.deepEqual(extractImageUrls(native), [`data:image/jpeg;base64,${nativeBase64}`]);
  assert.deepEqual(extractImageUrls(chat), [`data:image/png;base64,${chatBase64}`]);
});

test("all Gemini image models expose size, quality, and style controls", () => {
  setTestSettings({
    imageModel: "gemini-2.5-flash-image-preview",
    imageSize: "auto",
    imageQuality: "high",
    imageStyle: "cinematic",
    imageAspectRatio: "16:9",
  });
  assert.deepEqual(imageSizeOptionsForModel().map((item) => item.value), ["auto", "1K", "2K", "4K"]);
  assert.deepEqual(
    imageQualityOptionsForModel().map((item) => item.value),
    ["auto", "standard", "hd", "low", "medium", "high"]
  );
  assert.equal(imageStyleOptionsForModel().some((item) => item.value === "cinematic"), true);

  const body = JSON.parse(buildImageRequest("城市夜景", [], false).body);
  assert.equal(body.generationConfig.imageConfig.imageSize, "4K");
  assert.match(body.contents[0].parts[0].text, /城市夜景[\s\S]*电影感构图[\s\S]*高质量精细渲染/);
  assert.equal(body.quality, undefined);
  assert.equal(body.style, undefined);
});
