# blog-frontend

[shichiya-blog](https://github.com/ShiChiYa7493/shichiya-blog) 的 Next.js 14 前端，也是该仓库的子模块 `packages/frontend`。包含公开博客、相册和后台管理。浏览器通过同源 `/api` 访问 [blog-server](https://github.com/ShiChiYa7493/blog-server)。

## 页面

- `/blog`：文章列表。
- `/blog/posts/:id`：文章详情、目录、阅读时间和阅读量。
- `/blog/categories/:slug`、`/blog/tags/:slug`：分类与标签筛选。
- `/blog/archives`、`/blog/search`、`/blog/gallery`、`/blog/about`：归档、搜索、相册和关于页。
- `/admin/login`：后台登录。
- `/admin`：文章、分类、标签、评论、相册、相册分类和管理员资料。

评论组件还在，文章详情页当前没有挂载公开评论区。

## 本地开发

需要先有可访问的后端，默认 `http://127.0.0.1:3001`。

```bash
npm install
cp .env.example .env
npm run dev
```

开发服务器监听 `http://localhost:3000`，后台入口是 `http://localhost:3000/admin/login`。

`API_URL` 只给 Next.js 服务端请求使用。浏览器请求走相对路径，由 `next.config.mjs` 把 `/api/*` 和 `/uploads/*` 转到本机后端。

## 构建

```bash
npm run build
npm run start
```

在博客仓库里对应的命令是 `npm run dev:frontend` 和 `npm run build:frontend`。生产环境由博客仓库的 PM2 进程 `blog-web` 监听 `127.0.0.1:3000`，公网入口由 Nginx 提供。

这个仓库不包含数据库、上传目录和机器人。部署整站见 [shichiya-blog](https://github.com/ShiChiYa7493/shichiya-blog)。
