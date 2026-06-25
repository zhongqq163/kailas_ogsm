# Cloudflare 部署说明

## 目标架构

- Cloudflare Pages：托管 `web/` 静态前端。
- Pages Functions：提供 `/api/state` 数据接口。
- Cloudflare D1：保存 OGSM JSON 状态，让电脑和手机看到同一份数据。

## 文件说明

- `wrangler.toml`：Cloudflare 项目配置。
- `schema.sql`：D1 数据库表结构。
- `functions/api/state.js`：读取和保存 OGSM 状态的 API。
- `web/`：前端静态页面。

## 初始化 D1

```bash
npx wrangler d1 create agsm-dashboard-db
```

把命令返回的 `database_id` 填入 `wrangler.toml`：

```toml
database_id = "这里替换成实际 database_id"
```

初始化远程数据库表：

```bash
npx wrangler d1 execute agsm-dashboard-db --remote --file=schema.sql
```

## 本地 Cloudflare 预览

```bash
npx wrangler pages dev web --compatibility-date=2026-06-25 --d1=DB=agsm-dashboard-db
```

访问本地预览地址后，前端会优先读写 `/api/state`；如果 API 不可用，会自动回退浏览器本地存储。

## 发布到 Cloudflare Pages

推荐 Pages 设置：

- Project name：`agsm-dashboard`
- Build command：留空
- Build output directory：`web`
- Functions directory：`functions`
- D1 binding：`DB` -> `agsm-dashboard-db`

发布后首次打开页面，如果 D1 里还没有数据，前端会把当前初始化数据写入 D1。

## 当前限制

- 当前账号仍是前端演示账号，不是真正安全登录。
- 当前同步策略是整份 JSON 覆盖保存，适合小团队轻量使用。
- 多人同时编辑时，最后保存的人会覆盖前一次保存。
- 正式多人协作建议后续拆表、加登录鉴权、操作日志和冲突处理。
