# Swiss Kit - 工具集设计文档

## 定位

面向通用开发者的本地浏览器端工具集合，类似 DevToys / IT Tools。

## MVP 工具（第一批）

| #   | 工具             | 路径                    | 说明                                    |
| --- | ---------------- | ----------------------- | --------------------------------------- |
| 1   | JSON 格式化/校验 | `/tools/json-formatter` | 美化、压缩、语法校验、树状浏览          |
| 2   | Base64 编码/解码 | `/tools/base64`         | 文本的 Base64 编解码                    |
| 3   | URL 编码/解码    | `/tools/url-encoder`    | encodeURIComponent / decodeURIComponent |
| 4   | UUID/ULID 生成器 | `/tools/uuid-generator` | 生成 UUID v4 / v7 / ULID                |

## 后续路线图

### Phase 2 — 进阶实用工具

| 工具             | 类别     |
| ---------------- | -------- |
| 正则表达式测试   | 文本处理 |
| Diff 文本对比    | 文本处理 |
| JSON ↔ YAML 互转 | 数据格式 |
| JWT 解析器       | 加密安全 |
| 颜色转换器       | 视觉颜色 |
| 密码生成器       | 生成器   |

### Phase 3 — 完善工具集

| 工具                 | 类别     |
| -------------------- | -------- |
| JSON ↔ CSV 互转      | 数据格式 |
| Markdown ↔ HTML 转换 | Markdown |
| 文本统计/转换        | 文本处理 |
| Cron 表达式解析      | 时间日期 |
| Hash 计算            | 加密安全 |
| Unix 时间戳转换      | 时间日期 |
| 进制转换             | 编码解码 |
| 二维码生成/解析      | 生成器   |
| Lorem Ipsum 生成器   | 生成器   |
| 图片 Base64 转换     | 视觉颜色 |
| HTTP 状态码速查      | 网络 Web |
| MIME 类型查询        | 网络 Web |

## 工具目录结构

每个工具遵循统一结构：

```
src/app/tools/
├── json-formatter/
│   ├── index.vue        # 工具主组件
│   └── index.ts         # 导出元信息 (title, icon, path)
├── base64/
│   ├── index.vue
│   └── index.ts
├── url-encoder/
│   ├── index.vue
│   └── index.ts
└── uuid-generator/
    ├── index.vue
    └── index.ts
```

路由注册：在 `src/app/router/index.ts` 中引用每个工具的元信息统一注册。`meta.title` 驱动侧边栏菜单自动生成。

## UI 设计约定

### 美学方向：Soft Modern

核心理念：柔和、现代、极简，通过独特的字体和色彩组合避免"AI 模板感"。

### 字体方案

- **标题/品牌字体**：选用有个性的 Display 字体（如 DM Serif Display 或 Playfair Display），赋予工具集辨识度
- **正文**：搭配高可读性的现代无衬线体（如 DM Sans）
- **代码/数据**：等宽字体（如 JetBrains Mono）用于代码和数据展示区

### 色彩体系

- 使用 CSS 变量定义完整主题
- 主色调偏暖灰/奶白背景，非纯白
- 一个鲜明的强调色（深青、琥珀或珊瑚）用于按钮和交互高亮
- 微妙渐变用于卡片背景，营造层次感

### 布局与空间

- 大间距、充分留白
- 圆角卡片容器包裹每个工具的输入/输出区
- 输入区与输出区上下布局（移动端友好）
- 实时响应输入变化

### 动效

- 页面切换时卡片 staggered fade-in
- 复制成功时的微交互反馈
- 输入框 focus 时的柔和边框过渡
- 侧边栏菜单项的 hover 滑动高亮

### 交互模式

- **输入即时计算**：无需"转换"按钮，输入变化实时输出结果
- **一键复制**：每个输出区域附带复制按钮
- **内联错误提示**：错误信息在输出区域内显示，不打断操作流
