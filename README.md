# DeepImage2-Video

A standalone, browser-based AI chat, image, and video creation client.

一个独立运行在浏览器中的 AI 对话、图片与视频创作客户端。

[中文](#中文) | [English](#english)

> This repository contains only the static web client. It does not include or deploy NewAPI, a database, Redis, or an API proxy.
>
> 本仓库只包含静态网页客户端，不包含也不会部署 NewAPI、数据库、Redis 或 API 代理服务。

## 中文

### 项目介绍

DeepImage2-Video 是一个无需构建步骤的纯 HTML、CSS、JavaScript 客户端。部署后，浏览器会直接请求用户配置的 AI API 服务。

默认 API 地址为 `https://deeprouter.top`，也可以连接支持相应接口的 NewAPI 或其他兼容网关。模型列表来自当前 API 的 `/v1/models` 返回结果，客户端会按厂商与聊天、图片、视频类型自动分类。

### 主要功能

- 首次打开默认进入视觉创作，支持独立的图片和视频创作会话。
- 支持兼容 OpenAI、Anthropic、Gemini 协议的聊天模型。
- 支持联网搜索开关以及图片、文本、PDF 和常见文档附件。
- 支持 GPT Image、Gemini 图片模型的文生图和图生图。
- 上传参考图后自动切换为图生图；移除全部参考图后自动恢复文生图。
- 支持尺寸、比例、质量、风格、数量等图片参数。
- 支持图片任务并发提交、重试、删除、缓存、缩放预览和下载。
- 支持 Seedance、Grok、Veo、Sora 等视频模型的兼容参数与任务轮询。
- 支持视频比例、分辨率、时长、音频、首尾帧和参考素材。
- 支持视觉上下文延续、历史会话置顶、重命名和删除。
- 支持 NewAPI 外部客户端链接自动注入 API 地址和用户令牌。
- Midjourney、MJ 和 Niji 模型会被隐藏，不提供 Midjourney 操作流程。

实际可用模型和参数取决于 API 网关及其上游渠道，客户端不会额外创建不存在的模型。

### 数据与隐私

- API 地址、API Key、设置和会话记录保存在浏览器 `localStorage`。
- Base64 图片结果使用浏览器 `IndexedDB` 缓存，刷新后可以继续显示。
- 视频结果通常保存上游返回的 URL，链接有效期由上游服务决定。
- 客户端不会把会话同步到本项目自带的服务器，因为本项目没有后端。
- 清理浏览器站点数据会删除本地设置、令牌、历史和图片缓存。

这是浏览器直连 API 的客户端。API Key 对当前浏览器用户可见，请使用用户级、有限额度、可撤销的令牌，不要使用平台管理员密钥。

### 环境要求

- 现代 Chromium、Firefox 或 Safari 浏览器。
- 一个支持所需模型与接口的 API 服务。
- API 服务允许客户端站点进行跨域请求。
- Docker 部署需要 Docker Engine 与 Docker Compose 插件。
- 运行测试需要 Node.js 18 或更高版本，推荐 Node.js 20。

### 快速部署：Docker Compose

这是推荐的自托管方式。

```bash
git clone git@github.com:zfg5118/DeepImage2-Video.git
cd DeepImage2-Video
docker compose up -d
```

访问：

```text
http://127.0.0.1:3001/
```

查看状态和日志：

```bash
docker compose ps
docker compose logs -f
```

停止服务：

```bash
docker compose down
```

更新版本：

```bash
git pull
docker compose up -d
```

Compose 使用官方 `nginx:1.27-alpine` 镜像，并将静态文件以只读方式挂载到容器中。项目只使用站点根路径 `/`，不要部署到 `/client` 或 `/console/client`。

### 部署方式

#### 方式一：Docker 命令

不使用 Compose 时，可以直接运行 Nginx 容器：

```bash
docker run -d \
  --name deepimage2-video \
  --restart unless-stopped \
  -p 3001:80 \
  -v "$PWD/index.html:/usr/share/nginx/html/index.html:ro" \
  -v "$PWD/styles.css:/usr/share/nginx/html/styles.css:ro" \
  -v "$PWD/app.js:/usr/share/nginx/html/app.js:ro" \
  -v "$PWD/favicon.ico:/usr/share/nginx/html/favicon.ico:ro" \
  -v "$PWD/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
  nginx:1.27-alpine
```

#### 方式二：现有 Nginx 服务器

复制静态文件：

```bash
sudo install -d /var/www/deepimage2-video
sudo install -m 0644 index.html styles.css app.js favicon.ico /var/www/deepimage2-video/
```

示例站点配置：

```nginx
server {
    listen 80;
    server_name ai.example.com;

    root /var/www/deepimage2-video;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(?:css|js)$ {
        try_files $uri =404;
        expires -1;
        add_header Cache-Control "no-cache";
    }

    location ~* \.(?:png|jpg|jpeg|gif|ico|svg|webp)$ {
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

检查并重载 Nginx：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

生产环境应为站点配置 HTTPS。

#### 方式三：GitHub Pages

仓库包含 [`.github/workflows/pages.yml`](.github/workflows/pages.yml)，推送到 `main` 分支后可自动发布静态文件。

推送到 `main` 后，工作流会尝试自动启用并部署 GitHub Pages。如果仓库策略不允许工作流自动启用，请打开仓库 `Settings > Pages`，将 `Source` 设置为 `GitHub Actions`，然后重新运行工作流。

部署完成后访问：

```text
https://zfg5118.github.io/DeepImage2-Video/
```

`index.html` 使用相对静态资源路径，因此支持 GitHub Pages 的仓库子路径。

#### 方式四：Vercel

可以在 Vercel 控制台直接导入 GitHub 仓库，框架选择 `Other`，无需 Build Command，项目根目录作为静态输出。

也可以使用 CLI：

```bash
npx vercel --prod
```

#### 方式五：Netlify

在 Netlify 中导入仓库，将 Publish directory 设置为 `.`，无需构建命令。

CLI 部署：

```bash
npx netlify-cli deploy --prod --dir=.
```

#### 方式六：Cloudflare Pages

在 Cloudflare Pages 中连接仓库，构建命令留空，输出目录设置为 `.`。

CLI 部署：

```bash
npx wrangler pages deploy . --project-name=deepimage2-video
```

#### 方式七：本地静态服务器

仅用于开发预览：

```bash
python3 -m http.server 3001
```

然后访问 `http://127.0.0.1:3001/`。不要直接双击打开 `index.html`，部分浏览器会限制 `file://` 页面访问 API 和浏览器存储。

### 首次配置

1. 打开右上角“设置”。
2. 填写 `API Base URL` 和 `API Key`。
3. 点击“测试连接”。测试使用现有 `/v1/models` 接口。
4. 在“模型设置”中点击“获取模型”。
5. 分别选择聊天、图片和视频模型，然后保存。

如果 API Base URL 已包含 `/v1`，客户端会避免重复拼接 `/v1`。

### NewAPI 外部客户端接入

客户端支持下面的链接格式：

```text
https://client.example.com/#/?settings={"key":"{key}","url":"{address}"}
```

`{key}` 和 `{address}` 由 NewAPI 替换。客户端导入后会将令牌和 API 地址保存到当前浏览器，并清除地址栏中的设置参数。

NewAPI 的 `Chats` 配置示例：

```json
{
  "DeepImage2-Video": "https://client.example.com/#/?settings={\"key\":\"{key}\",\"url\":\"{address}\"}"
}
```

GitHub Pages 示例：

```json
{
  "DeepImage2-Video": "https://zfg5118.github.io/DeepImage2-Video/#/?settings={\"key\":\"{key}\",\"url\":\"{address}\"}"
}
```

### CORS 与 HTTPS

浏览器会直接从客户端域名请求 API 域名。API 服务至少需要允许：

- 客户端站点的 `Origin`。
- `GET`、`POST`、`OPTIONS` 方法。
- `Authorization`、`Content-Type`、`Accept` 请求头。

如果客户端使用 HTTPS，而 API 只提供 HTTP，浏览器会阻止混合内容请求。生产环境必须同时为客户端和 API 使用 HTTPS。

常见网络错误包括：

- API 未配置 CORS。
- API Key 无效或没有模型权限。
- API 地址末尾路径配置错误。
- HTTPS 页面请求 HTTP API。
- 上游模型不支持客户端发送的参数。

### 测试

项目不需要安装 npm 依赖。运行：

```bash
node --check app.js
node --test tests/*.test.cjs
```

GitHub Actions 会在每次推送和 Pull Request 时运行同样的测试。

### 项目结构

```text
.
├── .github/workflows/   # CI 与 GitHub Pages
├── tests/               # Node.js 测试
├── app.js               # 客户端业务逻辑与接口适配
├── index.html           # 页面结构
├── styles.css           # 界面样式
├── favicon.ico          # 站点图标
├── nginx.conf           # 容器 Nginx 配置
└── docker-compose.yml   # Docker Compose 部署
```

### 贡献

欢迎提交 Issue 和 Pull Request。提交前请运行测试，并避免提交 API Key、访问令牌、生成结果或个人会话数据。

### 许可证

本项目使用 [MIT License](LICENSE)。

## English

### Overview

DeepImage2-Video is a static HTML, CSS, and JavaScript client with no build step. Once deployed, the browser sends requests directly to the AI API configured by the user.

The default API base URL is `https://deeprouter.top`. You can replace it with NewAPI or another gateway that implements the required endpoints. Models are loaded from `/v1/models` and grouped by vendor and by chat, image, or video type.

### Features

- Opens in Visual Creation for first-time users, with separate image and video sessions.
- Supports chat models exposed through compatible OpenAI, Anthropic, and Gemini protocols.
- Supports web search mode and common image, text, PDF, and document attachments.
- Supports text-to-image and image-to-image workflows for GPT Image and Gemini image models.
- Automatically uses image editing when reference images are attached and returns to text-to-image when all references are removed.
- Provides image size, aspect ratio, quality, style, and count controls.
- Supports concurrent image tasks, retries, deletion, browser caching, zoomed preview, and downloads.
- Supports compatible Seedance, Grok, Veo, and Sora video creation and task polling.
- Provides video ratio, resolution, duration, audio, first-frame, last-frame, and reference media controls.
- Supports visual context, pinned sessions, renaming, and deletion.
- Supports NewAPI external-client links that inject the user API URL and token.
- Hides Midjourney, MJ, and Niji models because the Midjourney workflow is not implemented.

Available models and parameters depend on the configured gateway and its upstream channels. The client does not create a separate model catalog beyond records returned by the API.

### Data and privacy

- API settings, API keys, preferences, and sessions are stored in browser `localStorage`.
- Base64 image results are cached in browser `IndexedDB` so they can survive a refresh.
- Video records usually retain upstream URLs whose lifetime is controlled by the provider.
- No project server receives or synchronizes conversations because this repository has no backend.
- Clearing site data removes local settings, tokens, history, and cached images.

This is a browser-to-API client. The API key is visible to the current browser user. Use scoped, quota-limited, revocable user tokens. Do not expose an administrator key.

### Requirements

- A current Chromium, Firefox, or Safari browser.
- An API service that supports the selected models and endpoints.
- CORS permission for the deployed client origin.
- Docker Engine and Docker Compose for the recommended container deployment.
- Node.js 18 or newer for tests. Node.js 20 is recommended.

### Quick start with Docker Compose

```bash
git clone git@github.com:zfg5118/DeepImage2-Video.git
cd DeepImage2-Video
docker compose up -d
```

Open:

```text
http://127.0.0.1:3001/
```

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose down
```

Update the deployment:

```bash
git pull
docker compose up -d
```

The Compose service uses the official `nginx:1.27-alpine` image and mounts all static assets read-only. Deploy the application at `/`, not at `/client` or `/console/client`.

### Deployment options

#### Docker without Compose

```bash
docker run -d \
  --name deepimage2-video \
  --restart unless-stopped \
  -p 3001:80 \
  -v "$PWD/index.html:/usr/share/nginx/html/index.html:ro" \
  -v "$PWD/styles.css:/usr/share/nginx/html/styles.css:ro" \
  -v "$PWD/app.js:/usr/share/nginx/html/app.js:ro" \
  -v "$PWD/favicon.ico:/usr/share/nginx/html/favicon.ico:ro" \
  -v "$PWD/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
  nginx:1.27-alpine
```

#### Existing Nginx server

Copy `index.html`, `styles.css`, `app.js`, and `favicon.ico` into your web root. Use `try_files $uri $uri/ /index.html;` for the root location. A complete example is provided in the Chinese Nginx section above and in the repository's [`nginx.conf`](nginx.conf).

Always enable HTTPS for production deployments.

#### GitHub Pages

The repository includes [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

After a push to `main`, the workflow attempts to enable and deploy GitHub Pages automatically. If repository policy blocks automatic enablement, open `Settings > Pages`, set `Source` to `GitHub Actions`, and rerun the workflow.

Open:

```text
https://zfg5118.github.io/DeepImage2-Video/
```

Static assets use relative URLs and therefore work under the GitHub Pages repository subpath.

#### Vercel

Import the repository, select the `Other` framework preset, leave the build command empty, and serve the repository root as static output.

CLI:

```bash
npx vercel --prod
```

#### Netlify

Import the repository, leave the build command empty, and set the publish directory to `.`.

CLI:

```bash
npx netlify-cli deploy --prod --dir=.
```

#### Cloudflare Pages

Connect the repository, leave the build command empty, and set the output directory to `.`.

CLI:

```bash
npx wrangler pages deploy . --project-name=deepimage2-video
```

#### Local static server

```bash
python3 -m http.server 3001
```

Open `http://127.0.0.1:3001/`. Avoid opening `index.html` with `file://`, because browsers may restrict API requests and storage in that context.

### Initial configuration

1. Open **Settings**.
2. Enter the `API Base URL` and `API Key`.
3. Select **Test connection**. It uses the existing `/v1/models` endpoint.
4. Open **Model settings** and select **Fetch models**.
5. Select chat, image, and video models, then save.

If the API base URL already ends in `/v1`, the client avoids adding a duplicate `/v1` segment.

### NewAPI external-client integration

Supported URL format:

```text
https://client.example.com/#/?settings={"key":"{key}","url":"{address}"}
```

NewAPI replaces `{key}` and `{address}`. The client imports the values into browser storage and removes the settings payload from the address bar.

Example NewAPI `Chats` configuration:

```json
{
  "DeepImage2-Video": "https://client.example.com/#/?settings={\"key\":\"{key}\",\"url\":\"{address}\"}"
}
```

### CORS and HTTPS

The API server must allow the deployed client origin, `GET`, `POST`, and `OPTIONS` methods, plus the `Authorization`, `Content-Type`, and `Accept` headers.

Browsers block mixed content. An HTTPS client cannot call an HTTP API. Use HTTPS for both services in production.

### Tests

No npm installation is required:

```bash
node --check app.js
node --test tests/*.test.cjs
```

The included CI workflow runs these checks on every push and pull request.

### Contributing

Issues and pull requests are welcome. Run the tests before submitting changes. Never commit API keys, access tokens, generated media, or private conversation exports.

### License

Licensed under the [MIT License](LICENSE).
