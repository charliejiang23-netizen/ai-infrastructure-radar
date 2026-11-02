// Field-level source review. Research cutoff: 2026-11-02. No automatic refresh implied.
(() => {
const records = {};
const source=(type,title,url,scope,date='未标明',access='公开页面或检索摘录')=>({type,title,url,scope,date,access,checked:'2026-11-02'});
const O=(title,url,scope,date)=>source('官方 / 项目',title,url,scope,date);
const N=(title,url,scope,date)=>source('新闻 / 独立报道',title,url,scope,date);
const W=(title,url)=>source('维基百科',title,url,'背景与参考文献入口，不作为容量或芯片独立确认');
const X=(title,url,scope)=>source('X / 待复核',title,url,scope,'见原帖','原帖返回 403；仅找到外部引用，不纳入已验证证据');
function set(id,note,sources,fields={}){records[id]={note,sources,fields};}
set('deepseek-ulanchab-firefly','仅找到乌兰察布新建项目的媒体线索；原来的已运营 200 MW、2 万卡和 R1 训练地点缺少可归属证据，撤下这些数值。',[
 N('新浪 / 智通财经：乌兰察布项目报道','https://finance.sina.com.cn/stock/t/2026-07-31/doc-inikstfi4446168.shtml','报道拟建设约 1 GW；属于规划线索，非竣工证据','2026-07-31'),
 O('DeepSeek-V3 技术报告','https://arxiv.org/abs/2412.19437','H800 训练硬件；论文不能证明乌兰察布机房位置','2024-12')
],{name:'DeepSeek 乌兰察布项目线索（待官方确认）',status:'unverified',statusText:'媒体线索 · 待确认'});
set('coreweave-texas-denton','官方披露约 260 MW 关键 IT 容量扩建；原 500 MW / 1 GW 及投资数值不能沿用。合同收入不等于建设投资。',[
 O('Core Scientific / SEC：Denton 扩建','https://www.sec.gov/Archives/edgar/data/1839341/000162828025008312/ex991-coreweavepressrelease.htm','新增 70 MW、总计约 260 MW；12 亿美元为合同收入','2025-02-26'),
 O('Core Scientific：与 CoreWeave 扩建合作','https://corescientific.com/news/core-scientific-and-coreweave-announce-1-2b-expansion-in-texas-to-power-ai-growth/','同一企业公告的发布渠道，不算独立第二信源','2025-02-26'),
 W('CoreWeave 公司背景','https://en.wikipedia.org/wiki/CoreWeave')
],{powerMW:'260 MW（合同 / 扩建 IT 容量）',status:'construction'});
set('coreweave-europe-norway','项目可定位为 Vennesla 的 Bulk N01。欧洲总投资不分摊到此园区；2025 年预计投产时间不能替代实际投运公告。',[
 O('Bulk：CoreWeave N01 合作','https://bulkinfrastructure.com/newsroom/coreweave-partners-with-bulk-infrastructure','N01 地点、GB200 NVL72 部署计划','2025-03-14'),
 O('Euronext：合作公告存档','https://live.euronext.com/sites/default/files/company_press_releases/attachments_oslo/2025/03/14/641268_CoreWeave%20partners%20with%20Bulk%20Infrastructure%20for%20one%20of%20the%20largest%20NVIDIA%20AI%20deployments%20in%20Europe.pdf','与 Bulk 同源；不算独立验证','2025-03-14')
],{name:'CoreWeave / Bulk N01 挪威 AI 集群',location:'挪威 Vennesla（区域级示意点）',lat:58.27,lng:7.97,status:'construction',gpuCount:'NVIDIA GB200 NVL72（官方部署计划）'});
set('softbank-europe-uk-ai','本轮未找到能对应“英国 Project Izanagi 250 MW”这一组合的官方项目资料。保留为待核实线索，不以其他国家软银项目替代。',[],{status:'unverified',statusText:'项目身份待核实'});
set('japan-tokyo-softbank-ai','原日本全国 / 东京记录与大阪堺项目混淆，改为可明确定位的堺项目。官方 2025 与现行页面的容量、投产计划不同，保留日期差异。',[
 O('SoftBank：收购夏普堺工厂','https://www.softbank.jp/corp/news/press/sbkk/2025/20250314_01/','约 150 MW 受电容量、2026 年目标；不是 IT 负载','2025-03-14'),
 O('SoftBank：现行基础设施目标','https://www.softbank.jp/en/corp/sustainability/materiality/next-gen-infra/','堺 140 MW、FY2027 目标；需核对新旧容量口径')
],{name:'SoftBank 大阪堺 AI 数据中心',location:'日本大阪府堺市（区域级示意点）',lat:34.60,lng:135.44,status:'construction',powerMW:'未统一（140 / 150 MW 口径见来源）'});
set('crusoe-lancaster-ai','原 Crusoe / Lancaster / 1.2 GW 组合无法确认。已找到 CoreWeave 的 Lancaster 项目及 Crusoe 的 Childress 项目，属于不同公司 / 地点，不合并。',[
 O('CoreWeave：宾夕法尼亚投资','https://investors.coreweave.com/news/news-details/2025/CoreWeave-Announces-Multi-Billion-Dollar-Commitment-to-AI-Infrastructure-in-Pennsylvania/default.aspx','Lancaster 的主体是 CoreWeave；反证原混合记录','2025-07-15'),
 O('Crusoe：Childress 1 GW 园区','https://www.crusoe.ai/resources/newsroom/crusoe-and-lancium-announce-1-gigawatt-ai-data-center-campus-in-childress-texas','Childress 项目；不是 Lancaster','2026-07-15')
],{status:'unverified',statusText:'项目混淆 · 待拆分'});
set('nebius-finland-mantsala','官方公告确认 Mäntsälä 扩建至 75 MW；容量是扩建规模，不能从最大容纳卡数推断已安装数量。',[
 O('Nebius：芬兰扩建至 75 MW','https://nebius.com/newsroom/nebius-to-triple-capacity-at-finland-data-center-to-75-mw','园区、扩建规模及 H100 / H200 供给计划','2024-10-08'),
 source('独立研究 / 跟踪','NBIS Tracker：Mäntsälä','https://nbistracker.com/sites/mantsala','跟踪页面称 2026-03 完成扩建，需与最新原始文件核对')
],{powerMW:'75 MW（官方扩建规模）',status:'operational',gpuCount:'NVIDIA H100 / H200（官方披露供给；比例未知）'});
set('lambda-labs-dallas','定位为 Plano 的 Aligned DFW-04 租用项目；撤下原 150 MW 和未证实的单站卡数。',[
 N('DCD：Lambda 租用 DFW-04','https://www.datacenterdynamics.com/en/news/lambda-cloud-to-take-capacity-at-aligneds-dfw-04-dallas-fort-worth-data-center/','主体、Plano 地点、液冷建设计划','2025-05-08'),
 O('Plano：数据中心建设消息','https://www.plano.gov/content/ed-news/new-700m-data-center-takes-shape-in-east-plano','市政府项目消息；投资范围需核对','2025-05-07')
],{name:'Lambda / Aligned DFW-04 Plano 项目',status:'construction'});
set('macau-hengqin-computing','未找到澳门大学拥有原记录规模智算中心的证据。澳琴国际数据中心的公布运营方为博维、横琴应来云及珠海联通，与澳门大学不是同一主体。',[
 O('深圳港澳办：澳琴国际数据中心启动','https://hmo.sz.gov.cn/zx/gasd/content/post_1556048.html','相关项目的真实运营方；不能证实原澳门大学归属'),
 O('澳门政府：澳大横琴延伸办学','https://www.gov.mo/zh-hans/news/864914/','科研平台与校区，非原 GPU 园区规模证明')
],{status:'unverified',statusText:'主体与规模待核实'});
set('shanghai-lingang-sensetime','官方年报确认临港 AIDC 已运营；公开能耗数据不能直接当作额定 MW，集团总卡数也不能直接分配到此站。',[
 O('商汤：2024 年报 / ESG','https://www.hkexnews.hk/listedco/listconews/sehk/2025/0424/2025042401051.pdf','AIDC 自 2022 年运营及能源信息','2025-04-24')
],{status:'operational'});
set('zhangjiakou-huailai-bytedance','ODCC 项目评估与秦淮报告可交叉确认怀来布局；仅能确认园区，不能确认原 GPU 型号与数量。',[
 source('行业评估','ODCC：官厅湖基地一期','https://www.odcc.org.cn/auth/v-1175966206173532161.html','字节跳动官厅湖项目、位置、机房设计'),
 O('秦淮：ESG 报告','https://www.chindatagroup.com/upload/portal/20231025/f69bf9266d038317202799b18321f3d8.pdf','怀来同城三基地；供应商侧布局证据','2022')
],{status:'operational'});
set('taiwan-kaohsiung-nvidia','高雄先进计算中心由鸿海规划。NVIDIA 后续 1 万颗 Blackwell 公告为台湾 AI Factory 项目级，不全量归属高雄单站。',[
 O('鸿海：高雄先进计算中心','https://www.foxconn.com/en-us/press-center/press-releases/latest-news/1350','高雄位置、Blackwell 平台计划','2024-06-04'),
 O('NVIDIA：台湾 AI Factory','https://nvidianews.nvidia.com/news/foxconn-ai-factory-tsmc-taiwan-nvidia','台湾项目计划 1 万颗 Blackwell；非高雄单站已安装量','2025-05-18')
],{name:'鸿海 / NVIDIA 高雄先进计算中心',status:'construction',gpuCount:'NVIDIA Blackwell（项目计划；本站数量未确认）'});
set('colossus-2-memphis','Colossus 1 与 2 的卡数必须分开。公开文件、官方社交表述和第三方估算的规模不同，暂不提供单一已投运 MW。',[
 O('SpaceX：公司招股说明书','https://content.spacex.com/cms-assets/FINAL_Documents%20and%20Updates/SpaceX%20-%20EU%20Prospectus%20%28Approved%20by%20Bafin%29%20-%20June%205%2C%202026.pdf','Colossus 后续集群 GB200 披露；历史时点，非当前总量','2026-06-05'),
 X('Elon Musk：Colossus 2 投运帖','https://x.com/elonmusk/status/2012500968571637891','负责人陈述；原帖尚未直读'),
 X('S.E. Robinson：现场 / 电源跟踪','https://x.com/SERobinsonJr/status/1941502884702523672','第三方观察线索；不是官方实测容量'),
 N('Tom’s Hardware：容量争议','https://www.tomshardware.com/tech-industry/artificial-intelligence/elon-musks-xai-colossus-2-is-nowhere-near-1-gigawatt-capacity-satellite-imagery-suggests-despite-claims-site-only-has-350-megawatts-of-cooling-capacity','2026 年 1 月声明与估算存在差异；不代表 11 月现状','2026-01-21'),
 W('Colossus 项目与引文','https://en.wikipedia.org/wiki/Colossus_(data_center)')
],{status:'operational',gpuCount:'NVIDIA GB200 / GB300；当前卡数与配比未统一'});

const colossus=records['colossus-2-memphis'];
colossus.note='截至 2026-11-02 核查，按 Epoch AI 当前已知项目的估算 AI 算力，Colossus 2 为最大，约 111.2 万 H100e。H100e 是等效算力，不是 GPU 张数。Epoch 估算当前 IT 容量约 946 MW；按该指标，New Carlisle 约 1,037 MW 更大。远期 1,531 MW / 182.4 万 H100e 属于预测，不计为当前投运。Colossus 1 与 2 不合并统计。';
Object.assign(colossus.fields,{name:'SpaceX Colossus 2 · 当前已知 AI 算力领先',powerMW:'官方单站当前容量未统一；Epoch 估算 946 MW（不计入汇总）',gpuCount:'NVIDIA B200 / B300（Epoch 估算）；111.2 万 H100e，非 GPU 张数',computeEstimate:{h100e:1112000,itMW:946,asOf:'2026-07-30',checked:'2026-11-02',source:'Epoch AI',method:'研究模型估算',includeInOfficialTotals:false}});
colossus.sources.push(source('研究 / 模型估算','Epoch AI：Colossus 2 当前与预测规模','https://epoch.ai/data/ai-data-centers/directory/colossus-2','当前约 111.2 万 H100e / 946 MW；芯片型号为研究估计；未来规模另列','2026-07-30'),source('研究 / 模型估算','Epoch AI：当前 IT 功率容量排名','https://epoch.ai/graphs/largest-ai-data-centers-by-power-capacity','2026 年 11 月：New Carlisle 1,037 MW、Colossus 2 946 MW；容量而非实时用电','2026-11-01'),source('研究 / 模型估算','Epoch AI：最大已知 AI 数据中心算力','https://epoch.ai/','当前已知最大项目约 110 万 H100 等效算力；与 Colossus 2 档案对应','2026-11-02'));
set('starbase-ai-cluster','未取得可对应 Starbase 500 MW 地面 AI 集群的项目资料。SpaceX 公司并购公告不能证明这个基地存在。',[
 O('xAI 加入 SpaceX','https://x.ai/news/xai-joins-spacex','仅支持公司归属，不支持此项目及容量','2026-02-02')
],{status:'unverified',statusText:'基地存在待核实'});
set('stargate-wisconsin','更正为微软 Mount Pleasant 的 Fairwater。该站不应直接标成 OpenAI Stargate；最新投运状态仍需项目公告。',[
 O('Microsoft：Fairwater 项目介绍','https://blogs.microsoft.com/blog/2025/09/18/inside-the-worlds-most-powerful-ai-datacenter/','官方命名、地点、AI 功能','2025-09-18'),
 O('Microsoft：威斯康星建设说明','https://blogs.microsoft.com/on-the-issues/2025/09/18/made-in-wisconsin-the-worlds-most-powerful-ai-datacenter/','同一公司；项目建设阶段','2025-09-18')
],{name:'Microsoft Fairwater 威斯康星 AI 数据中心',companyTag:'微软',company:'Microsoft',status:'construction',gpuCount:'NVIDIA Blackwell（Fairwater 项目级披露）'});
set('meta-prometheus-ohio','Meta 2026 年 10 月确认第一阶段完成并用于训练；约 100 万 GPU 是最终规模目标，不是已安装总数。核电协议也不等于园区直接核电供电。',[
 O('Meta：Prometheus 工程详解','https://engineering.fb.com/2026/10/19/data-center-engineering/inside-prometheus-meta-gigawatt-scale-supercluster/','第一阶段运营、NVL72 架构与最终规模目标','2026-10-19'),
 O('New Albany：核能项目说明','https://newalbanyohio.org/news/2026/01/statement-regarding-metas-nuclear-energy-projects/','园区从区域电网取电，核设施不在本园区','2026-01-15'),
 N('AP：核能合作报道','https://apnews.com/article/0eb051a9a11d96f7ce200e186ad13476','能源协议背景，非实时园区负载','2026-01-09')
],{status:'operational',powerMW:'未披露实测（GW 级为整体目标）',gpuCount:'NVIDIA Blackwell / NVL72；分期运行，配比未披露'});
set('aws-rainier-nuclear','Rainier 是多数据中心计算集群，不把项目总卡数和核电站旁单一园区混合。',[
 O('Amazon：Project Rainier','https://www.aboutamazon.com/news/aws/aws-project-rainier-ai-trainium-chips-compute-cluster','近 50 万 Trainium2 为多站项目级披露，非单点数量')
],{name:'AWS Project Rainier（多站项目）',status:'operational',gpuCount:'AWS Trainium2；近 50 万颗为多站项目级披露'});
set('google-council-bluffs','Google 官网确认 Council Bluffs 园区；第三方对 TPU 代际的估计不视为官方机房清单。',[
 O('Google：Iowa 园区介绍','https://www.datacenters.google/locations/iowa/','Council Bluffs 布局和扩建'),
 source('独立研究 / 估算','Epoch AI：Council Bluffs East','https://epoch.ai/data/ai-data-centers/directory/google-council-bluffs-east','TPU 代际及容量为模型估算，不是官方披露'),
 W('Google 数据中心','https://en.wikipedia.org/wiki/Google_data_centers')
],{status:'operational'});
set('france-paris-scaleway-mistral','原记录混合 Scaleway 合作与 Mistral 自建园区。融资报道定位 Bruyères-le-Châtel；不能把欧洲总规模计入单站。',[
 O('Mistral：Compute 产品','https://mistral.ai/cloud/','服务平台背景，不证明原单站规模'),
 N('Bloomberg：Mistral 园区融资','https://news.bloomberglaw.com/artificial-intelligence/mistral-raises-830-million-to-house-nvidia-chips-in-data-center','8.3 亿美元融资用途与地点，非投产确认','2026-03-30'),
 W('Mistral AI 引文入口','https://fr.wikipedia.org/wiki/Mistral_AI')
],{status:'unverified',statusText:'园区身份与范围待拆分'});
set('saudi-neom-zero-carbon','以最新官方分期为准：360 MW 首期已开工，其中 100 MW 预计 2028 年可用；1.5 GW 为全园区规划。',[
 O('NEOM：DataVolt 合作','https://www.neom.com/en-us/newsroom/datavolt-signs-agreement-with-neom','2025 初始计划与投资范围','2025-02-10'),
 O('NEOM：HUMAIN / DataVolt 开工更新','https://www.neom.com/en-us/newsroom/HUMAIN-and-DataVolt-to-develop-AI-data-center-in-NEOM','360 MW 首期、100 MW 2028 目标、1.5 GW 远期','2026-08-31')
],{status:'construction',powerMW:'360 MW（首期建设；非已投运）'});
set('g42-stargate-uae','1 GW 为 Stargate UAE 计划，200 MW 为 2026 首期目标，不把更大的美阿园区全量算入。社交航拍估算单列。',[
 O('OpenAI：Stargate UAE','https://openai.com/index/introducing-stargate-uae/','Abu Dhabi、1 GW 总规划、200 MW 首期目标','2025-05-22'),
 N('Axios：Stargate UAE 公告报道','https://www.axios.com/2025/05/22/uae-openai-stargate-deal','独立媒体核对参与方与公告规模','2025-05-22'),
 X('SemiAnalysis：UAE 建设跟踪','https://x.com/SemiAnalysis_/status/2004743498298523788','专家观察线索；原帖 403，未纳入容量确认')
],{powerMW:'1000 MW（总规划；首期目标 200 MW）',status:'construction'});
set('india-gujarat-reliance-jio','Jamnagar 有多个合作与分期。2026 官方可确认 Meta 租用项目 168 MW，原 3 GW 全园区数字不等于这个合同。',[
 O('Reliance：Meta Jamnagar 合作','https://www.ril.com/sites/default/files/2026-06/SE_10062026.pdf','168 MW、预计两年交付、可扩容','2026-06-10'),
 W('Reliance 背景','https://en.wikipedia.org/wiki/Reliance_Industries')
],{name:'Reliance / Meta Jamnagar 数据中心项目',powerMW:'168 MW（合同建设规模）',status:'planned'});
set('india-mumbai-yotta-shakti','官方确认 NM1 收到 H100 首批；采购订单、交付和已部署须分开，不能把整个 Shakti Cloud 数量都分给 NM1。',[
 O('Yotta：NM1 首批 H100','https://yotta.com/press-releases/yotta-receives-indias-first-ever-consignment-of-nvidia-h100-the-fastest-gpus-in-the-world-at-its-nm1-data-center-park/','2024 年 3 月首批超过 4000 颗 H100；其余为计划','2024-03-19'),
 O('Yotta：Shakti Cloud 产品册','https://www.yotta.com/wp-content/uploads/Yotta-Shakti-Cloud-Brochure.pdf','平台硬件架构，非单站当前卡数')
],{status:'operational',gpuCount:'NVIDIA H100；2024 首批 4000+，当前总量未确认'});
set('india-vizag-adaniconnex','区分 Adani 早期项目与 Google AI hub。2025 公告为整体多年投资，2026 交易所公告确认开工。',[
 O('Adani：Google Visakhapatnam 合作','https://www.adanienterprises.com/newsroom/media-releases/adani-and-google-partner-to-build-indias-largest-data-centre-campus-in-visakhapatnam','GW 级 AI hub；150 亿美元含网络与能源','2025-10-14'),
 O('NSE：Google AI hub 开工','https://nsearchives.nseindia.com/corporate/ADANIENT_28042026133219_AELIntimationforMediaRelease28042026.pdf','Tarluvada 开工事件','2026-04-28')
],{name:'Google / AdaniConneX Visakhapatnam AI hub',status:'construction'});
set('malaysia-johor-ytl-nvidia','确认 YTL 柔佛 AI Cloud 与 GB200。500 / 600 MW 为园区发展口径，不当作当期 AI 负载。',[
 O('YTL AI Cloud：项目介绍','https://www.ytlaicloud.com/about-us/','Johor、GB200、园区扩容目标'),
 N('Bernama：Blackwell 平台报道','https://www.bernama.com/en/news.php?id=2403800','2025 年部署计划','2025-03-19'),
 N('The Edge：首个 AI 设施完成','https://theedgemalaysia.com/node/776142','运营事件；600 MW 指园区，不是当前 GPU 用电','2025-10-31'),
 W('YTL Power','https://en.wikipedia.org/wiki/YTL_Power')
],{status:'operational',gpuCount:'NVIDIA GB200 / Blackwell；园区配比未披露'});
set('malaysia-johor-bytedance-bridge','官方投资机构确认 MY06 一期 2022 年开业、字节为锚定租户。110 MW 项目与研究机构后续估算范围不同，暂不统一容量。',[
 O('MIDA：MY06 一期开业','https://www.mida.gov.my/media-release/bridge-data-centres-and-bytedance-celebrate-grand-opening-of-the-first-phase-hyperscale-data-centre-my06-in-johor-malaysia/','一期投产、110 MW 全项目、租户关系','2022-10-20'),
 source('独立研究 / 估算','Epoch AI：MY06','https://epoch.ai/data/ai-data-centers/directory/bridge-data-centres-my06','容量 / 芯片为估算，与 2022 公告时间和范围不同','2026-10-12')
],{status:'operational'});
set('singapore-tuas-singtel-nxera','运营商新闻与项目规格一致：DC Tuas 于 2026-02 开业、58 MW IT capacity；容量不等于实际瞬时耗电或全为 GPU。',[
 O('Singtel：DC Tuas 开业','https://www.singtel.com/about-us/media-centre/news-releases/nxera-opens-data-centre','58 MW AI-ready 容量与开业','2026-02-09'),
 O('Nxera：DC Tuas 规格','https://www.nxera-dc.com/our-reach/singapore-dc-tuas','IT load 最高 58 MW；同集团项目页')
],{status:'operational',powerMW:'58 MW（已开业设施 IT 设计容量）'});
set('indonesia-jakarta-indosat-bdx','实际站点为 Jatiluhur CGK4。2024 的 500 MW 与现行 640 MW 是分期扩展规划，不是已运行规模。',[
 O('BDx：CGK4 首期完成','https://www.bdxworld.com/bdx-data-centers-launches-the-first-phase-of-500mw-renewable-powered-ai-campus-in-indonesia/','首期完成、500 MW 可扩展目标','2024-07-31'),
 O('BDx：CGK4 现行规格','https://www.bdxworld.com/locations/cgk4/','640 MW 分期规划；不是全量投运')
],{name:'BDx / Indosat CGK4 Jatiluhur AI 园区',location:'印尼 Jatiluhur（区域级示意点）',lat:-6.53,lng:107.38,status:'operational'});
set('australia-sydney-airtrunk','确认 SYD3 园区；320+ MW 为开发规模，不当作当前 AI 集群用电，单站芯片由租户决定。',[
 O('AirTrunk：SYD3 园区开发','https://airtrunk.com/airtrunk-expands-western-sydney-region-with-new-syd3-hyperscale-data-centre-asia-pacifics-largest/','SYD3 位置与原开发容量；不是最新投产量'),
 O('Macquarie：AirTrunk 项目案例','https://www.macquarie.com/assets/macq/impact/esg/whs-case-study-air-trunk.pdf','投资方项目资料；非独立运营审计')
],{status:'construction'});
set('australia-sydney-nextdc','NEXTDC 现行 S4 页面为 365 MW，审批说明为 300 MW。属于版本 / 范围差异，显示双方口径而不直接相加。',[
 O('NEXTDC：S4 现行项目页','https://www.nextdc.com/data-centres/sydney-data-centres/s4-sydney','365 MW IT capacity；In Development'),
 O('NEXTDC：S4 Lot 305 审批资料','https://www.nextdc.com/s4-lot-305-conditions-of-consent','300 MW 审批范围；与现行页面不同')
],{status:'construction',powerMW:'未统一（300 / 365 MW 见来源）'});
set('australia-sydney-microsoft-cloud','这是全国基础设施投资，涉及 Sydney / Melbourne / Canberra；不能当作悉尼单站容量或投资。',[
 O('Microsoft：澳大利亚投资更新','https://news.microsoft.com/source/asia/features/investing-in-australias-ai-future/','全国 250 亿澳元至 2029 年；不是单站投资','2026'),
 O('澳大利亚工业部：Microsoft MOU','https://www.industry.gov.au/news/australian-government-has-signed-memorandum-understanding-mou-tech-giant-microsoft','2023 项目扩至 29 站及国家级合作','2026-04-23')
],{name:'Microsoft 澳大利亚区域基础设施（非单园区）',status:'unverified',statusText:'区域汇总 · 不计单站容量'});
set('africa-uganda-aeonian-nvidia','开发商介绍确认 Aeonian 规划与水电方案；10 MW 超算与 100 MW 电源规划属于不同范围，NVIDIA 具体卡数未确认。',[
 O('Synectics：Aeonian 项目介绍','https://synectics-tech.com/what-we-do/','规划中 DHPC、Karuma 电源方案'),
 N('Firstpost：Aeonian 报道','https://www.youtube.com/watch?v=NcR2jF6j8_g','10 MW 超算为报道口径；非竣工证据','2025-09-17')
],{status:'planned'});
set('africa-kenya-microsoft-g42','2024 为建设意向；2026 报道项目因电力安排受阻，不能延用原预计时间宣称已运营。',[
 O('Microsoft：肯尼亚合作意向','https://news.microsoft.com/source/2024/05/22/microsoft-and-g42-announce-1-billion-comprehensive-digital-ecosystem-initiative-for-kenya/','Olkaria 园区规划；10 亿美元是整体计划','2024-05-22'),
 N('Tom’s Hardware：项目受阻','https://www.tomshardware.com/tech-industry/microsofts-1-billion-kenya-data-center-stalls-over-disagreements-on-power-capacity','援引报道：电力安排分歧；最新状态需官方更新','2026-05')
],{status:'unverified',statusText:'计划受阻 · 待更新'});
const cassava=O('Cassava：NVIDIA AI 工厂计划','https://www.cassavatechnologies.com/cassava-to-upgrade-its-data-centres-with-nvidia-supercomputers-to-drive-africas-ai-future/','南非及埃及 / 肯尼亚 / 摩洛哥 / 尼日利亚扩展计划，不证明每站已投运','2025-03');
for(const id of ['africa-southafrica-nigeria-mtn-cassava','africa-egypt-morocco-huawei-cassava'])set(id,'原记录跨多个国家与主体，不能视为一个单站。官方资料支持 Cassava / NVIDIA 区域计划，未支持原 MTN / 华为混合归属。',[cassava,N('Semafor：NVIDIA 投资 Cassava','https://www.semafor.com/article/10/29/2025/nvidia-bets-on-zimbabwean-tech-firm-cassava','公司层面投资与区域计划；不是每站交付','2025-10-29')],{company:'Cassava Technologies',companyTag:'Cassava',status:'unverified',statusText:'区域计划 · 待拆分',gpuCount:'NVIDIA（公司区域计划；单站型号未知）'});
set('africa-gabon-nkok-stdigital','政府公告确认 Nkok 数据中心于 2026 年 7 月揭幕；未取得 AI 加速卡清单，不把通用数据中心当作已验证 GPU 集群。',[
 O('加蓬外交部：Nkok 揭幕','https://www.affaires-etrangeres.gouv.ga/9-actualites/3300-gabon-la-souverainete-numerique-du-gabon-materialisee-par-linauguration-du-premier-data-center/','2026-07-03 开业、ST Digital 运营主体','2026-07-06'),
 O('加蓬政府：建设介绍','https://gouvernement.ga/2026/06/16/inauguration-dun-data-center-le-30-juin-prochain-a-nkok-st-digital-presente-son-projet-phare-aux-medias/','建设背景；6 月预计日期被 7 月实际事件更新','2026-06-16')
],{status:'operational'});
set('kazakhstan-astana-presight-ai','官方确认 2025 年国家超算启动，但不把国家超算与后续 Presight 数据处理中心、智慧城市项目混为一体。',[
 O('Presight：哈萨克斯坦国家超算启动','https://www.presight.ai/news/kazakhstan-unveils-first-national-supercomputer-in-strategic-partnership-with-presight','2025-07-11 启动及合作主体','2025-07-11')
],{status:'operational'});
set('google-crusoe-goodnight-texas','Crusoe 确认 Google Armstrong County 园区在建。相邻风电场 265.5 MW 是发电装机，不是数据中心 IT 容量。',[
 O('Crusoe：Armstrong County 项目','https://www.crusoe.ai/resources/newsroom/crusoe-developing-data-center-campus-in-armstrong-county-texas','开发商、客户、2025 开工、风场连接','2026-09-28'),
 O('Crusoe：当地项目现场介绍','https://www.crusoe.ai/resources/blog/building-community-in-texas','同一主体现场更新，不算独立第二信源','2026-10')
],{status:'construction'});
set('anthropic-australia-queensland-zerra','报道确认 Western Downs 项目首期租赁；审批、租约和建成不同。媒体对最终容量有不同范围，暂不采单一总量。',[
 N('ABC：Western Downs 项目调查','https://www.abc.net.au/news/2026-09-18/queensland-data-centre-ai-anthropic-explainer/107163376','Kogan 位置与开发商方案','2026-09-18'),
 N('IPE Real Assets：项目合作与租赁','https://realassets.ipe.com/news/macquarie-partners-with-zerra-and-adc-to-build-australias-largest-data-centre-campus-for-anthropic/10138513.article','援引 Dexus 披露的首期租赁；容量待原始公告核对','2026-09-17')
],{status:'planned'});


records['shanghai-lingang-sensetime'].sources.push(O('上海经信委：智算中心启用','https://sheitc.sh.gov.cn/zxxx/20220125/c631264fc9f74ae3a466a1d744cc73c3.html','政府见证 2022 年点亮启用，与年报交叉确认','2022-01-25'));
const names={
 'australia-sydney-airtrunk':'AirTrunk 悉尼 SYD3 数据中心',
 'australia-sydney-nextdc':'NEXTDC 悉尼 S4 数据中心',
 'g42-stargate-uae':'Stargate UAE 阿布扎比项目',
 'india-mumbai-yotta-shakti':'Yotta NM1 / Shakti Cloud 新孟买节点',
 'anthropic-australia-queensland-zerra':'Anthropic / Zerra Western Downs 规划项目',
 'google-crusoe-goodnight-texas':'Google / Crusoe Armstrong County 园区',
 'africa-southafrica-nigeria-mtn-cassava':'Cassava 南非 / 尼日利亚区域计划',
 'africa-egypt-morocco-huawei-cassava':'Cassava 埃及 / 摩洛哥区域计划',
 'africa-gabon-nkok-stdigital':'ST Digital 加蓬 Nkok 数据中心',
 'africa-uganda-aeonian-nvidia':'Synectics Aeonian 乌干达规划项目'
};
for(const [id,name] of Object.entries(names))records[id].fields.name=name;
Object.assign(records['g42-stargate-uae'].fields,{companyTag:'G42',company:'G42 / OpenAI / Oracle / NVIDIA / Cisco / SoftBank'});
Object.assign(records['africa-kenya-microsoft-g42'].fields,{companyTag:'G42/微软'});
Object.assign(records['australia-sydney-microsoft-cloud'].fields,{companyTag:'微软',company:'Microsoft'});
Object.assign(records['indonesia-jakarta-indosat-bdx'].fields,{companyTag:'BDx',company:'BDx / Indosat / Lintasarta'});
Object.assign(records['africa-gabon-nkok-stdigital'].fields,{companyTag:'ST Digital',company:'ST Digital'});
Object.assign(records['kazakhstan-astana-presight-ai'].fields,{companyTag:'Presight',company:'Presight / 哈萨克斯坦'});
const chinaExtras={
 'tencent-guian-qixing':[O('腾讯：碳中和路线报告','https://www.tencent.com/attachments/carbon-neutrality/tencent-carbon-neutrality-report.pdf','腾讯贵安七星洞库式项目背景','2022'),O('中央网信办：贵安数据中心布局','https://www.cac.gov.cn/2026-09/01/c_1790012378081831.htm','第三方政府报道确认腾讯七星与华为各自布局','2026-09-01')],
 'tencent-qingyuan':[N('澎湃：清远数据中心探访','https://www.thepaper.cn/newsDetail_forward_10625045','清远现场报道，与官方接入点交叉核对','2021-01')],
 'tencent-yizheng':[O('腾讯：ESG 报告','https://static.www.tencent.com/uploads/2022/04/16/56e61654efa69f7503f997520a8f2766.pdf','仪征东升绿色数据中心；与接入点文档同一主体','2022-04')],
 'tencent-huailai':[O('腾讯：怀来东园微电网','https://www.tencent.com/index.php/zh-cn/articles/2202029.html','园区微电网已并网；不把发电装机当作 IT 容量'),N('人民网：腾讯怀来布局','https://finance.people.com.cn/n1/2018/0822/c1004-30244741.html','2018 年签约背景，非全部计划按时交付的证明','2018-08-22')],
 'tencent-tianjin':[O('腾讯：2023 可持续社会价值报告','https://static.www.tencent.com/attachments/ssv/2023/tencent-ssv-report-2023.pdf','天津高新光伏并网；确认园区存在，不给出 GPU 配置','2024')],
 'tencent-shanghai':[O('腾讯：2023 可持续社会价值报告','https://static.www.tencent.com/attachments/ssv/2023/tencent-ssv-report-2023.pdf','青浦光伏并网；可交叉核对早期园区记录','2024')],
 'tencent-chongqing':[O('重庆大数据局：人大建议答复','https://dsjj.cq.gov.cn/zwgk_533/jyta/202406/t20240618_13302991.html','重庆腾讯云布局；市级机架统计不归属腾讯单站','2024-06-18')],
 'alibaba-hangzhou-renhe':[O('港交所：阿里健康 ESG 报告','https://www1.hkexnews.hk/listedco/listconews/sehk/2022/0705/2022070501287.pdf','仁和数据中心液冷背景；非芯片数量证明','2022-07-05')],
 'guizhou-guian-huawei':[O('中央网信办：贵安布局','https://www.cac.gov.cn/2026-09/01/c_1790012378081831.htm','华为与腾讯独立布局；不证明本站容量','2026-09-01')]
};


const dayoneOfficial=O('DayOne：园区发展历程','https://dayonedc.com/about-us','Nusajaya 2023 年启动，Kempas 2024 年开发；官方园区身份');
const dayoneFiling=O('DayOne：SEC F-1 招股书','https://www.sec.gov/Archives/edgar/data/2118192/000119312526414188/d223752df1.htm','最大客户未具名；2025 收入占比 69.4%，2026 上半年 69.2%。集团口径，不是单园区归属','2026-10-05');
const dayoneNews=N('Bloomberg：DayOne 最大客户为字节跳动','https://news.bloomberglaw.com/capital-markets/oracle-said-to-move-ahead-with-cloud-services-plan-in-indonesia','媒体识别集团最大客户；不证明两个园区全部 GPU 归属字节跳动','2025-07-11');
for(const [slug,name,compute,mw,chips,lat,lng,date] of [
 ['nusajaya','Nusajaya',584000,473,'NVIDIA H100 / B300',1.43,103.62,'2026-10-02'],
 ['kempas','Kempas',481000,422,'NVIDIA B300',1.55,103.70,'2026-10-01']
]){
 const id='dayone-malaysia-'+slug;
 window.DEFAULT_DATACENTERS.push({id,name:'DayOne '+name+' 马来西亚园区',company:'DayOne',companyTag:'DayOne',category:'新兴算力厂商',region:'亚太地区',location:'马来西亚柔佛 '+name+'（区域示意）',lat,lng,status:'operational',images:[],videoUrl:'',timeline:[]});
 const note=`DayOne 官方确认园区身份。Epoch 估计约 ${(compute/10000).toFixed(1)} 万 H100e、${mw} MW IT 功率，芯片估计为 ${chips}；这些是影像和模型推算，并非官方交付清单。H100e 为算力等效单位，不是实体 GPU 数量。截图中前十排名属于特定日期的估算榜单，未独立复现 10 月 31 日完整历史排名。字节跳动是媒体报道的集团最大客户，不等于该园区全部设备属于字节跳动。`;
 set(id,note,[dayoneOfficial,source('研究 / 模型估算','Epoch AI：'+name+' 项目估算','https://epoch.ai/data/ai-data-centers/directory/dayone-'+slug,'算力、IT 功率与芯片均为估计；运营进度部分由卫星影像和工期假设推断',date),dayoneFiling,dayoneNews],{status:'operational',powerMW:'官方单站容量未披露；Epoch 估算 '+mw+' MW（不计入汇总）',gpuCount:chips+'（Epoch 估算）；约 '+(compute/10000).toFixed(1)+' 万 H100e，非 GPU 张数',computeEstimate:{h100e:compute,itMW:mw,asOf:date,source:'Epoch AI',method:'模型估算',includeInOfficialTotals:false}});
}

// Existing China layout review is retained, with source scopes explicitly limited.
const certification=source('第三方认证','Uptime：Alibaba 客户认证项目','https://zh.uptimeinstitute.com/uptime-institute-awards/list/client/alibaba-group-inc-/752','张北庙滩、乌兰察布、河源建筑认证；不证明 GPU 清单');
for(const d of window.DEFAULT_DATACENTERS){
 const r=records[d.id];
 d.originalRecord={name:d.name,powerMW:d.powerMW,investment:d.investment,gpuCount:d.gpuCount,status:d.status,description:d.description};
 if(r){
   Object.assign(d,{powerMW:'未核实 / 未披露',investment:'单站投资未核实',gpuCount:'基地级芯片型号、数量及占比未核实',cooling:'见项目来源；未核实原记录的工程参数',powerSource:'见项目来源；未核实原记录的能源比例',footprint:'地图为区域示意位置；不用于机房导航',timeline:[],description:r.note},r.fields);
   d.evidence={note:r.note,sources:r.sources,checked:'2026-11-02',level:d.status==='unverified'?'存在疑点 / 待核实':r.sources.length>1?'多份资料 / 独立性见说明':'单一来源 / 待交叉验证'};
   d.chipEvidence={level:r.fields.gpuCount?'项目级 / 范围见证据':'基地级未披露',summary:d.gpuCount,note:'有型号不等于完整芯片组成；未公开数量或占比不推算。计划部署与已交付请按来源日期区分。',sources:r.sources.filter(s=>s.type==='官方 / 项目').map(s=>[s.title,s.url])};
 }else{
   d.evidence={note:d.verification||'原始资料待进一步核查',sources:(d.sources||[]).map(([t,u])=>source(/gov\.|miit/.test(u)?'政府 / 官方':'官方 / 项目',t,u,'仅确认原布局说明所列字段；不确认 MW、GPU 数量和配比')),checked:'2026-11-02',level:'园区布局有来源 / AI 配置未知'};
   if(['alibaba-zhangbei','alibaba-ulanqab','alibaba-heyuan'].includes(d.id))d.evidence.sources.push(certification);
 }
 if(chinaExtras[d.id])d.evidence.sources.push(...chinaExtras[d.id]);
 d.statusText=({operational:'有运营记录 · 规模见来源',construction:'建设 / 扩建记录 · 最新进度见来源',planned:'规划记录 · 非已投运',unverified:'身份 / 状态待核实'})[d.status];
 if(d.computeEstimate){d.chipEvidence.level='研究模型估算 / 非官方清单';d.chipEvidence.sources=d.evidence.sources.filter(s=>s.type==='研究 / 模型估算').map(s=>[s.title,s.url]);}
 d.sources=d.evidence.sources.filter(s=>s.type!=='X / 待复核').map(s=>[s.title,s.url]);
 d.verification=d.evidence.note;d.reviewedAt='2026-11-02';
 if(d.id==='guizhou-guian-huawei')d.cooling='园区冷却方案未核实';
 window.REVIEWED_IDS.push(d.id);
}
window.EVIDENCE_POLICY='官网与项目公告优先；同一公告转载不算独立信源。新闻用于交叉核对；X 官方与专家帖子区分陈述和估算；维基用于背景与原始引文。持续更新中；本版核查日期 2026-11-02，不代表实时自动更新。';
window.renderSourceAtlas=app=>{
 const rows=app.datacenters, sources=rows.flatMap(d=>d.evidence?.sources||[]), unique=new Set(sources.map(s=>s.url)).size;
 return `<div class="atlas-inner"><div class="atlas-title"><span class="eyebrow">SOURCE INTELLIGENCE / 证据中心 · 持续更新</span><h2>让每一条数据，有据可查。</h2><p>从项目公告追到原始文件，分清已发生、计划与估算。</p></div><div class="audit-stats"><div><strong>${rows.length}</strong><span>项目档案</span></div><div><strong>${unique}</strong><span>不同来源链接</span></div><div><strong>${rows.filter(d=>d.status==='unverified').length}</strong><span>身份 / 状态存在疑点</span></div></div><div class="atlas-notice">${app.escapeHTML(window.EVIDENCE_POLICY)}</div><p class="audit-explainer">有多个链接，不等于多方独立确认。公司新闻稿、交易所存档与转载可能同源。容量按 IT 设计、受电、规划和实际运行分别理解；区域项目不与单园区叠加。X 原帖受限时保留链接，并明确标为待复核。</p><div class="atlas-notice"><strong>11 月 2 日更新 · 算力领先：Colossus 2</strong><br>Epoch 估算约 111.2 万 H100e，为当前已知 AI 算力最大项目；IT 容量约 946 MW，按电力容量则 New Carlisle 约 1,037 MW 更大。以上均为研究估算，不是实时实测。<br><strong>DayOne 截图核查</strong><br>已加入 Nusajaya 与 Kempas。官方确认园区，Epoch 提供估算；“全球前十”不能当作官方实测排名。最大客户关系不等于单站设备所有权。截图下方 2027 年 AGI 与收购说法属于推测。</div><div class="source-toolbar"><input id="sourceSearch" aria-label="搜索证据档案" placeholder="搜索项目、公司、地区或来源"><select id="sourceFilter" aria-label="筛选证据类型"><option value="all">全部档案</option><option value="unverified">存在疑点</option><option value="官方">官网 / 官方资料</option><option value="新闻">核心新闻</option><option value="X /">X 官方与专家线索</option><option value="维基">维基百科</option></select></div><div id="sourceCards" class="source-grid"></div></div>`;
};
window.bindSourceAtlas=app=>{
 const search=document.getElementById('sourceSearch'),filter=document.getElementById('sourceFilter'),container=document.getElementById('sourceCards');
 const draw=()=>{
  const q=search.value.trim().toLowerCase(),f=filter.value;
  const rows=app.datacenters.filter(d=>{const e=d.evidence;return(!q||[d.name,d.company,d.location,...(e?.sources||[]).map(s=>s.title)].join(' ').toLowerCase().includes(q))&&(f==='all'||(f==='unverified'?d.status===f:e?.sources.some(s=>s.type.includes(f))))});
  container.innerHTML=rows.length?rows.map(d=>`<article class="source-card"><div>${app.companyLogo(d.companyTag)}<span>${app.escapeHTML(d.evidence?.level||'待核实')}</span></div><h3>${app.escapeHTML(d.name)}</h3><p>${app.escapeHTML(d.evidence?.note||'尚无证据')}</p><p class="source-types">${app.escapeHTML([...new Set((d.evidence?.sources||[]).map(s=>s.type))].join(' · ')||'尚未找到项目级来源')}</p><button data-evidence-id="${app.escapeHTML(d.id)}">查看 ${d.evidence?.sources.length||0} 条来源与字段说明 ↗</button></article>`).join(''):'<p class="source-empty">没有匹配的证据档案</p>';
  container.querySelectorAll('button[data-evidence-id]').forEach(b=>b.addEventListener('click',()=>{app.switchToView('map');app.selectDatacenter(b.dataset.evidenceId,true);}));
 };
 search.addEventListener('input',draw);filter.addEventListener('change',draw);draw();
};
window.renderEvidence=(d,esc)=>{
 const e=d.evidence||{level:'自定义记录待核实',note:'尚未添加项目证据',sources:[]};
 return `<section class="source-evidence evidence-dossier"><div class="evidence-heading"><h4>项目证据档案</h4><span>${esc(e.level)}</span></div><p>${esc(e.note)}</p><small>核查：${esc(e.checked||'未核查')} · 字段与来源分别判定</small>${e.sources.map(s=>`<article><div><span>${esc(s.type)}</span><time>${esc(s.date)}</time></div><a class="source-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a><p>${esc(s.scope)}</p><small>${esc(s.access)}</small></article>`).join('')}<p class="evidence-policy">${esc(window.EVIDENCE_POLICY)}</p>${d.originalRecord?`<details><summary>查看更正前的原始记录（未经验证）</summary><pre>${esc(JSON.stringify(d.originalRecord,null,2))}</pre></details>`:''}</section>`;
};
})();
