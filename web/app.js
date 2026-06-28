const STORAGE_KEY = "agsm-dashboard-v8";
const AUTH_KEY = "agsm-auth-v1";
const API_STATE_ENDPOINT = "/api/state";
const REMOTE_SYNC_DELAY = 700;
const SEED_ACTION_VERSION = "20260627-expanded-actions";

let remoteSaveTimer;
let remoteSyncAvailable = false;
let remoteHydrating = false;

const teamMembers = ["罗飞", "蓝浩", "潘尔逊", "彭泰请", "秦钦勇", "王汉钊", "许森", "钟启庆", "邹一先"];

const accounts = [
  {
    username: "admin",
    password: "admin123",
    name: "部门领导",
    role: "admin",
    personName: ""
  },
  {
    username: "lh",
    password: "123456",
    name: "林荟",
    role: "member",
    personName: "林荟"
  },
  {
    username: "cyh",
    password: "123456",
    name: "陈远航",
    role: "member",
    personName: "陈远航"
  },
  {
    username: "zrx",
    password: "123456",
    name: "周若溪",
    role: "member",
    personName: "周若溪"
  }
];

const seedState = {
  report: {
    badge: "OGSM 2026",
    title: "OGSM进度汇报",
    owner: "林荟",
    period: "2026 全年",
    department: "IT-数据应用支持组",
    updatedAt: "2026-06-17"
  },
  object:
    "构建高质量、标准化、可信赖的企业级数据仓库，实现数据资产的价值最大化；聚焦于消除数据孤岛，提升数据准确性与一致性，为业务决策提供坚实的数据基础。",
  goals: []
};

const memberGoalSets = {
  lh: {
    owner: "林荟",
    helper: "陈远航",
    updatedAt: "2026-06-17",
    goals: [
  {
    goal: "应用支持需求响应与交付提效",
    strategy:
      "1、统一需求受理、评估、排期和交付跟踪机制。\n2、建立需求优先级和响应时效标准，提升跨部门协同效率。\n3、沉淀高频问题处理方案，降低重复沟通和返工。",
    measure:
      "1、重点业务需求响应及时率>=95%。\n2、需求按期交付率>=90%，高优需求延期率<=5%。\n3、形成高频问题知识卡>=20篇，复用率>=60%。",
    tactics:
      "1、梳理现有需求来源和流转节点，形成统一需求台账。\n2、制定需求分级、优先级和响应时效规则。\n3、建立需求排期看板，标记负责人、协助人和预计完成日期。\n4、每周同步需求进展和风险，推动阻塞事项闭环。\n5、对跨部门需求建立验收清单，减少上线前返工。\n6、沉淀高频应用问题处理步骤和模板。\n7、对重点需求进行上线后复盘，记录可复用经验。\n8、每月复查延期需求，输出流程优化建议。"
  },
  {
    goal: "核心应用稳定性与问题闭环",
    strategy:
      "1、围绕核心应用建立巡检、监控、告警和问题复盘机制。\n2、对高频故障进行根因分析，推动系统性修复。\n3、完善应用支持值班和升级响应流程。",
    measure:
      "1、核心应用可用性>=99.5%。\n2、P1/P2 问题当天响应率100%，闭环率>=95%。\n3、高频重复问题下降30%。\n4、应用巡检覆盖核心系统>=10个。",
    tactics:
      "1、梳理核心应用清单和关键健康指标。\n2、建立日常巡检表和异常登记机制。\n3、配置关键异常提醒，明确责任人和升级路径。\n4、补充重点系统发布前检查项，降低变更风险。\n5、对 P1/P2 问题建立专项跟踪台账。\n6、每月复盘高频问题并推动长期修复。\n7、完善应用支持值班交接和应急预案。\n8、定期演练应急预案并更新联系人清单。"
  },
  {
    goal: "业务数据报表支持与口径治理",
    strategy:
      "1、规范业务报表需求、指标口径和验收流程。\n2、聚焦销售、客服、供应链等重点场景提升报表可用性。\n3、建立报表资产清单，推动重复报表合并和下线。",
    measure:
      "1、核心报表需求交付>=10项。\n2、重点指标口径确认率>=95%。\n3、报表重复建设减少20%。\n4、业务报表满意度>=90%。",
    tactics:
      "1、整理现有报表资产和使用频率。\n2、对重点指标建立口径说明和负责人。\n3、补齐报表字段说明、刷新频率和适用场景。\n4、优化高频报表展示和筛选体验。\n5、建立报表需求验收模板，统一确认范围。\n6、组织业务验收并记录调整意见。\n7、清理低频、重复或口径不一致报表。\n8、每月输出报表使用分析，推动资产治理。"
  },
  {
    goal: "应用支持知识库与培训赋能",
    strategy:
      "1、沉淀应用支持 SOP、常见问题和操作指引。\n2、面向业务和内部成员开展分层培训。\n3、通过知识库复用提升新人接手和跨岗协作效率。",
    measure:
      "1、输出应用支持知识文档>=30篇。\n2、组织业务培训>=4场。\n3、常见问题自助解决率提升30%。\n4、新成员上手周期缩短20%。",
    tactics:
      "1、按系统和业务场景整理知识库目录。\n2、沉淀常见问题、处理步骤和注意事项。\n3、制作重点应用操作培训材料。\n4、建立新人上手任务包和检查清单。\n5、将典型问题录入知识库并关联对应系统。\n6、定期更新过期文档并标记负责人。\n7、收集培训反馈，补充业务高频疑问。\n8、每季度评估知识库访问和复用效果。"
  }
    ]
  },
  cyh: {
    owner: "陈远航",
    helper: "林荟",
    updatedAt: "2026-06-17",
    goals: [
      {
        goal: "数据质量规则建设与巡检提效",
        strategy:
          "1、围绕核心业务表建立统一质量规则库。\n2、把人工巡检转成自动校验和异常提醒。\n3、推动质量问题按责任人闭环处理。",
        measure:
          "1、核心表质量规则覆盖率>=90%。\n2、质量异常当天识别率>=95%。\n3、重复质量问题下降30%。",
        tactics:
          "1、梳理核心业务表和关键字段清单。\n2、建立空值、重复、范围、口径一致性校验规则。\n3、配置每日质量巡检任务和异常提醒。\n4、按业务主题设置质量规则优先级和负责人。\n5、对高风险字段增加阈值波动监控。\n6、形成质量问题台账并跟踪责任人处理。\n7、每月复盘重复异常并推动源头修复。\n8、输出质量规则覆盖报告，推动规则补齐。"
      },
      {
        goal: "供应链报表与库存分析优化",
        strategy:
          "1、围绕采购、库存、仓储主题优化分析口径。\n2、提升供应链看板查询效率和异常定位能力。\n3、沉淀库存周转、库龄和缺货预警指标。",
        measure:
          "1、供应链核心看板优化>=4个。\n2、库存分析指标口径确认率>=95%。\n3、重点报表查询耗时下降30%。",
        tactics:
          "1、整理供应链报表使用反馈和慢查询清单。\n2、统一采购履约、库存周转、库龄等指标口径。\n3、优化高频报表筛选条件和数据模型。\n4、补充缺货、滞销、库存异常预警指标。\n5、梳理库存异常分类和处理责任人。\n6、建立重点 SKU 周转跟踪视图。\n7、组织业务验收并记录优化闭环。\n8、每月回看供应链报表使用和性能表现。"
      },
      {
        goal: "数据接口稳定性与任务监控",
        strategy:
          "1、建立核心接口和同步任务监控清单。\n2、对任务失败、延迟和数据量异常进行分级提醒。\n3、完善接口异常排查和恢复 SOP。",
        measure:
          "1、核心同步任务监控覆盖率100%。\n2、任务失败平均发现时间<=10分钟。\n3、接口异常恢复 SOP 覆盖核心链路>=8条。",
        tactics:
          "1、梳理核心数据同步任务和依赖关系。\n2、配置任务失败、延迟、数据量波动监控。\n3、建立接口异常排查步骤和联系人清单。\n4、按链路梳理上游系统、下游报表和影响范围。\n5、补充任务重跑、补数和回滚操作指引。\n6、每周检查任务运行趋势和隐患。\n7、沉淀典型故障案例和恢复脚本。\n8、定期复查监控阈值，减少误报和漏报。"
      },
      {
        goal: "数据资产目录与口径沉淀",
        strategy:
          "1、整理核心主题域表、指标和报表资产。\n2、明确指标口径、负责人和适用场景。\n3、减少重复取数和口径争议。",
        measure:
          "1、核心数据资产登记>=80项。\n2、重点指标口径说明>=30项。\n3、重复取数需求下降20%。",
        tactics:
          "1、盘点现有报表、宽表和指标清单。\n2、补充字段说明、负责人和更新频率。\n3、建立指标口径评审和变更记录。\n4、按主题域整理资产标签和适用业务场景。\n5、补齐重点资产的数据来源和血缘说明。\n6、对重复报表和低频资产进行合并建议。\n7、推动业务使用统一资产目录取数。\n8、每月更新资产目录变更和下线清单。"
      }
    ]
  },
  zrx: {
    owner: "周若溪",
    helper: "林荟",
    updatedAt: "2026-06-17",
    goals: [
      {
        goal: "流程自动化与业务效率提升",
        strategy:
          "1、识别高频重复操作并推动自动化替代。\n2、统一 RPA/脚本任务台账和运行监控。\n3、降低人工处理耗时和异常遗漏。",
        measure:
          "1、上线自动化任务>=6个。\n2、重复人工处理时长下降35%。\n3、自动化任务成功率>=98%。",
        tactics:
          "1、收集业务高频重复操作和痛点场景。\n2、评估自动化收益、风险和优先级。\n3、开发并上线报表下载、数据校验、通知类任务。\n4、建立自动化任务运行日志和异常提醒。\n5、为关键自动化任务补充失败重试和人工兜底流程。\n6、整理自动化任务权限和执行账号清单。\n7、定期复盘任务收益并优化执行稳定性。\n8、沉淀可复用脚本模板，提升后续开发效率。"
      },
      {
        goal: "客服运营数据支持与问题追踪",
        strategy:
          "1、围绕客服响应、转化、工单和售后场景建设分析报表。\n2、推动客服异常指标可追踪、可定位、可复盘。\n3、提升业务主管自助分析能力。",
        measure:
          "1、客服核心报表交付>=5个。\n2、客服指标口径确认率>=95%。\n3、客服异常问题闭环率>=90%。",
        tactics:
          "1、梳理客服业务指标和管理场景。\n2、搭建响应时长、询单转化、工单超时等分析报表。\n3、配置客服异常清单和责任人跟进字段。\n4、补充售后、退款、投诉等重点问题分类维度。\n5、建立客服异常指标周跟踪机制。\n6、组织客服主管使用培训和问题答疑。\n7、每月复盘客服数据变化和优化建议。\n8、沉淀客服问题案例，反哺报表口径优化。"
      },
      {
        goal: "销售活动数据复盘支持",
        strategy:
          "1、围绕大促、会员、渠道活动建立复盘模板。\n2、统一活动 GMV、转化、客单价和退款指标口径。\n3、提升活动复盘的及时性和可比性。",
        measure:
          "1、活动复盘模板覆盖核心渠道>=5个。\n2、大促复盘出具时效<=3个工作日。\n3、活动指标口径一致性>=95%。",
        tactics:
          "1、整理历史活动复盘指标和数据来源。\n2、建立活动复盘标准模板和字段口径。\n3、接入渠道、商品、会员和退款维度数据。\n4、补充活动预算、优惠、库存和履约维度。\n5、建立活动前预估和活动后复盘对比口径。\n6、输出活动对比分析和异常解释。\n7、沉淀复盘结论并更新分析模板。\n8、定期整理活动复盘案例库，提升复盘效率。"
      },
      {
        goal: "业务培训与数据使用体验优化",
        strategy:
          "1、面向业务用户整理数据产品使用路径。\n2、优化高频报表说明、筛选项和常见问题。\n3、通过培训提升数据自助使用率。",
        measure:
          "1、完成数据产品培训>=4场。\n2、输出操作指引>=15篇。\n3、业务自助查询占比提升25%。",
        tactics:
          "1、收集业务常见问题和使用卡点。\n2、优化重点报表的说明文案和筛选逻辑。\n3、制作数据产品操作手册和短指引。\n4、补充常见场景的取数路径和示例截图。\n5、建立培训报名、签到和反馈记录。\n6、组织分场景培训并收集反馈。\n7、持续更新 FAQ，降低重复咨询。\n8、每月分析自助查询使用数据并优化入口。"
      }
    ]
  }
};

seedState.goals = Object.entries(memberGoalSets).flatMap(([memberKey, member]) =>
  member.goals.map((goal, index) => ({
    id: `${memberKey}-goal-${index + 1}`,
    ...goal,
    owner: member.owner,
    helper: member.helper,
    startDate: "",
    endDate: "",
    dueDate: "",
    progress: 0,
    status: "planning",
    progressDesc: "未来一年内工作规划",
    updatedAt: member.updatedAt
  }))
);

const statusMap = {
  planning: "规划中",
  active: "推进中",
  risk: "有风险",
  done: "已完成"
};

let state = loadState();
let currentUser = loadCurrentUser();
let selectedId = state.goals[0]?.id ?? null;
let selectedPerson = currentUser?.role === "member" ? currentUser.personName : getPeople()[0]?.name ?? "";
let currentView = currentUser?.role === "member" ? "showcase" : "dashboard";

const dom = {
  loginScreen: document.querySelector("#loginScreen"),
  loginForm: document.querySelector("#loginForm"),
  loginUser: document.querySelector("#loginUser"),
  loginPass: document.querySelector("#loginPass"),
  loginError: document.querySelector("#loginError"),
  demoLogins: document.querySelectorAll(".demo-login"),
  accountName: document.querySelector("#accountName"),
  accountRole: document.querySelector("#accountRole"),
  logoutBtn: document.querySelector("#logoutBtn"),
  tabs: document.querySelectorAll(".tab-btn"),
  views: document.querySelectorAll(".view-section"),
  dashboardTopBtn: document.querySelector("#dashboardTopBtn"),
  showcaseTopBtn: document.querySelector("#showcaseTopBtn"),
  maintainTopBtn: document.querySelector("#maintainTopBtn"),
  reportBadge: document.querySelector("#reportBadge"),
  reportTitle: document.querySelector("#reportTitle"),
  reportOwner: document.querySelector("#reportOwner"),
  reportPeriod: document.querySelector("#reportPeriod"),
  reportDepartment: document.querySelector("#reportDepartment"),
  reportDate: document.querySelector("#reportDate"),
  objectText: document.querySelector("#objectText"),
  overallRing: document.querySelector("#overallRing"),
  overallProgress: document.querySelector("#overallProgress"),
  overallStatus: document.querySelector("#overallStatus"),
  memberCount: document.querySelector("#memberCount"),
  goalCount: document.querySelector("#goalCount"),
  strategyCount: document.querySelector("#strategyCount"),
  measureCount: document.querySelector("#measureCount"),
  completedPlanCount: document.querySelector("#completedPlanCount"),
  pendingPlanCount: document.querySelector("#pendingPlanCount"),
  personBoard: document.querySelector("#personBoard"),
  focusList: document.querySelector("#focusList"),
  goalTable: document.querySelector("#goalTable"),
  dashboardOwnerFilter: document.querySelector("#dashboardOwnerFilter"),
  memberPanel: document.querySelector("#memberPanel"),
  memberList: document.querySelector("#memberList"),
  personMeta: document.querySelector("#personMeta"),
  personName: document.querySelector("#personName"),
  personSummary: document.querySelector("#personSummary"),
  personAvg: document.querySelector("#personAvg"),
  personGoals: document.querySelector("#personGoals"),
  personRisks: document.querySelector("#personRisks"),
  showcaseGoals: document.querySelector("#showcaseGoals"),
  goalList: document.querySelector("#goalList"),
  searchInput: document.querySelector("#searchInput"),
  statusFilter: document.querySelector("#statusFilter"),
  ownerFilter: document.querySelector("#ownerFilter"),
  addBtn: document.querySelector("#addBtn"),
  exportBtn: document.querySelector("#exportBtn"),
  importInput: document.querySelector("#importInput"),
  resetBtn: document.querySelector("#resetBtn"),
  deleteBtn: document.querySelector("#deleteBtn"),
  selectedMeta: document.querySelector("#selectedMeta"),
  selectedTitle: document.querySelector("#selectedTitle"),
  editorForm: document.querySelector("#editorForm"),
  goalField: document.querySelector("#goalField"),
  strategyField: document.querySelector("#strategyField"),
  measureField: document.querySelector("#measureField"),
  tacticsField: document.querySelector("#tacticsField"),
  ownerField: document.querySelector("#ownerField"),
  helperField: document.querySelector("#helperField"),
  startDateField: document.querySelector("#startDateField"),
  endDateField: document.querySelector("#endDateField"),
  statusField: document.querySelector("#statusField"),
  progressField: document.querySelector("#progressField"),
  progressValue: document.querySelector("#progressValue"),
  newPlanInput: document.querySelector("#newPlanInput"),
  addPlanBtn: document.querySelector("#addPlanBtn"),
  metricActionEditor: document.querySelector("#metricActionEditor"),
  planChecklist: document.querySelector("#planChecklist"),
  progressDescField: document.querySelector("#progressDescField"),
  saveState: document.querySelector("#saveState")
};

bindEvents();
ensureTeamMemberOptions();
renderAll();
hydrateRemoteState();

function bindEvents() {
  dom.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    login(dom.loginUser.value.trim(), dom.loginPass.value);
  });
  dom.demoLogins.forEach((button) => {
    button.addEventListener("click", () => {
      const account = accounts.find((item) => item.username === button.dataset.user);
      if (account) login(account.username, account.password);
    });
  });
  dom.logoutBtn.addEventListener("click", logout);
  dom.tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchView(tab.dataset.view));
  });
  dom.dashboardOwnerFilter.addEventListener("change", renderGoalTable);
  dom.searchInput.addEventListener("input", renderMaintainList);
  dom.statusFilter.addEventListener("change", renderMaintainList);
  dom.ownerFilter.addEventListener("change", renderMaintainList);
  dom.progressField.addEventListener("input", () => {
    dom.progressValue.textContent = `${dom.progressField.value}%`;
  });
  dom.addPlanBtn.addEventListener("click", addPlanToSelected);
  dom.newPlanInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addPlanToSelected();
    }
  });
  dom.editorForm.addEventListener("input", (event) => {
    if (event.target.closest("#metricActionEditor")) {
      flashSave("已自动保存");
      return;
    }
    autoSaveSelected();
  });
  dom.editorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveSelected();
    flashSave("已保存");
  });
  dom.addBtn.addEventListener("click", addGoal);
  dom.deleteBtn.addEventListener("click", deleteSelected);
  dom.resetBtn?.addEventListener("click", resetState);
  dom.exportBtn.addEventListener("click", exportState);
  dom.importInput.addEventListener("change", importState);
  const dateInputs = [dom.startDateField, dom.endDateField].filter(Boolean);
  dateInputs.forEach((input) => {
    input.addEventListener("click", () => openDatePicker(input));
  });
  [dom.dashboardTopBtn, dom.showcaseTopBtn, dom.maintainTopBtn].filter(Boolean).forEach((button) => {
    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function openDatePicker(input) {
  if (!input || input.disabled) return;
  input.focus();
  if (typeof input.showPicker === "function") {
    try {
      input.showPicker();
    } catch (error) {
      // Some browsers only allow showPicker during direct user activation.
    }
  }
}

function switchView(view) {
  if (currentUser?.role !== "admin" && view === "dashboard") {
    view = "showcase";
  }
  if (currentUser?.role === "admin" && view === "maintain") {
    view = "dashboard";
  }
  currentView = view;
  document.body.classList.toggle("dashboard-view-mode", view === "dashboard");
  document.body.classList.toggle("showcase-view-mode", view === "showcase");
  document.body.classList.toggle("maintain-view-mode", view === "maintain");
  dom.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  dom.views.forEach((section) => section.classList.toggle("active", section.id === `${view}View`));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.object && Array.isArray(saved.goals)) {
      const normalized = normalizeState(saved);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    }
  } catch (error) {
    console.warn("Failed to read saved AGSM state", error);
  }
  return normalizeState(structuredClone(seedState));
}

function normalizeState(nextState) {
  nextState.report = {
    ...structuredClone(seedState.report),
    ...(nextState.report || {})
  };
  if (nextState.report.department === "IT 信息技术") {
    nextState.report.department = seedState.report.department;
  }
  if (["应用支持一组 · OGSM进度汇报", "数据应用支持组 · OGSM进度汇报"].includes(nextState.report.title)) {
    nextState.report.title = seedState.report.title;
  }
  const seedGoalIds = new Set(seedState.goals.map((goal) => goal.id));
  nextState.goals = nextState.goals
    .filter((goal) => goal.owner !== "钟启庆")
    .filter((goal) => !String(goal.id || "").startsWith("goal-"))
    .filter((goal) => !String(goal.id || "").startsWith("lh-goal-") || seedGoalIds.has(goal.id))
    .map((goal) => ({
      ...goal,
      helper: goal.helper === "钟启庆" ? "" : goal.helper
    }));
  const existingGoalIds = new Set(nextState.goals.map((goal) => goal.id));
  seedState.goals
    .filter((goal) => !existingGoalIds.has(goal.id))
    .forEach((goal) => nextState.goals.push(structuredClone(goal)));
  const shouldMergeSeedActions = nextState.seedActionVersion !== SEED_ACTION_VERSION;
  nextState.goals = nextState.goals.map((goal) => {
    const normalized = syncGoalStructure(goal);
    if (shouldMergeSeedActions) mergeSeedActions(normalized);
    normalized.progress = calculateGoalProgress(normalized);
    return normalized;
  });
  nextState.seedActionVersion = SEED_ACTION_VERSION;
  return nextState;
}

function mergeSeedActions(goal) {
  const seedGoal = seedState.goals.find((item) => item.id === goal.id);
  if (!seedGoal) return goal;
  const seedMetrics = buildMetricsFromLegacyText(seedGoal, new Map());
  const existingActionTexts = new Set(flattenActions(goal).map((action) => normalizePlanText(action.text)));
  seedMetrics.forEach((seedMetric) => {
    let targetMetric =
      goal.metrics.find((metric) => metric.id === seedMetric.id) ||
      goal.metrics.find((metric) => normalizePlanText(metric.text) === normalizePlanText(seedMetric.text));
    if (!targetMetric) {
      targetMetric = {
        id: seedMetric.id,
        text: seedMetric.text,
        actions: []
      };
      goal.metrics.push(targetMetric);
    }
    seedMetric.actions.forEach((seedAction) => {
      const actionText = normalizePlanText(seedAction.text);
      if (!actionText || existingActionTexts.has(actionText)) return;
      targetMetric.actions.push({
        id: makePlanId(`${targetMetric.id}-${actionText}`, targetMetric.actions.length),
        text: actionText,
        done: false,
        owner: normalizeOwner(seedAction.owner, goal.owner),
        helper: normalizePeople(seedAction.helper, goal.helper)
      });
      existingActionTexts.add(actionText);
    });
  });
  syncLegacyTextFromMetrics(goal);
  return goal;
}

function loadCurrentUser() {
  try {
    const saved = JSON.parse(localStorage.getItem(AUTH_KEY));
    if (saved?.username && saved?.role && accounts.some((account) => account.username === saved.username)) return saved;
    localStorage.removeItem(AUTH_KEY);
  } catch (error) {
    console.warn("Failed to read AGSM auth state", error);
  }
  return null;
}

function login(username, password) {
  const account = accounts.find((item) => item.username === username && item.password === password);
  if (!account) {
    dom.loginError.textContent = "账号或密码不正确";
    return;
  }
  currentUser = {
    username: account.username,
    name: account.name,
    role: account.role,
    personName: account.personName
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
  dom.loginUser.value = "";
  dom.loginPass.value = "";
  dom.loginError.textContent = "";
  selectedPerson = currentUser.role === "member" ? currentUser.personName : getPeople()[0]?.name ?? "";
  currentView = currentUser.role === "member" ? "showcase" : "dashboard";
  renderAll();
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  currentUser = null;
  currentView = "dashboard";
  renderAll();
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  scheduleRemotePersist();
}

function canUseRemoteState() {
  return location.protocol === "http:" || location.protocol === "https:";
}

async function hydrateRemoteState() {
  if (!canUseRemoteState()) return;
  remoteHydrating = true;
  try {
    const response = await fetch(API_STATE_ENDPOINT, {
      cache: "no-store",
      headers: { accept: "application/json" }
    });
    if (!response.ok) throw new Error(`Remote state request failed: ${response.status}`);

    const payload = await response.json();
    remoteSyncAvailable = true;

    if (payload.state?.object && Array.isArray(payload.state.goals)) {
      state = normalizeState(payload.state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      ensureSelections();
      renderAll();
      return;
    }

    await saveRemoteState();
  } catch (error) {
    remoteSyncAvailable = false;
    console.warn("Remote AGSM state is unavailable; using local storage.", error);
  } finally {
    remoteHydrating = false;
  }
}

function scheduleRemotePersist() {
  if (!canUseRemoteState() || remoteHydrating) return;
  clearTimeout(remoteSaveTimer);
  remoteSaveTimer = setTimeout(saveRemoteState, REMOTE_SYNC_DELAY);
}

async function saveRemoteState() {
  if (!canUseRemoteState()) return;
  try {
    const response = await fetch(API_STATE_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({ state })
    });
    if (!response.ok) throw new Error(`Remote state save failed: ${response.status}`);
    remoteSyncAvailable = true;
  } catch (error) {
    remoteSyncAvailable = false;
    console.warn("Failed to save AGSM state to remote API; local storage is still updated.", error);
  }
}

function renderAll() {
  applyAuthState();
  if (!currentUser) return;
  ensureSelections();
  renderReportMeta();
  dom.objectText.textContent = state.object;
  renderOwnerFilters();
  renderDashboard();
  renderShowcase();
  renderMaintainList();
  renderEditor();
  switchView(currentView);
}

function renderReportMeta() {
  const report = state.report || seedState.report;
  const owner = currentUser?.role === "member" ? currentUser.personName : report.owner || selectedPerson;
  dom.reportBadge.textContent = report.badge || "OGSM 2026";
  dom.reportTitle.textContent = report.title || "OGSM进度汇报";
  dom.reportOwner.textContent = owner || "未指定";
  dom.reportPeriod.textContent = report.period || "2026 全年";
  dom.reportDepartment.textContent = report.department || "IT-数据应用支持组";
  dom.reportDate.textContent = getLatestUpdateDate();
}

function getLatestUpdateDate() {
  const dates = state.goals
    .map((goal) => goal.updatedAt)
    .filter(Boolean)
    .sort((a, b) => String(b).localeCompare(String(a)));
  return dates[0] || state.report?.updatedAt || new Date().toISOString().slice(0, 10);
}

function applyAuthState() {
  const loggedIn = Boolean(currentUser);
  document.body.classList.toggle("member-mode", currentUser?.role === "member");
  document.body.classList.toggle("admin-mode", currentUser?.role === "admin");
  dom.loginScreen.classList.toggle("active", !loggedIn);
  dom.accountName.textContent = currentUser?.name || "未登录";
  dom.accountRole.textContent = currentUser?.role === "admin" ? "管理员账号" : currentUser ? "个人账号" : "请先登录";
  dom.memberPanel.hidden = currentUser?.role === "member";
  dom.tabs.forEach((tab) => {
    const view = tab.dataset.view;
    const hideDashboardForMember = Boolean(currentUser && currentUser.role !== "admin" && view === "dashboard");
    const hideMaintainForAdmin = Boolean(currentUser && currentUser.role === "admin" && view === "maintain");
    tab.classList.toggle("hidden", hideDashboardForMember || hideMaintainForAdmin);
  });
  if (currentUser?.role !== "admin" && currentView === "dashboard") {
    currentView = "showcase";
  }
  if (currentUser?.role === "admin" && currentView === "maintain") {
    currentView = "dashboard";
  }
}

function ensureSelections() {
  const visibleGoals = getVisibleGoals();
  if (!visibleGoals.some((item) => item.id === selectedId)) {
    selectedId = visibleGoals[0]?.id ?? null;
  }
  const people = getPeople();
  if (currentUser?.role === "member") {
    selectedPerson = currentUser.personName;
  } else if (!people.some((person) => person.name === selectedPerson)) {
    selectedPerson = people[0]?.name ?? "";
  }
}

function canSeeGoal(goal) {
  if (!currentUser) return false;
  if (currentUser.role === "admin") return true;
  return goal.owner === currentUser.personName;
}

function getVisibleGoals() {
  return state.goals.filter(canSeeGoal);
}

function getPeople() {
  const grouped = new Map();
  getVisibleGoals().forEach((goal) => {
    const owner = goal.owner || "未指定";
    if (!grouped.has(owner)) grouped.set(owner, []);
    grouped.get(owner).push(goal);
  });
  return [...grouped.entries()].map(([name, goals]) => {
    const avg = averageProgress(goals);
    const risks = goals.filter((goal) => goal.status === "risk").length;
    const active = goals.filter((goal) => goal.status === "active").length;
    return { name, goals, avg, risks, active };
  });
}

function averageProgress(goals) {
  if (!goals.length) return 0;
  return Math.round(goals.reduce((sum, goal) => sum + Number(goal.progress || 0), 0) / goals.length);
}

function splitLines(text) {
  return String(text || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizePlanText(text) {
  return String(text || "")
    .replace(/^[\d一二三四五六七八九十]+[、.．)]\s*/, "")
    .trim();
}

function normalizePeople(value, fallback = "") {
  const source = Array.isArray(value) ? value.join("、") : String(value || fallback || "");
  const names = source
    .split(/[、,，;；/\s]+/)
    .map((name) => name.trim())
    .filter(Boolean);
  return [...new Set(names)].join("、");
}

function splitPeople(value) {
  return normalizePeople(value).split("、").filter(Boolean);
}

function normalizeOwner(value, fallback = "") {
  return splitPeople(value || fallback)[0] || "";
}

function syncGoalHelperFromActions(goal) {
  const ownerNames = new Set(splitPeople(goal.owner));
  const helpers = [];
  flattenActions(goal).forEach((action) => {
    [...splitPeople(action.owner), ...splitPeople(action.helper)].forEach((name) => {
      if (!ownerNames.has(name)) helpers.push(name);
    });
  });
  goal.helper = normalizePeople(helpers);
  return goal.helper;
}

function getAccountOwner() {
  return currentUser?.role === "member" ? currentUser.personName : selectedPerson || "";
}

function formatDateRange(goal) {
  const start = goal.startDate || "未设开始";
  const end = goal.endDate || goal.dueDate || "未设结束";
  return `${start} ~ ${end}`;
}

function ensureTeamMemberOptions() {
  let datalist = document.querySelector("#teamMemberOptions");
  if (!datalist) {
    datalist = document.createElement("datalist");
    datalist.id = "teamMemberOptions";
    document.body.append(datalist);
  }
  datalist.innerHTML = teamMembers.map((name) => `<option value="${escapeHtml(name)}"></option>`).join("");
}

function renderPeopleSelect(metricId, actionId, field, value, placeholder) {
  const isSingle = field === "owner";
  const selected = isSingle ? splitPeople(value).slice(0, 1) : splitPeople(value);
  const inputPlaceholder = selected.length ? (isSingle ? "更换负责人" : "继续选择") : placeholder;
  return `
    <div class="people-select" data-metric-id="${escapeHtml(metricId)}" data-action-id="${escapeHtml(actionId)}" data-field="${escapeHtml(field)}" data-single="${isSingle ? "true" : "false"}">
      <div class="people-chip-list">
        ${selected
          .map(
            (name) => `
            <span class="people-chip">
              <span>${escapeHtml(name)}</span>
              <button class="people-chip-remove" type="button" data-metric-id="${escapeHtml(metricId)}" data-action-id="${escapeHtml(actionId)}" data-field="${escapeHtml(field)}" data-name="${escapeHtml(name)}" aria-label="移除${escapeHtml(name)}">×</button>
            </span>`
          )
          .join("")}
        <input class="people-filter-input" type="text" data-metric-id="${escapeHtml(metricId)}" data-action-id="${escapeHtml(actionId)}" data-field="${escapeHtml(field)}" placeholder="${escapeHtml(inputPlaceholder)}" aria-label="${escapeHtml(placeholder)}" />
      </div>
      <div class="people-dropdown">
        ${teamMembers
          .map((name) => {
            const isSelected = selected.includes(name);
            return `<button class="person-option-btn ${isSelected ? "selected" : ""}" type="button" data-metric-id="${escapeHtml(metricId)}" data-action-id="${escapeHtml(actionId)}" data-field="${escapeHtml(field)}" data-name="${escapeHtml(name)}" ${isSelected ? "disabled" : ""}>${escapeHtml(name)}</button>`;
          })
          .join("")}
      </div>
    </div>`;
}

function makePlanId(text, index) {
  let hash = 0;
  const source = `${text}-${index}`;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash << 5) - hash + source.charCodeAt(i);
    hash |= 0;
  }
  return `plan-${Math.abs(hash)}`;
}

function makeMetricId(text, index) {
  return makePlanId(`metric-${text}`, index).replace("plan-", "metric-");
}

function syncGoalStructure(goal) {
  const planDoneByText = new Map((goal.plans || []).map((plan) => [normalizePlanText(plan.text), Boolean(plan.done)]));
  const sourceMetrics = Array.isArray(goal.metrics) && goal.metrics.length ? goal.metrics : buildMetricsFromLegacyText(goal, planDoneByText);
  goal.metrics = sourceMetrics.map((metric, metricIndex) => {
    const metricText = normalizePlanText(metric.text || metric.measure || metric.title || "");
    const actions = Array.isArray(metric.actions) ? metric.actions : [];
    return {
      id: metric.id || makeMetricId(metricText || `指标${metricIndex + 1}`, metricIndex),
      text: metricText || `指标 ${metricIndex + 1}`,
      actions: actions.map((action, actionIndex) => {
        const actionText = normalizePlanText(action.text || action.title || "");
        return {
          id: action.id || makePlanId(actionText || `行动${actionIndex + 1}`, actionIndex),
          text: actionText || `行动 ${actionIndex + 1}`,
          done: Boolean(action.done ?? planDoneByText.get(actionText)),
          owner: normalizeOwner(action.owner || action.assignee, goal.owner),
          helper: normalizePeople(action.helper, goal.helper)
        };
      })
    };
  });
  syncLegacyTextFromMetrics(goal);
  return goal;
}

function buildMetricsFromLegacyText(goal, planDoneByText) {
  const measureLines = splitLines(goal.measure).map(normalizePlanText);
  const tacticLines = splitLines(goal.tactics).map(normalizePlanText);
  const rowCount = Math.max(measureLines.length, 1);
  const metrics = Array.from({ length: rowCount }, (_, index) => {
    const start = Math.floor((index * tacticLines.length) / rowCount);
    const end = Math.floor(((index + 1) * tacticLines.length) / rowCount);
    const actions = tacticLines.slice(start, Math.max(end, start + 1)).filter(Boolean);
    return {
      id: makeMetricId(measureLines[index] || goal.goal || `指标${index + 1}`, index),
      text: measureLines[index] || goal.goal || `指标 ${index + 1}`,
      actions: actions.map((text, actionIndex) => ({
        id: makePlanId(text, actionIndex),
        text,
        done: Boolean(planDoneByText.get(text)),
        owner: normalizeOwner(goal.owner),
        helper: normalizePeople(goal.helper)
      }))
    };
  });
  return metrics;
}

function syncLegacyTextFromMetrics(goal) {
  goal.measure = (goal.metrics || []).map((metric, index) => `${index + 1}、${metric.text}`).join("\n");
  goal.tactics = (goal.metrics || [])
    .flatMap((metric) => metric.actions || [])
    .map((action, index) => `${index + 1}、${action.text}`)
    .join("\n");
  goal.plans = flattenActions(goal);
  syncGoalHelperFromActions(goal);
}

function flattenActions(goal) {
  return (goal.metrics || []).flatMap((metric) => metric.actions || []);
}

function calculateGoalProgress(goal) {
  const actions = flattenActions(goal);
  if (!actions.length) return 0;
  return Math.round((actions.filter((action) => action.done).length / actions.length) * 100);
}

function getPlanSummary(goal) {
  const plans = flattenActions(goal);
  return {
    done: plans.filter((plan) => plan.done).length,
    total: plans.length,
    percent: calculateGoalProgress(goal)
  };
}

function renderOwnerFilters() {
  const owners = getPeople().map((person) => person.name);
  renderSelect(dom.ownerFilter, owners, "全部负责人");
  renderSelect(dom.dashboardOwnerFilter, owners, "全部负责人");
}

function renderSelect(select, options, label) {
  const current = select.value || "all";
  select.innerHTML = `<option value="all">${label}</option>${options
    .map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`)
    .join("")}`;
  select.value = options.includes(current) ? current : "all";
}

function renderDashboard() {
  const goals = getVisibleGoals();
  const people = getPeople();
  const avg = averageProgress(goals);
  dom.overallProgress.textContent = `${avg}%`;
  dom.overallRing.style.setProperty("--ring", `${avg * 3.6}deg`);
  dom.overallStatus.textContent = avg >= 80 ? "接近达成" : avg >= 40 ? "稳步推进" : "规划启动";
  dom.memberCount.textContent = people.length;
  dom.goalCount.textContent = goals.length;
  dom.strategyCount.textContent = goals.reduce((sum, goal) => sum + splitLines(goal.strategy).length, 0);
  dom.measureCount.textContent = goals.reduce((sum, goal) => sum + (goal.metrics || []).length, 0);
  const plans = goals.flatMap(flattenActions);
  dom.completedPlanCount.textContent = plans.filter((plan) => plan.done).length;
  dom.pendingPlanCount.textContent = plans.filter((plan) => !plan.done).length;
  renderPersonBoard(people);
  renderFocusList(goals);
  renderGoalTable();
}

function renderPersonBoard(people) {
  if (!people.length) {
    dom.personBoard.innerHTML = `<div class="empty-state">暂无成员数据</div>`;
    return;
  }
  dom.personBoard.innerHTML = people
    .map(
      (person) => `
      <article class="person-card">
        <div class="person-card-top">
          <div class="avatar">${escapeHtml(person.name.slice(0, 1))}</div>
          <div>
            <strong>${escapeHtml(person.name)}</strong>
            <small>${person.goals.length} 个目标 · ${person.active} 个推进中</small>
          </div>
          <span class="pill ${person.risks ? "risk" : "active"}">${person.risks ? `${person.risks} 风险` : "正常"}</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${person.avg}%"></div></div>
        <div class="person-card-foot"><span>平均进度</span><strong>${person.avg}%</strong></div>
      </article>`
    )
    .join("");
}

function renderFocusList(goals) {
  const riskGoals = goals.filter((goal) => goal.status === "risk");
  const slowGoals = goals.filter((goal) => Number(goal.progress || 0) < 30 && goal.status !== "done");
  const focus = [...riskGoals, ...slowGoals.filter((goal) => !riskGoals.includes(goal))].slice(0, 5);
  if (!focus.length) {
    dom.focusList.innerHTML = `
      <div class="focus-item">
        <strong>暂无高风险事项</strong>
        <span>当前没有标记为风险的目标，可重点推动规划项进入执行状态。</span>
      </div>`;
    return;
  }
  dom.focusList.innerHTML = focus
    .map(
      (goal) => `
      <div class="focus-item ${goal.status === "risk" ? "risk" : ""}">
        <strong>${escapeHtml(goal.goal)}</strong>
        <span>${escapeHtml(goal.owner || "未指定")} · ${statusMap[goal.status] || "未设置"} · ${Number(goal.progress || 0)}%</span>
      </div>`
    )
    .join("");
}

function renderGoalTable() {
  const owner = dom.dashboardOwnerFilter.value;
  const goals = getVisibleGoals().filter((goal) => owner === "all" || goal.owner === owner);
  if (!goals.length) {
    dom.goalTable.innerHTML = `<div class="empty-state">暂无目标数据</div>`;
    return;
  }
  dom.goalTable.innerHTML = goals
    .map((goal, index) => renderReportGoal(goal, index))
    .join("");
}

function renderReportGoal(goal, index) {
  syncGoalStructure(goal);
  goal.progress = calculateGoalProgress(goal);
  const planSummary = getPlanSummary(goal);
  return `
    <article class="report-goal-card">
      <header class="report-goal-head">
        <div class="report-icon">${index + 1}</div>
        <div>
          <small>GOAL ${index + 1} · ${escapeHtml(statusMap[goal.status] || "未设置")} · ${planSummary.done}/${planSummary.total || 0} 项完成 · ${escapeHtml(formatDateRange(goal))}</small>
          <strong>${escapeHtml(goal.goal)}</strong>
        </div>
      </header>
      <div class="strategy-strip">
        <span>策略</span>
        <strong>${escapeHtml(compactLines(goal.strategy, 2))}</strong>
      </div>
      <div class="report-table">
        <div class="report-table-head">
          <span aria-hidden="true"></span>
          <span>衡量指标</span>
          <span>行动计划（TACTICS）</span>
          <span>进度状态</span>
          <span>负责人</span>
        </div>
        ${renderReportRows(goal)}
      </div>
    </article>`;
}

function renderReportRows(goal) {
  const metrics = goal.metrics?.length ? goal.metrics : buildMetricsFromLegacyText(goal, new Map());
  const rows = metrics.map((metric, index) => {
    const rowPlans = metric.actions || [];
    const metricProgress = rowPlans.length
      ? Math.round((rowPlans.filter((plan) => plan.done).length / rowPlans.length) * 100)
      : 0;
    return `
      <div class="report-row" aria-label="指标 ${index + 1}">
        <span class="metric-index" data-label="序号">${index + 1}</span>
        <div class="measure-title" data-label="衡量指标">${escapeHtml(metric.text || goal.goal)}</div>
        <ul class="plan-list" data-label="行动计划">
          ${rowPlans
            .map(
              (plan) => `
              <li>
                <span>${escapeHtml(plan.text)}</span>
                <small>负责人：${escapeHtml(plan.owner || "未指定")}；协助人：${escapeHtml(plan.helper || "未指定")}</small>
              </li>`
            )
            .join("") || "<li>暂无行动计划</li>"}
        </ul>
        <div class="status-stack" data-label="进度状态">
          ${rowPlans
            .map(
              (plan) =>
                `<div class="status-line ${plan.done ? "" : "pending"}">
                  <span class="status-dot" aria-hidden="true"></span>
                  <span>${escapeHtml(plan.done ? "已完成" : "未完成")} · ${escapeHtml(plan.text)}</span>
                </div>`
            )
            .join("")}
          <div class="progress-track"><div class="progress-fill" style="width:${metricProgress}%"></div></div>
          <div class="progress-row"><span>指标进度</span><strong>${metricProgress}%</strong></div>
        </div>
        <div class="owner-stack" data-label="负责人">
          ${rowPlans
            .map(
              (plan) => `
              <div class="task-owner-line">
                <span class="owner-badge">${escapeHtml(plan.owner || "未指定")}</span>
                <span class="pill">${escapeHtml(plan.helper || "未指定")}</span>
              </div>`
            )
            .join("") || `<span class="owner-badge">${escapeHtml(goal.owner || "未指定")}</span>`}
        </div>
      </div>`;
  });
  return rows.join("");
}

function compactLines(text, limit = 2) {
  return splitLines(text)
    .slice(0, limit)
    .map(normalizePlanText)
    .join("；") || "暂无策略";
}

function renderShowcase() {
  const people = getPeople();
  renderMemberList(people);
  const person = people.find((item) => item.name === selectedPerson);
  if (!person) {
    dom.personName.textContent = "未选择成员";
    dom.personSummary.textContent = "";
    dom.personAvg.textContent = "0%";
    dom.personGoals.textContent = "0";
    dom.personRisks.textContent = "0";
    dom.showcaseGoals.innerHTML = `<div class="empty-state">暂无个人数据</div>`;
    return;
  }
  dom.personMeta.textContent = currentUser?.role === "member" ? "我的 OGSM" : "个人 OGSM";
  dom.personName.textContent = person.name;
  dom.personSummary.textContent = `当前负责 ${person.goals.length} 个目标，平均进度 ${person.avg}%，${person.risks ? `其中 ${person.risks} 个目标需要关注。` : "暂无风险项。"}`;
  dom.personAvg.textContent = `${person.avg}%`;
  dom.personGoals.textContent = person.goals.length;
  dom.personRisks.textContent = person.risks;
  dom.showcaseGoals.innerHTML = person.goals.map((goal, index) => renderReportGoal(goal, index)).join("");
}

function renderMemberList(people) {
  if (!people.length) {
    dom.memberList.innerHTML = `<div class="empty-state">暂无成员</div>`;
    return;
  }
  dom.memberList.innerHTML = people
    .map(
      (person) => `
      <button class="member-btn ${person.name === selectedPerson ? "active" : ""}" data-name="${escapeHtml(person.name)}" type="button">
        <span class="avatar">${escapeHtml(person.name.slice(0, 1))}</span>
        <span><strong>${escapeHtml(person.name)}</strong><small>${person.goals.length} 个目标</small></span>
        <strong>${person.avg}%</strong>
      </button>`
    )
    .join("");
  dom.memberList.querySelectorAll(".member-btn").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPerson = button.dataset.name;
      renderShowcase();
    });
  });
}

function renderShowcaseCard(goal) {
  const metrics = (goal.metrics || [])
    .map(
      (metric, index) =>
        `${index + 1}、${metric.text}\n${(metric.actions || [])
          .map(
            (action, actionIndex) =>
              `  ${index + 1}.${actionIndex + 1} ${action.done ? "已完成" : "未完成"}：${action.text}（负责人：${action.owner || "未指定"}；协助人：${action.helper || "未指定"}）`
          )
          .join("\n")}`
    )
    .join("\n");
  return `
    <article class="showcase-card">
      <div class="showcase-card-head">
        <span class="pill ${goal.status}">${statusMap[goal.status] || "未设置"}</span>
        <h3>${escapeHtml(goal.goal)}</h3>
        <div class="progress-track"><div class="progress-fill" style="width:${Number(goal.progress || 0)}%"></div></div>
        <div class="progress-row"><span>${escapeHtml(goal.progressDesc || "暂无进度描述")}</span><strong>${Number(goal.progress || 0)}%</strong></div>
      </div>
      <div class="ogsm-block">
        <section><h4>Strategy</h4><p>${escapeHtml(goal.strategy || "暂无")}</p></section>
        <section><h4>Measure & Tactics</h4><p>${escapeHtml(metrics || "暂无")}</p></section>
      </div>
    </article>`;
}

function renderMaintainList() {
  const query = dom.searchInput.value.trim().toLowerCase();
  const status = dom.statusFilter.value;
  const owner = dom.ownerFilter.value;
  const goals = getVisibleGoals().filter((item) => {
    const actionText = flattenActions(item)
      .map((action) => `${action.text} ${action.owner} ${action.helper}`)
      .join(" ");
    const text = `${item.goal} ${item.strategy} ${item.measure} ${item.tactics} ${item.progressDesc} ${actionText}`.toLowerCase();
    return (
      (!query || text.includes(query)) &&
      (status === "all" || item.status === status) &&
      (owner === "all" || item.owner === owner)
    );
  });

  if (!goals.length) {
    dom.goalList.innerHTML = `<div class="empty-state">没有匹配的目标</div>`;
    return;
  }

  dom.goalList.innerHTML = goals
    .map(
      (item) => `
      <button class="goal-card ${item.id === selectedId ? "active" : ""}" type="button" data-id="${item.id}">
        <h3>${escapeHtml(item.goal)}</h3>
        <div class="card-meta">
          <span class="pill ${item.status}">${statusMap[item.status] || "未设置"}</span>
          <span class="pill">${escapeHtml(item.owner || "未指定")}</span>
          <span class="pill">${escapeHtml(formatDateRange(item))}</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${Number(item.progress || 0)}%"></div></div>
        <div class="progress-row"><span>${escapeHtml(item.progressDesc || "暂无进度描述")}</span><strong>${Number(item.progress || 0)}%</strong></div>
      </button>`
    )
    .join("");

  dom.goalList.querySelectorAll(".goal-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedId = card.dataset.id;
      renderMaintainList();
      renderEditor();
    });
  });
}

function renderEditor() {
  const item = getSelected();
  const disabled = !item;
  dom.editorForm.querySelectorAll("input, select, textarea, button").forEach((field) => {
    field.disabled = disabled;
  });
  dom.deleteBtn.disabled = disabled;
  dom.ownerField.disabled = true;
  dom.helperField.disabled = true;
  dom.progressField.disabled = true;
  dom.newPlanInput.disabled = disabled;
  dom.addPlanBtn.disabled = disabled;

  if (!item) {
    dom.selectedMeta.textContent = "未选择";
    dom.selectedTitle.textContent = "请选择一个目标";
    dom.editorForm.reset();
    dom.metricActionEditor.innerHTML = `<div class="empty-state">暂无指标与行动</div>`;
    return;
  }

  syncGoalStructure(item);
  item.progress = calculateGoalProgress(item);
  dom.selectedMeta.textContent = `${statusMap[item.status] || "未设置"} · 更新于 ${item.updatedAt || "未记录"}`;
  dom.selectedTitle.textContent = item.goal.slice(0, 36);
  dom.goalField.value = item.goal || "";
  dom.strategyField.value = item.strategy || "";
  dom.measureField.value = item.measure || "";
  dom.tacticsField.value = item.tactics || "";
  item.owner = getAccountOwner() || item.owner || "";
  syncGoalHelperFromActions(item);
  dom.ownerField.value = item.owner || "";
  dom.helperField.value = item.helper || "";
  dom.startDateField.value = item.startDate || "";
  dom.endDateField.value = item.endDate || item.dueDate || "";
  dom.statusField.value = item.status || "planning";
  dom.progressField.value = Number(item.progress || 0);
  dom.progressValue.textContent = `${Number(item.progress || 0)}%`;
  dom.progressDescField.value = item.progressDesc || "";
  renderMetricActionEditor(item);
}

function renderMetricActionEditor(goal) {
  const metrics = goal.metrics || [];
  if (!metrics.length) {
    dom.metricActionEditor.innerHTML = `<div class="empty-state">暂无指标，先新增一个指标后再维护行动项</div>`;
    return;
  }
  dom.metricActionEditor.innerHTML = metrics
    .map(
      (metric, metricIndex) => `
      <article class="metric-edit-card" data-metric-id="${escapeHtml(metric.id)}">
        <div class="metric-edit-head">
          <span class="metric-no">${metricIndex + 1}</span>
          <input class="metric-title-input" type="text" data-metric-id="${escapeHtml(metric.id)}" value="${escapeHtml(metric.text)}" aria-label="指标内容" />
          <button class="icon-btn danger delete-metric-btn" type="button" data-metric-id="${escapeHtml(metric.id)}" title="删除指标">删除</button>
        </div>
        <div class="action-edit-list">
          ${(metric.actions || [])
            .map(
              (action, actionIndex) => `
              <div class="action-edit-row ${action.done ? "done" : ""}">
                <span class="action-no">${metricIndex + 1}.${actionIndex + 1}</span>
                <input class="action-done-input" type="checkbox" data-metric-id="${escapeHtml(metric.id)}" data-action-id="${escapeHtml(action.id)}" ${action.done ? "checked" : ""} />
                <input class="action-text-input" type="text" data-metric-id="${escapeHtml(metric.id)}" data-action-id="${escapeHtml(action.id)}" value="${escapeHtml(action.text)}" aria-label="行动内容" />
                <div class="people-field action-owner-field">
                  ${renderPeopleSelect(metric.id, action.id, "owner", action.owner || "", "选择负责人")}
                </div>
                <div class="people-field action-helper-field">
                  ${renderPeopleSelect(metric.id, action.id, "helper", action.helper || "", "选择协助人")}
                </div>
                <button class="icon-btn danger delete-action-btn" type="button" data-metric-id="${escapeHtml(metric.id)}" data-action-id="${escapeHtml(action.id)}" title="删除行动">删除</button>
              </div>`
            )
            .join("") || `<div class="empty-action">该指标下暂无行动项</div>`}
        </div>
        <button class="btn add-action-btn" type="button" data-metric-id="${escapeHtml(metric.id)}">新增行动</button>
      </article>`
    )
    .join("");

  dom.metricActionEditor.querySelectorAll(".metric-title-input").forEach((input) => {
    input.addEventListener("input", () => updateMetricText(input.dataset.metricId, input.value));
  });
  dom.metricActionEditor.querySelectorAll(".action-text-input").forEach((input) => {
    input.addEventListener("input", () => updateActionText(input.dataset.metricId, input.dataset.actionId, input.value));
  });
  dom.metricActionEditor.querySelectorAll(".people-filter-input").forEach((input) => {
    input.addEventListener("input", () => filterPeopleOptions(input));
    input.addEventListener("keydown", (event) => {
      if (["Enter", ",", "，", "、"].includes(event.key)) {
        event.preventDefault();
        appendActionPerson(input.dataset.metricId, input.dataset.actionId, input.dataset.field, input.value);
      }
    });
  });
  dom.metricActionEditor.querySelectorAll(".people-select").forEach((select) => {
    select.addEventListener("click", () => select.querySelector(".people-filter-input")?.focus());
  });
  dom.metricActionEditor.querySelectorAll(".people-chip-remove").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      removeActionPerson(button.dataset.metricId, button.dataset.actionId, button.dataset.field, button.dataset.name);
    });
  });
  dom.metricActionEditor.querySelectorAll(".action-done-input").forEach((checkbox) => {
    checkbox.addEventListener("change", () => toggleActionDone(checkbox.dataset.metricId, checkbox.dataset.actionId, checkbox.checked));
  });
  dom.metricActionEditor.querySelectorAll(".person-option-btn").forEach((button) => {
    button.addEventListener("click", () => {
      appendActionPerson(button.dataset.metricId, button.dataset.actionId, button.dataset.field, button.dataset.name);
    });
  });
  dom.metricActionEditor.querySelectorAll(".add-action-btn").forEach((button) => {
    button.addEventListener("click", () => addActionToMetric(button.dataset.metricId));
  });
  dom.metricActionEditor.querySelectorAll(".delete-action-btn").forEach((button) => {
    button.addEventListener("click", () => deleteAction(button.dataset.metricId, button.dataset.actionId));
  });
  dom.metricActionEditor.querySelectorAll(".delete-metric-btn").forEach((button) => {
    button.addEventListener("click", () => deleteMetric(button.dataset.metricId));
  });
}

function addPlanToSelected() {
  const item = getSelected();
  const text = dom.newPlanInput.value.trim();
  if (!item || !text) return;
  syncGoalStructure(item);
  item.metrics.push({
    id: makeMetricId(text, item.metrics.length),
    text,
    actions: []
  });
  dom.newPlanInput.value = "";
  touchGoal(item);
  flashSave("已新增指标");
}

function addActionToMetric(metricId) {
  const item = getSelected();
  const metric = item?.metrics?.find((entry) => entry.id === metricId);
  if (!item || !metric) return;
  const index = metric.actions.length + 1;
  const text = `新行动 ${index}`;
  metric.actions.push({
    id: makePlanId(`${metric.id}-${text}`, metric.actions.length),
    text,
    done: false,
    owner: normalizeOwner(item.owner),
    helper: ""
  });
  touchGoal(item);
  flashSave("已新增行动");
}

function updateMetricText(metricId, value) {
  const item = getSelected();
  const metric = item?.metrics?.find((entry) => entry.id === metricId);
  if (!item || !metric) return;
  metric.text = value.trim();
  touchGoal(item, false);
}

function updateActionText(metricId, actionId, value) {
  const item = getSelected();
  const metric = item?.metrics?.find((entry) => entry.id === metricId);
  const action = metric?.actions?.find((entry) => entry.id === actionId);
  if (!item || !action) return;
  action.text = value.trim();
  touchGoal(item, false);
}

function updateActionPeople(metricId, actionId, field, value) {
  const item = getSelected();
  const metric = item?.metrics?.find((entry) => entry.id === metricId);
  const action = metric?.actions?.find((entry) => entry.id === actionId);
  if (!item || !action || !["owner", "helper"].includes(field)) return;
  action[field] = field === "owner" ? normalizeOwner(value) : normalizePeople(value);
  syncGoalHelperFromActions(item);
  dom.helperField.value = item.helper || "";
  touchGoal(item, false);
}

function filterPeopleOptions(input) {
  const keyword = input.value.trim().toLowerCase();
  const select = input.closest(".people-select");
  select?.querySelectorAll(".person-option-btn").forEach((button) => {
    button.hidden = Boolean(keyword) && !button.dataset.name.toLowerCase().includes(keyword);
  });
}

function removeActionPerson(metricId, actionId, field, name) {
  const item = getSelected();
  const metric = item?.metrics?.find((entry) => entry.id === metricId);
  const action = metric?.actions?.find((entry) => entry.id === actionId);
  if (!item || !action || !["owner", "helper"].includes(field) || !name) return;
  action[field] = splitPeople(action[field]).filter((person) => person !== name).join("、");
  syncGoalHelperFromActions(item);
  touchGoal(item);
}

function appendActionPerson(metricId, actionId, field, name) {
  const item = getSelected();
  const metric = item?.metrics?.find((entry) => entry.id === metricId);
  const action = metric?.actions?.find((entry) => entry.id === actionId);
  if (!item || !action || !["owner", "helper"].includes(field) || !name) return;
  action[field] = field === "owner" ? normalizeOwner(name) : normalizePeople(`${action[field] || ""}、${name}`);
  syncGoalHelperFromActions(item);
  touchGoal(item);
}

function toggleActionDone(metricId, actionId, done) {
  const item = getSelected();
  const metric = item?.metrics?.find((entry) => entry.id === metricId);
  const action = metric?.actions?.find((entry) => entry.id === actionId);
  if (!item || !action) return;
  action.done = done;
  touchGoal(item);
}

function deleteAction(metricId, actionId) {
  const item = getSelected();
  const metric = item?.metrics?.find((entry) => entry.id === metricId);
  if (!item || !metric) return;
  metric.actions = metric.actions.filter((action) => action.id !== actionId);
  touchGoal(item);
}

function deleteMetric(metricId) {
  const item = getSelected();
  if (!item) return;
  item.metrics = item.metrics.filter((metric) => metric.id !== metricId);
  touchGoal(item);
}

function touchGoal(item, rerender = true) {
  syncLegacyTextFromMetrics(item);
  item.progress = calculateGoalProgress(item);
  item.updatedAt = new Date().toISOString().slice(0, 10);
  persist();
  if (rerender) renderAll();
}

function getSelected() {
  return state.goals.find((item) => item.id === selectedId);
}

function autoSaveSelected() {
  saveSelected();
  flashSave("已自动保存");
}

function saveSelected() {
  const item = getSelected();
  if (!item) return;
  item.goal = dom.goalField.value.trim();
  item.strategy = dom.strategyField.value.trim();
  item.owner = getAccountOwner() || item.owner || "";
  syncGoalHelperFromActions(item);
  item.startDate = dom.startDateField.value;
  item.endDate = dom.endDateField.value;
  item.dueDate = item.endDate;
  item.status = dom.statusField.value;
  syncLegacyTextFromMetrics(item);
  item.progress = calculateGoalProgress(item);
  item.progressDesc = dom.progressDescField.value.trim();
  item.updatedAt = new Date().toISOString().slice(0, 10);
  selectedPerson = item.owner || selectedPerson;
  persist();
  renderAll();
  flashSave("已自动保存");
}

function addGoal() {
  const id = `goal-${Date.now()}`;
  state.goals.unshift({
    id,
    goal: "新目标",
    strategy: "",
    measure: "",
    tactics: "",
    metrics: [
      {
        id: makeMetricId("新指标", 0),
        text: "新指标",
        actions: []
      }
    ],
    owner: getAccountOwner(),
    helper: "",
    startDate: "",
    endDate: "",
    dueDate: "",
    progress: 0,
    status: "planning",
    progressDesc: "",
    updatedAt: new Date().toISOString().slice(0, 10)
  });
  selectedId = id;
  persist();
  renderAll();
  switchView("maintain");
  dom.goalField.focus();
}

function deleteSelected() {
  const item = getSelected();
  if (!item) return;
  const ok = window.confirm(`确认删除「${item.goal.slice(0, 20)}」吗？`);
  if (!ok) return;
  state.goals = state.goals.filter((goal) => goal.id !== selectedId);
  selectedId = state.goals[0]?.id ?? null;
  persist();
  renderAll();
}

function resetState() {
  const ok = window.confirm("确认恢复为 Excel 初版数据吗？当前浏览器本地修改会被覆盖。");
  if (!ok) return;
  state = normalizeState(structuredClone(seedState));
  selectedId = state.goals[0]?.id ?? null;
  selectedPerson = getPeople()[0]?.name ?? "";
  persist();
  renderAll();
}

function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `agsm-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importState(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!imported.object || !Array.isArray(imported.goals)) {
        throw new Error("JSON 结构不符合 AGSM 数据格式");
      }
      state = normalizeState(imported);
      selectedId = state.goals[0]?.id ?? null;
      selectedPerson = getPeople()[0]?.name ?? "";
      persist();
      renderAll();
      flashSave("已导入");
    } catch (error) {
      window.alert(error.message);
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file, "utf-8");
}

let saveTimer;
function flashSave(text) {
  clearTimeout(saveTimer);
  dom.saveState.textContent = text;
  saveTimer = setTimeout(() => {
    dom.saveState.textContent = "自动保存";
  }, 1200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
