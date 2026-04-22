let gameScreen = "start"; // start, play, result

let players = [];
let stocks = [];
let events = [];
let logs = [];

let currentPlayerIndex = 0;
let round = 1;
let maxRound = 10;
let selectedStockIndex = -1;
let winnerList = [];
let message = "";

let buttons = {};
let stockCards = [];

const COLORS = {
  bgTop: [232, 242, 255],
  bgBottom: [255, 233, 245],

  panel: [245, 248, 255],
  panelEdge: [255, 255, 255],
  shadow: [120, 130, 170, 45],

  title: [84, 92, 140],
  text: [78, 86, 120],
  subtext: [120, 128, 158],

  blue: [156, 204, 255],
  blueDark: [86, 130, 196],

  mint: [177, 238, 216],
  mintDark: [74, 153, 124],

  peach: [255, 202, 181],
  peachDark: [191, 104, 82],

  lavender: [211, 197, 255],
  lavenderDark: [121, 102, 191],

  yellow: [255, 238, 171],
  yellowDark: [183, 146, 57],

  pink: [255, 205, 229],
  pinkDark: [189, 105, 145],

  white: [255, 255, 255],

  reset: [255, 214, 214],
  resetDark: [196, 103, 103]
};

function setup() {
  createCanvas(1280, 800);
  textFont("Arial");
  initGame();
}

function draw() {
  drawPastelBackground();

  if (gameScreen === "start") {
    drawStartScreen();
  } else if (gameScreen === "play") {
    drawGameScreen();
  } else if (gameScreen === "result") {
    drawResultScreen();
  }
}

function initGame() {
  players = createPlayers();
  stocks = createStocks();
  events = createEvents();
  logs = [];
  currentPlayerIndex = 0;
  round = 1;
  selectedStockIndex = -1;
  winnerList = [];
  message = "게임을 시작할 준비가 되었습니다.";
  addLog("게임이 초기화되었습니다.");
  updateAllAssets();
  setupButtonAreas();
}

function createPlayers() {
  return [
    {
      id: 1,
      name: "플레이어1",
      cash: 100000,
      stocksOwned: { IT: 0, FOOD: 0, GAME: 0, ENERGY: 0 },
      totalAsset: 100000
    },
    {
      id: 2,
      name: "플레이어2",
      cash: 100000,
      stocksOwned: { IT: 0, FOOD: 0, GAME: 0, ENERGY: 0 },
      totalAsset: 100000
    },
    {
      id: 3,
      name: "플레이어3",
      cash: 100000,
      stocksOwned: { IT: 0, FOOD: 0, GAME: 0, ENERGY: 0 },
      totalAsset: 100000
    },
    {
      id: 4,
      name: "플레이어4",
      cash: 100000,
      stocksOwned: { IT: 0, FOOD: 0, GAME: 0, ENERGY: 0 },
      totalAsset: 100000
    }
  ];
}

function createStocks() {
  return [
    {
      code: "IT",
      name: "IT 기업",
      price: 10000,
      minPrice: 1000,
      maxPrice: 30000,
      description: "변동성이 큰 성장형 종목"
    },
    {
      code: "FOOD",
      name: "식품 기업",
      price: 8000,
      minPrice: 1000,
      maxPrice: 20000,
      description: "비교적 안정적인 종목"
    },
    {
      code: "GAME",
      name: "게임 기업",
      price: 12000,
      minPrice: 1000,
      maxPrice: 35000,
      description: "이벤트 영향이 큰 종목"
    },
    {
      code: "ENERGY",
      name: "에너지 기업",
      price: 9000,
      minPrice: 1000,
      maxPrice: 25000,
      description: "시장 흐름의 영향을 받는 종목"
    }
  ];
}

function createEvents() {
  return [
    { title: "IT 호황", target: "IT", change: 3000, description: "IT 산업 기대감 상승!" },
    { title: "경기 침체", target: "ALL", change: -2000, description: "전체 시장이 위축되었습니다." },
    { title: "신제품 출시", target: "GAME", change: 4000, description: "게임 기업 신작 흥행!" },
    { title: "원가 상승", target: "FOOD", change: -1500, description: "식품 기업의 수익성이 줄었습니다." },
    { title: "친환경 정책", target: "ENERGY", change: 2500, description: "에너지 산업 기대감이 높아졌습니다." },
    { title: "시장 안정", target: "ALL", change: 0, description: "시장은 큰 변동 없이 유지되었습니다." },
    { title: "투자 심리 개선", target: "ALL", change: 1000, description: "전체 종목이 소폭 상승했습니다." },
    { title: "악재 발생", target: "IT", change: -3000, description: "IT 기업 관련 악재가 발생했습니다." },
    { title: "인기 상품 출시", target: "FOOD", change: 2000, description: "식품 기업의 신상품이 인기를 끌고 있습니다." },
    { title: "전력 수요 증가", target: "ENERGY", change: 3000, description: "에너지 기업 수요가 증가했습니다." }
  ];
}

function setupButtonAreas() {
  buttons = {
    // 시작 버튼을 기존보다 약 76px 아래로 이동
    start: { x: width / 2 - 120, y: 596, w: 240, h: 64 },

    buy: { x: 980, y: 260, w: 210, h: 58 },
    sell: { x: 980, y: 340, w: 210, h: 58 },
    pass: { x: 980, y: 420, w: 210, h: 58 },

    restart: { x: width / 2 - 120, y: 640, w: 240, h: 64 },

    resetTop: { x: 1120, y: 34, w: 120, h: 42 }
  };

  stockCards = [];
  let startX = 300;
  let startY = 185;
  let gap = 22;
  let cardW = 265;
  let cardH = 145;

  for (let i = 0; i < 4; i++) {
    let row = floor(i / 2);
    let col = i % 2;
    stockCards.push({
      x: startX + col * (cardW + gap),
      y: startY + row * (cardH + gap),
      w: cardW,
      h: cardH
    });
  }
}

function drawPastelBackground() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let r = lerp(COLORS.bgTop[0], COLORS.bgBottom[0], inter);
    let g = lerp(COLORS.bgTop[1], COLORS.bgBottom[1], inter);
    let b = lerp(COLORS.bgTop[2], COLORS.bgBottom[2], inter);
    stroke(r, g, b);
    line(0, y, width, y);
  }

  noStroke();
  fill(255, 255, 255, 35);
  ellipse(170, 120, 220, 140);
  ellipse(1120, 110, 260, 150);
  ellipse(1080, 720, 280, 180);
  ellipse(180, 700, 240, 150);
}

function drawStartScreen() {
  drawSoftPanel(width / 2 - 360, 90, 720, 610, 34);

  fill(...COLORS.title);
  textAlign(CENTER, CENTER);
  textSize(46);
  textStyle(BOLD);
  text("주식왕 챌린지", width / 2, 175);

  fill(...COLORS.text);
  textSize(22);
  textStyle(NORMAL);
  text("입체감 있는 시장에서 주식을 사고팔며", width / 2, 255);
  text("최종 자산 1위를 노리는 4인용 턴제 게임", width / 2, 288);

  drawPlasticIllustration(width / 2 + 180, 405);

  drawInnerCard(width / 2 - 285, 330, 310, 190, COLORS.lavender, "게임 규칙");

  fill(...COLORS.text);
  textAlign(LEFT, TOP);
  textSize(17);
  textStyle(NORMAL);
  text("• 종목을 선택한 뒤 매수 / 매도 / 패스를 누릅니다.", width / 2 - 255, 380, 250, 40);
  text("• 행동 후 시장 이벤트가 발생해 주가가 변동됩니다.", width / 2 - 255, 420, 250, 40);
  text("• 10라운드가 끝나면 총자산이 높은 플레이어가 승리합니다.", width / 2 - 255, 460, 250, 50);

  draw3DButton(buttons.start, "게임 시작", COLORS.blue, COLORS.blueDark);

  fill(...COLORS.subtext);
  textSize(15);
  textAlign(CENTER, CENTER);
  text("Plastic / Shadow / Pastel Style", width / 2, 690);
}

function drawGameScreen() {
  drawTopBar();
  drawPlayerPanel();
  drawStockPanel();
  drawActionPanel();
  drawLogPanel();
}

function drawTopBar() {
  drawSoftPanel(20, 20, width - 40, 96, 26);

  fill(...COLORS.title);
  textAlign(LEFT, CENTER);
  textSize(30);
  textStyle(BOLD);
  text("주식왕 챌린지", 48, 57);

  drawMiniBadge(300, 37, 145, 34, "라운드 " + round + " / " + maxRound);
  drawMiniBadge(462, 37, 190, 34, "현재 턴 " + getCurrentPlayer().name);

  draw3DButtonSmall(buttons.resetTop, "리셋", COLORS.reset, COLORS.resetDark);

  fill(...COLORS.subtext);
  textStyle(NORMAL);
  textSize(17);
  textAlign(LEFT, TOP);
  text(message, 48, 72, 1045, 36);
}

function drawPlayerPanel() {
  drawSoftPanel(20, 130, 240, 500, 28);

  fill(...COLORS.title);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(24);
  text("플레이어 현황", 40, 150);

  for (let i = 0; i < players.length; i++) {
    let p = players[i];
    let y = 200 + i * 100;

    let theme = i === 0 ? COLORS.blue : i === 1 ? COLORS.mint : i === 2 ? COLORS.peach : COLORS.pink;
    drawPlayerInfoCard(34, y - 6, 212, 84, p, i === currentPlayerIndex, theme);
  }
}

function drawPlayerInfoCard(x, y, w, h, player, active, theme) {
  if (active) {
    drawRaisedCard(x, y, w, h, theme[0], 18, 38);
  } else {
    drawRaisedCard(x, y, w, h, 248, 18, 22);
  }

  fill(...COLORS.title);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(18);
  text(player.name, x + 14, y + 12);

  fill(...COLORS.text);
  textStyle(NORMAL);
  textSize(14);
  text("현금", x + 14, y + 40);
  text("총자산", x + 14, y + 59);

  fill(...COLORS.title);
  textAlign(RIGHT, TOP);
  textSize(14);
  text(formatMoney(player.cash), x + w - 14, y + 40);
  text(formatMoney(player.totalAsset), x + w - 14, y + 59);
}

function drawStockPanel() {
  drawSoftPanel(280, 130, 660, 500, 28);

  fill(...COLORS.title);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(24);
  text("주식 시장", 305, 150);

  fill(...COLORS.subtext);
  textStyle(NORMAL);
  textSize(15);
  text("입체 카드를 눌러 종목을 선택하세요", 305, 178);

  for (let i = 0; i < stocks.length; i++) {
    drawStockCard(i);
  }
}

function drawStockCard(index) {
  let stock = stocks[index];
  let card = stockCards[index];
  let isSelected = selectedStockIndex === index;

  let theme =
    index === 0 ? COLORS.blue :
    index === 1 ? COLORS.mint :
    index === 2 ? COLORS.peach :
    COLORS.lavender;

  drawStockPlasticCard(card.x, card.y, card.w, card.h, stock, theme, isSelected);
}

function drawStockPlasticCard(x, y, w, h, stock, theme, selected) {
  let baseY = selected ? y - 4 : y;
  let shadowAlpha = selected ? 48 : 30;

  noStroke();
  fill(120, 130, 170, shadowAlpha);
  rect(x + 8, baseY + 14, w, h, 20);

  fill(255);
  rect(x, baseY, w, h, 20);

  fill(theme[0], theme[1], theme[2], 170);
  rect(x, baseY, w, h - 12, 20);

  fill(255, 255, 255, 95);
  rect(x + 10, baseY + 10, w - 20, 28, 14);

  if (selected) {
    stroke(255);
    strokeWeight(3);
    noFill();
    rect(x + 4, baseY + 4, w - 8, h - 8, 18);
    noStroke();
  }

  drawStockIcon(stock.code, x + w - 58, baseY + 46, 42, theme);

  fill(...COLORS.title);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(22);
  text(stock.name, x + 16, baseY + 14);

  fill(...COLORS.text);
  textStyle(BOLD);
  textSize(26);
  text(formatMoney(stock.price), x + 16, baseY + 52);

  fill(...COLORS.subtext);
  textStyle(NORMAL);
  textSize(14);
  text(stock.description, x + 16, baseY + 93, 155, 36);

  fill(255, 255, 255, 210);
  rect(x + 14, baseY + 116, 102, 18, 10);
  fill(...theme.slice(0, 3));
  textSize(12);
  textAlign(CENTER, CENTER);
  text(selected ? "선택 완료" : "클릭하여 선택", x + 65, baseY + 125);
}

function drawStockIcon(code, cx, cy, size, theme) {
  noStroke();

  fill(120, 130, 170, 30);
  ellipse(cx + 3, cy + size * 0.55, size * 1.15, size * 0.38);

  fill(theme[0], theme[1], theme[2]);
  ellipse(cx, cy, size, size);

  fill(255, 255, 255, 90);
  ellipse(cx - size * 0.18, cy - size * 0.2, size * 0.32, size * 0.18);

  if (code === "IT") {
    drawITIcon(cx, cy, size);
  } else if (code === "FOOD") {
    drawFoodIcon(cx, cy, size);
  } else if (code === "GAME") {
    drawGameIcon(cx, cy, size);
  } else if (code === "ENERGY") {
    drawEnergyIcon(cx, cy, size);
  }
}

function drawITIcon(cx, cy, size) {
  rectMode(CENTER);
  noStroke();
  fill(255);
  rect(cx, cy - 2, size * 0.52, size * 0.34, 6);
  fill(230, 235, 255);
  rect(cx, cy - 2, size * 0.42, size * 0.24, 4);
  fill(255);
  rect(cx, cy + size * 0.2, size * 0.16, size * 0.06, 3);
  rect(cx, cy + size * 0.26, size * 0.26, size * 0.05, 3);
  rectMode(CORNER);
}

function drawFoodIcon(cx, cy, size) {
  noStroke();
  fill(255);
  ellipse(cx, cy + 2, size * 0.22, size * 0.44);
  ellipse(cx - size * 0.12, cy - size * 0.02, size * 0.2, size * 0.34);
  ellipse(cx + size * 0.12, cy - size * 0.02, size * 0.2, size * 0.34);
  fill(215, 245, 220);
  ellipse(cx, cy - size * 0.15, size * 0.1, size * 0.08);
}

function drawGameIcon(cx, cy, size) {
  rectMode(CENTER);
  noStroke();
  fill(255);
  rect(cx, cy, size * 0.62, size * 0.34, 10);
  fill(235, 240, 255);
  ellipse(cx - size * 0.15, cy, size * 0.1, size * 0.1);
  ellipse(cx + size * 0.15, cy, size * 0.1, size * 0.1);
  fill(220, 225, 250);
  rect(cx - size * 0.02, cy, size * 0.06, size * 0.06, 2);
  rectMode(CORNER);
}

function drawEnergyIcon(cx, cy, size) {
  noStroke();
  fill(255);
  beginShape();
  vertex(cx - size * 0.08, cy - size * 0.26);
  vertex(cx + size * 0.04, cy - size * 0.02);
  vertex(cx - size * 0.01, cy - size * 0.02);
  vertex(cx + size * 0.08, cy + size * 0.24);
  vertex(cx - size * 0.05, cy + size * 0.02);
  vertex(cx, cy + size * 0.02);
  endShape(CLOSE);
}

function drawActionPanel() {
  drawSoftPanel(960, 130, 300, 500, 28);

  fill(...COLORS.title);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(24);
  text("행동 선택", 985, 150);

  fill(...COLORS.text);
  textStyle(NORMAL);
  textSize(17);

  if (selectedStockIndex >= 0) {
    let s = stocks[selectedStockIndex];
    text("선택 종목", 985, 195);
    fill(...COLORS.title);
    textStyle(BOLD);
    text(s.name, 985, 220);

    fill(...COLORS.text);
    textStyle(NORMAL);
    text("현재 가격  " + formatMoney(s.price), 985, 248, 240, 26);
  } else {
    text("먼저 종목 카드를 선택하세요.", 985, 205, 240, 40);
  }

  draw3DButton(buttons.buy, "매수", COLORS.mint, COLORS.mintDark);
  draw3DButton(buttons.sell, "매도", COLORS.peach, COLORS.peachDark);
  draw3DButton(buttons.pass, "패스", COLORS.lavender, COLORS.lavenderDark);

  let currentPlayer = getCurrentPlayer();

  drawInnerCard(978, 500, 264, 100, COLORS.yellow, "보유 주식");
  fill(...COLORS.text);
  textAlign(LEFT, TOP);
  textSize(16);
  textStyle(NORMAL);
  text("IT: " + currentPlayer.stocksOwned.IT + "주", 995, 542);
  text("식품: " + currentPlayer.stocksOwned.FOOD + "주", 1098, 542);
  text("게임: " + currentPlayer.stocksOwned.GAME + "주", 995, 572);
  text("에너지: " + currentPlayer.stocksOwned.ENERGY + "주", 1098, 572);
}

function drawLogPanel() {
  drawSoftPanel(20, 650, width - 40, 130, 28);

  fill(...COLORS.title);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(22);
  text("최근 기록", 40, 668);

  for (let i = 0; i < logs.length; i++) {
    let y = 705 + i * 20;
    fill(255, 255, 255, 160);
    rect(36, y - 2, width - 88, 18, 8);

    fill(...COLORS.text);
    textStyle(NORMAL);
    textSize(15);
    text("• " + shortenText(logs[i], 62), 48, y);
  }
}

function drawResultScreen() {
  drawSoftPanel(width / 2 - 370, 70, 740, 660, 36);

  fill(...COLORS.title);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(42);
  text("게임 결과", width / 2, 130);

  drawMiniBadge(width / 2 - 90, 160, 180, 34, "최종 순위 발표");

  for (let i = 0; i < winnerList.length; i++) {
    let p = winnerList[i];
    let y = 235 + i * 88;

    let theme =
      i === 0 ? COLORS.yellow :
      i === 1 ? COLORS.blue :
      i === 2 ? COLORS.mint :
      COLORS.pink;

    drawRaisedCard(width / 2 - 290, y, 580, 62, theme[0], 22, 32);

    fill(...COLORS.title);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(24);
    text((i + 1) + "위", width / 2 - 255, y + 31);

    fill(...COLORS.text);
    textSize(22);
    text(p.name, width / 2 - 165, y + 31);

    fill(...COLORS.title);
    textAlign(RIGHT, CENTER);
    textSize(22);
    text(formatMoney(p.totalAsset), width / 2 + 255, y + 31);
  }

  fill(...COLORS.subtext);
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(20);
  text("우승자: " + winnerList[0].name, width / 2 - 150, 585, 300, 30);

  draw3DButton(buttons.restart, "다시 시작", COLORS.blue, COLORS.blueDark);
}

function draw3DButton(btn, label, bgColorArr, darkColorArr) {
  let hovered = isMouseInRect(btn.x, btn.y, btn.w, btn.h);
  let lift = hovered ? -2 : 0;

  noStroke();
  fill(darkColorArr[0], darkColorArr[1], darkColorArr[2], 220);
  rect(btn.x, btn.y + 10 + lift, btn.w, btn.h, 18);

  fill(bgColorArr[0], bgColorArr[1], bgColorArr[2]);
  rect(btn.x, btn.y + lift, btn.w, btn.h, 18);

  fill(255, 255, 255, 90);
  rect(btn.x + 10, btn.y + 8 + lift, btn.w - 20, 14, 10);

  fill(...COLORS.title);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(24);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2 + lift);
}

function draw3DButtonSmall(btn, label, bgColorArr, darkColorArr) {
  let hovered = isMouseInRect(btn.x, btn.y, btn.w, btn.h);
  let lift = hovered ? -2 : 0;

  noStroke();
  fill(darkColorArr[0], darkColorArr[1], darkColorArr[2], 220);
  rect(btn.x, btn.y + 7 + lift, btn.w, btn.h, 14);

  fill(bgColorArr[0], bgColorArr[1], bgColorArr[2]);
  rect(btn.x, btn.y + lift, btn.w, btn.h, 14);

  fill(255, 255, 255, 90);
  rect(btn.x + 8, btn.y + 6 + lift, btn.w - 16, 10, 8);

  fill(...COLORS.title);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(18);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2 + lift);
}

function drawSoftPanel(x, y, w, h, r) {
  noStroke();
  fill(...COLORS.shadow);
  rect(x + 10, y + 14, w, h, r);

  fill(...COLORS.panel);
  rect(x, y, w, h, r);

  fill(255, 255, 255, 120);
  rect(x + 12, y + 10, w - 24, 20, 12);

  stroke(...COLORS.panelEdge);
  strokeWeight(2);
  noFill();
  rect(x + 1, y + 1, w - 2, h - 2, r - 1);
  noStroke();
}

function drawRaisedCard(x, y, w, h, baseColor, r, shadowAlpha) {
  noStroke();
  fill(120, 130, 170, shadowAlpha);
  rect(x + 6, y + 10, w, h, r);

  if (typeof baseColor === "number") {
    fill(baseColor);
  } else {
    fill(baseColor, baseColor, baseColor);
  }
  rect(x, y, w, h, r);

  fill(255, 255, 255, 90);
  rect(x + 10, y + 8, w - 20, 14, 10);
}

function drawInnerCard(x, y, w, h, theme, title) {
  noStroke();
  fill(120, 130, 170, 22);
  rect(x + 5, y + 8, w, h, 20);

  fill(theme[0], theme[1], theme[2], 150);
  rect(x, y, w, h, 20);

  fill(255, 255, 255, 90);
  rect(x + 10, y + 8, w - 20, 14, 10);

  fill(...COLORS.title);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(18);
  text(title, x + 16, y + 15);
}

function drawMiniBadge(x, y, w, h, label) {
  noStroke();
  fill(255, 255, 255, 120);
  rect(x, y + 4, w, h, 14);
  fill(230, 236, 255, 220);
  rect(x, y, w, h, 14);

  fill(...COLORS.title);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(14);
  text(label, x + w / 2, y + h / 2);
}

function drawPlasticIllustration(cx, cy) {
  noStroke();

  fill(180, 220, 255, 120);
  ellipse(cx, cy + 110, 240, 70);

  fill(...COLORS.blue);
  ellipse(cx - 55, cy + 10, 92, 92);
  fill(255, 255, 255, 80);
  ellipse(cx - 72, cy - 10, 28, 18);

  fill(...COLORS.peach);
  ellipse(cx + 35, cy + 26, 110, 110);
  fill(255, 255, 255, 80);
  ellipse(cx + 8, cy - 2, 34, 22);

  fill(...COLORS.mint);
  rect(cx - 115, cy + 70, 90, 56, 18);
  fill(...COLORS.lavender);
  rect(cx - 5, cy + 76, 115, 50, 18);

  fill(...COLORS.title);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(24);
  text("₩", cx - 55, cy + 12);
  text("↗", cx + 35, cy + 26);
}

function mousePressed() {
  if (gameScreen === "start") {
    handleStartScreenClick();
  } else if (gameScreen === "play") {
    handleGameScreenClick();
  } else if (gameScreen === "result") {
    handleResultScreenClick();
  }
}

function handleStartScreenClick() {
  if (isMouseInRect(buttons.start.x, buttons.start.y, buttons.start.w, buttons.start.h)) {
    gameScreen = "play";
    message = getCurrentPlayer().name + "의 턴입니다. 종목을 선택한 뒤 행동하세요.";
    addLog("게임이 시작되었습니다.");
  }
}

function handleGameScreenClick() {
  if (isMouseInRect(buttons.resetTop.x, buttons.resetTop.y, buttons.resetTop.w, buttons.resetTop.h)) {
    initGame();
    gameScreen = "start";
    return;
  }

  for (let i = 0; i < stockCards.length; i++) {
    let card = stockCards[i];
    if (isMouseInRect(card.x, card.y, card.w, card.h)) {
      selectedStockIndex = i;
      message = stocks[i].name + "이(가) 선택되었습니다.";
      return;
    }
  }

  if (isMouseInRect(buttons.buy.x, buttons.buy.y, buttons.buy.w, buttons.buy.h)) {
    handleBuyAction();
    return;
  }

  if (isMouseInRect(buttons.sell.x, buttons.sell.y, buttons.sell.w, buttons.sell.h)) {
    handleSellAction();
    return;
  }

  if (isMouseInRect(buttons.pass.x, buttons.pass.y, buttons.pass.w, buttons.pass.h)) {
    handlePassAction();
    return;
  }
}

function handleResultScreenClick() {
  if (isMouseInRect(buttons.restart.x, buttons.restart.y, buttons.restart.w, buttons.restart.h)) {
    initGame();
    gameScreen = "start";
  }
}

function handleBuyAction() {
  if (selectedStockIndex === -1) {
    message = "종목을 먼저 선택하세요.";
    return;
  }

  let stock = stocks[selectedStockIndex];
  let player = getCurrentPlayer();

  if (!canBuy(player, stock)) {
    message = "현금이 부족하여 매수할 수 없습니다.";
    addLog(player.name + "은(는) 현금이 부족하여 " + stock.name + " 매수에 실패했습니다.");
    return;
  }

  buyStock(stock.code);
  applyRandomEvent();
  updateAllAssets();
  advanceTurn();
}

function handleSellAction() {
  if (selectedStockIndex === -1) {
    message = "종목을 먼저 선택하세요.";
    return;
  }

  let stock = stocks[selectedStockIndex];
  let player = getCurrentPlayer();

  if (!canSell(player, stock.code)) {
    message = "보유한 주식이 없어 매도할 수 없습니다.";
    addLog(player.name + "은(는) 보유 수량이 없어 " + stock.name + " 매도에 실패했습니다.");
    return;
  }

  sellStock(stock.code);
  applyRandomEvent();
  updateAllAssets();
  advanceTurn();
}

function handlePassAction() {
  let player = getCurrentPlayer();
  addLog(player.name + "이(가) 이번 턴을 패스했습니다.");
  message = player.name + "이(가) 패스를 선택했습니다.";
  applyRandomEvent();
  updateAllAssets();
  advanceTurn();
}

function buyStock(stockCode) {
  let player = getCurrentPlayer();
  let stock = getStockByCode(stockCode);

  player.cash -= stock.price;
  player.stocksOwned[stockCode] += 1;

  addLog(player.name + "이(가) " + stock.name + " 1주를 매수했습니다.");
  message = player.name + "이(가) " + stock.name + "을(를) 매수했습니다.";
}

function sellStock(stockCode) {
  let player = getCurrentPlayer();
  let stock = getStockByCode(stockCode);

  player.cash += stock.price;
  player.stocksOwned[stockCode] -= 1;

  addLog(player.name + "이(가) " + stock.name + " 1주를 매도했습니다.");
  message = player.name + "이(가) " + stock.name + "을(를) 매도했습니다.";
}

function canBuy(player, stock) {
  return player.cash >= stock.price;
}

function canSell(player, stockCode) {
  return player.stocksOwned[stockCode] > 0;
}

function applyRandomEvent() {
  let eventData = random(events);

  if (eventData.target === "ALL") {
    for (let stock of stocks) {
      changeStockPrice(stock, eventData.change);
    }
  } else {
    let targetStock = getStockByCode(eventData.target);
    if (targetStock) {
      changeStockPrice(targetStock, eventData.change);
    }
  }

  addLog("시장 이벤트: " + eventData.title + " - " + eventData.description);
  message = "이벤트 발생: " + eventData.title + " / " + eventData.description;
}

function changeStockPrice(stock, amount) {
  stock.price += amount;
  clampStockPrice(stock);
}

function clampStockPrice(stock) {
  if (stock.price < stock.minPrice) {
    stock.price = stock.minPrice;
  }
  if (stock.price > stock.maxPrice) {
    stock.price = stock.maxPrice;
  }
}

function getCurrentPlayer() {
  return players[currentPlayerIndex];
}

function getStockByCode(code) {
  for (let stock of stocks) {
    if (stock.code === code) {
      return stock;
    }
  }
  return null;
}

function updateAllAssets() {
  for (let player of players) {
    player.totalAsset = calculatePlayerAsset(player);
  }
}

function calculatePlayerAsset(player) {
  let stockValue = 0;

  for (let stock of stocks) {
    stockValue += player.stocksOwned[stock.code] * stock.price;
  }

  return player.cash + stockValue;
}

function advanceTurn() {
  selectedStockIndex = -1;

  if (currentPlayerIndex < players.length - 1) {
    currentPlayerIndex++;
  } else {
    currentPlayerIndex = 0;
    round++;
  }

  if (checkGameEnd()) {
    endGame();
    return;
  }

  message = getCurrentPlayer().name + "의 턴입니다. 종목을 선택한 뒤 행동하세요.";
}

function checkGameEnd() {
  return round > maxRound;
}

function endGame() {
  updateAllAssets();
  winnerList = [...players].sort((a, b) => b.totalAsset - a.totalAsset);
  gameScreen = "result";
  addLog("게임이 종료되었습니다.");
}

function addLog(text) {
  logs.unshift(text);
  trimLogs();
}

function trimLogs() {
  while (logs.length > 4) {
    logs.pop();
  }
}

function shortenText(str, maxLen) {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen) + "...";
}

function isMouseInRect(x, y, w, h) {
  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
}

function formatMoney(value) {
  return value.toLocaleString("ko-KR") + "원";
}
