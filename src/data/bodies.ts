export interface BodyStat {
  label: string;
  value: string;
}

export interface CelestialBody {
  id: string;
  name: string;
  english: string;
  badge: string;
  color: string;
  colorDeep: string;
  colorLight: string;
  /** 演示用绘制半径（px，非真实比例） */
  radius: number;
  /** 演示用轨道半径（px，对数压缩，非真实比例）；太阳为 0 */
  orbitRx: number;
  /** 初始相位角（弧度） */
  startAngle: number;
  /** 公转周期（地球日），用于驱动角速度 */
  periodDays: number;
  diameterKm: number;
  intro: string;
  fact: string;
  stats: BodyStat[];
  ring?: boolean;
  bands?: number;
  hasMoon?: boolean;
}

export const SUN: CelestialBody = {
  id: "sun",
  name: "太阳",
  english: "SUN",
  badge: "恒星 · G2V 黄矮星",
  color: "#ffc056",
  colorDeep: "#ff9330",
  colorLight: "#fff6da",
  radius: 30,
  orbitRx: 0,
  startAngle: 0,
  periodDays: 0,
  diameterKm: 1392700,
  intro:
    "太阳系的中心恒星，一颗形成于约 46 亿年前的黄矮星。它占据了整个太阳系总质量的 99.86%，用引力牵引着所有行星沿轨道运行。",
  fact: "太阳每秒钟将约 400 万吨物质转化为纯能量——即便如此，它的燃料仍足够再燃烧约 50 亿年。",
  stats: [
    { label: "直径", value: "1,392,700 km" },
    { label: "距地球", value: "1.496 亿 km" },
    { label: "表面温度", value: "约 5,500 °C" },
    { label: "核心温度", value: "约 1,500 万 °C" },
    { label: "自转周期", value: "25 ~ 35 天" },
    { label: "年龄", value: "约 46 亿年" },
    { label: "质量占比", value: "99.86%" },
    { label: "光谱型", value: "G2V" },
  ],
};

export const PLANETS: CelestialBody[] = [
  {
    id: "mercury",
    name: "水星",
    english: "MERCURY",
    badge: "类地行星 · 岩质",
    color: "#b7a98e",
    colorDeep: "#77684f",
    colorLight: "#d8c9ab",
    radius: 4.6,
    orbitRx: 70,
    startAngle: 0.6,
    periodDays: 88,
    diameterKm: 4879,
    intro:
      "距离太阳最近、体积最小的行星。它没有大气层缓冲，表面布满与月球相似的陨石坑，昼夜温差冠绝太阳系。",
    fact: "水星上从一个正午到下一个正午要经历约 176 个地球日——它的「一天」比「一年」还长两倍。",
    stats: [
      { label: "直径", value: "4,879 km" },
      { label: "距太阳", value: "5,790 万 km" },
      { label: "轨道半径", value: "0.39 AU" },
      { label: "公转周期", value: "88 地球日" },
      { label: "自转周期", value: "58.6 地球日" },
      { label: "表面温度", value: "-173 ~ 427 °C" },
      { label: "已知卫星", value: "0 颗" },
      { label: "轨道速度", value: "47.4 km/s" },
    ],
  },
  {
    id: "venus",
    name: "金星",
    english: "VENUS",
    badge: "类地行星 · 岩质",
    color: "#e5c26b",
    colorDeep: "#b1843a",
    colorLight: "#f7e0a4",
    radius: 7.6,
    orbitRx: 96,
    startAngle: 2.2,
    periodDays: 224.7,
    diameterKm: 12104,
    intro:
      "被浓厚二氧化碳大气包裹的炽热世界，大小与地球相仿，被称为地球的「姊妹星」——但环境却如同炼狱。",
    fact: "金星逆向自转且极其缓慢：在它表面，太阳从西边升起；一个金星日比一个金星年还要长。",
    stats: [
      { label: "直径", value: "12,104 km" },
      { label: "距太阳", value: "1.082 亿 km" },
      { label: "轨道半径", value: "0.72 AU" },
      { label: "公转周期", value: "225 地球日" },
      { label: "自转周期", value: "243 天（逆行）" },
      { label: "表面温度", value: "约 464 °C" },
      { label: "已知卫星", value: "0 颗" },
      { label: "轨道速度", value: "35.0 km/s" },
    ],
  },
  {
    id: "earth",
    name: "地球",
    english: "EARTH",
    badge: "类地行星 · 岩质",
    color: "#4f8fe8",
    colorDeep: "#274f96",
    colorLight: "#9cc8f5",
    radius: 8,
    orbitRx: 113,
    startAngle: 3.9,
    periodDays: 365.25,
    diameterKm: 12756,
    intro:
      "目前已知唯一孕育生命的星球。71% 的表面被海洋覆盖，一层富含氮氧的大气与磁场共同守护着地表生态。",
    fact: "地球并不是完美的球体——自转产生的离心力让赤道半径比极半径长约 21 km。",
    stats: [
      { label: "直径", value: "12,756 km" },
      { label: "距太阳", value: "1.496 亿 km" },
      { label: "轨道半径", value: "1.00 AU" },
      { label: "公转周期", value: "365.25 天" },
      { label: "自转周期", value: "23.9 小时" },
      { label: "平均温度", value: "约 15 °C" },
      { label: "已知卫星", value: "1 颗（月球）" },
      { label: "轨道速度", value: "29.8 km/s" },
    ],
    hasMoon: true,
  },
  {
    id: "mars",
    name: "火星",
    english: "MARS",
    badge: "类地行星 · 岩质",
    color: "#e06a3c",
    colorDeep: "#9c4526",
    colorLight: "#f5a075",
    radius: 5.8,
    orbitRx: 137,
    startAngle: 5.4,
    periodDays: 687,
    diameterKm: 6792,
    intro:
      "因氧化铁沙尘而呈铁锈红色的沙漠世界。它拥有稀薄的大气、两极的冰盖，以及太阳系中最高的火山。",
    fact: "奥林帕斯山高约 21.9 km，接近珠穆朗玛峰的三倍，山体宽到可以覆盖整个法国。",
    stats: [
      { label: "直径", value: "6,792 km" },
      { label: "距太阳", value: "2.279 亿 km" },
      { label: "轨道半径", value: "1.52 AU" },
      { label: "公转周期", value: "687 地球日" },
      { label: "自转周期", value: "24.6 小时" },
      { label: "平均温度", value: "约 -63 °C" },
      { label: "已知卫星", value: "2 颗" },
      { label: "轨道速度", value: "24.1 km/s" },
    ],
  },
  {
    id: "jupiter",
    name: "木星",
    english: "JUPITER",
    badge: "气态巨行星",
    color: "#d9a066",
    colorDeep: "#a5703c",
    colorLight: "#f0c694",
    radius: 19,
    orbitRx: 217,
    startAngle: 1.2,
    periodDays: 4331,
    diameterKm: 142984,
    intro:
      "太阳系最大的行星，质量是其余七颗行星总和的 2.5 倍。它是一颗以氢和氦为主的气态巨行星，没有固态表面。",
    fact: "大红斑是一场持续了至少 350 年的巨型反气旋风暴，宽度足以装下一整个地球。",
    stats: [
      { label: "直径", value: "142,984 km" },
      { label: "距太阳", value: "7.786 亿 km" },
      { label: "轨道半径", value: "5.20 AU" },
      { label: "公转周期", value: "11.9 地球年" },
      { label: "自转周期", value: "9.9 小时" },
      { label: "云顶温度", value: "约 -108 °C" },
      { label: "已知卫星", value: "95 颗" },
      { label: "轨道速度", value: "13.1 km/s" },
    ],
    bands: 3,
  },
  {
    id: "saturn",
    name: "土星",
    english: "SATURN",
    badge: "气态巨行星 · 光环",
    color: "#e3c584",
    colorDeep: "#b09055",
    colorLight: "#f5e0b0",
    radius: 16,
    orbitRx: 261,
    startAngle: 3.2,
    periodDays: 10747,
    diameterKm: 120536,
    intro:
      "以壮观的冰质光环闻名于世。光环主体宽约 28 万公里，却薄得惊人——平均厚度只有十米左右。",
    fact: "土星的平均密度仅 0.69 g/cm³，比水还低：如果有一片足够大的海洋，它能浮在水面上。",
    stats: [
      { label: "直径", value: "120,536 km" },
      { label: "距太阳", value: "14.335 亿 km" },
      { label: "轨道半径", value: "9.58 AU" },
      { label: "公转周期", value: "29.4 地球年" },
      { label: "自转周期", value: "10.7 小时" },
      { label: "云顶温度", value: "约 -139 °C" },
      { label: "已知卫星", value: "146 颗" },
      { label: "轨道速度", value: "9.7 km/s" },
    ],
    ring: true,
    bands: 2,
  },
  {
    id: "uranus",
    name: "天王星",
    english: "URANUS",
    badge: "冰巨行星",
    color: "#7fc8d9",
    colorDeep: "#4a8ba0",
    colorLight: "#b5e4ee",
    radius: 11.5,
    orbitRx: 312,
    startAngle: 5.9,
    periodDays: 30589,
    diameterKm: 51118,
    intro:
      "一颗淡青色的冰巨行星，大气中的甲烷吸收了红光，赋予它宁静而独特的颜色。它是第一颗用望远镜发现的行星。",
    fact: "天王星几乎是「躺着」自转的——自转轴倾角约 98°，让它的每一极都要经历长达 42 年的极昼与极夜。",
    stats: [
      { label: "直径", value: "51,118 km" },
      { label: "距太阳", value: "28.725 亿 km" },
      { label: "轨道半径", value: "19.20 AU" },
      { label: "公转周期", value: "84 地球年" },
      { label: "自转周期", value: "17.2 小时（逆行）" },
      { label: "云顶温度", value: "约 -197 °C" },
      { label: "已知卫星", value: "28 颗" },
      { label: "轨道速度", value: "6.8 km/s" },
    ],
  },
  {
    id: "neptune",
    name: "海王星",
    english: "NEPTUNE",
    badge: "冰巨行星",
    color: "#4f6fe0",
    colorDeep: "#31489e",
    colorLight: "#8ea4f2",
    radius: 11,
    orbitRx: 345,
    startAngle: 0.2,
    periodDays: 59800,
    diameterKm: 49528,
    intro:
      "距离太阳最远的行星，呈深邃的钴蓝色。它不是被观测偶然发现，而是先由数学计算预言、随后才被望远镜证实。",
    fact: "海王星上的风速可达 2,100 km/h，接近音速的 1.7 倍，是太阳系中风暴最猛烈的地方。",
    stats: [
      { label: "直径", value: "49,528 km" },
      { label: "距太阳", value: "44.951 亿 km" },
      { label: "轨道半径", value: "30.05 AU" },
      { label: "公转周期", value: "164.8 地球年" },
      { label: "自转周期", value: "16.1 小时" },
      { label: "云顶温度", value: "约 -201 °C" },
      { label: "已知卫星", value: "16 颗" },
      { label: "轨道速度", value: "5.4 km/s" },
    ],
  },
];

export const ALL_BODIES: CelestialBody[] = [SUN, ...PLANETS];

export const bodyById = (id: string | null): CelestialBody | null =>
  ALL_BODIES.find((b) => b.id === id) ?? null;
