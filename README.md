# vite-plugin-uni-replace-image

[中文](#中文) | [English](#english)

<a name="中文"></a>

# 中文文档

一个用于 UniApp 项目的 Vite 插件，在构建过程中自动将 UniApp 的图像埋点替换为 Base64 数据。

## 功能特性

- **自动替换**：扫描构建输出，查找特定的图片文件名（如 `shadow-grey.png`, `shadow-blue.png`）。
- **Base64 内联**：将图片引用替换为优化后的 Base64 字符串，减少 HTTP 请求。
- **多端支持**：支持多种 UniApp 平台，包括微信小程序 (`mp-weixin`)、支付宝小程序 (`mp-alipay`)、H5 和 App。
- **CSS & JS 支持**：同时处理样式文件 (CSS/WXSS/etc.) 和 JavaScript 包中的引用。
- **开发模式支持**：可选在开发模式（`vite build --watch`）下运行。

## 安装

```bash
npm install vite-plugin-uni-replace-image --save-dev
```

## 使用方法

在 `vite.config.ts` 中添加插件：

```typescript
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import replaceImage from 'vite-plugin-uni-replace-image'

export default defineConfig({
  plugins: [
    uni(),
    replaceImage({
      // 选项 (可选)
      runOnDev: false // 默认为 false，仅在生产构建时运行。设为 true 可在开发模式下运行。
    })
  ]
})
```

## 配置选项

| 选项 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `runOnDev` | `boolean` | `false` | 是否在开发模式（watch 模式）下运行插件。默认情况下，插件仅在生产构建 (`vite build`) 时运行以提高开发性能。 |

## 工作原理

该插件挂载在 Vite 构建的 `closeBundle` 阶段。它会扫描输出目录（例如 `dist/build/mp-weixin`），查找匹配当前平台样式扩展名（如 `.wxss`）的文件以及 `.js` 文件。

它会查找以下图片的引用，并将其替换为预定义的 Base64 字符串：

- `shadow-grey.png`
- `shadow-blue.png`
- `shadow-green.png`
- `shadow-orange.png`
- `shadow-red.png`
- `shadow-yellow.png`

这对于像阴影渐变这样的小型、高频使用的资源特别有用，内联可以显著提高性能。

---

<a name="english"></a>

# English Documentation

A Vite plugin for UniApp projects that automatically replaces UniApp image tracking points with Base64 data during the build process.

## Features

- **Automatic Replacement**: Scans build output for specific image filenames (e.g., `shadow-grey.png`, `shadow-blue.png`).
- **Base64 Inlining**: Replaces image references with optimized Base64 strings to reduce HTTP requests.
- **Multi-Platform Support**: Works with various UniApp platforms including WeChat Mini Program (`mp-weixin`), Alipay (`mp-alipay`), H5, and App.
- **CSS & JS Support**: Handles replacements in both style files (CSS/WXSS/etc.) and JavaScript bundles.
- **Dev Mode Support**: Optionally run in development mode (`vite build --watch`).

## Installation

```bash
npm install vite-plugin-uni-replace-image --save-dev
```

## Usage

Add the plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import replaceImage from 'vite-plugin-uni-replace-image'

export default defineConfig({
  plugins: [
    uni(),
    replaceImage({
      // Options (optional)
      runOnDev: false // Default is false. Set to true to run in development mode.
    })
  ]
})
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `runOnDev` | `boolean` | `false` | Whether to run the plugin in development mode (watch mode). By default, it only runs during production builds (`vite build`) to improve development performance. |

## How it Works

The plugin hooks into the `closeBundle` stage of the Vite build. It scans the output directory (e.g., `dist/build/mp-weixin`) for files matching the platform's style extension (e.g., `.wxss`) and `.js` files.

It looks for references to the following images and replaces them with pre-defined Base64 strings:

- `shadow-grey.png`
- `shadow-blue.png`
- `shadow-green.png`
- `shadow-orange.png`
- `shadow-red.png`
- `shadow-yellow.png`

This is particularly useful for small, frequently used assets like shadow gradients where inlining improves performance.

## License

MIT
