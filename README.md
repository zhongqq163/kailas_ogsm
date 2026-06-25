# AGSM Dashboard

凯乐石 IT-数据应用支持组 OGSM 进度汇报与维护页面。

## 功能

- 领导看板：查看成员、目标、指标、行动完成情况。
- 个人展示：个人账号只查看本人 OGSM。
- 维护中心：新增、编辑、删除目标、指标和行动，并勾选完成项。
- 本地兜底：Cloudflare API 不可用时使用浏览器 `localStorage`。
- 云端同步：部署到 Cloudflare Pages 后通过 `/api/state` 读写 D1。

## 本地静态运行

```bash
python -m http.server 8088 --bind 0.0.0.0 --directory web
```

本机访问：

```text
http://127.0.0.1:8088/
```

内网访问示例：

```text
http://172.20.1.186:8088/
```

## Cloudflare

部署步骤见：

```text
DEPLOY_CLOUDFLARE.md
```

核心文件：

- `web/`：前端页面。
- `functions/api/state.js`：Cloudflare Pages Function。
- `schema.sql`：D1 数据表。
- `wrangler.toml`：Cloudflare 配置。

## 注意

- 当前账号仍是前端演示账号，不是真正安全登录。
- `wrangler.toml` 里的 `database_id` 需要部署前替换成真实 D1 database id。
- 原始 Excel、日志、Office 临时文件默认不纳入 Git。
