// Reviewed 2026-11-01. Campus existence and chip deployment are separate evidence levels.
(() => {
const S = {
 tencent:['腾讯 ESG：数据中心布局','https://static.www.tencent.com/uploads/2022/04/16/56e61654efa69f7503f997520a8f2766.pdf'],
 tc:['腾讯云官方专线接入点','https://intl.cloud.tencent.com/zh/document/product/216/41429'],
 guian:['维谛技术：腾讯贵安七星项目案例','https://www.vertiv.com/4a2486/globalassets/documents/case-studies/tencent_t-block_case_study_310822_0.pdf'],
 ali:['阿里云：园区接入点','https://help.aliyun.com/zh/ena/product-overview/edge-network-acceleration-endpoint-list'],
 pai:['阿里云：乌兰察布 PPU / 灵骏资源','https://help.aliyun.com/zh/pai/untitled-document-1734413599038'],
 hw:['华为云：贵安七星湖接入点','https://support.huaweicloud.com/dc_faq/dc_faq_0007.html'],
 sx:['xAI 加入 SpaceX 官方公告','https://x.ai/news/xai-joins-spacex'],
 rainier:['Amazon：Project Rainier 芯片部署','https://www.aboutamazon.com/news/aws/aws-project-rainier-ai-trainium-chips-compute-cluster']
};
window.REVIEWED_IDS=[];
const base=window.DEFAULT_DATACENTERS;
function patch(id, fields){const row=base.find(d=>d.id===id);if(row){Object.assign(row,fields,{reviewedAt:'2026-11-01'});window.REVIEWED_IDS.push(id)}}
for(const d of base.filter(d=>d.companyTag==='xAI')) patch(d.id,{companyTag:'SpaceX',company:'SpaceX（原 xAI，保留 xAI 搜索别名）',sources:[S.sx],verification:'公司归属已核实；原项目规模未在本轮核实'});
patch('guizhou-guian-huawei',{name:'华为贵安七星湖云数据中心',company:'华为云',companyTag:'华为',powerMW:'未披露',investment:'未核实',gpuCount:'园区芯片型号与数量未披露',cooling:'未核实；不沿用腾讯洞库式机房描述',powerSource:'园区能源结构未在本轮核实',footprint:'华为独立园区，与腾讯贵安七星分开登记',description:'华为云官方接入点列有贵阳—七星湖（贵安云上屯数据中心）。原记录混合华为与腾讯两个不同园区，现拆分；删除无法归属单一园区的 1,200 MW、投资与芯片数量。',timeline:[],sources:[S.hw],verification:'园区存在已核实；AI 专属容量待披露',location:'贵州贵安新区（区域级示意点）'});
const africa=base.find(d=>d.id==='africa-egypt-morocco-huawei-cassava');
if(africa)patch(africa.id,{companyTag:'华为',verification:'移除与原主体字段不一致的腾讯标签；项目细节待进一步核实'});
function add(id,name,tag,location,lat,lng,description,sources,extra={}){
 base.push({id,name,company:tag==='阿里云'?'阿里巴巴 / 阿里云':tag,companyTag:tag,category:'科技巨头',region:'大中华区',location:location+'（区域级示意点，非机房精确坐标）',lat,lng,investment:'未披露',powerMW:'未披露',gpuCount:'园区级 AI 芯片型号、数量及比例未披露',status:'operational',statusText:'云数据中心已运营；AI 规模未披露',cooling:'园区级方案未在本轮核实',powerSource:'园区级能源比例未在本轮核实',footprint:'已核实云数据中心；不等同于全部为 AI 专属集群',description,videoUrl:'',images:[],timeline:[],sources,reviewedAt:'2026-11-01',verification:'园区存在已核实；AI 专属配置未披露',...extra});window.REVIEWED_IDS.push(id)
}
add('tencent-guian-qixing','腾讯贵安七星数据中心','腾讯','贵州贵安新区',26.40,106.49,'腾讯独立数据中心，采用洞库与 T-Block 等建设方式。与华为七星湖不是同一项目。供应商案例确认园区存在，未公开可用于本地图的 AI 芯片占比。',[S.guian]);
add('tencent-qingyuan','腾讯清远数据中心布局（清新／清城）','腾讯','广东清远',23.68,113.03,'官方接入点分别列出清新与清城数据中心；此条为区域汇总，不将两座园区重复计为一个已知 MW 数值。',[S.tc]);
add('tencent-yizheng','腾讯仪征东升云计算数据中心','腾讯','江苏仪征经济开发区',32.27,119.18,'腾讯官方接入点列有仪征东升园区。已运营云基础设施与具体 AI 集群规模分开记录。',[S.tc]);
add('tencent-huailai','腾讯怀来东园数据中心','腾讯','河北怀来',40.40,115.52,'腾讯 ESG 报告列示怀来东园绿色数据中心。可确认华北布局，不能从园区存在推定 GPU 数量。',[S.tencent]);
add('tencent-tianjin','腾讯天津数据中心','腾讯','天津',39.12,117.20,'腾讯 ESG 报告披露天津数据中心 4 号楼认证信息。当前记录只确认园区，AI 加速器配置未公开核实。',[S.tencent]);
add('tencent-shanghai','腾讯上海青浦数据中心','腾讯','上海青浦',31.15,121.12,'腾讯可持续社会价值报告列有上海青浦园区储能规划，确认其华东布局。园区状态与 AI 芯片容量不混为一谈。',[['腾讯 2021 可持续社会价值报告','https://static.www.tencent.com/attachments/ssv/2021/TencentSSVReport2021.pdf']]);
add('tencent-chongqing','腾讯重庆数据中心','腾讯','重庆',29.56,106.55,'腾讯 ESG 报告列示重庆数据中心的绿色能源布局；该条为城市级位置，AI 专属容量未披露。',[S.tencent]);
add('alibaba-zhangbei','阿里云张北数据中心（庙滩）','阿里云','河北张家口张北',41.15,114.70,'工信部国家绿色数据中心案例确认张北庙滩园区。属于阿里云华北基础设施；不将通用服务器规模转换为 GPU 或 MW。',[['工信部：张北庙滩数据中心','https://www.miit.gov.cn/jgsj/jns/nyjy/art/2021/art_8226a3a538384d63be03447b2a3081a7.html']]);
add('alibaba-ulanqab','阿里云乌兰察布园区／灵骏智算地域','阿里云','内蒙古乌兰察布白海子镇',40.95,113.16,'阿里云官方园区接入点确认白海子镇阿里巴巴园区；PAI 文档以乌兰察布举例说明 PPU 资源使用。产品地域的芯片供给，不等于园区所有机房的统一配置。',[S.ali,S.pai],{gpuCount:'PPU 810E：产品地域级披露；园区数量与占比未披露',verification:'园区与智算地域已核实；单园区芯片配比未知'});
add('alibaba-hangzhou-renhe','阿里云杭州仁和数据中心','阿里云','浙江杭州仁和',30.44,120.09,'阿里云官方文档列示杭州余杭仁和阿里机房。确认物理园区布局，不据此断言通义模型的具体训练机房。',[S.ali]);
add('alibaba-heyuan','阿里云河源数据中心布局','阿里云','广东河源',23.74,114.70,'河源市源城区公布一期数据中心竣工验收备案；区域内另有江东新区项目，地图以河源区域汇总展示。AI 芯片型号与容量不按园区总规模推算。',[['河源源城区：一期竣工验收','https://www.gdyc.gov.cn/hyyczjj/gkmlpt/content/0/411/post_411816.html'],['河源江东新区：改扩建批复','https://www.hyjdxq.gov.cn/zdlyxxgk/hjbhxxgk/content/post_639694.html']]);
for(const d of base){
 d.chipEvidence={level:'原始记录待核实',summary:d.gpuCount||'未披露',note:'以下为原项目记录，不代表已核实的型号、数量或占比。未用地区常见芯片推定本基地配置。',sources:[]};
 if(d.companyTag==='腾讯'||d.companyTag==='阿里云'||d.id==='guizhou-guian-huawei') d.chipEvidence={level:'基地级未披露',summary:'型号、数量、占比未披露',note:'已确认云数据中心布局，但未取得可归属该园区的 AI 芯片清单。',sources:d.sources||[]};
}
const ul=base.find(d=>d.id==='alibaba-ulanqab');ul.chipEvidence={level:'产品地域级证据',summary:'平头哥 / PPU 810E',note:'PAI 文档以乌兰察布地域举例；不代表该园区全部机房采用此芯片。数量及比例未披露。',sources:[S.pai]};
const rain=base.find(d=>d.name.includes('Rainier'));if(rain){rain.chipEvidence={level:'项目级官方披露',summary:'AWS Trainium2 · 专用 AI 加速器',note:'Amazon 公开项目级 Trainium2 部署。该证据不确认原地图的单一地址、电源方案或每栋机房配比。',sources:[S.rainier]};rain.gpuCount='AWS Trainium2；项目级芯片部署已披露，非 NVIDIA GPU';window.REVIEWED_IDS.push(rain.id)}
window.mergeReviewedData = stored => {
 const old=new Map(stored.map(d=>[d.id,d]));
 const result=base.map(seed=>{const previous=old.get(seed.id);old.delete(seed.id);return previous&&!window.REVIEWED_IDS.includes(seed.id)?{...previous,chipEvidence:seed.chipEvidence}: {...previous,...seed}});
 return result.concat([...old.values()].map(d=>({...d,companyTag:d.companyTag==='xAI'?'SpaceX':d.companyTag})));
};
})();
