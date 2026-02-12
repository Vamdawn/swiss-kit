# Swiss Kit - 项目初始化设计

## 概述

Swiss Kit 是一个本地运行的浏览器端小工具集合。用户通过 `npx swiss-kit` 一键启动本地服务并打开浏览器使用。

## 技术栈

| 类别      | 选型               |
| --------- | ------------------ |
| 前端框架  | Vue 3 + TypeScript |
| 构建工具  | Vite               |
| UI 组件库 | Naive UI           |
| 路由      | Vue Router         |
| CLI 编译  | tsup               |
| 静态服务  | sirv               |
| 包管理器  | pnpm               |

## 质量保障

| 类别      | 选型                                                         |
| --------- | ------------------------------------------------------------ |
| Lint      | ESLint (flat config) + eslint-plugin-vue + typescript-eslint |
| 格式化    | Prettier + eslint-config-prettier                            |
| 测试      | Vitest + @vue/test-utils                                     |
| Git Hooks | simple-git-hooks + lint-staged                               |

## 项目结构

```
swiss-kit/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── .prettierrc
├── index.html
├── src/
│   ├── cli/
│   │   └── index.ts          # CLI 入口：启动服务 + 打开浏览器
│   └── app/
│       ├── main.ts            # Vue 应用入口
│       ├── App.vue            # 根组件
│       ├── router/
│       │   └── index.ts       # 路由配置
│       ├── views/
│       │   └── Home.vue       # 首页/工具列表
│       ├── tools/             # 工具目录（后续扩展）
│       └── components/
│           └── Layout.vue     # 侧边栏 + 内容区布局
```

## 使用方式

- 开发：`pnpm dev` 启动 Vite 开发服务器
- 构建：`pnpm build` 构建前端 + 编译 CLI
- 发布后：`npx swiss-kit` 启动本地服务并打开浏览器
- 检查：`pnpm lint` / `pnpm format`
- 测试：`pnpm test`

## 工具扩展约定

在 `src/app/tools/` 下新建子目录，导出组件和元信息，在路由中注册即可。
