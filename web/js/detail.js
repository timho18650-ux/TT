/**
 * 詳情頁：依 id 顯示單店完整資訊與地圖／相片／介紹連結
 */
(function () {
  "use strict";

  function getId() {
    var params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function escapeHtml(s) {
    if (s == null) return "";
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function parseLinks(str) {
    if (!str || !str.trim()) return [];
    var parts = str.split(/\s*\|\s*/);
    var out = [];
    parts.forEach(function (part) {
      part = part.trim();
      var idx = part.lastIndexOf(" ");
      if (idx > 0) {
        var url = part.slice(idx + 1);
        var label = part.slice(0, idx).trim();
        if (url.indexOf("http") === 0) out.push({ label: label, url: url });
      }
    });
    return out;
  }

  function getMapSearchUrl(name) {
    if (!name || !name.trim()) return "";
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(name.trim() + " Bangkok");
  }

  function render(p) {
    var links = parseLinks(p.links);
    var mapUrl = getMapSearchUrl(p.name);
    var html =
      '<header class="detail-header">' +
        '<h2 class="detail-title">' + escapeHtml(p.name) + '</h2>' +
        '<p class="detail-meta">' +
          (p.type ? '<span class="detail-type">' + escapeHtml(p.type) + '</span>' : "") +
          (p.rating ? ' <span>' + escapeHtml(p.rating) + '</span>' : "") +
          (p.distance ? ' <span>' + escapeHtml(p.distance) + '</span>' : "") +
        '</p>' +
      '</header>';

    var sections = [
      { key: "specialty", title: "特色" },
      { key: "priceHkd", title: "價錢範圍（港幣）" },
      { key: "hours", title: "開店時間" },
      { key: "pros", title: "優點" },
      { key: "cons", title: "缺點" },
      { key: "remarks", title: "備註" },
      { key: "transport", title: "最近交通" },
    ];
    sections.forEach(function (s) {
      var val = p[s.key];
      if (val) {
        html += '<section class="detail-section"><h3 class="detail-section-title">' + s.title + '</h3><p class="detail-section-body">' + escapeHtml(val) + '</p></section>';
      }
    });

    if (p.tags && p.tags.length) {
      html += '<section class="detail-section"><h3 class="detail-section-title">TAG</h3><p class="detail-tags">' +
        p.tags.map(function (t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join(" ") +
      '</p></section>';
    }

    html += '<section class="detail-actions">';
    if (mapUrl) {
      html += '<a href="' + escapeHtml(mapUrl) + '" target="_blank" rel="noopener" class="btn btn-cta">開啟地圖</a> ';
      html += '<a href="' + escapeHtml(mapUrl) + '" target="_blank" rel="noopener" class="btn btn-cta">相片1</a> ';
    }
    if (p.photo2Url) {
      html += '<a href="' + escapeHtml(p.photo2Url) + '" target="_blank" rel="noopener" class="btn btn-cta">相片2</a>';
    }
    html += '</section>';

    if (links.length) {
      html += '<section class="detail-section"><h3 class="detail-section-title">相關介紹</h3><p class="detail-links">';
      links.forEach(function (l) {
        html += '<a href="' + escapeHtml(l.url) + '" target="_blank" rel="noopener" class="detail-link">' + escapeHtml(l.label) + '</a> ';
      });
      html += '</p></section>';
    }

    return html;
  }

  function init() {
    var id = getId();
    var container = document.getElementById("detail-content");
    var backLink = document.getElementById("back-link");

    if (!id) {
      container.innerHTML = '<p class="error">缺少店家 id</p>';
      return;
    }

    if (backLink) {
      backLink.href = document.referrer && document.referrer.indexOf("list.html") !== -1
        ? document.referrer
        : "list.html";
    }

    window.App.loadPlaces()
      .then(function (places) {
        var p = window.App.getPlaceById(places, id);
        if (!p) {
          container.innerHTML = '<p class="error">找不到該店家</p>';
          return;
        }
        document.title = p.name + " - 曼谷特殊小店資料庫";
        container.innerHTML = render(p);
      })
      .catch(function () {
        container.innerHTML = '<p class="error">無法載入資料</p>';
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
