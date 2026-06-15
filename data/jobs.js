/* ============================================
   求人票サンプルデータ（1,000件をブラウザ側で生成）
   - 自校宛: 6校 × 30件 = 180件
   - 高校生就職Web由来: 820件
   ============================================ */
(function () {
  const CITIES = [
    "札幌市", "旭川市", "函館市", "釧路市", "帯広市", "苫小牧市",
    "室蘭市", "北見市", "小樽市", "江別市", "千歳市", "滝川市",
    "砂川市", "岩見沢市", "留萌市", "稚内市", "深川市", "名寄市",
    "美唄市", "登別市", "恵庭市", "石狩市", "北広島市", "伊達市"
  ];

  const INDUSTRIES = [
    {
      key: "mfg", label: "製造",
      thumb: "images/job-mfg.jpg",
      titles: ["機械オペレーター", "組立スタッフ", "検査スタッフ", "NC旋盤工", "溶接工", "プラスチック成形オペ", "塗装工", "電気組立"],
      companies: ["カタムラ製作所", "北海精機工業", "ホクト機械", "サッポロプレシジョン", "道央製作所", "あさひ工業", "ほくよう金属", "イシヤマ製造", "ナガオ精密"]
    },
    {
      key: "construction", label: "建設",
      thumb: "images/job-construction.jpg",
      titles: ["建設現場スタッフ", "施工管理補助", "重機オペレーター", "土木作業員", "鉄筋工見習い", "電気工事士見習い", "内装スタッフ"],
      companies: ["北海建設工業", "道北建設", "イトウ組", "ホクトケンセツ", "サッポロハウジング", "あおぞら工務店", "オホーツク土建", "りんゆう建設"]
    },
    {
      key: "care", label: "福祉・介護",
      thumb: "images/job-care.jpg",
      titles: ["介護スタッフ", "生活支援員", "看護助手", "保育補助", "デイサービススタッフ", "ヘルパー"],
      companies: ["社会福祉法人ひだまりの郷", "社会福祉法人みどり会", "医療法人北翔会", "社会福祉法人北の里", "NPO法人てとて", "社会福祉法人さくら会"]
    },
    {
      key: "food", label: "飲食・食品",
      thumb: "images/job-food.jpg",
      titles: ["食品工場ライン", "製パンスタッフ", "厨房補助", "ホールスタッフ", "製麺スタッフ", "菓子製造"],
      companies: ["きたの食品", "サッポロフード", "道産ベーカリー", "ホクレン食品", "オホーツクハム", "ニセコパン工房", "あさひ製麺", "ホクヨウ食品"]
    },
    {
      key: "retail", label: "販売・小売",
      thumb: "images/job-retail.jpg",
      titles: ["販売スタッフ", "レジ・接客", "店舗運営アシスタント", "売場スタッフ", "在庫管理"],
      companies: ["マルマツ商事", "北海道リテール", "サッポロストア", "コープほくと", "ヨウシュウ商事", "あさひ商会", "オホーツク物産"]
    },
    {
      key: "transport", label: "運輸・物流",
      thumb: "images/job-transport.jpg",
      titles: ["運行スタッフ", "倉庫作業", "配送補助", "フォークリフト・センター", "ピッキングスタッフ"],
      companies: ["道北運輸", "ホクト物流", "サッポロエクスプレス", "北海陸運", "オホーツク運送", "あさひロジ"]
    },
    {
      key: "office", label: "事務・IT",
      thumb: "images/job-office.jpg",
      titles: ["一般事務", "営業事務", "経理アシスタント", "システム運用補助", "データ入力", "総務サポート"],
      companies: ["ホクトソリューションズ", "サッポロビジネス", "道央オフィスワークス", "あさひITサービス", "北海情報", "ナガセ事務機"]
    },
    {
      key: "service", label: "サービス・美容",
      thumb: "images/job-it.jpg",
      titles: ["ホテルスタッフ", "美容アシスタント", "クリーニングスタッフ", "施設管理", "受付スタッフ"],
      companies: ["ニセコリゾート", "サッポロホテルズ", "美容室アール", "ホクトサービス", "あさひメンテナンス", "オホーツクツーリスト"]
    }
  ];

  const SCHOOL_IDS = ["takikawa-kogyo", "sunagawa-koukou", "yuuhou", "try-asahikawa", "try-sapporo", "komazawa-tomakomai"];

  // 決定的擬似乱数（XorShift風）
  function rng(seed) {
    let s = seed | 0 || 1;
    return function () {
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
      return ((s >>> 0) % 100000) / 100000;
    };
  }

  function pick(rand, arr) {
    return arr[Math.floor(rand() * arr.length)];
  }

  function pad(n, w) { return String(n).padStart(w, "0"); }

  // 給与の人間っぽい分布
  function buildPay(rand) {
    const base = 160000 + Math.floor(rand() * 70) * 1000; // 16.0〜22.9万
    return base;
  }

  const FEATURES_POOL = [
    { key: "dorm", label: "寮あり" },
    { key: "holiday120", label: "年休120日以上" },
    { key: "noTenkin", label: "転勤なし" },
    { key: "transport", label: "通勤手当あり" },
    { key: "certSupport", label: "資格取得支援" },
    { key: "weekend", label: "土日休み" },
    { key: "rookie", label: "未経験OK" },
    { key: "uniform", label: "制服貸与" }
  ];

  const STORY_FRAGMENTS = [
    "創業から地元・北海道で歩んできた、地域密着の会社です。",
    "若手社員が多く、入社1〜3年目で現場の中心になる人もいます。",
    "先輩がマンツーマンで指導する体制で、未経験から始められます。",
    "資格取得を会社が後押し。手当も支給されます。",
    "年休はカレンダー＋会社休暇で120日を超えます。",
    "離職率は道内平均より低く、長く働く先輩が多い職場です。",
    "新卒の入社後3ヶ月は、現場ローテーションで全体像を学びます。",
    "通勤しやすい場所に寮を完備。家賃補助の制度もあります。",
    "工場内は冷暖房完備で、夏冬とも働きやすい環境です。",
    "1日のはじまりに、5分の朝礼で安全と段取りを確認します。"
  ];

  function buildOneJob(i, sourceSchoolId) {
    const rand = rng(1000 + i * 7);
    const ind = INDUSTRIES[i % INDUSTRIES.length];
    const title = pick(rand, ind.titles);
    const compBase = pick(rand, ind.companies);
    const prefix = ["株式会社", "株式会社", "株式会社", "有限会社"][Math.floor(rand() * 4)];
    const company = (ind.key === "care") ? compBase : prefix + compBase;
    const city = pick(rand, CITIES);
    const pay = buildPay(rand);
    const holidays = 100 + Math.floor(rand() * 30); // 100〜129
    const hasDorm = rand() < 0.35;
    const hasHoliday120 = holidays >= 120;
    const hasNoTenkin = rand() < 0.65;
    const hasTransport = rand() < 0.85;
    const hasCertSupport = rand() < 0.32;
    const hasWeekend = rand() < 0.4;
    const hasRookie = rand() < 0.75;

    const features = [];
    if (hasDorm) features.push("dorm");
    if (hasHoliday120) features.push("holiday120");
    if (hasNoTenkin) features.push("noTenkin");
    if (hasTransport) features.push("transport");
    if (hasCertSupport) features.push("certSupport");
    if (hasWeekend) features.push("weekend");
    if (hasRookie) features.push("rookie");

    const story = pick(rand, STORY_FRAGMENTS) + pick(rand, STORY_FRAGMENTS);

    return {
      id: "J" + pad(i, 4),
      company: company,
      title: `${title}／${city}`,
      industryKey: ind.key,
      industryLabel: ind.label,
      jobType: title,
      city: city,
      monthlyPay: pay,
      annualHolidays: holidays,
      features: features,
      thumb: ind.thumb,
      source: sourceSchoolId ? "school" : "web",
      sourceSchoolId: sourceSchoolId || null,
      summary: story,
      receivedAt: `2026-${pad(1 + Math.floor(rand() * 5), 2)}-${pad(1 + Math.floor(rand() * 27), 2)}`,
      hires: 1 + Math.floor(rand() * 5),
      retireAge: 60 + Math.floor(rand() * 5),
      probation: pick(rand, ["3ヶ月（条件変更なし）", "3ヶ月（給与90%）", "1ヶ月"]),
      workHours: pick(rand, ["8:30〜17:30（休憩60分）", "9:00〜18:00（休憩60分）", "8:00〜17:00（休憩60分）"]),
      benefits: ["健康保険", "厚生年金", "雇用保険", "労災保険"].concat(
        hasTransport ? ["通勤手当"] : []
      ).concat(
        hasDorm ? ["独身寮"] : []
      ).concat(
        hasCertSupport ? ["資格取得支援"] : []
      )
    };
  }

  function generateAll() {
    const list = [];
    // 自校宛: 各校30件
    SCHOOL_IDS.forEach((sid, sidx) => {
      for (let k = 0; k < 30; k++) {
        list.push(buildOneJob(sidx * 30 + k, sid));
      }
    });
    // 高校生就職Web: 820件
    for (let k = 0; k < 820; k++) {
      list.push(buildOneJob(180 + k, null));
    }
    return list;
  }

  window.JOBS = generateAll();
  window.FEATURES_POOL = FEATURES_POOL;
  window.INDUSTRIES_META = INDUSTRIES;
})();
