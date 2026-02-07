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
