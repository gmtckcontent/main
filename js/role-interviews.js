/**
 * Role interview data + single HTML template for all role interviews.
 *
 * 데이터 모델 (담당 = 역할 1개)
 *   - 담당(역할) 하나당 인터뷰는 보통 1건이다. (예: BECA Body → interviewId "beca-body" 1개)
 *   - interviewContent[interviewId] = 그 인터뷰 1건; questions[] = 그 인터뷰 안의 질문·답변 목록(5문항 등)
 *   - 예외: VE 본부는 같은 담당(role)에 여러 명(ve1.png, ve2.png …)이 있을 수 있고,
 *     interviewId는 ve-{roleId}-1, ve-{roleId}-2 … 형태로 여러 섹션(캐러셀)이 된다.
 *   - 예외: EE의 System & Product Investigation은 EE1a.png, EE1b.png … / interviewId ee-system-investigation-1, -2 … (our-story.html 캐러셀).
 *   - 예외: EE Validation Division은 EE2.png, EE2b.png … / interviewId ee-verification-1, -2 … (동일 캐러셀).
 *
 * Edit here only:
 *   - interviewData: 프로필 이미지·인사말,interviewId(섹션 id). 담당 1개당 보통 행 1개(VE는 여러 행 가능)
 *   - profileImage: 선택. `./images/profilepic/beca/body.png` 처럼 키 파일명과 다른 경로를 쓸 때
 *   - interviewContent: interviewId별 Q&A (BECA/ITPE/S&S는 data/interview-content-beca-itpe-ss.json, VE 다인 인터뷰는 data/interview-content-ve.json)
 *
 * 정적 마운트(data-role-interview-mount) ↔ 소스
 *   - JS interviewContent: avd-*, pipg-psc, pipg-vpd-pid, pipg-thermal, pipg-pgtlo, ve-*
 *   - JSON 병합: beca-*, itpe-*, ss-* (파일 interview-content-beca-itpe-ss.json)
 *
 * Layout/markup is created only by createInterviewSection() so the grid, VE
 * carousel, and static sections (data-role-interview-mount in HTML) stay identical.
 */
// Interview data - 이미지 파일명과 담당 정보 매핑
// 새로운 이미지 추가 시 여기에만 추가하면 자동으로 표시됨
// 프로필 사진 미업로드 시 로고로 대체 (404 방지). 실제 사진 추가 후 profileFallback 제거
const PROFILE_PLACEHOLDER_IMAGE =
  "./images/logo/gm-symbol-color-light-bg-web.png";

/** 프로필 PNG 교체 후에도 캐시된 옛 이미지가 보이지 않도록 URL에 버전을 붙임 (교체 배포 시 숫자만 올리면 됨) */
const PROFILE_IMAGE_CACHE_VERSION = "8";
function withProfileImageCacheBust(url) {
  if (!url || url.startsWith("data:")) return url;
  if (/\bpv=\d+\b/.test(url)) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}pv=${PROFILE_IMAGE_CACHE_VERSION}`;
}

/** Our Story 히어로 모자이크: `images/profilepic-mosaic/*.jpg` (256px, scripts/build-profilepic-mosaic.sh) */
const MOSAIC_THUMB_VERSION = "1";
function toHqLandingMosaicThumbUrl(url) {
  if (!url || typeof url !== "string") {
    return url;
  }
  if (url.indexOf("gm-symbol") !== -1) {
    return url;
  }
  const q = url.indexOf("?");
  const base = q >= 0 ? url.slice(0, q) : url;
  const needle = "/images/profilepic/";
  const idx = base.indexOf(needle);
  if (idx === -1) {
    return url;
  }
  const head = base.slice(0, idx);
  const tail = base.slice(idx + needle.length);
  const stem = tail.replace(/\.(png|jpe?g|webp)$/i, "");
  if (!tail || stem === tail) {
    return url;
  }
  return `${head}/images/profilepic-mosaic/${stem}.jpg?mv=${MOSAIC_THUMB_VERSION}`;
}
window.toHqLandingMosaicThumbUrl = toHqLandingMosaicThumbUrl;

/** 인터뷰 히어로 배경 — `images/formula_pic/` 전체 에셋 (추가 시 파일명만 이 배열에 넣으면 랜덤 풀에 포함) */
const FORMULA_PIC_BACKGROUNDS = [
  "26CDF1CD070035_CadillacF1Team_6206_HiRes.jpg",
  "26CDF1CD070037_CadillacF1Team_6230_HiRes.jpg",
  "26CDF1CD070038_CadillacF1Team_6237_HiRes.jpg",
  "26CDF1CD070044_CadillacF1Team_6480_HiRes.jpg",
  "26CDF1CD070046_MP0_0673_sRbdNnvl_20260327061117.JPG",
  "26CDF1CD070048_MP0_2856_n4FJ6BVv_20260327083912.JPG",
  "26CDF1CD070060_MP9_4663_WG72VVZX_20260328082833.png",
  "26CDF1CD7153 - CadillacF1Team_2715_HiRes.jpg",
];

/** 웹용 배경 — `images/formula_pic-web/` (1920px JPEG, scripts/build-formula-pic-web.sh) */
const FORMULA_PIC_WEB_VERSION = "1";

/** 히어로마다 위 목록 중 하나를 무작위로 선택 (파일명 공백 등은 URL 인코딩) */
function getFormulaPicBackgroundUrl() {
  const files = FORMULA_PIC_BACKGROUNDS;
  if (!files.length) return "";
  const idx = Math.floor(Math.random() * files.length);
  const file = files[idx];
  const base = file.replace(/\.(png|jpe?g|webp|JPG|PNG|JPEG)$/i, "");
  const webFile = `${base}.jpg`;
  return `./images/formula_pic-web/${encodeURIComponent(webFile)}?fv=${FORMULA_PIC_WEB_VERSION}`;
}

/** `images/profilepic` 하위 경로 — 폴더/파일명의 공백,& 등은 URL 인코딩 */
function profilePicRel(parts) {
  return (
    "./images/profilepic/" +
    parts.map((p) => encodeURIComponent(String(p))).join("/")
  );
}

const interviewData = {
  // VE 본부
  "ve1.png": {
    profileImage: profilePicRel(["ve", "safety performance integration1.png"]),
    hq: "VE",
    role: "Safety Performance Integration",
    roleKr: "Safety Performance Integration",
    roleEn: "Safety Performance Integration",
    name: "조영진",
    nameKr: "조영진",
    nameEn: "Youngjin Cho",
    greeting:
      "안녕하세요\nVE본부의 Safety Performance Integration담당\n조영진입니다",
    greetingKr:
      "안녕하세요\nVE본부의 Safety Performance Integration담당\n조영진입니다",
    greetingEn: "Hello\nSafety Performance Integration, VE HQ\nYoungjin Cho",
  },
  "ve2.png": {
    profileImage: profilePicRel(["ve", "safety performance integration2.png"]),
    hq: "VE",
    role: "Safety Performance Integration",
    roleKr: "Safety Performance Integration",
    roleEn: "Safety Performance Integration",
    name: "한재녕",
    nameKr: "한재녕",
    nameEn: "Jaenyung Han",
    greeting:
      "안녕하세요\nVE본부의 Safety Performance Integration담당\n한재녕입니다",
    greetingKr:
      "안녕하세요\nVE본부의 Safety Performance Integration담당\n한재녕입니다",
    greetingEn: "Hello\nSafety Performance Integration, VE HQ\nJaenyung Han",
  },
  "ve3.png": {
    profileImage: profilePicRel([
      "ve",
      "vIrtual integration center adas 1.png",
    ]),
    hq: "VE",
    role: "Virtual Integration Center & ADAS",
    roleKr: "Virtual Integration Center & ADAS",
    roleEn: "Virtual Integration Center & ADAS",
    name: "김남준",
    nameKr: "김남준",
    nameEn: "Namjun (NJ) Kim",
    greeting:
      "안녕하세요\nVE본부의 Virtual Integration Center & ADAS담당\n김남준입니다",
    greetingKr:
      "안녕하세요\nVE본부의 Virtual Integration Center & ADAS담당\n김남준입니다",
    greetingEn:
      "Hello\nVirtual Integration Center & ADAS, VE HQ\nNamjun (NJ) Kim",
  },
  "ve4.png": {
    profileImage: profilePicRel([
      "ve",
      "virtual integration center adas 2.png",
    ]),
    hq: "VE",
    role: "Virtual Integration Center & ADAS",
    roleKr: "Virtual Integration Center & ADAS",
    roleEn: "Virtual Integration Center & ADAS",
    name: "천재희",
    nameKr: "천재희",
    nameEn: "Jaehee Cheon",
    greeting:
      "안녕하세요\nVE본부의 Virtual Integration Center & ADAS담당\n천재희입니다",
    greetingKr:
      "안녕하세요\nVE본부의 Virtual Integration Center & ADAS담당\n천재희입니다",
    greetingEn: "Hello\nVirtual Integration Center & ADAS, VE HQ\nJaehee Cheon",
  },
  "ve5.png": {
    profileImage: profilePicRel([
      "ve",
      "virtual integration center adas 3.png",
    ]),
    hq: "VE",
    role: "Virtual Integration Center & ADAS",
    roleKr: "Virtual Integration Center & ADAS",
    roleEn: "Virtual Integration Center & ADAS",
    name: "정상효",
    nameKr: "정상효",
    nameEn: "Sanghyo Jung",
    greeting:
      "안녕하세요\nVE본부의 Virtual Integration Center & ADAS담당\n정상효입니다",
    greetingKr:
      "안녕하세요\nVE본부의 Virtual Integration Center & ADAS담당\n정상효입니다",
    greetingEn: "Hello\nVirtual Integration Center & ADAS, VE HQ\nSanghyo Jung",
  },
  "ve6.png": {
    profileImage: profilePicRel(["ve", "virtual engineering solution1.png"]),
    hq: "VE",
    role: "Virtual Engineering Solution",
    roleKr: "Virtual Engineering Solution",
    roleEn: "Virtual Engineering Solution",
    name: "정행만",
    nameKr: "정행만",
    nameEn: "Haengmaan Jeong",
    greeting:
      "안녕하세요\nVE본부의 Virtual Engineering Solution담당\n정행만입니다",
    greetingKr:
      "안녕하세요\nVE본부의 Virtual Engineering Solution담당\n정행만입니다",
    greetingEn: "Hello\nVirtual Engineering Solution, VE HQ\nHaengmaan Jeong",
  },
  "ve7.png": {
    profileImage: profilePicRel(["ve", "virtual engineering solution2.png"]),
    hq: "VE",
    role: "Virtual Engineering Solution",
    roleKr: "Virtual Engineering Solution",
    roleEn: "Virtual Engineering Solution",
    name: "황순재",
    nameKr: "황순재",
    nameEn: "Soonjae Hwang",
    greeting:
      "안녕하세요\nVE본부의 Virtual Engineering Solution담당\n황순재입니다",
    greetingKr:
      "안녕하세요\nVE본부의 Virtual Engineering Solution담당\n황순재입니다",
    greetingEn: "Hello\nVirtual Engineering Solution, VE HQ\nSoonjae Hwang",
  },
  "ve8.png": {
    profileImage: profilePicRel(["ve", "virtual engineering solution3.png"]),
    hq: "VE",
    role: "Virtual Engineering Solution",
    roleKr: "Virtual Engineering Solution",
    roleEn: "Virtual Engineering Solution",
    name: "김민정",
    nameKr: "김민정",
    nameEn: "Minjung Kim",
    greeting:
      "안녕하세요\nVE본부의 Virtual Engineering Solution담당\n김민정입니다",
    greetingKr:
      "안녕하세요\nVE본부의 Virtual Engineering Solution담당\n김민정입니다",
    greetingEn: "Hello\nVirtual Engineering Solution, VE HQ\nMinjung Kim",
  },
  // AVD & SVI 본부
  "avd1.png": {
    profileImage: profilePicRel(["avd&svi", "avd.png"]),
    hq: "AVD & SVI",
    role: "Advanced Vehicle Development",
    roleKr: "Advanced Vehicle Development",
    roleEn: "Advanced Vehicle Development",
    name: "김성수",
    nameKr: "김성수",
    nameEn: "Seongsu Kim",
    greeting:
      "안녕하세요\nAVD & SVI본부의 Advanced Vehicle Development담당\n김성수입니다",
    greetingKr:
      "안녕하세요\nAVD & SVI본부의 Advanced Vehicle Development담당\n김성수입니다",
    greetingEn:
      "Hello\nAdvanced Vehicle Development, AVD & SVI HQ\nSeongsu Kim",
    interviewId: "avd-advanced-vehicle", // 기존 인터뷰 섹션 ID
  },
  "svi1.png": {
    profileImage: profilePicRel(["avd&svi", "svi.png"]),
    hq: "AVD & SVI",
    role: "Studio & Surface Integration",
    roleKr: "Studio & Surface Integration",
    roleEn: "Studio & Surface Integration",
    name: "이정원",
    nameKr: "이정원",
    nameEn: "Jeongwon Lee",
    greeting:
      "안녕하세요\nAVD & SVI본부의 Studio & Surface Integration담당\n이정원입니다",
    greetingKr:
      "안녕하세요\nAVD & SVI본부의 Studio & Surface Integration담당\n이정원입니다",
    greetingEn:
      "Hello\nStudio & Surface Integration, AVD & SVI HQ\nJeongwon Lee",
    interviewId: "avd-studio-surface", // 기존 인터뷰 섹션 ID
  },
  // PIPG 본부
  "PIPG1.png": {
    profileImage: "./images/profilepic/pipg/psc.png",
    hq: "PIPG",
    role: "PSC",
    roleKr: "PSC",
    roleEn: "PSC",
    name: "이재혁",
    nameKr: "이재혁",
    nameEn: "Jaehyeok Lee",
    greeting:
      "안녕하세요\nPIPG본부의 Propulsion System Calibration담당\n이재혁입니다",
    greetingKr:
      "안녕하세요\nPIPG본부의 Propulsion System Calibration담당\n이재혁입니다",
    greetingEn: "Hello\nPropulsion System Calibration, PIPG HQ\nJaehyeok Lee",
    interviewId: "pipg-psc", // 기존 인터뷰 섹션 ID
  },
  "PIPG2.png": {
    profileImage: "./images/profilepic/pipg/vpdpid.png",
    hq: "PIPG",
    role: "VPD/PID",
    roleKr: "VPD/PID",
    roleEn: "VPD/PID",
    name: "우성근",
    nameKr: "우성근",
    nameEn: "Sunggeun Woo",
    greeting: "안녕하세요\nPIPG본부의 VPD/PID담당\n우성근입니다",
    greetingKr: "안녕하세요\nPIPG본부의 VPD/PID담당\n우성근입니다",
    greetingEn: "Hello\nVPD/PID, PIPG HQ\nSunggeun Woo",
    interviewId: "pipg-vpd-pid", // 기존 인터뷰 섹션 ID
  },
  "PIPG3.png": {
    profileImage: "./images/profilepic/pipg/thermal_new.png",
    hq: "PIPG",
    role: "Thermal",
    roleKr: "Thermal",
    roleEn: "Thermal",
    name: "이원익",
    nameKr: "이원익",
    nameEn: "Wonik Lee",
    greeting: "안녕하세요\nPIPG본부의 Thermal담당\n이원익입니다",
    greetingKr: "안녕하세요\nPIPG본부의 Thermal담당\n이원익입니다",
    greetingEn: "Hello\nThermal, PIPG HQ\nWonik Lee",
    interviewId: "pipg-thermal",
  },
  "PIPG4.png": {
    profileImage: "./images/profilepic/pipg/pgtlo_new.png",
    hq: "PIPG",
    role: "PGTLO",
    roleKr: "PGTLO",
    roleEn: "PGTLO",
    name: "장형규",
    nameKr: "장형규",
    nameEn: "Hyunggyu Chang",
    greeting: "안녕하세요\nPIPG본부의 PGTLO담당\n장형규입니다",
    greetingKr: "안녕하세요\nPIPG본부의 PGTLO담당\n장형규입니다",
    greetingEn: "Hello\nPGTLO, PIPG HQ\nHyunggyu Chang",
    interviewId: "pipg-pgtlo",
  },
  // BECA — images/BECA1.png … 프로필 사진 추가 시 전체보기 그리드에 자동 표시
  "BECA1.png": {
    profileImage: "./images/profilepic/beca/body.png",
    hq: "BECA",
    role: "Body",
    roleKr: "Body",
    roleEn: "Body",
    name: "안영현",
    nameKr: "안영현",
    nameEn: "Younghyun Ahn",
    greeting: "안녕하세요\nBECA본부의 Body담당\n안영현입니다",
    greetingKr: "안녕하세요\nBECA본부의 Body담당\n안영현입니다",
    greetingEn: "Hello\nBody, BECA HQ\nYounghyun Ahn",
    interviewId: "beca-body",
  },
  "BECA2.png": {
    profileImage: "./images/profilepic/beca/Exterior.png",
    hq: "BECA",
    role: "Exterior",
    roleKr: "Exterior",
    roleEn: "Exterior",
    name: "임정란",
    nameKr: "임정란",
    nameEn: "Jungran Lim",
    greeting: "안녕하세요\nBECA본부의 Exterior담당\n임정란입니다",
    greetingKr: "안녕하세요\nBECA본부의 Exterior담당\n임정란입니다",
    greetingEn: "Hello\nExterior, BECA HQ\nJungran Lim",
    interviewId: "beca-exterior",
  },
  "BECA3.png": {
    profileImage: "./images/profilepic/beca/Chassis.png",
    hq: "BECA",
    role: "Chassis",
    roleKr: "Chassis",
    roleEn: "Chassis",
    name: "신숙형",
    nameKr: "신숙형",
    nameEn: "Sookhyoung Shin",
    greeting: "안녕하세요\nBECA본부의 Chassis담당\n신숙형입니다",
    greetingKr: "안녕하세요\nBECA본부의 Chassis담당\n신숙형입니다",
    greetingEn: "Hello\nChassis, BECA HQ\nSookhyoung Shin",
    interviewId: "beca-chassis",
  },
  "BECA4.png": {
    profileImage: "./images/profilepic/beca/Aftersales.png",
    hq: "BECA",
    role: "Aftersales",
    roleKr: "Aftersales",
    roleEn: "Aftersales",
    name: "이진영",
    nameKr: "이진영",
    nameEn: "Jinyoung Lee",
    greeting: "안녕하세요\nBECA본부의 Aftersales담당\n이진영입니다",
    greetingKr: "안녕하세요\nBECA본부의 Aftersales담당\n이진영입니다",
    greetingEn: "Hello\nAftersales, BECA HQ\nJinyoung Lee",
    interviewId: "beca-aftersales",
  },
  // ITPE
  "ITPE1.png": {
    profileImage: "./images/profilepic/itpe/interior-trim.png",
    hq: "ITPE",
    role: "Interior Trim",
    roleKr: "Interior Trim",
    roleEn: "Interior Trim",
    name: "남궁태현",
    nameKr: "남궁태현",
    nameEn: "Taehyun Namgung",
    greeting: "안녕하세요\nITPE본부의 Interior Trim담당\n남궁태현입니다",
    greetingKr: "안녕하세요\nITPE본부의 Interior Trim담당\n남궁태현입니다",
    greetingEn: "Hello\nInterior Trim, ITPE HQ\nTaehyun Namgung",
    interviewId: "itpe-interior-trim",
  },
  "ITPE2.png": {
    profileImage: "./images/profilepic/itpe/seat-safety-restraints.png",
    hq: "ITPE",
    role: "Seat & Safety Restraints",
    roleKr: "Seat & Safety Restraints",
    roleEn: "Seat & Safety Restraints",
    name: "연지은",
    nameKr: "연지은",
    nameEn: "Jieun Yeon",
    greeting:
      "안녕하세요\nITPE본부의 Seat & Safety Restraints 담당\n연지은입니다",
    greetingKr:
      "안녕하세요\nITPE본부의 Seat & Safety Restraints 담당\n연지은입니다",
    greetingEn: "Hello\nSeat & Safety Restraints, ITPE HQ\nJieun Yeon",
    interviewId: "itpe-seat-safety",
  },
  "ITPE3.png": {
    profileImage: "./images/profilepic/itpe/thermal-propulsion-integration.png",
    hq: "ITPE",
    role: "Thermal & Propulsion Integration",
    roleKr: "Thermal & Propulsion Integration",
    roleEn: "Thermal & Propulsion Integration",
    name: "이우종",
    nameKr: "이우종",
    nameEn: "Woojong Lee",
    greeting:
      "안녕하세요\nITPE본부의 Thermal & Propulsion Integration담당\n이우종입니다",
    greetingKr:
      "안녕하세요\nITPE본부의 Thermal & Propulsion Integration담당\n이우종입니다",
    greetingEn: "Hello\nThermal & Propulsion Integration, ITPE HQ\nWoojong Lee",
    interviewId: "itpe-thermal-propulsion",
  },
  "ITPE4.png": {
    profileImage: "./images/profilepic/itpe/ecs-itpe.png",
    hq: "ITPE",
    role: "ECS",
    roleKr: "ECS",
    roleEn: "ECS",
    name: "서문찬",
    nameKr: "서문찬",
    nameEn: "Moonchan Seo",
    greeting:
      "안녕하세요\nITPE본부의 ECS(Energy Conversion Systems) 담당\n서문찬입니다",
    greetingKr:
      "안녕하세요\nITPE본부의 ECS(Energy Conversion Systems) 담당\n서문찬입니다",
    greetingEn: "Hello\nEnergy Conversion Systems (ECS), ITPE HQ\nMoonchan Seo",
    interviewId: "itpe-ecs",
  },
  // S&S (Software & Services) — images/profilepic/s&s/ (URL 경로는 & → %26)
  "SS1.png": {
    profileImage: "./images/profilepic/s%26s/cchppmo.png",
    hq: "S&S",
    role: "CCH/PPMO",
    roleKr: "CCH/PPMO",
    roleEn: "CCH/PPMO",
    name: "김경찬",
    nameKr: "김경찬",
    nameEn: "Kyungchan Kim",
    greeting: "안녕하세요\nS&S본부의 CCH/PPMO담당\n김경찬입니다",
    greetingKr: "안녕하세요\nS&S본부의 CCH/PPMO담당\n김경찬입니다",
    greetingEn: "Hello\nCCH/PPMO, Software & Services HQ\nKyungchan Kim",
    interviewId: "ss-cch-ppmo",
  },
  "SS2.png": {
    profileImage: "./images/profilepic/s%26s/maec.png",
    hq: "S&S",
    role: "MAEC",
    roleKr: "MAEC",
    roleEn: "MAEC",
    name: "정묘신",
    nameKr: "정묘신",
    nameEn: "Myosin Jung",
    greeting: "안녕하세요\nS&S본부의 MAEC담당\n정묘신입니다",
    greetingKr: "안녕하세요\nS&S본부의 MAEC담당\n정묘신입니다",
    greetingEn: "Hello\nMAEC, Software & Services HQ\nMyosin Jung",
    interviewId: "ss-maec",
  },
  "SS3.png": {
    profileImage: "./images/profilepic/s%26s/swqnd.png",
    hq: "S&S",
    role: "SWQnD",
    roleKr: "SWQnD",
    roleEn: "SWQnD",
    name: "양혜영",
    nameKr: "양혜영",
    nameEn: "Hyeyoung Yang",
    greeting: "안녕하세요\nS&S본부의 SWQnD담당\n양혜영입니다",
    greetingKr: "안녕하세요\nS&S본부의 SWQnD담당\n양혜영입니다",
    greetingEn: "Hello\nSWQnD, Software & Services HQ\nHyeyoung Yang",
    interviewId: "ss-swqnd",
  },
  "EE1a.png": {
    profileImage: profilePicRel(["EE", "system&product(1).png"]),
    hq: "Engineering Excellence",
    role: "Systems & Product Investigation Division",
    roleKr: "System & Product Investigation",
    roleEn: "Systems & Product Investigation Division",
    name: "윤애진",
    nameKr: "윤애진",
    nameEn: "Aejin Yun",
    greeting:
      "안녕하세요\nEngineering Excellence의 System & Product Investigation담당\n윤애진입니다",
    greetingKr:
      "안녕하세요\nEngineering Excellence의 System & Product Investigation담당\n윤애진입니다",
    greetingEn:
      "Hello\nSystems & Product Investigation, Engineering Excellence HQ\nAejin Yun",
    interviewId: "ee-system-investigation-1",
  },
  "EE1b.png": {
    profileImage: profilePicRel(["EE", "system&product(2).png"]),
    hq: "Engineering Excellence",
    role: "Systems & Product Investigation Division",
    roleKr: "System & Product Investigation",
    roleEn: "Systems & Product Investigation Division",
    name: "권민들",
    nameKr: "권민들",
    nameEn: "Mindeul Kwon",
    greeting:
      "안녕하세요\nEngineering Excellence의 System & Product Investigation담당\n권민들입니다",
    greetingKr:
      "안녕하세요\nEngineering Excellence의 System & Product Investigation담당\n권민들입니다",
    greetingEn:
      "Hello\nSystems & Product Investigation, Engineering Excellence HQ\nMindeul Kwon",
    interviewId: "ee-system-investigation-2",
  },
  "EE0.png": {
    profileImage: profilePicRel(["EE", "certification, envrionment(1).png"]),
    hq: "Engineering Excellence",
    role: "Certification, Environmental Strategy & EI Division",
    roleKr: "Certification, Environmental Strategy & EI",
    roleEn: "Certification, Environmental Strategy & EI Division",
    name: "정건모",
    nameKr: "정건모",
    nameEn: "Gunmo Jeong",
    greeting:
      "안녕하세요\nEngineering Excellence의 Certification, Environmental Strategy & EI담당\n정건모입니다",
    greetingKr:
      "안녕하세요\nEngineering Excellence의 Certification, Environmental Strategy & EI담당\n정건모입니다",
    greetingEn:
      "Hello\nCertification, Environmental Strategy & EI Division, Engineering Excellence HQ\nGunmo Jeong",
    interviewId: "ee-certification",
  },
  "EE2.png": {
    profileImage: profilePicRel(["EE", "validation.png"]),
    hq: "Engineering Excellence",
    role: "Validation Division",
    roleKr: "Validation",
    roleEn: "Validation Division",
    name: "김경태",
    nameKr: "김경태",
    nameEn: "Kyungtae Kim",
    greeting:
      "안녕하세요\nEngineering Excellence의 Validation담당\n김경태입니다",
    greetingKr:
      "안녕하세요\nEngineering Excellence의 Validation담당\n김경태입니다",
    greetingEn:
      "Hello\nValidation Division, Engineering Excellence HQ\nKyungtae Kim",
    interviewId: "ee-verification-1",
  },
  "EE2b.png": {
    profileImage: profilePicRel(["EE", "validation(2).png"]),
    profileFallback: profilePicRel(["EE", "validation.png"]),
    hq: "Engineering Excellence",
    role: "Validation Division",
    roleKr: "Validation",
    roleEn: "Validation Division",
    name: "강수연",
    nameKr: "강수연",
    nameEn: "Sooyeon Kang",
    greeting:
      "안녕하세요\nEngineering Excellence의 Validation담당\n강수연입니다",
    greetingKr:
      "안녕하세요\nEngineering Excellence의 Validation담당\n강수연입니다",
    greetingEn:
      "Hello\nValidation Division, Engineering Excellence HQ\nSooyeon Kang",
    interviewId: "ee-verification-2",
  },
  "EE3.png": {
    profileImage: profilePicRel(["EE", "product excellence.png"]),
    hq: "Engineering Excellence",
    role: "Product Excellence",
    roleKr: "Product Excellence",
    roleEn: "Product Excellence",
    name: "이가연",
    nameKr: "이가연",
    nameEn: "Gayeon Lee",
    greeting:
      "안녕하세요\nEngineering Excellence의 Product Excellence담당\n이가연입니다",
    greetingKr:
      "안녕하세요\nEngineering Excellence의 Product Excellence담당\n이가연입니다",
    greetingEn:
      "Hello\nProduct Excellence, Engineering Excellence HQ\nGayeon Lee",
    interviewId: "ee-product-excellence",
  },
  "EE4.png": {
    profileImage: profilePicRel(["EE", "PQDQ.png"]),
    hq: "Engineering Excellence",
    role: "PQDQ Engineering Excellence",
    roleKr: "PQDQ Engineering Excellence",
    roleEn: "PQDQ Engineering Excellence",
    name: "조성현",
    nameKr: "조성현",
    nameEn: "Sunghyun Cho",
    greeting:
      "안녕하세요\nEngineering Excellence의 PQDQ Engineering Excellence담당\n조성현입니다",
    greetingKr:
      "안녕하세요\nEngineering Excellence의 PQDQ Engineering Excellence담당\n조성현입니다",
    greetingEn:
      "Hello\nPQDQ Engineering Excellence, Engineering Excellence HQ\nSunghyun Cho",
    interviewId: "ee-quality",
  },
  "EE5.png": {
    profileImage: profilePicRel(["EE", "ai chief_new.png"]),
    hq: "Engineering Excellence",
    role: "Chief AI & New Tech. Strategy",
    roleKr: "Chief AI & New Tech. Strategy",
    roleEn: "Chief AI & New Tech. Strategy",
    name: "신호재",
    nameKr: "신호재",
    nameEn: "Hojae Shin",
    greeting:
      "안녕하세요\nEngineering Excellence의 Chief AI & New Tech. Strategy담당\n신호재입니다",
    greetingKr:
      "안녕하세요\nEngineering Excellence의 Chief AI & New Tech. Strategy담당\n신호재입니다",
    greetingEn:
      "Hello\nChief AI & New Tech. Strategy, Engineering Excellence HQ\nHojae Shin",
    interviewId: "ee-ai-chief",
  },
};

// 인터뷰 내용: interviewId(담당)당 객체 1개. questions = 그 인터뷰 1건의 문항들.
// BECA / ITPE / S&S 본문은 data/interview-content-beca-itpe-ss.json (담당당 인터뷰 1건, VE 제외)
// EE 일부 본문은 data/interview-content-ee.json
// JSON 수정 후 배포 시 ?v= 숫자 올려 캐시 무력화 (CDN,프록시 대비)
const INTERVIEW_CONTENT_BECA_ITPE_SS_URL =
  "./data/interview-content-beca-itpe-ss.json?v=14";
const INTERVIEW_CONTENT_EE_URL = "./data/interview-content-ee.json?v=13";
const INTERVIEW_CONTENT_VE_URL = "./data/interview-content-ve.json?v=6";

async function loadInterviewContentBecaItpeSs() {
  /* URL ?v= 으로 배포 시 무력화; default 캐시로 재방문·이미지와 경합 완화 */
  const res = await fetch(INTERVIEW_CONTENT_BECA_ITPE_SS_URL, {
    cache: "default",
  });
  if (!res.ok) {
    console.warn("[role-interviews] BECA/ITPE/S&S JSON 로드 실패:", res.status);
    return;
  }
  const extra = await res.json();
  Object.assign(interviewContent, extra);
}

async function loadInterviewContentEe() {
  const res = await fetch(INTERVIEW_CONTENT_EE_URL, { cache: "default" });
  if (!res.ok) {
    console.warn("[role-interviews] EE JSON 로드 실패:", res.status);
    return;
  }
  Object.assign(interviewContent, await res.json());
}

async function loadInterviewContentVe() {
  const res = await fetch(INTERVIEW_CONTENT_VE_URL, { cache: "default" });
  if (!res.ok) {
    console.warn("[role-interviews] VE JSON 로드 실패:", res.status);
    return;
  }
  Object.assign(interviewContent, await res.json());
}

/** 한 번만 fetch·병합 — DOMContentLoaded 해시·showRole과 순서 레이스 방지 */
let interviewContentExtrasPromise = null;
function loadInterviewContentExtras() {
  if (!interviewContentExtrasPromise) {
    interviewContentExtrasPromise = (async () => {
      await Promise.all([
        loadInterviewContentBecaItpeSs(),
        loadInterviewContentEe(),
        loadInterviewContentVe(),
      ]);
    })();
  }
  return interviewContentExtrasPromise;
}
window.loadInterviewContentExtras = loadInterviewContentExtras;

const interviewContent = {
  "avd-advanced-vehicle": {
    questions: [
      {
        q: "AVD 담당은 어떤 일을 하는 곳인가요?",
        qKr: "AVD 담당은 어떤 일을 하는 곳인가요?",
        qEn: "What does the AVD department do?",
        a: "AVD(Advanced Vehicle Development) 담당은 차량 개발의 가장 초기 단계에서 아키텍처(Architecture)와 패키지(Package)를 기반으로 고객이 체감하는 차량의 기본기를 설계하고 기획하는 조직입니다. 우리는 단순히 차를 설계하는 수준을 넘어 혁신적인 아이디어와 프로젝트를 발굴하고 주도하며, GMTCK 전사의 혁신을 이끄는 'Innovation Hub' 역할을 수행하고 있습니다.",
        aKr: "AVD(Advanced Vehicle Development) 담당은 차량 개발의 가장 초기 단계에서 아키텍처(Architecture)와 패키지(Package)를 기반으로 고객이 체감하는 차량의 기본기를 설계하고 기획하는 조직입니다. 우리는 단순히 차를 설계하는 수준을 넘어 혁신적인 아이디어와 프로젝트를 발굴하고 주도하며, GMTCK 전사의 혁신을 이끄는 'Innovation Hub' 역할을 수행하고 있습니다.",
        aEn: "The AVD (Advanced Vehicle Development) department plans and designs the fundamental vehicle characteristics customers experience, based on Architecture and Package from the very earliest stage of development. We go beyond merely designing cars—we discover and lead innovative ideas and projects and serve as an “Innovation Hub” that drives innovation across GMTCK.",
      },
      {
        q: "AVD 담당은 고객에게 왜 중요한가요?",
        qKr: "AVD 담당은 고객에게 왜 중요한가요?",
        qEn: "Why is the AVD department important to customers?",
        a: `고객이 실제로 경험하는 주행거리, 공간감, 승차감, 그리고 안전과 가격에 대한 신뢰 같은 차량의 기본기와 상품성은 모두 AVD가 설계하는 아키텍처와 패키지에서 출발합니다. 한 번의 충전이나 주유로 얼마나 효율적으로 멀리 갈 수 있는지 결정하는 Propulsion 영역부터, 승객이 느끼는 시팅 포스처(seating posture)와 헤드룸, 레그룸을 포함한 종합적인 실내 경험까지 모두 우리의 손을 거칩니다. 또한 코너링과 주행 안정성, 정숙성 사이의 균형을 잡고 보이지 않는 차체 구조를 통해 충돌 성능과 안전에 대한 신뢰를 만들어내며, 고객이 지불한 가격 대비 최고의 가치를 누릴 수 있도록 합리적인 사양을 구성합니다. 이처럼 AVD는 성능과 안전, 공간과 가격 사이의 밸런스를 정교하게 조율하여 고객 가치와 브랜드 신뢰를 구축해 나가는 팀입니다.`,
        aKr: `고객이 실제로 경험하는 주행거리, 공간감, 승차감, 그리고 안전과 가격에 대한 신뢰 같은 차량의 기본기와 상품성은 모두 AVD가 설계하는 아키텍처와 패키지에서 출발합니다. 한 번의 충전이나 주유로 얼마나 효율적으로 멀리 갈 수 있는지 결정하는 Propulsion 영역부터, 승객이 느끼는 시팅 포스처(seating posture)와 헤드룸, 레그룸을 포함한 종합적인 실내 경험까지 모두 우리의 손을 거칩니다. 또한 코너링과 주행 안정성, 정숙성 사이의 균형을 잡고 보이지 않는 차체 구조를 통해 충돌 성능과 안전에 대한 신뢰를 만들어내며, 고객이 지불한 가격 대비 최고의 가치를 누릴 수 있도록 합리적인 사양을 구성합니다. 이처럼 AVD는 성능과 안전, 공간과 가격 사이의 밸런스를 정교하게 조율하여 고객 가치와 브랜드 신뢰를 구축해 나가는 팀입니다.`,
        aEn: `The fundamentals and appeal customers actually experience—range, sense of space, ride comfort, and trust in safety and price—all start from the Architecture and Package AVD designs. From Propulsion—how far you can efficiently travel on one charge or fill—to the overall interior experience, including seating posture, headroom, and legroom, everything passes through our hands. We also balance cornering, driving stability, and quietness, and through body structure customers cannot see we build crash performance and trust in safety; we structure rational specifications so customers get the greatest value for what they pay. In this way, AVD finely balances performance and safety, space and price to build customer value and brand trust.`,
      },
      {
        q: "AVD 담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "AVD 담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn: "What competencies do you think are necessary for AVD department work?",
        a: `이러한 업무를 수행하기 위해 AVD는 차량의 전체적인 '큰 그림(Big Picture)'을 설계하며 여러 조직을 하나의 방향으로 연결합니다. 따라서 아키텍처 전반을 아우르는 시야로 최적의 균형점을 찾는 시스템적 사고 능력과 디자인, 파워트레인, 제조, 안전 등 다양한 부서와 효과적으로 소통하는 협업 능력이 무엇보다 중요합니다. 특히 글로벌 벤치마킹과 데이터 분석을 통한 Customer & Market Insight를 바탕으로 고객 가치와 시장의 요구를 정확히 읽어내는 능력은 AVD의 필수적인 역량입니다. 우리는 전동화(Electrification)나 SDV(Software-Defined Vehicle) 같은 새로운 기술을 빠르게 이해하고, 새로운 패키징 아이디어를 스스로 탐색해 시험해 보는 도전적인 태도를 지향하며, 업무 방식을 더 효율적으로 만드는 추진력을 갖추고자 노력하고 있습니다.`,
        aKr: `이러한 업무를 수행하기 위해 AVD는 차량의 전체적인 '큰 그림(Big Picture)'을 설계하며 여러 조직을 하나의 방향으로 연결합니다. 따라서 아키텍처 전반을 아우르는 시야로 최적의 균형점을 찾는 시스템적 사고 능력과 디자인, 파워트레인, 제조, 안전 등 다양한 부서와 효과적으로 소통하는 협업 능력이 무엇보다 중요합니다. 특히 글로벌 벤치마킹과 데이터 분석을 통한 Customer & Market Insight를 바탕으로 고객 가치와 시장의 요구를 정확히 읽어내는 능력은 AVD의 필수적인 역량입니다. 우리는 전동화(Electrification)나 SDV(Software-Defined Vehicle) 같은 새로운 기술을 빠르게 이해하고, 새로운 패키징 아이디어를 스스로 탐색해 시험해 보는 도전적인 태도를 지향하며, 업무 방식을 더 효율적으로 만드는 추진력을 갖추고자 노력하고 있습니다.`,
        aEn: `To deliver this work, AVD designs the vehicle’s overall “big picture” and aligns many organizations in one direction. Systematic thinking to find the best balance across architecture, and the ability to collaborate effectively with diverse departments—design, powertrain, manufacturing, safety, and more—are therefore essential. In particular, Customer & Market Insight grounded in global benchmarking and data analysis—reading customer value and market needs accurately—is a core AVD capability. We aim to build momentum that makes how we work more efficient: quickly understanding new technologies such as electrification and SDV, and taking on the challenge of exploring and testing new packaging ideas ourselves.`,
      },
      {
        q: "AVD 담당의 매력은?",
        qKr: "AVD 담당의 매력은?",
        qEn: "What is the appeal of the AVD department?",
        a: `AVD 담당의 매력은 새로운 차량 개발과 전사 Innovation의 선두에서, 차량 개발의 가장 초기 단계에 제품의 방향성과 고객 경험을 결정짓는 핵심 역할을 수행한다는 점에 있습니다. 이 과정에서 다양한 조직과 협업하며 폭넓은 지식과 시야를 확보할 수 있으며, 특히 Architecture와 Package를 통해 차량의 '뼈대'를 설계하는 독보적인 전문성을 쌓을 수 있다는 것이 큰 장점입니다.`,
        aKr: `AVD 담당의 매력은 새로운 차량 개발과 전사 Innovation의 선두에서, 차량 개발의 가장 초기 단계에 제품의 방향성과 고객 경험을 결정짓는 핵심 역할을 수행한다는 점에 있습니다. 이 과정에서 다양한 조직과 협업하며 폭넓은 지식과 시야를 확보할 수 있으며, 특히 Architecture와 Package를 통해 차량의 '뼈대'를 설계하는 독보적인 전문성을 쌓을 수 있다는 것이 큰 장점입니다.`,
        aEn: `AVD’s appeal is that it stands at the forefront of new vehicle development and company-wide innovation, playing a pivotal role in setting product direction and customer experience at the earliest stage of development. In that process you collaborate with diverse organizations to gain broad knowledge and perspective, and especially through Architecture and Package you build unique expertise in designing the vehicle’s structural foundation.`,
      },
      {
        q: "앞으로 AVD 담당이 지향하는 목표는 무엇인가요?",
        qKr: "앞으로 AVD 담당이 지향하는 목표는 무엇인가요?",
        qEn: "What are the goals that the AVD department aims for in the future?",
        a: `AVD 담당은 앞으로 세 가지 핵심 목표를 지향합니다. 먼저 Customer-Value-Driven Architecture Leader로서 주행거리, 공간, 승차감, 안전, 가격 경쟁력 등 고객이 체감하는 기본기에 미래 고객 요구를 반영한 차세대 Vehicle Structure를 설계하는 조직이 되고자 합니다. 또한 Insight & Benchmarking-Based Decision Hub로서 지속적인 글로벌 벤치마킹과 신규 아이디어 발굴을 통해 프로그램별 고객 가치를 극대화할 것입니다. 마지막으로 Enterprise Innovation & Front-Loading Hub가 되어 품질, 원가, 개발 리드타임을 동시에 개선하고, 새로운 아이디어와 업무 방식을 확산하는 GMTCK의 혁신 거점 역할을 수행하는 것이 우리의 지향점입니다.`,
        aKr: `AVD 담당은 앞으로 세 가지 핵심 목표를 지향합니다. 먼저 Customer-Value-Driven Architecture Leader로서 주행거리, 공간, 승차감, 안전, 가격 경쟁력 등 고객이 체감하는 기본기에 미래 고객 요구를 반영한 차세대 Vehicle Structure를 설계하는 조직이 되고자 합니다. 또한 Insight & Benchmarking-Based Decision Hub로서 지속적인 글로벌 벤치마킹과 신규 아이디어 발굴을 통해 프로그램별 고객 가치를 극대화할 것입니다. 마지막으로 Enterprise Innovation & Front-Loading Hub가 되어 품질, 원가, 개발 리드타임을 동시에 개선하고, 새로운 아이디어와 업무 방식을 확산하는 GMTCK의 혁신 거점 역할을 수행하는 것이 우리의 지향점입니다.`,
        aEn: `AVD pursues three core goals. First, as a Customer-Value-Driven Architecture Leader, we aim to be the organization that designs next-generation vehicle structure reflecting future customer needs for the fundamentals customers feel—range, space, ride comfort, safety, and price competitiveness. Second, as an Insight & Benchmarking-Based Decision Hub, we will maximize customer value by program through sustained global benchmarking and new idea discovery. Finally, as an Enterprise Innovation & Front-Loading Hub, we aim to improve quality, cost, and development lead time together and serve as GMTCK’s innovation hub—spreading new ideas and ways of working.`,
      },
    ],
  },
  "avd-studio-surface": {
    questions: [
      {
        q: "SSI 담당은 어떤 일을 하는 곳인가요?",
        qKr: "SSI 담당은 어떤 일을 하는 곳인가요?",
        qEn: "What does the SSI department do?",
        a: "SSI 담당은 자동차 외관 디자인과 실제 차체 구조가 완벽하게 조화를 이루도록 만드는 팀입니다. 디자이너가 만든 멋진 스케치가 현실적인 안전, 구조 기준을 충족하고, 생산 공장에서 문제없이 조립될 수 있도록 디자인과 엔지니어링 사이를 이어주는 조율자 역할을 합니다.",
        aKr: "SSI 담당은 자동차 외관 디자인과 실제 차체 구조가 완벽하게 조화를 이루도록 만드는 팀입니다. 디자이너가 만든 멋진 스케치가 현실적인 안전, 구조 기준을 충족하고, 생산 공장에서 문제없이 조립될 수 있도록 디자인과 엔지니어링 사이를 이어주는 조율자 역할을 합니다.",
        aEn: "The SSI department is a team that harmonizes automotive exterior design with the actual body structure. We serve as coordinators between design and engineering so that designers’ sketches meet realistic safety and structural requirements and can be assembled smoothly in production.",
      },
      {
        q: "SSI 담당은 고객에게 왜 중요한가요?",
        qKr: "SSI 담당은 고객에게 왜 중요한가요?",
        qEn: "Why is the SSI department important to customers?",
        a: "차를 처음 보거나 만질 때 느끼는 품질은 대부분 SSI의 업무와 연결되어 있습니다. 멀리서 보았을 때의 아름다운 비율, 가까이서 보이는 정교한 표면과 틈새(단차), 문을 열고 닫을 때의 느낌, 그리고 외관 부품의 조립 정밀도까지 모두 SSI의 영역입니다. 우리는 기획 단계부터 차가 나올 때까지 이 모든 요소가 고객에게 최상의 품질로 전달되도록 설계하고 관리합니다.",
        aKr: "차를 처음 보거나 만질 때 느끼는 품질은 대부분 SSI의 업무와 연결되어 있습니다. 멀리서 보았을 때의 아름다운 비율, 가까이서 보이는 정교한 표면과 틈새(단차), 문을 열고 닫을 때의 느낌, 그리고 외관 부품의 조립 정밀도까지 모두 SSI의 영역입니다. 우리는 기획 단계부터 차가 나올 때까지 이 모든 요소가 고객에게 최상의 품질로 전달되도록 설계하고 관리합니다.",
        aEn: "The quality you feel when you first see or touch a vehicle is largely tied to SSI’s work. Proportions seen from a distance, refined surfaces and flush-and-gap quality up close, the feel of opening and closing doors, and the assembly precision of exterior parts—all fall within SSI’s scope. From planning until the vehicle is launched, we design and manage these elements so they are delivered to customers at the highest quality.",
      },
      {
        q: "차량 개발 과정의 언제부터 SSI가 참여하나요?",
        qKr: "차량 개발 과정의 언제부터 SSI가 참여하나요?",
        qEn: "When does SSI participate in the vehicle development process?",
        a: '우리는 차의 첫 콘셉트를 잡는 단계부터 참여합니다. 소형 SUV인지 중형 세단인지 방향을 정하고, 휠베이스나 트렁크 공간 등을 나누는 초기 검토를 진행합니다. 이후 개발이 끝날 때까지 "처음 기획한 모습이 실제로 만들어질 수 있는가?"를 끊임없이 확인하며 완성도를 높입니다.',
        aKr: '우리는 차의 첫 콘셉트를 잡는 단계부터 참여합니다. 소형 SUV인지 중형 세단인지 방향을 정하고, 휠베이스나 트렁크 공간 등을 나누는 초기 검토를 진행합니다. 이후 개발이 끝날 때까지 "처음 기획한 모습이 실제로 만들어질 수 있는가?"를 끊임없이 확인하며 완성도를 높입니다.',
        aEn: "We participate from the stage when the vehicle’s first concept is defined. We set the direction—whether a compact SUV or a mid-size sedan—and run initial reviews that allocate wheelbase, trunk space, and more. Through the end of development, we continually ask whether “the originally planned design can actually be built,” raising completeness.",
      },
      {
        q: "SSI담당에서 일하시는 분들은 주로 어떤 전공 출신인가요?",
        qKr: "SSI담당에서 일하시는 분들은 주로 어떤 전공 출신인가요?",
        qEn: "What majors do people working in the SSI department typically come from?",
        a: '가장 많은 비율은 기계공학, 자동차공학, 항공우주공학 등 공학 계열 전공자들입니다. 여기에 산업공학, 전기·전자, 산업디자인 전공자들도 함께 어울려 일하고 있습니다. 전공이 꼭 자동차 전공일 필요는 없지만, "물건이 어떻게 구조를 이루고, 어떻게 만들어지는지"를 좋아하는 분들이 잘 맞는 편입니다. 무엇보다도, 다양한 전공 배경을 가진 사람들이 각자의 강점을 살려 협업하는 문화라, 배우고 섞이려는 태도를 더 중요하게 보고 있습니다.',
        aKr: '가장 많은 비율은 기계공학, 자동차공학, 항공우주공학 등 공학 계열 전공자들입니다. 여기에 산업공학, 전기·전자, 산업디자인 전공자들도 함께 어울려 일하고 있습니다. 전공이 꼭 자동차 전공일 필요는 없지만, "물건이 어떻게 구조를 이루고, 어떻게 만들어지는지"를 좋아하는 분들이 잘 맞는 편입니다. 무엇보다도, 다양한 전공 배경을 가진 사람들이 각자의 강점을 살려 협업하는 문화라, 배우고 섞이려는 태도를 더 중요하게 보고 있습니다.',
        aEn: "The largest proportion consists of engineering majors such as mechanical engineering, automotive engineering, and aerospace engineering. Industrial engineering, electrical and electronics, and industrial design majors also work together. While the major doesn't necessarily have to be automotive, people who like \"how things are structured and how they are made\" tend to fit well. Above all, since it's a culture where people with diverse academic backgrounds collaborate by leveraging each other's strengths, we value an attitude of learning and blending more.",
      },
      {
        q: "AVD SVI 본부에서 일하고 싶은 사람은 어떤 준비를 하면 좋을까요?",
        qKr: "AVD SVI 본부에서 일하고 싶은 사람은 어떤 준비를 하면 좋을까요?",
        qEn: "What preparation would be good for someone who wants to work in the AVD SVI headquarters?",
        a: '먼저 학교에서는 기초 역학, 재료, 설계 과목을 통해 "구조를 이해하고 문제를 푸는 연습"을 충분히 해 두면 도움이 됩니다. 가능하다면 CAD(3D 모델링)나 간단한 시뮬레이션 도구를 다뤄보고, 팀 프로젝트 등을 통해 함께 무언가를 만들어 본 경험이 있으면 좋을 것 같습니다. 자동차 회사라고 해서 단순히 자동차만 깊게 파는 사람을 찾는 것은 아닙니다. 오히려 고객의 관점에서 사고하고, 동료들과 솔직하게 소통하며, 실패를 두려워하지 않고 계속 시도해 보려는 태도를 큰 장점으로 봅니다. 마지막으로, 완벽한 사람이기보다는 배우면서 성장하고 싶어 하는 사람, 그리고 "이 차를 타는 사람에게 어떤 경험을 줄까?"를 자연스럽게 떠올리는 사람이라면 SSI와 잘 어울릴 것입니다.',
        aKr: '먼저 학교에서는 기초 역학, 재료, 설계 과목을 통해 "구조를 이해하고 문제를 푸는 연습"을 충분히 해 두면 도움이 됩니다. 가능하다면 CAD(3D 모델링)나 간단한 시뮬레이션 도구를 다뤄보고, 팀 프로젝트 등을 통해 함께 무언가를 만들어 본 경험이 있으면 좋을 것 같습니다. 자동차 회사라고 해서 단순히 자동차만 깊게 파는 사람을 찾는 것은 아닙니다. 오히려 고객의 관점에서 사고하고, 동료들과 솔직하게 소통하며, 실패를 두려워하지 않고 계속 시도해 보려는 태도를 큰 장점으로 봅니다. 마지막으로, 완벽한 사람이기보다는 배우면서 성장하고 싶어 하는 사람, 그리고 "이 차를 타는 사람에게 어떤 경험을 줄까?"를 자연스럽게 떠올리는 사람이라면 SSI와 잘 어울릴 것입니다.',
        aEn: "First, it helps to practice “understanding structures and solving problems” through basic mechanics, materials, and design courses. If you can, get hands-on with CAD (3D modeling) or simple simulation tools, and try building something with others in team projects. We are not looking only for people who go deep on cars because we are an automotive company. We highly value thinking from the customer’s perspective, communicating openly with peers, and keeping at it without fear of failure. Finally, people who want to learn and grow rather than be perfect—and who naturally ask what experience they would give the person driving this car—tend to fit SSI well.",
      },
      {
        q: "앞으로 SSI 담당이 지향하는 목표는 무엇인가요?",
        qKr: "앞으로 SSI 담당이 지향하는 목표는 무엇인가요?",
        qEn: "What are the goals that the SSI department aims for in the future?",
        a: "우리의 목표는 고객이 차를 처음 보는 순간부터 오래 사용하는 내내 믿을 수 있는 외관 품질을 경험하게 하는 것입니다. 이를 위해 글로벌 팀과 함께 협력하고, 가상 개발 시스템과 신기술을 빠르게 도입하고 있습니다. 디자인, 설계, 생산 부서와 긴밀하게 소통하며 더 정교하고 완성도 높은 차량을 만들기 위해 오늘도 노력하고 있습니다.",
        aKr: "우리의 목표는 고객이 차를 처음 보는 순간부터 오래 사용하는 내내 믿을 수 있는 외관 품질을 경험하게 하는 것입니다. 이를 위해 글로벌 팀과 함께 협력하고, 가상 개발 시스템과 신기술을 빠르게 도입하고 있습니다. 디자인, 설계, 생산 부서와 긴밀하게 소통하며 더 정교하고 완성도 높은 차량을 만들기 위해 오늘도 노력하고 있습니다.",
        aEn: "Our goal is for customers to experience exterior quality they can trust from the first moment they see the vehicle through years of ownership. We collaborate with global teams and rapidly adopt virtual development systems and new technologies. We work closely with design, engineering, and production to build more refined, higher-quality vehicles—and we keep at it every day.",
      },
    ],
  },
  "pipg-psc": {
    questions: [
      {
        q: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qKr: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qEn: "Please introduce your department and tell us about your current responsibilities in detail.",
        a: "저희 담당은 엔진/트랜스미션 캘리브레이션 경험을 바탕으로 전기차 캘리브레이션, 소프트웨어, 시뮬레이션까지 업무 영역을 확장하며, AI, 가상 기술을 활용해 차량 제어 전반과 안정적인 차량 출시를 지원하고 있습니다. 저는 전기차 업무를 담당하며, 실차와 가상 환경을 통해 전기차 시스템의 안전, 성능과 품질을 사전에 검증하고 양산 전 리스크를 최소화하고 있습니다.",
        aKr: "저희 담당은 엔진/트랜스미션 캘리브레이션 경험을 바탕으로 전기차 캘리브레이션, 소프트웨어, 시뮬레이션까지 업무 영역을 확장하며, AI, 가상 기술을 활용해 차량 제어 전반과 안정적인 차량 출시를 지원하고 있습니다. 저는 전기차 업무를 담당하며, 실차와 가상 환경을 통해 전기차 시스템의 안전, 성능과 품질을 사전에 검증하고 양산 전 리스크를 최소화하고 있습니다.",
        aEn: "Our department expands its work scope from engine/transmission calibration experience to EV calibration, software, and simulation, supporting overall vehicle control and stable vehicle launch using AI and virtual technologies. I am responsible for EV work, pre-verifying the safety, performance, and quality of EV systems through real vehicles and virtual environments, minimizing risks before mass production.",
      },
      {
        q: "하루 업무에 대해 소개해주세요.",
        qKr: "하루 업무에 대해 소개해주세요.",
        qEn: "Please tell us about your daily work.",
        a: "보통 전날 밤이나 아침에 북미에서 전달된 업무 메일을 확인하며 하루를 시작합니다. 현재는 시뮬레이션 장비를 활용해 검증 업무를 수행하며, 전기차 시스템이 요구 조건에 맞게 안전하게 동작하는지 검증하고 있습니다.",
        aKr: "보통 전날 밤이나 아침에 북미에서 전달된 업무 메일을 확인하며 하루를 시작합니다. 현재는 시뮬레이션 장비를 활용해 검증 업무를 수행하며, 전기차 시스템이 요구 조건에 맞게 안전하게 동작하는지 검증하고 있습니다.",
        aEn: "I usually start my day by checking work emails from North America that came in the previous night or morning. Currently, I perform verification work using simulation equipment, verifying that EV systems operate safely according to requirements.",
      },
      {
        q: "담당하고 있는 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "담당하고 있는 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn: "What competencies do you think are necessary for your work?",
        a: "전기차 검증 업무에는 전기차 시스템에 대한 이해와 함께, 실차와 시뮬레이션을 중심으로 한 가상 검증 환경을 유기적으로 활용하는 역량이 중요하다고 생각합니다. 실차 시험은 여전히 핵심이지만, 사전에 시뮬레이션과 같은 가상 환경에서 조건을 구성해 문제를 줄여가는 접근이 점점 필수적인 요소가 되고 있습니다. 이러한 가상 검증 결과를 바탕으로 추가 시험이 필요한지, 또는 어떤 리스크를 관리해야 하는지를 판단할 수 있는 의사결정 역량 또한 중요한 요소가 되고 있다고 느끼고 있습니다.",
        aKr: "전기차 검증 업무에는 전기차 시스템에 대한 이해와 함께, 실차와 시뮬레이션을 중심으로 한 가상 검증 환경을 유기적으로 활용하는 역량이 중요하다고 생각합니다. 실차 시험은 여전히 핵심이지만, 사전에 시뮬레이션과 같은 가상 환경에서 조건을 구성해 문제를 줄여가는 접근이 점점 필수적인 요소가 되고 있습니다. 이러한 가상 검증 결과를 바탕으로 추가 시험이 필요한지, 또는 어떤 리스크를 관리해야 하는지를 판단할 수 있는 의사결정 역량 또한 중요한 요소가 되고 있다고 느끼고 있습니다.",
        aEn: "I think understanding EV systems and the ability to organically utilize virtual verification environments centered on real vehicles and simulation is important for EV verification work. Real vehicle testing is still core, but the approach of configuring conditions in virtual environments like simulation beforehand to reduce problems is becoming increasingly essential. I also feel that decision-making capabilities to judge whether additional testing is needed or what risks need to be managed based on these virtual verification results are becoming important factors.",
      },
      {
        q: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qKr: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qEn: "What is the team culture and what are your team members like?",
        a: "저희 팀은 서로에 대한 배려와 신뢰를 바탕으로 움직이는 팀이라고 생각합니다. 팀 특성상 실차 시험이 많아 차량 이슈를 자주 접하는데, 한 번 도움을 받으면 자연스럽게 서로 돕는 분위기가 형성되어 있고, 누가 시키지 않아도 다 같이 모여 문제를 해결합니다. 덕분에 저도 부담 없이 도움을 요청할 수 있는, 함께 일하기 편한 팀입니다.",
        aKr: "저희 팀은 서로에 대한 배려와 신뢰를 바탕으로 움직이는 팀이라고 생각합니다. 팀 특성상 실차 시험이 많아 차량 이슈를 자주 접하는데, 한 번 도움을 받으면 자연스럽게 서로 돕는 분위기가 형성되어 있고, 누가 시키지 않아도 다 같이 모여 문제를 해결합니다. 덕분에 저도 부담 없이 도움을 요청할 수 있는, 함께 일하기 편한 팀입니다.",
        aEn: "I think our team operates based on mutual consideration and trust. Due to the nature of our team, we frequently encounter vehicle issues as we conduct many real vehicle tests. Once someone receives help, a natural atmosphere of mutual assistance forms, and everyone gathers to solve problems without being asked. Thanks to this, I can request help without burden, making it a comfortable team to work with.",
      },
      {
        q: "앞으로의 목표 또는 커리어 방향",
        qKr: "앞으로의 목표 또는 커리어 방향",
        qEn: "Future goals or career direction",
        a: "검증 결과에 책임을 지고, 고객 안전을 기준으로 판단할 수 있는 검증 엔지니어가 되는 것이 제 방향입니다. 단순히 통과 여부를 확인하는 데 그치지 않고, 검증 단계에서 문제를 사전에 설명하고 줄일 수 있는 역할을 목표로 하고 있습니다. 제 시험 결과가 곧 고객의 안전과 직결된다는 인식을 바탕으로, 책임감 있게 검증 업무를 수행하고 싶습니다.",
        aKr: "검증 결과에 책임을 지고, 고객 안전을 기준으로 판단할 수 있는 검증 엔지니어가 되는 것이 제 방향입니다. 단순히 통과 여부를 확인하는 데 그치지 않고, 검증 단계에서 문제를 사전에 설명하고 줄일 수 있는 역할을 목표로 하고 있습니다. 제 시험 결과가 곧 고객의 안전과 직결된다는 인식을 바탕으로, 책임감 있게 검증 업무를 수행하고 싶습니다.",
        aEn: "My direction is to become a verification engineer who takes responsibility for verification results and can make judgments based on customer safety. I aim not just to check pass/fail, but to play a role in explaining and reducing problems in advance during the verification stage. Based on the recognition that my test results are directly connected to customer safety, I want to perform verification work responsibly.",
      },
    ],
  },
  "pipg-vpd-pid": {
    questions: [
      {
        q: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qKr: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qEn: "Please introduce your department and tell us about your current responsibilities in detail.",
        a: "저희 담당은 차량의 주행성이나 정숙성처럼, 고객이 실제로 체감하는 성능을 통합적으로 관리하는 역할을 하고 있습니다. 차량 동력성능 개발, 소음&진동, 가상 개발팀이 긴밀하게 협업하며 시험과 해석을 하나의 흐름으로 연결하고, 그 안에서 최적의 차량 성능을 만들어가고 있습니다. 저는 그 중에서도 소음&진동 성능 개발 엔지니어로서, 불쾌한 소음과 진동을 줄이는 역할 뿐만 아니라 차량의 모델이나 브랜드 이미지에 어울리는 엔진 사운드와 전기차 모터 사운드를 만들어가는 업무를 맡고 있습니다.",
        aKr: "저희 담당은 차량의 주행성이나 정숙성처럼, 고객이 실제로 체감하는 성능을 통합적으로 관리하는 역할을 하고 있습니다. 차량 동력성능 개발, 소음&진동, 가상 개발팀이 긴밀하게 협업하며 시험과 해석을 하나의 흐름으로 연결하고, 그 안에서 최적의 차량 성능을 만들어가고 있습니다. 저는 그 중에서도 소음&진동 성능 개발 엔지니어로서, 불쾌한 소음과 진동을 줄이는 역할 뿐만 아니라 차량의 모델이나 브랜드 이미지에 어울리는 엔진 사운드와 전기차 모터 사운드를 만들어가는 업무를 맡고 있습니다.",
        aEn: "Our department plays a role in comprehensively managing performance that customers actually feel, such as vehicle drivability and quietness. Vehicle powertrain performance development, noise & vibration, and virtual development teams closely collaborate to connect testing and analysis into one flow, creating optimal vehicle performance within it. Among these, I work as a noise & vibration performance development engineer, not only reducing unpleasant noise and vibration but also creating engine sounds and electric vehicle motor sounds that match the vehicle model or brand image.",
      },
      {
        q: "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn: "What competencies do you think are necessary for your work?",
        a: "이 업무에 필요한 역량은 크게 세 가지라고 생각합니다. 첫 번째는 기본기입니다. 차체, 섀시, 추진 시스템 등 차량 전반에 대한 이해를 바탕으로 소음·진동 현상을 바라볼 수 있어야 합니다. 이런 기본기가 갖춰져 있어야 보다 안정적이면서도 현실적인 해결책을 제시할 수 있다고 생각합니다. 두 번째는 데이터를 읽고 해석하는 능력입니다. 차량 성능 개발은 해석이나 물리 시험, 다양한 가상 툴을 통해 생성되는 데이터를 기반으로 의사결정이 이루어지는 경우가 많기 때문에, 데이터 속에서 의미를 정확히 읽어내는 능력이 중요합니다. 마지막으로는 커뮤니케이션과 끈기입니다. 소음·진동 성능 개발은 설계, 시험, 품질, 생산 등 여러 부서가 유기적으로 연결돼 있어 협업이 필수적인 업무입니다. 또한 소음·진동 문제는 눈에 보이지 않고 한 번에 해결되지 않는 경우가 많아, 끝까지 원인을 파고들며 해결해 나가는 끈기 역시 중요한 역량이라고 생각합니다.",
        aKr: "이 업무에 필요한 역량은 크게 세 가지라고 생각합니다. 첫 번째는 기본기입니다. 차체, 섀시, 추진 시스템 등 차량 전반에 대한 이해를 바탕으로 소음·진동 현상을 바라볼 수 있어야 합니다. 이런 기본기가 갖춰져 있어야 보다 안정적이면서도 현실적인 해결책을 제시할 수 있다고 생각합니다. 두 번째는 데이터를 읽고 해석하는 능력입니다. 차량 성능 개발은 해석이나 물리 시험, 다양한 가상 툴을 통해 생성되는 데이터를 기반으로 의사결정이 이루어지는 경우가 많기 때문에, 데이터 속에서 의미를 정확히 읽어내는 능력이 중요합니다. 마지막으로는 커뮤니케이션과 끈기입니다. 소음·진동 성능 개발은 설계, 시험, 품질, 생산 등 여러 부서가 유기적으로 연결돼 있어 협업이 필수적인 업무입니다. 또한 소음·진동 문제는 눈에 보이지 않고 한 번에 해결되지 않는 경우가 많아, 끝까지 원인을 파고들며 해결해 나가는 끈기 역시 중요한 역량이라고 생각합니다.",
        aEn: "I think there are three main competencies needed for this work. First is fundamentals. You need to be able to view noise and vibration phenomena based on understanding of the entire vehicle, including body, chassis, and powertrain systems. With these fundamentals in place, you can present more stable and realistic solutions. Second is the ability to read and interpret data. Vehicle performance development often makes decisions based on data generated through analysis, physical testing, and various virtual tools, so the ability to accurately read meaning from data is important. Finally, communication and persistence. Noise and vibration performance development is work that requires collaboration as multiple departments such as design, testing, quality, and production are organically connected. Also, noise and vibration problems are often invisible and not solved at once, so persistence in digging into the root cause until resolution is also an important competency.",
      },
      {
        q: "진행하셨던 프로젝트 중 인상깊었던 프로젝트가 있나요?",
        qKr: "진행하셨던 프로젝트 중 인상깊었던 프로젝트가 있나요?",
        qEn: "Was there a memorable project you worked on?",
        a: "트레일 블레이저와 트랙스 크로스오버 개발 당시, 소음진동 엔지니어로 참여했던 경험이 특히 기억에 많이 남습니다. 당시 국내외 소형 SUV 시장에서는 대부분 4기통 엔진을 사용하고 있었고, 3기통 엔진을 적용한 두 차종은 소음·진동 측면에서 태생적으로 불리한 조건을 안고 출발해야 했습니다. 그럼에도 불구하고 4기통 차량 수준의 소음·진동 성능 목표를 달성하기 위해 많은 시간과 자원, 그리고 노력이 필요했고, 관련 부서들과의 긴밀한 협업이 필수적이었습니다. 개발 초기부터 양산까지 한순간도 긴장을 늦출 수 없었던 프로젝트였습니다. 완성된 차량들이 양산 이후 국내외 시장에서 판매 성과는 물론, 품질과 상품성, 차량 가치 측면에서도 좋은 평가를 받는 모습을 보며 개인적으로 큰 보람과 자부심을 느꼈습니다. 엔지니어로서의 책임감과 성취감을 동시에 느낄 수 있었던 경험입니다.",
        aKr: "트레일 블레이저와 트랙스 크로스오버 개발 당시, 소음진동 엔지니어로 참여했던 경험이 특히 기억에 많이 남습니다. 당시 국내외 소형 SUV 시장에서는 대부분 4기통 엔진을 사용하고 있었고, 3기통 엔진을 적용한 두 차종은 소음·진동 측면에서 태생적으로 불리한 조건을 안고 출발해야 했습니다. 그럼에도 불구하고 4기통 차량 수준의 소음·진동 성능 목표를 달성하기 위해 많은 시간과 자원, 그리고 노력이 필요했고, 관련 부서들과의 긴밀한 협업이 필수적이었습니다. 개발 초기부터 양산까지 한순간도 긴장을 늦출 수 없었던 프로젝트였습니다. 완성된 차량들이 양산 이후 국내외 시장에서 판매 성과는 물론, 품질과 상품성, 차량 가치 측면에서도 좋은 평가를 받는 모습을 보며 개인적으로 큰 보람과 자부심을 느꼈습니다. 엔지니어로서의 책임감과 성취감을 동시에 느낄 수 있었던 경험입니다.",
        aEn: "The experience of participating as a noise and vibration engineer during the development of Trailblazer and Trax Cross-over particularly stands out in my memory. At that time, most small SUVs in domestic and international markets used 4-cylinder engines, and the two models with 3-cylinder engines had to start with inherently disadvantageous conditions in terms of noise and vibration. Nevertheless, achieving 4-cylinder vehicle-level noise and vibration performance goals required a lot of time, resources, and effort, and close collaboration with related departments was essential. It was a project where we couldn't let our guard down for a moment from early development to mass production. Seeing the completed vehicles receive good evaluations in domestic and international markets after mass production, not only in sales performance but also in quality, product appeal, and vehicle value, I felt great satisfaction and pride personally. It was an experience where I could feel both a sense of responsibility and achievement as an engineer.",
      },
      {
        q: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qKr: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qEn: "What is the team culture and what are your team members like?",
        a: "저희 팀은 서로 필요한 부분은 잘 챙겨주면서도, 불필요한 간섭은 거의 없는 분위기입니다. 의견을 말하는 데 부담이 없어서 직급이나 연차에 상관없이 편하게 이야기할 수 있고, 각자의 방식을 존중해주는 팀이라고 생각합니다. 점심시간에는 함께 운동을 하기도 하고, 업무 중간중간 여유가 있을 때는 육아나 재테크, 여행처럼 다양한 주제로 수다도 많이 떠는 편입니다. 한마디로, 일할 때는 자연스럽게 몰입하고 평소에는 친구처럼 편안한 팀입니다.",
        aKr: "저희 팀은 서로 필요한 부분은 잘 챙겨주면서도, 불필요한 간섭은 거의 없는 분위기입니다. 의견을 말하는 데 부담이 없어서 직급이나 연차에 상관없이 편하게 이야기할 수 있고, 각자의 방식을 존중해주는 팀이라고 생각합니다. 점심시간에는 함께 운동을 하기도 하고, 업무 중간중간 여유가 있을 때는 육아나 재테크, 여행처럼 다양한 주제로 수다도 많이 떠는 편입니다. 한마디로, 일할 때는 자연스럽게 몰입하고 평소에는 친구처럼 편안한 팀입니다.",
        aEn: "Our team has an atmosphere where we take good care of each other's needs while rarely interfering unnecessarily. There's no burden in expressing opinions, so we can talk comfortably regardless of rank or years of experience, and I think it's a team that respects each person's way. During lunch, we sometimes exercise together, and when we have free time during work, we often chat about various topics like parenting, investment, or travel. In short, it's a team that naturally immerses itself in work and is comfortable like friends in everyday life.",
      },
      {
        q: "내게 GMTCK란?",
        qKr: "내게 GMTCK란?",
        qEn: "What does GMTCK mean to you?",
        a: "제게 GMTCK는 첫 직장이자, 저를 꽤 그럴듯한 직장인으로 만들어준 곳입니다. 시행착오도 많았지만, 그 과정에서 일하는 법과 사람을 대하는 법을 자연스럽게 배웠습니다. MBTI로 치면 I 90% 성향의 저를, 이제는 사람들과 소통하고 의견을 나누는 데 훨씬 편한 사람으로 만들어준 곳이기도 합니다. 또 제가 좋아하는 다양한 차량을 직접 경험하고, 개발해 나가는 과정에서 새로운 도전에 재미를 느낄 수 있는, 제게는 아주 럭셔리한 놀이터 같은 공간이기도 합니다. 그래서 GMTCK는 제 삶에 큰 영향을 준, 고맙고 애정이 가는 회사입니다.",
        aKr: "제게 GMTCK는 첫 직장이자, 저를 꽤 그럴듯한 직장인으로 만들어준 곳입니다. 시행착오도 많았지만, 그 과정에서 일하는 법과 사람을 대하는 법을 자연스럽게 배웠습니다. MBTI로 치면 I 90% 성향의 저를, 이제는 사람들과 소통하고 의견을 나누는 데 훨씬 편한 사람으로 만들어준 곳이기도 합니다. 또 제가 좋아하는 다양한 차량을 직접 경험하고, 개발해 나가는 과정에서 새로운 도전에 재미를 느낄 수 있는, 제게는 아주 럭셔리한 놀이터 같은 공간이기도 합니다. 그래서 GMTCK는 제 삶에 큰 영향을 준, 고맙고 애정이 가는 회사입니다.",
        aEn: "To me, GMTCK is my first workplace and the place that made me into a fairly decent working professional. There were many trials and errors, but I naturally learned how to work and how to treat people through that process. It's also the place that made me, who would be I 90% in MBTI terms, much more comfortable communicating and sharing opinions with people. It's also a very luxurious playground-like space for me where I can directly experience and develop various vehicles I like, and feel excitement about new challenges in that process. So GMTCK is a company that has greatly influenced my life, one I'm grateful for and have affection for.",
      },
    ],
  },
  "pipg-thermal": {
    questions: [
      {
        q: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qKr: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qEn: "Please introduce your role and describe your current work in detail.",
        a: "저희 담당은 가상 및 실제 주행 환경에서 차량 열에너지 시스템과 공조 성능을 구현/최적화하고 예측/검증하고 개발하는 업무를 맡고 있어요. 제가 맡고 있는 일은, 전기차 안에서 열이 효율적으로 관리될 수 있도록 조율하고 제어값을 맞추는 일이에요. 예를 들어 아주 더운 여름날, 배터리는 과열되고 실내는 시원하게 해야 할 때, 냉방 에너지를 배터리에 더 써야 할지, 승객에게 더 써야 할지 우선순위를 정해서 Cooling Power를 어떻게 배분할지 조율하는 게 제 역할이에요. 그리고 그렇게 정해진 냉방을 실제로 만들기 위해 콤프레서나 밸브 같은 부품들을 어떻게 작동시킬지도 같이 제어하고 있습니다.",
        aKr: "저희 담당은 가상 및 실제 주행 환경에서 차량 열에너지 시스템과 공조 성능을 구현/최적화하고 예측/검증하고 개발하는 업무를 맡고 있어요. 제가 맡고 있는 일은, 전기차 안에서 열이 효율적으로 관리될 수 있도록 조율하고 제어값을 맞추는 일이에요. 예를 들어 아주 더운 여름날, 배터리는 과열되고 실내는 시원하게 해야 할 때, 냉방 에너지를 배터리에 더 써야 할지, 승객에게 더 써야 할지 우선순위를 정해서 Cooling Power를 어떻게 배분할지 조율하는 게 제 역할이에요. 그리고 그렇게 정해진 냉방을 실제로 만들기 위해 콤프레서나 밸브 같은 부품들을 어떻게 작동시킬지도 같이 제어하고 있습니다.",
        aEn: "Our team implements, optimizes, predicts, verifies, and develops vehicle thermal energy systems and HVAC performance in virtual and real driving environments. My job is to coordinate and tune control values so heat is managed efficiently in the electric vehicle. For example, on a very hot summer day when the battery must not overheat but the cabin must stay cool, I set priorities—whether to spend more cooling energy on the battery or on occupants—and coordinate how cooling power is split. I also control how components such as compressors and valves operate to deliver that cooling in practice.",
      },
      {
        q: "담당하고 있는 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "담당하고 있는 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn: "What competencies do you think are needed for your work?",
        a: '제가 생각하기에 이 직무에서는 열역학, 열전달, 유체역학 같은 기본 지식, 그리고 로직 해석 능력, 커뮤니케이션 능력 이 세 가지가 특히 중요한 것 같아요. 차량의 HVAC이나 전기차 배터리 열관리는 열 흐름이나 냉매 특성 같은 물리적인 현상을 다루기 때문에, 기초 지식이 있어야 시스템 반응이나 이상 현상을 빠르게 이해할 수 있고요. 또 단순 계산으로 끝나는 게 아니라, 실제 차량에 로직을 적용하고 결과를 분석해야 하기 때문에, "왜 이런 반응이 나왔지?", "이 구간은 왜 튜닝이 필요하지?" 같은 걸 논리적으로 해석할 수 있는 사고력이 중요해요. 그리고 이 일이 혼자 하는 게 아니라 배터리, 모터, 전장, 소프트웨어팀 등과 협업해야 할 일이 많아서, 문제를 잘 설명하고 조율하는 커뮤니케이션 능력도 꼭 필요하다고 생각합니다.',
        aKr: '제가 생각하기에 이 직무에서는 열역학, 열전달, 유체역학 같은 기본 지식, 그리고 로직 해석 능력, 커뮤니케이션 능력 이 세 가지가 특히 중요한 것 같아요. 차량의 HVAC이나 전기차 배터리 열관리는 열 흐름이나 냉매 특성 같은 물리적인 현상을 다루기 때문에, 기초 지식이 있어야 시스템 반응이나 이상 현상을 빠르게 이해할 수 있고요. 또 단순 계산으로 끝나는 게 아니라, 실제 차량에 로직을 적용하고 결과를 분석해야 하기 때문에, "왜 이런 반응이 나왔지?", "이 구간은 왜 튜닝이 필요하지?" 같은 걸 논리적으로 해석할 수 있는 사고력이 중요해요. 그리고 이 일이 혼자 하는 게 아니라 배터리, 모터, 전장, 소프트웨어팀 등과 협업해야 할 일이 많아서, 문제를 잘 설명하고 조율하는 커뮤니케이션 능력도 꼭 필요하다고 생각합니다.',
        aEn: "For this role, I think three things matter most: fundamentals such as thermodynamics, heat transfer, and fluid mechanics; the ability to interpret control logic; and communication. HVAC and EV battery thermal management deal with physical phenomena like heat flow and refrigerant behavior, so foundational knowledge helps you quickly understand system response and anomalies. Because work doesn’t end with a simple calculation—you apply logic on real vehicles and analyze results—logical thinking to interpret “why did it respond this way?” or “why does this range need tuning?” is essential. And since you collaborate often with battery, motor, electronics, software, and other teams, you also need communication skills to explain issues clearly and align everyone.",
      },
      {
        q: "진행하셨던 프로젝트 중 인상깊었던 프로젝트가 있나요?",
        qKr: "진행하셨던 프로젝트 중 인상깊었던 프로젝트가 있나요?",
        qEn: "Was there a project you found especially memorable?",
        a: '작년 겨울에, 겨울철 주행거리가 너무 짧게 나와서 그걸 개선하는 프로젝트를 했었는데요. 문제 원인을 보니까 고전압 냉각수 히터가 너무 과하게 작동하면서 배터리를 많이 소모하는 게 주 원인이었어요. 그래서 팀원들과 같이 설정 온도나 내외기 도어 제어 방식을 조정해서, 냉난방 성능은 유지하면서도 주행거리를 늘릴 수 있도록 캘리브레이션을 바꿨던 경험이 있어요. 이런 식으로 제가 한 작업이 실제 차량에 적용되고, 고객이 체감할 수 있는 결과로 이어질 때, "아, 내가 진짜 의미 있는 일을 하고 있구나"라는 걸 느껴요. 단순히 책상 앞에서 끝나는 일이 아니라, 실차 반영까지 연결된다는 점이 이 일의 큰 매력이라고 생각합니다.',
        aKr: '작년 겨울에, 겨울철 주행거리가 너무 짧게 나와서 그걸 개선하는 프로젝트를 했었는데요. 문제 원인을 보니까 고전압 냉각수 히터가 너무 과하게 작동하면서 배터리를 많이 소모하는 게 주 원인이었어요. 그래서 팀원들과 같이 설정 온도나 내외기 도어 제어 방식을 조정해서, 냉난방 성능은 유지하면서도 주행거리를 늘릴 수 있도록 캘리브레이션을 바꿨던 경험이 있어요. 이런 식으로 제가 한 작업이 실제 차량에 적용되고, 고객이 체감할 수 있는 결과로 이어질 때, "아, 내가 진짜 의미 있는 일을 하고 있구나"라는 걸 느껴요. 단순히 책상 앞에서 끝나는 일이 아니라, 실차 반영까지 연결된다는 점이 이 일의 큰 매력이라고 생각합니다.',
        aEn: "Last winter we ran a project to improve driving range, which had become too short in cold weather. Root-cause analysis showed the high-voltage coolant heater was running excessively and draining the battery. Together with the team, we adjusted set temperatures and fresh/recirc air-door control so we could extend range while keeping HVAC performance. When work like that ships on real cars and customers can feel the benefit, I really feel, “I’m doing something meaningful.” A big appeal of this job is that it doesn’t stop at a desk—it connects all the way to the vehicle on the road.",
      },
      {
        q: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qKr: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qEn: "What is the team culture like, and what are your colleagues like?",
        a: "저희 팀은 자율성과 책임감을 바탕으로 일하는 분위기예요. 일정이나 방식이 딱딱하게 정해진 건 아니고, 각자 자기 업무를 주도적으로 끌고 가는 스타일이 잘 맞는 팀이에요. 무슨 문제가 생겨도 서로 도와주는 분위기라서, 처음 들어오셔도 부담 없이 배우실 수 있을 거예요. 전체적으로 보면 편안하지만, 일은 프로답게 해나가는 그런 팀이라고 생각합니다.",
        aKr: "저희 팀은 자율성과 책임감을 바탕으로 일하는 분위기예요. 일정이나 방식이 딱딱하게 정해진 건 아니고, 각자 자기 업무를 주도적으로 끌고 가는 스타일이 잘 맞는 팀이에요. 무슨 문제가 생겨도 서로 도와주는 분위기라서, 처음 들어오셔도 부담 없이 배우실 수 있을 거예요. 전체적으로 보면 편안하지만, 일은 프로답게 해나가는 그런 팀이라고 생각합니다.",
        aEn: "Our team works with autonomy and ownership. Schedules and methods aren’t rigid—people who like to drive their own work fit well here. When issues come up, people help each other, so newcomers can learn without too much pressure. Overall it’s a relaxed environment, but we still get the job done professionally.",
      },
      {
        q: "앞으로의 목표 또는 커리어 방향",
        qKr: "앞으로의 목표 또는 커리어 방향",
        qEn: "Future goals or career direction",
        a: "이 직무는 단순히 HVAC만 보는 게 아니라, 차량 전체의 열 흐름과 에너지 효율을 통합적으로 다루는 일이라 시야가 굉장히 넓어져요. 그래서 경력이 쌓이면 배터리나 모터, 전장 쪽과 협업하면서 전체 Thermal 시스템을 리드하는 역할로 성장할 수 있고, 또는 제어 로직 개발이나 캘리브레이션 전략을 총괄하는 시니어 엔지니어로도 자연스럽게 이어질 수 있어요. 나중에는 통합 열관리 플랫폼을 기획하거나, 글로벌 프로젝트를 리드하는 기회도 열려 있고요. 최근에는 소프트웨어 기반 제어 로직의 중요성이 더욱 커지고 있는 만큼, 열에너지 분야는 하드웨어와 소프트웨어를 아우르는 핵심 영역으로 지속적인 성장 가능성이 있다고 생각합니다.",
        aKr: "이 직무는 단순히 HVAC만 보는 게 아니라, 차량 전체의 열 흐름과 에너지 효율을 통합적으로 다루는 일이라 시야가 굉장히 넓어져요. 그래서 경력이 쌓이면 배터리나 모터, 전장 쪽과 협업하면서 전체 Thermal 시스템을 리드하는 역할로 성장할 수 있고, 또는 제어 로직 개발이나 캘리브레이션 전략을 총괄하는 시니어 엔지니어로도 자연스럽게 이어질 수 있어요. 나중에는 통합 열관리 플랫폼을 기획하거나, 글로벌 프로젝트를 리드하는 기회도 열려 있고요. 최근에는 소프트웨어 기반 제어 로직의 중요성이 더욱 커지고 있는 만큼, 열에너지 분야는 하드웨어와 소프트웨어를 아우르는 핵심 영역으로 지속적인 성장 가능성이 있다고 생각합니다.",
        aEn: "This role isn’t only HVAC—it covers vehicle-wide heat flow and energy efficiency, so your perspective broadens a lot. As you gain experience, you can grow into leading the overall thermal system with battery, motor, and electronics partners, or into senior roles owning control-logic development and calibration strategy. Later there are also opportunities to shape integrated thermal-management platforms or lead global projects. With software-based control logic becoming ever more important, thermal energy sits at the intersection of hardware and software—and I see strong long-term growth there.",
      },
    ],
  },
  "pipg-pgtlo": {
    questions: [
      {
        q: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qKr: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qEn: "Please introduce your department and describe your current work in detail.",
        a: "저희 담당은 차량 개발 과정에서 필수적으로 수행되는 성능, 내구성, 배출가스, 소음·진동, 안전 관련 다양한 요구사항을 종합적으로 검증할 수 있는 세계적 수준의 인프라를 보유하고 있습니다. 또한 미래 모빌리티 규제와 기술을 선도하며, 지속적인 시험 환경 고도화를 통해 Virtual과 Physical을 아우를 수 있는 폭넓은 시험 역량을 갖추고 있답니다.\n\n저는 Energy & Emission Lab Ops 팀에 근무하고 있으며 차량의 양산을 위해 필수적으로 수행되어야 하는 배출가스 인증시험, EV Electric Range 시험, 신규 법규 시험들을 수행/지원하고 있어요.",
        aKr: "저희 담당은 차량 개발 과정에서 필수적으로 수행되는 성능, 내구성, 배출가스, 소음·진동, 안전 관련 다양한 요구사항을 종합적으로 검증할 수 있는 세계적 수준의 인프라를 보유하고 있습니다. 또한 미래 모빌리티 규제와 기술을 선도하며, 지속적인 시험 환경 고도화를 통해 Virtual과 Physical을 아우를 수 있는 폭넓은 시험 역량을 갖추고 있답니다.\n\n저는 Energy & Emission Lab Ops 팀에 근무하고 있으며 차량의 양산을 위해 필수적으로 수행되어야 하는 배출가스 인증시험, EV Electric Range 시험, 신규 법규 시험들을 수행/지원하고 있어요.",
        aEn: "Our organization has world-class infrastructure to comprehensively verify performance, durability, emissions, NVH, safety, and other requirements essential in vehicle development. We also lead future mobility regulations and technology, continuously upgrading test environments to cover both virtual and physical testing at broad scale.\n\nI work on the Energy & Emission Lab Ops team, running and supporting emissions certification tests, EV electric-range tests, and new regulatory tests required for mass production.",
      },
      {
        q: "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn: "What competencies do you think are necessary for your work?",
        a: "부품부터 완성차에 이르기까지 다양한 시험을 수행하는 업무가 많아 안전에 대한 마인드는 기본적으로 갖추어야 합니다. 또한 시험 의뢰 부서들과의 적극적인 의견 조율이 빈번하기에 탐구적이고 긍정적인 의사소통 능력도 중요하다 할 수 있구요. 마지막으로 AI의 발달과 전기차, AV 기술의 대중화가 빠르게 진행되고 있는 만큼 관련된 신기술/법규에 대한 신속한 적응력도 필요하답니다. 이 능력까지 갖춘 분이 계시다면 그분은 이미 One of Us!!",
        aKr: "부품부터 완성차에 이르기까지 다양한 시험을 수행하는 업무가 많아 안전에 대한 마인드는 기본적으로 갖추어야 합니다. 또한 시험 의뢰 부서들과의 적극적인 의견 조율이 빈번하기에 탐구적이고 긍정적인 의사소통 능력도 중요하다 할 수 있구요. 마지막으로 AI의 발달과 전기차, AV 기술의 대중화가 빠르게 진행되고 있는 만큼 관련된 신기술/법규에 대한 신속한 적응력도 필요하답니다. 이 능력까지 갖춘 분이 계시다면 그분은 이미 One of Us!!",
        aEn: "We run many tests from components to full vehicles, so a safety mindset is fundamental. We also coordinate often with requesting departments, so curious, positive communication matters. Finally, with AI, EV, and AV advancing quickly, fast adaptation to new technology and regulations is essential. If you have all of that—you’re already one of us!",
      },
      {
        q: "진행하셨던 프로젝트 중 인상 깊었던 프로젝트가 있나요?",
        qKr: "진행하셨던 프로젝트 중 인상 깊었던 프로젝트가 있나요?",
        qEn: "Was there a memorable project among those you’ve worked on?",
        a: "과거 직접 주도한 프로젝트도 몇 차례 있었지만, 가장 기억에 남는 하나를 선택하라면 2025년 말 청라 주행장에 완공된 Energy & Emission Lab 신설 프로젝트에 참여한 경험이었습니다. 최신 개발 트렌드인 Virtualization에 발 맞추어 Test Lab 프로젝트 최초로 3D data와 VR장비를 도입하여 운영시의 안전과 효율 향상 방안 등을 미리 검토해 볼 수 있었고, 이를 기회로 다양한 운영 측면에서의 요구사항도 반영할 수 있었어요. 향후 진행될 프로젝트들은 이러한 과정에서 익힌 노하우들이 모두 녹아 들어 더욱 완성도가 높아지리라 생각됩니다.",
        aKr: "과거 직접 주도한 프로젝트도 몇 차례 있었지만, 가장 기억에 남는 하나를 선택하라면 2025년 말 청라 주행장에 완공된 Energy & Emission Lab 신설 프로젝트에 참여한 경험이었습니다. 최신 개발 트렌드인 Virtualization에 발 맞추어 Test Lab 프로젝트 최초로 3D data와 VR장비를 도입하여 운영시의 안전과 효율 향상 방안 등을 미리 검토해 볼 수 있었고, 이를 기회로 다양한 운영 측면에서의 요구사항도 반영할 수 있었어요. 향후 진행될 프로젝트들은 이러한 과정에서 익힌 노하우들이 모두 녹아 들어 더욱 완성도가 높아지리라 생각됩니다.",
        aEn: "I’ve led projects before, but if I pick one standout, it was the new Energy & Emission Lab completed at the Incheon Cheongna proving ground in late 2025. To match the virtualization trend, we were the first test-lab project to bring in 3D data and VR equipment, letting us review safety and efficiency improvements in operations up front and fold in operational requirements. I expect future projects will benefit from everything we learned there.",
      },
      {
        q: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qKr: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qEn: "What is the team culture and what are your colleagues like?",
        a: "GM은 100년이 넘은 기업 문화를 가지고 있으며 Global 기업 답게 개방적인 분위기를 넘어 다양성, 포용성 그리고 공정함을 존중하는 문화가 자리 잡고 있어요. 그렇기에 팀뿐만 아니라 조직 구성원 분들도 모두 젠틀하고 스마트하시죠. 연배가 있으신 선배 직원분들도 많이 계시지만 꼰대력(?)은 모두 제로에 수렴^^",
        aKr: "GM은 100년이 넘은 기업 문화를 가지고 있으며 Global 기업 답게 개방적인 분위기를 넘어 다양성, 포용성 그리고 공정함을 존중하는 문화가 자리 잡고 있어요. 그렇기에 팀뿐만 아니라 조직 구성원 분들도 모두 젠틀하고 스마트하시죠. 연배가 있으신 선배 직원분들도 많이 계시지만 꼰대력(?)은 모두 제로에 수렴^^",
        aEn: "GM has more than a century of culture; as a global company it values openness, diversity, inclusion, and fairness. People across teams are gentle and smart. We have many senior colleagues, but the “old-school boss” factor converges toward zero—smile.",
      },
      {
        q: "내게 GMTCK란?",
        qKr: "내게 GMTCK란?",
        qEn: "What does GMTCK mean to you?",
        a: "단순한 직장이라는 개념을 넘어 빠르게 변화하는 시대에 맞추어 도전을 독려하고 스스로 발전할 수 있는 기회를 제공해주는 곳이죠. 마치 개인의 가능성을 함께 실험하고 확장해 나가는 성장형 플랫폼처럼요. 주어진 역할에만 머무는 것이 아니라 새로운 시도를 응원받고 그 과정 자체가 자산이 될 수 있는 그런 곳이랍니다.",
        aKr: "단순한 직장이라는 개념을 넘어 빠르게 변화하는 시대에 맞추어 도전을 독려하고 스스로 발전할 수 있는 기회를 제공해주는 곳이죠. 마치 개인의 가능성을 함께 실험하고 확장해 나가는 성장형 플랫폼처럼요. 주어진 역할에만 머무는 것이 아니라 새로운 시도를 응원받고 그 과정 자체가 자산이 될 수 있는 그런 곳이랍니다.",
        aEn: "More than “just a job,” it’s a place that encourages challenge and self-development in a fast-changing world—almost like a growth platform where we experiment and expand what’s possible together. You’re not stuck in a fixed role; new attempts are supported, and the journey itself becomes an asset.",
      },
    ],
  },
};

/**
 * Our Story 모자이크: `images/profilepic` 이하 모든 인물 컷(인터뷰 데이터와 무관).
 * 새 이미지 추가 시 여기에 `폴더/파일명` 상대 경로를 한 줄 추가하면 그리드에 포함됩니다.
 */
const PROFILE_MOSAIC_REL_PATHS = [
  "EE/PQDQ.png",
  "EE/ai chief_new.png",
  "EE/certification, envrionment(1).png",
  "EE/product excellence.png",
  "EE/system&product(1).png",
  "EE/system&product(2).png",
  "EE/validation(2).png",
  "EE/validation.png",
  "avd&svi/avd.png",
  "avd&svi/svi.png",
  "beca/Aftersales.png",
  "beca/Chassis.png",
  "beca/Exterior.png",
  "beca/body.png",
  "etc pic/제목 없음 (1080 x 1080 px) (8).png",
  "etc pic/제목 없음 (1080 x 1080 px) (9).png",
  "etc pic/제목 없음 (1080 x 1080 px) (10).png",
  "etc pic/제목 없음 (1080 x 1080 px) (11).png",
  "etc pic/제목 없음 (1080 x 1080 px) (12).png",
  "etc pic/제목 없음 (1080 x 1080 px) (13).png",
  "etc pic/제목 없음 (1080 x 1080 px) (14).png",
  "etc pic/제목 없음 (1080 x 1080 px) (15).png",
  "etc pic/제목 없음 (1080 x 1080 px) (16).png",
  "etc pic/제목 없음 (1080 x 1080 px) (17).png",
  "etc pic/제목 없음 (1080 x 1080 px) (18).png",
  "etc pic/제목 없음 (1080 x 1080 px) (19).png",
  "etc pic/제목 없음 (1080 x 1080 px) (20).png",
  "etc pic/제목 없음 (1080 x 1080 px) (21).png",
  "etc pic/제목 없음 (1080 x 1080 px) (22).png",
  "etc pic/제목 없음 (1080 x 1080 px) (23).png",
  "etc pic/제목 없음 (1080 x 1080 px) (24).png",
  "etc pic/제목 없음 (1080 x 1080 px) (25).png",
  "etc pic/제목 없음 (1080 x 1080 px) (26).png",
  "etc pic/제목 없음 (1080 x 1080 px) (27).png",
  "itpe/ecs-itpe.png",
  "itpe/interior-trim.png",
  "itpe/seat-safety-restraints.png",
  "itpe/thermal-propulsion-integration.png",
  "pipg/pgtlo_new.png",
  "pipg/psc.png",
  "pipg/thermal_new.png",
  "pipg/vpdpid.png",
  "s&s/cchppmo.png",
  "s&s/maec.png",
  "s&s/swqnd.png",
  "ve/safety performance integration1.png",
  "ve/safety performance integration2.png",
  "ve/vIrtual integration center adas 1.png",
  "ve/virtual engineering solution1.png",
  "ve/virtual engineering solution2.png",
  "ve/virtual engineering solution3.png",
  "ve/virtual integration center adas 2.png",
  "ve/virtual integration center adas 3.png",
];

function isPlaceholderPortraitUrl(u) {
  if (!u) {
    return true;
  }
  return String(u).indexOf("gm-symbol-color-light-bg") !== -1;
}

/** profilepic 이하 상대 경로로 정규화해 중복 제거(쿼리·인코딩 차이 등) */
function canonicalProfilePortraitRelPath(u) {
  try {
    var base = String(u).replace(/\?.*$/, "");
    var needle = "/images/profilepic/";
    var i = base.indexOf(needle);
    if (i === -1) {
      return "";
    }
    var rest = base.slice(i + needle.length);
    return rest
      .split("/")
      .map(function (seg) {
        return decodeURIComponent(seg);
      })
      .join("/");
  } catch (e) {
    return "";
  }
}

/** 동일 프로필 컷이면 true (`pv=` 등 쿼리만 다른 경우 포함) */
function portraitUrlsRepresentSameImage(a, b) {
  if (!a || !b) {
    return false;
  }
  var ca = canonicalProfilePortraitRelPath(a);
  var cb = canonicalProfilePortraitRelPath(b);
  if (ca && cb) {
    return ca === cb;
  }
  return String(a).replace(/\?.*$/, "") === String(b).replace(/\?.*$/, "");
}

/** 모자이크/폴백 풀: 같은 파일은 한 번만 유지(먼저 나온 URL 보존) */
function dedupePortraitUrlsPreservingOrder(urls) {
  if (!urls || !urls.length) {
    return [];
  }
  var seen = Object.create(null);
  var out = [];
  for (var i = 0; i < urls.length; i++) {
    var u = urls[i];
    if (isPlaceholderPortraitUrl(u)) {
      continue;
    }
    var c = canonicalProfilePortraitRelPath(u);
    var key = c || String(u).replace(/\?.*$/, "");
    if (!key) {
      continue;
    }
    if (seen[key]) {
      continue;
    }
    seen[key] = true;
    out.push(u);
  }
  return out;
}

function getProfileMosaicPortraitPoolUrls() {
  var bust =
    typeof withProfileImageCacheBust === "function"
      ? withProfileImageCacheBust
      : function (u) {
          return u;
        };

  var raw = [];

  function pushCandidate(u) {
    if (isPlaceholderPortraitUrl(u)) {
      return;
    }
    if (!canonicalProfilePortraitRelPath(u)) {
      return;
    }
    raw.push(u);
  }

  PROFILE_MOSAIC_REL_PATHS.forEach(function (rel) {
    var parts = rel.split("/").filter(Boolean);
    pushCandidate(bust(profilePicRel(parts)));
  });

  if (
    typeof interviewData !== "undefined" &&
    typeof getInterviewPortraitUrl === "function"
  ) {
    Object.keys(interviewData).forEach(function (k) {
      var d = interviewData[k];
      if (!d) {
        return;
      }
      var isAssetKey = /\.(png|jpg|jpeg|webp)$/i.test(k);
      if (
        Object.prototype.hasOwnProperty.call(d, "questions") &&
        Array.isArray(d.questions) &&
        !isAssetKey &&
        !d.profileImage &&
        !d.profileFallback
      ) {
        return;
      }
      pushCandidate(getInterviewPortraitUrl(k));
    });
  }

  return dedupePortraitUrlsPreservingOrder(raw);
}

window.getProfileMosaicPortraitPoolUrls = getProfileMosaicPortraitPoolUrls;
window.canonicalProfilePortraitRelPath = canonicalProfilePortraitRelPath;
window.dedupePortraitUrlsPreservingOrder = dedupePortraitUrlsPreservingOrder;
window.portraitUrlsRepresentSameImage = portraitUrlsRepresentSameImage;

function mountStaticRoleInterviews() {
  document.querySelectorAll("[data-role-interview-mount]").forEach((bodyEl) => {
    const interviewId = bodyEl.getAttribute("data-role-interview-mount");
    const imageName = getImageNameForInterviewId(interviewId);
    if (!imageName || !interviewData[imageName]) {
      console.warn(
        "[role-interviews] No profile image mapping for",
        interviewId,
      );
      return;
    }
    const data = interviewData[imageName];
    const section = createInterviewSection(interviewId, imageName, data);
    const innerBody = section.querySelector(".hq-content-body");
    if (innerBody) {
      bodyEl.innerHTML = innerBody.innerHTML;
    }
  });
}

function getImageNameForInterviewId(interviewId) {
  return Object.keys(interviewData).find(
    (k) => (interviewData[k].interviewId || "") === interviewId,
  );
}

/** data-kr / data-en 등 HTML 속성값 — &, ", < 가 있으면 속성이 끊겨 인터뷰 본문이 잘림 */
function escapeHtmlAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/**
 * Red-X처럼 하이픈으로 붙은 표기가 "Red-" / "X"로 끊기지 않도록,
 * 양쪽이 ASCII 문자·숫자인 하이픈만 비줄바꿈 하이픈(U+2011)으로 바꿈.
 */
function glueAlphanumericHyphenCompounds(s) {
  return String(s).replace(/(?<=[A-Za-z0-9])-(?=[A-Za-z0-9])/g, "\u2011");
}

/** 요소 textContent로 넣을 본문 (줄바꿈·불릿 유지, innerHTML 안전) */
function escapeHtmlText(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// 인터뷰 섹션 생성 함수
function createInterviewSection(interviewId, imageName, data) {
  const currentLang =
    typeof document !== "undefined" &&
    document.body &&
    document.body.classList.contains("interviews-page")
      ? "kr"
      : localStorage.getItem("language") || "kr";
  const imageNameWithoutExt = imageName.replace(".png", "");
  const useTp = data.useTpThumbnail === true;
  const tpImageName = useTp ? imageNameWithoutExt + "_tp.png" : imageName;
  const profileFallback = data.profileFallback || null;
  let profileImagePath;
  if (data.profileImage) {
    profileImagePath = withProfileImageCacheBust(data.profileImage);
  } else if (profileFallback) {
    profileImagePath = withProfileImageCacheBust(profileFallback);
  } else {
    profileImagePath = withProfileImageCacheBust(
      `./images/profilepic/${tpImageName}`,
    );
  }
  let imgOnError = "";
  if (data.profileImage && profileFallback) {
    imgOnError = ` onerror="this.onerror=null;this.src='${escapeHtmlAttr(withProfileImageCacheBust(profileFallback))}'"`;
  } else if (!data.profileImage && !profileFallback && useTp) {
    imgOnError = ` onerror="this.onerror=null;this.src='./images/profilepic/${imageName}'"`;
  }

  // VE 인터뷰인지 확인
  const isVeInterview = interviewId.startsWith("ve-");
  /** EE 다인 캐러셀 슬라이스(SPI·Validation, VE와 동일 마크업 클래스) */
  const isEeSpiCarouselItem =
    /^ee-system-investigation-\d+$/.test(interviewId) ||
    /^ee-verification-\d+$/.test(interviewId);

  // 인터뷰 내용 가져오기 (기존 인터뷰 내용이 있으면 사용, 없으면 빈 템플릿)
  // VE 인터뷰의 경우 roleId로도 찾아봄
  let content = interviewContent[interviewId] || { questions: [] };
  if (isVeInterview && content.questions.length === 0) {
    // VE 인터뷰 ID에서 roleId 추출
    // interviewId 형식: ve-{roleId}-{index} (예: ve-ve-safety-performance-1)
    // ve-ve-safety-performance-1 -> ve-safety-performance
    const parts = interviewId.split("-");
    if (parts.length >= 3) {
      // 마지막 부분(숫자) 제거
      const withoutIndex = parts.slice(0, -1);
      // ve-ve-safety-performance -> ve-safety-performance (첫 번째 ve- 제거)
      let roleId;
      if (withoutIndex[0] === "ve" && withoutIndex[1] === "ve") {
        // ve-ve-safety-performance -> ve-safety-performance
        roleId = "ve-" + withoutIndex.slice(2).join("-");
      } else {
        // ve-safety-performance -> ve-safety-performance
        roleId = withoutIndex.join("-");
      }
      content = interviewContent[roleId] || { questions: [] };
    }
  }

  const section = document.createElement("div");
  if (isVeInterview || isEeSpiCarouselItem) {
    section.className = "ve-interview-item";
  } else {
    section.className = "hq-content-section";
    section.id = interviewId;
  }

  // 인터뷰 질문 HTML 생성
  const questionsHtml =
    content.questions && content.questions.length > 0
      ? content.questions
          .map((q, index) => {
            const qKr = glueAlphanumericHyphenCompounds(q.qKr || q.q || "");
            const qEn = glueAlphanumericHyphenCompounds(q.qEn || q.q || "");
            const answerKr = glueAlphanumericHyphenCompounds(
              q.aKr || q.a || "",
            );
            const answerEn = glueAlphanumericHyphenCompounds(
              q.aEn || q.a || "",
            );
            const titleShown = currentLang === "kr" ? qKr : qEn;
            const answerShown = currentLang === "kr" ? answerKr : answerEn;
            return `
          <div class="interview-question">
            <h3 class="interview-q-title" data-kr="${escapeHtmlAttr(qKr)}" data-en="${escapeHtmlAttr(qEn)}">
              ${escapeHtmlText(titleShown)}
            </h3>
            ${answerShown ? `<p class="interview-answer" data-kr="${escapeHtmlAttr(answerKr)}" data-en="${escapeHtmlAttr(answerEn)}">${escapeHtmlText(answerShown)}</p>` : ""}
          </div>
        `;
          })
          .join("")
      : "";

  const hqKr = data.hqKr || data.hq || "";
  const hqEn = data.hqEn || data.hq || "";
  const roleKr = data.roleKr || data.role || "";
  const roleEn = data.roleEn || data.role || "";
  const nameKr = data.nameKr || data.name || "";
  const nameEn = data.nameEn || data.name || "";
  const hqShown = currentLang === "kr" ? hqKr : hqEn;
  const roleShown = currentLang === "kr" ? roleKr : roleEn;
  const nameShown = currentLang === "kr" ? nameKr : nameEn;

  const formulaBgUrl = getFormulaPicBackgroundUrl();
  const formulaBgLayer =
    formulaBgUrl !== ""
      ? `<div class="interview-profile-bg-formula" style="background-image: url('${escapeHtmlAttr(formulaBgUrl)}');" aria-hidden="true"></div>`
      : "";

  section.innerHTML = `
    <div class="hq-content-body">
      <!-- 프로필 소개 -->
      <div class="interview-profile-header interview-profile-header--hero">
        <div class="interview-profile-bg">
          ${formulaBgLayer}
          <div class="interview-profile-image">
            <img src="${profileImagePath}" alt="Profile" class="profile-img" decoding="async" fetchpriority="high"${imgOnError} />
          </div>
        </div>
        <div class="interview-profile-content">
          <div class="profile-meta profile-meta--right">
            <p class="profile-meta__line profile-meta__hq" data-kr="${escapeHtmlAttr(hqKr)}" data-en="${escapeHtmlAttr(hqEn)}">${escapeHtmlText(hqShown)}</p>
            <p class="profile-meta__line profile-meta__role" data-kr="${escapeHtmlAttr(roleKr)}" data-en="${escapeHtmlAttr(roleEn)}">${escapeHtmlText(roleShown)}</p>
            <p class="profile-meta__line profile-meta__name" data-kr="${escapeHtmlAttr(nameKr)}" data-en="${escapeHtmlAttr(nameEn)}">${escapeHtmlText(nameShown)}</p>
          </div>
        </div>
        <div class="profile-divider"></div>
      </div>
      
      <!-- 인터뷰 내용 -->
      <div class="interview-content">
        ${questionsHtml || '<p class="interview-answer">인터뷰 내용이 준비 중입니다.</p>'}
      </div>
    </div>
  `;

  return section;
}

/** 본부 선택 랜딩 배경 등 — 프로필 이미지 URL (createInterviewSection과 동일 규칙) */
function getInterviewPortraitUrl(imageName) {
  const data = interviewData[imageName];
  if (!data) return withProfileImageCacheBust(PROFILE_PLACEHOLDER_IMAGE);
  if (data.profileImage) return withProfileImageCacheBust(data.profileImage);
  if (data.profileFallback)
    return withProfileImageCacheBust(data.profileFallback);
  const useTp = data.useTpThumbnail === true;
  const imageNameWithoutExt = imageName.replace(".png", "");
  const tpImageName = useTp ? imageNameWithoutExt + "_tp.png" : imageName;
  return withProfileImageCacheBust(`./images/profilepic/${tpImageName}`);
}
