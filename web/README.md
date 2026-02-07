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

## 檔案說明

- `index.html` — 首頁（分類、TAG、搜尋）
- `list.html` — 列表（篩選、排序、卡片）
- `detail.html` — 店家詳情（地圖／相片／介紹連結）
- `js/app.js` — 共用（載入 JSON、篩選）
- `js/list.js` — 列表邏輯
- `js/detail.js` — 詳情邏輯
- `css/style.css` — 手機優先樣式
- `data/places.json` — 由 Excel 匯出之資料
