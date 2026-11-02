// 全球 AI 算力超级基建雷达 & 全球总容量 BI 报表引擎 (v8.0 全球全域+多世界副本+非洲/中亚/亚太深度支持)

class DatacenterRadarApp {
  constructor() {
    this.storageKey = "AI_DATACENTER_RADAR_STORE_V12_OPERATIONAL_FILTER";
    this.datacenters = this.loadData();
    this.currentFilter = { region: "all", category: "all", status: "all", search: "" };
    this.selectedCenter = null;
    this.map = null;
    this.markerLayers = [];
    this.currentTileLayer = null;
    this.satelliteLabelLayer = null;
    this.isPickingLocation = false;
    this.currentView = "map"; // 'map' | 'bi'
    this.charts = {}; // 存储 Chart.js 实例

    // 专属公司/机构色彩体系
    this.companyColors = {
      "Anthropic": { color: "#d97757", text: "#b35338", bg: "#fdf2ee" },
      "DeepSeek": { color: "#0284c7", text: "#0369a1", bg: "#e0f2fe" },
      "CoreWeave": { color: "#9333ea", text: "#7e22ce", bg: "#f3e8ff" },
      "软银集团": { color: "#b45309", text: "#92400e", bg: "#fef3c7" },
      "SpaceX": { color: "#ea580c", text: "#c2410c", bg: "#ffedd5" },
      "微软/OpenAI": { color: "#0078d4", text: "#005a9e", bg: "#e0f2fe" },
      "Meta": { color: "#2563eb", text: "#1d4ed8", bg: "#dbeafe" },
      "Google": { color: "#16a34a", text: "#15803d", bg: "#dcfce7" },
      "Amazon": { color: "#d97706", text: "#b45309", bg: "#fef3c7" },
      "商汤科技": { color: "#0ea5e9", text: "#0284c7", bg: "#e0f2fe" },
      "字节跳动": { color: "#06b6d4", text: "#0891b2", bg: "#cffafe" },
      "华为/腾讯": { color: "#dc2626", text: "#b91c1c", bg: "#fee2e2" },
      "阿里/华为/快手": { color: "#dc2626", text: "#b91c1c", bg: "#fee2e2" },
      "澳门大学/横琴": { color: "#059669", text: "#047857", bg: "#d1fae5" },
      "Crusoe": { color: "#15803d", text: "#166534", bg: "#dcfce7" },
      "Nebius": { color: "#4f46e5", text: "#4338ca", bg: "#e0e7ff" },
      "Lambda": { color: "#6366f1", text: "#4f46e5", bg: "#e0e7ff" },
      "Reliance Jio": { color: "#0284c7", text: "#0369a1", bg: "#e0f2fe" },
      "Yotta": { color: "#d97706", text: "#b45309", bg: "#fef3c7" },
      "AdaniConneX": { color: "#059669", text: "#047857", bg: "#d1fae5" },
      "YTL & Nvidia": { color: "#16a34a", text: "#15803d", bg: "#dcfce7" },
      "Singtel": { color: "#e11d48", text: "#be123c", bg: "#ffe4e6" },
      "AirTrunk": { color: "#0f766e", text: "#115e59", bg: "#ccfbf1" },
      "NextDC": { color: "#7c3aed", text: "#6d28d9", bg: "#ede9fe" },
      "NVIDIA/Aeonian": { color: "#65a30d", text: "#4d7c0f", bg: "#ecfccb" },
      "沙特NEOM": { color: "#059669", text: "#047857", bg: "#d1fae5" },
      "G42/微软": { color: "#0284c7", text: "#0369a1", bg: "#e0f2fe" },
      "中亚主权算力": { color: "#0284c7", text: "#0369a1", bg: "#e0f2fe" },
      "default": { color: "#0284c7", text: "#0369a1", bg: "#e0f2fe" }
    };

    this.initMap();
    this.bindEvents();
    this.renderMetrics();
    this.renderList();
    this.renderMarkers();

    // 默认高亮并聚焦 DeepSeek 乌兰察布超级智算集群
    if (window.location.hash === "#pacific") {
      setTimeout(() => {
        if (this.map) this.map.setView([25.0, 175.0], 3);
      }, 300);
    } else if (window.location.hash === "#bi") {
      this.switchToView("bi");
    } else if (this.datacenters.length > 0) {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 500);
    }
  }

  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return window.mergeReviewedData(parsed);
      }
    } catch (e) {
      console.warn("读取本地缓存失败，使用最新种子数据", e);
    }
    return [...(window.DEFAULT_DATACENTERS || [])];
  }

  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.datacenters));
      this.renderMetrics();
    } catch (e) {
      console.error("保存数据失败", e);
    }
  }

  initMap() {
    this.map = L.map("map", {
      center: [25.0, 30.0],
      zoom: 2.5,
      zoomSnap: 0.5,
      minZoom: 2.5,
      maxZoom: 18,
      zoomControl: false,
      worldCopyJump: true // 开启跨越日界线时平滑复制支持
    });

    L.control.zoom({ position: "bottomright" }).addTo(this.map);

    this.tileLayers = {
      amap: L.tileLayer("https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7", {
        subdomains: "1234",
        attribution: '&copy; 高德地图 免Key无水印',
        maxZoom: 18
      }),
      osm: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        subdomains: "abc",
        attribution: '&copy; OpenStreetMap 官方全球开源',
        maxZoom: 19
      }),
      satellite: L.tileLayer("https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}", {
        subdomains: "1234",
        attribution: '&copy; 高清遥感卫星 免Key',
        maxZoom: 18
      })
    };

    this.satelliteLabels = L.tileLayer("https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8", {
      subdomains: "1234",
      maxZoom: 18
    });

    this.currentTileLayer = this.tileLayers.amap;
    this.currentTileLayer.addTo(this.map);

    this.map.on("zoomend", () => this.renderMarkers());

    this.map.on("click", (e) => {
      if (this.isPickingLocation) {
        const { lat, lng } = e.latlng;
        document.getElementById("modalLat").value = lat.toFixed(6);
        document.getElementById("modalLng").value = lng.toFixed(6);
        this.showToast(`已选取坐标：${lat.toFixed(4)}, ${lng.toFixed(4)}`, "success");
        this.isPickingLocation = false;
        document.getElementById("btnPickMap").classList.remove("ring-2", "ring-sky-500");
        document.getElementById("newCenterModal").classList.remove("hidden");
      }
    });
  }

  switchTileLayer(type) {
    if (this.currentTileLayer) {
      this.map.removeLayer(this.currentTileLayer);
    }
    if (this.map.hasLayer(this.satelliteLabels)) {
      this.map.removeLayer(this.satelliteLabels);
    }

    document.getElementById("map").classList.toggle("satellite-mode", type === "satellite");
    this.currentTileLayer = this.tileLayers[type] || this.tileLayers.amap;
    this.currentTileLayer.addTo(this.map);

    if (type === "satellite") {
      this.satelliteLabels.addTo(this.map);
    }
  }

  escapeHTML(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  companyLogo(tag) {
    const aliases = {'微软/OpenAI':['微软/OpenAI','OpenAI'],'Mistral/Scaleway':['Mistral/Scaleway','Scaleway'],'G42/微软':['G42/微软','微软/OpenAI'],'YTL & Nvidia':['YTL & Nvidia','NVIDIA']};
    return '<span class="company-logo" title="'+this.escapeHTML(tag)+'" aria-label="'+this.escapeHTML(tag)+'">'+(aliases[tag]||[tag]).map(k=> window.COMPANY_LOGOS[k] ? '<img src="'+window.COMPANY_LOGOS[k]+'" alt="'+this.escapeHTML(k)+'" width="28" height="28">' : '<span class="logo-fallback">'+this.escapeHTML(k)+'</span>').join('')+'</span>';
  }
  chipDetails(center) {
    const e=center.chipEvidence || {level:'基地级未披露',summary:'尚无核实资料',note:'未取得该基地芯片组成的公开证据。',sources:[]};
    return '<section class="chip-evidence"><div class="evidence-heading"><h4>芯片组成</h4><span>'+this.escapeHTML(e.level)+'</span></div><strong>'+this.escapeHTML(e.summary)+'</strong><p>'+this.escapeHTML(e.note)+'</p><div class="chip-ratio">数量 / 配比：未披露 · 不据地区推定</div>'+this.sourceLinks(e.sources)+'</section>';
  }
  sourceLinks(sources) { return (sources||[]).map(([title,url])=>'<a class="source-link" href="'+this.escapeHTML(url)+'" target="_blank" rel="noopener noreferrer">↗ '+this.escapeHTML(title)+'</a>').join(''); }
  getCompanyColor(tag) {
    return this.companyColors[tag] || this.companyColors["default"];
  }

  // 辅助解析功率 (MW)
  parsePowerMW(powerStr) {
    if (!powerStr || /未核实|未披露|未统一/.test(powerStr)) return 0;
    const str = String(powerStr).replace(/,/g, "");
    
    // 匹配 "5,000 MW (5 GW)" 或 "5000 MW" 或 "1200 MW" 或 "200+ MW"
    const mwMatch = str.match(/(\d+(\.\d+)?)\s*\+?\s*MW/i);
    if (mwMatch) {
      return parseFloat(mwMatch[1]);
    }
    const gwMatch = str.match(/(\d+(\.\d+)?)\s*\+?\s*GW/i);
    if (gwMatch) {
      return parseFloat(gwMatch[1]) * 1000;
    }
    const numMatch = str.match(/(\d+(\.\d+)?)/);
    if (numMatch) {
      return parseFloat(numMatch[1]);
    }
    return 0;
  }

  // 辅助解析投资金额 (十亿美元 $B)
  parseInvestmentBillion(invStr) {
    if (!invStr) return 0;
    const str = String(invStr).replace(/,/g, "");
    
    // 美元 $
    const usdMatch = str.match(/\$(\d+(\.\d+)?)\s*(亿|B|Billion)?/i);
    if (usdMatch) {
      return parseFloat(usdMatch[1]);
    }
    // 人民币 ¥ / 亿元 (按汇率约 1 USD = 7.2 RMB)
    const rmbMatch = str.match(/(?:¥|RMB|人民币)\s*(\d+(\.\d+)?)/i) || str.match(/(\d+(\.\d+)?)\s*亿元/);
    if (rmbMatch) {
      return parseFloat(rmbMatch[1]) / 7.2;
    }
    // 英镑 £ (按汇率约 1 GBP = 1.28 USD)
    const gbpMatch = str.match(/£\s*(\d+(\.\d+)?)/);
    if (gbpMatch) {
      return parseFloat(gbpMatch[1]) * 1.28;
    }
    // 澳元 (按 1 AUD = 0.66 USD)
    const audMatch = str.match(/(\d+(\.\d+)?)\s*亿澳元/);
    if (audMatch) {
      return parseFloat(audMatch[1]) * 0.66;
    }
    // 新币 (按 1 SGD = 0.75 USD)
    const sgdMatch = str.match(/(\d+(\.\d+)?)\s*亿新币/);
    if (sgdMatch) {
      return parseFloat(sgdMatch[1]) * 0.75;
    }
    // 林吉特 (按 1 MYR = 0.22 USD)
    const myrMatch = str.match(/(\d+(\.\d+)?)\s*亿(?:马来西亚)?林吉特/);
    if (myrMatch) {
      return parseFloat(myrMatch[1]) * 0.22;
    }

    const genericMatch = str.match(/(\d+(\.\d+)?)/);
    return genericMatch ? parseFloat(genericMatch[1]) : 0;
  }

  renderMetrics() {
    for (const status of ['all','operational','construction','planned','unverified']) {
      const count=this.datacenters.filter(d=>status==='all'||d.status===status).length;
      const b=document.querySelector('[data-status="'+status+'"]');
      if(b)b.textContent=({all:'全部阶段',operational:'已运营',construction:'在建',planned:'规划',unverified:'待核实'}[status])+' · '+count;
    }

    const values = {total: this.datacenters, operational: this.datacenters.filter(d => d.status === 'operational'), construction: this.datacenters.filter(d => d.status === 'construction')};
    for (const [key, rows] of Object.entries(values)) {
      const el = document.getElementById('hud' + key[0].toUpperCase() + key.slice(1));
      if (el) el.innerHTML = (key==='total'?rows.filter(d=>d.evidence?.sources.some(s=>s.type!=='X / 待复核')).length:rows.length) + '<em>项</em>';
    }
    document.getElementById('hudCount').innerHTML = this.datacenters.length + '<em>处</em>';
    document.getElementById('hudRegions').textContent = new Set(this.datacenters.map(d => d.region)).size + ' 个战略区域';
    for (const key of ['operational','construction']) document.getElementById('hud' + key[0].toUpperCase() + key.slice(1) + 'Count').textContent = values[key].length + ' 处基地';

    let totalMW = 0;
    let totalInvestB = 0;

    this.datacenters.forEach(d => {
      totalMW += this.parsePowerMW(d.powerMW);
      totalInvestB += this.parseInvestmentBillion(d.investment);
    });

    const totalGW = (totalMW / 1000).toFixed(1);

    // 更新页面统计显示 (如果存在对应元素)
    const metricPowerElem = document.getElementById("biMetricPower");
    if (metricPowerElem) {
      metricPowerElem.innerText = `${totalGW} GW (${totalMW.toLocaleString()} MW)`;
    }
    const metricInvElem = document.getElementById("biMetricInvestment");
    if (metricInvElem) {
      metricInvElem.innerText = "未统一核验";
    }
  }

  getFilteredData() {
    return this.datacenters.filter(item => {
      const matchRegion = this.currentFilter.region === "all" || item.region === this.currentFilter.region;
      const matchCategory = this.currentFilter.category === "all" || item.category === this.currentFilter.category;
      const matchStatus = this.currentFilter.status === "all" || item.status === this.currentFilter.status;
      
      const search = (this.currentFilter.search || "").toLowerCase().trim();
      const matchSearch = !search ||
        (item.name && item.name.toLowerCase().includes(search)) ||
        (item.company && item.company.toLowerCase().includes(search)) ||
        (item.location && item.location.toLowerCase().includes(search)) ||
        (item.gpuCount && item.gpuCount.toLowerCase().includes(search)) ||
        (item.powerSource && item.powerSource.toLowerCase().includes(search)) ||
        (item.cooling && item.cooling.toLowerCase().includes(search));

      return matchRegion && matchCategory && matchStatus && matchSearch;
    });
  }

  renderList() {
    const container = document.getElementById("centersList");
    if (!container) return;
    container.innerHTML = "";

    const filtered = this.getFilteredData();
    document.getElementById("resultCount").textContent = String(filtered.length).padStart(2, "0");

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="text-center py-10 text-slate-400 text-xs font-mono">
          未检索到匹配的算力中心记录
        </div>
      `;
      return;
    }

    filtered.forEach(center => {
      const isSelected = this.selectedCenter && this.selectedCenter.id === center.id;
      const compConf = this.getCompanyColor(center.companyTag);

      const statusMap = {
        operational: { text: "已投产", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        construction: { text: "在建中", class: "bg-amber-50 text-amber-700 border-amber-200" },
        planned: { text: "规划中", class: "bg-sky-50 text-sky-700 border-sky-200" }
      };
      const st = statusMap[center.status] || { text: center.statusText || "推进中", class: "bg-slate-50 text-slate-700 border-slate-200" };

      const card = document.createElement("div");
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " ") { e.preventDefault(); this.selectDatacenter(center.id, true); } });
      card.className = `p-3 rounded-xl border cursor-pointer transition-all ${
        isSelected
          ? "bg-white border-sky-500 shadow-md ring-1 ring-sky-500"
          : "bg-white/90 border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`;

      card.innerHTML = `
        <div class="flex items-start justify-between gap-2 mb-1.5">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="w-2 h-2 rounded-full" style="background-color: ${compConf.color}"></span>
            ${this.companyLogo(center.companyTag || center.company)}
            <span class="text-[10px] text-slate-500 font-mono">| ${center.region}</span>
          </div>
          <span class="px-1.5 py-0.5 rounded text-[10px] font-medium border font-mono ${st.class}">
            ${st.text}
          </span>
        </div>
        <h4 class="text-xs font-bold text-slate-900 leading-snug line-clamp-1 mb-1">
          ${center.name}
        </h4><div class="audit-label">${this.escapeHTML(center.evidence?.level || "待核实")}</div>
        <div class="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-2 pt-1.5 border-t border-slate-100">
          <span class="text-sky-700 font-bold">⚡ ${center.powerMW}</span>
          <span class="text-amber-700 font-medium">💰 ${center.investment}</span>
        </div>
      `;

      card.addEventListener("click", () => {
        this.selectDatacenter(center.id, true);
      });

      container.appendChild(card);
    });
  }

  // 渲染地图标记：核心突破支持跨越太平洋/日界线的多世界副本渲染 (North America + Asia visible simultaneously)
  renderMarkers() {
    if (this.markerLayers) {
      this.markerLayers.forEach(m => this.map.removeLayer(m));
    }
    this.markerLayers = [];

    const filtered = this.getFilteredData();
    document.getElementById("resultCount").textContent = String(filtered.length).padStart(2, "0");

    filtered.forEach(center => {
      const compConf = this.getCompanyColor(center.companyTag);
      const isSelected = this.selectedCenter && this.selectedCenter.id === center.id;

      // 关键：在 lng, lng + 360, lng - 360 生成三组副本，确保用户在太平洋中心视角（西经转东经）时，北美洲与亚洲都能完美常驻展示！
      const lngCopies = [center.lng, center.lng + 360, center.lng - 360];

      lngCopies.forEach(lngVal => {
        const customIcon = L.divIcon({
          className: 'radar-marker-container',
          html: `
            <div class="radar-marker" style="color: ${compConf.color}">
              <div class="radar-marker-pulse"></div>
              <div class="radar-marker-pulse radar-marker-pulse-delay"></div>
              <div class="map-logo-node ${isSelected ? 'selected' : ''}">${this.companyLogo(center.companyTag || center.company)}</div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([center.lat, lngVal], { icon: customIcon, title: center.companyTag + " · " + center.name, alt: center.name }).addTo(this.map);

        const shortName = center.name.replace(/\(.*?\)/g, "").trim();
        const labelContent = `
          <div class="map-company-badge">
            <span class="map-company-dot" style="background-color: ${compConf.color}"></span>
            ${this.companyLogo(center.companyTag || center.company)}
            <span class="text-slate-600 font-medium pl-0.5">${shortName}</span>
          </div>
        `;

        marker.bindTooltip(labelContent, {
          permanent: false,
          direction: 'top',
          offset: [0, -14],
          className: 'company-permanent-label'
        });

        marker.on('click', () => {
          this.selectDatacenter(center.id, false);
        });

        this.markerLayers.push(marker);
      });
    });
  }

  selectDatacenter(id, flyTo = true) {
    const center = this.datacenters.find(c => c.id === id);
    if (!center) return;

    this.selectedCenter = center;

    if (flyTo && this.map) {
      // 智能选取距离当前地图中心最近的经度副本，避免反向360度大漂移
      let targetLng = center.lng;
      const currentCenter = this.map.getCenter();
      while (targetLng - currentCenter.lng > 180) targetLng -= 360;
      while (targetLng - currentCenter.lng < -180) targetLng += 360;

      this.map.flyTo([center.lat, targetLng], 8, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }

    this.renderList();
    this.renderMarkers();
    this.renderDrawer(center);
  }

  renderDrawer(center) {
    const drawer = document.getElementById("detailsDrawer");
    if (!drawer) return;
    const compConf = this.getCompanyColor(center.companyTag);

    const statusBadge = center.status === 'operational'
      ? '<span class="px-2.5 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">● 运营投产</span>'
      : center.status === 'construction'
      ? '<span class="px-2.5 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 border border-amber-300 font-semibold">⚡ 在建扩建</span>'
      : center.status === 'planned'
      ? '<span class="px-2.5 py-0.5 rounded-full text-xs bg-sky-100 text-sky-800 border border-sky-300 font-semibold">📋 规划中</span>'
      : '<span class="px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 border border-slate-300 font-semibold">待核实 / 存在疑点</span>';

    drawer.innerHTML = `
      <div class="h-full flex flex-col overflow-hidden bg-white">
        <!-- 抽屉顶栏 -->
        <div class="p-4 border-b border-slate-200 flex items-start justify-between bg-slate-50/70">
          <div>
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <span class="px-2.5 py-0.5 rounded-md text-xs font-bold" style="background-color: ${compConf.bg}; color: ${compConf.text}; border: 1px solid ${compConf.color}40">
                ${this.companyLogo(center.companyTag || center.company)}
              </span>
              <span class="px-2.5 py-0.5 rounded-md text-xs bg-slate-200 text-slate-700 font-mono font-medium">${center.region}</span>
              ${statusBadge}
            </div>
            <h2 class="text-base font-extrabold text-slate-900 leading-snug">${center.name}</h2>
            <p class="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
              <span>${center.location}</span>
            </p>
          </div>
          <button id="btnCloseDrawer" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- 核心规格网格 -->
        <div class="p-4 grid grid-cols-2 gap-2.5 bg-slate-50 border-b border-slate-200 font-mono text-xs">
          <div class="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div class="text-[11px] text-slate-400 font-sans">⚡ 容量口径（详见证据）</div>
            <div class="text-sm font-extrabold text-sky-700 mt-1">${center.powerMW}</div>
          </div>
          <div class="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div class="text-[11px] text-slate-400 font-sans">💰 单站投资</div>
            <div class="text-sm font-extrabold text-amber-700 mt-1">${center.investment}</div>
          </div>
          <div class="col-span-2 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div class="text-[11px] text-slate-400 font-sans">🖥️ 算力与芯片集群规模</div>
            <div class="text-xs font-bold text-slate-800 mt-1">${center.gpuCount}</div>
          </div>
        </div>

        <!-- 详细情报滚动体 -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
          ${this.chipDetails(center)}
          ${window.renderEvidence(center, value=>this.escapeHTML(value))}
          <!-- 深度研判 -->
          <div class="space-y-1.5">
            <h4 class="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <svg class="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              项目核查说明
            </h4>
            <div class="p-3 rounded-xl bg-sky-50/70 border border-sky-100 text-slate-700 leading-relaxed">
              ${center.description}
            </div>
          </div>

          <!-- 供电与能源协同 -->
          <div class="space-y-1.5">
            <h4 class="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              供电方案与电网协同
            </h4>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed font-mono text-[11px]">
              ${center.powerSource}
            </div>
          </div>

          <!-- 散热制冷方案 -->
          <div class="space-y-1.5">
            <h4 class="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <svg class="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              散热制冷与节能方案
            </h4>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed font-mono text-[11px]">
              ${center.cooling}
            </div>
          </div>

          <!-- 园区演进时间线 -->
          ${center.timeline && center.timeline.length > 0 ? `
            <div class="space-y-2">
              <h4 class="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                关键节点与演进记录
              </h4>
              <div class="space-y-2 relative pl-4 border-l-2 border-slate-200">
                ${center.timeline.map(t => `
                  <div class="relative">
                    <span class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-sky-600"></span>
                    <div class="font-mono text-[11px] text-sky-800 font-bold">${t.date} · ${t.title}</div>
                    <div class="text-[11px] text-slate-500 mt-0.5">${t.desc}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- 底部快捷跳转 -->
        <div class="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button id="btnFocusMapCenter" class="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            地图最佳视角居中
          </button>
          <span class="text-[11px] text-slate-400 font-mono">${center.id}</span>
        </div>
      </div>
    `;

    drawer.classList.remove("translate-x-full");

    document.getElementById("btnCloseDrawer").addEventListener("click", () => {
      drawer.classList.add("translate-x-full");
    });

    document.getElementById("btnFocusMapCenter").addEventListener("click", () => {
      this.selectDatacenter(center.id, true);
    });
  }

  // ====================== 【全球 AI 总容量 BI 报表引擎】 ======================
  renderBIDashboard() {
    // 1. 计算核心 KPI
    let totalMW = 0;
    let totalInvestB = 0;
    const regionMap = {};
    const vendorMap = {};
    const coolingMap = {
      "板式直接液冷 (DLC)": 0,
      "全浸没式液冷": 0,
      "自然新风与极寒风冷": 0,
      "水源与海水冷却": 0,
      "热通道封闭与蒸发冷": 0
    };
    const powerTechMap = {
      "绿色风电/光伏自备": 0,
      "核电直供与直购": 0,
      "清洁水电/地热直驱": 0,
      "高压双回路/电网配额": 0,
      "天然气低碳热电": 0
    };

    this.datacenters.forEach(d => {
      const mw = this.parsePowerMW(d.powerMW);
      const invB = this.parseInvestmentBillion(d.investment);
      totalMW += mw;
      totalInvestB += invB;

      // 统计区域
      const r = d.region || "其他地区";
      regionMap[r] = (regionMap[r] || 0) + mw;

      // 统计厂商阵营
      const v = d.companyTag || d.company || "其他";
      vendorMap[v] = (vendorMap[v] || 0) + mw;

      // 统计冷却方案
      const cStr = (d.cooling || "").toLowerCase();
      if (cStr.includes("浸没")) coolingMap["全浸没式液冷"] += mw;
      else if (cStr.includes("液冷") || cStr.includes("dlc") || cStr.includes("冷板")) coolingMap["板式直接液冷 (DLC)"] += mw;
      else if (cStr.includes("新风") || cStr.includes("自然") || cStr.includes("极寒")) coolingMap["自然新风与极寒风冷"] += mw;
      else if (cStr.includes("海水") || cStr.includes("水源") || cStr.includes("湖")) coolingMap["水源与海水冷却"] += mw;
      else coolingMap["热通道封闭与蒸发冷"] += mw;

      // 统计能源来源
      const pStr = (d.powerSource || "").toLowerCase();
      if (pStr.includes("核")) powerTechMap["核电直供与直购"] += mw;
      else if (pStr.includes("地热") || pStr.includes("水")) powerTechMap["清洁水电/地热直驱"] += mw;
      else if (pStr.includes("风") || pStr.includes("光") || pStr.includes("太阳能") || pStr.includes("绿电")) powerTechMap["绿色风电/光伏自备"] += mw;
      else if (pStr.includes("天然气") || pStr.includes("燃气")) powerTechMap["天然气低碳热电"] += mw;
      else powerTechMap["高压双回路/电网配额"] += mw;
    });

    const totalGW = (totalMW / 1000).toFixed(1);

    // 填充 KPI 卡片
    const pElem = document.getElementById("biMetricPower");
    if (pElem) pElem.innerText = `${totalGW} GW (${totalMW.toLocaleString()} MW)`;
    
    // 动态计算已建成/在建/规划负荷
    let opMW = 0, conMW = 0, planMW = 0;
    this.datacenters.forEach(d => {
      const mw = this.parsePowerMW(d.powerMW);
      if (d.status === "operational") opMW += mw;
      else if (d.status === "construction") conMW += mw;
      else planMW += mw;
    });
    const subElem = pElem.nextElementSibling;
    if (subElem) {
      subElem.innerHTML = `仅汇总有明确数值的样本，含规划、扩建与设施设计容量；不是全球已投运算力。未知与口径冲突项目不计入。`;
    }

    const iElem = document.getElementById("biMetricInvestment");
    if (iElem) iElem.innerText = "未统一核验";

    const gElem = document.getElementById("biMetricGPUs");
    if (gElem) gElem.innerText = "查看芯片图谱";

    const cCountElem = document.getElementById("biTableCount");
    if (cCountElem) cCountElem.innerText = this.datacenters.length;

    // 2. 渲染图表 1：区域总容量柱状图 (MW)
    this.renderChartRegionBar(regionMap);

    // 3. 渲染图表 2：区域占比环形图 (%)
    this.renderChartRegionPie(regionMap, totalMW);

    // 4. 渲染图表 3：厂商总容量排行榜 (Top Vendors MW)
    this.renderChartVendorBar(vendorMap);

    // 5. 渲染图表 4：制冷与绿色能源技术构成
    this.renderChartInfraTech(coolingMap, powerTechMap);

    // 6. 渲染明细总榜表格
    this.renderBITable();
  }

  renderChartRegionBar(regionMap) {
    const ctx = document.getElementById("chartRegionCapacity");
    if (!ctx) return;
    if (this.charts.regionBar) this.charts.regionBar.destroy();

    const labels = Object.keys(regionMap).sort((a, b) => regionMap[b] - regionMap[a]);
    const data = labels.map(l => regionMap[l]);

    const colors = [
      '#0284c7', '#0d9488', '#059669', '#7c3aed', '#d97706', '#ea580c', '#6366f1'
    ];

    this.charts.regionBar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '区域算力规划电力 (MW)',
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` 规划负荷: ${ctx.raw.toLocaleString()} MW (${(ctx.raw / 1000).toFixed(2)} GW)`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: v => `${v} MW`,
              font: { size: 10, family: 'monospace' }
            },
            grid: { color: '#e1e9ef' }
          },
          x: {
            ticks: { font: { size: 11, weight: 'bold' } },
            grid: { display: false }
          }
        }
      }
    });
  }

  renderChartRegionPie(regionMap, totalMW) {
    const ctx = document.getElementById("chartRegionPie");
    if (!ctx) return;
    if (this.charts.regionPie) this.charts.regionPie.destroy();

    const labels = Object.keys(regionMap).sort((a, b) => regionMap[b] - regionMap[a]);
    const data = labels.map(l => regionMap[l]);

    const palette = [
      '#0284c7', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'
    ];

    this.charts.regionPie = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: palette.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              font: { size: 11, family: 'sans-serif' }
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.raw;
                const pct = ((val / totalMW) * 100).toFixed(1);
                return ` ${ctx.label}: ${val.toLocaleString()} MW (${pct}%)`;
              }
            }
          }
        },
        cutout: '65%'
      }
    });
  }

  renderChartVendorBar(vendorMap) {
    const ctx = document.getElementById("chartVendorCapacity");
    if (!ctx) return;
    if (this.charts.vendorBar) this.charts.vendorBar.destroy();

    const sorted = Object.entries(vendorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // 取 Top 10

    const labels = sorted.map(i => i[0]);
    const data = sorted.map(i => i[1]);

    this.charts.vendorBar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '归属算力负荷 (MW)',
          data: data,
          backgroundColor: [
            '#0284c7', '#ea580c', '#2563eb', '#9333ea', '#16a34a',
            '#d97706', '#0f766e', '#0284c7', '#b45309', '#06b6d4'
          ],
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` 归属容量: ${ctx.raw.toLocaleString()} MW`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: v => `${v} MW`,
              font: { size: 10, family: 'monospace' }
            },
            grid: { color: '#e1e9ef' }
          },
          y: {
            type: 'category',
            ticks: {
              font: { size: 11, weight: 'bold' },
              autoSkip: false
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  renderChartInfraTech(coolingMap, powerTechMap) {
    const ctx = document.getElementById("chartInfraTech");
    if (!ctx) return;
    if (this.charts.infraTech) this.charts.infraTech.destroy();

    const labels = Object.keys(powerTechMap);
    const data = Object.values(powerTechMap);

    this.charts.infraTech = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '电力供给形式 (MW)',
          data: data,
          backgroundColor: '#10b981',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` 配套规模: ${ctx.raw.toLocaleString()} MW`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: v => `${v} MW`,
              font: { size: 10, family: 'monospace' }
            },
            grid: { color: '#e1e9ef' }
          },
          x: {
            ticks: { font: { size: 10 } },
            grid: { display: false }
          }
        }
      }
    });
  }

  renderBITable() {
    const tbody = document.getElementById("biTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    // 按电力规模降序排列
    const sorted = [...this.datacenters].sort((a, b) => {
      return this.parsePowerMW(b.powerMW) - this.parsePowerMW(a.powerMW);
    });

    sorted.forEach((center, index) => {
      const compConf = this.getCompanyColor(center.companyTag);
      const tr = document.createElement("tr");
      tr.className = "border-b border-slate-100 hover:bg-slate-50/80 transition-colors";

      const rankBadge = index === 0
        ? '<span class="w-5 h-5 rounded-full bg-amber-500 text-white font-extrabold flex items-center justify-center text-[10px]">1</span>'
        : index === 1
        ? '<span class="w-5 h-5 rounded-full bg-slate-400 text-white font-bold flex items-center justify-center text-[10px]">2</span>'
        : index === 2
        ? '<span class="w-5 h-5 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-[10px]">3</span>'
        : `<span class="text-slate-400 font-mono text-xs pl-1">${index + 1}</span>`;

      const statusMap = {
        operational: '<span class="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">已投产</span>',
        construction: '<span class="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-medium">在建扩建</span>',
        planned: '<span class="px-2 py-0.5 rounded-full text-[10px] bg-sky-50 text-sky-700 border border-sky-200 font-medium">规划立项</span>'
      };

      tr.innerHTML = `
        <td class="p-3 text-center">${rankBadge}</td>
        <td class="p-3 font-semibold text-slate-900">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${compConf.color}"></span>
            <span class="hover:text-sky-600 cursor-pointer font-bold">${center.name}</span>
          </div>
        </td>
        <td class="p-3">
          <span class="px-2 py-0.5 rounded text-[11px] font-bold" style="background-color: ${compConf.bg}; color: ${compConf.text}">
            ${this.companyLogo(center.companyTag || center.company)}
          </span>
        </td>
        <td class="p-3 font-mono text-slate-600 text-[11px]">${center.region}</td>
        <td class="p-3 font-mono font-bold text-sky-700 text-xs">${center.powerMW}</td>
        <td class="p-3 font-mono text-amber-700 text-xs">${center.investment}</td>
        <td class="p-3 text-slate-600 text-[11px] max-w-xs truncate" title="${center.gpuCount}">${center.gpuCount}</td>
        <td class="p-3">${statusMap[center.status] || center.status}</td>
        <td class="p-3 text-center">
          <button class="btn-locate-map px-2.5 py-1 rounded bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-700 font-mono text-[11px] transition-colors" data-id="${center.id}">
            地图定位 ➔
          </button>
        </td>
      `;

      // 点击定位切回地图
      const btn = tr.querySelector(".btn-locate-map");
      btn.addEventListener("click", () => {
        this.switchToView("map");
        this.selectDatacenter(center.id, true);
      });

      tbody.appendChild(tr);
    });
  }

  // 视图切换器
  switchToView(viewName) {
    document.getElementById('chipAtlasView').classList.toggle('hidden', !['chips','sources'].includes(viewName));
    document.getElementById('btnViewSources').classList.toggle('active',viewName==='sources');
    document.getElementById('btnViewChips').classList.toggle('active', viewName === 'chips');
    if(['chips','sources'].includes(viewName)) {
      this.currentView=viewName;
      document.getElementById('mapViewContainer').classList.add('hidden');
      document.getElementById('biDashboardView').classList.add('hidden');
      document.getElementById('mapLayerControls').classList.add('hidden');
      document.getElementById('btnViewMap').classList.remove('bg-white');
      document.getElementById('btnViewBI').classList.remove('bg-white');
      document.getElementById('chipAtlasView').innerHTML=viewName==='chips'?window.renderChipAtlas(this):window.renderSourceAtlas(this);
      if(viewName==='sources')window.bindSourceAtlas(this);
      return;
    }

    this.currentView = viewName;
    const mapContainer = document.getElementById("mapViewContainer");
    const biContainer = document.getElementById("biDashboardView");
    const mapLayerControls = document.getElementById("mapLayerControls");
    const btnViewMap = document.getElementById("btnViewMap");
    const btnViewBI = document.getElementById("btnViewBI");

    if (viewName === "bi") {
      mapContainer.classList.add("hidden");
      biContainer.classList.remove("hidden");
      if (mapLayerControls) mapLayerControls.classList.add("hidden");

      btnViewMap.className = "px-4 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-medium transition-all flex items-center gap-1.5";
      btnViewBI.className = "px-4 py-1.5 rounded-lg bg-white text-slate-900 font-bold shadow-sm transition-all flex items-center gap-1.5";

      this.renderBIDashboard();
    } else {
      biContainer.classList.add("hidden");
      mapContainer.classList.remove("hidden");
      if (mapLayerControls) mapLayerControls.classList.remove("hidden");

      btnViewBI.className = "px-4 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-medium transition-all flex items-center gap-1.5";
      btnViewMap.className = "px-4 py-1.5 rounded-lg bg-white text-slate-900 font-bold shadow-sm transition-all flex items-center gap-1.5";

      setTimeout(() => {
        if (this.map) this.map.invalidateSize();
      }, 100);
    }
  }

  bindEvents() {
    document.getElementById("btnViewSources").addEventListener("click",()=>this.switchToView("sources"));
    document.getElementById("btnViewChips").addEventListener("click",()=>this.switchToView("chips"));
    // 视图切换按钮绑定
    const btnViewMap = document.getElementById("btnViewMap");
    const btnViewBI = document.getElementById("btnViewBI");
    const btnBackToMap = document.getElementById("btnBackToMap");

    if (btnViewMap) btnViewMap.addEventListener("click", () => this.switchToView("map"));
    if (btnViewBI) btnViewBI.addEventListener("click", () => this.switchToView("bi"));
    if (btnBackToMap) btnBackToMap.addEventListener("click", () => this.switchToView("map"));

    // 导出 BI 报表 CSV
    const btnExportBI = document.getElementById("btnExportBIReport");
    if (btnExportBI) {
      btnExportBI.addEventListener("click", () => {
        let csvContent = "\uFEFF排名,基地名称,归属厂商,区域,地理坐标,规划功耗(MW),预估投资,算力芯片架构,绿色供电方案,散热制冷方案,规划状态\n";
        const sorted = [...this.datacenters].sort((a, b) => this.parsePowerMW(b.powerMW) - this.parsePowerMW(a.powerMW));
        
        sorted.forEach((c, idx) => {
          const row = [
            idx + 1,
            `"${(c.name || '').replace(/"/g, '""')}"`,
            `"${(c.companyTag || c.company || '').replace(/"/g, '""')}"`,
            `"${c.region || ''}"`,
            `"${c.lat}, ${c.lng}"`,
            `"${c.powerMW || ''}"`,
            `"${c.investment || ''}"`,
            `"${(c.gpuCount || '').replace(/"/g, '""')}"`,
            `"${(c.powerSource || '').replace(/"/g, '""')}"`,
            `"${(c.cooling || '').replace(/"/g, '""')}"`,
            `"${c.status || ''}"`
          ];
          csvContent += row.join(",") + "\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Global_AI_Datacenter_BI_Report_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        this.showToast("已成功导出全球 AI 数据中心 BI 决策报表 CSV！", "success");
      });
    }

    // 搜索输入
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.currentFilter.search = e.target.value;
        this.renderList();
        this.renderMarkers();
      });
    }

    // 区域标签切换
    document.querySelectorAll(".region-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".region-filter-btn").forEach(b => {
          b.classList.remove("bg-sky-600", "text-white", "border-sky-600");
          b.classList.add("bg-white", "text-slate-600", "border-slate-200");
        });
        btn.classList.add("bg-sky-600", "text-white", "border-sky-600");
        btn.classList.remove("bg-white", "text-slate-600");

        this.currentFilter.region = btn.getAttribute("data-region");
        this.renderList();
        this.renderMarkers();

        // 视口平滑定位
        if (this.currentFilter.region === "大中华区") {
          this.map.flyTo([35.0, 110.0], 4);
        } else if (this.currentFilter.region === "北美洲") {
          this.map.flyTo([38.0, -97.0], 4);
        } else if (this.currentFilter.region === "欧洲") {
          this.map.flyTo([52.0, 10.0], 4);
        } else if (this.currentFilter.region === "亚太地区") {
          this.map.flyTo([10.0, 105.0], 4);
        } else if (this.currentFilter.region === "中东地区") {
          this.map.flyTo([25.0, 48.0], 5);
        } else if (this.currentFilter.region === "非洲地区") {
          this.map.flyTo([2.0, 25.0], 4);
        } else if (this.currentFilter.region === "中亚地区") {
          this.map.flyTo([50.0, 70.0], 5);
        } else {
          this.map.flyTo([25.0, 30.0], 3);
        }
      });
    });

    // 建设阶段状态过滤 (全部阶段 / 已建成投产 / 在建中 / 规划中)
    document.querySelectorAll(".status-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".status-filter-btn").forEach(b => {
          b.classList.remove("bg-emerald-600", "text-white", "font-bold");
          b.classList.add("bg-white", "text-slate-600");
        });
        btn.classList.add("bg-emerald-600", "text-white", "font-bold");
        btn.classList.remove("bg-white", "text-slate-600");

        this.currentFilter.status = btn.getAttribute("data-status");
        this.renderList();
        this.renderMarkers();
      });
    });

    // 厂商类别过滤
    document.querySelectorAll(".category-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".category-filter-btn").forEach(b => {
          b.classList.remove("bg-slate-800", "text-white");
          b.classList.add("bg-slate-100", "text-slate-600");
        });
        btn.classList.add("bg-slate-800", "text-white");
        btn.classList.remove("bg-slate-100", "text-slate-600");

        this.currentFilter.category = btn.getAttribute("data-category");
        this.renderList();
        this.renderMarkers();
      });
    });

    // 底图切换
    const btnAmap = document.getElementById("btnAmap");
    const btnOsm = document.getElementById("btnOsmMap");
    const btnSat = document.getElementById("btnSatelliteMap");

    if (btnAmap) {
      btnAmap.addEventListener("click", () => {
        this.switchTileLayer("amap");
        btnAmap.className = "px-2.5 py-1 rounded-md text-[11px] bg-sky-600 text-white font-semibold shadow-sm transition-colors";
        btnOsm.className = "px-2.5 py-1 rounded-md text-[11px] text-slate-600 hover:text-slate-900 transition-colors";
        btnSat.className = "px-2.5 py-1 rounded-md text-[11px] text-slate-600 hover:text-slate-900 transition-colors";
      });
    }

    if (btnOsm) {
      btnOsm.addEventListener("click", () => {
        this.switchTileLayer("osm");
        btnOsm.className = "px-2.5 py-1 rounded-md text-[11px] bg-sky-600 text-white font-semibold shadow-sm transition-colors";
        btnAmap.className = "px-2.5 py-1 rounded-md text-[11px] text-slate-600 hover:text-slate-900 transition-colors";
        btnSat.className = "px-2.5 py-1 rounded-md text-[11px] text-slate-600 hover:text-slate-900 transition-colors";
      });
    }

    if (btnSat) {
      btnSat.addEventListener("click", () => {
        this.switchTileLayer("satellite");
        btnSat.className = "px-2.5 py-1 rounded-md text-[11px] bg-sky-600 text-white font-semibold shadow-sm transition-colors";
        btnAmap.className = "px-2.5 py-1 rounded-md text-[11px] text-slate-600 hover:text-slate-900 transition-colors";
        btnOsm.className = "px-2.5 py-1 rounded-md text-[11px] text-slate-600 hover:text-slate-900 transition-colors";
      });
    }

    // 弹窗与新增记录
    const modal = document.getElementById("newCenterModal");
    const btnOpenAdd = document.getElementById("btnOpenAddModal");
    const btnCloseAdd = document.getElementById("btnCloseAddModal");
    const btnCancelAdd = document.getElementById("btnCancelAddModal");

    if (btnOpenAdd) btnOpenAdd.addEventListener("click", () => modal.classList.remove("hidden"));
    if (btnCloseAdd) btnCloseAdd.addEventListener("click", () => modal.classList.add("hidden"));
    if (btnCancelAdd) btnCancelAdd.addEventListener("click", () => modal.classList.add("hidden"));

    const btnPick = document.getElementById("btnPickMap");
    if (btnPick) {
      btnPick.addEventListener("click", () => {
        this.isPickingLocation = true;
        modal.classList.add("hidden");
        btnPick.classList.add("ring-2", "ring-sky-500");
        this.showToast("请在地图上单击任意位置以精准拾取经纬度", "info");
      });
    }

    const newCenterForm = document.getElementById("newCenterForm");
    if (newCenterForm) {
      newCenterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newCenter = {
          id: "center-" + Date.now(),
          name: document.getElementById("modalName").value,
          company: document.getElementById("modalCompany").value,
          companyTag: document.getElementById("modalCompanyTag").value,
          category: document.getElementById("modalCategory").value,
          region: document.getElementById("modalRegion").value,
          location: document.getElementById("modalLocation").value,
          lat: parseFloat(document.getElementById("modalLat").value),
          lng: parseFloat(document.getElementById("modalLng").value),
          investment: document.getElementById("modalInvestment").value || "未披露",
          powerMW: document.getElementById("modalPower").value || "未披露",
          gpuCount: document.getElementById("modalGpu").value || "未披露",
          status: document.getElementById("modalStatus").value,
          cooling: document.getElementById("modalCooling").value || "液冷/水冷",
          powerSource: document.getElementById("modalPowerSource").value || "电网供电",
          description: document.getElementById("modalDesc").value || "暂无详细描述",
          videoUrl: document.getElementById("modalVideoUrl").value || "",
          videoTitle: "工程现场影像",
          images: [],
          timeline: [
            { date: "最新登记", title: "项目录入数据库", desc: "通过雷达系统成功录入更新" }
          ]
        };

        this.datacenters.unshift(newCenter);
        this.saveData();
        modal.classList.add("hidden");
        newCenterForm.reset();

        this.renderList();
        this.renderMarkers();
        this.selectDatacenter(newCenter.id, true);
        this.showToast("新数据中心已成功登记并同步至地图！", "success");
      });
    }

    // 导出备份 JSON
    const btnExportData = document.getElementById("btnExportData");
    if (btnExportData) {
      btnExportData.addEventListener("click", () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.datacenters, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `ai_datacenters_global_${new Date().toISOString().slice(0,10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        this.showToast("已成功导出完整全球算力数据库 JSON！", "success");
      });
    }
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    const bgClass = type === "success" ? "bg-emerald-600" : type === "error" ? "bg-rose-600" : "bg-sky-600";
    toast.className = `fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-lg shadow-xl text-white text-xs z-50 flex items-center gap-2 ${bgClass} transition-all duration-300 transform translate-y-4 opacity-0 font-sans`;
    toast.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove("translate-y-4", "opacity-0");
    }, 10);

    setTimeout(() => {
      toast.classList.add("translate-y-4", "opacity-0");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.Chart) { Chart.defaults.color = "#526b7b"; Chart.defaults.borderColor = "#e1e9ef"; }
  window.app = new DatacenterRadarApp();
});


