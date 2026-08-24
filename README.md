# 博客前端

`packages/frontend` 是 shichiya-blog 的 Next.js 14 App Router 前端，包含公开博客、相册和后台管理界面。项目使用 React 18、Tailwind CSS、shadcn/ui、framer-motion，并通过同源 `/api` 请求访问 NestJS 后端。

## 页面

- `/blog`：文章列表。
- `/blog/posts/:id`：文章详情、目录、阅读时间和阅读量。
- `/blog/categories/:slug`、`/blog/tags/:slug`：分类与标签筛选。
- `/blog/archives`、`/blog/search`、`/blog/gallery`、`/blog/about`：归档、搜索、相册和关于页。
- `/admin/login`：后台登录。
- `/admin`：文章、分类、标签、评论、相册、相册分类和管理员资料管理。

评论组件和后端接口仍保留，但文章详情页当前没有挂载公开评论区。

## 开发

先在仓库根目录安装依赖并配置环境变量：

```bash
npm install
cp packages/frontend/.env.example packages/frontend/.env
```

`API_URL` 供服务端渲染请求后端，默认是 `http://127.0.0.1:3001`。浏览器请求使用相对路径，并由 `next.config.mjs` 将 `/api/*` 和 `/uploads/*` 转发到本机后端。

从仓库根目录启动：

```bash
npm run dev:frontend
```

前端监听 `http://localhost:3000`，后台入口为 `http://localhost:3000/admin/login`。

## 构建

```bash
npm run build:frontend
```

生产环境由 PM2 以 `blog-web` 运行，监听 `127.0.0.1:3000`，并由 Nginx 提供公网入口。完整安装、数据库初始化和部署步骤见[仓库 README](../../README.md)。
