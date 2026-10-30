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
 *   - interviewContent: interviewId별 Q&A (BECA/ITPE/S&E는 data/interview-content-beca-itpe-ss.json, VE 다인 인터뷰는 data/interview-content-ve.json)
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
const PROFILE_IMAGE_CACHE_VERSION = "20";
function withProfileImageCacheBust(url) {
  if (!url || url.startsWith("data:")) return url;
  if (/\bpv=\d+\b/.test(url)) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}pv=${PROFILE_IMAGE_CACHE_VERSION}`;
}

/** Our Story 히어로 모자이크: `images/profilepic-mosaic/*.png` (256px, 알파 유지, scripts/build-profilepic-mosaic.sh) */
const MOSAIC_THUMB_VERSION = "13";
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
  return `${head}/images/profilepic-mosaic/${stem}.png?mv=${MOSAIC_THUMB_VERSION}`;
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
    roleKr: "Safety Performance & CAE Engineer",
    roleEn: "Safety Performance & CAE Engineer",
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
    roleKr: "Safety Performance & CAE Engineer",
    roleEn: "Safety Performance & CAE Engineer",
    name: "한재녕",
    nameKr: "한재녕",
    nameEn: "Jaenyung Han",
    greeting:
      "안녕하세요\nVE본부의 Safety Performance Integration담당\n한재녕입니다",
    greetingKr:
      "안녕하세요\nVE본부의 Safety Performance Integration담당\n한재녕입니다",
    greetingEn: "Hello\nSafety Performance Integration, VE HQ\nJaenyung Han",
  },
  "ve5.png": {
    profileImage: profilePicRel([
      "ve",
      "virtual integration center adas 3.png",
    ]),
    hq: "VE",
    role: "Advanced Driver Assistance Systems (ADAS)",
    roleKr: "ADAS Engineer",
    roleEn: "ADAS Engineer",
    name: "정상효",
    nameKr: "정상효",
    nameEn: "Sanghyo Jung",
    greeting:
      "안녕하세요\nVE본부의 ADAS담당\n정상효입니다",
    greetingKr:
      "안녕하세요\nVE본부의 ADAS담당\n정상효입니다",
    greetingEn: "Hello\nADAS, VE HQ\nSanghyo Jung",
  },
  "ve6.png": {
    profileImage: profilePicRel(["ve", "virtual engineering solution1.png"]),
    hq: "VE",
    role: "Virtual Integration & Body, Exterior, Chassis Solutions / Virtual Vehicle, Interior & ECS Solutions",
    roleKr: "Body Virtual Integration Solution EGM",
    roleEn: "Body Virtual Integration Solution EGM",
    category: "CAE Engineer",
    name: "정행만",
    nameKr: "정행만",
    nameEn: "Haengmaan Jeong",
    greeting:
      "안녕하세요\nVE본부의 VIBECS/VVIES담당\n정행만입니다",
    greetingKr:
      "안녕하세요\nVE본부의 VIBECS/VVIES담당\n정행만입니다",
    greetingEn: "Hello\nVIBECS/VVIES, VE HQ\nHaengmaan Jeong",
  },
  "ve7.png": {
    profileImage: profilePicRel(["ve", "virtual engineering solution2.png"]),
    hq: "VE",
    role: "Virtual Integration & Body, Exterior, Chassis Solutions / Virtual Vehicle, Interior & ECS Solutions",
    roleKr: "Body Design Engineer",
    roleEn: "Body Design Engineer",
    category: "Design Engineer",
    name: "황순재",
    nameKr: "황순재",
    nameEn: "Soonjae Hwang",
    greeting:
      "안녕하세요\nVE본부의 VIBECS/VVIES담당\n황순재입니다",
    greetingKr:
      "안녕하세요\nVE본부의 VIBECS/VVIES담당\n황순재입니다",
    greetingEn: "Hello\nVIBECS/VVIES, VE HQ\nSoonjae Hwang",
  },
  // [비활성] 김민정 — 업무·인원이 S&E 본부로 이동하여 VE에서 숨김 (사진은 S&E SS3에서 사용 중)
  // "ve8.png": {
  //   profileImage: profilePicRel(["ve", "virtual engineering solution3.png"]),
  //   hq: "VE",
  //   role: "Virtual Integration & Body, Exterior, Chassis Solutions / Virtual Vehicle, Interior & ECS Solutions",
  //   roleKr: "Virtual Integration & Body, Exterior, Chassis Solutions / Virtual Vehicle, Interior & ECS Solutions",
  //   roleEn: "Virtual Integration & Body, Exterior, Chassis Solutions / Virtual Vehicle, Interior & ECS Solutions",
  //   name: "김민정",
  //   nameKr: "김민정",
  //   nameEn: "Minjung Kim",
  //   greeting:
  //     "안녕하세요\nVE본부의 VIBECS/VVIES담당\n김민정입니다",
  //   greetingKr:
  //     "안녕하세요\nVE본부의 VIBECS/VVIES담당\n김민정입니다",
  //   greetingEn: "Hello\nVIBECS/VVIES, VE HQ\nMinjung Kim",
  // },
  // 김남준: ADAS → VIBECS/VVIES로 이동 (캐러셀 마지막 순서 유지를 위해 ve8 뒤에 위치)
  "ve3.png": {
    profileImage: profilePicRel([
      "ve",
      "vIrtual integration center adas 1.png",
    ]),
    hq: "VE",
    role: "Virtual Integration & Body, Exterior, Chassis Solutions / Virtual Vehicle, Interior & ECS Solutions",
    roleKr: "Virtual Performance Integration Manager",
    roleEn: "Virtual Performance Integration Manager",
    category: "VPIM",
    name: "김남준",
    nameKr: "김남준",
    nameEn: "Namjun (NJ) Kim",
    greeting:
      "안녕하세요\nVE본부의 VIBECS/VVIES담당\n김남준입니다",
    greetingKr:
      "안녕하세요\nVE본부의 VIBECS/VVIES담당\n김남준입니다",
    greetingEn:
      "Hello\nVIBECS/VVIES, VE HQ\nNamjun (NJ) Kim",
  },
  "ve9.png": {
    profileImage: profilePicRel(["ve", "virtual engineering solution4.png"]),
    hq: "VE",
    role: "Virtual Integration & Body, Exterior, Chassis Solutions / Virtual Vehicle, Interior & ECS Solutions",
    roleKr: "Interior CAE Engineer",
    roleEn: "Interior CAE Engineer",
    category: "CAE Engineer",
    name: "황찬일",
    nameKr: "황찬일",
    nameEn: "Chanil Hwang",
    greeting:
      "안녕하세요\nVE본부의 VIBECS/VVIES담당\n황찬일입니다",
    greetingKr:
      "안녕하세요\nVE본부의 VIBECS/VVIES담당\n황찬일입니다",
    greetingEn: "Hello\nVIBECS/VVIES, VE HQ\nChanil Hwang",
  },
  // 천재희: ADAS → VIBECS/VVIES (AI/ML Engineer)로 이동
  "ve4.png": {
    profileImage: profilePicRel([
      "ve",
      "virtual integration center adas 2.png",
    ]),
    hq: "VE",
    role: "Virtual Integration & Body, Exterior, Chassis Solutions / Virtual Vehicle, Interior & ECS Solutions",
    roleKr: "AI/ML Engineer",
    roleEn: "AI/ML Engineer",
    category: "AI/ML Engineer",
    name: "천재희",
    nameKr: "천재희",
    nameEn: "Jaehee Cheon",
    greeting:
      "안녕하세요\nVE본부의 VIBECS/VVIES담당\n천재희입니다",
    greetingKr:
      "안녕하세요\nVE본부의 VIBECS/VVIES담당\n천재희입니다",
    greetingEn: "Hello\nVIBECS/VVIES, VE HQ\nJaehee Cheon",
  },
  // AVD - SVI - CXAI 본부 (구 AVD & SVI)
  "avd1.png": {
    profileImage: profilePicRel(["avd&svi", "avd.png"]),
    hq: "AVD - SVI - CXAI",
    role: "Advanced Vehicle Development",
    roleKr: "Advanced Vehicle Development",
    roleEn: "Advanced Vehicle Development",
    name: "김성수",
    nameKr: "김성수",
    nameEn: "Seongsu Kim",
    greeting:
      "안녕하세요\nAVD - SVI - CXAI본부의 Advanced Vehicle Development담당\n김성수입니다",
    greetingKr:
      "안녕하세요\nAVD - SVI - CXAI본부의 Advanced Vehicle Development담당\n김성수입니다",
    greetingEn:
      "Hello\nAdvanced Vehicle Development, AVD - SVI - CXAI HQ\nSeongsu Kim",
    interviewId: "avd-advanced-vehicle", // 기존 인터뷰 섹션 ID
  },
  "svi1.png": {
    profileImage: profilePicRel(["avd&svi", "svi_new.png"]),
    hq: "AVD - SVI - CXAI",
    role: "Studio & Surface Integration",
    roleKr: "Studio & Surface Integration",
    roleEn: "Studio & Surface Integration",
    name: "박충응",
    nameKr: "박충응",
    nameEn: "Chungung Park",
    greeting:
      "안녕하세요\nAVD - SVI - CXAI본부의 Studio & Surface Integration담당\n박충응입니다",
    greetingKr:
      "안녕하세요\nAVD - SVI - CXAI본부의 Studio & Surface Integration담당\n박충응입니다",
    greetingEn:
      "Hello\nStudio & Surface Integration, AVD - SVI - CXAI HQ\nChungung Park",
    interviewId: "avd-studio-surface", // 기존 인터뷰 섹션 ID
  },
  // SQ&Ops 본부 — hq 표시명 "SQ&Ops", 내부 id는 ops
  "OPS1.png": {
    profileImage: profilePicRel(["ops", "sqd.png"]),
    hq: "SQ&Ops",
    role: "Supplier Quality & Development",
    roleKr: "Supplier Quality & Development",
    roleEn: "Supplier Quality & Development",
    name: "김명규",
    nameKr: "김명규",
    nameEn: "Myoungkyu Kim",
    greeting:
      "안녕하세요\nSQ&Ops본부의 Supplier Quality & Development담당\n김명규입니다",
    greetingKr:
      "안녕하세요\nSQ&Ops본부의 Supplier Quality & Development담당\n김명규입니다",
    greetingEn:
      "Hello\nSupplier Quality & Development, SQ&Ops HQ\nMyoungkyu Kim",
    interviewId: "ops-sqd",
  },
  "OPS2.png": {
    profileImage: profilePicRel(["ops", "operations.png"]),
    hq: "SQ&Ops",
    role: "Operations",
    roleKr: "Operations",
    roleEn: "Operations",
    name: "이승협",
    nameKr: "이승협",
    nameEn: "SeungHyeop Lee",
    greeting:
      "안녕하세요\nSQ&Ops본부의 Operations담당\n이승협입니다",
    greetingKr:
      "안녕하세요\nSQ&Ops본부의 Operations담당\n이승협입니다",
    greetingEn:
      "Hello\nOperations, SQ&Ops HQ\nSeungHyeop Lee",
    interviewId: "ops-operations",
  },
  // ME 본부
  "ME1.png": {
    profileImage: profilePicRel(["me", "me.png"]),
    hq: "ME",
    role: "Manufacturing Engineering",
    roleKr: "Manufacturing Engineering",
    roleEn: "Manufacturing Engineering",
    name: "이해우",
    nameKr: "이해우",
    nameEn: "Haewoo Lee",
    greeting:
      "안녕하세요\nME본부의 Manufacturing Engineering담당\n이해우입니다",
    greetingKr:
      "안녕하세요\nME본부의 Manufacturing Engineering담당\n이해우입니다",
    greetingEn:
      "Hello\nManufacturing Engineering, ME HQ\nHaewoo Lee",
    interviewId: "me-manufacturing-engineering",
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
    profileImage: "./images/profilepic/beca/chassis.png",
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
  // S&E (Software & Electronics) — images/profilepic/s&s/ (URL 경로는 & → %26)
  "SS1.png": {
    profileImage: "./images/profilepic/s%26s/cchppmo.png",
    hq: "S&E",
    role: "Program Management",
    roleKr: "Program Management",
    roleEn: "Program Management",
    name: "김경찬",
    nameKr: "김경찬",
    nameEn: "Kyungchan Kim",
    greeting:
      "안녕하세요\nS&E본부의 Program Management담당\n김경찬입니다",
    greetingKr:
      "안녕하세요\nS&E본부의 Program Management담당\n김경찬입니다",
    greetingEn: "Hello\nProgram Management, S&E HQ\nKyungchan Kim",
    interviewId: "ss-program-management",
  },
  "SS2.png": {
    profileImage: "./images/profilepic/s%26s/compute-platform-hw.png",
    hq: "S&E",
    role: "Compute Platform Hardware",
    roleKr: "Compute Platform Hardware",
    roleEn: "Compute Platform Hardware",
    name: "임일웅",
    nameKr: "임일웅",
    nameEn: "Ilwoong Lim",
    greeting:
      "안녕하세요\nS&E본부의 Compute Platform Hardware담당\n임일웅입니다",
    greetingKr:
      "안녕하세요\nS&E본부의 Compute Platform Hardware담당\n임일웅입니다",
    greetingEn: "Hello\nCompute Platform Hardware, S&E HQ\nIlwoong Lim",
    interviewId: "ss-compute-platform-hw",
  },
  "SS3.png": {
    profileImage: profilePicRel(["ve", "virtual engineering solution3.png"]), // VE 김민정과 동일 인물
    hq: "S&E",
    role: "Electric Platform Hardware",
    roleKr: "Electric Platform Hardware",
    roleEn: "Electric Platform Hardware",
    name: "김민정",
    nameKr: "김민정",
    nameEn: "Minjung Kim",
    greeting:
      "안녕하세요\nS&E본부의 Electric Platform Hardware담당\n김민정입니다",
    greetingKr:
      "안녕하세요\nS&E본부의 Electric Platform Hardware담당\n김민정입니다",
    greetingEn: "Hello\nElectric Platform Hardware, S&E HQ\nMinjung Kim",
    interviewId: "ss-electric-platform-hw",
  },
  "SS4.png": {
    profileImage: "./images/profilepic/s%26s/platform-sw.png",
    hq: "S&E",
    role: "Platform Software",
    roleKr: "Platform Software",
    roleEn: "Platform Software",
    name: "이한별",
    nameKr: "이한별",
    nameEn: "Hanbyul Lee",
    greeting:
      "안녕하세요\nS&E본부의 Platform Software담당\n이한별입니다",
    greetingKr:
      "안녕하세요\nS&E본부의 Platform Software담당\n이한별입니다",
    greetingEn: "Hello\nPlatform Software, S&E HQ\nHanbyul Lee",
    interviewId: "ss-platform-sw",
  },
  "SS5.png": {
    profileImage: "./images/profilepic/s%26s/platform-id.png",
    hq: "S&E",
    role: "Platform Integration & Deployment",
    roleKr: "Platform Integration & Deployment",
    roleEn: "Platform Integration & Deployment",
    name: "정태구",
    nameKr: "정태구",
    nameEn: "Taegu Jung",
    greeting:
      "안녕하세요\nS&E본부의 Platform Integration & Deployment담당\n정태구입니다",
    greetingKr:
      "안녕하세요\nS&E본부의 Platform Integration & Deployment담당\n정태구입니다",
    greetingEn: "Hello\nPlatform Integration & Deployment, S&E HQ\nTaegu Jung",
    interviewId: "ss-platform-id",
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
    hq: "AVD - SVI - CXAI",
    role: "Customer Experience, AI and Innovation",
    roleKr: "Customer Experience, AI and Innovation",
    roleEn: "Customer Experience, AI and Innovation",
    name: "조원주",
    nameKr: "조원주",
    nameEn: "Wonju Jo",
    greeting:
      "안녕하세요\nAVD - SVI - CXAI본부의 Customer Experience, AI and Innovation담당\n조원주입니다",
    greetingKr:
      "안녕하세요\nAVD - SVI - CXAI본부의 Customer Experience, AI and Innovation담당\n조원주입니다",
    greetingEn:
      "Hello\nCustomer Experience, AI and Innovation, AVD - SVI - CXAI HQ\nWonju Jo",
    interviewId: "ee-quality",
  },
  // [비활성] Chief AI & New Tech. Strategy — 조직 폐지로 숨김 (Enterprise AI Solutions로 대체)
  // "EE5.png": {
  //   profileImage: profilePicRel(["EE", "ai chief_new.png"]),
  //   hq: "AVD - SVI - CXAI",
  //   role: "Chief AI & New Tech. Strategy",
  //   roleKr: "Chief AI & New Tech. Strategy",
  //   roleEn: "Chief AI & New Tech. Strategy",
  //   name: "신호재",
  //   nameKr: "신호재",
  //   nameEn: "Hojae Shin",
  //   greeting:
  //     "안녕하세요\nAVD - SVI - CXAI본부의 Chief AI & New Tech. Strategy담당\n신호재입니다",
  //   greetingKr:
  //     "안녕하세요\nAVD - SVI - CXAI본부의 Chief AI & New Tech. Strategy담당\n신호재입니다",
  //   greetingEn:
  //     "Hello\nChief AI & New Tech. Strategy, AVD - SVI - CXAI HQ\nHojae Shin",
  //   interviewId: "ee-ai-chief",
  // },
  "eais1.png": {
    profileImage: profilePicRel(["avd&svi", "eais.png"]),
    hq: "AVD - SVI - CXAI",
    role: "Enterprise AI Solutions",
    roleKr: "Enterprise AI Solutions",
    roleEn: "Enterprise AI Solutions",
    name: "예은실",
    nameKr: "예은실",
    nameEn: "Eunsil Ye",
    greeting:
      "안녕하세요\nAVD - SVI - CXAI본부의 Enterprise AI Solutions담당\n예은실입니다",
    greetingKr:
      "안녕하세요\nAVD - SVI - CXAI본부의 Enterprise AI Solutions담당\n예은실입니다",
    greetingEn:
      "Hello\nEnterprise AI Solutions, AVD - SVI - CXAI HQ\nEunsil Ye",
    interviewId: "avd-enterprise-ai",
  },
  "ise1.png": {
    profileImage: profilePicRel(["avd&svi", "ise.png"]),
    hq: "AVD - SVI - CXAI",
    role: "Innovation Strategy and Excellence",
    roleKr: "Innovation Strategy and Excellence",
    roleEn: "Innovation Strategy and Excellence",
    name: "박주리",
    nameKr: "박주리",
    nameEn: "Juri Park",
    greeting:
      "안녕하세요\nAVD - SVI - CXAI본부의 Innovation Strategy and Excellence담당\n박주리입니다",
    greetingKr:
      "안녕하세요\nAVD - SVI - CXAI본부의 Innovation Strategy and Excellence담당\n박주리입니다",
    greetingEn:
      "Hello\nInnovation Strategy and Excellence, AVD - SVI - CXAI HQ\nJuri Park",
    interviewId: "avd-innovation-strategy",
  },
};

// 인터뷰 내용: interviewId(담당)당 객체 1개. questions = 그 인터뷰 1건의 문항들.
// BECA / ITPE / S&E 본문은 data/interview-content-beca-itpe-ss.json (담당당 인터뷰 1건, VE 제외)
// EE 일부 본문은 data/interview-content-ee.json
// JSON 수정 후 배포 시 ?v= 숫자 올려 캐시 무력화 (CDN,프록시 대비)
const INTERVIEW_CONTENT_BECA_ITPE_SS_URL =
  "./data/interview-content-beca-itpe-ss.json?v=17";
const INTERVIEW_CONTENT_EE_URL = "./data/interview-content-ee.json?v=15";
const INTERVIEW_CONTENT_VE_URL = "./data/interview-content-ve.json?v=14";

async function loadInterviewContentBecaItpeSs() {
  /* URL ?v= 으로 배포 시 무력화; default 캐시로 재방문·이미지와 경합 완화 */
  const res = await fetch(INTERVIEW_CONTENT_BECA_ITPE_SS_URL, {
    cache: "default",
  });
  if (!res.ok) {
    console.warn("[role-interviews] BECA/ITPE/S&E JSON 로드 실패:", res.status);
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
        qEn:"What does the AVD team do?",
        a: "AVD(Advanced Vehicle Development) 담당은 차량 개발의 가장 초기 단계에서 아키텍처(Architecture)와 패키지(Package)를 기반으로 고객이 체감하는 차량의 기본기를 설계하고 기획하는 조직입니다. 우리는 단순히 차를 설계하는 수준을 넘어 혁신적인 아이디어와 프로젝트를 발굴하고 주도하며, GMTCK 전사의 혁신을 이끄는 'Innovation Hub' 역할을 수행하고 있습니다.",
        aKr: "AVD(Advanced Vehicle Development) 담당은 차량 개발의 가장 초기 단계에서 아키텍처(Architecture)와 패키지(Package)를 기반으로 고객이 체감하는 차량의 기본기를 설계하고 기획하는 조직입니다. 우리는 단순히 차를 설계하는 수준을 넘어 혁신적인 아이디어와 프로젝트를 발굴하고 주도하며, GMTCK 전사의 혁신을 이끄는 'Innovation Hub' 역할을 수행하고 있습니다.",
        aEn:"In the early stages of the vehicle development process, our AVD team designs and plans the fundamental aspects of the vehicles that our customers can experience based on Architecture and Package. Beyond designing cars, we foster innovative ideas and projects and serve as an ‘Innovative Hub’, driving innovation across GMTCK.",
      },
      {
        q: "AVD 담당은 고객에게 왜 중요한가요?",
        qKr: "AVD 담당은 고객에게 왜 중요한가요?",
        qEn:"Why is the AVD team important for customers?",
        a: `고객이 실제로 경험하는 주행거리, 공간감, 승차감, 그리고 안전과 가격에 대한 신뢰 같은 차량의 기본기와 상품성은 모두 AVD가 설계하는 아키텍처와 패키지에서 출발합니다. 한 번의 충전이나 주유로 얼마나 효율적으로 멀리 갈 수 있는지 결정하는 Propulsion 영역부터, 승객이 느끼는 시팅 포스처(seating posture)와 헤드룸, 레그룸을 포함한 종합적인 실내 경험까지 모두 우리의 손을 거칩니다. 또한 코너링과 주행 안정성, 정숙성 사이의 균형을 잡고 보이지 않는 차체 구조를 통해 충돌 성능과 안전에 대한 신뢰를 만들어내며, 고객이 지불한 가격 대비 최고의 가치를 누릴 수 있도록 합리적인 사양을 구성합니다. 이처럼 AVD는 성능과 안전, 공간과 가격 사이의 밸런스를 정교하게 조율하여 고객 가치와 브랜드 신뢰를 구축해 나가는 팀입니다.`,
        aKr: `고객이 실제로 경험하는 주행거리, 공간감, 승차감, 그리고 안전과 가격에 대한 신뢰 같은 차량의 기본기와 상품성은 모두 AVD가 설계하는 아키텍처와 패키지에서 출발합니다. 한 번의 충전이나 주유로 얼마나 효율적으로 멀리 갈 수 있는지 결정하는 Propulsion 영역부터, 승객이 느끼는 시팅 포스처(seating posture)와 헤드룸, 레그룸을 포함한 종합적인 실내 경험까지 모두 우리의 손을 거칩니다. 또한 코너링과 주행 안정성, 정숙성 사이의 균형을 잡고 보이지 않는 차체 구조를 통해 충돌 성능과 안전에 대한 신뢰를 만들어내며, 고객이 지불한 가격 대비 최고의 가치를 누릴 수 있도록 합리적인 사양을 구성합니다. 이처럼 AVD는 성능과 안전, 공간과 가격 사이의 밸런스를 정교하게 조율하여 고객 가치와 브랜드 신뢰를 구축해 나가는 팀입니다.`,
        aEn:`Fundamental vehicle features and marketability — such as driving range, spaciousness, ride comfort, and trust in safety and price — come from the architecture and packaging our team designs. From propulsion, which decides how far and how efficiently the vehicle drives on a single charge, to seating posture and comprehensive interior experiences, including headroom and legroom, our team is deeply engaged throughout the vehicle development process.

In addition, we balance cornering performance, driving stability, and quietness. Through the underlying vehicle structure, we build trust in crash performance and safety, and we also define reasonable specifications that enable customers to enjoy the best value for the price. To put it simply, our team adjusts the balance between performance and safety, and between space and price to realize customer value and build our brand trust.`,
      },
      {
        q: "AVD 담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "AVD 담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn:"Which capabilities do we need to conduct the AVD role and responsibility?",
        a: `이러한 업무를 수행하기 위해 AVD는 차량의 전체적인 '큰 그림(Big Picture)'을 설계하며 여러 조직을 하나의 방향으로 연결합니다. 따라서 아키텍처 전반을 아우르는 시야로 최적의 균형점을 찾는 시스템적 사고 능력과 디자인, 파워트레인, 제조, 안전 등 다양한 부서와 효과적으로 소통하는 협업 능력이 무엇보다 중요합니다. 특히 글로벌 벤치마킹과 데이터 분석을 통한 Customer & Market Insight를 바탕으로 고객 가치와 시장의 요구를 정확히 읽어내는 능력은 AVD의 필수적인 역량입니다. 우리는 전동화(Electrification)나 SDV(Software-Defined Vehicle) 같은 새로운 기술을 빠르게 이해하고, 새로운 패키징 아이디어를 스스로 탐색해 시험해 보는 도전적인 태도를 지향하며, 업무 방식을 더 효율적으로 만드는 추진력을 갖추고자 노력하고 있습니다.`,
        aKr: `이러한 업무를 수행하기 위해 AVD는 차량의 전체적인 '큰 그림(Big Picture)'을 설계하며 여러 조직을 하나의 방향으로 연결합니다. 따라서 아키텍처 전반을 아우르는 시야로 최적의 균형점을 찾는 시스템적 사고 능력과 디자인, 파워트레인, 제조, 안전 등 다양한 부서와 효과적으로 소통하는 협업 능력이 무엇보다 중요합니다. 특히 글로벌 벤치마킹과 데이터 분석을 통한 Customer & Market Insight를 바탕으로 고객 가치와 시장의 요구를 정확히 읽어내는 능력은 AVD의 필수적인 역량입니다. 우리는 전동화(Electrification)나 SDV(Software-Defined Vehicle) 같은 새로운 기술을 빠르게 이해하고, 새로운 패키징 아이디어를 스스로 탐색해 시험해 보는 도전적인 태도를 지향하며, 업무 방식을 더 효율적으로 만드는 추진력을 갖추고자 노력하고 있습니다.`,
        aEn:`Our team designs the ‘Big Picture’ and connects multiple teams in one direction. Therefore, having systematic thinking power to find the right balance with an insight embracing all architecture and cooperation capabilities to communicate with different functions, such as Design, Powertrain, Manufacturing, and Safety, is paramount.

Especially, after analyzing global benchmarking and data analysis and drawing Customer & Market Insight, the ability to fully understand customer value and market demand is an essential capability. We pursue identifying new technology quickly, such as Electrification and SDV (Software-Defined Vehicle), a challenging mindset to explore new packaging ideas, and having the momentum to work more efficiently.`,
      },
      {
        q: "AVD 담당의 매력은?",
        qKr: "AVD 담당의 매력은?",
        qEn:"What is attractive about working in AVD?",
        a: `AVD 담당의 매력은 새로운 차량 개발과 전사 Innovation의 선두에서, 차량 개발의 가장 초기 단계에 제품의 방향성과 고객 경험을 결정짓는 핵심 역할을 수행한다는 점에 있습니다. 이 과정에서 다양한 조직과 협업하며 폭넓은 지식과 시야를 확보할 수 있으며, 특히 Architecture와 Package를 통해 차량의 '뼈대'를 설계하는 독보적인 전문성을 쌓을 수 있다는 것이 큰 장점입니다.`,
        aKr: `AVD 담당의 매력은 새로운 차량 개발과 전사 Innovation의 선두에서, 차량 개발의 가장 초기 단계에 제품의 방향성과 고객 경험을 결정짓는 핵심 역할을 수행한다는 점에 있습니다. 이 과정에서 다양한 조직과 협업하며 폭넓은 지식과 시야를 확보할 수 있으며, 특히 Architecture와 Package를 통해 차량의 '뼈대'를 설계하는 독보적인 전문성을 쌓을 수 있다는 것이 큰 장점입니다.`,
        aEn:"The attractive point of working in our team lies in playing a core role at the forefront of the new vehicle development process and company-wide innovation, where we define the product direction and customer experience at the very earliest stage of the process. In doing so, we collaborate with a wide range of organizations and gain broad knowledge and perspective, and in particular, we build distinctive expertise by designing the “frame” of the vehicle through architecture and package.",
      },
      {
        q: "앞으로 AVD 담당이 지향하는 목표는 무엇인가요?",
        qKr: "앞으로 AVD 담당이 지향하는 목표는 무엇인가요?",
        qEn:"What are AVD’s goals going forward?",
        a: `AVD 담당은 앞으로 세 가지 핵심 목표를 지향합니다. 먼저 Customer-Value-Driven Architecture Leader로서 주행거리, 공간, 승차감, 안전, 가격 경쟁력 등 고객이 체감하는 기본기에 미래 고객 요구를 반영한 차세대 Vehicle Structure를 설계하는 조직이 되고자 합니다. 또한 Insight & Benchmarking-Based Decision Hub로서 지속적인 글로벌 벤치마킹과 신규 아이디어 발굴을 통해 프로그램별 고객 가치를 극대화할 것입니다. 마지막으로 Enterprise Innovation & Front-Loading Hub가 되어 품질, 원가, 개발 리드타임을 동시에 개선하고, 새로운 아이디어와 업무 방식을 확산하는 GMTCK의 혁신 거점 역할을 수행하는 것이 우리의 지향점입니다.`,
        aKr: `AVD 담당은 앞으로 세 가지 핵심 목표를 지향합니다. 먼저 Customer-Value-Driven Architecture Leader로서 주행거리, 공간, 승차감, 안전, 가격 경쟁력 등 고객이 체감하는 기본기에 미래 고객 요구를 반영한 차세대 Vehicle Structure를 설계하는 조직이 되고자 합니다. 또한 Insight & Benchmarking-Based Decision Hub로서 지속적인 글로벌 벤치마킹과 신규 아이디어 발굴을 통해 프로그램별 고객 가치를 극대화할 것입니다. 마지막으로 Enterprise Innovation & Front-Loading Hub가 되어 품질, 원가, 개발 리드타임을 동시에 개선하고, 새로운 아이디어와 업무 방식을 확산하는 GMTCK의 혁신 거점 역할을 수행하는 것이 우리의 지향점입니다.`,
        aEn:"AVD is pursuing three key objectives going forward. First, as a Customer-Value-Driven Architecture Leader, we aim to become an organization that designs next-generation vehicle structures that reflect future customer needs in fundamental areas such as driving range, interior space, ride comfort, safety, and price competitiveness that customers can truly feel. Second, as an Insight & Benchmarking-Based Decision Hub, we will maximize customer value for each program through continuous global benchmarking and discovering new ideas. Finally, by becoming an Enterprise Innovation & Front-Loading Hub, we desire to serve as GMTCK’s innovation hub, improving quality, cost, and development lead time simultaneously while spreading new ideas and ways of working across the organization.",
      },
    ],
  },
  "avd-studio-surface": {
    questions: [
      {
        q: "SSI 담당은 어떤 일을 하는 곳인가요?",
        qKr: "SSI 담당은 어떤 일을 하는 곳인가요?",
        qEn:"What does the SSI team do?",
        a: "SSI 담당은 자동차 외관 디자인과 실제 차체 구조가 완벽하게 조화를 이루도록 만드는 팀입니다. 디자이너가 만든 멋진 스케치가 현실적인 안전, 구조 기준을 충족하고, 생산 공장에서 문제없이 조립될 수 있도록 디자인과 엔지니어링 사이를 이어주는 조율자 역할을 합니다.",
        aKr: "SSI 담당은 자동차 외관 디자인과 실제 차체 구조가 완벽하게 조화를 이루도록 만드는 팀입니다. 디자이너가 만든 멋진 스케치가 현실적인 안전, 구조 기준을 충족하고, 생산 공장에서 문제없이 조립될 수 있도록 디자인과 엔지니어링 사이를 이어주는 조율자 역할을 합니다.",
        aEn:"SSI is the team that ensures the vehicle’s exterior design and the actual body structure are perfectly harmonized. It plays a coordinating role between Design and Engineering so that stylish sketches created by designers can meet realistic safety and structural standards and be assembled seamlessly on the production line.",
      },
      {
        q: "SSI 담당은 고객에게 왜 중요한가요?",
        qKr: "SSI 담당은 고객에게 왜 중요한가요?",
        qEn:"Why is the SSI team important for customers?",
        a: "차를 처음 보거나 만질 때 느끼는 품질은 대부분 SSI의 업무와 연결되어 있습니다. 멀리서 보았을 때의 아름다운 비율, 가까이서 보이는 정교한 표면과 틈새(단차), 문을 열고 닫을 때의 느낌, 그리고 외관 부품의 조립 정밀도까지 모두 SSI의 영역입니다. 우리는 기획 단계부터 차가 나올 때까지 이 모든 요소가 고객에게 최상의 품질로 전달되도록 설계하고 관리합니다.",
        aKr: "차를 처음 보거나 만질 때 느끼는 품질은 대부분 SSI의 업무와 연결되어 있습니다. 멀리서 보았을 때의 아름다운 비율, 가까이서 보이는 정교한 표면과 틈새(단차), 문을 열고 닫을 때의 느낌, 그리고 외관 부품의 조립 정밀도까지 모두 SSI의 영역입니다. 우리는 기획 단계부터 차가 나올 때까지 이 모든 요소가 고객에게 최상의 품질로 전달되도록 설계하고 관리합니다.",
        aEn:"Most of the quality you first experience in a car is directly connected to SSI’s work. Everything, from the beautiful proportions from a far distance to the precise surfaces and gaps, the feel of opening and closing the doors, and even the assembly accuracy of the exterior parts, falls within SSI’s scope. From the planning to launch, we design and manage these elements to deliver the highest perceived quality to our customers.",
      },
      {
        q: "차량 개발 과정의 언제부터 SSI가 참여하나요?",
        qKr: "차량 개발 과정의 언제부터 SSI가 참여하나요?",
        qEn:"When does SSI get involved in the vehicle development process?",
        a: '우리는 차의 첫 콘셉트를 잡는 단계부터 참여합니다. 소형 SUV인지 중형 세단인지 방향을 정하고, 휠베이스나 트렁크 공간 등을 나누는 초기 검토를 진행합니다. 이후 개발이 끝날 때까지 "처음 기획한 모습이 실제로 만들어질 수 있는가?"를 끊임없이 확인하며 완성도를 높입니다.',
        aKr: '우리는 차의 첫 콘셉트를 잡는 단계부터 참여합니다. 소형 SUV인지 중형 세단인지 방향을 정하고, 휠베이스나 트렁크 공간 등을 나누는 초기 검토를 진행합니다. 이후 개발이 끝날 때까지 "처음 기획한 모습이 실제로 만들어질 수 있는가?"를 끊임없이 확인하며 완성도를 높입니다.',
        aEn:"We are involved from the very first concept stage of the vehicle. At this point, we define the direction—whether it will be a small SUV or a midsize sedan—and conduct initial studies on items such as wheelbase and trunk space. Throughout development, we continuously verify whether “the vehicle we originally envisioned can actually be built as intended,” refining the design to improve overall completeness.",
      },
      {
        q: "SSI담당에서 일하시는 분들은 주로 어떤 전공 출신인가요?",
        qKr: "SSI담당에서 일하시는 분들은 주로 어떤 전공 출신인가요?",
        qEn:"What majors do people in SSI typically have?",
        a: '가장 많은 비율은 기계공학, 자동차공학, 항공우주공학 등 공학 계열 전공자들입니다. 여기에 산업공학, 전기·전자, 산업디자인 전공자들도 함께 어울려 일하고 있습니다. 전공이 꼭 자동차 전공일 필요는 없지만, "물건이 어떻게 구조를 이루고, 어떻게 만들어지는지"를 좋아하는 분들이 잘 맞는 편입니다. 무엇보다도, 다양한 전공 배경을 가진 사람들이 각자의 강점을 살려 협업하는 문화라, 배우고 섞이려는 태도를 더 중요하게 보고 있습니다.',
        aKr: '가장 많은 비율은 기계공학, 자동차공학, 항공우주공학 등 공학 계열 전공자들입니다. 여기에 산업공학, 전기·전자, 산업디자인 전공자들도 함께 어울려 일하고 있습니다. 전공이 꼭 자동차 전공일 필요는 없지만, "물건이 어떻게 구조를 이루고, 어떻게 만들어지는지"를 좋아하는 분들이 잘 맞는 편입니다. 무엇보다도, 다양한 전공 배경을 가진 사람들이 각자의 강점을 살려 협업하는 문화라, 배우고 섞이려는 태도를 더 중요하게 보고 있습니다.',
        aEn:"Most team members have engineering backgrounds, such as mechanical, automotive, and aerospace engineering. We also work alongside people who majored in industrial engineering, electrical/electronic engineering, and industrial design. Your major doesn’t necessarily have to be automotive, but SSI is a good fit for those who enjoy understanding how things are structured and how they are made. Above all, SSI has a collaborative culture where people with diverse academic backgrounds leverage their own strengths, so we place more value on a learning mindset and willingness to blend and grow together than on any specific major.",
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
        qEn:"What are SSI’s goals going forward?",
        a: "우리의 목표는 고객이 차를 처음 보는 순간부터 오래 사용하는 내내 믿을 수 있는 외관 품질을 경험하게 하는 것입니다. 이를 위해 글로벌 팀과 함께 협력하고, 가상 개발 시스템과 신기술을 빠르게 도입하고 있습니다. 디자인, 설계, 생산 부서와 긴밀하게 소통하며 더 정교하고 완성도 높은 차량을 만들기 위해 오늘도 노력하고 있습니다.",
        aKr: "우리의 목표는 고객이 차를 처음 보는 순간부터 오래 사용하는 내내 믿을 수 있는 외관 품질을 경험하게 하는 것입니다. 이를 위해 글로벌 팀과 함께 협력하고, 가상 개발 시스템과 신기술을 빠르게 도입하고 있습니다. 디자인, 설계, 생산 부서와 긴밀하게 소통하며 더 정교하고 완성도 높은 차량을 만들기 위해 오늘도 노력하고 있습니다.",
        aEn:"Our goal is to enable customers to experience exterior quality they can trust from the moment they first see the car to every day they use it for a long time. To achieve this, we work closely with our global teams and rapidly introduce virtual development systems and new technologies. By communicating closely with Design, Engineering, and Manufacturing, we continue to strive for vehicles with more precise, higher-quality exterior execution.",
      },
    ],
  },
  "avd-enterprise-ai": {
    questions: [
      {
        q: "현재 소속 팀과 하고 계신 업무에 대해 구체적으로 알려주세요.",
        qKr: "현재 소속 팀과 하고 계신 업무에 대해 구체적으로 알려주세요.",
        qEn: "Please tell us about your current team and your responsibilities in detail.",
        a: "Enterprise AI Solutions Team, 줄여서 EAIS Team은 전사적으로 사용할 수 있는 AI Tool을 개발하는 팀입니다. 팀이름 약어 EAIS는 자칭 '에이스 팀'이라고 부르고 있으며, 이름처럼 데이터와 AI, 엔지니어링 각 분야의 에이스들이 모여 있답니다.😁 자동차 한 대를 개발하려면 설계, 해석(CAE), 시험, 품질 관리와 같은 수많은 업무가 이어지고, 그 과정에서 많은 데이터가 만들어 지는데, 이 업무 흐름을 분석하고, 엔지니어가 반복해서 하던 일이나 오래 기다려야 했던 문제를 해결할 수 있는, 그리고 재사용할 수 있는 AI/ML Tool을 개발하는 업무를 진행합니다. 한 팀에서 잘 쓰인 도구를 다른 팀과 글로벌 GM에서도 쓸 수 있게 확장하는 기회를 만들어 내는 업무도 진행합니다.",
        aKr: "Enterprise AI Solutions Team, 줄여서 EAIS Team은 전사적으로 사용할 수 있는 AI Tool을 개발하는 팀입니다. 팀이름 약어 EAIS는 자칭 '에이스 팀'이라고 부르고 있으며, 이름처럼 데이터와 AI, 엔지니어링 각 분야의 에이스들이 모여 있답니다.😁 자동차 한 대를 개발하려면 설계, 해석(CAE), 시험, 품질 관리와 같은 수많은 업무가 이어지고, 그 과정에서 많은 데이터가 만들어 지는데, 이 업무 흐름을 분석하고, 엔지니어가 반복해서 하던 일이나 오래 기다려야 했던 문제를 해결할 수 있는, 그리고 재사용할 수 있는 AI/ML Tool을 개발하는 업무를 진행합니다. 한 팀에서 잘 쓰인 도구를 다른 팀과 글로벌 GM에서도 쓸 수 있게 확장하는 기회를 만들어 내는 업무도 진행합니다.",
        aEn: "The Enterprise AI Solutions Team, or EAIS Team for short, develops AI tools that can be used across the entire company. We like to call ourselves the \"ACE team\" after our abbreviation, and true to the name, we bring together aces in data, AI, and engineering. 😁 Developing a single vehicle involves a long chain of work such as design, analysis (CAE), testing, and quality management, and a lot of data is created along the way. We analyze these workflows and develop reusable AI/ML tools that solve tasks engineers used to repeat over and over or problems they used to wait a long time on. We also create opportunities to expand tools that work well for one team so they can be used by other teams and across global GM.",
      },
      {
        q: "EAIS Team의 역할은 무엇인가요?",
        qKr: "EAIS Team의 역할은 무엇인가요?",
        qEn: "What is the role of the EAIS Team?",
        a: "자동차 산업은 전동화와 SDV 전환으로 빠르게 변화하고 있으며, 복잡해지는 차량을 얼마나 빠르고 완성도 높게 개발하느냐가 중요한 경쟁력이 되고 있습니다. 연구소에 축적된 설계, 해석, 시험 데이터와 엔지니어의 경험을 AI와 연결하면 결과를 미리 예측하고, 필요한 지식을 빠르게 찾고, 반복 업무를 자동화하여 차량 개발의 의사 결정을 앞당길 수 있습니다. Enterprise AI Solutions Team은 지엠테크니컬센터 코리아 기술연구소 모든 팀을 대상으로 엔지니어링과 차량 개발 과정에 AI와 머신러닝을 적용한 도구를 개발하여 차량 개발을 가속화하고, 엔지니어가 더 중요한 문제 해결에 집중할 수 있도록 돕습니다.",
        aKr: "자동차 산업은 전동화와 SDV 전환으로 빠르게 변화하고 있으며, 복잡해지는 차량을 얼마나 빠르고 완성도 높게 개발하느냐가 중요한 경쟁력이 되고 있습니다. 연구소에 축적된 설계, 해석, 시험 데이터와 엔지니어의 경험을 AI와 연결하면 결과를 미리 예측하고, 필요한 지식을 빠르게 찾고, 반복 업무를 자동화하여 차량 개발의 의사 결정을 앞당길 수 있습니다. Enterprise AI Solutions Team은 지엠테크니컬센터 코리아 기술연구소 모든 팀을 대상으로 엔지니어링과 차량 개발 과정에 AI와 머신러닝을 적용한 도구를 개발하여 차량 개발을 가속화하고, 엔지니어가 더 중요한 문제 해결에 집중할 수 있도록 돕습니다.",
        aEn: "The automotive industry is changing rapidly with electrification and the shift to SDVs, and how quickly and how well we can develop increasingly complex vehicles has become a key competitive advantage. By connecting the design, analysis, and test data accumulated at our technical center, along with our engineers' experience, to AI, we can predict results in advance, find the knowledge we need quickly, and automate repetitive work, bringing vehicle development decisions forward. The Enterprise AI Solutions Team develops tools that apply AI and machine learning to engineering and vehicle development for every team at GM Technical Center Korea, accelerating vehicle development and helping engineers focus on solving more important problems.",
      },
      {
        q: "EAIS Team 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "EAIS Team 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn: "What capabilities do you think are needed to work on the EAIS Team?",
        a: "데이터를 다루는 기본기: 복잡한 데이터를 다루고 가공하는 능력입니다. 통계나 SQL에 대한 기본 개념을 알면 도움이 됩니다. 의미있는 결과는 좋은 데이터에서 시작합니다.\n\n기술스택: 컴퓨터 공학의 기본기와 Python 활용 능력, SQL, LLM, 머신러닝·딥러닝 활용에 대한 이해가 필요하며, FastAPI, Docker, Kubernetes 등 AI 애플리케이션 개발·배포 경험이 있다면 더욱 좋습니다!\n\n호기심: 자동차 업무 분야에 대한 호기심과 지속적으로 변화하는 AI 기술에 대한 호기심이 중요합니다. 새로운 것을 즐겁게 배우는 사람이 가장 빨리 성장합니다.\n\n협업과 소통 능력: 그중에서도 가장 중요한 역량입니다. 현업 엔지니어의 고민을 잘 듣고 이해해야 정말 필요한 도구를 만들 수 있고, 만든 도구를 쉽게 설명할 수 있어야 많은 사람이 쓰게 됩니다.\n\n자동차 지식은 함께 일하면서 관심있게 배우면 자연스럽게 쌓이니 걱정하지 마세요 🙂",
        aKr: "데이터를 다루는 기본기: 복잡한 데이터를 다루고 가공하는 능력입니다. 통계나 SQL에 대한 기본 개념을 알면 도움이 됩니다. 의미있는 결과는 좋은 데이터에서 시작합니다.\n\n기술스택: 컴퓨터 공학의 기본기와 Python 활용 능력, SQL, LLM, 머신러닝·딥러닝 활용에 대한 이해가 필요하며, FastAPI, Docker, Kubernetes 등 AI 애플리케이션 개발·배포 경험이 있다면 더욱 좋습니다!\n\n호기심: 자동차 업무 분야에 대한 호기심과 지속적으로 변화하는 AI 기술에 대한 호기심이 중요합니다. 새로운 것을 즐겁게 배우는 사람이 가장 빨리 성장합니다.\n\n협업과 소통 능력: 그중에서도 가장 중요한 역량입니다. 현업 엔지니어의 고민을 잘 듣고 이해해야 정말 필요한 도구를 만들 수 있고, 만든 도구를 쉽게 설명할 수 있어야 많은 사람이 쓰게 됩니다.\n\n자동차 지식은 함께 일하면서 관심있게 배우면 자연스럽게 쌓이니 걱정하지 마세요 🙂",
        aEn: "Data fundamentals: The ability to handle and process complex data. Knowing the basic concepts of statistics and SQL helps. Meaningful results start with good data.\n\nTech stack: You need computer science fundamentals, Python skills, and an understanding of SQL, LLMs, and how to apply machine learning and deep learning. Experience developing and deploying AI applications with tools like FastAPI, Docker, and Kubernetes is even better!\n\nCuriosity: Curiosity about the automotive domain and about ever-changing AI technology is important. People who enjoy learning new things grow the fastest.\n\nCollaboration and communication: This is the most important capability of all. You can only build the tools people truly need by listening to and understanding the concerns of engineers in the field, and a tool only gets widely used if you can explain it simply.\n\nDon't worry about automotive knowledge. If you stay interested and learn as we work together, it will build up naturally 🙂",
      },
      {
        q: "EAIS Team의 매력은?",
        qKr: "EAIS Team의 매력은?",
        qEn: "What makes the EAIS Team appealing?",
        a: "제가 느끼는 우리 팀의 가장 큰 매력은 내가 만든 AI Tool이 실제 자동차 개발에 사용되어 회사의 Business Benefit을 만들어 낸다는 점입니다. 제가 처음 만든 자동화 도구를 동료 엔지니어가 써 보고 \"시간이 크게 줄었다\"며 기뻐하던 순간은 지금도 큰 보람으로 남아 있습니다. 또 설계, 해석, 시험, 품질 등 다양한 분야의 엔지니어와 함께 일하다 보니 자동차 개발 전체를 넓게 이해할 수 있고, 글로벌 GM 동료들과 협업할 기회도 있습니다. 마지막으로 팀 분위기도 자랑하고 싶습니다. 우리 팀은 함께 공부하는 시간을 따로 가지고, 각자 새로 배운 것을 나누면서 성장합니다. 모르는 것은 편하게 묻고, 새로운 시도가 잘 되지 않아도 격려하는 분위기입니다. 사람들이 즐겁게 일하고, 배우고, 성장할 수 있는 시간과 공간을 만드는 것, 그것이 우리 팀이 가장 소중하게 생각하는 문화입니다.",
        aKr: "제가 느끼는 우리 팀의 가장 큰 매력은 내가 만든 AI Tool이 실제 자동차 개발에 사용되어 회사의 Business Benefit을 만들어 낸다는 점입니다. 제가 처음 만든 자동화 도구를 동료 엔지니어가 써 보고 \"시간이 크게 줄었다\"며 기뻐하던 순간은 지금도 큰 보람으로 남아 있습니다. 또 설계, 해석, 시험, 품질 등 다양한 분야의 엔지니어와 함께 일하다 보니 자동차 개발 전체를 넓게 이해할 수 있고, 글로벌 GM 동료들과 협업할 기회도 있습니다. 마지막으로 팀 분위기도 자랑하고 싶습니다. 우리 팀은 함께 공부하는 시간을 따로 가지고, 각자 새로 배운 것을 나누면서 성장합니다. 모르는 것은 편하게 묻고, 새로운 시도가 잘 되지 않아도 격려하는 분위기입니다. 사람들이 즐겁게 일하고, 배우고, 성장할 수 있는 시간과 공간을 만드는 것, 그것이 우리 팀이 가장 소중하게 생각하는 문화입니다.",
        aEn: "For me, the biggest appeal of our team is that the AI tools I build are used in real vehicle development and create business benefits for the company. The moment a fellow engineer tried the first automation tool I built and happily told me it had cut their time dramatically still stays with me as a great reward. Working with engineers from many fields, including design, analysis, testing, and quality, also gives me a broad understanding of vehicle development as a whole, and there are opportunities to collaborate with colleagues across global GM. Finally, I want to brag about our team atmosphere. We set aside time to study together and grow by sharing what each of us has newly learned. It is easy to ask about what you don't know, and people encourage you even when a new attempt doesn't work out. Creating the time and space for people to enjoy their work, learn, and grow is the culture our team values most.",
      },
      {
        q: "앞으로 EAIS Team이 지향하는 목표는 무엇인가요?",
        qKr: "앞으로 EAIS Team이 지향하는 목표는 무엇인가요?",
        qEn: "What goals is the EAIS Team aiming for going forward?",
        a: "EAIS Team은 AI로 엔지니어링을 혁신하고, 더 빠른 차량 개발을 돕는 팀이 되고자 합니다. 우리가 그리는 모습은 세 가지입니다.\n\n• 현업 엔지니어와 함께 고민하며 매일 쓰는 실용적인 AI Tool을 만드는 팀\n• 한 번 만든 도구를 여러 팀과 글로벌 GM에서 함께 쓸 수 있도록 넓혀 가는 팀\n• 새로운 AI 기술을 빠르게 익혀 연구소 업무에 먼저 연결해 보는 팀\n\n결국 우리가 바라는 것은 연구소의 모든 엔지니어가 AI를 든든한 동료처럼 쓰는 모습입니다. 그 변화를 함께 만들어 갈 동료를 언제나 기다립니다.",
        aKr: "EAIS Team은 AI로 엔지니어링을 혁신하고, 더 빠른 차량 개발을 돕는 팀이 되고자 합니다. 우리가 그리는 모습은 세 가지입니다.\n\n• 현업 엔지니어와 함께 고민하며 매일 쓰는 실용적인 AI Tool을 만드는 팀\n• 한 번 만든 도구를 여러 팀과 글로벌 GM에서 함께 쓸 수 있도록 넓혀 가는 팀\n• 새로운 AI 기술을 빠르게 익혀 연구소 업무에 먼저 연결해 보는 팀\n\n결국 우리가 바라는 것은 연구소의 모든 엔지니어가 AI를 든든한 동료처럼 쓰는 모습입니다. 그 변화를 함께 만들어 갈 동료를 언제나 기다립니다.",
        aEn: "The EAIS Team aims to innovate engineering with AI and help develop vehicles faster. We picture ourselves in three ways:\n\n• A team that works through problems with engineers in the field to build practical AI tools they use every day\n• A team that expands each tool it builds so that many teams and global GM can use it together\n• A team that quickly learns new AI technologies and is the first to connect them to our technical center's work\n\nUltimately, what we hope for is a future where every engineer at our technical center uses AI like a reliable colleague. We are always looking for colleagues to build that change with us.",
      },
    ],
  },
  "avd-innovation-strategy": {
    questions: [
      {
        q: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qKr: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qEn: "Please tell us your current role & responsibilities specifically.",
        a: "저는 CXAI 담당의 ISE(Innovation Strategy and Excellence) 팀에서 OpEx (Operational Excellence) 코치로 일하고 있습니다. OpEx 는 회사 안에서 생기는 시간 낭비와 비용 낭비를 데이터로 찾아내고 개선하는 문제 해결 방법입니다. 엔지니어들이 \"시험 비용을 줄이고 싶다\", \"검토 과정이 너무 오래 걸린다\" 같은 고민을 가져오면, 문제를 정의하고 원인을 분석해 개선 결과를 확인하기까지 전 과정을 함께합니다. 쉽게 말해 사내 엔지니어들의 '문제 해결 코치'입니다. 최근에는 AI를 활용해 코칭과 성과 관리를 더 쉽게 만드는 도구도 직접 만들고 있습니다.",
        aKr: "저는 CXAI 담당의 ISE(Innovation Strategy and Excellence) 팀에서 OpEx (Operational Excellence) 코치로 일하고 있습니다. OpEx 는 회사 안에서 생기는 시간 낭비와 비용 낭비를 데이터로 찾아내고 개선하는 문제 해결 방법입니다. 엔지니어들이 \"시험 비용을 줄이고 싶다\", \"검토 과정이 너무 오래 걸린다\" 같은 고민을 가져오면, 문제를 정의하고 원인을 분석해 개선 결과를 확인하기까지 전 과정을 함께합니다. 쉽게 말해 사내 엔지니어들의 '문제 해결 코치'입니다. 최근에는 AI를 활용해 코칭과 성과 관리를 더 쉽게 만드는 도구도 직접 만들고 있습니다.",
        aEn: "I work as an OpEx (Operational Excellence) coach on the ISE (Innovation Strategy and Excellence) team within the CXAI organization. OpEx is a problem-solving method that uses data to find and eliminate wasted time and cost inside the company. When engineers come to us with concerns like \"I want to reduce test costs\" or \"the review process takes too long,\" I work with them through the entire process, from defining the problem and analyzing the root cause to confirming the results of the improvement. Simply put, I am a \"problem-solving coach\" for our engineers. Recently, I have also been building tools that use AI to make coaching and performance management easier.",
      },
      {
        q: "팀 소개를 부탁드립니다.",
        qKr: "팀 소개를 부탁드립니다.",
        qEn: "Please introduce your team.",
        a: "ISE팀은 \"어떻게 하면 더 좋은 아이디어를 더 빨리 실제 차에 담을 수 있을까?\"를 고민하는 GMTCK의 혁신 팀입니다. 크게 세 가지 일을 합니다.\n\n• 고객 니즈 기반 신기술 발굴: 고객이 무엇을 불편해하고 무엇을 원하는지에서 출발해, 그 니즈를 해결할 새로운 기술을 국내외 전시회와 협력사에서 찾아냅니다. 쓸 만한 아이디어는 3D 프린터로 Mock-up(간단한 시제품)을 만들어 눈으로 보여줍니다.\n• 아이디어를 특허로: 직원들의 아이디어를 다듬어 특허로 출원하고, Forum과 Workshop을 열어 회사 전체에 혁신 문화를 퍼뜨립니다.\n• 문제 해결 코칭: DFSS, OPEX(Operational Excellence), TRIZ 같은 문제 해결 방법을 교육하고, 실제 프로젝트가 성과를 내도록 코치로 함께합니다. 올해는 저희가 코칭한 과제 2건이 GM 글로벌 OpEx Symposium에서 상을 받기도 했습니다.\n\n인턴으로 함께하신다면 고객 니즈 조사와 신기술 탐색, Mock-up 제작, 실제 과제의 데이터 정리, AI를 활용한 업무 자동화 등에 참여하며 회사에서 혁신이 어떻게 만들어지는지 직접 경험하실 수 있습니다.",
        aKr: "ISE팀은 \"어떻게 하면 더 좋은 아이디어를 더 빨리 실제 차에 담을 수 있을까?\"를 고민하는 GMTCK의 혁신 팀입니다. 크게 세 가지 일을 합니다.\n\n• 고객 니즈 기반 신기술 발굴: 고객이 무엇을 불편해하고 무엇을 원하는지에서 출발해, 그 니즈를 해결할 새로운 기술을 국내외 전시회와 협력사에서 찾아냅니다. 쓸 만한 아이디어는 3D 프린터로 Mock-up(간단한 시제품)을 만들어 눈으로 보여줍니다.\n• 아이디어를 특허로: 직원들의 아이디어를 다듬어 특허로 출원하고, Forum과 Workshop을 열어 회사 전체에 혁신 문화를 퍼뜨립니다.\n• 문제 해결 코칭: DFSS, OPEX(Operational Excellence), TRIZ 같은 문제 해결 방법을 교육하고, 실제 프로젝트가 성과를 내도록 코치로 함께합니다. 올해는 저희가 코칭한 과제 2건이 GM 글로벌 OpEx Symposium에서 상을 받기도 했습니다.\n\n인턴으로 함께하신다면 고객 니즈 조사와 신기술 탐색, Mock-up 제작, 실제 과제의 데이터 정리, AI를 활용한 업무 자동화 등에 참여하며 회사에서 혁신이 어떻게 만들어지는지 직접 경험하실 수 있습니다.",
        aEn: "The ISE team is GMTCK's innovation team, always asking, \"How can we bring better ideas into real vehicles, faster?\" We do three main things:\n\n• Discovering new technologies based on customer needs: Starting from what customers find inconvenient and what they want, we look for new technologies that address those needs at exhibitions in Korea and abroad and among our suppliers. For promising ideas, we build mock-ups (simple prototypes) with 3D printers so people can see them for themselves.\n• Turning ideas into patents: We refine employees' ideas and file them as patents, and we host forums and workshops to spread a culture of innovation across the company.\n• Problem-solving coaching: We teach problem-solving methods such as DFSS, OpEx (Operational Excellence), and TRIZ, and work alongside real projects as coaches to help them deliver results. This year, two projects we coached won awards at GM's global OpEx Symposium.\n\nIf you join us as an intern, you can take part in customer needs research, new technology scouting, mock-up building, organizing data for real projects, and automating work with AI, and experience firsthand how innovation happens inside a company.",
      },
      {
        q: "업무 수행에 필요한 역량은 무엇이라고 생각하시나요?",
        qKr: "업무 수행에 필요한 역량은 무엇이라고 생각하시나요?",
        qEn: "Which capabilities do we need to have for your role?",
        a: "가장 중요한 것은 호기심입니다. \"이건 왜 이렇게 할까?\", \"더 좋은 방법은 없을까?\"라는 질문을 자주 던지는 분이라면 즐겁게 일할 수 있습니다. 또 처음 보는 분야의 이야기를 빠르게 이해하고 다른 사람이 알아듣기 쉽게 정리하는 능력이 큰 힘이 됩니다. 문제 해결 방법론, 특허, AI 도구는 미리 몰라도 괜찮습니다. 팀에서 함께 배우면 됩니다. Excel로 데이터를 정리해 보거나 AI 도구를 써 본 경험이 있다면 조금 더 빨리 적응할 수 있습니다.",
        aKr: "가장 중요한 것은 호기심입니다. \"이건 왜 이렇게 할까?\", \"더 좋은 방법은 없을까?\"라는 질문을 자주 던지는 분이라면 즐겁게 일할 수 있습니다. 또 처음 보는 분야의 이야기를 빠르게 이해하고 다른 사람이 알아듣기 쉽게 정리하는 능력이 큰 힘이 됩니다. 문제 해결 방법론, 특허, AI 도구는 미리 몰라도 괜찮습니다. 팀에서 함께 배우면 됩니다. Excel로 데이터를 정리해 보거나 AI 도구를 써 본 경험이 있다면 조금 더 빨리 적응할 수 있습니다.",
        aEn: "The most important thing is curiosity. If you often ask questions like \"Why do we do it this way?\" or \"Isn't there a better way?\", you will enjoy this work. The ability to quickly understand topics from unfamiliar fields and summarize them so others can easily follow is also a big strength. It's fine if you don't know problem-solving methodologies, patents, or AI tools in advance; you can learn them with the team. If you have experience organizing data in Excel or using AI tools, you'll be able to adapt a bit faster.",
      },
      {
        q: "팀 문화나 함께 일하는 동료들은 어떤가요?",
        qKr: "팀 문화나 함께 일하는 동료들은 어떤가요?",
        qEn: "How do you think about your team culture and teammates working together?",
        a: "우리 팀에는 설계, 품질, 시험 등 다양한 분야에서 오래 일한 코치와 전문가들이 모여 있습니다. 모두 가르치고 배우는 것을 좋아해서, 궁금한 것을 물어보면 누구든 친절하게 알려줍니다. \"일단 해 보고 실패에서 배우자\"는 분위기라 연차와 관계없이 아이디어를 편하게 낼 수 있습니다. 팀 전용 AI 비서를 직접 만들어 업무에 쓰는 등, 새로운 방식을 가장 먼저 시도해 보는 팀이기도 합니다.",
        aKr: "우리 팀에는 설계, 품질, 시험 등 다양한 분야에서 오래 일한 코치와 전문가들이 모여 있습니다. 모두 가르치고 배우는 것을 좋아해서, 궁금한 것을 물어보면 누구든 친절하게 알려줍니다. \"일단 해 보고 실패에서 배우자\"는 분위기라 연차와 관계없이 아이디어를 편하게 낼 수 있습니다. 팀 전용 AI 비서를 직접 만들어 업무에 쓰는 등, 새로운 방식을 가장 먼저 시도해 보는 팀이기도 합니다.",
        aEn: "Our team brings together coaches and experts with long careers in fields such as design, quality, and testing. Everyone enjoys teaching and learning, so whoever you ask will kindly help when you have a question. Our attitude is \"try it first and learn from failure,\" so anyone can comfortably share ideas regardless of seniority. We are also a team that is first to try new ways of working, such as building our own team AI assistant and using it in our daily work.",
      },
      {
        q: "내게 GMTCK란?",
        qKr: "내게 GMTCK란?",
        qEn: "What does GMTCK mean to you?",
        a: "저에게 GMTCK는 작은 개선이 큰 변화가 되는 곳입니다. 엔지니어 한 명의 작은 문제의식이 코칭을 거쳐 실제 비용 절감과 시간 단축으로 이어지고, 그 결과가 전 세계 GM 동료들에게 인정받는 순간을 가까이에서 볼 수 있습니다. 매번 다른 분야의 과제를 만나다 보니 차 한 대가 만들어지는 전 과정을 자연스럽게 배울 수 있다는 점도 큰 매력입니다.",
        aKr: "저에게 GMTCK는 작은 개선이 큰 변화가 되는 곳입니다. 엔지니어 한 명의 작은 문제의식이 코칭을 거쳐 실제 비용 절감과 시간 단축으로 이어지고, 그 결과가 전 세계 GM 동료들에게 인정받는 순간을 가까이에서 볼 수 있습니다. 매번 다른 분야의 과제를 만나다 보니 차 한 대가 만들어지는 전 과정을 자연스럽게 배울 수 있다는 점도 큰 매력입니다.",
        aEn: "For me, GMTCK is a place where small improvements become big changes. I get to see up close how one engineer's small sense of a problem turns, through coaching, into real cost savings and time reductions, and how those results are recognized by GM colleagues around the world. Since I meet projects from a different field every time, I also naturally learn the entire process of how a vehicle is made, which is a big draw.",
      },
    ],
  },
  "ops-sqd": {
    questions: [
      {
        q: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qKr: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qEn: "Please tell us your current role & responsibilities specifically.",
        a: "SQD(Supplier Quality & Development)는 차량에 적용되는 부품이 설계 의도와 품질 기준을 만족하면서 안정적으로 양산될 수 있도록 협력사의 품질 수준을 개발하고 관리하는 조직입니다. 신차 개발 초기부터 잠재적인 품질 리스크를 찾아내고, 양산 이후에는 품질이 안정적으로 유지되도록 관리하는 것이 핵심입니다.\n\nSupplier Quality Engineer는 담당 부품의 도면과 기술 사양을 바탕으로 개발·양산·시장 품질·Part Warranty까지 부품 품질의 전 과정을 관리합니다. 개발 단계에서는 도면과 사양을 검토해 잠재 리스크를 확인하고, APQP, PPAP, PFMEA, Control Plan 등 품질 프로세스를 기반으로 협력사의 개발 준비 수준과 공정 리스크를 점검합니다. Run at Rate, 공정 감사, 제품·공정 검증, 시제품 및 양산 초기 부품 확인을 통해 설계 의도와 품질 기준이 실제 생산 현장에서 구현되는지도 확인합니다.\n\n양산 중 품질 이슈가 발생하면 협력업체와 함께 현상 파악, 원인 분석, 임시 조치, 근본 대책 수립과 효과 검증을 진행합니다. 시장에서 발생하는 Part Warranty 및 고객 품질 데이터는 관련 조직과 분석해 재발 방지 활동으로 연결합니다. 또한 신차 Launch 단계에서는 GVDP 일정에 맞춰 Supplier Readiness, PPAP, Run at Rate와 주요 품질 리스크를 종합적으로 관리합니다.",
        aKr: "SQD(Supplier Quality & Development)는 차량에 적용되는 부품이 설계 의도와 품질 기준을 만족하면서 안정적으로 양산될 수 있도록 협력사의 품질 수준을 개발하고 관리하는 조직입니다. 신차 개발 초기부터 잠재적인 품질 리스크를 찾아내고, 양산 이후에는 품질이 안정적으로 유지되도록 관리하는 것이 핵심입니다.\n\nSupplier Quality Engineer는 담당 부품의 도면과 기술 사양을 바탕으로 개발·양산·시장 품질·Part Warranty까지 부품 품질의 전 과정을 관리합니다. 개발 단계에서는 도면과 사양을 검토해 잠재 리스크를 확인하고, APQP, PPAP, PFMEA, Control Plan 등 품질 프로세스를 기반으로 협력사의 개발 준비 수준과 공정 리스크를 점검합니다. Run at Rate, 공정 감사, 제품·공정 검증, 시제품 및 양산 초기 부품 확인을 통해 설계 의도와 품질 기준이 실제 생산 현장에서 구현되는지도 확인합니다.\n\n양산 중 품질 이슈가 발생하면 협력업체와 함께 현상 파악, 원인 분석, 임시 조치, 근본 대책 수립과 효과 검증을 진행합니다. 시장에서 발생하는 Part Warranty 및 고객 품질 데이터는 관련 조직과 분석해 재발 방지 활동으로 연결합니다. 또한 신차 Launch 단계에서는 GVDP 일정에 맞춰 Supplier Readiness, PPAP, Run at Rate와 주요 품질 리스크를 종합적으로 관리합니다.",
        aEn: "SQD (Supplier Quality & Development) is the organization that develops and manages our suppliers' quality levels so that the parts used in our vehicles meet design intent and quality standards and can be mass-produced reliably. The core of our work is identifying potential quality risks from the earliest stages of new vehicle development and making sure quality stays stable after production begins.\n\nA Supplier Quality Engineer manages the entire lifecycle of part quality, from development and production to field quality and part warranty, based on the drawings and technical specifications of the parts they are responsible for. In the development phase, we review drawings and specifications to identify potential risks, and we check suppliers' development readiness and process risks based on quality processes such as APQP, PPAP, PFMEA, and Control Plans. Through Run at Rate, process audits, product and process validation, and checks on prototype and early-production parts, we also confirm that design intent and quality standards are actually realized on the production floor.\n\nWhen a quality issue arises during production, we work with the supplier to understand the symptoms, analyze the root cause, implement containment, establish permanent corrective actions, and verify their effectiveness. Part warranty and customer quality data from the field are analyzed with related organizations and turned into actions that prevent recurrence. During new vehicle launches, we comprehensively manage supplier readiness, PPAP, Run at Rate, and key quality risks in line with the GVDP schedule.",
      },
      {
        q: "하루 업무에 대해 소개해주세요.",
        qKr: "하루 업무에 대해 소개해주세요.",
        qEn: "Please describe a typical day at work.",
        a: "SQD의 하루는 담당 프로그램과 협력사의 품질 현황, 전날 발생한 이슈, 당일 회의와 현장 일정을 확인하고 우선순위를 정하는 것으로 시작됩니다. 신차 개발 중인 경우에는 주요 마일스톤과 협력사의 준비 현황을 중심으로 점검합니다.\n\n이후 협력사, 설계, 구매, 제조, 공장 품질 등 관련 조직과 이슈 대응 방향을 조율합니다. 회의에서는 자료 검토에 그치지 않고, 대책이 실제 공정에 적용되었는지, 작업 표준과 검사 방법이 적절한지, 양산 조건에서 재현 가능한지를 확인합니다.\n\n필요한 경우 협력사나 공장을 방문해 공정 흐름, 작업 조건, 자재 관리, 생산 능력과 검사 체계를 직접 확인합니다. 현장 결과는 데이터와 증거를 바탕으로 정리하고, 담당자별 조치·기한·검증 방법을 명확히 한 뒤 진행 상황을 추적합니다.\n\n양산 단계에서는 생산 및 품질 데이터를 모니터링하고, 공정 변경이나 반복 이슈에 대한 후속 조치를 관리합니다. Part Warranty나 시장 품질 이슈가 발생하면 고객 영향 최소화와 신속한 원인 규명을 우선으로 대응하며, 주요 현황은 글로벌 동료와 리더십에 공유합니다.",
        aKr: "SQD의 하루는 담당 프로그램과 협력사의 품질 현황, 전날 발생한 이슈, 당일 회의와 현장 일정을 확인하고 우선순위를 정하는 것으로 시작됩니다. 신차 개발 중인 경우에는 주요 마일스톤과 협력사의 준비 현황을 중심으로 점검합니다.\n\n이후 협력사, 설계, 구매, 제조, 공장 품질 등 관련 조직과 이슈 대응 방향을 조율합니다. 회의에서는 자료 검토에 그치지 않고, 대책이 실제 공정에 적용되었는지, 작업 표준과 검사 방법이 적절한지, 양산 조건에서 재현 가능한지를 확인합니다.\n\n필요한 경우 협력사나 공장을 방문해 공정 흐름, 작업 조건, 자재 관리, 생산 능력과 검사 체계를 직접 확인합니다. 현장 결과는 데이터와 증거를 바탕으로 정리하고, 담당자별 조치·기한·검증 방법을 명확히 한 뒤 진행 상황을 추적합니다.\n\n양산 단계에서는 생산 및 품질 데이터를 모니터링하고, 공정 변경이나 반복 이슈에 대한 후속 조치를 관리합니다. Part Warranty나 시장 품질 이슈가 발생하면 고객 영향 최소화와 신속한 원인 규명을 우선으로 대응하며, 주요 현황은 글로벌 동료와 리더십에 공유합니다.",
        aEn: "A day in SQD starts by checking the quality status of our programs and suppliers, any issues from the previous day, and the day's meetings and site visits, and then setting priorities. When a new vehicle is in development, we focus on key milestones and supplier readiness.\n\nWe then align on how to respond to issues with suppliers and related organizations such as engineering, purchasing, manufacturing, and plant quality. In meetings, we don't stop at reviewing documents; we check whether countermeasures have actually been applied to the process, whether work standards and inspection methods are appropriate, and whether results can be reproduced under production conditions.\n\nWhen needed, we visit suppliers or plants to see the process flow, working conditions, material handling, production capacity, and inspection systems firsthand. We organize what we find on site based on data and evidence, clarify the actions, deadlines, and verification methods for each owner, and track progress.\n\nIn the production phase, we monitor production and quality data and manage follow-up on process changes and recurring issues. When a part warranty or field quality issue occurs, we prioritize minimizing customer impact and quickly identifying the cause, and we share key status updates with global colleagues and leadership.",
      },
      {
        q: "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn: "What capabilities do you think are needed for this role?",
        a: "첫째는 도면, 제품 기능과 제조 공정을 이해하는 기술적 역량입니다. 부품의 기능과 생산 방식을 이해해야 공정 변화가 제품 품질에 미치는 영향을 판단할 수 있습니다. APQP, PPAP, PFMEA, Control Plan, MSA, SPC, 8D 등 핵심 품질 도구를 실무에 적용하는 능력도 필요합니다.\n\n둘째는 데이터 기반의 구조적 문제 해결 능력입니다. 품질 문제를 현상이나 책임 소재로만 바라보지 않고, 문제를 명확히 정의한 뒤 데이터를 수집하고 원인을 검증해야 합니다. 임시 조치, 근본 원인 제거, 재발 방지와 효과 확인까지 논리적으로 연결하는 역량이 중요합니다.\n\n셋째는 협업과 커뮤니케이션 역량입니다. SQD는 협력사뿐 아니라 설계, 구매, 제조, 공장 품질, 프로그램, 글로벌 조직과 함께 일합니다. 각 조직의 관점과 제약 조건을 이해하면서도 품질 기준과 고객 관점은 분명하게 전달해야 하며, 글로벌 협업을 위한 영어 소통 능력도 도움이 됩니다.\n\n마지막으로 Ownership, 판단력과 실행력이 필요합니다. 일정과 품질 사이에서 우선순위를 정하고, 필요한 사람을 연결해 이슈를 끝까지 해결해야 합니다. 문제를 조기에 공유하고 선제적으로 대응하는 태도, 협력사의 개선을 이끌어 내는 추진력이 SQD 엔지니어에게 중요한 역량입니다.",
        aKr: "첫째는 도면, 제품 기능과 제조 공정을 이해하는 기술적 역량입니다. 부품의 기능과 생산 방식을 이해해야 공정 변화가 제품 품질에 미치는 영향을 판단할 수 있습니다. APQP, PPAP, PFMEA, Control Plan, MSA, SPC, 8D 등 핵심 품질 도구를 실무에 적용하는 능력도 필요합니다.\n\n둘째는 데이터 기반의 구조적 문제 해결 능력입니다. 품질 문제를 현상이나 책임 소재로만 바라보지 않고, 문제를 명확히 정의한 뒤 데이터를 수집하고 원인을 검증해야 합니다. 임시 조치, 근본 원인 제거, 재발 방지와 효과 확인까지 논리적으로 연결하는 역량이 중요합니다.\n\n셋째는 협업과 커뮤니케이션 역량입니다. SQD는 협력사뿐 아니라 설계, 구매, 제조, 공장 품질, 프로그램, 글로벌 조직과 함께 일합니다. 각 조직의 관점과 제약 조건을 이해하면서도 품질 기준과 고객 관점은 분명하게 전달해야 하며, 글로벌 협업을 위한 영어 소통 능력도 도움이 됩니다.\n\n마지막으로 Ownership, 판단력과 실행력이 필요합니다. 일정과 품질 사이에서 우선순위를 정하고, 필요한 사람을 연결해 이슈를 끝까지 해결해야 합니다. 문제를 조기에 공유하고 선제적으로 대응하는 태도, 협력사의 개선을 이끌어 내는 추진력이 SQD 엔지니어에게 중요한 역량입니다.",
        aEn: "First, technical capability to understand drawings, product function, and manufacturing processes. You need to understand how a part works and how it is produced to judge how process changes affect product quality. The ability to apply core quality tools such as APQP, PPAP, PFMEA, Control Plans, MSA, SPC, and 8D in practice is also necessary.\n\nSecond, structured, data-driven problem solving. Rather than looking at quality problems only in terms of symptoms or who is at fault, you need to define the problem clearly, collect data, and verify the cause. The ability to logically connect containment, root cause elimination, recurrence prevention, and effectiveness checks is important.\n\nThird, collaboration and communication. SQD works not only with suppliers but also with engineering, purchasing, manufacturing, plant quality, program teams, and global organizations. You need to understand each organization's perspective and constraints while clearly communicating quality standards and the customer's point of view, and English communication skills for global collaboration are a plus.\n\nFinally, ownership, judgment, and the ability to execute. You have to set priorities between schedule and quality, bring the right people together, and see issues through to resolution. An attitude of sharing problems early and responding proactively, along with the drive to lead suppliers to improve, are key capabilities for an SQD engineer.",
      },
      {
        q: "진행하셨던 프로젝트 중 인상 깊었던 프로젝트가 있나요?",
        qKr: "진행하셨던 프로젝트 중 인상 깊었던 프로젝트가 있나요?",
        qEn: "Is there a project that left a strong impression on you?",
        a: "SQD를 대표하는 프로젝트로는 신차 Launch 과정에서 협력사의 부품 개발과 양산 준비를 안정화한 사례를 들 수 있습니다. 양산을 앞두고 핵심 부품의 공정 리스크나 품질 이슈가 확인되면, 협력사의 공정·제출 자료·검증 결과를 재점검하고 우선순위에 따라 대책을 수립합니다.\n\n이 과정에서 SQD는 협력업체, DRE, MO, MQ와 긴밀하게 커뮤니케이션하며 문제를 함께 해결합니다. DRE는 도면과 설계 의도, MO는 제조 공정과 생산 조건, MQ는 양산 현장의 품질 기준과 검사 체계를 중심으로 리스크를 검토합니다. 각 조직의 관점이 다를 수 있기 때문에 정기적인 이슈 리뷰와 현장 확인을 통해 문제의 현상, 고객 영향, 원인, 대책과 완료 기준을 동일하게 정렬하는 것이 중요합니다.\n\n협력사 현장에서는 공정 흐름과 작업 조건을 확인하고, 관련 조직과 함께 임시 선별 및 검사 강화, 공정 조건 개선, 검사 체계 보완, 작업 표준 개정 등의 조치를 단계적으로 실행합니다. 조치별 담당자와 완료 일정을 명확히 관리하며, 실제 생산 조건에서 동일한 품질이 반복되는지 DRE·MO·MQ와 함께 검증합니다. 이를 통해 품질 리스크를 양산 전에 최소화하고, 가능한 리스크는 사전에 제거해 안정적인 Launch로 연결합니다.\n\n이러한 협업은 PPAP 승인, Run at Rate 완료, Launch risk 해소와 초기 품질 안정화로 이어집니다. 이 프로젝트가 보여주는 SQD의 핵심은 협력업체에 요구사항을 전달하는 데 그치지 않고, DRE·MO·MQ와 공통의 해결 방향을 만든 뒤 협력업체의 공정과 시스템에 실제로 정착시키는 것입니다.",
        aKr: "SQD를 대표하는 프로젝트로는 신차 Launch 과정에서 협력사의 부품 개발과 양산 준비를 안정화한 사례를 들 수 있습니다. 양산을 앞두고 핵심 부품의 공정 리스크나 품질 이슈가 확인되면, 협력사의 공정·제출 자료·검증 결과를 재점검하고 우선순위에 따라 대책을 수립합니다.\n\n이 과정에서 SQD는 협력업체, DRE, MO, MQ와 긴밀하게 커뮤니케이션하며 문제를 함께 해결합니다. DRE는 도면과 설계 의도, MO는 제조 공정과 생산 조건, MQ는 양산 현장의 품질 기준과 검사 체계를 중심으로 리스크를 검토합니다. 각 조직의 관점이 다를 수 있기 때문에 정기적인 이슈 리뷰와 현장 확인을 통해 문제의 현상, 고객 영향, 원인, 대책과 완료 기준을 동일하게 정렬하는 것이 중요합니다.\n\n협력사 현장에서는 공정 흐름과 작업 조건을 확인하고, 관련 조직과 함께 임시 선별 및 검사 강화, 공정 조건 개선, 검사 체계 보완, 작업 표준 개정 등의 조치를 단계적으로 실행합니다. 조치별 담당자와 완료 일정을 명확히 관리하며, 실제 생산 조건에서 동일한 품질이 반복되는지 DRE·MO·MQ와 함께 검증합니다. 이를 통해 품질 리스크를 양산 전에 최소화하고, 가능한 리스크는 사전에 제거해 안정적인 Launch로 연결합니다.\n\n이러한 협업은 PPAP 승인, Run at Rate 완료, Launch risk 해소와 초기 품질 안정화로 이어집니다. 이 프로젝트가 보여주는 SQD의 핵심은 협력업체에 요구사항을 전달하는 데 그치지 않고, DRE·MO·MQ와 공통의 해결 방향을 만든 뒤 협력업체의 공정과 시스템에 실제로 정착시키는 것입니다.",
        aEn: "A project that represents SQD well is stabilizing supplier part development and production readiness during a new vehicle launch. When process risks or quality issues are found in key parts ahead of production, we re-examine the supplier's processes, submissions, and validation results, and establish countermeasures by priority.\n\nAlong the way, SQD communicates closely with the supplier, DRE, MO, and MQ to solve problems together. DRE reviews risk from the perspective of drawings and design intent, MO from manufacturing processes and production conditions, and MQ from quality standards and inspection systems on the production floor. Because each organization's perspective can differ, it is important to use regular issue reviews and on-site checks to align everyone on the symptoms, customer impact, cause, countermeasures, and completion criteria.\n\nAt the supplier's site, we check the process flow and working conditions and, together with the related organizations, implement actions step by step, such as temporary sorting and tightened inspection, improved process conditions, strengthened inspection systems, and revised work standards. We clearly manage the owner and completion date for each action, and verify with DRE, MO, and MQ that the same quality is repeated under real production conditions. This minimizes quality risk before production, eliminates risks in advance wherever possible, and leads to a stable launch.\n\nThis collaboration results in PPAP approval, Run at Rate completion, resolved launch risks, and stable early quality. The core of SQD shown by this project is that we don't stop at handing requirements to suppliers; we build a shared direction with DRE, MO, and MQ and then make sure it actually takes hold in the supplier's processes and systems.",
      },
      {
        q: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qKr: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qEn: "How do you think about your team culture and teammates working together?",
        a: "GMTCK SQD는 품질 이슈를 숨기기보다 빠르게 공유하고, 문제를 개인의 책임이 아닌 함께 해결해야 할 과제로 바라보는 문화를 중요하게 생각합니다. 서로의 전문성을 존중하면서도 필요한 경우 적극적으로 도움을 요청하고 의견을 나눕니다.\n\n경험이 많은 구성원은 품질 도구와 현장 대응 노하우를 공유하고, 새로운 구성원은 새로운 시각과 디지털 도구 활용 방법을 더하며 함께 성장합니다. 업무 과정에서 얻은 개선 사례와 협력사 대응 경험을 팀 내에 공유해 개인의 경험이 조직의 역량으로 이어지도록 합니다.\n\n또한 설계, 구매, 제조, 공장 품질, 글로벌 SQD 조직과 적극적으로 협업합니다. 다양한 의견이 있을 때도 고객 품질과 제품 안전이라는 공통의 목표를 기준으로 논의하며, 중요한 시기에는 서로 업무를 나누어 끝까지 마무리하는 것이 GMTCK SQD의 강점입니다.",
        aKr: "GMTCK SQD는 품질 이슈를 숨기기보다 빠르게 공유하고, 문제를 개인의 책임이 아닌 함께 해결해야 할 과제로 바라보는 문화를 중요하게 생각합니다. 서로의 전문성을 존중하면서도 필요한 경우 적극적으로 도움을 요청하고 의견을 나눕니다.\n\n경험이 많은 구성원은 품질 도구와 현장 대응 노하우를 공유하고, 새로운 구성원은 새로운 시각과 디지털 도구 활용 방법을 더하며 함께 성장합니다. 업무 과정에서 얻은 개선 사례와 협력사 대응 경험을 팀 내에 공유해 개인의 경험이 조직의 역량으로 이어지도록 합니다.\n\n또한 설계, 구매, 제조, 공장 품질, 글로벌 SQD 조직과 적극적으로 협업합니다. 다양한 의견이 있을 때도 고객 품질과 제품 안전이라는 공통의 목표를 기준으로 논의하며, 중요한 시기에는 서로 업무를 나누어 끝까지 마무리하는 것이 GMTCK SQD의 강점입니다.",
        aEn: "GMTCK SQD values a culture of sharing quality issues quickly rather than hiding them, and of treating problems as challenges to solve together rather than as individual blame. We respect each other's expertise while actively asking for help and sharing opinions when needed.\n\nExperienced members share their know-how on quality tools and on-site response, while newer members add fresh perspectives and ways of using digital tools, and we grow together. We share improvement cases and supplier response experiences within the team so that individual experience becomes organizational capability.\n\nWe also collaborate actively with engineering, purchasing, manufacturing, plant quality, and global SQD organizations. Even when opinions differ, we discuss based on our shared goals of customer quality and product safety, and in critical periods we divide the work and see it through together. That is the strength of GMTCK SQD.",
      },
      {
        q: "앞으로의 목표 또는 커리어 방향",
        qKr: "앞으로의 목표 또는 커리어 방향",
        qEn: "Your future goals or career direction",
        a: "SQD가 지향하는 방향은 협력사의 공정 역량과 품질 시스템을 지속적으로 높이고, 반복되는 문제를 데이터로 분석해 더 이른 단계에서 예방하는 것입니다. 이를 위해 품질 데이터를 효과적으로 활용하고, 디지털 도구와 표준화된 프로세스를 통해 선제적인 Supplier Quality 관리 체계를 강화하고 있습니다.\n\n또한 제품 개발, 공급망, 제조 현장을 연결할 수 있는 전문 인력을 육성하고, 협력사와 GM이 같은 품질 목표를 바라보며 성장할 수 있는 파트너십을 만들어 가고자 합니다. 궁극적으로는 고객이 차량을 구매하고 사용하는 순간까지 품질을 신뢰할 수 있도록, 보이지 않는 곳에서 품질 기준을 만들고 실행하는 조직으로 성장하는 것이 GMK SQD의 목표입니다.\n\n마지막으로, AI가 화두인 지금의 디지털 환경에서 디지털 도구를 업무와 적극적으로 연계해 AI & Digitalization 기반의 선제적 품질 이슈 탐지 체계를 구축하고, 담당 협력사의 Zero Defect Parts 공급을 실현하는 것이 SQE로서의 목표이기도 합니다.",
        aKr: "SQD가 지향하는 방향은 협력사의 공정 역량과 품질 시스템을 지속적으로 높이고, 반복되는 문제를 데이터로 분석해 더 이른 단계에서 예방하는 것입니다. 이를 위해 품질 데이터를 효과적으로 활용하고, 디지털 도구와 표준화된 프로세스를 통해 선제적인 Supplier Quality 관리 체계를 강화하고 있습니다.\n\n또한 제품 개발, 공급망, 제조 현장을 연결할 수 있는 전문 인력을 육성하고, 협력사와 GM이 같은 품질 목표를 바라보며 성장할 수 있는 파트너십을 만들어 가고자 합니다. 궁극적으로는 고객이 차량을 구매하고 사용하는 순간까지 품질을 신뢰할 수 있도록, 보이지 않는 곳에서 품질 기준을 만들고 실행하는 조직으로 성장하는 것이 GMK SQD의 목표입니다.\n\n마지막으로, AI가 화두인 지금의 디지털 환경에서 디지털 도구를 업무와 적극적으로 연계해 AI & Digitalization 기반의 선제적 품질 이슈 탐지 체계를 구축하고, 담당 협력사의 Zero Defect Parts 공급을 실현하는 것이 SQE로서의 목표이기도 합니다.",
        aEn: "SQD's direction is to continuously raise our suppliers' process capability and quality systems, and to analyze recurring problems with data so we can prevent them at an earlier stage. To do this, we are making effective use of quality data and strengthening a proactive supplier quality management system through digital tools and standardized processes.\n\nWe also aim to develop experts who can connect product development, the supply chain, and the manufacturing floor, and to build partnerships in which suppliers and GM grow together toward the same quality goals. Ultimately, GMK SQD's goal is to grow into an organization that sets and executes quality standards behind the scenes, so that customers can trust the quality of their vehicle from the moment they buy it and throughout its use.\n\nFinally, in today's digital environment where AI is a key topic, my goal as an SQE is to actively connect digital tools with our work, build a proactive, AI- and digitalization-based system for detecting quality issues, and achieve zero-defect parts supply from the suppliers I am responsible for.",
      },
      {
        q: "내게 GMTCK란?",
        qKr: "내게 GMTCK란?",
        qEn: "What does GMTCK mean to you?",
        a: "GMTCK는 엔지니어의 판단과 노력이 실제 차량의 품질과 고객의 신뢰로 이어지는 곳입니다. SQD 엔지니어는 부품 도면과 품질 기준을 바탕으로 협력업체의 공정을 개발하고, DRE·MO·MQ 및 글로벌 조직과 함께 품질 리스크를 사전에 줄여 나갑니다. 눈에 잘 드러나지 않는 작은 문제까지 집요하게 확인하고 개선한 결과가 양산 차량에 반영되는 순간, 엔지니어로서 큰 보람과 자부심을 느낄 수 있습니다.\n\nGMTCK는 다양한 분야의 전문가가 하나의 차량을 목표로 연결되는 글로벌 기술 조직입니다. SQD 엔지니어의 업무는 단순히 품질 문제를 처리하는 것이 아니라, 고객이 안심하고 차량을 사용할 수 있도록 차량의 시작부터 양산과 시장 품질까지 책임지는 일입니다. 협력업체와 함께 더 나은 공정을 만들고, 여러 조직과 해법을 찾아 실제 차량의 품질로 완성해 가는 과정은 SQD 엔지니어만이 경험할 수 있는 특별한 가치입니다.\n\n한 부품의 품질을 지키는 일이 한 대의 차량을 완성하고 고객의 신뢰를 높이는 일로 이어진다는 점에서, GMTCK SQD 엔지니어라는 직업은 보람되고 자랑스러운 일입니다.",
        aKr: "GMTCK는 엔지니어의 판단과 노력이 실제 차량의 품질과 고객의 신뢰로 이어지는 곳입니다. SQD 엔지니어는 부품 도면과 품질 기준을 바탕으로 협력업체의 공정을 개발하고, DRE·MO·MQ 및 글로벌 조직과 함께 품질 리스크를 사전에 줄여 나갑니다. 눈에 잘 드러나지 않는 작은 문제까지 집요하게 확인하고 개선한 결과가 양산 차량에 반영되는 순간, 엔지니어로서 큰 보람과 자부심을 느낄 수 있습니다.\n\nGMTCK는 다양한 분야의 전문가가 하나의 차량을 목표로 연결되는 글로벌 기술 조직입니다. SQD 엔지니어의 업무는 단순히 품질 문제를 처리하는 것이 아니라, 고객이 안심하고 차량을 사용할 수 있도록 차량의 시작부터 양산과 시장 품질까지 책임지는 일입니다. 협력업체와 함께 더 나은 공정을 만들고, 여러 조직과 해법을 찾아 실제 차량의 품질로 완성해 가는 과정은 SQD 엔지니어만이 경험할 수 있는 특별한 가치입니다.\n\n한 부품의 품질을 지키는 일이 한 대의 차량을 완성하고 고객의 신뢰를 높이는 일로 이어진다는 점에서, GMTCK SQD 엔지니어라는 직업은 보람되고 자랑스러운 일입니다.",
        aEn: "GMTCK is a place where an engineer's judgment and effort turn into the quality of real vehicles and the trust of customers. SQD engineers develop supplier processes based on part drawings and quality standards, and reduce quality risks in advance together with DRE, MO, MQ, and global organizations. When the results of persistently checking and improving even small, barely visible problems are reflected in production vehicles, you feel great reward and pride as an engineer.\n\nGMTCK is a global technical organization where experts from many fields come together around a single vehicle. An SQD engineer's work is not just handling quality problems; it is taking responsibility from the start of a vehicle through production and field quality so that customers can use their vehicles with peace of mind. Building better processes with suppliers and finding solutions with many organizations to complete the quality of a real vehicle is a special value that only SQD engineers get to experience.\n\nBecause protecting the quality of a single part leads to completing a vehicle and earning customers' trust, being an SQD engineer at GMTCK is rewarding work I am proud of.",
      },
    ],
  },
  "ops-operations": {
    questions: [
      {
        q: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qKr: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qEn: "Please tell us your current role & responsibilities specifically.",
        a: "저는 GMTCK에서 엔지니어링 개발을 지원하는 운영 업무를 담당하고 있습니다. 저희 Operation은 특정 시스템 하나를 관리하는 업무가 아니라, 제품 개발에 필요한 데이터·사양·프로세스·시스템이 서로 연결되어 원활하게 작동하도록 지원하는 역할입니다.\n\n주요 업무는 제품·부품 사양관리, 변경관리, PLM System 운영, 교육, 연구소 운영 및 예산관리로 구성됩니다.\n\n• 제품·부품 사양관리: 제품과 부품의 사양 및 관련 정보를 체계적으로 관리\n• 변경관리: 제품·부품 사양과 개발 데이터의 변경사항을 검토하고 관련 조직에 정확히 전달하며 후속 조치 관리\n• PLM System 운영: 제품개발 시스템과 데이터 관리 체계의 운영, 시스템 개선 및 사용자 지원\n• 교육: 대내외 교육을 담당하며 업무 시스템과 프로세스에 대한 사용자 교육 및 교육 운영 지원\n• 연구소 운영 및 예산관리: 연구소 운영과 예산 관리에 관련된 지원업무\n\n이러한 업무 영역은 서로 분리된 업무가 아니라, 제품·부품의 사양과 변경사항이 개발 시스템과 데이터에 정확히 반영되고, 다시 개발 현장에서 활용되도록 연결되어 있습니다. 따라서 관련 부서와 협업하면서 업무 절차를 정리하고, 사용자 관점에서 문제를 해결하며, 새로운 시스템과 업무 방식이 현장에 정착되도록 지원합니다.\n\n저희 Operation의 역할은 단순한 관리나 지원을 넘어, 엔지니어링 현장의 요구사항을 시스템·데이터·사양·프로세스에 반영해 개발 업무의 속도와 품질을 높이는 연결자이자 문제 해결자라고 생각합니다. GMTCK가 고객을 위한 혁신적인 제품을 개발할 수 있도록, 보이지 않는 곳에서 전체 개발 인프라와 업무 기반을 안정적으로 만들어 가는 업무입니다.",
        aKr: "저는 GMTCK에서 엔지니어링 개발을 지원하는 운영 업무를 담당하고 있습니다. 저희 Operation은 특정 시스템 하나를 관리하는 업무가 아니라, 제품 개발에 필요한 데이터·사양·프로세스·시스템이 서로 연결되어 원활하게 작동하도록 지원하는 역할입니다.\n\n주요 업무는 제품·부품 사양관리, 변경관리, PLM System 운영, 교육, 연구소 운영 및 예산관리로 구성됩니다.\n\n• 제품·부품 사양관리: 제품과 부품의 사양 및 관련 정보를 체계적으로 관리\n• 변경관리: 제품·부품 사양과 개발 데이터의 변경사항을 검토하고 관련 조직에 정확히 전달하며 후속 조치 관리\n• PLM System 운영: 제품개발 시스템과 데이터 관리 체계의 운영, 시스템 개선 및 사용자 지원\n• 교육: 대내외 교육을 담당하며 업무 시스템과 프로세스에 대한 사용자 교육 및 교육 운영 지원\n• 연구소 운영 및 예산관리: 연구소 운영과 예산 관리에 관련된 지원업무\n\n이러한 업무 영역은 서로 분리된 업무가 아니라, 제품·부품의 사양과 변경사항이 개발 시스템과 데이터에 정확히 반영되고, 다시 개발 현장에서 활용되도록 연결되어 있습니다. 따라서 관련 부서와 협업하면서 업무 절차를 정리하고, 사용자 관점에서 문제를 해결하며, 새로운 시스템과 업무 방식이 현장에 정착되도록 지원합니다.\n\n저희 Operation의 역할은 단순한 관리나 지원을 넘어, 엔지니어링 현장의 요구사항을 시스템·데이터·사양·프로세스에 반영해 개발 업무의 속도와 품질을 높이는 연결자이자 문제 해결자라고 생각합니다. GMTCK가 고객을 위한 혁신적인 제품을 개발할 수 있도록, 보이지 않는 곳에서 전체 개발 인프라와 업무 기반을 안정적으로 만들어 가는 업무입니다.",
        aEn: "I am responsible for operations that support engineering development at GMTCK. Our Operations team doesn't manage just one specific system; our role is to make sure the data, specifications, processes, and systems needed for product development connect with each other and work smoothly.\n\nOur main work consists of product and part specification management, change management, PLM system operation, training, and technical center operations and budget management.\n\n• Product and part specification management: Systematically managing the specifications and related information for products and parts\n• Change management: Reviewing changes to product and part specifications and development data, communicating them accurately to related organizations, and managing follow-up actions\n• PLM system operation: Operating the product development system and data management framework, improving the system, and supporting users\n• Training: Handling internal and external training, including user training on business systems and processes and support for training operations\n• Technical center operations and budget management: Support work related to running the technical center and managing its budget\n\nThese areas are not separate from one another. They are connected so that product and part specifications and changes are accurately reflected in development systems and data, and then used again in development. So we work with related departments to organize work procedures, solve problems from the user's point of view, and help new systems and ways of working take hold in the field.\n\nI see our Operations role as going beyond simple management or support: we are connectors and problem solvers who raise the speed and quality of development by reflecting the needs of engineering in systems, data, specifications, and processes. It is work that steadily builds the entire development infrastructure and foundation behind the scenes so that GMTCK can develop innovative products for our customers.",
      },
      {
        q: "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn: "What capabilities do you think are needed for this role?",
        a: "첫째는 전체 엔지니어링 개발 흐름을 이해하는 능력입니다. Operation 업무는 시스템, 데이터, 사양, 변경관리, 사용자 업무가 서로 연결되어 있기 때문에 한 영역만 보는 것이 아니라 제품 개발의 전체 흐름을 이해해야 합니다.\n\n둘째는 정확성과 데이터·사양 관리 능력입니다. 제품·부품 사양, 개발 데이터와 변경 정보의 작은 오류도 여러 조직과 프로그램에 영향을 줄 수 있습니다. 따라서 변경사항을 정확히 확인하고, 영향 범위를 분석하며, 필요한 내용을 적시에 전달하는 역량이 중요합니다.\n\n셋째는 커뮤니케이션과 조율 능력입니다. Operation 업무는 여러 개발 조직, 사용자, 협력 부서와 함께 진행합니다. 서로 다른 요구사항을 정리하고, 시스템이나 사양의 복잡한 내용을 이해하기 쉬운 언어로 설명하며, 이슈가 끝까지 해결되도록 후속 관리해야 합니다.\n\n마지막으로 문제 해결과 지속적인 개선 역량이 필요합니다. 정해진 절차를 수행하는 것에 그치지 않고, 반복되는 불편을 찾아 프로세스를 단순화하고 새로운 기술과 방법을 적용해야 합니다. 이러한 역량이 모여 개발 조직이 더 빠르고 정확하게 일할 수 있는 Operation을 만든다고 생각합니다.",
        aKr: "첫째는 전체 엔지니어링 개발 흐름을 이해하는 능력입니다. Operation 업무는 시스템, 데이터, 사양, 변경관리, 사용자 업무가 서로 연결되어 있기 때문에 한 영역만 보는 것이 아니라 제품 개발의 전체 흐름을 이해해야 합니다.\n\n둘째는 정확성과 데이터·사양 관리 능력입니다. 제품·부품 사양, 개발 데이터와 변경 정보의 작은 오류도 여러 조직과 프로그램에 영향을 줄 수 있습니다. 따라서 변경사항을 정확히 확인하고, 영향 범위를 분석하며, 필요한 내용을 적시에 전달하는 역량이 중요합니다.\n\n셋째는 커뮤니케이션과 조율 능력입니다. Operation 업무는 여러 개발 조직, 사용자, 협력 부서와 함께 진행합니다. 서로 다른 요구사항을 정리하고, 시스템이나 사양의 복잡한 내용을 이해하기 쉬운 언어로 설명하며, 이슈가 끝까지 해결되도록 후속 관리해야 합니다.\n\n마지막으로 문제 해결과 지속적인 개선 역량이 필요합니다. 정해진 절차를 수행하는 것에 그치지 않고, 반복되는 불편을 찾아 프로세스를 단순화하고 새로운 기술과 방법을 적용해야 합니다. 이러한 역량이 모여 개발 조직이 더 빠르고 정확하게 일할 수 있는 Operation을 만든다고 생각합니다.",
        aEn: "First, the ability to understand the overall engineering development flow. Because Operations work connects systems, data, specifications, change management, and user tasks, you need to understand the whole product development flow rather than looking at just one area.\n\nSecond, accuracy and the ability to manage data and specifications. Even a small error in product or part specifications, development data, or change information can affect many organizations and programs. So it is important to check changes accurately, analyze their scope of impact, and communicate what is needed at the right time.\n\nThird, communication and coordination. Operations work is done together with many development organizations, users, and partner departments. You need to organize differing requirements, explain complex system or specification details in easy-to-understand language, and follow up until issues are fully resolved.\n\nFinally, problem solving and continuous improvement. Rather than just following set procedures, you need to find recurring inconveniences, simplify processes, and apply new technologies and methods. I believe these capabilities together create an Operations team that helps development organizations work faster and more accurately.",
      },
      {
        q: "진행하셨던 프로젝트 중 인상 깊었던 프로젝트가 있나요?",
        qKr: "진행하셨던 프로젝트 중 인상 깊었던 프로젝트가 있나요?",
        qEn: "Is there a project that left a strong impression on you?",
        a: "가장 인상 깊었던 프로젝트는 제품개발 시스템 개선 및 업무 정착 프로젝트입니다. 시스템과 업무 방식이 변경되는 과정에서 테스트에 참여하고, 제품·부품 사양과 변경사항을 관련 조직에 안내하며, 진행 중 발견된 이슈를 담당자들과 함께 확인하고 조치했습니다. 또한 변경된 업무가 현장에 잘 적용될 수 있도록 사용자 교육과 후속 지원까지 연결했습니다.\n\n이 프로젝트가 인상 깊었던 이유는 단순한 시스템 변경이 아니라, 변경된 시스템과 업무 방식이 실제 현장에 정착되도록 지원하는 일이었기 때문입니다. 시스템을 배포하는 것만으로는 프로젝트가 끝나지 않습니다. 사용자가 변화를 이해하고, 업무에 적용하고, 불편한 점을 다시 개선하는 과정까지 완료되어야 비로소 성공적인 정착이라고 할 수 있습니다.\n\n또한 새로운 기술을 업무와 교육에 적용하는 경험을 통해, 변화가 실제 현장에 정착하려면 시스템 개선뿐 아니라 사용자 교육과 지속적인 지원이 함께 이루어져야 한다는 점을 배웠습니다. 이를 통해 Engineering Operations 업무는 사양관리, 변경관리, 시스템 운영, 교육과 연구소 운영 및 예산관리가 서로 연결되어야 한다는 점을 다시 확인했습니다.",
        aKr: "가장 인상 깊었던 프로젝트는 제품개발 시스템 개선 및 업무 정착 프로젝트입니다. 시스템과 업무 방식이 변경되는 과정에서 테스트에 참여하고, 제품·부품 사양과 변경사항을 관련 조직에 안내하며, 진행 중 발견된 이슈를 담당자들과 함께 확인하고 조치했습니다. 또한 변경된 업무가 현장에 잘 적용될 수 있도록 사용자 교육과 후속 지원까지 연결했습니다.\n\n이 프로젝트가 인상 깊었던 이유는 단순한 시스템 변경이 아니라, 변경된 시스템과 업무 방식이 실제 현장에 정착되도록 지원하는 일이었기 때문입니다. 시스템을 배포하는 것만으로는 프로젝트가 끝나지 않습니다. 사용자가 변화를 이해하고, 업무에 적용하고, 불편한 점을 다시 개선하는 과정까지 완료되어야 비로소 성공적인 정착이라고 할 수 있습니다.\n\n또한 새로운 기술을 업무와 교육에 적용하는 경험을 통해, 변화가 실제 현장에 정착하려면 시스템 개선뿐 아니라 사용자 교육과 지속적인 지원이 함께 이루어져야 한다는 점을 배웠습니다. 이를 통해 Engineering Operations 업무는 사양관리, 변경관리, 시스템 운영, 교육과 연구소 운영 및 예산관리가 서로 연결되어야 한다는 점을 다시 확인했습니다.",
        aEn: "The project that left the strongest impression on me was improving our product development system and helping the new way of working take hold. As the system and work processes changed, I took part in testing, guided related organizations on product and part specifications and changes, and worked with the owners to check and resolve issues found along the way. I also connected the work to user training and follow-up support so the changes would be applied well in the field.\n\nThis project stood out to me because it wasn't just a system change; it was about helping the changed system and ways of working actually take root in the field. A project doesn't end just by deploying a system. It can only be called a successful adoption once users understand the change, apply it to their work, and the pain points are improved again.\n\nThrough the experience of applying new technology to work and training, I also learned that for change to truly take hold, system improvements must go hand in hand with user training and ongoing support. This reconfirmed for me that in Engineering Operations, specification management, change management, system operation, training, and technical center operations and budget management all need to be connected.",
      },
      {
        q: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qKr: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qEn: "How do you think about your team culture and teammates working together?",
        a: "Engineering Operations는 제품·부품 사양관리, 변경관리, 개발 시스템 운영, 교육, 연구소 운영 및 예산관리 등 서로 다른 업무가 긴밀하게 연결되어 일하는 조직입니다. 각 담당자는 자신의 업무에 대한 전문성을 가지고 있으면서도, 문제가 생기면 개인의 업무로 한정하지 않고 전체 개발 프로세스의 관점에서 함께 해결하려는 문화가 있습니다.\n\n특히 운영 업무는 여러 관련 부서와 협력 조직을 연결해야 하기 때문에, 서로의 관점을 존중하고 필요한 정보를 투명하게 공유하는 협업이 중요합니다. 동료들은 새로운 업무나 익숙하지 않은 문제에도 적극적으로 배우고 대응하며, 경험과 노하우를 공유해 더 나은 방법을 함께 찾으려 합니다.\n\n또한 업무 성과뿐 아니라 안전, 성장, 상호 인정과 존중을 중요하게 생각합니다. 그래서 저는 우리 조직을 각자의 전문성을 바탕으로 협업하면서, 개인의 성과보다 전체 엔지니어링 조직의 성공을 중요하게 여기는 조직이라고 표현하고 싶습니다.",
        aKr: "Engineering Operations는 제품·부품 사양관리, 변경관리, 개발 시스템 운영, 교육, 연구소 운영 및 예산관리 등 서로 다른 업무가 긴밀하게 연결되어 일하는 조직입니다. 각 담당자는 자신의 업무에 대한 전문성을 가지고 있으면서도, 문제가 생기면 개인의 업무로 한정하지 않고 전체 개발 프로세스의 관점에서 함께 해결하려는 문화가 있습니다.\n\n특히 운영 업무는 여러 관련 부서와 협력 조직을 연결해야 하기 때문에, 서로의 관점을 존중하고 필요한 정보를 투명하게 공유하는 협업이 중요합니다. 동료들은 새로운 업무나 익숙하지 않은 문제에도 적극적으로 배우고 대응하며, 경험과 노하우를 공유해 더 나은 방법을 함께 찾으려 합니다.\n\n또한 업무 성과뿐 아니라 안전, 성장, 상호 인정과 존중을 중요하게 생각합니다. 그래서 저는 우리 조직을 각자의 전문성을 바탕으로 협업하면서, 개인의 성과보다 전체 엔지니어링 조직의 성공을 중요하게 여기는 조직이라고 표현하고 싶습니다.",
        aEn: "Engineering Operations is an organization where different kinds of work, such as product and part specification management, change management, development system operation, training, and technical center operations and budget management, are closely connected. Each person has expertise in their own area, yet when a problem arises, we have a culture of solving it together from the perspective of the whole development process rather than limiting it to one person's job.\n\nBecause operations work in particular has to connect many related departments and partner organizations, collaboration that respects each other's perspectives and shares necessary information transparently is important. My colleagues actively learn and respond even to new tasks or unfamiliar problems, and share their experience and know-how to find better ways together.\n\nWe also value safety, growth, and mutual recognition and respect, not just work results. That is why I would describe our organization as one that collaborates based on each person's expertise and values the success of the entire engineering organization over individual achievement.",
      },
      {
        q: "내게 GMTCK란?",
        qKr: "내게 GMTCK란?",
        qEn: "What does GMTCK mean to you?",
        a: "저에게 GMTCK는 사람과 기술을 연결해 고객을 위한 가치를 만들어 내는 곳입니다.\n\nGMTCK의 업무는 차량과 기술을 개발하는 데서 끝나지 않고, 안전을 최우선으로 하면서 새로운 기술과 아이디어를 실제 제품과 업무에 적용하는 과정이라고 생각합니다. 그 안에서 저는 제품·부품 사양관리, 변경관리, 개발 시스템 운영, 교육, 연구소 운영 및 예산관리 업무를 통해 엔지니어들이 필요한 정보를 정확히 활용하고, 변경사항을 빠르게 공유하며, 더 효율적으로 협업할 수 있는 환경을 만드는 역할을 하고 있습니다.\n\n개인적으로 GMTCK는 계속 배우고 성장할 수 있는 곳이자, 작은 업무 개선 하나도 전체 개발 효율과 제품 품질에 연결될 수 있다는 책임감을 느끼게 하는 곳입니다. 앞으로도 업무를 단순하고 효율적으로 개선하고, 혁신과 협업의 가치를 실천하면서 GMTCK가 GM에서 신뢰받는 기술센터로 성장하는 데 기여하고 싶습니다.",
        aKr: "저에게 GMTCK는 사람과 기술을 연결해 고객을 위한 가치를 만들어 내는 곳입니다.\n\nGMTCK의 업무는 차량과 기술을 개발하는 데서 끝나지 않고, 안전을 최우선으로 하면서 새로운 기술과 아이디어를 실제 제품과 업무에 적용하는 과정이라고 생각합니다. 그 안에서 저는 제품·부품 사양관리, 변경관리, 개발 시스템 운영, 교육, 연구소 운영 및 예산관리 업무를 통해 엔지니어들이 필요한 정보를 정확히 활용하고, 변경사항을 빠르게 공유하며, 더 효율적으로 협업할 수 있는 환경을 만드는 역할을 하고 있습니다.\n\n개인적으로 GMTCK는 계속 배우고 성장할 수 있는 곳이자, 작은 업무 개선 하나도 전체 개발 효율과 제품 품질에 연결될 수 있다는 책임감을 느끼게 하는 곳입니다. 앞으로도 업무를 단순하고 효율적으로 개선하고, 혁신과 협업의 가치를 실천하면서 GMTCK가 GM에서 신뢰받는 기술센터로 성장하는 데 기여하고 싶습니다.",
        aEn: "For me, GMTCK is a place that connects people and technology to create value for our customers.\n\nI believe GMTCK's work doesn't end with developing vehicles and technology; it is the process of applying new technologies and ideas to real products and work while putting safety first. Within that, through product and part specification management, change management, development system operation, training, and technical center operations and budget management, I help create an environment where engineers can use the information they need accurately, share changes quickly, and collaborate more efficiently.\n\nPersonally, GMTCK is a place where I can keep learning and growing, and a place that makes me feel responsible, knowing that even a small improvement can connect to overall development efficiency and product quality. Going forward, I want to keep making our work simpler and more efficient, practice the values of innovation and collaboration, and contribute to GMTCK growing into a trusted technical center within GM.",
      },
    ],
  },
  "me-manufacturing-engineering": {
    questions: [
      {
        q: "지엠테크니컬센터 생산기술연구소 소개를 해주세요.",
        qKr: "지엠테크니컬센터 생산기술연구소 소개를 해주세요.",
        qEn: "Please introduce the Manufacturing Engineering center at GM Technical Center Korea.",
        a: "GMTCK 생산기술연구소는 GM의 아시아 지역을 대표하는 생산기술 연구 허브로써, 신차 양산을 위한 공정과 설비를 개발, 검증, 실행하는 역할을 합니다. 생산기술연구소는 차량을 설계하는 기술연구소와 차량을 생산하는 생산공장을 연결하는 Bridge 역할을 하며 프레스, 차체, 도장, 조립, 엔진구동 공장 등 차량 생산 전 과정에서 최적의 생산시스템을 구축하고 하고 있습니다. 더불어, 한국 공장에서 생산되는 차량 개발뿐만 아니라 타지역에서 생산되는 캐딜락, 뷰익, GMC, 쉐보레 차량 개발에도 참여하여 효과적인 생산시스템 구축을 위한 제품 개발을 지원하고 있습니다.",
        aKr: "GMTCK 생산기술연구소는 GM의 아시아 지역을 대표하는 생산기술 연구 허브로써, 신차 양산을 위한 공정과 설비를 개발, 검증, 실행하는 역할을 합니다. 생산기술연구소는 차량을 설계하는 기술연구소와 차량을 생산하는 생산공장을 연결하는 Bridge 역할을 하며 프레스, 차체, 도장, 조립, 엔진구동 공장 등 차량 생산 전 과정에서 최적의 생산시스템을 구축하고 하고 있습니다. 더불어, 한국 공장에서 생산되는 차량 개발뿐만 아니라 타지역에서 생산되는 캐딜락, 뷰익, GMC, 쉐보레 차량 개발에도 참여하여 효과적인 생산시스템 구축을 위한 제품 개발을 지원하고 있습니다.",
        aEn: "GMTCK Manufacturing Engineering is GM's leading manufacturing engineering hub in the Asia region, responsible for developing, validating, and executing the processes and equipment for mass production of new vehicles. We act as a bridge between the engineering center that designs vehicles and the plants that build them, establishing optimal production systems across the entire vehicle production process, including press, body, paint, general assembly, and powertrain plants. In addition to vehicles built at our plants in Korea, we also take part in developing Cadillac, Buick, GMC, and Chevrolet vehicles produced in other regions, supporting product development to build effective production systems.",
      },
      {
        q: "생산기술연구소의 업무에 대해 좀더 구체적으로 소개해주세요.",
        qKr: "생산기술연구소의 업무에 대해 좀더 구체적으로 소개해주세요.",
        qEn: "Please describe the work of Manufacturing Engineering in more detail.",
        a: "생산기술연구소의 기본적인 업무는 신차 제조 공정과 설비를 설계/실행하는 것이며, 이를 통해 생산 공장에 필요한 설비, 장비, Tool(금형)을 개발/실행하고 있습니다. 제조 공정/설비 관련 최신 신기술을 검토하고 자동화를 통한 생산시스템의 Optimization 프로젝트를 검토 실행하고 있으며, 주요 신규 설비에 대해서는 Virtual Technology를 통해 검증하여 설치하고 최종 양산 검증 및 보완을 합니다. 기술연구소 및 생산공장과 설계/제조 품질, 생산성, 원가 및 작업자 안전 검토/개선을 통해 효과적인 생산시스템을 구축하고 있습니다. 신차 프로젝트는 글로벌 생산기술연구소와 긴밀한 협업/소통을 통해 최적의 생산 공정 및 설비를 개발하고 있으며, 글로벌 협업을 통해 북미 신차 및 배터리 프로젝트에도 적극 참여하여 최고 수준의 한국 실행력을 바탕으로 글로벌 GM 비즈니스에 기여하고 있습니다.",
        aKr: "생산기술연구소의 기본적인 업무는 신차 제조 공정과 설비를 설계/실행하는 것이며, 이를 통해 생산 공장에 필요한 설비, 장비, Tool(금형)을 개발/실행하고 있습니다. 제조 공정/설비 관련 최신 신기술을 검토하고 자동화를 통한 생산시스템의 Optimization 프로젝트를 검토 실행하고 있으며, 주요 신규 설비에 대해서는 Virtual Technology를 통해 검증하여 설치하고 최종 양산 검증 및 보완을 합니다. 기술연구소 및 생산공장과 설계/제조 품질, 생산성, 원가 및 작업자 안전 검토/개선을 통해 효과적인 생산시스템을 구축하고 있습니다. 신차 프로젝트는 글로벌 생산기술연구소와 긴밀한 협업/소통을 통해 최적의 생산 공정 및 설비를 개발하고 있으며, 글로벌 협업을 통해 북미 신차 및 배터리 프로젝트에도 적극 참여하여 최고 수준의 한국 실행력을 바탕으로 글로벌 GM 비즈니스에 기여하고 있습니다.",
        aEn: "Our core work is designing and executing the manufacturing processes and equipment for new vehicles, and through this we develop and deliver the facilities, equipment, and tooling (dies) our plants need. We review the latest technologies in manufacturing processes and equipment and carry out optimization projects that improve production systems through automation. Major new equipment is validated with virtual technology before installation, followed by final production validation and refinement. Together with the engineering center and our plants, we build effective production systems by reviewing and improving design and manufacturing quality, productivity, cost, and worker safety. For new vehicle projects, we develop optimal production processes and equipment through close collaboration and communication with GM's global Manufacturing Engineering teams, and through global collaboration we also actively take part in new vehicle and battery projects in North America, contributing to GM's global business with Korea's top-level execution capability.",
      },
      {
        q: "생산기술연구소 부문 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "생산기술연구소 부문 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn: "What capabilities do you think are needed to work in Manufacturing Engineering?",
        a: "직무에 대한 기술적인 지식이나 경험 등도 중요하겠지만, 무엇보다 책임감과 적극성, 긍정적인 마인드를 꼽고 싶습니다. 본인의 영역에서 책임감을 가지고 업무를 수행하며 적극적으로 문제를 파악하고 개선하려는 마인드가 있다면 업무 수행에 큰 어려움은 없을 것으로 보입니다. 본인의 역량을 넘어서는 문제에 대해서는 팀과 공유하여 함께 논의하며 해결책을 찾아갈 수도 있을 것입니다. 이 과정에서 겪게 될 다양한 문제와 어려움을 이겨내려면 긍정적인 사고도 필요하겠지요. 특히나 최근 들어 급속히 발달하고 있는 AI와 자동화 기술을 습득하고 활용하기 위해서는 더욱 더 필요한 덕목이라고 생각됩니다.",
        aKr: "직무에 대한 기술적인 지식이나 경험 등도 중요하겠지만, 무엇보다 책임감과 적극성, 긍정적인 마인드를 꼽고 싶습니다. 본인의 영역에서 책임감을 가지고 업무를 수행하며 적극적으로 문제를 파악하고 개선하려는 마인드가 있다면 업무 수행에 큰 어려움은 없을 것으로 보입니다. 본인의 역량을 넘어서는 문제에 대해서는 팀과 공유하여 함께 논의하며 해결책을 찾아갈 수도 있을 것입니다. 이 과정에서 겪게 될 다양한 문제와 어려움을 이겨내려면 긍정적인 사고도 필요하겠지요. 특히나 최근 들어 급속히 발달하고 있는 AI와 자동화 기술을 습득하고 활용하기 위해서는 더욱 더 필요한 덕목이라고 생각됩니다.",
        aEn: "Technical knowledge and experience in the role matter, but above all I would point to a sense of responsibility, initiative, and a positive mindset. If you take ownership of your area and have the mindset to actively identify and improve problems, you shouldn't have much difficulty doing the job. For problems beyond your own capabilities, you can share them with the team and find solutions together. Overcoming the many problems and challenges you will face along the way also takes positive thinking. I believe these qualities are even more necessary today for learning and applying AI and automation technologies, which are advancing rapidly.",
      },
      {
        q: "문화나 함께 일하는 동료들은 어떤가요?",
        qKr: "문화나 함께 일하는 동료들은 어떤가요?",
        qEn: "What are the culture and your colleagues like?",
        a: "직급보다는 “이름+님” 이라는 칭호를 사용하도록 권장하고 있으며, 누구나 본인의 생각을 거리낌 없이 공유할 수 있는 수평적 문화를 지향하고 있습니다. 많은 업무들이 표준화 되어 있고 전문화되어 있어 각자 맡은 업무에 대해 서로 존중하는 분위기이며, 어느 조직보다 팀웍이 좋은 조직이라고 자부합니다.",
        aKr: "직급보다는 “이름+님” 이라는 칭호를 사용하도록 권장하고 있으며, 누구나 본인의 생각을 거리낌 없이 공유할 수 있는 수평적 문화를 지향하고 있습니다. 많은 업무들이 표준화 되어 있고 전문화되어 있어 각자 맡은 업무에 대해 서로 존중하는 분위기이며, 어느 조직보다 팀웍이 좋은 조직이라고 자부합니다.",
        aEn: "Instead of job titles, we encourage people to address each other by name with \"-nim,\" and we aim for a horizontal culture where anyone can share their thoughts freely. Since much of our work is standardized and specialized, there is an atmosphere of mutual respect for each person's responsibilities, and we take pride in having better teamwork than any other organization.",
      },
    ],
  },
  "pipg-psc": {
    questions: [
      {
        q: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qKr: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qEn:"Please introduce your team and role & responsibilities specifically",
        a: "저희 담당은 엔진/트랜스미션 캘리브레이션 경험을 바탕으로 전기차 캘리브레이션, 소프트웨어, 시뮬레이션까지 업무 영역을 확장하며, AI, 가상 기술을 활용해 차량 제어 전반과 안정적인 차량 출시를 지원하고 있습니다. 저는 전기차 업무를 담당하며, 실차와 가상 환경을 통해 전기차 시스템의 안전, 성능과 품질을 사전에 검증하고 양산 전 리스크를 최소화하고 있습니다.",
        aKr: "저희 담당은 엔진/트랜스미션 캘리브레이션 경험을 바탕으로 전기차 캘리브레이션, 소프트웨어, 시뮬레이션까지 업무 영역을 확장하며, AI, 가상 기술을 활용해 차량 제어 전반과 안정적인 차량 출시를 지원하고 있습니다. 저는 전기차 업무를 담당하며, 실차와 가상 환경을 통해 전기차 시스템의 안전, 성능과 품질을 사전에 검증하고 양산 전 리스크를 최소화하고 있습니다.",
        aEn:"Our team has expanded its scope from traditional engine and transmission calibration into EV calibration, software, and simulation, leveraging AI and virtual technologies to support overall vehicle control and stable vehicle launches. I am responsible for EV-related work, where I verify the safety, performance, and quality of electric vehicle systems in both physical vehicles and virtual environments to minimize risks before mass production.",
      },
      {
        q: "하루 업무에 대해 소개해주세요.",
        qKr: "하루 업무에 대해 소개해주세요.",
        qEn:"Please tell us your typical workday.",
        a: "보통 전날 밤이나 아침에 북미에서 전달된 업무 메일을 확인하며 하루를 시작합니다. 현재는 시뮬레이션 장비를 활용해 검증 업무를 수행하며, 전기차 시스템이 요구 조건에 맞게 안전하게 동작하는지 검증하고 있습니다.",
        aKr: "보통 전날 밤이나 아침에 북미에서 전달된 업무 메일을 확인하며 하루를 시작합니다. 현재는 시뮬레이션 장비를 활용해 검증 업무를 수행하며, 전기차 시스템이 요구 조건에 맞게 안전하게 동작하는지 검증하고 있습니다.",
        aEn:"I usually start my day by checking emails sent from North America the previous night or early in the morning. Currently, I carry out verification tasks using simulation equipment, checking whether the EV systems operate safely and in line with the required specifications.",
      },
      {
        q: "담당하고 있는 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "담당하고 있는 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn:"Which capabilities do we need to have for your role?",
        a: "전기차 검증 업무에는 전기차 시스템에 대한 이해와 함께, 실차와 시뮬레이션을 중심으로 한 가상 검증 환경을 유기적으로 활용하는 역량이 중요하다고 생각합니다. 실차 시험은 여전히 핵심이지만, 사전에 시뮬레이션과 같은 가상 환경에서 조건을 구성해 문제를 줄여가는 접근이 점점 필수적인 요소가 되고 있습니다. 이러한 가상 검증 결과를 바탕으로 추가 시험이 필요한지, 또는 어떤 리스크를 관리해야 하는지를 판단할 수 있는 의사결정 역량 또한 중요한 요소가 되고 있다고 느끼고 있습니다.",
        aKr: "전기차 검증 업무에는 전기차 시스템에 대한 이해와 함께, 실차와 시뮬레이션을 중심으로 한 가상 검증 환경을 유기적으로 활용하는 역량이 중요하다고 생각합니다. 실차 시험은 여전히 핵심이지만, 사전에 시뮬레이션과 같은 가상 환경에서 조건을 구성해 문제를 줄여가는 접근이 점점 필수적인 요소가 되고 있습니다. 이러한 가상 검증 결과를 바탕으로 추가 시험이 필요한지, 또는 어떤 리스크를 관리해야 하는지를 판단할 수 있는 의사결정 역량 또한 중요한 요소가 되고 있다고 느끼고 있습니다.",
        aEn:"For EV verification work, it is essential not only to understand EV systems, but also to be able to use physical vehicles and simulation-based virtual verification environments in an integrated way. Physical vehicle testing is still core, but it is becoming increasingly critical to first set up conditions in virtual environments such as simulations to reduce issues in advance. Based on these virtual verification results, the ability to make decisions—such as whether additional testing is required and what risks need to be managed—is also becoming a key competency.",
      },
      {
        q: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qKr: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qEn:"How do you think about your team culture and teammates working together?",
        a: "저희 팀은 서로에 대한 배려와 신뢰를 바탕으로 움직이는 팀이라고 생각합니다. 팀 특성상 실차 시험이 많아 차량 이슈를 자주 접하는데, 한 번 도움을 받으면 자연스럽게 서로 돕는 분위기가 형성되어 있고, 누가 시키지 않아도 다 같이 모여 문제를 해결합니다. 덕분에 저도 부담 없이 도움을 요청할 수 있는, 함께 일하기 편한 팀입니다.",
        aKr: "저희 팀은 서로에 대한 배려와 신뢰를 바탕으로 움직이는 팀이라고 생각합니다. 팀 특성상 실차 시험이 많아 차량 이슈를 자주 접하는데, 한 번 도움을 받으면 자연스럽게 서로 돕는 분위기가 형성되어 있고, 누가 시키지 않아도 다 같이 모여 문제를 해결합니다. 덕분에 저도 부담 없이 도움을 요청할 수 있는, 함께 일하기 편한 팀입니다.",
        aEn:"Our team is built on mutual consideration and trust. Because our work involves a lot of physical vehicle testing, we frequently encounter vehicle issues, but once someone receives help, a natural culture of helping one another has formed, and people come together to solve problems without being told to do so. Thanks to this, it’s a very comfortable team to work in, where I can ask for help without feeling burdened.",
      },
      {
        q: "앞으로의 목표 또는 커리어 방향",
        qKr: "앞으로의 목표 또는 커리어 방향",
        qEn:"Please tell us your future goals and career direction.",
        a: "검증 결과에 책임을 지고, 고객 안전을 기준으로 판단할 수 있는 검증 엔지니어가 되는 것이 제 방향입니다. 단순히 통과 여부를 확인하는 데 그치지 않고, 검증 단계에서 문제를 사전에 설명하고 줄일 수 있는 역할을 목표로 하고 있습니다. 제 시험 결과가 곧 고객의 안전과 직결된다는 인식을 바탕으로, 책임감 있게 검증 업무를 수행하고 싶습니다.",
        aKr: "검증 결과에 책임을 지고, 고객 안전을 기준으로 판단할 수 있는 검증 엔지니어가 되는 것이 제 방향입니다. 단순히 통과 여부를 확인하는 데 그치지 않고, 검증 단계에서 문제를 사전에 설명하고 줄일 수 있는 역할을 목표로 하고 있습니다. 제 시험 결과가 곧 고객의 안전과 직결된다는 인식을 바탕으로, 책임감 있게 검증 업무를 수행하고 싶습니다.",
        aEn:"My goal is to become a verification engineer who takes full responsibility for test results and makes decisions based on customer safety. Rather than simply checking whether something has passed or failed, I aim to play a role in identifying and reducing potential issues already at the verification stage. With a clear awareness that my test results are directly connected to customer safety, I want to carry out verification work with a strong sense of responsibility.",
      },
    ],
  },
  "pipg-vpd-pid": {
    questions: [
      {
        q: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qKr: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qEn:"Please introduce your team and role & responsibilities specifically",
        a: "저희 담당은 차량의 주행성이나 정숙성처럼, 고객이 실제로 체감하는 성능을 통합적으로 관리하는 역할을 하고 있습니다. 차량 동력성능 개발, 소음&진동, 가상 개발팀이 긴밀하게 협업하며 시험과 해석을 하나의 흐름으로 연결하고, 그 안에서 최적의 차량 성능을 만들어가고 있습니다. 저는 그 중에서도 소음&진동 성능 개발 엔지니어로서, 불쾌한 소음과 진동을 줄이는 역할 뿐만 아니라 차량의 모델이나 브랜드 이미지에 어울리는 엔진 사운드와 전기차 모터 사운드를 만들어가는 업무를 맡고 있습니다.",
        aKr: "저희 담당은 차량의 주행성이나 정숙성처럼, 고객이 실제로 체감하는 성능을 통합적으로 관리하는 역할을 하고 있습니다. 차량 동력성능 개발, 소음&진동, 가상 개발팀이 긴밀하게 협업하며 시험과 해석을 하나의 흐름으로 연결하고, 그 안에서 최적의 차량 성능을 만들어가고 있습니다. 저는 그 중에서도 소음&진동 성능 개발 엔지니어로서, 불쾌한 소음과 진동을 줄이는 역할 뿐만 아니라 차량의 모델이나 브랜드 이미지에 어울리는 엔진 사운드와 전기차 모터 사운드를 만들어가는 업무를 맡고 있습니다.",
        aEn:"Our team is responsible for holistically managing the kinds of performance that customers can directly feel, such as drivability and quietness. The vehicle performance development, noise & vibration, and virtual development teams work closely together, linking testing and simulation into a single flow to create optimal overall vehicle performance. Within this organization, I work as a noise & vibration (NVH) performance development engineer, and my role is not only to reduce unpleasant noise and vibration, but also to create engine sounds and electric motor sounds that fit the character of each vehicle model and brand.",
      },
      {
        q: "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn:"Which capabilities do we need to have for your role?",
        a: "이 업무에 필요한 역량은 크게 세 가지라고 생각합니다. 첫 번째는 기본기입니다. 차체, 섀시, 추진 시스템 등 차량 전반에 대한 이해를 바탕으로 소음·진동 현상을 바라볼 수 있어야 합니다. 이런 기본기가 갖춰져 있어야 보다 안정적이면서도 현실적인 해결책을 제시할 수 있다고 생각합니다. 두 번째는 데이터를 읽고 해석하는 능력입니다. 차량 성능 개발은 해석이나 물리 시험, 다양한 가상 툴을 통해 생성되는 데이터를 기반으로 의사결정이 이루어지는 경우가 많기 때문에, 데이터 속에서 의미를 정확히 읽어내는 능력이 중요합니다. 마지막으로는 커뮤니케이션과 끈기입니다. 소음·진동 성능 개발은 설계, 시험, 품질, 생산 등 여러 부서가 유기적으로 연결돼 있어 협업이 필수적인 업무입니다. 또한 소음·진동 문제는 눈에 보이지 않고 한 번에 해결되지 않는 경우가 많아, 끝까지 원인을 파고들며 해결해 나가는 끈기 역시 중요한 역량이라고 생각합니다.",
        aKr: "이 업무에 필요한 역량은 크게 세 가지라고 생각합니다. 첫 번째는 기본기입니다. 차체, 섀시, 추진 시스템 등 차량 전반에 대한 이해를 바탕으로 소음·진동 현상을 바라볼 수 있어야 합니다. 이런 기본기가 갖춰져 있어야 보다 안정적이면서도 현실적인 해결책을 제시할 수 있다고 생각합니다. 두 번째는 데이터를 읽고 해석하는 능력입니다. 차량 성능 개발은 해석이나 물리 시험, 다양한 가상 툴을 통해 생성되는 데이터를 기반으로 의사결정이 이루어지는 경우가 많기 때문에, 데이터 속에서 의미를 정확히 읽어내는 능력이 중요합니다. 마지막으로는 커뮤니케이션과 끈기입니다. 소음·진동 성능 개발은 설계, 시험, 품질, 생산 등 여러 부서가 유기적으로 연결돼 있어 협업이 필수적인 업무입니다. 또한 소음·진동 문제는 눈에 보이지 않고 한 번에 해결되지 않는 경우가 많아, 끝까지 원인을 파고들며 해결해 나가는 끈기 역시 중요한 역량이라고 생각합니다.",
        aEn:`I believe this role requires three main capabilities.

First is a solid technical foundation. You need to be able to view noise and vibration phenomena based on an understanding of the entire vehicle, including the body, chassis, and propulsion system. With this foundation in place, you can propose solutions that are both robust and realistic.

Second is the ability to read and interpret data. Since many decisions in vehicle performance development are made based on data generated from simulations, physical tests, and various virtual tools, it is crucial to accurately extract meaningful insights from that data.

Lastly, communication and perseverance are essential. NVH performance development is inherently collaborative, involving close interaction with design, testing, quality, manufacturing, and other departments. Noise and vibration issues are often invisible and rarely resolved in a single step, so having the persistence to keep digging into root causes and seeing problems through to resolution is also a key strength.`,
      },
      {
        q: "진행하셨던 프로젝트 중 인상깊었던 프로젝트가 있나요?",
        qKr: "진행하셨던 프로젝트 중 인상깊었던 프로젝트가 있나요?",
        qEn:"What is the most impressive project that you have done before?",
        a: "트레일 블레이저와 트랙스 크로스오버 개발 당시, 소음진동 엔지니어로 참여했던 경험이 특히 기억에 많이 남습니다. 당시 국내외 소형 SUV 시장에서는 대부분 4기통 엔진을 사용하고 있었고, 3기통 엔진을 적용한 두 차종은 소음·진동 측면에서 태생적으로 불리한 조건을 안고 출발해야 했습니다. 그럼에도 불구하고 4기통 차량 수준의 소음·진동 성능 목표를 달성하기 위해 많은 시간과 자원, 그리고 노력이 필요했고, 관련 부서들과의 긴밀한 협업이 필수적이었습니다. 개발 초기부터 양산까지 한순간도 긴장을 늦출 수 없었던 프로젝트였습니다. 완성된 차량들이 양산 이후 국내외 시장에서 판매 성과는 물론, 품질과 상품성, 차량 가치 측면에서도 좋은 평가를 받는 모습을 보며 개인적으로 큰 보람과 자부심을 느꼈습니다. 엔지니어로서의 책임감과 성취감을 동시에 느낄 수 있었던 경험입니다.",
        aKr: "트레일 블레이저와 트랙스 크로스오버 개발 당시, 소음진동 엔지니어로 참여했던 경험이 특히 기억에 많이 남습니다. 당시 국내외 소형 SUV 시장에서는 대부분 4기통 엔진을 사용하고 있었고, 3기통 엔진을 적용한 두 차종은 소음·진동 측면에서 태생적으로 불리한 조건을 안고 출발해야 했습니다. 그럼에도 불구하고 4기통 차량 수준의 소음·진동 성능 목표를 달성하기 위해 많은 시간과 자원, 그리고 노력이 필요했고, 관련 부서들과의 긴밀한 협업이 필수적이었습니다. 개발 초기부터 양산까지 한순간도 긴장을 늦출 수 없었던 프로젝트였습니다. 완성된 차량들이 양산 이후 국내외 시장에서 판매 성과는 물론, 품질과 상품성, 차량 가치 측면에서도 좋은 평가를 받는 모습을 보며 개인적으로 큰 보람과 자부심을 느꼈습니다. 엔지니어로서의 책임감과 성취감을 동시에 느낄 수 있었던 경험입니다.",
        aEn:`Working as an NVH engineer on the development of the Trailblazer and Trax crossover. At the time, most vehicles in the domestic and global small SUV market were equipped with four-cylinder engines, so these two models, which used three-cylinder engines, started out at an inherent disadvantage in terms of noise and vibration.

Even so, a great deal of time, resources, and effort—as well as close collaboration with related departments—was required to achieve NVH performance targets comparable to four-cylinder vehicles. It was a project where we could not afford to relax from the early development phase all the way through to mass production.

Seeing the finished vehicles receive strong feedback in both domestic and overseas markets—not only in sales performance but also in quality, product appeal, and perceived value—gave me a deep sense of pride and fulfillment. It was an experience that allowed me to feel both the responsibility and the achievement that come with being an engineer.`,
      },
      {
        q: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qKr: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qEn:"How do you think about your team culture and teammates working together?",
        a: "저희 팀은 서로 필요한 부분은 잘 챙겨주면서도, 불필요한 간섭은 거의 없는 분위기입니다. 의견을 말하는 데 부담이 없어서 직급이나 연차에 상관없이 편하게 이야기할 수 있고, 각자의 방식을 존중해주는 팀이라고 생각합니다. 점심시간에는 함께 운동을 하기도 하고, 업무 중간중간 여유가 있을 때는 육아나 재테크, 여행처럼 다양한 주제로 수다도 많이 떠는 편입니다. 한마디로, 일할 때는 자연스럽게 몰입하고 평소에는 친구처럼 편안한 팀입니다.",
        aKr: "저희 팀은 서로 필요한 부분은 잘 챙겨주면서도, 불필요한 간섭은 거의 없는 분위기입니다. 의견을 말하는 데 부담이 없어서 직급이나 연차에 상관없이 편하게 이야기할 수 있고, 각자의 방식을 존중해주는 팀이라고 생각합니다. 점심시간에는 함께 운동을 하기도 하고, 업무 중간중간 여유가 있을 때는 육아나 재테크, 여행처럼 다양한 주제로 수다도 많이 떠는 편입니다. 한마디로, 일할 때는 자연스럽게 몰입하고 평소에는 친구처럼 편안한 팀입니다.",
        aEn:"Our team looks for one another where it’s needed, but there’s very little unnecessary interference. People feel comfortable speaking up, so we can talk openly regardless of title or years of experience, and I’d say it’s a team that respects each person’s own working style. At lunchtime we sometimes work out together, and when there’s a bit of downtime during the day, we often chat about all kinds of topics like parenting, personal finance, or travel. In short, we fully immerse ourselves when we work, but the day-to-day atmosphere is as relaxed as being with friends.",
      },
      {
        q: "내게 GMTCK란?",
        qKr: "내게 GMTCK란?",
        qEn:"What does GMTCK mean to you?",
        a: "제게 GMTCK는 첫 직장이자, 저를 꽤 그럴듯한 직장인으로 만들어준 곳입니다. 시행착오도 많았지만, 그 과정에서 일하는 법과 사람을 대하는 법을 자연스럽게 배웠습니다. MBTI로 치면 I 90% 성향의 저를, 이제는 사람들과 소통하고 의견을 나누는 데 훨씬 편한 사람으로 만들어준 곳이기도 합니다. 또 제가 좋아하는 다양한 차량을 직접 경험하고, 개발해 나가는 과정에서 새로운 도전에 재미를 느낄 수 있는, 제게는 아주 럭셔리한 놀이터 같은 공간이기도 합니다. 그래서 GMTCK는 제 삶에 큰 영향을 준, 고맙고 애정이 가는 회사입니다.",
        aKr: "제게 GMTCK는 첫 직장이자, 저를 꽤 그럴듯한 직장인으로 만들어준 곳입니다. 시행착오도 많았지만, 그 과정에서 일하는 법과 사람을 대하는 법을 자연스럽게 배웠습니다. MBTI로 치면 I 90% 성향의 저를, 이제는 사람들과 소통하고 의견을 나누는 데 훨씬 편한 사람으로 만들어준 곳이기도 합니다. 또 제가 좋아하는 다양한 차량을 직접 경험하고, 개발해 나가는 과정에서 새로운 도전에 재미를 느낄 수 있는, 제게는 아주 럭셔리한 놀이터 같은 공간이기도 합니다. 그래서 GMTCK는 제 삶에 큰 영향을 준, 고맙고 애정이 가는 회사입니다.",
        aEn:`GMTCK is my first workplace and the place that has shaped me into a decent working professional. I’ve gone through a lot of trial and error, but in the process, I naturally learned how to work and how to deal with people. You could also say it’s where someone like me, who is about 90% “Introvert”, became much more comfortable communicating and sharing opinions with others.

It’s also like a very “luxurious playground” for me, where I can directly experience and help develop the various vehicles I love and find real enjoyment in taking on new challenges. In that sense, GMTCK is a company that has had a huge impact on my life—one that I feel very grateful for and deeply attached to.`,
      },
    ],
  },
  "pipg-thermal": {
    questions: [
      {
        q: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qKr: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qEn:"Please introduce your team and role & responsibilities specifically",
        a: "저희 담당은 가상 및 실제 주행 환경에서 차량 열에너지 시스템과 공조 성능을 구현/최적화하고 예측/검증하고 개발하는 업무를 맡고 있어요. 제가 맡고 있는 일은, 전기차 안에서 열이 효율적으로 관리될 수 있도록 조율하고 제어값을 맞추는 일이에요. 예를 들어 아주 더운 여름날, 배터리는 과열되고 실내는 시원하게 해야 할 때, 냉방 에너지를 배터리에 더 써야 할지, 승객에게 더 써야 할지 우선순위를 정해서 Cooling Power를 어떻게 배분할지 조율하는 게 제 역할이에요. 그리고 그렇게 정해진 냉방을 실제로 만들기 위해 콤프레서나 밸브 같은 부품들을 어떻게 작동시킬지도 같이 제어하고 있습니다.",
        aKr: "저희 담당은 가상 및 실제 주행 환경에서 차량 열에너지 시스템과 공조 성능을 구현/최적화하고 예측/검증하고 개발하는 업무를 맡고 있어요. 제가 맡고 있는 일은, 전기차 안에서 열이 효율적으로 관리될 수 있도록 조율하고 제어값을 맞추는 일이에요. 예를 들어 아주 더운 여름날, 배터리는 과열되고 실내는 시원하게 해야 할 때, 냉방 에너지를 배터리에 더 써야 할지, 승객에게 더 써야 할지 우선순위를 정해서 Cooling Power를 어떻게 배분할지 조율하는 게 제 역할이에요. 그리고 그렇게 정해진 냉방을 실제로 만들기 위해 콤프레서나 밸브 같은 부품들을 어떻게 작동시킬지도 같이 제어하고 있습니다.",
        aEn:"Our team is responsible for implementing and optimizing the vehicle’s thermal energy system and HVAC performance, and for predicting and validating them in both virtual and real driving environments. My role is to ensure that heat is managed efficiently inside an EV by coordinating and tuning the control targets. For example, on a very hot summer day when the battery is overheating but the cabin also needs to be kept cool, I determine the priorities—how much cooling power should go to the battery versus the passengers—and allocate the cooling capacity accordingly. I also control how components such as the compressor and valves should operate in order to actually deliver the required cooling.",
      },
      {
        q: "담당하고 있는 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "담당하고 있는 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn:"Which capabilities do we need to have for your role?",
        a: '제가 생각하기에 이 직무에서는 열역학, 열전달, 유체역학 같은 기본 지식, 그리고 로직 해석 능력, 커뮤니케이션 능력 이 세 가지가 특히 중요한 것 같아요. 차량의 HVAC이나 전기차 배터리 열관리는 열 흐름이나 냉매 특성 같은 물리적인 현상을 다루기 때문에, 기초 지식이 있어야 시스템 반응이나 이상 현상을 빠르게 이해할 수 있고요. 또 단순 계산으로 끝나는 게 아니라, 실제 차량에 로직을 적용하고 결과를 분석해야 하기 때문에, "왜 이런 반응이 나왔지?", "이 구간은 왜 튜닝이 필요하지?" 같은 걸 논리적으로 해석할 수 있는 사고력이 중요해요. 그리고 이 일이 혼자 하는 게 아니라 배터리, 모터, 전장, 소프트웨어팀 등과 협업해야 할 일이 많아서, 문제를 잘 설명하고 조율하는 커뮤니케이션 능력도 꼭 필요하다고 생각합니다.',
        aKr: '제가 생각하기에 이 직무에서는 열역학, 열전달, 유체역학 같은 기본 지식, 그리고 로직 해석 능력, 커뮤니케이션 능력 이 세 가지가 특히 중요한 것 같아요. 차량의 HVAC이나 전기차 배터리 열관리는 열 흐름이나 냉매 특성 같은 물리적인 현상을 다루기 때문에, 기초 지식이 있어야 시스템 반응이나 이상 현상을 빠르게 이해할 수 있고요. 또 단순 계산으로 끝나는 게 아니라, 실제 차량에 로직을 적용하고 결과를 분석해야 하기 때문에, "왜 이런 반응이 나왔지?", "이 구간은 왜 튜닝이 필요하지?" 같은 걸 논리적으로 해석할 수 있는 사고력이 중요해요. 그리고 이 일이 혼자 하는 게 아니라 배터리, 모터, 전장, 소프트웨어팀 등과 협업해야 할 일이 많아서, 문제를 잘 설명하고 조율하는 커뮤니케이션 능력도 꼭 필요하다고 생각합니다.',
        aEn:`I believe three capabilities are especially important in this role: a solid foundation in thermodynamics, heat transfer, and fluid mechanics, the ability to analyze control logic, and strong communication skills.

HVAC and EV battery thermal management deal with physical phenomena such as heat flow and refrigerant properties, so you need basic theoretical knowledge to quickly understand system behavior and abnormal conditions. Since the work does not end with simple calculations but involves applying logic to real vehicles and analyzing the results, it is also crucial to think logically about questions like, “Why did the system respond this way?” or “Why does this operating range need tuning?”

Finally, this is not a role you perform alone. You frequently collaborate with battery, motor, electrical, and software teams, so the ability to clearly explain issues and coordinate with others is an essential skill.`,
      },
      {
        q: "진행하셨던 프로젝트 중 인상깊었던 프로젝트가 있나요?",
        qKr: "진행하셨던 프로젝트 중 인상깊었던 프로젝트가 있나요?",
        qEn:"What is the most impressive project that you have done before?",
        a: '작년 겨울에, 겨울철 주행거리가 너무 짧게 나와서 그걸 개선하는 프로젝트를 했었는데요. 문제 원인을 보니까 고전압 냉각수 히터가 너무 과하게 작동하면서 배터리를 많이 소모하는 게 주 원인이었어요. 그래서 팀원들과 같이 설정 온도나 내외기 도어 제어 방식을 조정해서, 냉난방 성능은 유지하면서도 주행거리를 늘릴 수 있도록 캘리브레이션을 바꿨던 경험이 있어요. 이런 식으로 제가 한 작업이 실제 차량에 적용되고, 고객이 체감할 수 있는 결과로 이어질 때, "아, 내가 진짜 의미 있는 일을 하고 있구나"라는 걸 느껴요. 단순히 책상 앞에서 끝나는 일이 아니라, 실차 반영까지 연결된다는 점이 이 일의 큰 매력이라고 생각합니다.',
        aKr: '작년 겨울에, 겨울철 주행거리가 너무 짧게 나와서 그걸 개선하는 프로젝트를 했었는데요. 문제 원인을 보니까 고전압 냉각수 히터가 너무 과하게 작동하면서 배터리를 많이 소모하는 게 주 원인이었어요. 그래서 팀원들과 같이 설정 온도나 내외기 도어 제어 방식을 조정해서, 냉난방 성능은 유지하면서도 주행거리를 늘릴 수 있도록 캘리브레이션을 바꿨던 경험이 있어요. 이런 식으로 제가 한 작업이 실제 차량에 적용되고, 고객이 체감할 수 있는 결과로 이어질 때, "아, 내가 진짜 의미 있는 일을 하고 있구나"라는 걸 느껴요. 단순히 책상 앞에서 끝나는 일이 아니라, 실차 반영까지 연결된다는 점이 이 일의 큰 매력이라고 생각합니다.',
        aEn:`One memorable project I worked on was last winter, when we set out to improve winter driving range, which was coming out much shorter than expected. After identifying the root cause, we found that the high-voltage coolant heater was operating too aggressively and consuming a lot of battery energy. Together with my teammates, we adjusted settings such as target temperatures and the control strategy for the fresh/recirculation doors and recalibrated the system so that we could extend the driving range while maintaining heating and cooling performance.

When work like this is applied to a production vehicle and leads to results that customers can truly feel, I think to myself, “I’m doing something genuinely meaningful.” For me, the real appeal of this job is that it doesn’t end at the desk, but it’s directly connected to real vehicles on the road.`,
      },
      {
        q: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qKr: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qEn:"How do you think about your team culture and teammates working together?",
        a: "저희 팀은 자율성과 책임감을 바탕으로 일하는 분위기예요. 일정이나 방식이 딱딱하게 정해진 건 아니고, 각자 자기 업무를 주도적으로 끌고 가는 스타일이 잘 맞는 팀이에요. 무슨 문제가 생겨도 서로 도와주는 분위기라서, 처음 들어오셔도 부담 없이 배우실 수 있을 거예요. 전체적으로 보면 편안하지만, 일은 프로답게 해나가는 그런 팀이라고 생각합니다.",
        aKr: "저희 팀은 자율성과 책임감을 바탕으로 일하는 분위기예요. 일정이나 방식이 딱딱하게 정해진 건 아니고, 각자 자기 업무를 주도적으로 끌고 가는 스타일이 잘 맞는 팀이에요. 무슨 문제가 생겨도 서로 도와주는 분위기라서, 처음 들어오셔도 부담 없이 배우실 수 있을 거예요. 전체적으로 보면 편안하지만, 일은 프로답게 해나가는 그런 팀이라고 생각합니다.",
        aEn:"Our team works in an atmosphere built on autonomy and responsibility. Schedules and working methods are not rigidly fixed, so it’s a great fit for people who like to take the lead and drive their own work forward. There’s also a strong culture of helping one another, so even if you’re new to the team, you can learn without feeling pressured. Overall, I’d say it’s a comfortable environment, but one where we still approach our work in a thoroughly professional way.",
      },
      {
        q: "앞으로의 목표 또는 커리어 방향",
        qKr: "앞으로의 목표 또는 커리어 방향",
        qEn:"Please tell us your future goals and career direction.",
        a: "이 직무는 단순히 HVAC만 보는 게 아니라, 차량 전체의 열 흐름과 에너지 효율을 통합적으로 다루는 일이라 시야가 굉장히 넓어져요. 그래서 경력이 쌓이면 배터리나 모터, 전장 쪽과 협업하면서 전체 Thermal 시스템을 리드하는 역할로 성장할 수 있고, 또는 제어 로직 개발이나 캘리브레이션 전략을 총괄하는 시니어 엔지니어로도 자연스럽게 이어질 수 있어요. 나중에는 통합 열관리 플랫폼을 기획하거나, 글로벌 프로젝트를 리드하는 기회도 열려 있고요. 최근에는 소프트웨어 기반 제어 로직의 중요성이 더욱 커지고 있는 만큼, 열에너지 분야는 하드웨어와 소프트웨어를 아우르는 핵심 영역으로 지속적인 성장 가능성이 있다고 생각합니다.",
        aKr: "이 직무는 단순히 HVAC만 보는 게 아니라, 차량 전체의 열 흐름과 에너지 효율을 통합적으로 다루는 일이라 시야가 굉장히 넓어져요. 그래서 경력이 쌓이면 배터리나 모터, 전장 쪽과 협업하면서 전체 Thermal 시스템을 리드하는 역할로 성장할 수 있고, 또는 제어 로직 개발이나 캘리브레이션 전략을 총괄하는 시니어 엔지니어로도 자연스럽게 이어질 수 있어요. 나중에는 통합 열관리 플랫폼을 기획하거나, 글로벌 프로젝트를 리드하는 기회도 열려 있고요. 최근에는 소프트웨어 기반 제어 로직의 중요성이 더욱 커지고 있는 만큼, 열에너지 분야는 하드웨어와 소프트웨어를 아우르는 핵심 영역으로 지속적인 성장 가능성이 있다고 생각합니다.",
        aEn:"In this role, you don’t just look at HVAC in isolation, you deal with the vehicle’s overall heat flow and energy efficiency in an integrated way, so your perspective naturally becomes very broad. As you gain experience, you can grow into a role that leads the entire thermal system while collaborating with battery, motor, and electrical teams, or you can naturally progress into a senior engineer position overseeing control logic development and calibration strategies. In the long term, there are also opportunities to plan integrated thermal management platforms or lead global projects. As software-based control logic becomes increasingly important, I believe the thermal energy domain will continue to grow as a core area that spans both hardware and software.",
      },
    ],
  },
  "pipg-pgtlo": {
    questions: [
      {
        q: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qKr: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qEn:"Please introduce your team and role & responsibilities specifically",
        a: "저희 담당은 차량 개발 과정에서 필수적으로 수행되는 성능, 내구성, 배출가스, 소음·진동, 안전 관련 다양한 요구사항을 종합적으로 검증할 수 있는 세계적 수준의 인프라를 보유하고 있습니다. 또한 미래 모빌리티 규제와 기술을 선도하며, 지속적인 시험 환경 고도화를 통해 Virtual과 Physical을 아우를 수 있는 폭넓은 시험 역량을 갖추고 있답니다.\n\n저는 Energy & Emission Lab Ops 팀에 근무하고 있으며 차량의 양산을 위해 필수적으로 수행되어야 하는 배출가스 인증시험, EV Electric Range 시험, 신규 법규 시험들을 수행/지원하고 있어요.",
        aKr: "저희 담당은 차량 개발 과정에서 필수적으로 수행되는 성능, 내구성, 배출가스, 소음·진동, 안전 관련 다양한 요구사항을 종합적으로 검증할 수 있는 세계적 수준의 인프라를 보유하고 있습니다. 또한 미래 모빌리티 규제와 기술을 선도하며, 지속적인 시험 환경 고도화를 통해 Virtual과 Physical을 아우를 수 있는 폭넓은 시험 역량을 갖추고 있답니다.\n\n저는 Energy & Emission Lab Ops 팀에 근무하고 있으며 차량의 양산을 위해 필수적으로 수행되어야 하는 배출가스 인증시험, EV Electric Range 시험, 신규 법규 시험들을 수행/지원하고 있어요.",
        aEn:"Our department has world-class infrastructure that allows us to comprehensively validate a wide range of performance, durability, emissions, noise & vibration, and safety requirements that are essential throughout the vehicle development process. We also take the lead in future mobility regulations and technologies, and by continuously advancing our test environment, we have built broad testing capabilities that span both virtual and physical domains. I work on the Energy & Emission Lab Ops team, where I perform and support emissions certification tests, EV electric range tests, and new regulatory tests that are essential for vehicle mass production.",
      },
      {
        q: "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn:"Which capabilities do we need to have for your role?",
        a: "부품부터 완성차에 이르기까지 다양한 시험을 수행하는 업무가 많아 안전에 대한 마인드는 기본적으로 갖추어야 합니다. 또한 시험 의뢰 부서들과의 적극적인 의견 조율이 빈번하기에 탐구적이고 긍정적인 의사소통 능력도 중요하다 할 수 있구요. 마지막으로 AI의 발달과 전기차, AV 기술의 대중화가 빠르게 진행되고 있는 만큼 관련된 신기술/법규에 대한 신속한 적응력도 필요하답니다. 이 능력까지 갖춘 분이 계시다면 그분은 이미 One of Us!!",
        aKr: "부품부터 완성차에 이르기까지 다양한 시험을 수행하는 업무가 많아 안전에 대한 마인드는 기본적으로 갖추어야 합니다. 또한 시험 의뢰 부서들과의 적극적인 의견 조율이 빈번하기에 탐구적이고 긍정적인 의사소통 능력도 중요하다 할 수 있구요. 마지막으로 AI의 발달과 전기차, AV 기술의 대중화가 빠르게 진행되고 있는 만큼 관련된 신기술/법규에 대한 신속한 적응력도 필요하답니다. 이 능력까지 갖춘 분이 계시다면 그분은 이미 One of Us!!",
        aEn:"For this role, I believe several key capabilities are important. First, because we conduct a wide range of tests from components to complete vehicles, having a strong safety mindset is fundamental. In addition, we frequently need to actively coordinate and align with the departments requesting tests, so inquisitive and positive communication skills are also essential. Lastly, as AI advances and EV/AV technologies rapidly become more widespread, the ability to quickly adapt to new technologies and regulations is increasingly important. If you already have all of these capabilities, you’re one of us!",
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
  "avd&svi/eais.png",
  "avd&svi/ise.png",
  "avd&svi/svi_new.png",
  "beca/Aftersales.png",
  "beca/chassis.png",
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
  "me/me.png",
  "ops/operations.png",
  "ops/sqd.png",
  "pipg/pgtlo_new.png",
  "pipg/psc.png",
  "pipg/thermal_new.png",
  "pipg/vpdpid.png",
  "s&s/cchppmo.png",
  "s&s/compute-platform-hw.png",
  "s&s/platform-id.png",
  "s&s/platform-sw.png",
  "s&s/maec.png",
  "s&s/swqnd.png",
  "ve/safety performance integration1.png",
  "ve/safety performance integration2.png",
  "ve/vIrtual integration center adas 1.png",
  "ve/virtual engineering solution1.png",
  "ve/virtual engineering solution2.png",
  "ve/virtual engineering solution3.png",
  "ve/virtual engineering solution4.png",
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
