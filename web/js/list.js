/**
 * 列表頁：依 type / tag / q 篩選，排序，渲染卡片
 */
(function () {
  "use strict";

  function getParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      type: params.get("type") || "",
      tag: params.get("tag") || "",
      q: params.get("q") || "",
    };
  }

  function parseDistance(s) {
    if (!s || s === "—") return Infinity;
    var m = s.match(/約\s*([\d.]+)\s*km/);
    return m ? parseFloat(m[1], 10) : Infinity;
  }

  function parseRating(s) {
    if (!s) return 0;
    var m = s.match(/([\d.]+)/);
    return m ? parseFloat(m[1], 10) : 0;
  }

  /** 從 priceHkd 字串解析平均價錢（港幣），無則回傳 Infinity 排到最後 */
  function parsePriceHkd(s) {
    if (!s || !s.trim()) return Infinity;
    var nums = s.replace(/,/g, "").match(/[\d.]+/g);
    if (!nums || nums.length === 0) return Infinity;
    var sum = 0;
    for (var i = 0; i < nums.length; i++) sum += parseFloat(nums[i], 10);
    return sum / nums.length;
  }

  function sortPlaces(places, order) {
    var list = places.slice();
    if (order === "distance") {
      list.sort(function (a, b) {
        return parseDistance(a.distance) - parseDistance(b.distance);
      });
    } else if (order === "rating") {
      list.sort(function (a, b) {
        return parseRating(b.rating) - parseRating(a.rating);
      });
    } else if (order === "price") {
      list.sort(function (a, b) {
        return parsePriceHkd(a.priceHkd) - parsePriceHkd(b.priceHkd);
      });
    } else {
      list.sort(function (a, b) {
        return (a.name || "").localeCompare(b.name || "");
      });
    }
    return list;
  }

  function escapeHtml(s) {
    if (s == null) return "";
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function renderCard(p) {
    var type = escapeHtml(p.type || "");
    var price = escapeHtml(p.priceHkd || "");
    var rating = escapeHtml(p.rating || "");
    var distance = escapeHtml(p.distance || "");
    var tags = (p.tags || []).slice(0, 3).map(escapeHtml).join("、");
    return (
      '<article class="card" data-id="' + p.id + '">' +
        '<a href="detail.html?id=' + p.id + '" class="card-link">' +
          '<h3 class="card-title">' + escapeHtml(p.name) + '</h3>' +
          (type ? '<p class="card-meta"><span class="card-type">' + type + '</span></p>' : "") +
          (price || rating || distance
            ? '<p class="card-meta">' +
                (price ? '<span>' + price + '</span>' : "") +
                (rating ? ' <span>' + rating + '</span>' : "") +
                (distance ? ' <span>' + distance + '</span>' : "") +
              '</p>'
            : "") +
          (tags ? '<p class="card-tags">' + tags + '</p>' : "") +
        '</a>' +
      '</article>'
    );
  }

  function render(places, order) {
    var sorted = sortPlaces(places, order);
    var html = sorted.length
      ? sorted.map(renderCard).join("")
      : '<p class="empty">沒有符合條件的店家</p>';
    document.getElementById("card-list").innerHTML = html;
  }

  function showFilterHint(params) {
    var el = document.getElementById("filter-tags");
    var parts = [];
    if (params.type) parts.push("分類：" + params.type);
    if (params.tag) parts.push("TAG：" + params.tag);
    if (params.q) parts.push('搜尋：「' + params.q + '」');
    el.textContent = parts.length ? "目前篩選：" + parts.join("、") : "";
  }

  function init() {
    var params = getParams();
    var searchInput = document.getElementById("list-search");
    var sortSelect = document.getElementById("sort-select");
    var form = document.getElementById("search-form");

    if (searchInput) searchInput.value = params.q;
    document.getElementById("param-type").value = params.type;
    document.getElementById("param-tag").value = params.tag;
    showFilterHint(params);

    window.App.loadPlaces()
      .then(function (places) {
        var filtered = window.App.filterPlaces(places, {
          type: params.type || undefined,
          tag: params.tag || undefined,
          q: params.q || undefined,
        });
        var order = sortSelect ? sortSelect.value : "name";
        render(filtered, order);

        if (sortSelect) {
          sortSelect.addEventListener("change", function () {
            render(filtered, sortSelect.value);
          });
        }
      })
      .catch(function () {
        document.getElementById("card-list").innerHTML =
          '<p class="error">無法載入資料</p>';
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
