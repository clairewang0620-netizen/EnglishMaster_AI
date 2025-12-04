import { Level } from './types';

// STRATEGY: Use generic names to avoid platform bans (XiaoHongShu/Taobao)
// Level 1 = High School / Basics
// Level 2 = CET-4 Equivalent (Foundation)
// Level 3 = CET-6 Equivalent (Intermediate)
// Level 4 = TEM-4 / IELTS 6.0 (Advanced)
// Level 5 = TEM-8 / TOEFL (Mastery)
// Level 6 = Business / Professional

export const COURSE_CONTENT: Level[] = [
  {
    id: 'lvl-1',
    title: "Level 1",
    subTitle: "Foundation Essentials",
    description: "Essential vocabulary for daily communication.",
    icon: "🌱",
    isPremium: false,
    words: [
      { id: 'w101', english: "Ambition", chinese: "雄心，抱负", ipa: "/æmˈbɪʃ.ən/", exampleEn: "Her ambition is to become a pilot.", exampleCn: "她的抱负是成为一名飞行员。", levelId: 'lvl-1' },
      { id: 'w102', english: "Benefit", chinese: "利益，好处", ipa: "/ˈben.ɪ.fɪt/", exampleEn: "The discovery was of great benefit to humanity.", exampleCn: "这项发现对人类有巨大利益。", levelId: 'lvl-1' },
      { id: 'w103', english: "Combine", chinese: "结合，联合", ipa: "/kəmˈbaɪn/", exampleEn: "We need to combine our resources.", exampleCn: "我们需要整合我们的资源。", levelId: 'lvl-1' },
      { id: 'w104', english: "Determine", chinese: "决定，决心", ipa: "/dɪˈtɜː.mɪn/", exampleEn: "Your attitude will determine your success.", exampleCn: "你的态度将决定你的成功。", levelId: 'lvl-1' },
      { id: 'w105', english: "Essential", chinese: "必要的，本质的", ipa: "/ɪˈsen.ʃəl/", exampleEn: "Water is essential for life.", exampleCn: "水对于生命是必不可少的。", levelId: 'lvl-1' },
    ],
    scenarios: [
      {
        id: 's1',
        title: "At the Airport",
        description: "Checking in and finding your gate.",
        lines: [
          { speaker: "Staff", english: "May I see your passport and ticket, please?", chinese: "请出示您的护照和机票。", avatar: "👩‍💼" },
          { speaker: "Traveler", english: "Here you go. Is the flight on time?", chinese: "给您。航班准点吗？", avatar: "👨‍" },
          { speaker: "Staff", english: "Yes, it is boarding at Gate 12.", chinese: "是的，正在12号登机口登机。", avatar: "👩‍💼" },
        ]
      }
    ]
  },
  {
    id: 'lvl-2',
    title: "Level 2",
    subTitle: "Academic Core",
    description: "University standard vocabulary (Equivalent to CET-4).",
    icon: "📘",
    isPremium: false,
    words: [
      { id: 'w201', english: "Adequate", chinese: "足够的，胜任的", ipa: "/ˈæd.ə.kwət/", exampleEn: "We don't have adequate food for everyone.", exampleCn: "我们没有足够的食物分给大家。", levelId: 'lvl-2' },
      { id: 'w202', english: "Capacity", chinese: "容量，能力", ipa: "/kəˈpæs.ə.ti/", exampleEn: "The stadium has a seating capacity of 50,000.", exampleCn: "这个体育馆有5万个座位。", levelId: 'lvl-2' },
      { id: 'w203', english: "Domestic", chinese: "国内的，家庭的", ipa: "/dəˈmes.tɪk/", exampleEn: "Domestic flights go from Terminal 1.", exampleCn: "国内航班从1号航站楼出发。", levelId: 'lvl-2' },
      { id: 'w204', english: "External", chinese: "外部的", ipa: "/ɪkˈstɜː.nəl/", exampleEn: "This is for external use only.", exampleCn: "这仅供外用。", levelId: 'lvl-2' },
      { id: 'w205', english: "Generate", chinese: "产生，引起", ipa: "/ˈdʒen.ə.reɪt/", exampleEn: "The wind farm may generate enough power for 2000 homes.", exampleCn: "这个风力发电场可以为2000户家庭供电。", levelId: 'lvl-2' },
    ],
    scenarios: []
  },
  {
    id: 'lvl-3',
    title: "Level 3",
    subTitle: "Advanced Academic",
    description: "Higher education vocabulary (Equivalent to CET-6).",
    icon: "🎓",
    isPremium: true,
    words: [
      { id: 'w301', english: "Abnormal", chinese: "反常的，变态的", ipa: "/æbˈnɔː.məl/", exampleEn: "The test results were slightly abnormal.", exampleCn: "测试结果稍微有点反常。", levelId: 'lvl-3' },
      { id: 'w302', english: "Collide", chinese: "碰撞，冲突", ipa: "/kəˈlaɪd/", exampleEn: "The two ideas collide with each other.", exampleCn: "这两种观点互相冲突。", levelId: 'lvl-3' },
      { id: 'w303', english: "Deprive", chinese: "剥夺", ipa: "/dɪˈpraɪv/", exampleEn: "You cannot deprive me of my rights.", exampleCn: "你不能剥夺我的权利。", levelId: 'lvl-3' },
      { id: 'w304', english: "Hamper", chinese: "妨碍，束缚", ipa: "/ˈhæm.pər/", exampleEn: "High winds hampered the rescue attempt.", exampleCn: "大风阻碍了救援尝试。", levelId: 'lvl-3' },
      { id: 'w305', english: "Impulse", chinese: "冲动，脉冲", ipa: "/ˈɪm.pʌls/", exampleEn: "I had a sudden impulse to laugh.", exampleCn: "我突然有一种想笑的冲动。", levelId: 'lvl-3' },
    ],
    scenarios: []
  },
  {
    id: 'lvl-4',
    title: "Level 4",
    subTitle: "Global Communication",
    description: "For studying abroad (Equivalent to IELTS/TOEFL).",
    icon: "🌏",
    isPremium: true,
    words: [
      { id: 'w401', english: "Ambiguous", chinese: "模棱两可的", ipa: "/æmˈbɪɡ.ju.əs/", exampleEn: "His reply was ambiguous.", exampleCn: "他的回答模棱两可。", levelId: 'lvl-4' },
      { id: 'w402', english: "Coherent", chinese: "连贯的，一致的", ipa: "/kəʊˈhɪə.rənt/", exampleEn: "He couldn't form a coherent sentence.", exampleCn: "他连一句连贯的话都说不出来。", levelId: 'lvl-4' },
      { id: 'w403', english: "Empirical", chinese: "经验主义的", ipa: "/ɪmˈpɪr.ɪ.kəl/", exampleEn: "There is no empirical evidence to support this.", exampleCn: "没有经验证据支持这一点。", levelId: 'lvl-4' },
    ],
    scenarios: []
  },
  {
    id: 'lvl-5',
    title: "Level 5",
    subTitle: "Professional Career",
    description: "Business English for the workplace.",
    icon: "💼",
    isPremium: true,
    words: [
      { id: 'w501', english: "Acquisition", chinese: "收购，获得", ipa: "/ˌæk.wɪˈzɪʃ.ən/", exampleEn: "The company announced a new acquisition.", exampleCn: "公司宣布了一项新的收购案。", levelId: 'lvl-5' },
      { id: 'w502', english: "Benchmark", chinese: "基准", ipa: "/ˈbentʃ.mɑːk/", exampleEn: "This product sets a new benchmark for quality.", exampleCn: "这产品设立了质量的新基准。", levelId: 'lvl-5' },
    ],
    scenarios: [
      {
        id: 's_biz_1',
        title: "Salary Negotiation",
        description: "Discussing compensation with HR.",
        lines: [
           { speaker: "Employee", english: "I was hoping we could discuss my salary.", chinese: "我希望能讨论一下我的薪资。", avatar: "👨‍💻" },
           { speaker: "HR", english: "Based on your performance, what figure did you have in mind?", chinese: "基于你的表现，你心里的数字是多少？", avatar: "👩‍💼" },
        ]
      }
    ]
  },
];