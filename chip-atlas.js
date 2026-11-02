window.renderChipAtlas = app => {
 const rows=[
 ['美国生态','NVIDIA','NVIDIA GPU','H100 / H200 · Blackwell 系列','通用 GPU · 训练与推理','Colossus 原始集群已有 NVIDIA 官方部署证据；不能把 Colossus 1 的数量套用到 Colossus 2。','https://nvidianews.nvidia.com/news/spectrum-x-ethernet-networking-xai-colossus/'],
 ['美国生态','AMD','AMD Instinct GPU','MI300X 等','通用 GPU · 训练与推理','AMD 官方确认 MI300X 用于 Azure OpenAI 与 Azure 虚拟机；不代表某一地图园区的配比。','https://www.amd.com/en/newsroom/press-releases/2024-5-21-amd-instinct-mi300x-accelerators-power-microsoft-a.html'],
 ['美国生态','Google','Google TPU','TPU · 含 Ironwood','专用 AI 加速器 · 非 GPU','Google 自研 TPU 服务于训练与推理。产品代际可用性与具体园区部署须分别核实。','https://cloud.google.com/tpu'],
 ['美国生态','Amazon','AWS Trainium','Trainium2 / Rainier','专用 AI 加速器 · 非 GPU','Amazon 官方披露 Rainier 使用 Trainium2；这是项目级部署证据。','https://www.aboutamazon.com/news/aws/aws-project-rainier-ai-trainium-chips-compute-cluster'],
 ['中国生态','华为','华为昇腾','Ascend · CloudMatrix384','AI 加速器 / 超节点','华为云官方提供昇腾云服务。CloudMatrix384 是系统名称，不是单颗芯片型号。','https://www.huaweicloud.com/product/modelarts/ascend-cloud.html'],
 ['中国生态','寒武纪','寒武纪思元','思元系列 · MLU370','AI 加速器 · 训练与推理','官网披露思元系列云端训练卡；本页不把产品存在等同于腾讯或阿里某园区采用。','https://www.cambricon.com/'],
 ['中国生态','昆仑芯','昆仑芯','昆仑芯 2 代 / R 系列','AI 加速器 · 训练与推理','官网提供面向数据中心训练和推理的芯片、加速卡与加速器组。','https://www.kunlunxin.com/'],
 ['中国生态','平头哥','阿里平头哥','真武 / PPU 810E','自研 AI 加速器','阿里云 PAI 文档提供 PPU 810E 智算资源说明，并以乌兰察布地域为例；并非单园区配比。','https://help.aliyun.com/zh/pai/untitled-document-1734413599038'],
 ['中国生态','NVIDIA','NVIDIA 在中国的部署','H800 等历史已披露型号','通用 GPU · 非国产芯片','DeepSeek-V3 技术报告披露使用 H800 训练；报告不证明其训练位于当前地图中的乌兰察布基地。','https://arxiv.org/abs/2412.19437']
 ];
 return `<div class="atlas-inner"><div class="atlas-title"><span class="eyebrow">SILICON LANDSCAPE / 芯片生态</span><h2>算力背后，是什么芯片？</h2><p>按供应商和技术路线认识中美 AI 基础设施。核实日期：2026-11-01。</p></div><div class="atlas-notice">这是代表性芯片生态，不是市场份额统计。GPU、TPU、Trainium 与其他 AI 加速器分开标识；CPU、网络与存储芯片不计入 AI 加速卡配比。</div><div class="atlas-regions">${['美国生态','中国生态'].map(region=>`<section><h3>${region}<span>${region==='美国生态'?'GPU + 自研专用加速器':'国产加速器 + 已披露的 NVIDIA 部署'}</span></h3>${rows.filter(r=>r[0]===region).map(r=>`<article class="silicon-card"><div>${app.companyLogo(r[1])}<span class="chip-kind">${r[4]}</span></div><h4>${r[2]}</h4><strong>${r[3]}</strong><p>${r[5]}</p><a href="${r[6]}" target="_blank" rel="noopener noreferrer">官方来源 ↗</a></article>`).join('')}</section>`).join('')}</div><section class="layout-review"><span class="eyebrow">VERIFIED FOOTPRINT</span><h3>腾讯与阿里：已核实的重点布局</h3><p><b>腾讯：</b>贵安、清远（清新／清城）、仪征、怀来、天津、上海青浦、重庆。<br><b>阿里云：</b>张北、乌兰察布、杭州仁和、河源。</p><p>物理园区与云产品地域不是一对一关系。这是本轮核实的重点节点，不是两家公司的完整全球清单。地图坐标为城市／区域示意；具体证据见各基地详情。</p><p>华为贵安七星湖与腾讯贵安七星已拆分。未披露 MW 不进入容量合计，未知芯片配比不绘制饼图。</p></section></div>`;
};
