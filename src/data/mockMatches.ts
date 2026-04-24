export type Player = {
  name: string;
  seed?: number;
  surfaceForm: "hot" | "cold" | "neutral";
  recentForm: ("W" | "L")[];
  serviceHoldPct: number;
  breakPointConversionPct: number;
};

export type MarketOdds = {
  moneyline: { p1: number; p2: number };
  spread: { p1Value: number; p1Odds: number; p2Value: number; p2Odds: number };
  total: { value: number; overOdds: number; underOdds: number };
};

export type ModelPick = {
  market: "Moneyline" | "Spread" | "Total";
  selection: "p1" | "p2" | "over" | "under";
  valueLabel: string;
  ev: number;
  confidence: number;
  trueOdds: number;
};

export type Matchup = {
  id: string;
  time: string;
  tour: "ATP" | "WTA" | "Challenger";
  surface: "Hard" | "Clay" | "Grass";
  tournament: string;
  player1: Player;
  player2: Player;
  odds: MarketOdds;
  modelPicks: {
    moneyline: ModelPick;
    spread: ModelPick;
    total: ModelPick;
  };
  bestPick: "moneyline" | "spread" | "total";
  fatigueIndex: [number, number];
  marketMomentum: boolean;
};

export const MOCK_MATCHES: Matchup[] = [
  {
    id: "m01",
    time: "10:00 AM",
    tour: "ATP",
    surface: "Grass",
    tournament: "Wimbledon",
    player1: { name: "C. Alcaraz", seed: 1, surfaceForm: "hot", recentForm: ["W", "W", "W", "W", "W"], serviceHoldPct: 88, breakPointConversionPct: 45 },
    player2: { name: "J. Sinner", seed: 3, surfaceForm: "neutral", recentForm: ["W", "W", "W", "W", "L"], serviceHoldPct: 86, breakPointConversionPct: 42 },
    odds: {
      moneyline: { p1: -150, p2: +130 },
      spread: { p1Value: -2.5, p1Odds: -110, p2Value: +2.5, p2Odds: -110 },
      total: { value: 41.5, overOdds: -110, underOdds: -110 }
    },
    modelPicks: {
      moneyline: { market: "Moneyline", selection: "p1", valueLabel: "C. Alcaraz ML", ev: 6.5, confidence: 78, trueOdds: -185 },
      spread: { market: "Spread", selection: "p1", valueLabel: "C. Alcaraz -2.5", ev: 2.1, confidence: 55, trueOdds: -125 },
      total: { market: "Total", selection: "over", valueLabel: "Over 41.5", ev: -1.5, confidence: 40, trueOdds: +105 }
    },
    bestPick: "moneyline",
    fatigueIndex: [20, 25],
    marketMomentum: true,
  },
  {
    id: "m08",
    time: "10:15 AM",
    tour: "Challenger",
    surface: "Clay",
    tournament: "Tallahassee",
    player1: { name: "Z. Bergs", seed: 1, surfaceForm: "hot", recentForm: ["W", "W", "W", "L", "W"], serviceHoldPct: 83, breakPointConversionPct: 42 },
    player2: { name: "M. Krueger", surfaceForm: "neutral", recentForm: ["L", "W", "W", "L", "W"], serviceHoldPct: 78, breakPointConversionPct: 36 },
    odds: {
      moneyline: { p1: -220, p2: +180 },
      spread: { p1Value: -3.5, p1Odds: -115, p2Value: +3.5, p2Odds: -105 },
      total: { value: 21.5, overOdds: -115, underOdds: -105 }
    },
    modelPicks: {
      moneyline: { market: "Moneyline", selection: "p1", valueLabel: "Z. Bergs ML", ev: 1.2, confidence: 52, trueOdds: -230 },
      spread: { market: "Spread", selection: "p1", valueLabel: "Z. Bergs -3.5", ev: 4.8, confidence: 72, trueOdds: -150 },
      total: { market: "Total", selection: "under", valueLabel: "Under 21.5", ev: 2.5, confidence: 60, trueOdds: -120 }
    },
    bestPick: "spread",
    fatigueIndex: [30, 45],
    marketMomentum: true,
  },
  {
    id: "m09",
    time: "11:00 AM",
    tour: "Challenger",
    surface: "Hard",
    tournament: "Wuning",
    player1: { name: "B. Yunchaokete", seed: 2, surfaceForm: "neutral", recentForm: ["W", "L", "W", "W", "W"], serviceHoldPct: 81, breakPointConversionPct: 39 },
    player2: { name: "I. Marchenko", surfaceForm: "neutral", recentForm: ["W", "W", "L", "L", "W"], serviceHoldPct: 79, breakPointConversionPct: 34 },
    odds: {
      moneyline: { p1: -160, p2: +130 },
      spread: { p1Value: -2.5, p1Odds: -110, p2Value: +2.5, p2Odds: -110 },
      total: { value: 22.5, overOdds: -110, underOdds: -110 }
    },
    modelPicks: {
      moneyline: { market: "Moneyline", selection: "p2", valueLabel: "I. Marchenko ML", ev: 2.5, confidence: 58, trueOdds: +115 },
      spread: { market: "Spread", selection: "p2", valueLabel: "I. Marchenko +2.5", ev: 4.1, confidence: 68, trueOdds: -135 },
      total: { market: "Total", selection: "over", valueLabel: "Over 22.5", ev: 0.5, confidence: 50, trueOdds: -115 }
    },
    bestPick: "spread",
    fatigueIndex: [25, 40],
    marketMomentum: false,
  },
  {
    id: "m02",
    time: "11:30 AM",
    tour: "WTA",
    surface: "Grass",
    tournament: "Wimbledon",
    player1: { name: "I. Swiatek", seed: 1, surfaceForm: "neutral", recentForm: ["W", "W", "L", "W", "W"], serviceHoldPct: 82, breakPointConversionPct: 52 },
    player2: { name: "E. Rybakina", seed: 4, surfaceForm: "hot", recentForm: ["W", "W", "W", "L", "W"], serviceHoldPct: 89, breakPointConversionPct: 40 },
    odds: {
      moneyline: { p1: -120, p2: +100 },
      spread: { p1Value: -1.5, p1Odds: -110, p2Value: +1.5, p2Odds: -110 },
      total: { value: 23.5, overOdds: -110, underOdds: -110 }
    },
    modelPicks: {
      moneyline: { market: "Moneyline", selection: "p2", valueLabel: "E. Rybakina ML", ev: 4.2, confidence: 65, trueOdds: -115 },
      spread: { market: "Spread", selection: "p2", valueLabel: "E. Rybakina +1.5", ev: 3.8, confidence: 60, trueOdds: -130 },
      total: { market: "Total", selection: "under", valueLabel: "Under 23.5", ev: -2.1, confidence: 30, trueOdds: +115 }
    },
    bestPick: "moneyline",
    fatigueIndex: [15, 30],
    marketMomentum: false,
  },
  {
    id: "m10",
    time: "12:30 PM",
    tour: "Challenger",
    surface: "Clay",
    tournament: "Tallahassee",
    player1: { name: "C. Hemery", surfaceForm: "neutral", recentForm: ["W", "L", "L", "W", "W"], serviceHoldPct: 73, breakPointConversionPct: 40 },
    player2: { name: "A. Ritschard", surfaceForm: "hot", recentForm: ["W", "W", "W", "W", "L"], serviceHoldPct: 81, breakPointConversionPct: 36 },
    odds: {
      moneyline: { p1: +140, p2: -170 },
      spread: { p1Value: +2.5, p1Odds: -115, p2Value: -2.5, p2Odds: -105 },
      total: { value: 21.0, overOdds: -115, underOdds: -105 }
    },
    modelPicks: {
      moneyline: { market: "Moneyline", selection: "p2", valueLabel: "A. Ritschard ML", ev: 5.5, confidence: 75, trueOdds: -210 },
      spread: { market: "Spread", selection: "p2", valueLabel: "A. Ritschard -2.5", ev: 2.1, confidence: 55, trueOdds: -125 },
      total: { market: "Total", selection: "under", valueLabel: "Under 21.0", ev: -1.2, confidence: 45, trueOdds: +105 }
    },
    bestPick: "moneyline",
    fatigueIndex: [50, 35],
    marketMomentum: true,
  },
  {
    id: "m03",
    time: "01:00 PM",
    tour: "Challenger",
    surface: "Hard",
    tournament: "Lexington",
    player1: { name: "E. Nava", surfaceForm: "hot", recentForm: ["W", "W", "W", "L", "W"], serviceHoldPct: 79, breakPointConversionPct: 38 },
    player2: { name: "A. Walton", surfaceForm: "cold", recentForm: ["L", "L", "W", "L", "L"], serviceHoldPct: 72, breakPointConversionPct: 35 },
    odds: {
      moneyline: { p1: -210, p2: +170 },
      spread: { p1Value: -3.5, p1Odds: -105, p2Value: +3.5, p2Odds: -115 },
      total: { value: 22.5, overOdds: -110, underOdds: -110 }
    },
    modelPicks: {
      moneyline: { market: "Moneyline", selection: "p1", valueLabel: "E. Nava ML", ev: 1.5, confidence: 50, trueOdds: -230 },
      spread: { market: "Spread", selection: "p1", valueLabel: "E. Nava -3.5", ev: 8.1, confidence: 85, trueOdds: -150 },
      total: { market: "Total", selection: "over", valueLabel: "Over 22.5", ev: 3.2, confidence: 62, trueOdds: -130 }
    },
    bestPick: "spread",
    fatigueIndex: [45, 80],
    marketMomentum: true,
  },
  {
    id: "m04",
    time: "02:15 PM",
    tour: "ATP",
    surface: "Clay",
    tournament: "Hamburg",
    player1: { name: "A. Zverev", seed: 1, surfaceForm: "hot", recentForm: ["W", "W", "L", "W", "W"], serviceHoldPct: 85, breakPointConversionPct: 41 },
    player2: { name: "S. Baez", seed: 3, surfaceForm: "neutral", recentForm: ["W", "L", "W", "W", "L"], serviceHoldPct: 76, breakPointConversionPct: 46 },
    odds: {
      moneyline: { p1: -400, p2: +300 },
      spread: { p1Value: -4.5, p1Odds: -120, p2Value: +4.5, p2Odds: +100 },
      total: { value: 20.5, overOdds: -110, underOdds: -110 }
    },
    modelPicks: {
      moneyline: { market: "Moneyline", selection: "p2", valueLabel: "S. Baez ML", ev: -3.5, confidence: 20, trueOdds: +350 },
      spread: { market: "Spread", selection: "p2", valueLabel: "S. Baez +4.5", ev: 5.5, confidence: 70, trueOdds: -200 },
      total: { market: "Total", selection: "under", valueLabel: "Under 20.5", ev: 4.1, confidence: 65, trueOdds: -135 }
    },
    bestPick: "spread",
    fatigueIndex: [35, 40],
    marketMomentum: false,
  },
  {
    id: "m11",
    time: "03:00 PM",
    tour: "Challenger",
    surface: "Hard",
    tournament: "Wuning",
    player1: { name: "A. Kachmazov", surfaceForm: "hot", recentForm: ["W", "W", "W", "W", "L"], serviceHoldPct: 82, breakPointConversionPct: 37 },
    player2: { name: "T. Schoolkate", surfaceForm: "neutral", recentForm: ["L", "W", "L", "W", "W"], serviceHoldPct: 77, breakPointConversionPct: 33 },
    odds: {
      moneyline: { p1: -140, p2: +110 },
      spread: { p1Value: -1.5, p1Odds: -115, p2Value: +1.5, p2Odds: -105 },
      total: { value: 22.5, overOdds: -110, underOdds: -110 }
    },
    modelPicks: {
      moneyline: { market: "Moneyline", selection: "p1", valueLabel: "A. Kachmazov ML", ev: 3.1, confidence: 62, trueOdds: -165 },
      spread: { market: "Spread", selection: "p1", valueLabel: "A. Kachmazov -1.5", ev: 1.5, confidence: 50, trueOdds: -130 },
      total: { market: "Total", selection: "over", valueLabel: "Over 22.5", ev: -0.5, confidence: 45, trueOdds: -105 }
    },
    bestPick: "moneyline",
    fatigueIndex: [30, 20],
    marketMomentum: false,
  },
  {
    id: "m05",
    time: "04:00 PM",
    tour: "WTA",
    surface: "Clay",
    tournament: "Palermo",
    player1: { name: "Q. Zheng", seed: 1, surfaceForm: "neutral", recentForm: ["W", "W", "W", "L", "W"], serviceHoldPct: 81, breakPointConversionPct: 44 },
    player2: { name: "D. Parry", surfaceForm: "neutral", recentForm: ["L", "W", "L", "W", "W"], serviceHoldPct: 74, breakPointConversionPct: 39 },
    odds: {
      moneyline: { p1: -350, p2: +260 },
      spread: { p1Value: -4.5, p1Odds: -110, p2Value: +4.5, p2Odds: -110 },
      total: { value: 19.5, overOdds: -115, underOdds: -105 }
    },
    modelPicks: {
      moneyline: { market: "Moneyline", selection: "p1", valueLabel: "Q. Zheng ML", ev: -1.5, confidence: 35, trueOdds: -310 },
      spread: { market: "Spread", selection: "p2", valueLabel: "D. Parry +4.5", ev: 1.2, confidence: 50, trueOdds: -120 },
      total: { market: "Total", selection: "under", valueLabel: "Under 19.5", ev: 3.2, confidence: 60, trueOdds: -130 }
    },
    bestPick: "total",
    fatigueIndex: [20, 60],
    marketMomentum: false,
  },
  {
    id: "m06",
    time: "05:30 PM",
    tour: "Challenger",
    surface: "Clay",
    tournament: "Amersfoort",
    player1: { name: "T. Monteiro", seed: 2, surfaceForm: "neutral", recentForm: ["W", "W", "L", "W", "L"], serviceHoldPct: 84, breakPointConversionPct: 35 },
    player2: { name: "G. Heide", surfaceForm: "neutral", recentForm: ["W", "L", "W", "L", "W"], serviceHoldPct: 78, breakPointConversionPct: 40 },
    odds: {
      moneyline: { p1: -180, p2: +140 },
      spread: { p1Value: -2.5, p1Odds: -115, p2Value: +2.5, p2Odds: -105 },
      total: { value: 21.5, overOdds: -110, underOdds: -110 }
    },
    modelPicks: {
      moneyline: { market: "Moneyline", selection: "p2", valueLabel: "G. Heide ML", ev: -1.5, confidence: 30, trueOdds: +160 },
      spread: { market: "Spread", selection: "p2", valueLabel: "G. Heide +2.5", ev: 1.8, confidence: 55, trueOdds: -125 },
      total: { market: "Total", selection: "over", valueLabel: "Over 21.5", ev: 2.1, confidence: 60, trueOdds: -125 }
    },
    bestPick: "total",
    fatigueIndex: [55, 30],
    marketMomentum: false,
  },
  {
    id: "m07",
    time: "07:00 PM",
    tour: "ATP",
    surface: "Hard",
    tournament: "Atlanta",
    player1: { name: "B. Shelton", seed: 2, surfaceForm: "neutral", recentForm: ["W", "L", "L", "W", "W"], serviceHoldPct: 89, breakPointConversionPct: 32 },
    player2: { name: "M. McDonald", surfaceForm: "cold", recentForm: ["L", "L", "L", "W", "L"], serviceHoldPct: 73, breakPointConversionPct: 37 },
    odds: {
      moneyline: { p1: -250, p2: +200 },
      spread: { p1Value: -3.5, p1Odds: -110, p2Value: +3.5, p2Odds: -110 },
      total: { value: 22.5, overOdds: -115, underOdds: -105 }
    },
    modelPicks: {
      moneyline: { market: "Moneyline", selection: "p1", valueLabel: "B. Shelton ML", ev: 3.1, confidence: 60, trueOdds: -300 },
      spread: { market: "Spread", selection: "p1", valueLabel: "B. Shelton -3.5", ev: 9.2, confidence: 88, trueOdds: -120 },
      total: { market: "Total", selection: "under", valueLabel: "Under 22.5", ev: 1.5, confidence: 52, trueOdds: -125 }
    },
    bestPick: "spread",
    fatigueIndex: [10, 25],
    marketMomentum: true,
  },
  {
    id: "m12",
    time: "12:15 AM",
    tour: "Challenger",
    surface: "Hard",
    tournament: "Wuning",
    player1: { name: "L. Nardi", seed: 1, surfaceForm: "hot", recentForm: ["W", "W", "W", "W", "W"], serviceHoldPct: 86, breakPointConversionPct: 42 },
    player2: { name: "D. Yevseyev", surfaceForm: "neutral", recentForm: ["W", "L", "W", "W", "L"], serviceHoldPct: 75, breakPointConversionPct: 36 },
    odds: {
      moneyline: { p1: -300, p2: +230 },
      spread: { p1Value: -4.5, p1Odds: -105, p2Value: +4.5, p2Odds: -115 },
      total: { value: 21.0, overOdds: -110, underOdds: -110 }
    },
    modelPicks: {
      moneyline: { market: "Moneyline", selection: "p1", valueLabel: "L. Nardi ML", ev: 0.5, confidence: 50, trueOdds: -310 },
      spread: { market: "Spread", selection: "p1", valueLabel: "L. Nardi -4.5", ev: 2.5, confidence: 58, trueOdds: -125 },
      total: { market: "Total", selection: "under", valueLabel: "Under 21.0", ev: 4.8, confidence: 70, trueOdds: -145 }
    },
    bestPick: "total",
    fatigueIndex: [15, 45],
    marketMomentum: true,
  }
];
