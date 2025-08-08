# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

SD Style Lab 是一个用于展示和比较 Stable Diffusion 模型的 Next.js 网站。用户可以浏览不同的 AI 模型，查看样例图片，并通过表格比较不同 prompt 的生成效果。

## 开发命令

### 基础开发流程
- `pnpm dev` - 启动开发服务器（使用 Turbopack）
- `pnpm build` - 构建生产版本
- `pnpm start` - 启动生产服务器
- `pnpm lint` - 运行 ESLint 检查
- `pnpm typecheck` - 运行 TypeScript 类型检查

### 包管理器
项目使用 pnpm 作为包管理器，版本为 `10.12.2`

## 项目架构

### 核心技术栈
- **框架**: Next.js 15.3.5 (App Router)
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4.0 + shadcn/ui 组件
- **图像处理**: Cloudflare Image Resizing
- **状态管理**: React hooks + Context
- **虚拟化**: react-virtuoso (用于大量图片展示)

### 目录结构
```
app/
├── page.tsx          # 主页，展示模型卡片网格
├── model/[model_name]/page.tsx  # 动态模型详情页
├── faq/page.tsx      # FAQ 页面
└── layout.tsx        # 全局布局

components/
├── custom/           # 自定义业务组件
│   ├── ModelCard.tsx        # 模型展示卡片
│   ├── ModelTable.tsx       # 核心表格组件（虚拟化）
│   ├── ModelImageDialog.tsx # 图片弹窗对话框
│   ├── CopyButton.tsx       # 复制功能组件
│   └── mode-toggle.tsx      # 主题切换器
└── ui/               # shadcn/ui 基础组件

public/data/          # 模型数据存储
├── [model_name]/
│   ├── model_info.json      # 模型基本信息
│   ├── sd_style_table.csv   # 对比数据表格
│   ├── image_data.json      # 图片元数据
│   └── common_prompts.csv   # 常用提示词
```

### 数据架构
每个模型在 `public/data/[model_name]/` 目录下包含：
- `model_info.json`: 模型标题、描述、链接、封面图和样例图片
- `sd_style_table.csv`: 不同艺术家风格的对比表格数据  
- `image_data.json`: 包含图片 URL、生成参数和详细信息
- `common_prompts.csv`: 该模型推荐的常用提示词

### 关键组件说明
- **ModelTable.tsx**: 使用 VirtuosoGrid 实现大量图片的虚拟化渲染
- **图像加载**: 通过 Cloudflare Image Resizing 实现自适应图片优化
- **响应式设计**: 使用 Tailwind 实现移动端适配
- **主题系统**: next-themes 实现明暗主题切换

### URL 路由
- `/` - 主页，显示所有可用模型
- `/model/[model_name]` - 模型详情页，显示对比表格和图片
- `/faq` - 帮助和常见问题页面

## 开发注意事项

### 图片处理
- 所有图片通过自定义 `image-loader.ts` 使用 Cloudflare Image Resizing
- 图片域名: `sd-style-images.wall-breaker-no4.xyz`
- 支持 WebP/AVIF 格式自动转换和尺寸优化

### 数据加载
- 模型数据在构建时通过文件系统 API 读取
- CSV 数据使用 papaparse 库解析
- 支持中英文双语描述

### 性能优化
- 使用 react-virtuoso 虚拟化大量图片渲染
- 图片懒加载和响应式尺寸
- Next.js SSG 静态生成优化

### UI 组件
项目基于 shadcn/ui，所有组件都在 `components/ui/` 目录下，使用 Radix UI 底层实现。