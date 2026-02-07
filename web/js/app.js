/**
 * 曼谷小店資料庫 - 共用
 * 載入 places.json，提供類型與 TAG 列表
 */
(function () {
  "use strict";
  const DATA_URL = "data/places.json";
  let cachedPlaces = null;

  window.App = {
    loadPlaces: function () {
      if (cachedPlaces) return Promise.resolve(cachedPlaces);
      return fetch(DATA_URL)
        .then(function (res) {
          if (!res.ok) throw new Error("無法載入資料");
          return res.json();
        })
        .then(function (data) {
          cachedPlaces = data;
          return data;
        });
    },

    getTypes: function (places) {
      var types = {};
      places.forEach(function (p) {
        if (p.type) types[p.type] = true;
      });
      return ["全部"].concat(Object.keys(types).sort());
    },

    /** TAG 情緒分類：正面 / 中性 / 反面（其餘歸中性） */
    TAG_SENTIMENT: {
      positive: [
        "昔日名店", "雙飛聞名", "歐美客多", "幻想服務", "魚缸選妃", "老牌", "高檔", "近MRT", "近BTS", "服務佳",
        "氣氛熱鬧", "消費透明", "人氣旺", "交通方便", "必訪地標", "可拍照", "世界最大臥佛", "泰式按摩", "室內水上市場", "年輕人地標",
        "環境佳", "技師年輕", "營業至凌晨", "主題房", "Hostess Club", "Google高分", "可LINE預約", "環境簡約", "評價多", "性價比佳",
        "態度好", "裝潢佳", "多種方案", "情境房", "排名前茅", "全包價透明", "略貴物有所值", "摩洛哥風", "Sky房景觀", "海藻Nuru",
        "環境乾淨", "營業早", "可預約", "日式裝潢", "新開", "服務穩定", "芳香療法", "夜間營業", "角色扮演", "情境多",
        "隱私佳", "多語系", "Lounge選妃", "有泳池", "黑金裝潢", "不坑人", "顏值高", "妹子多", "知名度高", "酒吧氛圍",
        "昔日評分佳", "Eden系", "Erotic", "非傳統按摩", "可逛可玩", "性價比高", "Soi 24"
      ],
      negative: [
        "已歇業", "需注意消費", "外國人加價", "消費偏高", "觀光化", "宰客風險", "謹防詐騙", "單人需注意安全",
        "門票貴", "衣著規定嚴", "需著裝整齊", "評分較低", "評價少", "資訊有限", "性價比低", "評價兩極",
        "需確認營業", "會員制", "價位高", "位置較偏", "價位分級多"
      ]
    },

    getAllTags: function (places) {
      var tagCount = {};
      places.forEach(function (p) {
        (p.tags || []).forEach(function (t) {
          tagCount[t] = (tagCount[t] || 0) + 1;
        });
      });
      return Object.keys(tagCount).sort(function (a, b) {
        return tagCount[b] - tagCount[a];
      });
    },

    getTagsBySentiment: function (places) {
      var sentiment = this.TAG_SENTIMENT;
      var tagCount = {};
      places.forEach(function (p) {
        (p.tags || []).forEach(function (t) {
          tagCount[t] = (tagCount[t] || 0) + 1;
        });
      });
      function sortByCount(arr) {
        return arr.filter(function (t) { return tagCount[t]; }).sort(function (a, b) {
          return (tagCount[b] || 0) - (tagCount[a] || 0);
        });
      }
      var positive = sortByCount(sentiment.positive);
      var negative = sortByCount(sentiment.negative);
      var neutral = Object.keys(tagCount).filter(function (t) {
        return sentiment.positive.indexOf(t) === -1 && sentiment.negative.indexOf(t) === -1;
      }).sort(function (a, b) { return tagCount[b] - tagCount[a]; });
      return { positive: positive, neutral: neutral, negative: negative };
    },

    filterPlaces: function (places, opts) {
      var type = opts.type;
      var tag = opts.tag;
      var q = (opts.q || "").trim().toLowerCase();
      return places.filter(function (p) {
        if (type && type !== "全部" && p.type !== type) return false;
        if (tag && !(p.tags || []).includes(tag)) return false;
        if (q) {
          var text = [p.name, p.type, p.specialty, (p.tags || []).join(" ")].join(" ");
          if (text.toLowerCase().indexOf(q) === -1) return false;
        }
        return true;
      });
    },

    getPlaceById: function (places, id) {
      var num = parseInt(id, 10);
      return places.find(function (p) {
        return p.id === num;
      }) || null;
    },
  };
})();
