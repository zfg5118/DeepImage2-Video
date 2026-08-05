const STORAGE_KEY = "yhshu_online_client_state_v1";
const EXPORT_VERSION = 2;
const DEFAULT_API_BASE_URL = "https://deeprouter.top";
const LEGACY_DEFAULT_API_BASE_URLS = new Set(["https://www.yhshu.ai"]);
const MEDIA_CACHE_DB_NAME = "yhshu_visual_media_cache";
const MEDIA_CACHE_STORE = "visual_media";
const MEDIA_CACHE_VERSION = 1;

const MODEL_CATALOG = [
  {
    id: "gpt-image-2",
    label: "GPT Image 2",
    vendor: "OpenAI",
    type: "image",
    provider: "openai",
    capabilities: ["文生图", "图生图", "高质量"],
    description: "OpenAI 图片模型，按 size、quality、style 映射。",
  },
  {
    id: "gpt-image-1",
    label: "GPT Image 1",
    vendor: "OpenAI",
    type: "image",
    provider: "openai",
    capabilities: ["文生图", "图生图"],
    description: "OpenAI 图片生成/编辑兼容模型。",
  },
  {
    id: "dall-e-3",
    label: "DALL-E 3",
    vendor: "OpenAI",
    type: "image",
    provider: "openai",
    capabilities: ["文生图"],
    description: "兼容 vivid/natural 和 standard/hd 参数。",
  },
  {
    id: "gemini-2.5-flash-image-preview",
    label: "Gemini 2.5 Flash Image",
    vendor: "Gemini",
    type: "image",
    provider: "gemini",
    capabilities: ["文生图", "图生图", "参考图"],
    description: "Gemini 图片模型，优先使用比例、分辨率和多模态输入参数。",
  },
  {
    id: "gemini-2.0-flash-preview-image-generation",
    label: "Gemini 2.0 Flash Image",
    vendor: "Gemini",
    type: "image",
    provider: "gemini",
    capabilities: ["文生图", "图生图"],
    description: "Gemini 旧版图片预览模型。",
  },
  {
    id: "seedream-4.0",
    label: "Seedream 4.0",
    vendor: "Doubao",
    type: "image",
    provider: "seed",
    capabilities: ["文生图", "图生图"],
    description: "Seedream/豆包图片模型，使用通用图片参数。",
  },
  {
    id: "grok-2-image",
    label: "Grok Image",
    vendor: "xAI",
    type: "image",
    provider: "xai",
    capabilities: ["文生图"],
    description: "xAI 图片模型预设。",
  },
  {
    id: "seedance-1.0-pro",
    label: "SeedDance Pro",
    vendor: "Doubao",
    type: "video",
    provider: "seedance",
    capabilities: ["文生视频", "首尾帧", "参考视频"],
    description: "SeedDance 视频模型，适配 duration、resolution、aspect_ratio。",
  },
  {
    id: "seedance-1.0-lite",
    label: "SeedDance Lite",
    vendor: "Doubao",
    type: "video",
    provider: "seedance",
    capabilities: ["文生视频", "图生视频"],
    description: "SeedDance 轻量视频预设。",
  },
  {
    id: "grok-video",
    label: "Grok Video",
    vendor: "xAI",
    type: "video",
    provider: "xai",
    capabilities: ["文生视频", "图生视频"],
    description: "Grok 视频生成预设。",
  },
  {
    id: "grok-imagine-video-1.5-preview",
    label: "Grok Imagine Video 1.5 Preview",
    vendor: "xAI",
    type: "video",
    provider: "xai",
    capabilities: ["文生视频", "图生视频"],
    description: "支持纯文本生成视频，也可上传一张参考图进行图生视频。",
  },
  {
    id: "veo-3.1",
    label: "Veo 3.1",
    vendor: "Google",
    type: "video",
    provider: "veo",
    capabilities: ["文生视频", "图生视频", "音频"],
    description: "Google Veo 视频模型，支持时长、比例和音频开关。",
  },
  {
    id: "veo-3.1-fast",
    label: "Veo 3.1 Fast",
    vendor: "Google",
    type: "video",
    provider: "veo",
    capabilities: ["快速视频", "图生视频"],
    description: "Veo 快速生成预设。",
  },
  {
    id: "veo-2",
    label: "Veo 2",
    vendor: "Google",
    type: "video",
    provider: "veo",
    capabilities: ["文生视频", "图生视频"],
    description: "Veo 2 兼容预设。",
  },
];

const IMAGE_ASPECT_OPTIONS = [
  { value: "1:1", label: "1:1" },
  { value: "4:3", label: "4:3" },
  { value: "3:4", label: "3:4" },
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
  { value: "21:9", label: "21:9" },
];

const IMAGE_SIZE_OPTIONS = [
  { value: "auto", label: "自动" },
  { value: "1024x1024", label: "1024²" },
  { value: "1536x1024", label: "1536×1024" },
  { value: "1024x1536", label: "1024×1536" },
  { value: "1792x1024", label: "1792×1024" },
  { value: "1024x1792", label: "1024×1792" },
];

const IMAGE_QUALITY_OPTIONS = [
  { value: "auto", label: "自动" },
  { value: "standard", label: "标准" },
  { value: "hd", label: "高清" },
  { value: "low", label: "低" },
  { value: "medium", label: "中" },
  { value: "high", label: "高" },
];

const IMAGE_STYLE_OPTIONS = [
  { value: "auto", label: "自动" },
  { value: "natural", label: "自然" },
  { value: "vivid", label: "鲜艳" },
  { value: "cinematic", label: "电影感" },
  { value: "illustration", label: "插画" },
  { value: "photorealistic", label: "写实" },
];

const VIDEO_ASPECT_OPTIONS = [
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
  { value: "1:1", label: "1:1" },
  { value: "4:3", label: "4:3" },
  { value: "3:4", label: "3:4" },
  { value: "21:9", label: "21:9" },
];

const VIDEO_RESOLUTION_OPTIONS = [
  { value: "480p", label: "480p" },
  { value: "720p", label: "720p" },
  { value: "1080p", label: "1080p" },
  { value: "2k", label: "2K" },
  { value: "4k", label: "4K" },
];

const VIDEO_DURATION_OPTIONS = [
  { value: "4", label: "4s" },
  { value: "5", label: "5s" },
  { value: "8", label: "8s" },
  { value: "10", label: "10s" },
];

const GROK_VIDEO_DURATIONS = [6, 10, 12, 16, 20];
const MISSING_VIDEO_TASK_RETRY_LIMIT = 12;

const VIDEO_STYLE_OPTIONS = [
  { value: "cinematic", label: "电影" },
  { value: "realistic", label: "写实" },
  { value: "animation", label: "动画" },
  { value: "commercial", label: "广告" },
  { value: "documentary", label: "纪实" },
  { value: "auto", label: "自动" },
];

const DEFAULT_SETTINGS = {
  baseUrl: DEFAULT_API_BASE_URL,
  apiKey: "",
  chatModel: "gpt-4o-mini",
  imageModel: "gpt-image-2",
  videoModel: "doubao-seedance-2-0-260128",
  temperature: 0.7,
  contextTurns: 10,
  visualMode: "image",
  imageMode: "text-to-image",
  imageAspectRatio: "1:1",
  imageSize: "1024x1024",
  imageQuality: "auto",
  imageStyle: "auto",
  imageCount: 1,
  imageApiStyle: "auto",
  imageEndpoint: "/v1/images/generations",
  imageEditEndpoint: "/v1/images/edits",
  videoAspectRatio: "16:9",
  videoResolution: "720p",
  videoDuration: 5,
  videoCount: 1,
  videoStyle: "cinematic",
  videoAudio: true,
  videoApiStyle: "auto",
  videoEndpoint: "/v1/video/generations",
  videoStatusEndpoint: "/v1/video/generations/{id}",
  visualContext: true,
  visualContextTurns: 4,
  chatWeb: false,
  stream: true,
  thinking: false,
  systemPrompt: "你是一个专业的 AI 创作助手。",
};

const els = {};
let state = loadState();
let activeMode = state.activeMode || "image";
let activeSessionId = state.activeSessionId || null;
let activeVisualSessionId = state.activeVisualSessionId || null;
let abortController = null;
const activeImageRequests = new Map();
let toastTimer = null;
let deleteArmed = null;
let outputPopoverOpen = false;
let draftMedia = createEmptyDraftMedia();
let viewerZoom = 1;
let modelPickerType = "chat";
let activeModelVendor = "";
let chatAttachments = [];
let settingsFormSnapshot = "";
let activeSettingsTab = "api";
const activeVideoPolls = new Set();
const desiredMediaCacheWrites = new Map();
const activeMediaCacheWrites = new Set();
const mediaCacheWritePromises = new Map();
const cachedMediaObjectUrls = new Map();
let mediaCacheDatabasePromise = null;

function $(id) {
  return document.getElementById(id);
}

function initElements() {
  [
    "sidebar",
    "collapseSidebar",
    "newSession",
    "chatMode",
    "imageMode",
    "sessionSearch",
    "sessionList",
    "openSettingsSide",
    "mobileMenu",
    "workspaceTitle",
    "modelBadge",
    "openHistory",
    "testModels",
    "openSettings",
    "closeSettings",
    "chatPanel",
    "imagePanel",
    "emptyChat",
    "messages",
    "visualImageTab",
    "visualVideoTab",
    "visualPanelTitle",
    "visualPanelSubtitle",
    "visualRequestHint",
    "visualCanvas",
    "visualEmptyText",
    "imageEmpty",
    "imageGrid",
    "clearImages",
    "openModelSettings",
    "modelSummary",
    "taskCount",
    "imageHistory",
    "composer",
    "chatToolbar",
    "chatWebToggle",
    "uploadChatFileButton",
    "chatAttachmentTray",
    "visualToolbar",
    "visualContextToggle",
    "draftMediaTray",
    "outputSettingsPopover",
    "imageOutputSettings",
    "videoOutputSettings",
    "imageAspectGroup",
    "imageSizeGroup",
    "imageQualityGroup",
    "imageStyleGroup",
    "imageCountInline",
    "videoAspectGroup",
    "videoResolutionGroup",
    "videoDurationGroup",
    "videoCountGroup",
    "videoStyleGroup",
    "videoAudioToggle",
    "uploadImageRefButton",
    "uploadFirstFrameButton",
    "uploadLastFrameButton",
    "uploadVideoRefButton",
    "uploadAudioButton",
    "openOutputSettings",
    "promptInput",
    "streamToggle",
    "thinkingToggle",
    "quickModel",
    "quickModelButton",
    "quickModelVendor",
    "quickModelLabel",
    "stopButton",
    "sendButton",
    "overlay",
    "settingsDialog",
    "connectionState",
    "connectionDetail",
    "baseUrl",
    "apiKey",
    "toggleApiKey",
    "copyApiKey",
    "chatModel",
    "imageModel",
    "videoModel",
    "temperature",
    "contextTurns",
    "visualContextTurns",
    "imageApiStyle",
    "videoApiStyle",
    "imageEndpoint",
    "imageEditEndpoint",
    "videoEndpoint",
    "videoStatusEndpoint",
    "systemPrompt",
    "saveSettings",
    "testConnection",
    "reloadModels",
    "exportData",
    "importData",
    "clearAll",
    "unsavedSettingsPrompt",
    "cancelSettingsClose",
    "discardSettingsClose",
    "saveSettingsClose",
    "importFile",
    "imageReferenceFiles",
    "videoReferenceFiles",
    "firstFrameFile",
    "lastFrameFile",
    "audioReferenceFile",
    "chatAttachmentFiles",
    "mediaViewer",
    "viewerTitle",
    "viewerZoomLabel",
    "viewerZoomOut",
    "viewerZoomIn",
    "viewerFit",
    "viewerDownload",
    "closeMediaViewer",
    "viewerStage",
    "viewerImage",
    "viewerVideo",
    "modelPicker",
    "modelPickerTitle",
    "modelPickerCount",
    "closeModelPicker",
    "modelVendorList",
    "modelSearch",
    "modelPickerList",
    "modelOptions",
    "toast",
  ].forEach((id) => {
    els[id] = $(id);
  });
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch {
    return createInitialState();
  }
}

function parseLinkedNewApiSettings(locationLike) {
  const sources = [locationLike?.hash, locationLike?.search].filter(Boolean);
  for (const source of sources) {
    const query = String(source).slice(String(source).indexOf("?") + 1).replace(/^#?\/?/, "");
    const marker = query.indexOf("settings=");
    if (marker < 0) continue;
    const parameterValue = new URLSearchParams(query).get("settings");
    const rawValue = query.slice(marker + "settings=".length);
    const candidates = unique([rawValue, parameterValue]);
    for (const candidate of candidates) {
      const decoded = [candidate];
      try {
        decoded.push(decodeURIComponent(candidate));
      } catch {
        // The URLSearchParams value may already be decoded.
      }
      for (const value of unique(decoded)) {
        try {
          let parsed = JSON.parse(value);
          if (typeof parsed === "string") parsed = JSON.parse(parsed);
          if (!parsed || typeof parsed !== "object") continue;
          return {
            key: String(parsed.key || parsed.apiKey || "").trim(),
            url: decodeLinkedNewApiUrl(parsed.url || parsed.address || parsed.baseUrl),
          };
        } catch {
          // Try the next decoding form.
        }
      }
    }
  }
  return null;
}

function decodeLinkedNewApiUrl(value) {
  let decoded = String(value || "").trim();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded;
}

function applyLinkedNewApiSettings() {
  const linked = parseLinkedNewApiSettings(window.location);
  if (!linked) return false;
  const key = linked.key && linked.key !== "{key}" ? linked.key : "";
  const url = linked.url && linked.url !== "{address}" && /^https?:\/\//i.test(linked.url)
    ? normalizeApiBaseUrl(linked.url)
    : "";
  if (key) state.settings.apiKey = key;
  if (url) state.settings.baseUrl = url;
  if (key || url) saveState();
  const cleanQuery = new URLSearchParams(window.location.search);
  cleanQuery.delete("settings");
  const cleanSearch = cleanQuery.toString();
  window.history.replaceState(null, document.title, `${window.location.pathname}${cleanSearch ? `?${cleanSearch}` : ""}`);
  return Boolean(key || url);
}

function createInitialState() {
  const id = generateId();
  const visualId = generateId();
  return {
    settings: { ...DEFAULT_SETTINGS },
    activeMode: "image",
    activeSessionId: id,
    activeVisualSessionId: visualId,
    sessions: [
      {
        id,
        title: "新的会话",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        pinned: false,
        messages: [],
      },
    ],
    visualSessions: [
      {
        id: visualId,
        title: "新的视觉创作",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        pinned: false,
        contextEnabled: true,
      },
    ],
    visualTasks: [],
    modelOptions: [DEFAULT_SETTINGS.chatModel, DEFAULT_SETTINGS.imageModel, DEFAULT_SETTINGS.videoModel],
    modelRecords: [],
  };
}

function normalizeState(input) {
  const initial = createInitialState();
  const settings = { ...DEFAULT_SETTINGS, ...(input.settings || {}) };
  settings.baseUrl = normalizeApiBaseUrl(settings.baseUrl);
  if (LEGACY_DEFAULT_API_BASE_URLS.has(settings.baseUrl)) {
    settings.baseUrl = DEFAULT_API_BASE_URL;
  }
  if (!input.settings?.videoModel) {
    settings.videoModel = DEFAULT_SETTINGS.videoModel;
  }
  if (!input.settings?.videoEndpoint) {
    settings.videoEndpoint = DEFAULT_SETTINGS.videoEndpoint;
  }
  if (!input.settings?.videoStatusEndpoint || input.settings.videoStatusEndpoint === "/v1/videos/{id}") {
    settings.videoStatusEndpoint = DEFAULT_SETTINGS.videoStatusEndpoint;
  }
  settings.videoCount = clampNumber(settings.videoCount, 1, 8, 1);
  if (input.settings?.imageSize && !input.settings?.imageAspectRatio) {
    settings.imageAspectRatio = aspectFromSize(input.settings.imageSize);
  }
  settings.imageMode = "text-to-image";
  if (isHiddenModel(settings.chatModel)) settings.chatModel = DEFAULT_SETTINGS.chatModel;
  if (isHiddenModel(settings.imageModel)) settings.imageModel = DEFAULT_SETTINGS.imageModel;
  if (isHiddenModel(settings.videoModel)) settings.videoModel = DEFAULT_SETTINGS.videoModel;
  const sessions = Array.isArray(input.sessions) && input.sessions.length ? input.sessions : initial.sessions;
  const migratedImageTasks = Array.isArray(input.images)
    ? input.images.map((task) => ({
        ...task,
        type: "image",
        media: Array.isArray(task.images) ? task.images : [],
        params: {
          size: task.size || settings.imageSize,
        },
      }))
    : [];
  const sourceVisualTasks = Array.isArray(input.visualTasks) ? input.visualTasks : migratedImageTasks;
  const fallbackVisualId = input.activeVisualSessionId || generateId();
  const visualSessions = (Array.isArray(input.visualSessions) && input.visualSessions.length
    ? input.visualSessions
    : [
        {
          id: fallbackVisualId,
          title: "视觉创作历史",
          createdAt: sourceVisualTasks.at(-1)?.createdAt || Date.now(),
          updatedAt: sourceVisualTasks[0]?.createdAt || Date.now(),
          pinned: false,
        },
      ]).map((session) => ({
        ...session,
        contextEnabled: session.contextEnabled ?? settings.visualContext,
      }));
  const activeVisualId = visualSessions.some((session) => session.id === input.activeVisualSessionId)
    ? input.activeVisualSessionId
    : visualSessions[0].id;
  const visualTasks = sourceVisualTasks.map((task) => {
    const normalized = { ...task, sessionId: task.sessionId || activeVisualId };
    if (normalized.persistedMediaOmitted && normalized.status === "done" && !(normalized.media || []).length) {
      normalized.status = "empty";
      normalized.error = "此图片由旧版本生成，当时未写入浏览器缓存，请重新生成。";
    }
    return normalized;
  });
  const modelRecords = normalizeModelRecords(input.modelRecords || []);
  const storedChat = modelRecords.find((model) => model.id === settings.chatModel);
  const storedImage = modelRecords.find((model) => model.id === settings.imageModel);
  const storedVideo = modelRecords.find((model) => model.id === settings.videoModel);
  if (storedChat && storedChat.type !== "chat") settings.chatModel = modelRecords.find((model) => model.type === "chat")?.id || DEFAULT_SETTINGS.chatModel;
  if (storedImage && storedImage.type !== "image") settings.imageModel = modelRecords.find((model) => model.type === "image")?.id || DEFAULT_SETTINGS.imageModel;
  if (storedVideo && storedVideo.type !== "video") settings.videoModel = modelRecords.find((model) => model.type === "video")?.id || DEFAULT_SETTINGS.videoModel;
  const persistedModelOptions = Array.isArray(input.modelOptions) ? input.modelOptions.filter((id) => !isHiddenModel(id)) : [];
  return {
    ...initial,
    ...input,
    settings,
    sessions,
    visualSessions,
    activeVisualSessionId: activeVisualId,
    visualTasks,
    images: migratedImageTasks,
    modelRecords,
    modelOptions: unique([
      settings.chatModel,
      settings.imageModel,
      settings.videoModel,
      ...persistedModelOptions,
      ...modelRecords.map((model) => model.id),
    ]),
  };
}

function saveState() {
  state.activeMode = activeMode;
  state.activeSessionId = activeSessionId;
  state.activeVisualSessionId = activeVisualSessionId;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistableState()));
  } catch (error) {
    console.warn("Unable to persist client state", error);
  }
  scheduleVisualMediaCache();
}

function persistableState() {
  const persistedTasks = state.visualTasks.map((task) => {
    const sourceMedia = task.media || [];
    if (task.type !== "image") return { ...task, media: sourceMedia };
    const mediaCacheKeys = sourceMedia.map((_, index) => visualMediaCacheKey(task.id, index));
    const media = sourceMedia.map((item, index) => {
      if (isMediaCacheReference(item)) return item;
      return isInlineMedia(item) ? mediaCacheReference(mediaCacheKeys[index]) : item;
    });
    return {
      ...task,
      media,
      mediaCacheKeys,
      persistedMediaOmitted: false,
      persistedMediaCount: 0,
    };
  });
  return {
    ...state,
    visualTasks: persistedTasks,
    images: [],
  };
}

function isInlineMedia(value) {
  return typeof value === "string" && /^(?:data:|blob:)/i.test(value);
}

function visualMediaCacheKey(taskId, index) {
  return `${taskId}:${index}`;
}

function mediaCacheReference(key) {
  return `idb-media:${encodeURIComponent(key)}`;
}

function isMediaCacheReference(value) {
  return typeof value === "string" && value.startsWith("idb-media:");
}

function mediaCacheKeyFromReference(value) {
  if (!isMediaCacheReference(value)) return "";
  try {
    return decodeURIComponent(value.slice("idb-media:".length));
  } catch {
    return "";
  }
}

function openMediaCacheDatabase() {
  if (mediaCacheDatabasePromise) return mediaCacheDatabasePromise;
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("当前浏览器不支持 IndexedDB"));
  mediaCacheDatabasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(MEDIA_CACHE_DB_NAME, MEDIA_CACHE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(MEDIA_CACHE_STORE)) {
        const store = database.createObjectStore(MEDIA_CACHE_STORE, { keyPath: "key" });
        store.createIndex("taskId", "taskId", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("无法打开视觉媒体缓存"));
    request.onblocked = () => reject(new Error("视觉媒体缓存数据库被其他页面占用"));
  });
  mediaCacheDatabasePromise.catch(() => {
    mediaCacheDatabasePromise = null;
  });
  return mediaCacheDatabasePromise;
}

function indexedDbRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("浏览器缓存操作失败"));
  });
}

function indexedDbTransaction(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("浏览器缓存写入失败"));
    transaction.onabort = () => reject(transaction.error || new Error("浏览器缓存写入已取消"));
  });
}

async function putVisualMediaCache(key, taskId, blob) {
  const database = await openMediaCacheDatabase();
  const transaction = database.transaction(MEDIA_CACHE_STORE, "readwrite");
  transaction.objectStore(MEDIA_CACHE_STORE).put({ key, taskId, blob, updatedAt: Date.now() });
  await indexedDbTransaction(transaction);
}

async function getVisualMediaCache(key) {
  const database = await openMediaCacheDatabase();
  const transaction = database.transaction(MEDIA_CACHE_STORE, "readonly");
  const record = await indexedDbRequest(transaction.objectStore(MEDIA_CACHE_STORE).get(key));
  return record?.blob || null;
}

async function deleteVisualMediaCacheForTask(taskId) {
  revokeCachedMediaObjectUrls(taskId);
  if (typeof indexedDB === "undefined") return;
  try {
    const database = await openMediaCacheDatabase();
    const readTransaction = database.transaction(MEDIA_CACHE_STORE, "readonly");
    const keys = await indexedDbRequest(readTransaction.objectStore(MEDIA_CACHE_STORE).index("taskId").getAllKeys(taskId));
    if (keys.length) {
      const writeTransaction = database.transaction(MEDIA_CACHE_STORE, "readwrite");
      const store = writeTransaction.objectStore(MEDIA_CACHE_STORE);
      keys.forEach((key) => store.delete(key));
      await indexedDbTransaction(writeTransaction);
    }
  } catch (error) {
    console.warn("Unable to delete visual media cache", error);
  }
}

async function clearVisualMediaCache() {
  cachedMediaObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  cachedMediaObjectUrls.clear();
  desiredMediaCacheWrites.clear();
  if (typeof indexedDB === "undefined") return;
  try {
    const database = await openMediaCacheDatabase();
    const transaction = database.transaction(MEDIA_CACHE_STORE, "readwrite");
    transaction.objectStore(MEDIA_CACHE_STORE).clear();
    await indexedDbTransaction(transaction);
  } catch (error) {
    console.warn("Unable to clear visual media cache", error);
  }
}

function revokeCachedMediaObjectUrls(taskId) {
  const prefix = `${taskId}:`;
  [...cachedMediaObjectUrls.entries()].forEach(([key, url]) => {
    if (!key.startsWith(prefix)) return;
    URL.revokeObjectURL(url);
    cachedMediaObjectUrls.delete(key);
    desiredMediaCacheWrites.delete(key);
  });
}

function scheduleVisualMediaCache() {
  if (typeof indexedDB === "undefined") return;
  state.visualTasks
    .filter((task) => task.type === "image")
    .forEach((task) => {
      (task.media || []).forEach((source, index) => {
        if (!source || isMediaCacheReference(source)) return;
        queueVisualMediaCacheWrite(visualMediaCacheKey(task.id, index), task.id, source);
      });
    });
}

function queueVisualMediaCacheWrite(key, taskId, source) {
  const current = desiredMediaCacheWrites.get(key);
  if (current?.source === source) return mediaCacheWritePromises.get(key) || Promise.resolve();
  desiredMediaCacheWrites.set(key, { key, taskId, source });
  if (activeMediaCacheWrites.has(key)) return mediaCacheWritePromises.get(key) || Promise.resolve();
  activeMediaCacheWrites.add(key);
  const promise = runVisualMediaCacheWrite(key).finally(() => {
    mediaCacheWritePromises.delete(key);
  });
  mediaCacheWritePromises.set(key, promise);
  return promise;
}

async function runVisualMediaCacheWrite(key) {
  try {
    while (desiredMediaCacheWrites.has(key)) {
      const entry = desiredMediaCacheWrites.get(key);
      try {
        const response = await fetch(entry.source);
        if (!response.ok) throw new Error(`媒体缓存读取失败：${response.status}`);
        const blob = await response.blob();
        if (!blob.size) throw new Error("媒体缓存内容为空");
        if (desiredMediaCacheWrites.get(key) !== entry) continue;
        await putVisualMediaCache(key, entry.taskId, blob);
      } catch (error) {
        if (desiredMediaCacheWrites.get(key) === entry) desiredMediaCacheWrites.delete(key);
        console.warn("Unable to cache visual media", error);
        break;
      }
      if (desiredMediaCacheWrites.get(key) === entry) break;
    }
  } finally {
    activeMediaCacheWrites.delete(key);
  }
}

async function cacheVisualTaskMedia(task) {
  if (typeof indexedDB === "undefined" || task?.type !== "image") return;
  const writes = (task.media || [])
    .map((source, index) => {
      if (!source || isMediaCacheReference(source)) return null;
      return queueVisualMediaCacheWrite(visualMediaCacheKey(task.id, index), task.id, source);
    })
    .filter(Boolean);
  await Promise.all(writes);
}

async function restoreCachedVisualMedia() {
  const cachedTasks = state.visualTasks.filter(
    (task) => task.type === "image" && (task.media || []).some((item) => isMediaCacheReference(item) || task.mediaCacheKeys?.length)
  );
  if (!cachedTasks.length) return;

  await Promise.all(
    cachedTasks.map(async (task) => {
      const restored = await Promise.all(
        (task.media || []).map(async (source, index) => {
          const key = task.mediaCacheKeys?.[index] || mediaCacheKeyFromReference(source) || visualMediaCacheKey(task.id, index);
          try {
            const blob = await getVisualMediaCache(key);
            if (!blob) return isMediaCacheReference(source) ? "" : source;
            const oldUrl = cachedMediaObjectUrls.get(key);
            if (oldUrl) URL.revokeObjectURL(oldUrl);
            const url = URL.createObjectURL(blob);
            cachedMediaObjectUrls.set(key, url);
            desiredMediaCacheWrites.set(key, { key, taskId: task.id, source: url });
            return url;
          } catch (error) {
            console.warn("Unable to restore visual media", error);
            return isMediaCacheReference(source) ? "" : source;
          }
        })
      );
      task.media = restored.filter(Boolean);
      if (task.status === "done" && !task.media.length) {
        task.status = "empty";
        task.error = "浏览器缓存中未找到该图片结果。";
      }
    })
  );
}

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function createEmptyDraftMedia() {
  return {
    imageReferences: [],
    videoImages: [],
    videoReferences: [],
    firstFrame: null,
    lastFrame: null,
    audio: null,
  };
}

function getActiveSession() {
  let session = state.sessions.find((item) => item.id === activeSessionId);
  if (!session) {
    activeSessionId = state.sessions[0]?.id || createSession();
    session = state.sessions.find((item) => item.id === activeSessionId);
  }
  return session;
}

function createSession(title = "新的会话") {
  const id = generateId();
  state.sessions.unshift({
    id,
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pinned: false,
    messages: [],
  });
  activeSessionId = id;
  saveState();
  render();
  return id;
}

function getActiveVisualSession() {
  let session = state.visualSessions.find((item) => item.id === activeVisualSessionId);
  if (!session) {
    activeVisualSessionId = state.visualSessions[0]?.id || createVisualSession();
    session = state.visualSessions.find((item) => item.id === activeVisualSessionId);
  }
  return session;
}

function createVisualSession(title = "新的视觉创作") {
  const id = generateId();
  state.visualSessions.unshift({
    id,
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pinned: false,
    contextEnabled: state.settings.visualContext,
  });
  activeVisualSessionId = id;
  activeMode = "image";
  draftMedia = createEmptyDraftMedia();
  syncImageModeFromReferences();
  saveState();
  render();
  return id;
}

function createWorkspaceSession() {
  if (activeMode === "image") return createVisualSession();
  return createSession();
}

function updateVisualSession(session, prompt = "") {
  if (!session) return;
  session.updatedAt = Date.now();
  session.lastVisualMode = state.settings.visualMode;
  if ((!session.title || session.title === "新的视觉创作") && prompt.trim()) {
    session.title = prompt.trim().slice(0, 36) || "新的视觉创作";
  }
  saveState();
}

function updateSession(session) {
  session.updatedAt = Date.now();
  if ((!session.title || session.title === "新的会话") && session.messages.length) {
    const firstUser = session.messages.find((message) => message.role === "user");
    if (firstUser?.content) session.title = firstUser.content.trim().slice(0, 36) || "新的会话";
  }
  saveState();
}

function bindEvents() {
  els.newSession.addEventListener("click", createWorkspaceSession);
  els.collapseSidebar.addEventListener("click", () => {
    els.sidebar.classList.toggle("collapsed");
  });
  els.mobileMenu.addEventListener("click", openMobileSidebar);
  els.openHistory.addEventListener("click", openMobileSidebar);
  els.overlay.addEventListener("click", closeMobileSidebar);
  els.chatMode.addEventListener("click", () => setMode("chat"));
  els.imageMode.addEventListener("click", () => setMode("image"));
  els.visualImageTab.addEventListener("click", () => setVisualMode("image"));
  els.visualVideoTab.addEventListener("click", () => setVisualMode("video"));
  els.sessionSearch.addEventListener("input", renderSessions);
  els.openSettings.addEventListener("click", () => openSettings("api"));
  els.openSettingsSide.addEventListener("click", () => openSettings("api"));
  els.openModelSettings.addEventListener("click", () => openSettings("models"));
  els.closeSettings.addEventListener("click", closeSettings);
  els.testModels.addEventListener("click", fetchModels);
  els.reloadModels.addEventListener("click", fetchModels);
  els.testConnection.addEventListener("click", testConnection);
  els.saveSettings.addEventListener("click", () => saveSettingsFromForm());
  els.toggleApiKey.addEventListener("click", toggleApiKeyVisibility);
  els.copyApiKey.addEventListener("click", () => copyText(els.apiKey.value));
  els.settingsDialog.querySelectorAll("[data-settings-tab]").forEach((button) => {
    button.addEventListener("click", () => setSettingsTab(button.dataset.settingsTab));
  });
  els.settingsDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    if (!els.unsavedSettingsPrompt.hidden) {
      hideUnsavedSettingsPrompt();
      return;
    }
    requestSettingsClose();
  });
  els.settingsDialog.addEventListener("click", (event) => {
    if (event.target === els.settingsDialog) requestSettingsClose();
  });
  els.cancelSettingsClose.addEventListener("click", hideUnsavedSettingsPrompt);
  els.discardSettingsClose.addEventListener("click", closeSettingsDirect);
  els.saveSettingsClose.addEventListener("click", () => {
    saveSettingsFromForm({ closeAfterSave: true });
  });
  els.exportData.addEventListener("click", exportData);
  els.importData.addEventListener("click", () => els.importFile.click());
  els.importFile.addEventListener("change", importData);
  els.clearAll.addEventListener("click", clearAllData);
  els.clearImages.addEventListener("click", clearVisualTasks);
  els.composer.addEventListener("submit", onSubmit);
  els.promptInput.addEventListener("input", autoResizePrompt);
  els.promptInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      submitComposer();
    }
  });
  els.streamToggle.addEventListener("click", () => {
    state.settings.stream = !state.settings.stream;
    saveState();
    renderControls();
  });
  els.thinkingToggle.addEventListener("click", () => {
    state.settings.thinking = !state.settings.thinking;
    saveState();
    renderControls();
  });
  els.visualContextToggle.addEventListener("click", () => {
    const session = getActiveVisualSession();
    session.contextEnabled = !isVisualContextEnabled();
    state.settings.visualContext = session.contextEnabled;
    saveState();
    renderControls();
    renderVisualMeta();
  });
  els.chatWebToggle.addEventListener("click", () => {
    state.settings.chatWeb = !state.settings.chatWeb;
    saveState();
    renderControls();
    if (state.settings.chatWeb && !isWebSearchModel(state.settings.chatModel)) {
      showToast(`联网请求将使用 ${resolveWebSearchModel(state.settings.chatModel)}`);
    }
  });
  els.uploadChatFileButton.addEventListener("click", () => els.chatAttachmentFiles.click());
  els.chatAttachmentFiles.addEventListener("change", handleChatAttachmentFiles);
  els.quickModel.addEventListener("change", () => {
    if (activeMode === "image") {
      if (state.settings.visualMode === "video") state.settings.videoModel = els.quickModel.value;
      else state.settings.imageModel = els.quickModel.value;
    } else {
      state.settings.chatModel = els.quickModel.value;
    }
    state.modelOptions = unique([els.quickModel.value, ...state.modelOptions]);
    saveState();
    syncSettingsForm();
    renderHeader();
    renderVisualMeta();
  });
  els.quickModelButton.addEventListener("click", openModelPicker);
  els.closeModelPicker.addEventListener("click", closeModelPicker);
  els.modelSearch.addEventListener("input", renderModelPicker);
  els.modelPicker.addEventListener("click", (event) => {
    if (event.target === els.modelPicker) closeModelPicker();
  });
  els.stopButton.addEventListener("click", stopRequest);
  els.openOutputSettings.addEventListener("click", toggleOutputPopover);
  els.imageCountInline.addEventListener("change", () => {
    state.settings.imageCount = clampNumber(els.imageCountInline.value, 1, 4, 1);
    saveState();
    renderOutputOptions();
  });
  els.videoAudioToggle.addEventListener("change", () => {
    state.settings.videoAudio = els.videoAudioToggle.checked;
    saveState();
    renderOutputOptions();
  });
  els.uploadImageRefButton.addEventListener("click", () => els.imageReferenceFiles.click());
  els.uploadFirstFrameButton.addEventListener("click", () => els.firstFrameFile.click());
  els.uploadLastFrameButton.addEventListener("click", () => els.lastFrameFile.click());
  els.uploadVideoRefButton.addEventListener("click", () => els.videoReferenceFiles.click());
  els.uploadAudioButton.addEventListener("click", () => els.audioReferenceFile.click());
  els.imageReferenceFiles.addEventListener("change", (event) => handleReferenceFiles(event, "image-reference"));
  els.videoReferenceFiles.addEventListener("change", (event) => handleReferenceFiles(event, "video-reference"));
  els.firstFrameFile.addEventListener("change", (event) => handleReferenceFiles(event, "first-frame"));
  els.lastFrameFile.addEventListener("change", (event) => handleReferenceFiles(event, "last-frame"));
  els.audioReferenceFile.addEventListener("change", (event) => handleReferenceFiles(event, "audio"));
  els.closeMediaViewer.addEventListener("click", closeMediaViewer);
  els.viewerZoomIn.addEventListener("click", () => setViewerZoom(viewerZoom + 0.25));
  els.viewerZoomOut.addEventListener("click", () => setViewerZoom(viewerZoom - 0.25));
  els.viewerFit.addEventListener("click", () => setViewerZoom(1));
  els.viewerImage.addEventListener("dblclick", () => setViewerZoom(viewerZoom === 1 ? 2 : 1));
  els.mediaViewer.addEventListener("click", (event) => {
    if (event.target === els.mediaViewer) closeMediaViewer();
  });
  els.mediaViewer.addEventListener("close", () => {
    els.viewerVideo.pause();
    els.viewerVideo.removeAttribute("src");
  });

  document.addEventListener("click", (event) => {
    const visualModeButton = event.target.closest("[data-visual-mode]");
    if (visualModeButton) {
      setVisualMode(visualModeButton.dataset.visualMode);
      return;
    }

    const optionButton = event.target.closest("[data-setting-key]");
    if (optionButton) {
      setVisualOption(optionButton.dataset.settingKey, optionButton.dataset.value);
      return;
    }

    const removeButton = event.target.closest("[data-remove-media]");
    if (removeButton) {
      removeDraftMedia(removeButton.dataset.removeMedia, removeButton.dataset.mediaId);
      return;
    }

    const removeChatAttachmentButton = event.target.closest("[data-remove-chat-attachment]");
    if (removeChatAttachmentButton) {
      chatAttachments = chatAttachments.filter((item) => item.id !== removeChatAttachmentButton.dataset.removeChatAttachment);
      renderChatAttachments();
      return;
    }

    const refreshVideoButton = event.target.closest("[data-refresh-video]");
    if (refreshVideoButton) {
      pollVideoTask(refreshVideoButton.dataset.refreshVideo, { immediate: true, attempts: 120 });
      showToast("正在刷新视频任务结果");
      return;
    }

    const vendorButton = event.target.closest("[data-model-vendor]");
    if (vendorButton) {
      activeModelVendor = vendorButton.dataset.modelVendor;
      renderModelPicker();
      return;
    }

    const modelButton = event.target.closest("[data-model-id]");
    if (modelButton) {
      selectModelFromPicker(modelButton.dataset.modelId);
      return;
    }

    if (
      outputPopoverOpen &&
      !els.outputSettingsPopover.contains(event.target) &&
      event.target !== els.openOutputSettings &&
      !els.openOutputSettings.contains(event.target)
    ) {
      outputPopoverOpen = false;
      renderOutputOptions();
    }
  });
}

function openMobileSidebar() {
  els.sidebar.classList.add("open");
  els.overlay.hidden = false;
}

function closeMobileSidebar() {
  els.sidebar.classList.remove("open");
  els.overlay.hidden = true;
}

function setMode(mode) {
  activeMode = mode;
  if (mode === "image") {
    outputPopoverOpen = false;
    getActiveVisualSession();
  }
  saveState();
  render();
}

function setVisualMode(mode) {
  state.settings.visualMode = mode === "video" ? "video" : "image";
  activeMode = "image";
  outputPopoverOpen = false;
  const session = getActiveVisualSession();
  if (session) session.lastVisualMode = state.settings.visualMode;
  saveState();
  render();
}

function render() {
  renderHeader();
  renderModes();
  renderSessions();
  renderMessages();
  renderImages();
  renderControls();
  renderOutputOptions();
  renderDraftMediaTray();
  renderChatAttachments();
  renderVisualMeta();
  syncSettingsForm();
}

function renderHeader() {
  const isVisual = activeMode === "image";
  const visualMode = state.settings.visualMode;
  const model = isVisual
    ? visualMode === "video"
      ? state.settings.videoModel
      : state.settings.imageModel
    : state.settings.chatModel;
  els.workspaceTitle.textContent = "DeepImage2-Video";
  els.modelBadge.textContent = model || "未选择模型";
  document.title = "DeepImage2-Video";
}

function renderModes() {
  const isVisual = activeMode === "image";
  const visualMode = state.settings.visualMode;
  els.chatMode.classList.toggle("active", !isVisual);
  els.chatMode.setAttribute("aria-selected", String(!isVisual));
  els.imageMode.classList.toggle("active", isVisual);
  els.imageMode.setAttribute("aria-selected", String(isVisual));
  els.newSession.textContent = isVisual ? "新建视觉会话" : "新建会话";
  els.chatPanel.classList.toggle("active", !isVisual);
  els.imagePanel.classList.toggle("active", isVisual);
  els.visualImageTab.classList.toggle("active", visualMode === "image");
  els.visualImageTab.setAttribute("aria-selected", String(visualMode === "image"));
  els.visualVideoTab.classList.toggle("active", visualMode === "video");
  els.visualVideoTab.setAttribute("aria-selected", String(visualMode === "video"));
  els.promptInput.placeholder = isVisual
    ? visualMode === "video"
      ? "描述要生成的视频镜头、主体、运动和氛围"
      : "描述要生成的画面；上传参考图可进行图生图"
    : "输入消息";
  els.sessionSearch.placeholder = isVisual ? "搜索视觉创作" : "搜索会话";
}

function renderControls() {
  const isVisual = activeMode === "image";
  const visualMode = state.settings.visualMode;
  const grokVideoSelected = isVisual && visualMode === "video" && isGrokVideoModel(state.settings.videoModel);
  els.visualToolbar.hidden = !isVisual;
  els.chatToolbar.hidden = isVisual;
  els.chatWebToggle.classList.toggle("active", !!state.settings.chatWeb);
  els.chatWebToggle.setAttribute("aria-pressed", String(!!state.settings.chatWeb));
  const contextEnabled = isVisualContextEnabled();
  els.visualContextToggle.classList.toggle("active", contextEnabled);
  els.visualContextToggle.setAttribute("aria-pressed", String(contextEnabled));
  els.visualContextToggle.title = contextEnabled ? "当前视觉会话会延续最近创作上下文" : "当前视觉会话不使用历史上下文";
  els.streamToggle.classList.toggle("active", state.settings.stream);
  els.streamToggle.setAttribute("aria-pressed", String(state.settings.stream));
  els.thinkingToggle.classList.toggle("active", state.settings.thinking);
  els.thinkingToggle.setAttribute("aria-pressed", String(state.settings.thinking));
  els.streamToggle.hidden = isVisual;
  els.thinkingToggle.hidden = isVisual;
  els.uploadImageRefButton.title = grokVideoSelected
    ? "上传一张参考图进行图生视频"
    : visualMode === "video" ? "上传视频参考图" : "上传图片进行图生图";
  els.uploadFirstFrameButton.hidden = !isVisual || visualMode !== "video" || grokVideoSelected;
  els.uploadLastFrameButton.hidden = !isVisual || visualMode !== "video" || grokVideoSelected;
  els.uploadVideoRefButton.hidden = !isVisual || visualMode !== "video" || grokVideoSelected;
  els.uploadAudioButton.hidden = !isVisual || visualMode !== "video" || grokVideoSelected;
  fillQuickModelSelect();
  const selectedModel = activeMode === "image"
    ? state.settings.visualMode === "video"
      ? state.settings.videoModel
      : state.settings.imageModel
    : state.settings.chatModel;
  const selectedProfile = getModelProfile(selectedModel);
  els.quickModelLabel.textContent = selectedModel || "未选择模型";
  els.quickModelVendor.textContent = selectedProfile?.vendor || modelTypeLabel(activeMode === "image" ? state.settings.visualMode : "chat");
  document.querySelectorAll("[data-visual-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.visualMode === visualMode);
  });
  if (!abortController) {
    els.sendButton.disabled = false;
    els.stopButton.hidden = !(isVisual && visualMode === "image" && activeImageRequests.size);
    els.stopButton.title = activeImageRequests.size ? `停止 ${activeImageRequests.size} 个图片任务` : "停止";
    els.sendButton.textContent = isVisual ? (visualMode === "video" ? "生成视频" : "生成图片") : "发送";
  }
}

function fillQuickModelSelect() {
  const isVisual = activeMode === "image";
  const visualMode = state.settings.visualMode;
  const current = isVisual
    ? visualMode === "video"
      ? state.settings.videoModel
      : state.settings.imageModel
    : state.settings.chatModel;
  if (isVisual) {
    fillGroupedModelSelect(els.quickModel, visualMode, current);
  } else {
    fillGroupedModelSelect(els.quickModel, "chat", current);
  }
  els.quickModel.value = current || "";
}

function renderOutputOptions() {
  const isVideo = state.settings.visualMode === "video";
  const usesPixelSize = usesPixelVideoSizeOptions(state.settings.videoModel);
  els.outputSettingsPopover.hidden = !outputPopoverOpen || activeMode !== "image";
  els.openOutputSettings.setAttribute("aria-expanded", String(outputPopoverOpen));
  els.imageOutputSettings.hidden = isVideo;
  els.videoOutputSettings.hidden = !isVideo;
  els.imageCountInline.value = state.settings.imageCount;
  els.imageCountInline.disabled = false;
  els.imageCountInline.title = "";
  els.videoAudioToggle.checked = effectiveVideoAudio();
  els.videoAudioToggle.disabled = isVeoModel(state.settings.videoModel);
  els.videoAudioToggle.title = isVeo2Model(state.settings.videoModel)
    ? "Veo 2 仅生成静音视频"
    : isVeoModel(state.settings.videoModel) ? "Veo 3 系列始终生成音频" : "";

  renderOptionGroup(els.imageAspectGroup, "imageAspectRatio", imageAspectOptionsForModel(), effectiveImageAspectRatio());
  renderOptionGroup(els.imageSizeGroup, "imageSize", imageSizeOptionsForModel(), effectiveImageOutputSize());
  renderOptionGroup(els.imageQualityGroup, "imageQuality", imageQualityOptionsForModel(), state.settings.imageQuality);
  renderOptionGroup(els.imageStyleGroup, "imageStyle", imageStyleOptionsForModel(), state.settings.imageStyle);
  renderOptionGroup(els.videoAspectGroup, "videoAspectRatio", videoAspectOptionsForModel(), effectiveVideoAspectRatio());
  const videoAspectRow = els.videoAspectGroup.closest(".setting-row");
  const videoResolutionRow = els.videoResolutionGroup.closest(".setting-row");
  const videoCountRow = els.videoCountGroup.closest(".setting-row");
  const videoStyleRow = els.videoStyleGroup.closest(".setting-row");
  const videoAudioRow = els.videoAudioToggle.closest(".toggle-row");
  const usesMinimalGrokRequest = isGrokImagine15Model(state.settings.videoModel);
  const videoAspectLabel = videoAspectRow?.querySelector(":scope > span");
  if (videoAspectLabel) videoAspectLabel.textContent = usesPixelSize ? "尺寸" : "比例";
  if (videoResolutionRow) videoResolutionRow.hidden = usesPixelSize || usesMinimalGrokRequest;
  if (videoCountRow) videoCountRow.hidden = !isSeedance2Model(state.settings.videoModel);
  if (videoStyleRow) videoStyleRow.hidden = usesMinimalGrokRequest;
  if (videoAudioRow) videoAudioRow.hidden = usesMinimalGrokRequest;
  renderOptionGroup(els.videoResolutionGroup, "videoResolution", videoResolutionOptionsForModel(), effectiveVideoResolution());
  renderOptionGroup(els.videoDurationGroup, "videoDuration", videoDurationOptionsForModel(), String(effectiveVideoDuration()));
  renderOptionGroup(
    els.videoCountGroup,
    "videoCount",
    Array.from({ length: 8 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) })),
    String(effectiveVideoCount())
  );
  renderOptionGroup(els.videoStyleGroup, "videoStyle", VIDEO_STYLE_OPTIONS, state.settings.videoStyle);
}

function renderOptionGroup(container, key, options, currentValue) {
  container.innerHTML = options
    .map((option) => {
      const active = String(option.value) === String(currentValue) ? " active" : "";
      return `<button class="option-button${active}" type="button" data-setting-key="${escapeAttr(key)}" data-value="${escapeAttr(option.value)}">${escapeHtml(option.label)}</button>`;
    })
    .join("");
}

function imageSizeOptionsForModel() {
  const model = getModelProfile(state.settings.imageModel);
  if (model?.id === "dall-e-3") {
    return IMAGE_SIZE_OPTIONS.filter((option) => ["1024x1024", "1024x1792", "1792x1024"].includes(option.value));
  }
  if (isGptImage2Model(model?.id)) {
    return [
      { value: "auto", label: "自动" },
      { value: "1024x1024", label: "1024²" },
      { value: "1536x1024", label: "1536×1024" },
      { value: "1024x1536", label: "1024×1536" },
      { value: "2048x2048", label: "2K 方形" },
      { value: "2048x1152", label: "2K 横向" },
      { value: "3840x2160", label: "4K 横向" },
      { value: "2160x3840", label: "4K 竖向" },
    ];
  }
  if (isGptImageModel(model?.id)) {
    return [
      { value: "auto", label: "自动" },
      { value: "1024x1024", label: "1024²" },
      { value: "1536x1024", label: "横向" },
      { value: "1024x1536", label: "竖向" },
    ];
  }
  if (model?.provider === "gemini") {
    const id = String(model.id || "").toLowerCase();
    const automatic = [{ value: "auto", label: "自动" }];
    if (/gemini-3\.1-flash-lite-image/.test(id)) return [...automatic, { value: "1K", label: "1K" }];
    if (/gemini-2\.0/.test(id)) return [...automatic, { value: "1K", label: "1K" }];
    const sizes = [
      { value: "1K", label: "1K" },
      { value: "2K", label: "2K" },
      { value: "4K", label: "4K" },
    ];
    return /gemini-3\.1-flash-image/.test(id)
      ? [...automatic, { value: "0.5K", label: "0.5K" }, ...sizes]
      : [...automatic, ...sizes];
  }
  return IMAGE_SIZE_OPTIONS;
}

function imageAspectOptionsForModel(modelId = state.settings.imageModel) {
  if (supportsGeminiNativeImageConfig(modelId)) {
    const id = String(modelId || "").toLowerCase();
    const ratios = /gemini-3\.1-flash-image/.test(id)
      ? ["1:1", "1:4", "1:8", "2:3", "3:2", "3:4", "4:1", "4:3", "4:5", "5:4", "8:1", "9:16", "16:9", "21:9"]
      : ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"];
    return ratios.map((value) => ({ value, label: value }));
  }
  if (isGptImageModel(modelId)) {
    return ["1:1", "3:2", "2:3", "4:3", "3:4", "16:9", "9:16", "21:9"].map((value) => ({ value, label: value }));
  }
  return IMAGE_ASPECT_OPTIONS;
}

function effectiveImageAspectRatio(modelId = state.settings.imageModel) {
  const ratio = state.settings.imageAspectRatio;
  const supported = imageAspectOptionsForModel(modelId).map((option) => option.value);
  return supported.includes(ratio) ? ratio : "1:1";
}

function imageQualityOptionsForModel() {
  const model = getModelProfile(state.settings.imageModel);
  if (model?.id === "dall-e-3") {
    return IMAGE_QUALITY_OPTIONS.filter((option) => ["standard", "hd"].includes(option.value));
  }
  if (model?.provider === "openai") {
    return IMAGE_QUALITY_OPTIONS.filter((option) => ["auto", "low", "medium", "high"].includes(option.value));
  }
  if (model?.provider === "gemini") {
    return IMAGE_QUALITY_OPTIONS;
  }
  return IMAGE_QUALITY_OPTIONS.filter((option) => ["auto", "standard", "high"].includes(option.value));
}

function videoResolutionOptionsForModel() {
  const modelId = state.settings.videoModel;
  if (isSeedance2FastModel(modelId)) {
    return VIDEO_RESOLUTION_OPTIONS.filter((option) => ["480p", "720p"].includes(option.value));
  }
  if (isSeedance2Model(modelId)) {
    return VIDEO_RESOLUTION_OPTIONS.filter((option) => ["480p", "720p", "1080p", "4k"].includes(option.value));
  }
  if (isGrokVideoModel(modelId)) {
    return VIDEO_RESOLUTION_OPTIONS.filter((option) => ["480p", "720p"].includes(option.value));
  }
  if (isVeoModel(modelId)) {
    let supported = ["720p", "1080p"];
    if (isVeo2Model(modelId) || isVeo31LiteModel(modelId)) supported = ["720p"];
    else if (isVeo31Model(modelId)) supported = ["720p", "1080p", "4k"];
    return VIDEO_RESOLUTION_OPTIONS.filter((option) => supported.includes(option.value));
  }
  return VIDEO_RESOLUTION_OPTIONS;
}

function videoAspectOptionsForModel() {
  const modelId = state.settings.videoModel;
  if (isSora2Model(modelId)) {
    return [{ value: "1280x720", label: "1280x720" }];
  }
  if (usesDeepRouterVeoCompatibility(modelId)) {
    return ["1920x1080", "1080x1920"].map((value) => ({ value, label: value }));
  }
  if (isSeedance2Model(modelId)) {
    return ["adaptive", "21:9", "16:9", "4:3", "1:1", "3:4", "9:16"]
      .map((value) => ({ value, label: value === "adaptive" ? "自适应" : value }));
  }
  if (isSeedanceModel(modelId)) {
    return VIDEO_ASPECT_OPTIONS.filter((option) => ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"].includes(option.value));
  }
  if (isGrokVideoModel(modelId)) {
    return ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"].map((value) => ({ value, label: value }));
  }
  if (isVeoModel(modelId)) {
    return VIDEO_ASPECT_OPTIONS.filter((option) => ["16:9", "9:16"].includes(option.value));
  }
  return VIDEO_ASPECT_OPTIONS;
}

function videoDurationOptionsForModel() {
  const modelId = state.settings.videoModel;
  if (isSora2Model(modelId)) {
    return [{ value: "12", label: "12s" }];
  }
  if (isGrokVideoModel(modelId)) {
    return GROK_VIDEO_DURATIONS.map((seconds) => ({ value: String(seconds), label: `${seconds}s` }));
  }
  if (usesDeepRouterVeoCompatibility(modelId)) {
    return [{ value: "8", label: "8s" }];
  }
  if (isVeoModel(modelId)) {
    const durations = isVeo2Model(modelId) ? [5, 6, 8] : [4, 6, 8];
    return durations.map((seconds) => ({ value: String(seconds), label: `${seconds}s` }));
  }
  if (!isSeedance2Model(modelId)) return VIDEO_DURATION_OPTIONS;
  const unified = isSeedance20UnifiedModel(modelId);
  const minimum = unified ? 4 : 5;
  const options = Array.from({ length: 16 - minimum }, (_, index) => {
    const seconds = String(index + minimum);
    return { value: seconds, label: `${seconds}s` };
  });
  return [{ value: "-1", label: "自动" }, ...options];
}

function isSeedanceModel(modelId) {
  return /seedance/i.test(String(modelId || ""));
}

function isSeedance2Model(modelId) {
  return /seedance.*2[-_.]?0/i.test(String(modelId || ""));
}

function isSeedance2FastModel(modelId) {
  return /seedance.*2[-_.]?0.*(?:fast|mini)/i.test(String(modelId || ""));
}

function isSeedance20UnifiedModel(modelId) {
  return /^doubao[-_.]seedance[-_.]2[-_.]0$/i.test(String(modelId || ""));
}

function usesNewApiSeedance20Task(modelId = state.settings.videoModel) {
  return isSeedance20UnifiedModel(modelId) && isDeepRouterBaseUrl();
}

function isGrokImagineVideoModel(modelId) {
  return /grok[-_.]?imagine[-_.]?video/i.test(String(modelId || ""));
}

function isGrokVideoModel(modelId) {
  return /grok.*video|video.*grok/i.test(String(modelId || ""));
}

function isGrokImagine15Model(modelId) {
  return /grok[-_.]?imagine[-_.]?video[-_.]?1(?:[-_.]?5|\.5)/i.test(String(modelId || ""));
}

function isVeoModel(modelId) {
  return /(?:^|[-_.])veo(?:[-_.]|\d|$)/i.test(String(modelId || ""));
}

function isVeo2Model(modelId) {
  return /veo[-_.]?2(?:$|[-_.])/i.test(String(modelId || ""));
}

function isVeo31Model(modelId) {
  return /veo[-_.]?3(?:[-_.]?1|\.1)/i.test(String(modelId || ""));
}

function isVeo31LiteModel(modelId) {
  return isVeo31Model(modelId) && /lite/i.test(String(modelId || ""));
}

function isSora2Model(modelId) {
  return /(?:^|[-_.])sora[-_.]?2(?:$|[-_.])/i.test(String(modelId || "")) && !isSora2ProModel(modelId);
}

function isSora2ProModel(modelId) {
  return /(?:^|[-_.])sora[-_.]?2[-_.]?pro(?:$|[-_.])/i.test(String(modelId || ""));
}

function isDeepRouterBaseUrl() {
  return /^https?:\/\/(?:www\.)?deeprouter\.top(?:\/|$)/i.test(String(state.settings.baseUrl || ""));
}

function usesDeepRouterVeoCompatibility(modelId = state.settings.videoModel) {
  const compactId = String(modelId || "").toLowerCase().replace(/[-_.]/g, "");
  return isDeepRouterBaseUrl() && /^veo31fast(?:preview)?$/.test(compactId);
}

function usesNewApiVeoTask(modelId = state.settings.videoModel) {
  return isVeoModel(modelId) && isDeepRouterBaseUrl() && !usesDeepRouterVeoCompatibility(modelId);
}

function usesPixelVideoSizeOptions(modelId = state.settings.videoModel) {
  return isSora2Model(modelId) || usesDeepRouterVeoCompatibility(modelId);
}

function effectiveVideoAspectRatio(modelId = state.settings.videoModel) {
  const ratio = state.settings.videoAspectRatio;
  if (isSora2Model(modelId)) {
    return "1280x720";
  }
  if (usesDeepRouterVeoCompatibility(modelId)) {
    if (["1920x1080", "1080x1920"].includes(ratio)) return ratio;
    return ratio === "9:16" ? "1080x1920" : "1920x1080";
  }
  if (isSeedance2Model(modelId)) {
    return ["adaptive", "21:9", "16:9", "4:3", "1:1", "3:4", "9:16"].includes(ratio) ? ratio : "16:9";
  }
  if (isSeedanceModel(modelId)) {
    return ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"].includes(ratio) ? ratio : "16:9";
  }
  if (isGrokVideoModel(modelId)) {
    return ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"].includes(ratio) ? ratio : "16:9";
  }
  if (isVeoModel(modelId)) return ["16:9", "9:16"].includes(ratio) ? ratio : "16:9";
  return ratio;
}

function effectiveVideoResolution(modelId = state.settings.videoModel) {
  const resolution = state.settings.videoResolution;
  if (isSeedance2FastModel(modelId)) return ["480p", "720p"].includes(resolution) ? resolution : "720p";
  if (isSeedance2Model(modelId)) return ["480p", "720p", "1080p", "4k"].includes(resolution) ? resolution : "720p";
  if (isGrokVideoModel(modelId)) return ["480p", "720p"].includes(resolution) ? resolution : "720p";
  if (isVeo2Model(modelId) || isVeo31LiteModel(modelId)) return "720p";
  if (isVeo31Model(modelId)) return ["720p", "1080p", "4k"].includes(resolution) ? resolution : "720p";
  if (isVeoModel(modelId)) return ["720p", "1080p"].includes(resolution) ? resolution : "720p";
  return resolution;
}

function normalizeSeedDanceDuration(value, modelId = state.settings.videoModel) {
  const duration = Number(value);
  const unified = isSeedance20UnifiedModel(modelId);
  if (isSeedance2Model(modelId) && duration === -1) return -1;
  const fallback = isSeedance2Model(modelId) ? 5 : 4;
  const minimum = unified ? 4 : isSeedance2Model(modelId) ? 5 : 1;
  const maximum = isSeedance2Model(modelId) ? 15 : 30;
  return Math.min(maximum, Math.max(minimum, Number.isFinite(duration) ? Math.round(duration) : fallback));
}

function effectiveVideoDuration(modelId = state.settings.videoModel) {
  const profile = getModelProfile(modelId);
  if (profile?.provider === "seedance") return normalizeSeedDanceDuration(state.settings.videoDuration, modelId);
  if (isSora2Model(modelId)) return normalizeSora2Duration(state.settings.videoDuration, modelId);
  if (isGrokVideoModel(modelId)) return normalizeGrokVideoDuration(state.settings.videoDuration, modelId);
  if (isVeoModel(modelId)) return normalizeVeoDuration(state.settings.videoDuration, modelId);
  return clampNumber(state.settings.videoDuration, 1, 30, 5);
}

function effectiveVideoCount(modelId = state.settings.videoModel) {
  return isSeedance2Model(modelId) ? clampNumber(state.settings.videoCount, 1, 8, 1) : 1;
}

function normalizeGrokVideoDuration(value, modelId = state.settings.videoModel) {
  const duration = Number(value);
  if (!Number.isFinite(duration)) return GROK_VIDEO_DURATIONS[0];
  return GROK_VIDEO_DURATIONS.reduce((closest, option) => (
    Math.abs(option - duration) < Math.abs(closest - duration) ? option : closest
  ), GROK_VIDEO_DURATIONS[0]);
}

function normalizeSora2Duration(value, modelId = state.settings.videoModel) {
  return 12;
}

function normalizeVeoDuration(value, modelId = state.settings.videoModel) {
  const allowed = isVeo2Model(modelId) ? [5, 6, 8] : [4, 6, 8];
  const duration = Number(value);
  if (usesDeepRouterVeoCompatibility(modelId)) return 8;
  const usesReferences = isVeo31Model(modelId) && !isVeo31LiteModel(modelId) && hasVeoReferenceImages();
  if (["1080p", "4k"].includes(effectiveVideoResolution(modelId)) || usesReferences) return 8;
  if (!Number.isFinite(duration)) return allowed[0];
  return allowed.reduce((closest, option) => Math.abs(option - duration) < Math.abs(closest - duration) ? option : closest, allowed[0]);
}

function hasVeoReferenceImages() {
  return draftMedia.firstFrame ? draftMedia.videoImages.length > 0 : draftMedia.videoImages.length > 1;
}

function effectiveVideoAudio(modelId = state.settings.videoModel) {
  if (isVeo2Model(modelId)) return false;
  if (isVeoModel(modelId)) return true;
  return !!state.settings.videoAudio;
}

function imageStyleOptionsForModel() {
  const model = getModelProfile(state.settings.imageModel);
  if (model?.id === "dall-e-3") {
    return IMAGE_STYLE_OPTIONS.filter((option) => ["vivid", "natural"].includes(option.value));
  }
  return IMAGE_STYLE_OPTIONS;
}

function setVisualOption(key, value) {
  if (!Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS, key)) return;
  if (key === "videoDuration") state.settings[key] = effectiveVideoDurationForValue(value);
  else if (key === "videoCount") state.settings[key] = clampNumber(value, 1, 8, 1);
  else state.settings[key] = value;
  saveState();
  renderOutputOptions();
  renderVisualMeta();
}

function effectiveVideoDurationForValue(value) {
  const modelId = state.settings.videoModel;
  const profile = getModelProfile(modelId);
  if (profile?.provider === "seedance") return normalizeSeedDanceDuration(value, modelId);
  if (isSora2Model(modelId)) return normalizeSora2Duration(value, modelId);
  if (isGrokVideoModel(modelId)) return normalizeGrokVideoDuration(value, modelId);
  if (isVeoModel(modelId)) return normalizeVeoDuration(value, modelId);
  return clampNumber(value, 1, 30, 5);
}

function toggleOutputPopover() {
  outputPopoverOpen = !outputPopoverOpen;
  renderOutputOptions();
}

function renderSessions() {
  const query = els.sessionSearch.value.trim().toLowerCase();
  const isVisual = activeMode === "image";
  const source = isVisual ? state.visualSessions : state.sessions;
  const sessions = source
    .filter((session) => {
      if (!query) return true;
      const inTitle = (session.title || "").toLowerCase().includes(query);
      if (isVisual) {
        const inTasks = state.visualTasks.some(
          (task) => task.sessionId === session.id && (task.prompt || "").toLowerCase().includes(query)
        );
        return inTitle || inTasks;
      }
      return inTitle || (session.messages || []).some((message) => (message.content || "").toLowerCase().includes(query));
    })
    .sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });

  const groups = groupSessions(sessions);
  els.sessionList.innerHTML = "";
  Object.entries(groups).forEach(([label, items]) => {
    if (!items.length) return;
    const heading = document.createElement("div");
    heading.className = "session-group-label";
    heading.textContent = label;
    els.sessionList.appendChild(heading);
    items.forEach((session) => els.sessionList.appendChild(isVisual ? renderVisualSessionItem(session) : renderSessionItem(session)));
  });

  if (!sessions.length) {
    const empty = document.createElement("div");
    empty.className = "session-group-label";
    empty.textContent = "没有匹配的会话";
    els.sessionList.appendChild(empty);
  }
}

function renderVisualSessionItem(session) {
  const item = document.createElement("div");
  item.className = `session-item${session.id === activeVisualSessionId && activeMode === "image" ? " active" : ""}`;
  item.setAttribute("role", "button");
  item.setAttribute("tabindex", "0");
  item.setAttribute("aria-label", session.title || "新的视觉创作");

  const selectSession = () => {
    activeMode = "image";
    activeVisualSessionId = session.id;
    if (session.lastVisualMode) state.settings.visualMode = session.lastVisualMode;
    closeMobileSidebar();
    saveState();
    render();
  };
  item.addEventListener("click", selectSession);
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectSession();
    }
  });

  const text = document.createElement("div");
  text.className = "session-title";
  text.textContent = session.title || "新的视觉创作";

  const actions = document.createElement("div");
  actions.className = "session-actions";
  actions.appendChild(tinyButton(session.pinned ? "★" : "☆", session.pinned ? "取消置顶" : "置顶", (event) => {
    event.stopPropagation();
    session.pinned = !session.pinned;
    session.updatedAt = Date.now();
    saveState();
    renderSessions();
  }));
  actions.appendChild(tinyButton("✎", "重命名", (event) => {
    event.stopPropagation();
    renameVisualSession(session);
  }));
  actions.appendChild(tinyButton("×", "删除", (event) => {
    event.stopPropagation();
    deleteVisualSession(session.id);
  }));

  item.appendChild(text);
  item.appendChild(sessionActionsMenu(actions));
  return item;
}

function groupSessions(sessions) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;
  const previous7 = today - 7 * 86400000;
  return sessions.reduce(
    (acc, session) => {
      if (session.pinned) acc["置顶"].push(session);
      else if ((session.updatedAt || 0) >= today) acc["今天"].push(session);
      else if ((session.updatedAt || 0) >= yesterday) acc["昨天"].push(session);
      else if ((session.updatedAt || 0) >= previous7) acc["过去 7 天"].push(session);
      else acc["更早"].push(session);
      return acc;
    },
    { "置顶": [], "今天": [], "昨天": [], "过去 7 天": [], "更早": [] }
  );
}

function renderSessionItem(session) {
  const button = document.createElement("div");
  button.className = `session-item${session.id === activeSessionId && activeMode === "chat" ? " active" : ""}`;
  button.setAttribute("role", "button");
  button.setAttribute("tabindex", "0");
  button.setAttribute("aria-label", session.title || "新的会话");

  const selectSession = () => {
    activeMode = "chat";
    activeSessionId = session.id;
    closeMobileSidebar();
    saveState();
    render();
  };

  button.addEventListener("click", selectSession);
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectSession();
    }
  });

  const text = document.createElement("div");
  text.className = "session-title";
  text.textContent = session.title || "新的会话";

  const actions = document.createElement("div");
  actions.className = "session-actions";
  actions.appendChild(tinyButton(session.pinned ? "★" : "☆", session.pinned ? "取消置顶" : "置顶", (event) => {
    event.stopPropagation();
    session.pinned = !session.pinned;
    if (session.pinned) session.pinnedAt = Date.now();
    updateSession(session);
    renderSessions();
  }));
  actions.appendChild(tinyButton("✎", "重命名", (event) => {
    event.stopPropagation();
    renameSession(session);
  }));
  actions.appendChild(tinyButton(deleteArmed === session.id ? "!" : "×", deleteArmed === session.id ? "再次点击删除" : "删除", (event) => {
    event.stopPropagation();
    deleteSession(session.id);
  }));

  button.appendChild(text);
  button.appendChild(sessionActionsMenu(actions));
  return button;
}

function sessionActionsMenu(actions) {
  const menu = document.createElement("details");
  menu.className = "session-menu";
  menu.addEventListener("click", (event) => event.stopPropagation());
  menu.addEventListener("toggle", () => {
    menu.closest(".session-item")?.classList.toggle("menu-open", menu.open);
  });
  const summary = document.createElement("summary");
  summary.textContent = "···";
  summary.title = "更多操作";
  summary.setAttribute("aria-label", "更多操作");
  menu.appendChild(summary);
  menu.appendChild(actions);
  return menu;
}

function tinyButton(text, title, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "tiny-action";
  button.textContent = text;
  button.title = title;
  button.setAttribute("aria-label", title);
  button.addEventListener("click", onClick);
  return button;
}

function renameSession(session) {
  const next = window.prompt("会话名称", session.title || "新的会话");
  if (next === null) return;
  session.title = next.trim() || "新的会话";
  updateSession(session);
  renderSessions();
}

function deleteSession(id) {
  if (deleteArmed !== id) {
    deleteArmed = id;
    renderSessions();
    setTimeout(() => {
      if (deleteArmed === id) {
        deleteArmed = null;
        renderSessions();
      }
    }, 2400);
    return;
  }
  state.sessions = state.sessions.filter((session) => session.id !== id);
  if (!state.sessions.length) createSession();
  if (activeSessionId === id) activeSessionId = state.sessions[0].id;
  deleteArmed = null;
  saveState();
  render();
}

function renameVisualSession(session) {
  const next = window.prompt("视觉创作名称", session.title || "新的视觉创作");
  if (next === null) return;
  session.title = next.trim() || "新的视觉创作";
  session.updatedAt = Date.now();
  saveState();
  render();
}

function deleteVisualSession(id) {
  const session = state.visualSessions.find((item) => item.id === id);
  if (!session || !window.confirm(`确认删除视觉创作“${session.title || "新的视觉创作"}”？`)) return;
  const removedTaskIds = state.visualTasks.filter((task) => task.sessionId === id).map((task) => task.id);
  removedTaskIds.forEach(cancelImageRequest);
  state.visualSessions = state.visualSessions.filter((session) => session.id !== id);
  state.visualTasks = state.visualTasks.filter((task) => task.sessionId !== id);
  removedTaskIds.forEach((taskId) => void deleteVisualMediaCacheForTask(taskId));
  deleteArmed = null;
  if (!state.visualSessions.length) {
    createVisualSession();
    return;
  }
  if (activeVisualSessionId === id) activeVisualSessionId = state.visualSessions[0].id;
  saveState();
  render();
}

function renderMessages() {
  const session = getActiveSession();
  const messages = session.messages || [];
  els.messages.innerHTML = "";
  els.emptyChat.hidden = messages.length > 0;
  messages.forEach((message, index) => {
    els.messages.appendChild(renderMessage(message, index));
  });
  requestAnimationFrame(() => {
    els.messages.scrollTop = els.messages.scrollHeight;
  });
}

function renderMessage(message, index) {
  const wrap = document.createElement("article");
  wrap.className = `message ${message.role}${message.error ? " error" : ""}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = message.content || "";

  if (Array.isArray(message.attachments) && message.attachments.length) {
    const attachments = document.createElement("div");
    attachments.className = "message-attachments";
    attachments.innerHTML = message.attachments
      .map((item) => `<span>${escapeHtml(fileTypeLabel(item.mime || ""))} · ${escapeHtml(item.name || "文件")}</span>`)
      .join("");
    bubble.appendChild(attachments);
  }
  if (message.webSearch) {
    const web = document.createElement("div");
    web.className = "message-web-badge";
    web.textContent = message.webSearchModel ? `已联网 · ${message.webSearchModel}` : "已启用联网";
    bubble.appendChild(web);
  }

  if (message.role === "assistant") {
    const tools = document.createElement("div");
    tools.className = "message-tools";
    tools.appendChild(messageTool("复制", () => copyText(message.content || "")));
    tools.appendChild(messageTool("重试", () => regenerateFrom(index)));
    bubble.appendChild(tools);
  }

  wrap.appendChild(bubble);
  return wrap;
}

function messageTool(text, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = text === "复制" ? "copy-message" : "retry-message";
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
}

function isWebSearchModel(modelId) {
  return /(?:^|[-_.])search-preview(?:$|[-_.])/i.test(String(modelId || ""));
}

function resolveWebSearchModel(currentModel) {
  if (isWebSearchModel(currentModel)) return currentModel;
  const available = unique([
    ...(state.modelRecords || []).map((model) => model.id),
    ...(state.modelOptions || []),
  ]);
  const preferred = ["gpt-4o-search-preview", "gpt-4o-mini-search-preview"];
  return preferred.find((model) => available.includes(model))
    || available.find((model) => isWebSearchModel(model))
    || "gpt-4o-search-preview";
}

function submitComposer() {
  if (typeof els.composer.requestSubmit === "function") {
    els.composer.requestSubmit();
    return;
  }
  const event = new Event("submit", { bubbles: true, cancelable: true });
  els.composer.dispatchEvent(event);
}

async function onSubmit(event) {
  event.preventDefault();
  let prompt = els.promptInput.value.trim();
  if (!prompt && activeMode === "chat" && chatAttachments.length) prompt = "请分析上传的文件。";
  if (!prompt || abortController) return;
  if (!ensureApiReady()) return;
  if (activeMode === "image") {
    if (state.settings.visualMode === "video") await generateVideo(prompt);
    else await generateImage(prompt);
  } else {
    await sendChat(prompt);
  }
}

async function sendChat(prompt, retryMessages = null) {
  const settings = state.settings;
  if (!settings.chatModel) return showMissingSetting("请选择聊天模型");
  if (!settings.apiKey) return showMissingSetting("请先填写 API Key");

  const session = getActiveSession();
  const requestAttachments = retryMessages ? [] : [...chatAttachments];
  const retryUserMessage = retryMessages ? [...retryMessages].reverse().find((message) => message.role === "user") : null;
  const webSearchEnabled = retryMessages ? Boolean(retryUserMessage?.webSearch) : Boolean(settings.chatWeb);
  const requestModel = webSearchEnabled
    ? retryUserMessage?.webSearchModel || resolveWebSearchModel(settings.chatModel)
    : settings.chatModel;
  if (!retryMessages) {
    session.messages.push({
      id: generateId(),
      role: "user",
      content: prompt,
      createdAt: Date.now(),
      attachments: requestAttachments.map((item) => mediaMeta(item)),
      webSearch: webSearchEnabled,
      webSearchModel: webSearchEnabled ? requestModel : "",
    });
    chatAttachments = [];
    renderChatAttachments();
    els.promptInput.value = "";
    autoResizePrompt();
  } else {
    session.messages = retryMessages;
  }

  const assistant = { id: generateId(), role: "assistant", content: "", createdAt: Date.now() };
  session.messages.push(assistant);
  updateSession(session);
  renderMessages();
  setLoading(true);

  abortController = new AbortController();

  const requestMessages = buildChatMessages(session.messages, requestAttachments);
  const request = buildChatRequest(requestModel, requestMessages, settings, webSearchEnabled);

  try {
    const response = await fetch(apiUrl(request.endpoint), {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(request.payload),
      signal: abortController.signal,
    });

    if (!response.ok) throw new Error(await responseError(response));
    if (request.stream && response.body) await readChatStream(response, assistant, request.protocol);
    else {
      const data = await response.json();
      assistant.content = extractChatText(data) || "";
    }
    if (!assistant.content.trim()) assistant.content = "(空响应)";
  } catch (error) {
    if (error.name === "AbortError") {
      assistant.content = assistant.content || "已停止";
    } else {
      assistant.error = true;
      assistant.content = normalizeError(error);
      showToast(assistant.content, true);
    }
  } finally {
    abortController = null;
    updateSession(session);
    setLoading(false);
    renderMessages();
    renderSessions();
  }
}

function buildChatMessages(messages, attachments = []) {
  const result = [];
  const systemPrompt = state.settings.systemPrompt.trim();
  if (systemPrompt) result.push({ role: "system", content: systemPrompt });
  const compact = messages
    .filter((message) => ["user", "assistant"].includes(message.role) && message.content && !message.error)
    .slice(-Math.max(2, Number(state.settings.contextTurns || 10) * 2));
  const lastUserIndex = compact.map((message) => message.role).lastIndexOf("user");
  compact.forEach((message, index) => {
    const content = index === lastUserIndex && attachments.length ? buildChatAttachmentContent(message.content, attachments) : message.content;
    result.push({ role: message.role, content });
  });
  return result;
}

function isBananaRouterBaseUrl(baseUrl = state.settings.baseUrl) {
  try {
    return /(^|\.)bananarouter\.com$/i.test(new URL(String(baseUrl || "")).hostname);
  } catch {
    return /bananarouter\.com/i.test(String(baseUrl || ""));
  }
}

function resolveChatProtocol(modelId, baseUrl = state.settings.baseUrl) {
  if (!isBananaRouterBaseUrl(baseUrl)) return "openai";
  const id = String(modelId || "").toLowerCase();
  if (/claude|anthropic/.test(id)) return "anthropic";
  if (/gemini/.test(id)) return "gemini";
  return "openai";
}

function buildChatRequest(modelId, messages, settings, webSearchEnabled = false) {
  const protocol = resolveChatProtocol(modelId, settings.baseUrl);
  if (protocol === "anthropic") return buildAnthropicChatRequest(modelId, messages, settings);
  if (protocol === "gemini") return buildGeminiChatRequest(modelId, messages, settings);
  const payload = { model: modelId, messages };
  if (webSearchEnabled) {
    payload.stream = false;
    payload.web_search_options = {};
  } else {
    payload.temperature = clampNumber(settings.temperature, 0, 2, 0.7);
    payload.stream = !!settings.stream;
    if (settings.thinking) payload.enable_thinking = true;
  }
  return { protocol: "openai", endpoint: "/v1/chat/completions", payload, stream: Boolean(payload.stream) };
}

function buildAnthropicChatRequest(modelId, messages, settings) {
  const system = messages.filter((message) => message.role === "system").map((message) => chatContentText(message.content)).filter(Boolean).join("\n\n");
  const payload = {
    model: modelId,
    max_tokens: 4096,
    messages: messages
      .filter((message) => message.role === "user" || message.role === "assistant")
      .map((message) => ({ role: message.role, content: toAnthropicContent(message.content) })),
    temperature: clampNumber(settings.temperature, 0, 1, 0.7),
    stream: !!settings.stream,
  };
  if (system) payload.system = system;
  return { protocol: "anthropic", endpoint: "/v1/messages", payload, stream: payload.stream };
}

function buildGeminiChatRequest(modelId, messages, settings) {
  const system = messages.filter((message) => message.role === "system").map((message) => chatContentText(message.content)).filter(Boolean).join("\n\n");
  const payload = {
    contents: messages
      .filter((message) => message.role === "user" || message.role === "assistant")
      .map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: toGeminiParts(message.content),
      })),
    generationConfig: {
      temperature: clampNumber(settings.temperature, 0, 2, 0.7),
      maxOutputTokens: 4096,
    },
  };
  if (system) payload.systemInstruction = { parts: [{ text: system }] };
  const action = settings.stream ? "streamGenerateContent?alt=sse" : "generateContent";
  return {
    protocol: "gemini",
    endpoint: `/v1beta/models/${encodeURIComponent(String(modelId).replace(/^models\//, ""))}:${action}`,
    payload,
    stream: !!settings.stream,
  };
}

function chatContentText(content) {
  if (typeof content === "string") return content;
  return (Array.isArray(content) ? content : [])
    .map((part) => part?.text || "")
    .filter(Boolean)
    .join("\n");
}

function toAnthropicContent(content) {
  if (typeof content === "string") return content;
  const blocks = [];
  (Array.isArray(content) ? content : []).forEach((part) => {
    if (part?.type === "text" && part.text) {
      blocks.push({ type: "text", text: part.text });
      return;
    }
    if (part?.type === "image_url") {
      const url = typeof part.image_url === "string" ? part.image_url : part.image_url?.url;
      const inline = parseInlineDataUrl(url);
      blocks.push({
        type: "image",
        source: inline
          ? { type: "base64", media_type: inline.mime, data: inline.data }
          : { type: "url", url },
      });
      return;
    }
    if (part?.type === "file" && part.file?.file_data) {
      const inline = parseInlineDataUrl(part.file.file_data);
      if (inline) blocks.push({ type: "document", source: { type: "base64", media_type: inline.mime, data: inline.data } });
    }
  });
  return blocks.length ? blocks : "";
}

function toGeminiParts(content) {
  if (typeof content === "string") return [{ text: content }];
  const parts = [];
  (Array.isArray(content) ? content : []).forEach((part) => {
    if (part?.type === "text" && part.text) {
      parts.push({ text: part.text });
      return;
    }
    const source = part?.type === "image_url"
      ? (typeof part.image_url === "string" ? part.image_url : part.image_url?.url)
      : part?.type === "file" ? part.file?.file_data : "";
    if (!source) return;
    const inline = parseInlineDataUrl(source);
    if (inline) parts.push({ inlineData: { mimeType: inline.mime, data: inline.data } });
    else if (/^https?:\/\//i.test(source)) parts.push({ fileData: { fileUri: source } });
  });
  return parts.length ? parts : [{ text: "" }];
}

function parseInlineDataUrl(value) {
  const match = String(value || "").match(/^data:([^;,]+);base64,([\s\S]+)$/i);
  return match ? { mime: match[1], data: match[2].replace(/\s/g, "") } : null;
}

function buildChatAttachmentContent(prompt, attachments) {
  let text = prompt;
  const parts = [];
  attachments.forEach((attachment) => {
    if (attachment.text) {
      text += `\n\n文件：${attachment.name}\n---\n${attachment.text.slice(0, 120000)}\n---`;
    }
  });
  parts.push({ type: "text", text });
  attachments.forEach((attachment) => {
    if (attachment.mime.startsWith("image/")) {
      parts.push({ type: "image_url", image_url: { url: attachment.dataUrl } });
    } else if (!attachment.text) {
      parts.push({
        type: "file",
        file: {
          filename: attachment.name,
          file_data: attachment.dataUrl,
        },
      });
    }
  });
  return parts;
}

async function readChatStream(response, assistant, protocol = "openai") {
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data);
        const content = extractChatStreamText(json, protocol);
        if (content) {
          assistant.content += content;
          patchLastAssistant(assistant.content);
        }
      } catch {
        // Ignore malformed heartbeat lines.
      }
    }
  }
}

function extractChatStreamText(data, protocol = "openai") {
  if (protocol === "anthropic") {
    return data?.type === "content_block_delta" ? data?.delta?.text || "" : "";
  }
  if (protocol === "gemini") {
    return (data?.candidates?.[0]?.content?.parts || []).map((part) => part?.text || "").join("");
  }
  const delta = data?.choices?.[0]?.delta || {};
  return delta.content || delta.reasoning_content || data?.choices?.[0]?.text || "";
}

function patchLastAssistant(content) {
  const bubbles = els.messages.querySelectorAll(".message.assistant .bubble");
  const bubble = bubbles[bubbles.length - 1];
  if (!bubble) return;
  const tools = bubble.querySelector(".message-tools");
  bubble.textContent = content;
  if (tools) bubble.appendChild(tools);
  els.messages.scrollTop = els.messages.scrollHeight;
}

function extractChatText(data) {
  return (
    data?.choices?.[0]?.message?.content ||
    data?.choices?.[0]?.text ||
    data?.output_text ||
    (data?.content || []).map?.((part) => part?.text || "").join("") ||
    (data?.candidates?.[0]?.content?.parts || []).map((part) => part?.text || "").join("") ||
    ""
  );
}

async function regenerateFrom(index) {
  const session = getActiveSession();
  const messages = session.messages.slice(0, index);
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  if (!lastUser) return;
  await sendChat(lastUser.content, messages);
}

async function generateImage(prompt) {
  const settings = state.settings;
  if (!settings.imageModel) return showMissingSetting("请选择图像模型");
  if (!settings.apiKey) return showMissingSetting("请先填写 API Key");

  const references = draftMedia.imageReferences;
  const requestPrompt = buildVisualContextPrompt(prompt);
  const isEdit = imageGenerationModeForReferences(references) === "image-to-image";
  syncImageModeFromReferences(references);

  els.promptInput.value = "";
  autoResizePrompt();

  const task = {
    id: generateId(),
    type: "image",
    sessionId: activeVisualSessionId,
    prompt,
    contextApplied: requestPrompt !== prompt,
    model: settings.imageModel,
    provider: getModelProfile(settings.imageModel)?.provider || "custom",
    createdAt: Date.now(),
    status: "running",
    media: [],
    params: imageTaskParams(isEdit),
    references: references.map((item) => mediaMeta(item)),
  };
  const controller = new AbortController();
  activeImageRequests.set(task.id, controller);
  state.visualTasks.unshift(task);
  updateVisualSession(getActiveVisualSession(), prompt);
  saveState();
  renderImages();
  renderSessions();
  syncImageRequestControls();

  try {
    const request = buildImageRequest(requestPrompt, references, isEdit);
    task.requestMode = request.label;
    const response = await fetchImageRequestWithRetry(request, task, controller.signal);
    if (task.retryCount) task.rawStatus = "自动重试后已连接上游";
    const data = await readImageGenerationResponse(response, task);
    task.media = unique([...(task.media || []), ...extractCompletedImageUrls(data)]);
    task.jobId = extractImageJobId(data);
    task.rawStatus = extractTaskStatus(data) || task.rawStatus;
    task.responseKeys = responseFieldSummary(data);
    if (task.media.length) {
      task.status = "done";
      await cacheVisualTaskMedia(task);
      showToast(`已生成 ${task.media.length} 张图片`);
    } else {
      task.status = "empty";
      const taskHint = task.jobId ? `，仅返回了任务 ID ${task.jobId}` : "";
      throw new Error(`图片接口已结束，但没有返回可显示的图片${taskHint}。响应字段：${task.responseKeys || "无"}`);
    }
  } catch (error) {
    task.status = error.name === "AbortError" ? "stopped" : "error";
    task.error = error.name === "AbortError" ? "已停止" : normalizeError(error);
    if (error.name !== "AbortError") showToast(task.error, true);
  } finally {
    activeImageRequests.delete(task.id);
    saveState();
    syncImageRequestControls();
    renderImages();
    renderVisualMeta();
  }
}

function imageTaskParams(isEdit) {
  const settings = state.settings;
  return {
    mode: isEdit ? "图生图" : "文生图",
    size: effectiveImageOutputSize(settings.imageModel),
    aspectRatio: effectiveImageAspectRatio(settings.imageModel),
    quality: settings.imageQuality,
    style: settings.imageStyle,
    count: clampNumber(settings.imageCount, 1, 4, 1),
  };
}

function buildImageRequest(prompt, references, isEdit) {
  const settings = state.settings;
  const model = getModelProfile(settings.imageModel);
  const style = resolveImageApiStyle(model);
  if (style === "gemini") {
    return buildGeminiImageRequest(prompt, references, model);
  }
  if (isEdit && references.length) {
    return buildOpenAIImageEditRequest(prompt, references);
  }
  return buildOpenAIImageGenerationRequest(prompt, model);
}

function buildOpenAIImageGenerationRequest(prompt, model) {
  const settings = state.settings;
  const isGptImage = isGptImageModel(settings.imageModel);
  const payload = {
    model: settings.imageModel,
    prompt: imagePromptWithSelectedStyle(prompt, settings.imageModel),
    size: imageRequestSize(settings.imageModel),
    n: clampNumber(settings.imageCount, 1, 4, 1),
  };
  if (isGptImage) {
    payload.response_format = "url";
  } else {
    payload.response_format = "url";
  }
  applyImageTuning(payload, model, "openai");
  return {
    label: "OpenAI 兼容图片生成",
    endpoint: settings.imageEndpoint || DEFAULT_SETTINGS.imageEndpoint,
    headers: authHeaders(),
    body: JSON.stringify(payload),
  };
}

async function fetchImageRequestWithRetry(request, task, signal) {
  const retryableModel = /^gpt-image(?:$|[-_.])/i.test(String(task?.model || ""));
  const maxAttempts = retryableModel ? 2 : 1;
  let lastError = "";
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const response = await fetch(apiUrl(request.endpoint), {
      method: "POST",
      headers: request.headers,
      body: request.body,
      signal,
    });
    if (response.ok) return response;
    const message = await responseError(response);
    lastError = message;
    if (attempt + 1 >= maxAttempts || !isRetryableImageError(response.status, message)) {
      throw new Error(attempt > 0 ? `${message}（已自动重试 1 次）` : message);
    }
    task.retryCount = attempt + 1;
    task.rawStatus = "上游通道暂时不可用，正在自动重试 1/1";
    saveState();
    renderImages();
    const retryAfter = Number(response.headers.get("retry-after"));
    await waitWithSignal(Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter * 1000, 5000) : 1600, signal);
  }
  throw new Error(lastError || "图片生成请求失败");
}

function isRetryableImageError(status, message = "") {
  return status === 429
    || status >= 500
    || /upstream model service error|try again later|temporar(?:y|ily) unavailable|service unavailable/i.test(String(message));
}

function waitWithSignal(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}

async function readImageGenerationResponse(response, task) {
  const contentType = String(response.headers.get("content-type") || "").toLowerCase();
  if (!isGptImageModel(task?.model) && contentType.includes("text/event-stream") && response.body?.getReader) {
    return readImageEventStream(response.body, task);
  }
  const text = await response.text();
  return parseImageResponseText(text);
}

async function readImageEventStream(stream, task) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const events = [];
  let buffer = "";

  const consume = (flush = false) => {
    buffer = buffer.replace(/\r\n/g, "\n");
    const frames = buffer.split("\n\n");
    const tail = frames.pop() || "";
    if (flush) {
      if (tail) frames.push(tail);
      buffer = "";
    } else {
      buffer = tail;
    }
    frames.forEach((frame) => {
      const payloadText = frame
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\n")
        .trim();
      if (!payloadText || payloadText === "[DONE]") return;
      const payload = parseJsonPayload(payloadText);
      if (!payload) return;
      const message = extractErrorMessage(payload);
      if (/^(?:error|upstream_error)$/i.test(String(payload.type || "")) || payload.error) {
        throw new Error(message || "图片生成流返回错误");
      }
      events.push(payload);
      const media = extractImageUrls(payload);
      if (media.length) {
        const isPartial = /partial/i.test(String(payload.type || ""));
        task.media = isPartial || task.previewingPartial ? media : unique([...(task.media || []), ...media]);
        task.previewingPartial = isPartial;
        if (!isPartial) {
          task.status = "done";
          saveState();
        }
        task.rawStatus = payload.type || payload.status || "正在接收图片";
        renderImages();
      }
    });
  };

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
    consume(done);
    if (done) break;
  }
  return { events };
}

function extractCompletedImageUrls(data) {
  if (!Array.isArray(data?.events)) return extractImageUrls(data);
  const completedEvents = data.events.filter((event) => !/partial/i.test(String(event?.type || "")));
  const completed = extractImageUrls(completedEvents);
  return completed.length ? completed : extractImageUrls(data.events);
}

function parseImageResponseText(text) {
  const value = String(text || "").trim();
  if (!value) throw new Error("图片接口返回了空响应");
  const json = parseJsonPayload(value);
  if (json) return json;
  const events = [];
  value.split(/\r?\n/).forEach((line) => {
    const payloadText = line.replace(/^data:\s*/, "").trim();
    if (!payloadText || payloadText === "[DONE]") return;
    const payload = parseJsonPayload(payloadText);
    if (payload) events.push(payload);
  });
  if (events.length) return { events };
  throw new Error(`无法解析图片接口响应：${value.slice(0, 160)}`);
}

function parseJsonPayload(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function responseFieldSummary(data) {
  if (Array.isArray(data)) return `数组(${data.length})`;
  if (!data || typeof data !== "object") return typeof data;
  const keys = Object.keys(data);
  if (Array.isArray(data.events)) return `${keys.join(", ")} / 事件(${data.events.length})`;
  return keys.join(", ");
}

function buildOpenAIImageEditRequest(prompt, references) {
  const settings = state.settings;
  const model = getModelProfile(settings.imageModel);
  const form = new FormData();
  form.append("model", settings.imageModel);
  form.append("prompt", imagePromptWithSelectedStyle(prompt, settings.imageModel));
  form.append("size", imageRequestSize(settings.imageModel));
  form.append("n", String(clampNumber(settings.imageCount, 1, 4, 1)));
  if (settings.imageQuality !== "auto") form.append("quality", settings.imageQuality);
  if (settings.imageStyle !== "auto" && !isGptImageModel(settings.imageModel)) form.append("style", settings.imageStyle);
  const imageField = isBananaRouterBaseUrl() ? "image[]" : "image";
  references.forEach((reference) => {
    form.append(imageField, reference.file, reference.name);
  });
  return {
    label: `${model?.vendor || "OpenAI"} 图片编辑`,
    endpoint: settings.imageEditEndpoint || DEFAULT_SETTINGS.imageEditEndpoint,
    headers: authHeaders(false),
    body: form,
  };
}

function buildGeminiImageRequest(prompt, references, model) {
  const route = resolveGeminiImageRoute(state.settings.imageModel);
  if (route === "native") {
    return buildGeminiNativeImageRequest(prompt, references, model);
  }
  return buildGeminiChatImageRequest(prompt, references, model);
}

function buildGeminiChatImageRequest(prompt, references, model) {
  const settings = state.settings;
  const content = [{ type: "text", text: imagePromptWithSelectedStyle(prompt, settings.imageModel) }];
  references.forEach((reference) => {
    content.push({
      type: "image_url",
      image_url: { url: reference.dataUrl },
    });
  });
  const payload = {
    max_tokens: 4096,
    model: settings.imageModel,
    messages: [{ role: "user", content }],
    stream: false,
  };
  return {
    label: `${model?.vendor || "Gemini"} Chat 图片${references.length ? "编辑" : "生成"}`,
    endpoint: "/v1/chat/completions",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  };
}

function buildGeminiNativeImageRequest(prompt, references, model) {
  const settings = state.settings;
  const modelId = String(settings.imageModel || "").replace(/^models\//, "");
  const parts = [{ text: imagePromptWithSelectedStyle(prompt, modelId) }];
  references.forEach((reference) => {
    const inline = geminiInlineImage(reference);
    parts.push(isBananaRouterBaseUrl()
      ? { inlineData: { mimeType: inline.mime, data: inline.data } }
      : { inline_data: { mime_type: inline.mime, data: inline.data } });
  });
  const generationConfig = {
    responseModalities: ["TEXT", "IMAGE"],
  };
  if (supportsGeminiNativeImageConfig(modelId)) {
    generationConfig.imageConfig = {
      aspectRatio: effectiveImageAspectRatio(modelId),
      imageSize: geminiNativeImageSize(),
    };
  }
  const payload = {
    contents: [{ role: "user", parts }],
    generationConfig,
  };
  return {
    label: `${model?.vendor || "Gemini"} generateContent ${references.length ? "编辑" : "生成"}`,
    endpoint: `/v1beta/models/${encodeURIComponent(modelId)}:generateContent`,
    headers: authHeaders(),
    body: JSON.stringify(payload),
  };
}

function resolveGeminiImageRoute(modelId) {
  const id = String(modelId || "").replace(/^models\//, "").toLowerCase();
  if (isBananaRouterBaseUrl()) return "native";
  if (id === "gemini-3.1-flash-image-preview") return "chat";
  return isGemini3ProImageModel(id)
    || supportsGeminiNativeImageConfig(id)
    || /^gemini-2\.0-.*image-generation$/i.test(id)
    ? "native"
    : "chat";
}

function isGemini3ProImageModel(modelId) {
  return /^gemini-3(?:\.0)?-pro-image(?:-preview)?$/i.test(String(modelId || ""));
}

function supportsGeminiNativeImageConfig(modelId) {
  const id = String(modelId || "").toLowerCase();
  return /gemini-(?:2\.5|3(?:\.1)?)-.*image/.test(id);
}

function geminiInlineImage(reference) {
  const dataUrl = String(reference?.dataUrl || "");
  const match = dataUrl.match(/^data:([^;,]+);base64,([\s\S]+)$/i);
  if (!match) throw new Error(`参考图 ${reference?.name || ""} 缺少有效的 Base64 数据`);
  return {
    mime: reference?.mime || match[1] || "image/png",
    data: match[2].replace(/\s/g, ""),
  };
}

function geminiNativeImageSize() {
  const modelId = String(state.settings.imageModel || "").toLowerCase();
  if (/gemini-2\.0|gemini-3\.1-flash-lite-image/.test(modelId)) return "1K";
  const selected = String(state.settings.imageSize || "").toUpperCase();
  const supported = /gemini-3\.1-flash-image/.test(modelId) ? ["0.5K", "1K", "2K", "4K"] : ["1K", "2K", "4K"];
  if (supported.includes(selected)) return selected;
  const quality = String(state.settings.imageQuality || "auto").toLowerCase();
  if (quality === "high" || quality === "hd") return "4K";
  if (quality === "medium") return "2K";
  if (quality === "low" || quality === "standard") return "1K";
  const dimensions = String(effectiveImageSize()).split("x").map(Number);
  return Math.max(...dimensions) > 1024 ? "2K" : "1K";
}

function applyImageTuning(payload, model, style) {
  const settings = state.settings;
  if (settings.imageQuality !== "auto") {
    payload.quality = normalizeQualityForModel(settings.imageQuality, model);
  }
  if (settings.imageStyle !== "auto") {
    if (style === "gemini") payload.style_preset = settings.imageStyle;
    else if (!isGptImageModel(settings.imageModel)) payload.style = settings.imageStyle;
  }
  if (style !== "openai" || model?.provider !== "openai") {
    payload.aspect_ratio = effectiveImageAspectRatio(settings.imageModel);
  }
}

function imagePromptWithSelectedStyle(prompt, modelId = state.settings.imageModel) {
  const profile = getModelProfile(modelId);
  const isGemini = profile?.provider === "gemini" || /gemini|nano[-_.]?banana/i.test(String(modelId || ""));
  const stylePrompts = {
    natural: "自然真实，光线与材质表现克制",
    vivid: "色彩鲜明，视觉冲击力强",
    cinematic: "电影感构图、灯光与色彩分级",
    illustration: "精致插画风格，线条与层次清晰",
    photorealistic: "照片级写实，细节和物理质感可信",
  };
  const qualityPrompts = {
    low: "快速草稿质量，减少不必要的细节",
    standard: "标准质量，主体和构图清晰",
    medium: "均衡质量，细节完整且画面稳定",
    high: "高质量精细渲染，强化纹理、光影和边缘细节",
    hd: "高清精细渲染，强化纹理、光影和边缘细节",
  };
  const controls = [];
  const stylePrompt = stylePrompts[state.settings.imageStyle];
  if (stylePrompt && (isGptImageModel(modelId) || isGemini)) controls.push(`风格：${stylePrompt}`);
  if (isGemini) {
    const qualityPrompt = qualityPrompts[state.settings.imageQuality];
    if (qualityPrompt) controls.push(`质量：${qualityPrompt}`);
    const size = geminiNativeImageSize();
    if (size) controls.push(`输出尺寸：${size}`);
    controls.push(`画面比例：${effectiveImageAspectRatio(modelId)}`);
  }
  return controls.length ? `${prompt}\n\n生成要求：${controls.join("；")}。` : prompt;
}

async function generateVideo(prompt) {
  const settings = state.settings;
  if (!settings.videoModel) return showMissingSetting("请选择视频模型");
  if (!settings.apiKey) return showMissingSetting("请先填写 API Key");

  const requestPrompt = buildVisualContextPrompt(prompt);
  const count = effectiveVideoCount(settings.videoModel);
  els.promptInput.value = "";
  autoResizePrompt();
  setLoading(true);
  abortController = new AbortController();

  const profile = getModelProfile(settings.videoModel);
  const createdAt = Date.now();
  const tasks = Array.from({ length: count }, (_, index) => ({
    id: generateId(),
    type: "video",
    sessionId: activeVisualSessionId,
    prompt,
    contextApplied: requestPrompt !== prompt,
    model: settings.videoModel,
    provider: profile?.provider || "custom",
    createdAt: createdAt + index,
    status: "running",
    media: [],
    params: videoTaskParams(),
    references: videoReferenceMeta(),
  }));
  state.visualTasks.unshift(...tasks);
  updateVisualSession(getActiveVisualSession(), prompt);
  saveState();
  renderImages();
  renderSessions();

  try {
    await Promise.all(tasks.map((task) => submitVideoTask(task, requestPrompt, profile, abortController.signal)));
    const completed = tasks.filter((task) => task.status === "done").length;
    const submitted = tasks.filter((task) => task.status === "submitted").length;
    const failed = tasks.filter((task) => ["error", "stopped", "empty"].includes(task.status)).length;
    if (count === 1) {
      const task = tasks[0];
      if (task.status === "done") showToast(`已生成 ${task.media.length} 个视频`);
      else if (task.status === "submitted") showToast("视频任务已提交，正在轮询结果");
      else if (task.error) showToast(task.error, true);
    } else if (failed === count) {
      showToast(tasks.find((task) => task.error)?.error || "视频任务提交失败", true);
    } else {
      showToast(`已创建 ${completed + submitted}/${count} 个视频任务${failed ? `，${failed} 个失败` : ""}`, failed > 0);
    }
  } finally {
    abortController = null;
    saveState();
    setLoading(false);
    renderImages();
    renderVisualMeta();
  }
}

async function submitVideoTask(task, requestPrompt, profile, signal) {
  try {
    let request = buildVideoRequest(requestPrompt, profile);
    task.requestMode = request.label;
    task.requestEndpoint = request.endpoint;
    let response = await fetch(apiUrl(request.endpoint), {
      method: "POST",
      headers: request.headers,
      body: request.body,
      signal,
    });
    if (!response.ok) {
      const initialError = await responseError(response);
      const fallbackRequest = buildGrokTextVideoFallbackRequest(requestPrompt, profile, request, initialError);
      if (!fallbackRequest) throw new Error(initialError);
      request = fallbackRequest;
      task.requestMode = request.label;
      task.requestEndpoint = request.endpoint;
      task.rawStatus = "Multipart 通道不可用，已切换 JSON 文生视频通道";
      response = await fetch(apiUrl(request.endpoint), {
        method: "POST",
        headers: request.headers,
        body: request.body,
        signal,
      });
      if (!response.ok) throw new Error(await responseError(response));
    }
    const data = await response.json();
    task.media = extractVideoUrls(data);
    task.jobId = extractJobId(data);
    task.rawStatus = extractTaskStatus(data) || task.rawStatus;
    if (task.media.length) {
      task.status = "done";
    } else if (task.jobId) {
      task.status = "submitted";
      pollVideoTask(task.id, { attempts: 120 });
    } else {
      task.status = "empty";
      throw new Error("视频接口未返回视频或任务 ID。请检查端点返回格式。");
    }
  } catch (error) {
    task.status = error.name === "AbortError" ? "stopped" : "error";
    task.error = error.name === "AbortError" ? "已停止" : normalizeError(error);
  } finally {
    saveState();
    renderImages();
  }
}

function buildVideoRequest(prompt, profile) {
  const settings = state.settings;
  const apiStyle = resolveVideoApiStyle(profile);
  if (profile?.provider === "xai") return buildGrokVideoRequest(prompt, profile);
  if (profile?.provider === "sora") return buildSoraVideoRequest(prompt, profile);
  if (profile?.provider === "seedance") return buildSeedDanceVideoRequest(prompt, profile);
  if (profile?.provider === "veo" && usesDeepRouterVeoCompatibility(settings.videoModel)) {
    return buildCompatibleMultipartVideoRequest(prompt, profile);
  }
  if (profile?.provider === "veo" && usesNewApiVeoTask(settings.videoModel)) {
    return buildNewApiVeoVideoRequest(prompt, profile);
  }
  if (profile?.provider === "veo" && apiStyle === "gemini") return buildVeoVideoRequest(prompt, profile);
  const references = buildVideoReferences();
  return {
    label: `${profile?.vendor || "通用"} 视频参数`,
    endpoint: videoGenerationEndpoint(profile),
    headers: authHeaders(),
    body: JSON.stringify({
      model: settings.videoModel,
      prompt,
      aspect_ratio: settings.videoAspectRatio,
      resolution: settings.videoResolution,
      duration: clampNumber(settings.videoDuration, 1, 30, 5),
      duration_seconds: clampNumber(settings.videoDuration, 1, 30, 5),
      style: settings.videoStyle === "auto" ? undefined : settings.videoStyle,
      audio: !!settings.videoAudio,
      generate_audio: !!settings.videoAudio,
      first_frame: draftMedia.firstFrame ? mediaPayload(draftMedia.firstFrame) : undefined,
      last_frame: draftMedia.lastFrame ? mediaPayload(draftMedia.lastFrame) : undefined,
      references,
      response_format: "url",
    }),
  };
}

function buildSeedDanceVideoRequest(prompt, profile) {
  const settings = state.settings;
  const modelId = settings.videoModel;
  const duration = normalizeSeedDanceDuration(settings.videoDuration, modelId);
  const ratio = effectiveVideoAspectRatio(modelId);
  const resolution = effectiveVideoResolution(modelId);
  const useNewApiTask = usesNewApiSeedance20Task(modelId);
  const body = useNewApiTask
    ? {
        model: modelId,
        prompt,
        duration: duration > 0 ? duration : undefined,
        seconds: duration > 0 ? String(duration) : undefined,
        duration_seconds: duration > 0 ? duration : undefined,
        ratio,
        resolution,
        generate_audio: effectiveVideoAudio(modelId),
        watermark: false,
        metadata: {
          content: buildSeedance20Content(prompt),
          generate_audio: effectiveVideoAudio(modelId),
          ratio,
          resolution,
          duration,
          seconds: duration,
          duration_seconds: duration,
          watermark: false,
        },
      }
    : isSeedance20UnifiedModel(modelId)
      ? {
          model: modelId,
          content: buildSeedance20Content(prompt),
          generate_audio: effectiveVideoAudio(modelId),
          ratio,
          resolution,
          duration,
          watermark: false,
        }
    : {
        model: modelId,
        prompt,
        duration,
        duration_seconds: duration,
        seconds: String(duration),
        ratio,
        resolution,
        metadata: {
          ratio,
          resolution,
          duration,
          seconds: duration,
          duration_seconds: duration,
        },
      };
  const references = buildVideoReferences();
  if (!isSeedance20UnifiedModel(modelId) && references.length) body.references = references;
  return {
    label: `${profile?.vendor || "SeedDance"} 视频参数`,
    endpoint: videoGenerationEndpoint(profile),
    headers: authHeaders(),
    body: JSON.stringify(body),
  };
}

function buildSeedance20Content(prompt) {
  const content = [{ type: "text", text: prompt }];
  const addImage = (item, role) => {
    if (item?.dataUrl) content.push({ type: "image_url", image_url: { url: item.dataUrl }, role });
  };
  if (draftMedia.firstFrame || draftMedia.lastFrame) {
    addImage(draftMedia.firstFrame, "first_frame");
    addImage(draftMedia.lastFrame, "last_frame");
    return content;
  }
  draftMedia.videoImages.forEach((item) => addImage(item, "reference_image"));
  draftMedia.videoReferences.forEach((item) => {
    if (item?.dataUrl) content.push({ type: "video_url", video_url: { url: item.dataUrl }, role: "reference_video" });
  });
  if (draftMedia.audio) {
    if (!draftMedia.videoImages.length && !draftMedia.videoReferences.length) {
      throw new Error("Seedance 2.0 音频参考需要同时上传参考图片或参考视频");
    }
    content.push({
      type: "audio_url",
      audio_url: { url: draftMedia.audio.dataUrl },
      role: "reference_audio",
    });
  }
  return content;
}

function buildGrokVideoRequest(prompt, profile) {
  const endpoint = videoGenerationEndpoint(profile);
  return isGrokJsonVideoEndpoint(endpoint)
    ? buildGrokJsonVideoRequest(prompt, profile, endpoint)
    : buildGrokMultipartVideoRequest(prompt, profile, endpoint);
}

function buildGrokTextVideoFallbackRequest(prompt, profile, request, errorMessage) {
  const hasImage = Boolean(draftMedia.videoImages[0] || draftMedia.firstFrame || draftMedia.lastFrame);
  if (!isGrokImagine15Model(state.settings.videoModel) || hasImage) return null;
  if (isGrokJsonVideoEndpoint(request?.endpoint)) return null;
  if (!/requires? (?:a )?reference image|需要(?:上传)?参考图|必须(?:提供|上传).*图片/i.test(String(errorMessage || ""))) return null;
  return buildGrokJsonVideoRequest(prompt, profile, "/v1/videos/generations");
}

function isGrokJsonVideoEndpoint(endpoint) {
  return /\/videos\/generations(?:$|[?#])/i.test(String(endpoint || ""));
}

function buildGrokJsonVideoRequest(prompt, profile, endpoint) {
  const settings = state.settings;
  const body = {
    model: settings.videoModel,
    prompt,
    duration: effectiveVideoDuration(settings.videoModel),
    aspect_ratio: effectiveVideoAspectRatio(settings.videoModel),
    resolution: effectiveVideoResolution(settings.videoModel),
  };
  const primaryImage = draftMedia.videoImages[0] || draftMedia.firstFrame || draftMedia.lastFrame;
  if (primaryImage) body.image = { url: primaryImage.dataUrl };
  if (!isGrokImagine15Model(settings.videoModel)) {
    const references = draftMedia.firstFrame ? draftMedia.videoImages : draftMedia.videoImages.slice(1);
    if (references.length) body.reference_images = references.slice(0, 3).map((item) => ({ url: item.dataUrl }));
  }
  return {
    label: `${profile?.vendor || "xAI"} JSON 视频参数`,
    endpoint,
    headers: authHeaders(),
    body: JSON.stringify(body),
  };
}

function buildGrokMultipartVideoRequest(prompt, profile, endpoint) {
  const settings = state.settings;
  const form = new FormData();
  form.append("model", settings.videoModel);
  form.append("prompt", prompt);
  form.append("size", effectiveVideoAspectRatio(settings.videoModel));
  const duration = effectiveVideoDuration(settings.videoModel);
  form.append("seconds", String(duration));
  if (!isGrokImagine15Model(settings.videoModel)) {
    form.append("duration", String(duration));
    form.append("resolution", effectiveVideoResolution(settings.videoModel));
  }
  const reference = draftMedia.videoImages[0] || draftMedia.firstFrame || draftMedia.lastFrame;
  if (reference?.file) form.append("input_reference", reference.file, reference.name);
  return {
    label: `${profile?.vendor || "Grok"} Multipart 视频参数`,
    endpoint,
    headers: rawAuthHeaders(),
    body: form,
  };
}

function buildSoraVideoRequest(prompt, profile) {
  const settings = state.settings;
  const duration = normalizeSora2Duration(settings.videoDuration, settings.videoModel);
  const size = effectiveVideoAspectRatio(settings.videoModel);
  const reference = draftMedia.firstFrame || draftMedia.videoImages[0] || draftMedia.lastFrame;
  const form = new FormData();
  form.append("model", settings.videoModel);
  form.append("prompt", prompt);
  form.append("seconds", String(duration));
  form.append("duration", String(duration));
  form.append("size", size);
  if (reference?.file) form.append("input_reference", reference.file, reference.name);
  else if (reference?.dataUrl) form.append("input_reference", reference.dataUrl);
  return {
    label: `${profile?.vendor || "OpenAI"} Sora Multipart 参数`,
    endpoint: videoGenerationEndpoint(profile),
    headers: authHeaders(false),
    body: form,
  };
}

function buildCompatibleMultipartVideoRequest(prompt, profile) {
  const settings = state.settings;
  const form = new FormData();
  form.append("model", settings.videoModel);
  form.append("prompt", prompt);
  form.append("size", effectiveVideoAspectRatio(settings.videoModel));
  const duration = effectiveVideoDuration(settings.videoModel);
  form.append("seconds", String(duration));
  form.append("duration", String(duration));
  const reference = draftMedia.firstFrame || draftMedia.videoImages[0] || draftMedia.lastFrame;
  if (reference?.file) form.append("input_reference", reference.file, reference.name);
  return {
    label: `${profile?.vendor || "兼容"} Multipart 视频参数`,
    endpoint: videoGenerationEndpoint(profile),
    headers: rawAuthHeaders(),
    body: form,
  };
}

function buildNewApiVeoVideoRequest(prompt, profile) {
  const settings = state.settings;
  const modelId = settings.videoModel;
  const duration = effectiveVideoDuration(modelId);
  const resolution = effectiveVideoResolution(modelId);
  const aspectRatio = effectiveVideoAspectRatio(modelId);
  const primaryImage = draftMedia.firstFrame || draftMedia.videoImages[0];
  return {
    label: `${profile?.vendor || "Google"} NewAPI Veo 参数`,
    endpoint: videoGenerationEndpoint(profile),
    headers: authHeaders(),
    body: JSON.stringify({
      model: modelId,
      prompt,
      duration,
      seconds: String(duration),
      images: primaryImage?.dataUrl ? [primaryImage.dataUrl] : undefined,
      metadata: {
        durationSeconds: duration,
        aspectRatio,
        resolution,
        generateAudio: effectiveVideoAudio(modelId),
      },
    }),
  };
}

function buildVeoVideoRequest(prompt, profile) {
  const settings = state.settings;
  const instance = { prompt };
  const primaryImage = draftMedia.firstFrame || draftMedia.videoImages[0];
  if (primaryImage) instance.image = geminiVideoImage(primaryImage);
  if (primaryImage && draftMedia.lastFrame) instance.lastFrame = geminiVideoImage(draftMedia.lastFrame);
  if (isVeo31Model(settings.videoModel) && !isVeo31LiteModel(settings.videoModel)) {
    const references = draftMedia.firstFrame ? draftMedia.videoImages : draftMedia.videoImages.slice(1);
    if (references.length) {
      instance.referenceImages = references.slice(0, 3).map((item) => ({
        image: geminiVideoImage(item),
        referenceType: "asset",
      }));
    }
  }
  const parameters = {
    aspectRatio: effectiveVideoAspectRatio(settings.videoModel),
    durationSeconds: effectiveVideoDuration(settings.videoModel),
  };
  if (!isVeo2Model(settings.videoModel)) parameters.resolution = effectiveVideoResolution(settings.videoModel);
  const body = { instances: [instance], parameters };
  return {
    label: `${profile?.vendor || "Google"} Veo 原生参数`,
    endpoint: videoGenerationEndpoint(profile),
    headers: authHeaders(),
    body: JSON.stringify(body),
  };
}

function geminiVideoImage(item) {
  const inline = parseInlineDataUrl(item?.dataUrl);
  if (!inline) throw new Error(`参考图 ${item?.name || ""} 缺少有效的 Base64 数据`);
  return { inlineData: { mimeType: inline.mime, data: inline.data } };
}

function videoGenerationEndpoint(profile) {
  const endpoint = state.settings.videoEndpoint || DEFAULT_SETTINGS.videoEndpoint;
  const defaultLike = !endpoint || endpoint === DEFAULT_SETTINGS.videoEndpoint;
  if (profile?.provider === "xai" && defaultLike) return "/v1/videos";
  if (profile?.provider === "sora" && defaultLike) return "/v1/videos";
  if (profile?.provider === "seedance" && isSeedance20UnifiedModel(state.settings.videoModel)
      && !usesNewApiSeedance20Task(state.settings.videoModel) && defaultLike) {
    return "/api/v3/contents/generations/tasks";
  }
  if (profile?.provider === "seedance" && defaultLike) return "/v1/video/generations";
  if (profile?.provider === "veo" && usesDeepRouterVeoCompatibility(state.settings.videoModel) && defaultLike) return "/v1/videos";
  if (profile?.provider === "veo" && usesNewApiVeoTask(state.settings.videoModel) && defaultLike) return "/v1/video/generations";
  if (profile?.provider === "veo" && resolveVideoApiStyle(profile) === "gemini" && defaultLike) {
    const modelId = String(state.settings.videoModel || "").replace(/^models\//, "");
    return `/v1beta/models/${encodeURIComponent(modelId)}:predictLongRunning`;
  }
  return endpoint;
}

function videoTaskParams() {
  const settings = state.settings;
  const duration = effectiveVideoDuration(settings.videoModel);
  if (isGrokImagine15Model(settings.videoModel)) {
    return {
      aspectRatio: effectiveVideoAspectRatio(settings.videoModel),
      duration: `${duration}s`,
    };
  }
  return {
    aspectRatio: effectiveVideoAspectRatio(settings.videoModel),
    resolution: effectiveVideoResolution(settings.videoModel),
    duration: duration === -1 ? "自动" : `${duration}s`,
    count: isSeedance2Model(settings.videoModel) ? effectiveVideoCount(settings.videoModel) : undefined,
    style: settings.videoStyle,
    audio: effectiveVideoAudio(settings.videoModel) ? "开" : "关",
  };
}

function buildVideoReferences() {
  const refs = [];
  if (draftMedia.firstFrame) refs.push({ role: "first_frame", ...mediaPayload(draftMedia.firstFrame) });
  if (draftMedia.lastFrame) refs.push({ role: "last_frame", ...mediaPayload(draftMedia.lastFrame) });
  draftMedia.videoImages.forEach((item) => refs.push({ role: "reference_image", ...mediaPayload(item) }));
  draftMedia.videoReferences.forEach((item) => refs.push({ role: "reference_video", ...mediaPayload(item) }));
  if (draftMedia.audio) refs.push({ role: "audio", ...mediaPayload(draftMedia.audio) });
  return refs;
}

function videoReferenceMeta() {
  const refs = [];
  if (draftMedia.firstFrame) refs.push({ role: "首帧", ...mediaMeta(draftMedia.firstFrame) });
  if (draftMedia.lastFrame) refs.push({ role: "尾帧", ...mediaMeta(draftMedia.lastFrame) });
  draftMedia.videoImages.forEach((item) => refs.push({ role: "参考图", ...mediaMeta(item) }));
  draftMedia.videoReferences.forEach((item) => refs.push({ role: "参考视频", ...mediaMeta(item) }));
  if (draftMedia.audio) refs.push({ role: "音频", ...mediaMeta(draftMedia.audio) });
  return refs;
}

function buildVisualContextPrompt(prompt) {
  if (!isVisualContextEnabled()) return prompt;
  const turns = clampNumber(state.settings.visualContextTurns, 1, 10, 4);
  const previous = state.visualTasks
    .filter((task) => task.sessionId === activeVisualSessionId && task.prompt && task.status !== "error")
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
    .slice(-turns);
  if (!previous.length) return prompt;
  const history = previous
    .map((task, index) => `${index + 1}. [${task.type === "video" ? "视频" : "图片"}] ${task.prompt}`)
    .join("\n");
  return [
    "延续同一视觉创作会话，保持主体身份、场景设定、色彩和视觉风格的一致性。",
    "已有创作上下文：",
    history,
    "当前创作要求：",
    prompt,
  ].join("\n");
}

function isVisualContextEnabled() {
  const session = state.visualSessions?.find((item) => item.id === activeVisualSessionId);
  return session?.contextEnabled ?? !!state.settings.visualContext;
}

async function pollVideoTask(taskId, options = {}) {
  const task = state.visualTasks.find((item) => item.id === taskId);
  if (!task?.jobId) return;
  if (activeVideoPolls.has(taskId)) return;
  const attempts = clampNumber(options.attempts, 1, 240, 120);
  activeVideoPolls.add(taskId);
  try {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (!(options.immediate && attempt === 0)) await wait(attempt === 0 ? 3000 : 5000);
    const current = state.visualTasks.find((item) => item.id === taskId);
    if (!current || current.status === "done" || current.status === "error") return;
    const result = await refreshVideoTaskOnce(current);
    if (result !== "pending") return;
  }
  } finally {
    activeVideoPolls.delete(taskId);
  }
}

async function refreshVideoTaskOnce(task) {
  try {
    const endpointTemplate = videoStatusEndpointForTask(task);
    const endpoint = endpointTemplate.replace("{id}", encodeVideoTaskId(task.jobId, task));
    const response = await fetch(apiUrl(endpoint), {
      headers: videoStatusHeadersForTask(task),
    });
    task.lastCheckedAt = Date.now();
    if (!response.ok) {
      task.lastPollError = await responseError(response);
      if (failMissingVideoTaskAfterRetries(task, task.lastPollError)) return "failed";
      saveState();
      renderImages();
      return "pending";
    }
    const data = await response.json();
    const payloadError = extractErrorMessage(data);
    if (failMissingVideoTaskAfterRetries(task, payloadError)) return "failed";
    task.missingTaskPolls = 0;
    const media = extractVideoUrls(data);
    const status = extractTaskStatus(data);
    task.rawStatus = status || task.rawStatus;
    task.lastPollError = "";
    if (media.length) {
      task.media = media;
      task.status = "done";
      saveState();
      renderImages();
      showToast("视频结果已返回");
      return "done";
    }
    const normalizedStatus = String(status || "").toLowerCase();
    if (["failed", "failure", "error", "cancelled", "canceled", "rejected"].includes(normalizedStatus)) {
      task.status = "error";
      task.error = extractErrorMessage(data) || "视频任务失败";
      saveState();
      renderImages();
      showToast(task.error, true);
      return "failed";
    }
    if (["succeeded", "success", "completed", "complete", "finished", "done"].includes(normalizedStatus)) {
      task.status = "empty";
      task.error = "视频任务已完成，但状态接口未返回可播放的视频链接。";
      saveState();
      renderImages();
      showToast(task.error, true);
      return "failed";
    }
    task.status = "submitted";
    saveState();
    renderImages();
    return "pending";
  } catch (error) {
    task.lastPollError = normalizeError(error);
    saveState();
    renderImages();
    return "pending";
  }
}

function failMissingVideoTaskAfterRetries(task, message) {
  if (!/task[_ ]?not[_ ]?exist|任务不存在/i.test(String(message || ""))) return false;
  task.missingTaskPolls = (task.missingTaskPolls || 0) + 1;
  task.lastPollError = message;
  if (!shouldStopMissingVideoTaskPolling(task.missingTaskPolls)) return false;
  task.status = "error";
  task.error = "视频任务已创建，但 DeepRouter 查询接口未映射该任务 ID（task_not_exist）";
  saveState();
  renderImages();
  showToast(task.error, true);
  return true;
}

function shouldStopMissingVideoTaskPolling(attempts) {
  return Number(attempts) >= MISSING_VIDEO_TASK_RETRY_LIMIT;
}

function videoStatusEndpointForTask(task) {
  const endpoint = state.settings.videoStatusEndpoint || DEFAULT_SETTINGS.videoStatusEndpoint;
  const defaultLike = !endpoint || endpoint === DEFAULT_SETTINGS.videoStatusEndpoint || endpoint === "/v1/videos/{id}";
  if (task?.provider === "xai" && defaultLike) return "/v1/videos/{id}";
  if (task?.provider === "sora" && defaultLike) return "/v1/videos/{id}";
  if (task?.provider === "seedance" && task.requestEndpoint === "/api/v3/contents/generations/tasks" && defaultLike) {
    return "/api/v3/contents/generations/tasks/{id}";
  }
  if (task?.provider === "seedance" && defaultLike) return "/v1/video/generations/{id}";
  if (task?.provider === "veo" && task.requestEndpoint === "/v1/videos" && defaultLike) return "/v1/videos/{id}";
  if (task?.provider === "veo" && task.requestEndpoint === "/v1/video/generations" && defaultLike) {
    return "/v1/video/generations/{id}";
  }
  if (task?.provider === "veo" && defaultLike) return "/v1beta/{id}";
  return endpoint;
}

function videoStatusHeadersForTask(task) {
  if (task?.provider === "xai") {
    return isGrokJsonVideoEndpoint(task.requestEndpoint) && !isDeepRouterBaseUrl()
      ? authHeaders()
      : { ...rawAuthHeaders(), "Content-Type": "application/json" };
  }
  if (task?.provider === "veo" && task.requestEndpoint === "/v1/videos") {
    return rawAuthHeaders();
  }
  return authHeaders(false);
}

function encodeVideoTaskId(jobId, task) {
  const value = String(jobId || "").replace(/^\/+/, "");
  if (task?.provider !== "veo") return encodeURIComponent(value);
  return value.replace(/^v1beta\//, "").split("/").map(encodeURIComponent).join("/");
}

function resumeVideoPolling() {
  state.visualTasks
    .filter((task) => task.type === "video" && task.jobId && ["running", "submitted"].includes(task.status))
    .forEach((task) => pollVideoTask(task.id, { attempts: 120 }));
}

function resumeImagePolling() {
  let changed = false;
  state.visualTasks
    .filter((task) => task.type === "image" && ["running", "submitted"].includes(task.status))
    .forEach((task) => {
      task.status = "error";
      task.error = "页面刷新中断了图片响应，请重新生成。";
      changed = true;
    });
  if (changed) {
    saveState();
    renderImages();
  }
}

function renderImages() {
  const visualMode = state.settings.visualMode;
  const tasks = state.visualTasks
    .filter((task) => task.sessionId === activeVisualSessionId)
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  els.imageGrid.innerHTML = "";
  els.imageHistory.innerHTML = "";
  els.taskCount.textContent = String(tasks.length);
  els.imageEmpty.hidden = tasks.length > 0;
  els.visualEmptyText.textContent =
    visualMode === "video"
      ? isGrokVideoModel(state.settings.videoModel)
        ? "输入镜头描述生成视频，或上传参考图进行图生视频。"
        : "输入镜头描述，可上传首帧、尾帧、参考视频或音频。"
      : "输入画面描述，或上传参考图进行图生图。";

  tasks.forEach((task) => {
    els.imageGrid.appendChild(renderVisualTask(task));
    els.imageHistory.prepend(renderHistoryItem(task));
  });
  requestAnimationFrame(() => {
    els.visualCanvas.scrollTop = els.visualCanvas.scrollHeight;
  });
}

function renderVisualTask(task) {
  const card = document.createElement("article");
  card.className = `visual-task ${task.type} status-${task.status}`;
  const header = document.createElement("div");
  header.className = "visual-task-header";
  header.innerHTML = `
    <div>
      <div class="task-model">${escapeHtml(task.model || "")}</div>
      <div class="task-meta">${escapeHtml(statusLabel(task.status))} · ${escapeHtml(formatTime(task.createdAt))}</div>
    </div>
    <span class="task-type">${task.type === "video" ? "视频" : "图片"}</span>
  `;
  card.appendChild(header);

  const prompt = document.createElement("div");
  prompt.className = "task-prompt";
  prompt.textContent = task.prompt || "";
  card.appendChild(prompt);

  const mediaWrap = document.createElement("div");
  mediaWrap.className = "task-media-grid";
  if (task.status === "running" || task.status === "submitted") {
    mediaWrap.appendChild(renderLoadingMedia(task));
  } else if (task.status === "error" || task.status === "stopped" || task.status === "empty") {
    const error = document.createElement("div");
    error.className = "task-error";
    error.textContent = task.error || (task.status === "empty" ? "接口未返回媒体结果" : statusLabel(task.status));
    mediaWrap.appendChild(error);
  } else {
    (task.media || []).forEach((src) => mediaWrap.appendChild(task.type === "video" ? renderVideo(src, task) : renderImage(src, task)));
  }
  card.appendChild(mediaWrap);

  const params = document.createElement("div");
  params.className = "task-param-row";
  Object.entries(task.params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    const chip = document.createElement("span");
    chip.textContent = `${paramLabel(key)} ${value}`;
    params.appendChild(chip);
  });
  if (task.contextApplied) {
    const contextChip = document.createElement("span");
    contextChip.textContent = "已应用上下文";
    contextChip.className = "context-param";
    params.appendChild(contextChip);
  }
  card.appendChild(params);

  if (task.type === "video" && task.jobId && task.status !== "done") {
    const actions = document.createElement("div");
    actions.className = "task-actions";
    actions.innerHTML = `
      <button class="mini-button" type="button" data-refresh-video="${escapeAttr(task.id)}">刷新结果</button>
      <span>${escapeHtml(taskStatusDetail(task))}</span>
    `;
    card.appendChild(actions);
  }
  if (Array.isArray(task.references) && task.references.length) {
    const refs = document.createElement("div");
    refs.className = "task-references";
    refs.textContent = task.references.map((item) => `${item.role ? `${item.role}:` : ""}${item.name}`).join(" / ");
    card.appendChild(refs);
  }

  if (!["running", "submitted"].includes(task.status)) {
    const controls = document.createElement("div");
    controls.className = "task-command-row";

    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "mini-button";
    retry.textContent = "重试";
    retry.addEventListener("click", () => retryVisualTask(task.id));
    controls.appendChild(retry);

    const armKey = `visual-task:${task.id}`;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = `mini-button task-delete${deleteArmed === armKey ? " armed" : ""}`;
    remove.textContent = deleteArmed === armKey ? "确认删除" : "删除";
    remove.addEventListener("click", () => deleteVisualTask(task.id));
    controls.appendChild(remove);
    card.appendChild(controls);
  }

  return card;
}

function renderLoadingMedia(task) {
  const loading = document.createElement("div");
  loading.className = "task-loading";
  loading.innerHTML = `
    <div class="loader-dot"></div>
    <strong>${task.status === "submitted" ? "任务已提交" : "生成中"}</strong>
    <span>${escapeHtml(task.requestMode || task.model || "")}</span>
    <small>${escapeHtml(taskStatusDetail(task))}</small>
  `;
  return loading;
}

function renderImage(src, task) {
  const wrap = document.createElement("div");
  wrap.className = "generated-media-item";
  const link = document.createElement("button");
  link.type = "button";
  link.className = "generated-media generated-image";
  const img = document.createElement("img");
  img.src = src;
  img.alt = task.prompt || "生成图片";
  link.appendChild(img);
  link.addEventListener("click", () => openMediaViewer(src, "image", task));
  wrap.appendChild(link);
  wrap.appendChild(renderContinueButton(src, "image", task));
  wrap.appendChild(renderImageToVideoButton(src, task));
  return wrap;
}

function renderVideo(src, task) {
  const wrap = document.createElement("div");
  wrap.className = "generated-media generated-video";
  const video = document.createElement("video");
  video.src = src;
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.title = task.prompt || "生成视频";
  wrap.appendChild(video);
  const open = document.createElement("button");
  open.type = "button";
  open.className = "media-open";
  open.textContent = "放大";
  open.addEventListener("click", () => openMediaViewer(src, "video", task));
  wrap.appendChild(open);
  wrap.appendChild(renderContinueButton(src, "video", task));
  return wrap;
}

function renderContinueButton(src, type, task) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "media-continue";
  button.textContent = "继续创作";
  button.title = type === "image" ? "将此图片追加到下一次创作的参考图" : "将此视频作为下一次创作的参考视频";
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    continueFromVisualResult(task.id, src, type);
  });
  return button;
}

function renderImageToVideoButton(src, task) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "media-to-video";
  button.textContent = "生成视频";
  button.title = "将此图片作为视频生成的参考图";
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    continueFromImageToVideo(task.id, src);
  });
  return button;
}

function openMediaViewer(src, type, task) {
  viewerZoom = 1;
  els.viewerTitle.textContent = task?.prompt || (type === "video" ? "视频预览" : "图片预览");
  els.viewerDownload.href = src;
  els.viewerDownload.download = `${type}-${task?.id || Date.now()}`;
  els.viewerImage.hidden = type !== "image";
  els.viewerVideo.hidden = type !== "video";
  if (type === "image") {
    els.viewerImage.src = src;
    els.viewerVideo.removeAttribute("src");
  } else {
    els.viewerVideo.src = src;
    els.viewerImage.removeAttribute("src");
  }
  setViewerZoom(1);
  if (typeof els.mediaViewer.showModal === "function") els.mediaViewer.showModal();
  else els.mediaViewer.setAttribute("open", "");
}

function closeMediaViewer() {
  els.viewerVideo.pause();
  els.viewerVideo.removeAttribute("src");
  if (typeof els.mediaViewer.close === "function") els.mediaViewer.close();
  else els.mediaViewer.removeAttribute("open");
}

function setViewerZoom(value) {
  viewerZoom = clampNumber(value, 0.5, 4, 1);
  const transform = `scale(${viewerZoom})`;
  els.viewerImage.style.transform = transform;
  els.viewerVideo.style.transform = transform;
  els.viewerZoomLabel.textContent = `${Math.round(viewerZoom * 100)}%`;
}

function renderHistoryItem(task) {
  const item = document.createElement("button");
  item.type = "button";
  item.className = "history-item";
  item.innerHTML = `
    <div class="history-prompt">${escapeHtml(task.prompt)}</div>
    <div class="history-meta">${escapeHtml(statusLabel(task.status))} · ${escapeHtml(task.model || "")} · ${escapeHtml(formatTime(task.createdAt))}</div>
  `;
  item.addEventListener("click", () => {
    state.settings.visualMode = task.type || "image";
    activeMode = "image";
    activeVisualSessionId = task.sessionId || activeVisualSessionId;
    els.promptInput.value = task.prompt || "";
    autoResizePrompt();
    saveState();
    render();
  });
  return item;
}

async function retryVisualTask(taskId) {
  if (abortController) {
    showToast("当前任务完成后再重试", true);
    return;
  }
  const task = state.visualTasks.find((item) => item.id === taskId);
  if (!task) return;
  if (!ensureApiReady()) return;

  activeMode = "image";
  activeVisualSessionId = task.sessionId || activeVisualSessionId;
  applyVisualTaskSettings(task);
  els.promptInput.value = task.prompt || "";
  autoResizePrompt();
  saveState();
  render();

  const needsReferences = Array.isArray(task.references) && task.references.length > 0;
  const hasReferences = task.type === "image" ? draftMedia.imageReferences.length > 0 : videoDraftReferenceCount() > 0;
  if (needsReferences && !hasReferences) {
    showToast("原任务使用了参考素材，请重新添加后再生成", true);
    els.promptInput.focus();
    return;
  }

  if (task.type === "video") await generateVideo(task.prompt || "");
  else await generateImage(task.prompt || "");
}

function applyVisualTaskSettings(task) {
  const params = task.params || {};
  state.settings.visualMode = task.type === "video" ? "video" : "image";
  if (task.type === "video") {
    if (task.model) state.settings.videoModel = task.model;
    if (params.aspectRatio) state.settings.videoAspectRatio = params.aspectRatio;
    if (params.resolution) state.settings.videoResolution = params.resolution;
    if (params.duration) {
      state.settings.videoDuration = params.duration === "自动"
        ? -1
        : clampNumber(parseInt(params.duration, 10), 1, 30, state.settings.videoDuration);
    }
    if (params.count) state.settings.videoCount = clampNumber(params.count, 1, 8, state.settings.videoCount);
    if (params.style) state.settings.videoStyle = params.style;
    if (params.audio) state.settings.videoAudio = params.audio === "开" || params.audio === true;
  } else {
    if (task.model) state.settings.imageModel = task.model;
    if (params.aspectRatio) state.settings.imageAspectRatio = params.aspectRatio;
    if (params.size) state.settings.imageSize = params.size;
    if (params.quality) state.settings.imageQuality = params.quality;
    if (params.style) state.settings.imageStyle = params.style;
    if (params.count) state.settings.imageCount = clampNumber(params.count, 1, 4, state.settings.imageCount);
  }
  if (task.model) state.modelOptions = unique([task.model, ...state.modelOptions]);
}

function videoDraftReferenceCount() {
  return (
    draftMedia.videoImages.length +
    draftMedia.videoReferences.length +
    Number(Boolean(draftMedia.firstFrame)) +
    Number(Boolean(draftMedia.lastFrame)) +
    Number(Boolean(draftMedia.audio))
  );
}

async function continueFromVisualResult(taskId, src, type) {
  if (abortController) {
    showToast("当前任务完成后再继续创作", true);
    return;
  }
  const task = state.visualTasks.find((item) => item.id === taskId);
  if (!task || !src) return;

  showToast("正在载入生成结果");
  try {
    const media = await generatedResultToMedia(src, type, task);
    activeMode = "image";
    activeVisualSessionId = task.sessionId || activeVisualSessionId;
    applyVisualTaskSettings(task);
    if (type === "video") {
      draftMedia = createEmptyDraftMedia();
      state.settings.visualMode = "video";
      draftMedia.videoReferences = [media];
    } else {
      state.settings.visualMode = "image";
      draftMedia.imageReferences = uniqueMedia([...draftMedia.imageReferences, media]).slice(0, 8);
      syncImageModeFromReferences();
    }
    saveState();
    render();
    els.promptInput.value = task.prompt || "";
    autoResizePrompt();
    els.promptInput.focus();
    showToast(type === "video" ? "已将结果加入参考视频" : `已加入参考图（${draftMedia.imageReferences.length}/8）`);
  } catch (error) {
    const message = error?.message === "Failed to fetch"
      ? "无法读取该结果，图片地址可能已过期或不允许跨域下载"
      : normalizeError(error);
    showToast(message, true);
  }
}

async function continueFromImageToVideo(taskId, src) {
  if (abortController) {
    showToast("当前任务完成后再生成视频", true);
    return;
  }
  const task = state.visualTasks.find((item) => item.id === taskId);
  if (!task || !src) return;

  showToast("正在载入图片参考");
  try {
    const media = await generatedResultToMedia(src, "image", task);
    activeMode = "image";
    activeVisualSessionId = task.sessionId || activeVisualSessionId;
    draftMedia = createEmptyDraftMedia();
    syncImageModeFromReferences();
    state.settings.visualMode = "video";
    draftMedia.videoImages = [media];
    saveState();
    render();
    els.promptInput.value = task.prompt || "";
    autoResizePrompt();
    els.promptInput.focus();
    showToast("已将图片加入视频参考图");
  } catch (error) {
    const message = error?.message === "Failed to fetch"
      ? "无法读取该图片，地址可能已过期或不允许跨域下载"
      : normalizeError(error);
    showToast(message, true);
  }
}

async function generatedResultToMedia(src, type, task) {
  const response = await fetch(src);
  if (!response.ok) throw new Error(`读取生成结果失败：${response.status}`);
  const blob = await response.blob();
  if (!blob.size) throw new Error("生成结果内容为空");
  if (blob.type === "text/html") throw new Error("生成结果地址已失效");
  if (blob.size > 100 * 1024 * 1024) throw new Error("生成结果超过 100MB，无法作为参考素材");
  const fallbackMime = type === "video" ? "video/mp4" : "image/png";
  const mime = blob.type || fallbackMime;
  const extension = mediaExtension(mime, type);
  const name = `${type === "video" ? "video" : "image"}-${String(task.id || Date.now()).slice(-8)}.${extension}`;
  const file = new File([blob], name, { type: mime });
  return readMediaFile(file);
}

function mediaExtension(mime, type) {
  const extensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
  };
  return extensions[String(mime || "").toLowerCase()] || (type === "video" ? "mp4" : "png");
}

function deleteVisualTask(taskId) {
  const armKey = `visual-task:${taskId}`;
  if (deleteArmed !== armKey) {
    deleteArmed = armKey;
    renderImages();
    setTimeout(() => {
      if (deleteArmed === armKey) {
        deleteArmed = null;
        renderImages();
      }
    }, 3000);
    return;
  }

  const task = state.visualTasks.find((item) => item.id === taskId);
  cancelImageRequest(taskId);
  state.visualTasks = state.visualTasks.filter((item) => item.id !== taskId);
  void deleteVisualMediaCacheForTask(taskId);
  deleteArmed = null;
  const session = state.visualSessions.find((item) => item.id === task?.sessionId);
  if (session) session.updatedAt = Date.now();
  saveState();
  renderImages();
  renderSessions();
  showToast("视觉任务已删除");
}

function clearVisualTasks() {
  const removedTaskIds = state.visualTasks.filter((task) => task.sessionId === activeVisualSessionId).map((task) => task.id);
  removedTaskIds.forEach(cancelImageRequest);
  state.visualTasks = state.visualTasks.filter((task) => task.sessionId !== activeVisualSessionId);
  removedTaskIds.forEach((taskId) => void deleteVisualMediaCacheForTask(taskId));
  saveState();
  renderImages();
}

function renderVisualMeta() {
  const visualMode = state.settings.visualMode;
  const modelId = visualMode === "video" ? state.settings.videoModel : state.settings.imageModel;
  const profile = getModelProfile(modelId);
  els.visualPanelTitle.textContent = visualMode === "video" ? "视频生成" : "图片生成";
  els.visualPanelSubtitle.textContent =
    visualMode === "video"
      ? `适配 SeedDance、Grok、Veo 等视频模型；${isVisualContextEnabled() ? "当前会话已启用上下文。" : "当前会话未启用上下文。"}`
      : `支持文生图、图生图和参考图；${isVisualContextEnabled() ? "当前会话已启用上下文。" : "当前会话未启用上下文。"}`;
  els.visualRequestHint.textContent = visualMode === "video" ? videoModeLabel(profile) : imageModeLabel(profile);
  els.modelSummary.innerHTML = renderModelSummary(profile, modelId, visualMode);
}

function renderModelSummary(profile, modelId, visualMode) {
  const params =
    visualMode === "video"
      ? [
          ["比例", effectiveVideoAspectRatio(modelId)],
          ["清晰度", effectiveVideoResolution(modelId)],
          ["时长", effectiveVideoDuration(modelId) === -1 ? "自动" : `${effectiveVideoDuration(modelId)}s`],
          ...(isSeedance2Model(modelId) ? [["数量", effectiveVideoCount(modelId)]] : []),
          ["风格", state.settings.videoStyle],
          ["音频", effectiveVideoAudio(modelId) ? "开" : "关"],
        ]
      : [
          ["模式", imageGenerationModeForReferences() === "image-to-image" ? "图生图" : "文生图"],
          ["比例", effectiveImageAspectRatio(modelId)],
          ["尺寸", effectiveImageOutputSize(modelId)],
          ["质量", state.settings.imageQuality],
          ["风格", state.settings.imageStyle],
        ];
  params.push(["上下文", isVisualContextEnabled() ? `最近 ${state.settings.visualContextTurns} 次` : "关闭"]);
  return `
    <div class="model-name">${escapeHtml(profile?.label || modelId || "未选择模型")}</div>
    <div class="model-provider">${escapeHtml(profile?.vendor || "自定义模型")} · ${visualMode === "video" ? "视频" : "图片"}</div>
    <div class="capability-row">${(profile?.capabilities || ["自定义"]).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
    <details class="model-advanced">
      <summary>高级参数</summary>
      <div class="model-param-list">
        ${params.map(([key, value]) => `<div><span>${escapeHtml(key)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
      </div>
    </details>
  `;
}

async function handleReferenceFiles(event, kind) {
  const files = Array.from(event.target.files || []);
  event.target.value = "";
  if (!files.length) return;
  try {
    const items = await Promise.all(files.map((file) => readMediaFile(file)));
    if (kind === "image-reference") {
      if (state.settings.visualMode === "video") {
        draftMedia.videoImages = uniqueMedia([...draftMedia.videoImages, ...items]).slice(0, 6);
      } else {
        draftMedia.imageReferences = uniqueMedia([...draftMedia.imageReferences, ...items]).slice(0, 8);
        syncImageModeFromReferences();
      }
    } else if (kind === "video-reference") {
      draftMedia.videoReferences = uniqueMedia([...draftMedia.videoReferences, ...items]).slice(0, 3);
      state.settings.visualMode = "video";
    } else if (kind === "first-frame") {
      draftMedia.firstFrame = items[0];
      state.settings.visualMode = "video";
    } else if (kind === "last-frame") {
      draftMedia.lastFrame = items[0];
      state.settings.visualMode = "video";
    } else if (kind === "audio") {
      draftMedia.audio = items[0];
      state.settings.visualMode = "video";
    }
    activeMode = "image";
    saveState();
    render();
  } catch (error) {
    showToast(normalizeError(error), true);
  }
}

function readMediaFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: generateId(),
        name: file.name,
        mime: file.type || "application/octet-stream",
        size: file.size,
        dataUrl: String(reader.result || ""),
        file,
      });
    };
    reader.onerror = () => reject(new Error(`读取文件失败：${file.name}`));
    reader.readAsDataURL(file);
  });
}

async function handleChatAttachmentFiles(event) {
  const files = Array.from(event.target.files || []);
  event.target.value = "";
  if (!files.length) return;
  try {
    const oversized = files.find((file) => file.size > 25 * 1024 * 1024);
    if (oversized) throw new Error(`文件不能超过 25MB：${oversized.name}`);
    const items = await Promise.all(files.map((file) => readChatAttachment(file)));
    chatAttachments = uniqueMedia([...chatAttachments, ...items]).slice(0, 8);
    renderChatAttachments();
  } catch (error) {
    showToast(normalizeError(error), true);
  }
}

async function readChatAttachment(file) {
  const item = await readMediaFile(file);
  if (isTextAttachment(file)) {
    item.text = await file.text();
  }
  return item;
}

function isTextAttachment(file) {
  return (
    file.type.startsWith("text/") ||
    /\.(txt|md|csv|json|xml|yaml|yml|log|js|ts|jsx|tsx|css|html|py|go|rs|java|c|cpp|h|sql)$/i.test(file.name)
  );
}

function renderChatAttachments() {
  if (!els.chatAttachmentTray) return;
  els.chatAttachmentTray.hidden = activeMode === "image" || !chatAttachments.length;
  els.chatAttachmentTray.innerHTML = chatAttachments
    .map((item) => `
      <div class="draft-media chat-attachment">
        ${item.mime.startsWith("image/") ? `<img src="${escapeAttr(item.dataUrl)}" alt="">` : `<span class="draft-file-icon">${escapeHtml(fileTypeLabel(item.mime))}</span>`}
        <span>${escapeHtml(trimFileName(item.name))}</span>
        <button type="button" aria-label="移除" data-remove-chat-attachment="${escapeAttr(item.id)}">×</button>
      </div>
    `)
    .join("");
}

function renderDraftMediaTray() {
  const items = [];
  if (activeMode !== "image") {
    els.draftMediaTray.hidden = true;
    return;
  }
  if (state.settings.visualMode === "image") {
    draftMedia.imageReferences.forEach((item) => items.push({ key: "imageReferences", label: "参考图", item }));
  } else {
    if (draftMedia.firstFrame) items.push({ key: "firstFrame", label: "首帧", item: draftMedia.firstFrame });
    if (draftMedia.lastFrame) items.push({ key: "lastFrame", label: "尾帧", item: draftMedia.lastFrame });
    draftMedia.videoImages.forEach((item) => items.push({ key: "videoImages", label: "参考图", item }));
    draftMedia.videoReferences.forEach((item) => items.push({ key: "videoReferences", label: "参考视频", item }));
    if (draftMedia.audio) items.push({ key: "audio", label: "音频", item: draftMedia.audio });
  }
  els.draftMediaTray.hidden = !items.length;
  els.draftMediaTray.innerHTML = items
    .map(({ key, label, item }) => {
      const isImage = item.mime.startsWith("image/");
      return `
        <div class="draft-media">
          ${isImage ? `<img src="${escapeAttr(item.dataUrl)}" alt="">` : `<span class="draft-file-icon">${escapeHtml(fileTypeLabel(item.mime))}</span>`}
          <span>${escapeHtml(label)} · ${escapeHtml(trimFileName(item.name))}</span>
          <button type="button" aria-label="移除" data-remove-media="${escapeAttr(key)}" data-media-id="${escapeAttr(item.id)}">×</button>
        </div>
      `;
    })
    .join("");
}

function removeDraftMedia(key, id) {
  if (Array.isArray(draftMedia[key])) {
    draftMedia[key] = draftMedia[key].filter((item) => item.id !== id);
  } else if (draftMedia[key]?.id === id) {
    draftMedia[key] = null;
  }
  syncImageModeFromReferences();
  saveState();
  renderDraftMediaTray();
  renderOutputOptions();
  renderVisualMeta();
}

function imageGenerationModeForReferences(references = draftMedia.imageReferences) {
  return Array.isArray(references) && references.length ? "image-to-image" : "text-to-image";
}

function syncImageModeFromReferences(references = draftMedia.imageReferences) {
  state.settings.imageMode = imageGenerationModeForReferences(references);
  return state.settings.imageMode;
}

function stopRequest() {
  if (abortController) {
    abortController.abort();
    return;
  }
  if (activeMode !== "image" || state.settings.visualMode !== "image") return;
  const imageRequestCount = activeImageRequests.size;
  activeImageRequests.forEach((controller) => controller.abort());
  if (imageRequestCount) showToast(`已停止 ${imageRequestCount} 个图片任务`);
}

function setLoading(loading) {
  els.sendButton.disabled = loading;
  const imageRequestsVisible = activeMode === "image" && state.settings.visualMode === "image" && activeImageRequests.size > 0;
  els.stopButton.hidden = !loading && !imageRequestsVisible;
  els.stopButton.title = imageRequestsVisible ? `停止 ${activeImageRequests.size} 个图片任务` : "停止";
  els.sendButton.textContent = loading ? "发送中" : activeMode === "image" ? (state.settings.visualMode === "video" ? "生成视频" : "生成图片") : "发送";
}

function syncImageRequestControls() {
  if (abortController || activeMode !== "image" || state.settings.visualMode !== "image") return;
  setLoading(false);
}

function cancelImageRequest(taskId) {
  activeImageRequests.get(taskId)?.abort();
}

function openSettings(tab = "api") {
  closeMobileSidebar();
  const requestedTab = ["api", "models", "advanced"].includes(tab) ? tab : "api";
  if (els.settingsDialog.open) {
    setSettingsTab(requestedTab);
    return;
  }
  syncSettingsForm();
  settingsFormSnapshot = serializeSettingsForm();
  hideUnsavedSettingsPrompt();
  setSettingsTab(requestedTab);
  els.apiKey.type = "password";
  els.toggleApiKey.textContent = "显示";
  els.toggleApiKey.setAttribute("aria-pressed", "false");
  if (typeof els.settingsDialog.showModal === "function") els.settingsDialog.showModal();
  else els.settingsDialog.setAttribute("open", "");
}

function closeSettings(event) {
  event?.preventDefault();
  requestSettingsClose();
}

function requestSettingsClose() {
  if (!els.settingsDialog.open) return;
  if (serializeSettingsForm() !== settingsFormSnapshot) {
    els.unsavedSettingsPrompt.hidden = false;
    requestAnimationFrame(() => els.cancelSettingsClose.focus());
    return;
  }
  closeSettingsDirect();
}

function closeSettingsDirect() {
  hideUnsavedSettingsPrompt();
  if (typeof els.settingsDialog.close === "function") els.settingsDialog.close();
  else els.settingsDialog.removeAttribute("open");
}

function hideUnsavedSettingsPrompt() {
  if (els.unsavedSettingsPrompt) els.unsavedSettingsPrompt.hidden = true;
}

function setSettingsTab(tab) {
  activeSettingsTab = ["api", "models", "advanced"].includes(tab) ? tab : "api";
  els.settingsDialog.querySelectorAll("[data-settings-tab]").forEach((button) => {
    const active = button.dataset.settingsTab === activeSettingsTab;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
  els.settingsDialog.querySelectorAll("[data-settings-section]").forEach((section) => {
    const active = section.dataset.settingsSection === activeSettingsTab;
    section.hidden = !active;
    section.classList.toggle("active", active);
  });
}

function toggleApiKeyVisibility() {
  const visible = els.apiKey.type === "text";
  els.apiKey.type = visible ? "password" : "text";
  els.toggleApiKey.textContent = visible ? "显示" : "隐藏";
  els.toggleApiKey.setAttribute("aria-pressed", String(!visible));
}

function settingsFormValues() {
  return {
    baseUrl: els.baseUrl.value,
    apiKey: els.apiKey.value,
    chatModel: els.chatModel.value,
    imageModel: els.imageModel.value,
    videoModel: els.videoModel.value,
    temperature: els.temperature.value,
    contextTurns: els.contextTurns.value,
    visualContextTurns: els.visualContextTurns.value,
    imageApiStyle: els.imageApiStyle.value,
    videoApiStyle: els.videoApiStyle.value,
    imageEndpoint: els.imageEndpoint.value,
    imageEditEndpoint: els.imageEditEndpoint.value,
    videoEndpoint: els.videoEndpoint.value,
    videoStatusEndpoint: els.videoStatusEndpoint.value,
    systemPrompt: els.systemPrompt.value,
  };
}

function serializeSettingsForm() {
  return JSON.stringify(settingsFormValues());
}

function syncSettingsForm() {
  const settings = state.settings;
  fillGroupedModelSelect(els.chatModel, "chat", settings.chatModel);
  fillGroupedModelSelect(els.imageModel, "image", settings.imageModel);
  fillGroupedModelSelect(els.videoModel, "video", settings.videoModel);
  els.baseUrl.value = settings.baseUrl || "";
  els.apiKey.value = settings.apiKey || "";
  els.chatModel.value = settings.chatModel || "";
  els.imageModel.value = settings.imageModel || "";
  els.videoModel.value = settings.videoModel || "";
  els.temperature.value = settings.temperature;
  els.contextTurns.value = settings.contextTurns;
  els.visualContextTurns.value = settings.visualContextTurns;
  els.imageApiStyle.value = settings.imageApiStyle || "auto";
  els.videoApiStyle.value = settings.videoApiStyle || "auto";
  els.imageEndpoint.value = settings.imageEndpoint || DEFAULT_SETTINGS.imageEndpoint;
  els.imageEditEndpoint.value = settings.imageEditEndpoint || DEFAULT_SETTINGS.imageEditEndpoint;
  els.videoEndpoint.value = settings.videoEndpoint || DEFAULT_SETTINGS.videoEndpoint;
  els.videoStatusEndpoint.value = settings.videoStatusEndpoint || DEFAULT_SETTINGS.videoStatusEndpoint;
  els.systemPrompt.value = settings.systemPrompt || "";
  els.modelOptions.innerHTML = unique(state.modelOptions).map((model) => `<option value="${escapeAttr(model)}"></option>`).join("");
}

function fillGroupedModelSelect(select, type, current) {
  const models = selectableModelRecords(type, current);
  const groups = groupBy(models, (item) => item.vendor || "其他");
  select.innerHTML = "";
  Object.entries(groups).forEach(([vendor, items]) => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = `${vendor} · ${modelTypeLabel(type)}`;
    items.forEach((model) => {
      const option = document.createElement("option");
      option.value = model.id;
      option.textContent = model.label && model.label !== model.id ? `${model.label} (${model.id})` : model.id;
      optgroup.appendChild(option);
    });
    select.appendChild(optgroup);
  });
  select.value = current || "";
}

function modelTypeLabel(type) {
  if (type === "video") return "视频";
  if (type === "image") return "图片";
  return "语言";
}

function openModelPicker() {
  modelPickerType = activeMode === "image" ? state.settings.visualMode : "chat";
  const current = currentModelForType(modelPickerType);
  const records = selectableModelRecords(modelPickerType, current);
  const currentRecord = records.find((item) => item.id === current);
  activeModelVendor = currentRecord?.vendor || records[0]?.vendor || "";
  els.modelSearch.value = "";
  renderModelPicker();
  if (typeof els.modelPicker.showModal === "function") els.modelPicker.showModal();
  else els.modelPicker.setAttribute("open", "");
  requestAnimationFrame(() => els.modelSearch.focus());
}

function closeModelPicker() {
  if (typeof els.modelPicker.close === "function") els.modelPicker.close();
  else els.modelPicker.removeAttribute("open");
}

function renderModelPicker() {
  const current = currentModelForType(modelPickerType);
  const records = selectableModelRecords(modelPickerType, current).filter((item) => !isHiddenModel(item.id));
  const vendors = groupBy(records, (item) => item.vendor || "default");
  if (!activeModelVendor || !vendors[activeModelVendor]) activeModelVendor = Object.keys(vendors)[0] || "";
  const query = els.modelSearch.value.trim().toLowerCase();
  const visible = (vendors[activeModelVendor] || []).filter((item) => {
    if (!query) return true;
    return `${item.id} ${item.label || ""}`.toLowerCase().includes(query);
  });
  els.modelPickerTitle.textContent = `选择${modelTypeLabel(modelPickerType)}模型`;
  els.modelPickerCount.textContent = `${records.length} 个模型`;
  els.modelVendorList.innerHTML = Object.entries(vendors)
    .map(([vendor, items]) => `
      <button class="model-vendor-button${vendor === activeModelVendor ? " active" : ""}" type="button" data-model-vendor="${escapeAttr(vendor)}">
        <span>${escapeHtml(vendor)}</span>
        <small>${items.length}</small>
      </button>
    `)
    .join("");
  els.modelPickerList.innerHTML = visible.length
    ? visible
        .map((model) => `
          <button class="model-result-item${model.id === current ? " active" : ""}" type="button" data-model-id="${escapeAttr(model.id)}">
            <span>
              <strong>${escapeHtml(model.label || model.id)}</strong>
              ${model.label && model.label !== model.id ? `<small>${escapeHtml(model.id)}</small>` : ""}
            </span>
            <span class="model-result-check">${model.id === current ? "✓" : ""}</span>
          </button>
        `)
        .join("")
    : '<div class="model-picker-empty">当前分组没有匹配模型</div>';
}

function currentModelForType(type) {
  if (type === "video") return state.settings.videoModel;
  if (type === "image") return state.settings.imageModel;
  return state.settings.chatModel;
}

function selectModelFromPicker(modelId) {
  if (!modelId || isHiddenModel(modelId)) return;
  if (modelPickerType === "video") state.settings.videoModel = modelId;
  else if (modelPickerType === "image") state.settings.imageModel = modelId;
  else state.settings.chatModel = modelId;
  state.modelOptions = unique([modelId, ...state.modelOptions.filter((id) => !isHiddenModel(id))]);
  saveState();
  closeModelPicker();
  render();
}

function saveSettingsFromForm(options = {}) {
  const values = settingsFormValues();
  state.settings = {
    ...state.settings,
    baseUrl: normalizeApiBaseUrl(values.baseUrl) || DEFAULT_API_BASE_URL,
    apiKey: values.apiKey.trim(),
    chatModel: values.chatModel,
    imageModel: values.imageModel || state.settings.imageModel,
    videoModel: values.videoModel || state.settings.videoModel,
    temperature: clampNumber(values.temperature, 0, 2, 0.7),
    contextTurns: clampNumber(values.contextTurns, 1, 50, 10),
    visualContextTurns: clampNumber(values.visualContextTurns, 1, 10, 4),
    imageApiStyle: values.imageApiStyle,
    videoApiStyle: values.videoApiStyle,
    imageEndpoint: normalizeEndpoint(values.imageEndpoint, DEFAULT_SETTINGS.imageEndpoint),
    imageEditEndpoint: normalizeEndpoint(values.imageEditEndpoint, DEFAULT_SETTINGS.imageEditEndpoint),
    videoEndpoint: normalizeEndpoint(values.videoEndpoint, DEFAULT_SETTINGS.videoEndpoint),
    videoStatusEndpoint: normalizeEndpoint(values.videoStatusEndpoint, DEFAULT_SETTINGS.videoStatusEndpoint),
    systemPrompt: values.systemPrompt,
  };
  state.modelOptions = unique([
    state.settings.chatModel,
    state.settings.imageModel,
    state.settings.videoModel,
    ...state.modelOptions,
  ]).filter(Boolean);
  saveState();
  render();
  settingsFormSnapshot = serializeSettingsForm();
  hideUnsavedSettingsPrompt();
  showToast("已保存");
  if (options.closeAfterSave) closeSettingsDirect();
}

function normalizeEndpoint(value, fallback) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return fallback;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

async function fetchModels() {
  const formOpen = Boolean(els.settingsDialog?.open);
  const draft = formOpen ? settingsFormValues() : null;
  const connection = settingsConnectionValues();
  if (!validateSettingsConnection(connection)) return;
  const trigger = formOpen ? els.reloadModels : els.testModels;
  setSettingsActionLoading(trigger, true, "获取中");
  setConnection("测试中", "", "正在通过 /v1/models 获取模型列表...");
  try {
    const response = await fetch(apiUrlForBase(connection.baseUrl, "/v1/models"), {
      headers: authHeadersForKey(connection.apiKey, false),
    });
    if (!response.ok) throw new Error(await responseError(response));
    const data = await response.json();
    const records = normalizeModelRecords(data.data || []);
    const models = records.map((item) => item.id);
    if (records.length) {
      state.modelRecords = records;
      state.modelOptions = unique([
        draft?.chatModel || state.settings.chatModel,
        draft?.imageModel || state.settings.imageModel,
        draft?.videoModel || state.settings.videoModel,
        ...models,
      ]);
      const selectedChat = records.find((item) => item.id === state.settings.chatModel);
      const selectedImage = records.find((item) => item.id === state.settings.imageModel);
      const selectedVideo = records.find((item) => item.id === state.settings.videoModel);
      if (!state.settings.chatModel || isHiddenModel(state.settings.chatModel) || (selectedChat && selectedChat.type !== "chat")) {
        state.settings.chatModel = records.find((item) => item.type === "chat")?.id || models[0];
      }
      if (!state.settings.imageModel || isHiddenModel(state.settings.imageModel) || (selectedImage && selectedImage.type !== "image")) {
        state.settings.imageModel = records.find((item) => item.type === "image")?.id || DEFAULT_SETTINGS.imageModel;
      }
      if (!state.settings.videoModel || isHiddenModel(state.settings.videoModel) || (selectedVideo && selectedVideo.type !== "video")) {
        state.settings.videoModel = records.find((item) => item.type === "video")?.id || DEFAULT_SETTINGS.videoModel;
      }
      saveState();
      renderControls();
      if (draft) refreshSettingsModelSelects(draft);
      else syncSettingsForm();
    }
    setConnection("连接成功", "ok", `已通过 /v1/models 获取 ${models.length || 0} 个模型。`);
    showToast("模型列表已更新");
  } catch (error) {
    const message = normalizeError(error);
    setConnection("连接失败", "error", message);
    showToast(message, true);
  } finally {
    setSettingsActionLoading(trigger, false);
  }
}

async function testConnection() {
  const connection = settingsConnectionValues();
  if (!validateSettingsConnection(connection)) return;
  setSettingsActionLoading(els.testConnection, true, "测试中");
  setConnection("测试中", "", "正在连接 /v1/models...");
  try {
    const response = await fetch(apiUrlForBase(connection.baseUrl, "/v1/models"), {
      headers: authHeadersForKey(connection.apiKey, false),
    });
    if (!response.ok) throw new Error(await responseError(response));
    const data = await response.json();
    const count = Array.isArray(data?.data) ? data.data.length : 0;
    setConnection("连接成功", "ok", `服务响应正常，可读取 ${count} 个模型。`);
  } catch (error) {
    setConnection("连接失败", "error", normalizeError(error));
  } finally {
    setSettingsActionLoading(els.testConnection, false);
  }
}

function settingsConnectionValues() {
  if (els.settingsDialog?.open) {
    return {
      baseUrl: els.baseUrl.value.trim().replace(/\/+$/, ""),
      apiKey: els.apiKey.value.trim(),
    };
  }
  return {
    baseUrl: String(state.settings.baseUrl || "").trim().replace(/\/+$/, ""),
    apiKey: String(state.settings.apiKey || "").trim(),
  };
}

function validateSettingsConnection(connection) {
  if (connection.baseUrl && connection.apiKey) return true;
  const message = "请填写 API Base URL 和 API Key";
  setConnection("连接失败", "error", message);
  showToast(message, true);
  return false;
}

function refreshSettingsModelSelects(values) {
  const validModel = (modelId, type, fallback) => {
    const record = state.modelRecords.find((item) => item.id === modelId);
    return record && record.type !== type ? fallback : modelId;
  };
  const chatModel = validModel(values.chatModel, "chat", state.settings.chatModel);
  const imageModel = validModel(values.imageModel, "image", state.settings.imageModel);
  const videoModel = validModel(values.videoModel, "video", state.settings.videoModel);
  fillGroupedModelSelect(els.chatModel, "chat", chatModel);
  fillGroupedModelSelect(els.imageModel, "image", imageModel);
  fillGroupedModelSelect(els.videoModel, "video", videoModel);
  els.chatModel.value = chatModel;
  els.imageModel.value = imageModel;
  els.videoModel.value = videoModel;
}

function setSettingsActionLoading(button, loading, loadingText = "处理中") {
  if (!button) return;
  if (loading) {
    button.dataset.idleText = button.textContent;
    button.textContent = loadingText;
  } else {
    button.textContent = button.dataset.idleText || button.textContent;
    delete button.dataset.idleText;
  }
  button.disabled = loading;
  button.classList.toggle("is-loading", loading);
}

function setConnection(text, type = "", detail = "") {
  els.connectionState.textContent = text;
  els.connectionState.className = `status-pill ${type}`.trim();
  if (els.connectionDetail) {
    els.connectionDetail.textContent = detail;
    els.connectionDetail.className = `connection-detail ${type}`.trim();
    els.connectionDetail.hidden = !detail;
  }
}

function apiUrl(path) {
  return apiUrlForBase(state.settings.baseUrl, path);
}

function apiUrlForBase(baseUrl, path) {
  const base = normalizeApiBaseUrl(baseUrl);
  if (!base) throw new Error("API Base URL 不能为空");
  if (/^https?:\/\//i.test(path)) return path;
  if (base.endsWith("/v1") && path.startsWith("/v1/")) return `${base}${path.slice(3)}`;
  if (base.endsWith("/v1") && path.startsWith("/v1beta/")) return `${base.slice(0, -3)}${path}`;
  return `${base}${path}`;
}

function normalizeApiBaseUrl(value) {
  return String(value || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/^https:\/\/www\.deeprouter\.top(?=\/|$)/i, "https://deeprouter.top");
}

function ensureApiReady() {
  if (!state.settings.baseUrl || !state.settings.apiKey) {
    showMissingSetting("请先填写 API Base URL 和 API Key");
    return false;
  }
  return true;
}

function showMissingSetting(message) {
  showToast(message, true);
  openSettings();
}

function authHeaders(includeContentType = true) {
  return authHeadersForKey(state.settings.apiKey, includeContentType);
}

function authHeadersForKey(apiKey, includeContentType = true) {
  const headers = {};
  headers.Accept = "application/json";
  if (includeContentType) headers["Content-Type"] = "application/json";
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  return headers;
}

function rawAuthHeaders() {
  const headers = { Accept: "application/json" };
  if (state.settings.apiKey) headers.Authorization = state.settings.apiKey;
  return headers;
}

async function responseError(response) {
  const text = await response.text();
  try {
    const json = JSON.parse(text);
    return deepestApiErrorMessage(json) || `${response.status} ${response.statusText}`;
  } catch {
    return text || `${response.status} ${response.statusText}`;
  }
}

function deepestApiErrorMessage(value, depth = 0) {
  if (value === null || value === undefined || depth > 6) return "";
  if (typeof value === "string") {
    const text = value.trim();
    if (!text) return "";
    const embedded = parseJsonPayload(text);
    return embedded ? deepestApiErrorMessage(embedded, depth + 1) || text : text;
  }
  if (typeof value !== "object") return String(value);
  const candidates = [
    value.error?.message,
    value.error,
    value.message,
    value.data?.error?.message,
    value.data?.error,
    value.data?.message,
    value.reason,
  ];
  for (const candidate of candidates) {
    const message = deepestApiErrorMessage(candidate, depth + 1);
    if (message) return message;
  }
  return "";
}

function normalizeError(error) {
  const message = error?.message || String(error);
  if (/Failed to fetch|NetworkError when attempting to fetch resource|Load failed/i.test(message)) {
    return "请求失败：请检查 API 地址、密钥、HTTPS 和 CORS 设置。";
  }
  return message;
}

function extractImageUrls(data) {
  const urls = [];
  const pushUrl = (value, mime = "image/png") => {
    if (!value) return;
    if (typeof value === "string") {
      urls.push(value.startsWith("data:") || value.startsWith("http") ? value : `data:${mime};base64,${value}`);
    }
  };
  const visit = (value, key = "") => {
    if (value === null || value === undefined) return;
    const lowerKey = String(key).toLowerCase();
    if (typeof value === "string") {
      const text = value.trim();
      if (!text) return;
      if ((text.startsWith("{") || text.startsWith("[")) && text.length < 200000) {
        try {
          visit(JSON.parse(text), key);
        } catch {
          // Continue parsing as plain text.
        }
      }
      if (text.startsWith("data:image/")) {
        pushUrl(text);
        return;
      }
      const dataUriMatches = text.match(/data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=\s]+/gi) || [];
      dataUriMatches.forEach((match) => pushUrl(match.replace(/\s/g, "")));
      const markdownMatches = [...text.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/gi)];
      markdownMatches.forEach((match) => pushUrl(match[1]));
      if (/(image|url|output|file|download|content|result|media|asset|source|src|data|response)/.test(lowerKey)) {
        const embeddedUrls = text.match(/https?:\/\/[^\s)"'<>]+/gi) || [];
        embeddedUrls.forEach((url) => pushUrl(url.replace(/[.,;]+$/, "")));
      }
      if (/^https?:\/\//i.test(text)) {
        if (/(image|url|output|file|download|content|result|media|asset|source|src|data|response)/.test(lowerKey) || /\.(png|jpe?g|webp|gif|avif)(?:[?#].*)?$/i.test(text)) {
          pushUrl(text);
        }
      } else if (/(base64|b64|b64_json|image_base64|inline.*data|^image$|image_data|^data$|^output$|^result$|bytes)/.test(lowerKey) && /^[A-Za-z0-9+/=\s]+$/.test(text) && text.length > 200) {
        pushUrl(text.replace(/\s/g, ""));
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, key));
      return;
    }
    if (typeof value === "object") {
      if (/^inline_?data$/i.test(String(key)) && typeof value.data === "string") {
        const mime = value.mimeType || value.mime_type || "image/png";
        if (String(mime).toLowerCase().startsWith("image/")) pushUrl(value.data.replace(/\s/g, ""), mime);
        return;
      }
      Object.entries(value).forEach(([childKey, childValue]) => visit(childValue, childKey));
    }
  };
  visit(data, "root");
  return unique(urls);
}

function extractVideoUrls(data) {
  const urls = [];
  const pushUrl = (value, mime = "video/mp4") => {
    if (!value) return;
    if (typeof value === "string") {
      urls.push(value.startsWith("data:") || value.startsWith("http") ? value : `data:${mime};base64,${value}`);
    }
  };
  const visit = (value, key = "") => {
    if (value === null || value === undefined) return;
    const lowerKey = String(key).toLowerCase();
    if (typeof value === "string") {
      const text = value.trim();
      if (!text) return;
      if ((text.startsWith("{") || text.startsWith("[")) && text.length < 200000) {
        const embedded = parseJsonPayload(text);
        if (embedded) {
          visit(embedded, key);
          return;
        }
      }
      if (text.startsWith("data:video/")) pushUrl(text);
      else if (/^https?:\/\//i.test(text)) {
        if (/(video|url|uri|output|file|download|content|result|media|asset|source|src)/.test(lowerKey) || /\.(mp4|webm|mov|m3u8)(?:[?#].*)?$/i.test(text)) {
          pushUrl(text);
        }
      } else if (/(base64|b64|video_base64|b64_json)/.test(lowerKey) && /^[A-Za-z0-9+/=\s]+$/.test(text) && text.length > 80) {
        pushUrl(text.replace(/\s/g, ""));
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, key));
      return;
    }
    if (typeof value === "object") {
      Object.entries(value).forEach(([childKey, childValue]) => visit(childValue, childKey));
    }
  };
  visit(data, "root");
  const candidates = unique(urls);
  const directlyPlayable = candidates.filter((url) => !isAuthenticatedVideoProxyUrl(url));
  return directlyPlayable.length ? directlyPlayable : candidates;
}

function isAuthenticatedVideoProxyUrl(value) {
  try {
    const url = new URL(String(value || ""));
    const base = new URL(normalizeApiBaseUrl(state.settings.baseUrl) || DEFAULT_API_BASE_URL);
    const hostname = (host) => String(host || "").replace(/^www\./i, "").toLowerCase();
    return hostname(url.hostname) === hostname(base.hostname)
      && /^\/v1\/videos\/[^/]+\/content\/?$/i.test(url.pathname);
  } catch {
    return false;
  }
}

function extractJobId(data) {
  const direct = data?.id || data?.task_id || data?.taskId || data?.job_id || data?.jobId || data?.request_id || data?.requestId || data?.name;
  if (direct) return direct;
  return findNestedValue(data, (key, value) => {
    const lowerKey = key.toLowerCase();
    return typeof value === "string" && /(task|job|request).*id|^(id)$/.test(lowerKey) && /^task_|^[A-Za-z0-9_-]{12,}$/.test(value);
  }) || "";
}

function extractImageJobId(data) {
  const explicit = data?.task_id || data?.taskId || data?.job_id || data?.jobId || data?.operation_id || data?.operationId;
  if (explicit) return String(explicit);
  const nested = findNestedValue(data, (key, value) => {
    return typeof value === "string" && /(task|job|operation).*id/i.test(key) && value.length >= 8;
  });
  if (nested) return String(nested);
  const status = extractTaskStatus(data);
  const id = data?.id;
  return isLikelyAsyncImageTask(id, status) ? String(id) : "";
}

function isLikelyAsyncImageTask(jobId, status = "") {
  const id = String(jobId || "").toLowerCase();
  const normalizedStatus = String(status || "").toLowerCase();
  if (!id) return false;
  if (/^(chatcmpl|resp|request|req)[-_]/.test(id)) return false;
  if (["queued", "pending", "processing", "running", "in_progress", "submitted"].includes(normalizedStatus)) return true;
  return /^(task|job|operation|img|image_task|img_task)[-_]/.test(id);
}

function extractTaskStatus(data) {
  if (data?.done === true) return data?.error ? "failed" : "done";
  if (data?.done === false) return "processing";
  return (
    data?.status ||
    data?.state ||
    data?.task_status ||
    data?.taskStatus ||
    data?.data?.status ||
    data?.data?.state ||
    findNestedValue(data, (key, value) => typeof value === "string" && /status|state|task_status/i.test(key)) ||
    ""
  );
}

function extractErrorMessage(data) {
  return deepestApiErrorMessage(data)
    || findNestedValue(data, (key, value) => typeof value === "string" && /error|message|reason/i.test(key))
    || "";
}

function findNestedValue(value, predicate) {
  const stack = [{ value, key: "" }];
  const seen = new Set();
  while (stack.length) {
    const item = stack.pop();
    if (!item || item.value === null || item.value === undefined) continue;
    if (typeof item.value !== "object") {
      if (typeof item.value === "string") {
        const text = item.value.trim();
        if ((text.startsWith("{") || text.startsWith("[")) && text.length < 200000) {
          const embedded = parseJsonPayload(text);
          if (embedded) stack.push({ value: embedded, key: item.key });
        }
      }
      if (predicate(item.key, item.value)) return item.value;
      continue;
    }
    if (seen.has(item.value)) continue;
    seen.add(item.value);
    if (Array.isArray(item.value)) {
      item.value.forEach((child) => stack.push({ value: child, key: item.key }));
    } else {
      Object.entries(item.value).forEach(([key, child]) => stack.push({ value: child, key }));
    }
  }
  return "";
}

function autoResizePrompt() {
  els.promptInput.style.height = "auto";
  els.promptInput.style.height = `${Math.min(220, Math.max(54, els.promptInput.scrollHeight))}px`;
}

function exportData() {
  const payload = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `deep-iamge2-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importData(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    state = normalizeState(parsed.state || parsed);
    activeMode = state.activeMode || "image";
    activeSessionId = state.activeSessionId || state.sessions[0]?.id;
    activeVisualSessionId = state.activeVisualSessionId || state.visualSessions[0]?.id;
    chatAttachments = [];
    saveState();
    render();
    if (els.settingsDialog?.open) settingsFormSnapshot = serializeSettingsForm();
    showToast("已导入");
  } catch {
    showToast("导入失败：JSON 格式无效", true);
  }
}

function clearAllData() {
  if (!window.confirm("确认清空本地配置、会话和视觉任务历史？")) return;
  void clearVisualMediaCache();
  state = createInitialState();
  activeMode = state.activeMode;
  activeSessionId = state.activeSessionId;
  activeVisualSessionId = state.activeVisualSessionId;
  draftMedia = createEmptyDraftMedia();
  chatAttachments = [];
  saveState();
  render();
  if (els.settingsDialog?.open) settingsFormSnapshot = serializeSettingsForm();
}

function showToast(message, isError = false) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.toggle("error", isError);
  els.toast.hidden = false;
  toastTimer = setTimeout(() => {
    els.toast.hidden = true;
  }, isError ? 5200 : 2600);
}

async function copyText(text) {
  try {
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        // HTTP deployments may expose Clipboard API but reject writes.
      }
    }
    if (!copied) {
      const input = document.createElement("textarea");
      input.value = String(text || "");
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      copied = document.execCommand("copy");
      input.remove();
      if (!copied) throw new Error("copy unavailable");
    }
    showToast("已复制");
  } catch {
    showToast("复制失败", true);
  }
}

function getModelProfile(modelId) {
  const fetched = state?.modelRecords?.find((item) => item.id === modelId);
  return fetched || MODEL_CATALOG.find((item) => item.id === modelId) || inferModelProfile(modelId);
}

function normalizeModelRecords(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => {
      const raw = typeof item === "string" ? { id: item } : item || {};
      const id = raw.id || raw.name || raw.model || "";
      if (!id) return null;
      const inferred = inferModelProfile(id, raw);
      return {
        ...inferred,
        id,
        label: raw.display_name || raw.label || raw.name || inferred.label || id,
        vendor: classifyModelVendor(id, raw, inferred.vendor),
        type: normalizeModelType(raw.type, inferred.type),
        provider: inferred.provider,
        source: "api",
        raw,
      };
    })
    .filter((record) => record && !isHiddenModel(record.id));
}

function normalizeModelType(value, fallback = "chat") {
  const type = String(value || "").toLowerCase();
  if (fallback === "image" || fallback === "video") return fallback;
  if (!type || type === "model") return fallback;
  if (/video/.test(type)) return "video";
  if (/image|picture|photo/.test(type)) return "image";
  if (/chat|text|language/.test(type)) return "chat";
  return fallback;
}

function selectableModelRecords(type, current) {
  const byId = new Map();
  (state.modelRecords || []).forEach((record) => {
    if (record.type === type && !isHiddenModel(record.id)) byId.set(record.id, record);
  });
  state.modelOptions.forEach((id) => {
    if (isHiddenModel(id)) return;
    const profile = getModelProfile(id);
    if (profile?.type === type && !byId.has(id)) byId.set(id, { ...profile, source: "manual" });
  });
  if (current && !isHiddenModel(current) && !byId.has(current)) {
    const profile = getModelProfile(current);
    if (profile?.type === type) byId.set(current, { ...profile, source: "current" });
  }
  return [...byId.values()].sort((a, b) => {
    const vendor = String(a.vendor || "").localeCompare(String(b.vendor || ""), "zh-CN");
    if (vendor) return vendor;
    return String(a.id).localeCompare(String(b.id), "zh-CN");
  });
}

function inferModelProfile(modelId, raw = {}) {
  const id = String(modelId || "").toLowerCase();
  const owner = String(raw.owned_by || raw.vendor || raw.provider || "").toLowerCase();
  if (!id) return null;
  if (isSora2Model(id)) return { id: modelId, label: modelId, vendor: "OpenAI", type: "video", provider: "sora", capabilities: ["视频"] };
  if (id.includes("veo")) return { id: modelId, label: modelId, vendor: "Google", type: "video", provider: "veo", capabilities: ["视频"] };
  if (id.includes("seedance")) return { id: modelId, label: modelId, vendor: "Doubao", type: "video", provider: "seedance", capabilities: ["视频"] };
  if (id.includes("grok") && id.includes("video")) {
    return { id: modelId, label: modelId, vendor: "xAI", type: "video", provider: "xai", capabilities: ["文生视频", "图生视频"] };
  }
  if (/(kling|runway|luma|hailuo|vidu|sora|wan-|video)/.test(id)) {
    return { id: modelId, label: modelId, vendor: inferVendor(id, owner), type: "video", provider: inferProvider(id, owner), capabilities: ["视频"] };
  }
  if (id.includes("seedream")) return { id: modelId, label: modelId, vendor: "Doubao", type: "image", provider: "seed", capabilities: ["图片"] };
  if (id.includes("imagen")) return { id: modelId, label: modelId, vendor: "Google", type: "image", provider: "gemini", capabilities: ["图片"] };
  if (/nano[-_. ]?banana|banana[-_. ]?(?:2|pro|image)/.test(id)) {
    return { id: modelId, label: modelId, vendor: "Gemini", type: "image", provider: "gemini", capabilities: ["图片"] };
  }
  if (id.includes("gemini") && /(image|vision|preview-image|generate-image)/.test(id)) {
    return { id: modelId, label: modelId, vendor: "Gemini", type: "image", provider: "gemini", capabilities: ["图片"] };
  }
  if (id.includes("gpt-image") || id.includes("dall-e")) return { id: modelId, label: modelId, vendor: "OpenAI", type: "image", provider: "openai", capabilities: ["图片"] };
  if (/(flux|stable-diffusion|sd-|image|photo|draw|paint)/.test(id)) {
    return { id: modelId, label: modelId, vendor: inferVendor(id, owner), type: "image", provider: inferProvider(id, owner), capabilities: ["图片"] };
  }
  return { id: modelId, label: modelId, vendor: inferVendor(id, owner), type: "chat", provider: inferProvider(id, owner), capabilities: ["文本"] };
}

function inferVendor(id, owner = "") {
  const modelVendor = inferVendorFromModelId(id);
  if (modelVendor) return modelVendor;
  const source = String(owner || "").toLowerCase();
  if (/aws|bedrock/.test(source)) return "AWS";
  if (/azure/.test(source)) return "Azure";
  if (/c-code|ccode/.test(source)) return "C-Code";
  if (/claude-max/.test(source)) return "Claude-Max";
  if (/codex/.test(source)) return "Codex";
  if (/vertex/.test(source)) return "Vertex";
  if (/vercel/.test(source)) return "Vercel";
  if (/anthropic|claude/.test(source)) return "Claude";
  if (/gemini/.test(source)) return "Gemini";
  if (/google/.test(source)) return "Google";
  if (/xai|grok/.test(source)) return "xAI";
  if (/deepseek/.test(source)) return "DeepSeek";
  if (/zhipu|glm/.test(source)) return "GLM";
  if (/moonshot|kimi/.test(source)) return "Kimi";
  if (/minimax/.test(source)) return "MiniMax";
  if (/qwen|aliyun|tongyi|dashscope/.test(source)) return "Qwen";
  if (/doubao|bytedance|volc/.test(source)) return "Doubao";
  if (/openai/.test(source)) return "OpenAI";
  return owner || "其他";
}

function inferVendorFromModelId(modelId) {
  const id = String(modelId || "").toLowerCase();
  if (!id) return "";
  if (/gemini|nano[-_. ]?banana/.test(id)) return "Gemini";
  if (/deepseek/.test(id)) return "DeepSeek";
  if (/(?:^|[-_.\/])(?:chat)?glm(?:[-_.\/]|$)|zhipu/.test(id)) return "GLM";
  if (/kimi|moonshot/.test(id)) return "Kimi";
  if (/minimax|(?:^|[-_.\/])abab(?:[-_.\/]|$)/.test(id)) return "MiniMax";
  if (/qwen|(?:^|[-_.\/])qwq(?:[-_.\/]|$)|(?:^|[-_.\/])qvq(?:[-_.\/]|$)|tongyi/.test(id)) return "Qwen";
  if (/doubao|seedream|seedance|jimeng/.test(id)) return "Doubao";
  if (/grok|(?:^|[-_.\/])xai(?:[-_.\/]|$)/.test(id)) return "xAI";
  if (/claude-max/.test(id)) return "Claude-Max";
  if (/anthropic|claude/.test(id)) return "Claude";
  if (/gpt|chatgpt|dall-e|openai|(?:^|[-_.\/])o[134](?:[-_.\/]|$)/.test(id)) return "OpenAI";
  if (/veo|imagen/.test(id)) return "Google";
  if (/aws|bedrock/.test(id)) return "AWS";
  if (/azure/.test(id)) return "Azure";
  if (/c-code|ccode/.test(id)) return "C-Code";
  if (/codex/.test(id)) return "Codex";
  if (/vertex/.test(id)) return "Vertex";
  if (/vercel/.test(id)) return "Vercel";
  return "";
}

function classifyModelVendor(modelId, raw, fallback) {
  const owner = String(raw.vendor || raw.provider || raw.owned_by || "").trim();
  const modelVendor = inferVendorFromModelId(modelId);
  if (modelVendor) return modelVendor;
  if (!owner || /^(system|unknown|other|default)$/i.test(owner)) return fallback || "其他";
  return inferVendor("", owner) || fallback || "其他";
}

function isHiddenModel(modelId) {
  const id = String(modelId || "").toLowerCase();
  return isSora2ProModel(id)
    || /midjourney|(^|[^a-z0-9])(mj|niji)([^a-z0-9]|$)|^(mj|niji)(?:[0-9]|[-_.\/])/.test(id);
}

function inferProvider(id, owner = "") {
  const model = String(id || "").toLowerCase();
  if (isSora2Model(model)) return "sora";
  if (/seedance/.test(model)) return "seedance";
  if (/seedream|doubao|jimeng/.test(model)) return "seed";
  if (/xai|grok/.test(model)) return "xai";
  if (/veo/.test(model)) return "veo";
  if (/gemini|imagen|nano[-_. ]?banana/.test(model)) return "gemini";
  if (/openai|gpt|chatgpt|dall-e/.test(model)) return "openai";
  if (inferVendorFromModelId(model)) return "custom";
  const source = String(owner || "").toLowerCase();
  if (/bytedance|volc/.test(source)) return "seed";
  if (/xai|grok/.test(source)) return "xai";
  if (/google|gemini/.test(source)) return "gemini";
  if (/openai/.test(source)) return "openai";
  return "custom";
}

function resolveImageApiStyle(profile) {
  if (/gemini/i.test(String(profile?.id || ""))) return "gemini";
  if (profile?.provider === "gemini" && isBananaRouterBaseUrl()) return "gemini";
  if (state.settings.imageApiStyle === "openai") return "openai";
  if (state.settings.imageApiStyle === "gemini") return "gemini";
  if (profile?.provider === "gemini" && /googleapis\.com|generativelanguage/i.test(state.settings.baseUrl || "")) return "gemini";
  return "openai";
}

function resolveVideoApiStyle(profile) {
  if (state.settings.videoApiStyle === "generic") return "generic";
  if (state.settings.videoApiStyle === "gemini") return "gemini";
  if (profile?.provider === "veo") return "gemini";
  return "generic";
}

function imageModeLabel(profile) {
  const style = resolveImageApiStyle(profile);
  if (style === "gemini") {
    return resolveGeminiImageRoute(profile?.id) === "native" ? "Gemini generateContent" : "Gemini Chat 图片";
  }
  return "OpenAI 兼容";
}

function videoModeLabel(profile) {
  if (profile?.provider === "sora") return "NewAPI Sora 参数";
  if (profile?.provider === "veo" && usesDeepRouterVeoCompatibility(state.settings.videoModel)) return "Veo Multipart 参数";
  if (profile?.provider === "veo" && usesNewApiVeoTask(state.settings.videoModel)) return "NewAPI Veo 参数";
  const style = resolveVideoApiStyle(profile);
  if (style === "gemini") return "Gemini/Veo 参数";
  if (profile?.provider === "seedance") return "SeedDance 参数";
  if (profile?.provider === "xai") return "Grok 参数";
  return "通用视频参数";
}

function effectiveImageSize() {
  if (state.settings.imageSize && state.settings.imageSize !== "auto") return state.settings.imageSize;
  return sizeFromAspect(state.settings.imageAspectRatio);
}

function effectiveImageOutputSize(modelId = state.settings.imageModel) {
  const profile = getModelProfile(modelId);
  if (profile?.provider === "gemini") return geminiNativeImageSize();
  return imageRequestSize(modelId);
}

function imageRequestSize(modelId) {
  const size = isGptImage2Model(modelId) && state.settings.imageSize === "auto"
    ? gptImage2SizeFromAspect(state.settings.imageAspectRatio)
    : effectiveImageSize();
  if (isGptImage2Model(modelId)) return normalizeGptImageSize(size, state.settings.imageAspectRatio);
  if (isGptImageModel(modelId)) return normalizeLegacyGptImageSize(size, state.settings.imageAspectRatio);
  return size;
}

function gptImage2SizeFromAspect(aspect) {
  const map = {
    "1:1": "1024x1024",
    "3:2": "1536x1024",
    "2:3": "1024x1536",
    "4:3": "1360x1024",
    "3:4": "1024x1360",
    "16:9": "1792x1024",
    "9:16": "1024x1792",
    "21:9": "1792x768",
  };
  return map[aspect] || "1024x1024";
}

function isGptImageModel(modelId) {
  return /^gpt-image(?:$|[-_.])/i.test(String(modelId || ""));
}

function isGptImage2Model(modelId) {
  return /^gpt-image[-_.]?2(?:$|[-_.])/i.test(String(modelId || ""));
}

function normalizeLegacyGptImageSize(value, aspect = "1:1") {
  const size = String(value || "").toLowerCase();
  if (["1024x1024", "1536x1024", "1024x1536"].includes(size)) return size;
  if (["16:9", "4:3", "3:2", "21:9"].includes(aspect)) return "1536x1024";
  if (["9:16", "3:4", "2:3"].includes(aspect)) return "1024x1536";
  return "1024x1024";
}

function normalizeGptImageSize(value, aspect = "1:1") {
  const match = String(value || "").trim().match(/^(\d+)\s*[x×]\s*(\d+)$/i);
  if (!match) return sizeFromAspect(aspect);
  const alignNearest = (number) => Math.max(16, Math.min(3840, Math.round(number / 16) * 16));
  const alignUp = (number) => Math.max(16, Math.min(3840, Math.ceil(number / 16) * 16));
  const alignDown = (number) => Math.max(16, Math.min(3840, Math.floor(number / 16) * 16));
  let width = alignNearest(Number(match[1]));
  let height = alignNearest(Number(match[2]));

  if (Math.max(width, height) / Math.min(width, height) > 3) {
    if (width > height) height = alignUp(width / 3);
    else width = alignUp(height / 3);
  }

  const minPixels = 655360;
  const maxPixels = 8294400;
  if (width * height < minPixels) {
    const scale = Math.sqrt(minPixels / (width * height));
    width = alignUp(width * scale);
    height = alignUp(height * scale);
  }
  if (width * height > maxPixels) {
    const scale = Math.sqrt(maxPixels / (width * height));
    width = alignDown(width * scale);
    height = alignDown(height * scale);
  }
  return `${width}x${height}`;
}

function sizeFromAspect(aspect) {
  const map = {
    "1:1": "1024x1024",
    "4:3": "1536x1024",
    "3:4": "1024x1536",
    "16:9": "1792x1024",
    "9:16": "1024x1792",
    "21:9": "1792x768",
  };
  return map[aspect] || "1024x1024";
}

function aspectFromSize(size) {
  const map = {
    "1024x1024": "1:1",
    "1536x1024": "3:2",
    "1024x1536": "2:3",
    "1792x1024": "16:9",
    "1024x1792": "9:16",
  };
  return map[size] || "1:1";
}

function normalizeQualityForModel(quality, model) {
  if (model?.id === "dall-e-3" && !["standard", "hd"].includes(quality)) return "hd";
  return quality;
}

function mediaPayload(item) {
  return {
    name: item.name,
    mime_type: item.mime,
    size: item.size,
    data_url: item.dataUrl,
  };
}

function mediaMeta(item) {
  return {
    name: item.name,
    mime: item.mime,
    size: item.size,
  };
}

function statusLabel(status) {
  const map = {
    running: "生成中",
    submitted: "已提交",
    done: "完成",
    error: "失败",
    stopped: "已停止",
    empty: "无结果",
  };
  return map[status] || status || "-";
}

function taskStatusDetail(task) {
  const parts = [];
  if (task.rawStatus) parts.push(`状态 ${task.rawStatus}`);
  if (task.jobId) parts.push(`任务 ${String(task.jobId).slice(0, 18)}`);
  if (task.lastCheckedAt) parts.push(`检查 ${formatTime(task.lastCheckedAt)}`);
  if (task.lastPollError) parts.push(`错误 ${task.lastPollError}`);
  if (parts.length) return parts.join(" · ");
  return task.type === "image" ? "正在等待图片生成响应" : "正在等待任务状态";
}

function paramLabel(key) {
  const map = {
    mode: "模式",
    size: "尺寸",
    aspectRatio: "比例",
    quality: "质量",
    style: "风格",
    count: "数量",
    resolution: "清晰度",
    duration: "时长",
    audio: "音频",
  };
  return map[key] || key;
}

function fileTypeLabel(mime) {
  if (mime.startsWith("video/")) return "视频";
  if (mime.startsWith("audio/")) return "音频";
  if (mime.startsWith("image/")) return "图片";
  return "文件";
}

function trimFileName(name) {
  const value = String(name || "");
  return value.length > 22 ? `${value.slice(0, 10)}...${value.slice(-8)}` : value;
}

function uniqueMedia(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.name}:${item.size}:${item.mime}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function groupBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    apiUrl,
    buildChatRequest,
    buildGrokTextVideoFallbackRequest,
    buildVideoRequest,
    buildVideoReferences,
    buildImageRequest,
    effectiveImageAspectRatio,
    effectiveVideoAspectRatio,
    effectiveVideoAudio,
    effectiveVideoCount,
    effectiveVideoDuration,
    effectiveVideoResolution,
    encodeVideoTaskId,
    extractImageUrls,
    extractErrorMessage,
    extractJobId,
    extractTaskStatus,
    extractVideoUrls,
    imageSizeOptionsForModel,
    imageQualityOptionsForModel,
    imageStyleOptionsForModel,
    imagePromptWithSelectedStyle,
    imageGenerationModeForReferences,
    isGptImage2Model,
    isGrokImagine15Model,
    isGrokImagineVideoModel,
    isSeedance2FastModel,
    isSeedance2Model,
    isSeedance20UnifiedModel,
    isSora2Model,
    isSora2ProModel,
    isVeoModel,
    isWebSearchModel,
    isBananaRouterBaseUrl,
    isRetryableImageError,
    imageRequestSize,
    normalizeModelRecords,
    normalizeGptImageSize,
    normalizeSeedDanceDuration,
    normalizeSora2Duration,
    normalizeVeoDuration,
    normalizeState,
    parseLinkedNewApiSettings,
    resolveWebSearchModel,
    resolveGeminiImageRoute,
    resolveChatProtocol,
    shouldStopMissingVideoTaskPolling,
    videoAspectOptionsForModel,
    videoDurationOptionsForModel,
    videoResolutionOptionsForModel,
    videoStatusEndpointForTask,
    videoStatusHeadersForTask,
    setTestSettings(settings) {
      state.settings = { ...DEFAULT_SETTINGS, ...settings };
    },
    setTestDraftMedia(media) {
      draftMedia = { ...createEmptyDraftMedia(), ...media };
    },
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  initElements();
  const linkedSettingsApplied = applyLinkedNewApiSettings();
  bindEvents();
  if (!activeSessionId || !state.sessions.find((session) => session.id === activeSessionId)) {
    activeSessionId = state.sessions[0]?.id || createSession();
  }
  if (!activeVisualSessionId || !state.visualSessions.find((session) => session.id === activeVisualSessionId)) {
    activeVisualSessionId = state.visualSessions[0]?.id || createVisualSession();
  }
  try {
    await navigator.storage?.persist?.();
  } catch {
    // Storage persistence is optional; IndexedDB remains available without it.
  }
  await restoreCachedVisualMedia();
  render();
  autoResizePrompt();
  resumeVideoPolling();
  resumeImagePolling();
  if (linkedSettingsApplied) {
    setConnection("已导入 NewAPI 配置", "ok");
    setTimeout(() => fetchModels(), 0);
  } else if (!state.settings.apiKey) {
    setTimeout(() => {
      showMissingSetting("请先配置 API Key");
    }, 300);
  }
});
