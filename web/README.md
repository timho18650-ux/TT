# 曼谷特殊小店資料庫（手機網頁）

依 `地點報表.xlsx` 產生的靜態資料庫，具分類、TAG 篩選與搜尋。

## 更新資料

Excel 更新後，在專案根目錄執行：

```bash
python web/export_xlsx_to_json.py
```

會更新 `web/data/places.json`。

## 本機預覽

因瀏覽器會阻擋 `file://` 下載 JSON，請用本機伺服器開啟：

```bash
cd c:\TRAVEL\web
python -m http.server 8080
```

再於手機或電腦瀏覽器開啟：<http://localhost:8080>

## 部署到 Vercel（可直接使用）

1. 登入 [Vercel](https://vercel.com)，選擇 **Add New → Project**，匯入 GitHub 專案 `timho18650-ux/TT`。
2. **重要**：在設定裡將 **Root Directory** 設為 `web`（因為網站檔案在 `web` 資料夾內）。
3. **Build Command** 留空即可（純靜態，無需建置）。
4. 點 **Deploy**，完成後會得到一個 `*.vercel.app` 網址。

之後若在 GitHub 更新程式或重新執行 `export_xlsx_to_json.py` 並 push，Vercel 會自動重新部署。

## 檔案說明

- `index.html` — 首頁（分類、TAG、搜尋）
- `list.html` — 列表（篩選、排序、卡片）
- `detail.html` — 店家詳情（地圖／相片／介紹連結）
- `js/app.js` — 共用（載入 JSON、篩選）
- `js/list.js` — 列表邏輯
- `js/detail.js` — 詳情邏輯
- `css/style.css` — 手機優先樣式
- `data/places.json` — 由 Excel 匯出之資料
