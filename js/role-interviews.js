/**
 * Role interview data + single HTML template for all role interviews.
 *
 * 데이터 모델 (담당 = 역할 1개)
 *   - 담당(역할) 하나당 인터뷰는 보통 1건이다. (예: BECA Body → interviewId "beca-body" 1개)
 *   - interviewContent[interviewId] = 그 인터뷰 1건; questions[] = 그 인터뷰 안의 질문·답변 목록(5문항 등)
 *   - 예외: VE 본부는 같은 담당(role)에 여러 명(ve1.png, ve2.png …)이 있을 수 있고,
 *     interviewId는 ve-{roleId}-1, ve-{roleId}-2 … 형태로 여러 섹션(캐러셀)이 된다.
 *   - 예외: EE의 System & Product Investigation은 EE1a.png, EE1b.png … / interviewId ee-system-investigation-1, -2 … (team-tck-interviews.html 캐러셀).
 *
 * Edit here only:
 *   - interviewData: 프로필 이미지·인사말·interviewId(섹션 id). 담당 1개당 보통 행 1개(VE는 여러 행 가능)
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
const PROFILE_PLACEHOLDER_IMAGE = "./images/logo/gm-symbol-color-light-bg-web.png";

/** 인터뷰 히어로 배경 — `images/formula_pic/` 파일명만 나열 (추가 시 배열에만 넣으면 됨) */
const FORMULA_PIC_BACKGROUNDS = [
  "26CDF1CD070048_MP0_2856_n4FJ6BVv_20260327083912.JPG",
  "26CDF1CD070060_MP9_4663_WG72VVZX_20260328082833.png",
];

function getFormulaPicBackgroundUrl(seed) {
  const files = FORMULA_PIC_BACKGROUNDS;
  if (!files.length) return "";
  let h = 0;
  const s = String(seed || "default");
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(h) % files.length;
  return `./images/formula_pic/${files[idx]}`;
}

const interviewData = {
  // VE 본부
  "ve1.png": {
    useTpThumbnail: true,
    hq: "VE", 
    role: "Safety Performance Integration", 
    roleKr: "Safety Performance Integration", 
    roleEn: "Safety Performance Integration",
    name: "조영진",
    nameKr: "조영진",
    nameEn: "Youngjin Cho",
    greeting: "안녕하세요\nVE본부의 Safety Performance Integration담당\n조영진입니다",
    greetingKr: "안녕하세요\nVE본부의 Safety Performance Integration담당\n조영진입니다",
    greetingEn: "Hello\nSafety Performance Integration, VE HQ\nYoungjin Cho"
  },
  "ve2.png": {
    useTpThumbnail: true,
    hq: "VE", 
    role: "Safety Performance Integration", 
    roleKr: "Safety Performance Integration", 
    roleEn: "Safety Performance Integration",
    name: "이름2",
    nameKr: "이름2",
    nameEn: "Name2",
    greeting: "안녕하세요\nVE본부의 Safety Performance Integration담당\n이름2입니다",
    greetingKr: "안녕하세요\nVE본부의 Safety Performance Integration담당\n이름2입니다",
    greetingEn: "Hello\nSafety Performance Integration, VE HQ\nName2"
  },
  "ve3.png": { 
    hq: "VE", 
    role: "Virtual Integration Center & ADAS", 
    roleKr: "Virtual Integration Center & ADAS", 
    roleEn: "Virtual Integration Center & ADAS",
    name: "이름3",
    nameKr: "이름3",
    nameEn: "Name3",
    greeting: "안녕하세요.<br>Virtual Integration Center & ADAS 담당<br>입니다.",
    greetingKr: "안녕하세요.<br>Virtual Integration Center & ADAS 담당<br>입니다.",
    greetingEn: "Hello.<br>I'm from Virtual Integration Center & ADAS."
  },
  "ve4.png": {
    hq: "VE",
    role: "Virtual Integration Center & ADAS",
    roleKr: "Virtual Integration Center & ADAS",
    roleEn: "Virtual Integration Center & ADAS",
    name: "이름4",
    nameKr: "이름4",
    nameEn: "Name4",
    greeting: "안녕하세요\nVE본부의 Virtual Integration Center & ADAS담당\n이름4입니다",
    greetingKr: "안녕하세요\nVE본부의 Virtual Integration Center & ADAS담당\n이름4입니다",
    greetingEn: "Hello\nVirtual Integration Center & ADAS, VE HQ\nName4"
  },
  "ve5.png": {
    hq: "VE",
    role: "Virtual Integration Center & ADAS",
    roleKr: "Virtual Integration Center & ADAS",
    roleEn: "Virtual Integration Center & ADAS",
    name: "이름5",
    nameKr: "이름5",
    nameEn: "Name5",
    greeting: "안녕하세요\nVE본부의 Virtual Integration Center & ADAS담당\n이름5입니다",
    greetingKr: "안녕하세요\nVE본부의 Virtual Integration Center & ADAS담당\n이름5입니다",
    greetingEn: "Hello\nVirtual Integration Center & ADAS, VE HQ\nName5"
  },
  "ve6.png": {
    hq: "VE",
    role: "Virtual Engineering Solution",
    roleKr: "Virtual Engineering Solution",
    roleEn: "Virtual Engineering Solution",
    name: "이름6",
    nameKr: "이름6",
    nameEn: "Name6",
    greeting: "안녕하세요\nVE본부의 Virtual Engineering Solution담당\n이름6입니다",
    greetingKr: "안녕하세요\nVE본부의 Virtual Engineering Solution담당\n이름6입니다",
    greetingEn: "Hello\nVirtual Engineering Solution, VE HQ\nName6"
  },
  "ve7.png": {
    hq: "VE",
    role: "Virtual Engineering Solution",
    roleKr: "Virtual Engineering Solution",
    roleEn: "Virtual Engineering Solution",
    name: "이름7",
    nameKr: "이름7",
    nameEn: "Name7",
    greeting: "안녕하세요\nVE본부의 Virtual Engineering Solution담당\n이름7입니다",
    greetingKr: "안녕하세요\nVE본부의 Virtual Engineering Solution담당\n이름7입니다",
    greetingEn: "Hello\nVirtual Engineering Solution, VE HQ\nName7"
  },
  "ve8.png": {
    hq: "VE",
    role: "Virtual Engineering Solution",
    roleKr: "Virtual Engineering Solution",
    roleEn: "Virtual Engineering Solution",
    name: "이름8",
    nameKr: "이름8",
    nameEn: "Name8",
    greeting: "안녕하세요\nVE본부의 Virtual Engineering Solution담당\n이름8입니다",
    greetingKr: "안녕하세요\nVE본부의 Virtual Engineering Solution담당\n이름8입니다",
    greetingEn: "Hello\nVirtual Engineering Solution, VE HQ\nName8"
  },
  // AVD & SVI 본부
  "avd1.png": {
    profileFallback: PROFILE_PLACEHOLDER_IMAGE,
    hq: "AVD & SVI", 
    role: "Advanced Vehicle Development", 
    roleKr: "Advanced Vehicle Development", 
    roleEn: "Advanced Vehicle Development",
    name: "김성수",
    nameKr: "김성수",
    nameEn: "Seongsu Kim",
    greeting: "안녕하세요\nAVD & SVI본부의 Advanced Vehicle Development담당\n김성수입니다",
    greetingKr: "안녕하세요\nAVD & SVI본부의 Advanced Vehicle Development담당\n김성수입니다",
    greetingEn: "Hello\nAdvanced Vehicle Development, AVD & SVI HQ\nSeongsu Kim",
    interviewId: "avd-advanced-vehicle" // 기존 인터뷰 섹션 ID
  },
  "svi1.png": {
    profileFallback: PROFILE_PLACEHOLDER_IMAGE,
    hq: "AVD & SVI", 
    role: "Studio & Surface Integration", 
    roleKr: "Studio & Surface Integration", 
    roleEn: "Studio & Surface Integration",
    name: "이정원차장",
    nameKr: "이정원차장",
    nameEn: "Jeongwon Lee",
    greeting: "안녕하세요\nAVD & SVI본부의 Studio & Surface Integration담당\n이정원차장입니다",
    greetingKr: "안녕하세요\nAVD & SVI본부의 Studio & Surface Integration담당\n이정원차장입니다",
    greetingEn: "Hello\nStudio & Surface Integration, AVD & SVI HQ\nJeongwon Lee",
    interviewId: "avd-studio-surface" // 기존 인터뷰 섹션 ID
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
    nameEn: "Jaehyuk Lee",
    greeting: "안녕하세요\nPIPG본부의 Propulsion System Calibration담당\n이재혁입니다",
    greetingKr: "안녕하세요\nPIPG본부의 Propulsion System Calibration담당\n이재혁입니다",
    greetingEn: "Hello\nPropulsion System Calibration, PIPG HQ\nJaehyuk Lee",
    interviewId: "pipg-psc" // 기존 인터뷰 섹션 ID
  },
  "PIPG2.png": {
    profileImage: "./images/profilepic/pipg/vpdpid.png",
    hq: "PIPG", 
    role: "VPD/PID", 
    roleKr: "VPD/PID", 
    roleEn: "VPD/PID",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting: "안녕하세요.<br>VPD/PID 담당<br>입니다.",
    greetingKr: "안녕하세요.<br>VPD/PID 담당<br>입니다.",
    greetingEn: "Hello.<br>I'm from VPD/PID.",
    interviewId: "pipg-vpd-pid" // 기존 인터뷰 섹션 ID
  },
  "PIPG3.png": {
    profileImage: "./images/profilepic/pipg/Thermal.jpg",
    hq: "PIPG",
    role: "Thermal",
    roleKr: "Thermal",
    roleEn: "Thermal",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting: "안녕하세요\nPIPG본부의 Thermal담당\n이름입니다",
    greetingKr: "안녕하세요\nPIPG본부의 Thermal담당\n이름입니다",
    greetingEn: "Hello\nThermal, PIPG HQ\nName",
    interviewId: "pipg-thermal",
  },
  "PIPG4.png": {
    profileImage: "./images/profilepic/pipg/pgtlo.png",
    hq: "PIPG",
    role: "PGTLO",
    roleKr: "PGTLO",
    roleEn: "PGTLO",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting: "안녕하세요\nPIPG본부의 PGTLO담당\n이름입니다",
    greetingKr: "안녕하세요\nPIPG본부의 PGTLO담당\n이름입니다",
    greetingEn: "Hello\nPGTLO, PIPG HQ\nName",
    interviewId: "pipg-pgtlo",
  },
  // BECA — images/BECA1.png … 프로필 사진 추가 시 전체보기 그리드에 자동 표시
  "BECA1.png": {
    profileImage: "./images/profilepic/beca/body.png",
    hq: "BECA",
    role: "Body",
    roleKr: "Body",
    roleEn: "Body",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting: "안녕하세요\nBECA본부의 Body담당\n이름입니다",
    greetingKr: "안녕하세요\nBECA본부의 Body담당\n이름입니다",
    greetingEn: "Hello\nBody, BECA HQ\nName",
    interviewId: "beca-body",
  },
  "BECA2.png": {
    profileImage: "./images/profilepic/beca/Exterior.png",
    hq: "BECA",
    role: "Exterior",
    roleKr: "Exterior",
    roleEn: "Exterior",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting: "안녕하세요\nBECA본부의 Exterior담당\n이름입니다",
    greetingKr: "안녕하세요\nBECA본부의 Exterior담당\n이름입니다",
    greetingEn: "Hello\nExterior, BECA HQ\nName",
    interviewId: "beca-exterior",
  },
  "BECA3.png": {
    profileImage: "./images/profilepic/beca/Chassis.png",
    hq: "BECA",
    role: "Chassis",
    roleKr: "Chassis",
    roleEn: "Chassis",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting: "안녕하세요\nBECA본부의 Chassis담당\n이름입니다",
    greetingKr: "안녕하세요\nBECA본부의 Chassis담당\n이름입니다",
    greetingEn: "Hello\nChassis, BECA HQ\nName",
    interviewId: "beca-chassis",
  },
  "BECA4.png": {
    profileFallback: PROFILE_PLACEHOLDER_IMAGE,
    hq: "BECA",
    role: "Aftersales",
    roleKr: "Aftersales",
    roleEn: "Aftersales",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting: "안녕하세요\nBECA본부의 Aftersales담당\n이름입니다",
    greetingKr: "안녕하세요\nBECA본부의 Aftersales담당\n이름입니다",
    greetingEn: "Hello\nAftersales, BECA HQ\nName",
    interviewId: "beca-aftersales",
  },
  // ITPE
  "ITPE1.png": {
    profileFallback: PROFILE_PLACEHOLDER_IMAGE,
    hq: "ITPE",
    role: "Interior Trim",
    roleKr: "Interior Trim",
    roleEn: "Interior Trim",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting: "안녕하세요\nITPE본부의 Interior Trim담당\n이름입니다",
    greetingKr: "안녕하세요\nITPE본부의 Interior Trim담당\n이름입니다",
    greetingEn: "Hello\nInterior Trim, ITPE HQ\nName",
    interviewId: "itpe-interior-trim",
  },
  "ITPE2.png": {
    profileFallback: PROFILE_PLACEHOLDER_IMAGE,
    hq: "ITPE",
    role: "Seat & Safety Restraints",
    roleKr: "Seat & Safety Restraints",
    roleEn: "Seat & Safety Restraints",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting: "안녕하세요\nITPE본부의 Seat & Safety Restraints담당\n이름입니다",
    greetingKr: "안녕하세요\nITPE본부의 Seat & Safety Restraints담당\n이름입니다",
    greetingEn: "Hello\nSeat & Safety Restraints, ITPE HQ\nName",
    interviewId: "itpe-seat-safety",
  },
  "ITPE3.png": {
    profileFallback: PROFILE_PLACEHOLDER_IMAGE,
    hq: "ITPE",
    role: "Thermal & Propulsion Integration",
    roleKr: "Thermal & Propulsion Integration",
    roleEn: "Thermal & Propulsion Integration",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting: "안녕하세요\nITPE본부의 Thermal & Propulsion Integration담당\n이름입니다",
    greetingKr: "안녕하세요\nITPE본부의 Thermal & Propulsion Integration담당\n이름입니다",
    greetingEn: "Hello\nThermal & Propulsion Integration, ITPE HQ\nName",
    interviewId: "itpe-thermal-propulsion",
  },
  "ITPE4.png": {
    profileFallback: PROFILE_PLACEHOLDER_IMAGE,
    hq: "ITPE",
    role: "ECS",
    roleKr: "ECS",
    roleEn: "ECS",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting: "안녕하세요\nITPE본부의 ECS담당\n이름입니다",
    greetingKr: "안녕하세요\nITPE본부의 ECS담당\n이름입니다",
    greetingEn: "Hello\nECS, ITPE HQ\nName",
    interviewId: "itpe-ecs",
  },
  // S&S (Software & Services) — images/profilepic/s&s/ (URL 경로는 & → %26)
  "SS1.png": {
    profileImage: "./images/profilepic/s%26s/cchppmo.png",
    hq: "S&S",
    role: "CCH/PPMO",
    roleKr: "CCH/PPMO",
    roleEn: "CCH/PPMO",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting: "안녕하세요\nS&S본부의 CCH/PPMO담당\n이름입니다",
    greetingKr: "안녕하세요\nS&S본부의 CCH/PPMO담당\n이름입니다",
    greetingEn: "Hello\nCCH/PPMO, Software & Services HQ\nName",
    interviewId: "ss-cch-ppmo",
  },
  "SS2.png": {
    profileImage: "./images/profilepic/s%26s/maec.png",
    hq: "S&S",
    role: "MAEC",
    roleKr: "MAEC",
    roleEn: "MAEC",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting: "안녕하세요\nS&S본부의 MAEC담당\n이름입니다",
    greetingKr: "안녕하세요\nS&S본부의 MAEC담당\n이름입니다",
    greetingEn: "Hello\nMAEC, Software & Services HQ\nName",
    interviewId: "ss-maec",
  },
  "SS3.png": {
    profileImage: "./images/profilepic/s%26s/swqnd.png",
    hq: "S&S",
    role: "SWQnD",
    roleKr: "SWQnD",
    roleEn: "SWQnD",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting: "안녕하세요\nS&S본부의 SWQnD담당\n이름입니다",
    greetingKr: "안녕하세요\nS&S본부의 SWQnD담당\n이름입니다",
    greetingEn: "Hello\nSWQnD, Software & Services HQ\nName",
    interviewId: "ss-swqnd",
  },
  "EE1a.png": {
    profileFallback: PROFILE_PLACEHOLDER_IMAGE,
    hq: "Engineering Excellence",
    role: "Systems & Product Investigation Division",
    roleKr: "System & Product Investigation",
    roleEn: "Systems & Product Investigation Division",
    name: "윤애진 차장",
    nameKr: "윤애진 차장",
    nameEn: "Ae-Jin Yun",
    greeting:
      "안녕하세요\nEngineering Excellence의 System & Product Investigation담당\n윤애진 차장입니다",
    greetingKr:
      "안녕하세요\nEngineering Excellence의 System & Product Investigation담당\n윤애진 차장입니다",
    greetingEn:
      "Hello\nSystems & Product Investigation, Engineering Excellence HQ\nAe-Jin Yun",
    interviewId: "ee-system-investigation-1",
  },
  "EE1b.png": {
    profileFallback: PROFILE_PLACEHOLDER_IMAGE,
    hq: "Engineering Excellence",
    role: "Systems & Product Investigation Division",
    roleKr: "System & Product Investigation",
    roleEn: "Systems & Product Investigation Division",
    name: "권민들 차장",
    nameKr: "권민들 차장",
    nameEn: "Min-deul Kwon",
    greeting:
      "안녕하세요\nEngineering Excellence의 System & Product Investigation담당\n권민들 차장입니다",
    greetingKr:
      "안녕하세요\nEngineering Excellence의 System & Product Investigation담당\n권민들 차장입니다",
    greetingEn:
      "Hello\nSystems & Product Investigation, Engineering Excellence HQ\nMin-deul Kwon",
    interviewId: "ee-system-investigation-2",
  },
  "EE0.png": {
    profileFallback: PROFILE_PLACEHOLDER_IMAGE,
    hq: "Engineering Excellence",
    role: "Certification, Environmental Strategy & EI Division",
    roleKr: "Certification, Environmental Strategy & EI",
    roleEn: "Certification, Environmental Strategy & EI Division",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting:
      "안녕하세요\nEngineering Excellence의 Certification, Environmental Strategy & EI담당\n이름입니다",
    greetingKr:
      "안녕하세요\nEngineering Excellence의 Certification, Environmental Strategy & EI담당\n이름입니다",
    greetingEn:
      "Hello\nCertification, Environmental Strategy & EI Division, Engineering Excellence HQ\nName",
    interviewId: "ee-certification",
  },
  "EE2.png": {
    profileFallback: PROFILE_PLACEHOLDER_IMAGE,
    hq: "Engineering Excellence",
    role: "Validation Division",
    roleKr: "Validation",
    roleEn: "Validation Division",
    name: "이름",
    nameKr: "이름",
    nameEn: "Name",
    greeting: "안녕하세요\nEngineering Excellence의 Validation담당\n이름입니다",
    greetingKr: "안녕하세요\nEngineering Excellence의 Validation담당\n이름입니다",
    greetingEn: "Hello\nValidation Division, Engineering Excellence HQ\nName",
    interviewId: "ee-verification",
  },
};

// 인터뷰 내용: interviewId(담당)당 객체 1개. questions = 그 인터뷰 1건의 문항들.
// BECA / ITPE / S&S 본문은 data/interview-content-beca-itpe-ss.json (담당당 인터뷰 1건, VE 제외)
// EE 일부 본문은 data/interview-content-ee.json
// JSON 수정 후 배포 시 ?v= 숫자 올려 캐시 무력화 (CDN·프록시 대비)
const INTERVIEW_CONTENT_BECA_ITPE_SS_URL = "./data/interview-content-beca-itpe-ss.json?v=5";
const INTERVIEW_CONTENT_EE_URL = "./data/interview-content-ee.json?v=3";
const INTERVIEW_CONTENT_VE_URL = "./data/interview-content-ve.json?v=2";

async function loadInterviewContentBecaItpeSs() {
  // no-store: JSON 수정 후에도 브라우저가 오래된 캐시를 쓰지 않도록 함
  const res = await fetch(INTERVIEW_CONTENT_BECA_ITPE_SS_URL, { cache: "no-store" });
  if (!res.ok) {
    console.warn("[role-interviews] BECA/ITPE/S&S JSON 로드 실패:", res.status);
    return;
  }
  const extra = await res.json();
  Object.assign(interviewContent, extra);
}

async function loadInterviewContentEe() {
  const res = await fetch(INTERVIEW_CONTENT_EE_URL, { cache: "no-store" });
  if (!res.ok) {
    console.warn("[role-interviews] EE JSON 로드 실패:", res.status);
    return;
  }
  Object.assign(interviewContent, await res.json());
}

async function loadInterviewContentVe() {
  const res = await fetch(INTERVIEW_CONTENT_VE_URL, { cache: "no-store" });
  if (!res.ok) {
    console.warn("[role-interviews] VE JSON 로드 실패:", res.status);
    return;
  }
  Object.assign(interviewContent, await res.json());
}

async function loadInterviewContentExtras() {
  await Promise.all([
    loadInterviewContentBecaItpeSs(),
    loadInterviewContentEe(),
    loadInterviewContentVe(),
  ]);
}

const interviewContent = {
  "avd-advanced-vehicle": {
    questions: [
      {
        q: "AVD 담당은 어떤 일을 하는 곳인가요?",
        qKr: "AVD 담당은 어떤 일을 하는 곳인가요?",
        qEn: "What does the AVD department do?",
        a: "AVD(Advanced Vehicle Development) 담당은 차량개발초기 Architecture와 Package(차체 구조·공간 설계)를 기반으로 고객이 체감하는 차량의 기본기를 설계·기획하고, 혁신적인 아이디어와 프로젝트를 발굴·주도하여 GMTCK 전사의 Innovation Hub 역할을 수행하는 조직입니다.",
        aKr: "AVD(Advanced Vehicle Development) 담당은 차량개발초기 Architecture와 Package(차체 구조·공간 설계)를 기반으로 고객이 체감하는 차량의 기본기를 설계·기획하고, 혁신적인 아이디어와 프로젝트를 발굴·주도하여 GMTCK 전사의 Innovation Hub 역할을 수행하는 조직입니다.",
        aEn: "The AVD (Advanced Vehicle Development) department designs and plans the fundamental aspects of vehicles that customers experience, based on Architecture and Package (body structure and space design) in the early stages of vehicle development, and serves as GMTCK's Innovation Hub by discovering and leading innovative ideas and projects."
      },
      {
        q: "AVD 담당은 고객에게 왜 중요한가요?",
        qKr: "AVD 담당은 고객에게 왜 중요한가요?",
        qEn: "Why is the AVD department important to customers?",
        a: `고객이 실제로 경험하는 주행거리, 공간감, 승차감, 안전과 가격에 대한 신뢰 같은 '차량의 기본기와 상품성'은 모두 AVD가 설계하는 Architecture와 Package에서 출발합니다.

예를 들어,

- 한 번 충전(또는 주유)으로 얼마나 멀리, 얼마나 효율적으로 갈 수 있는지(Propulsion)
- 승객이 느껴지는 seating posture, headroom, legroom, 전체적인 spaciousness, driver visibility, 그리고 승하차 편의성까지 포함한 종합적인 실내 경험
- 코너링 · 직진 안정성 · 정숙성 등 Ride Comfort와 Driving Feel의 기본 Balance
- 겉으로 보이지 않는 Body Structure와 Crash Architecture가 만들어 내는 충돌 성능과 Safety에 대한 신뢰감
- 같은 가격대에서 얼마나 합리적인 사양과 구성을 제공하는지, 즉 Value for Money를 얼마나 잘 충족하는지

이 모든 것들이 AVD가 세우는 Fundamental 기준과 판단에 따라 달라집니다.

AVD는 차량개발초기 Vehicle Fundamentals를 설계하고, 성능·안전·공간·가격 사이의 밸런스를 조율해 고객 가치(Customer Value)와 브랜드 신뢰(Brand Trust)를 만들어 가는 팀입니다.`,
        aKr: `고객이 실제로 경험하는 주행거리, 공간감, 승차감, 안전과 가격에 대한 신뢰 같은 '차량의 기본기와 상품성'은 모두 AVD가 설계하는 Architecture와 Package에서 출발합니다.

예를 들어,

- 한 번 충전(또는 주유)으로 얼마나 멀리, 얼마나 효율적으로 갈 수 있는지(Propulsion)
- 승객이 느껴지는 seating posture, headroom, legroom, 전체적인 spaciousness, driver visibility, 그리고 승하차 편의성까지 포함한 종합적인 실내 경험
- 코너링 · 직진 안정성 · 정숙성 등 Ride Comfort와 Driving Feel의 기본 Balance
- 겉으로 보이지 않는 Body Structure와 Crash Architecture가 만들어 내는 충돌 성능과 Safety에 대한 신뢰감
- 같은 가격대에서 얼마나 합리적인 사양과 구성을 제공하는지, 즉 Value for Money를 얼마나 잘 충족하는지

이 모든 것들이 AVD가 세우는 Fundamental 기준과 판단에 따라 달라집니다.

AVD는 차량개발초기 Vehicle Fundamentals를 설계하고, 성능·안전·공간·가격 사이의 밸런스를 조율해 고객 가치(Customer Value)와 브랜드 신뢰(Brand Trust)를 만들어 가는 팀입니다.`,
        aEn: `Everything customers actually experience—driving range, sense of space, ride comfort, and trust in safety and price—starts from the Architecture and Package that AVD designs as the vehicle’s fundamentals and product appeal.

For example:

- How far and how efficiently you can travel on one charge (or refuel) (Propulsion)
- The overall interior experience passengers feel, including seating posture, headroom, legroom, overall spaciousness, driver visibility, and entry/exit convenience
- The basic balance of ride comfort and driving feel—cornering, straight-line stability, and quietness
- Crash performance and trust in safety from the body structure and crash architecture you do not see on the surface
- How well specifications and configurations are offered at a given price—Value for Money

All of these depend on the fundamental criteria and judgments AVD sets.

AVD designs vehicle fundamentals in the earliest development phase and balances performance, safety, space, and price to build customer value and brand trust.`
      },
      {
        q: "AVD 담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "AVD 담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn: "What competencies do you think are necessary for AVD department work?",
        a: `AVD 업무는 차량의 '큰 그림(Big Picture)'을 설계하고, Innovation Hub로서 여러 조직을 하나의 방향으로 연결해 고객에게 더 나은 차를 제공하는 역할을 합니다. 이를 위해 위해 AVD에서의 필요 역량은

- System-Level Thinking: Architecture, package 전반을 아우르는 시야와 제약 조건 하에서 최적의 균형점을 찾는 역량
- Cross-Functional Collaboration: Design, Powertrain, Electrical, Manufacturing, Safety, Interior 등과 효과적으로 소통·조율하는 긴밀한 협업 능력
- Customer & Market Insight): Global Benchmarking과 데이터 분석을 통해 고객 가치와 시장 요구를 읽어내는 능력
- Innovation Mindset & Learning Agility 전동화(Electrification), SDV(Software-Defined Vehicle)와 같은 새로운 기술·아키텍처를 빠르게 이해하고, 새로운 패키징 아이디어(New Packaging Ideas)를 스스로 탐색해 시험해 보는 도전적인 태도
- Innovation Leadership: 새로운 아이디어와 업무 방식을 발굴·실행해, 업무 방식을 더 Efficient & Effective 하게 만드는 추진력`,
        aKr: `AVD 업무는 차량의 '큰 그림(Big Picture)'을 설계하고, Innovation Hub로서 여러 조직을 하나의 방향으로 연결해 고객에게 더 나은 차를 제공하는 역할을 합니다. 이를 위해 위해 AVD에서의 필요 역량은

- System-Level Thinking: Architecture, package 전반을 아우르는 시야와 제약 조건 하에서 최적의 균형점을 찾는 역량
- Cross-Functional Collaboration: Design, Powertrain, Electrical, Manufacturing, Safety, Interior 등과 효과적으로 소통·조율하는 긴밀한 협업 능력
- Customer & Market Insight): Global Benchmarking과 데이터 분석을 통해 고객 가치와 시장 요구를 읽어내는 능력
- Innovation Mindset & Learning Agility 전동화(Electrification), SDV(Software-Defined Vehicle)와 같은 새로운 기술·아키텍처를 빠르게 이해하고, 새로운 패키징 아이디어(New Packaging Ideas)를 스스로 탐색해 시험해 보는 도전적인 태도
- Innovation Leadership: 새로운 아이디어와 업무 방식을 발굴·실행해, 업무 방식을 더 Efficient & Effective 하게 만드는 추진력`,
        aEn: `AVD work designs the vehicle’s big picture and, as an Innovation Hub, aligns multiple organizations toward delivering better vehicles to customers. The competencies we need in AVD are:

- System-Level Thinking: seeing the full Architecture and package and finding the best balance under constraints
- Cross-Functional Collaboration: communicating and coordinating closely with Design, Powertrain, Electrical, Manufacturing, Safety, Interior, and more
- Customer & Market Insight: reading customer value and market needs through global benchmarking and data analysis
- Innovation Mindset & Learning Agility: quickly grasping new technologies and architectures such as electrification and SDV, and proactively exploring and trying new packaging ideas
- Innovation Leadership: driving new ideas and ways of working to make how we work more efficient and effective`
      },
      {
        q: "AVD 담당의 매력은?",
        qKr: "AVD 담당의 매력은?",
        qEn: "What is the appeal of the AVD department?",
        a: `AVD 담당의 매력은 새로운 차량 개발과 전사 Innovation의 선두에서,

- 차량 개발의 가장 초기 단계에서 제품의 방향성과 고객 경험을 결정짓는 핵심 역할을 하면서,
- 다양한 조직과 협업해 폭넓은 지신과 시야를 확보 할 수 있으며,
- Architecture·Package를 통해 차량의 '뼈대'를 설계하는 독보적인 전문성을 쌓을 수 있습니다.`,
        aKr: `AVD 담당의 매력은 새로운 차량 개발과 전사 Innovation의 선두에서,

- 차량 개발의 가장 초기 단계에서 제품의 방향성과 고객 경험을 결정짓는 핵심 역할을 하면서,
- 다양한 조직과 협업해 폭넓은 지신과 시야를 확보 할 수 있으며,
- Architecture·Package를 통해 차량의 '뼈대'를 설계하는 독보적인 전문성을 쌓을 수 있습니다.`,
        aEn: `What makes AVD attractive is that at the leading edge of new vehicle development and company-wide innovation:

- You play a central role in setting product direction and customer experience at the earliest stage of development
- You collaborate across organizations to build broad knowledge and perspective
- You develop unique expertise in designing the vehicle “skeleton” through Architecture and Package`
      },
      {
        q: "앞으로 AVD 담당이 지향하는 목표는 무엇인가요?",
        qKr: "앞으로 AVD 담당이 지향하는 목표는 무엇인가요?",
        qEn: "What are the goals that the AVD department aims for in the future?",
        a: `AVD 담당의 지향 목표는,

- Customer-Value-Driven Architecture Leader: 주행거리·공간·승차감·안전·가격 경쟁력 등 고객이 체감하는 기본기를 미래 고객 요구를 반영한 차세대 Vehicle Structure를 설계하는 조직
- Insight & Benchmarking-Based Decision Hub: 지속적인 글로벌 벤치마킹과 신규 아이디어 발궁르 통한 프로그램별 고객 가치 극대화
- Enterprise Innovation & Front-Loading Hub: 품질·원가·개발 리드타임을 동시에 개선하고, 새로운 아이디어와 업무 방식을 확산하는 GMTCK의 Innovation Hub`,
        aKr: `AVD 담당의 지향 목표는,

- Customer-Value-Driven Architecture Leader: 주행거리·공간·승차감·안전·가격 경쟁력 등 고객이 체감하는 기본기를 미래 고객 요구를 반영한 차세대 Vehicle Structure를 설계하는 조직
- Insight & Benchmarking-Based Decision Hub: 지속적인 글로벌 벤치마킹과 신규 아이디어 발궁르 통한 프로그램별 고객 가치 극대화
- Enterprise Innovation & Front-Loading Hub: 품질·원가·개발 리드타임을 동시에 개선하고, 새로운 아이디어와 업무 방식을 확산하는 GMTCK의 Innovation Hub`,
        aEn: `AVD’s goals are:

- Customer-Value-Driven Architecture Leader: an organization that designs next-generation vehicle structure reflecting future customer needs for fundamentals customers feel—range, space, ride, safety, and price competitiveness
- Insight & Benchmarking-Based Decision Hub: sustained global benchmarking and new ideas to maximize customer value by program
- Enterprise Innovation & Front-Loading Hub: GMTCK’s Innovation Hub that improves quality, cost, and development lead time together and spreads new ideas and ways of working`
      }
    ]
  },
  "avd-studio-surface": {
    questions: [
      {
        q: "SSI 담당은 어떤 일을 하는 곳인가요?",
        qKr: "SSI 담당은 어떤 일을 하는 곳인가요?",
        qEn: "What does the SSI department do?",
        a: "SSI 담당은 자동차 외관 디자인과 실제 차체 구조가 완벽하게 조화를 이루도록 만드는 팀입니다. 디자이너가 만든 멋진 스케치가 현실적인 안전 · 구조 기준을 충족하고, 생산 공장에서 문제없이 조립될 수 있도록 디자인과 엔지니어링 사이를 이어주는 조율자 역할을 합니다.",
        aKr: "SSI 담당은 자동차 외관 디자인과 실제 차체 구조가 완벽하게 조화를 이루도록 만드는 팀입니다. 디자이너가 만든 멋진 스케치가 현실적인 안전 · 구조 기준을 충족하고, 생산 공장에서 문제없이 조립될 수 있도록 디자인과 엔지니어링 사이를 이어주는 조율자 역할을 합니다.",
        aEn: "The SSI department is a team that creates perfect harmony between automotive exterior design and actual body structure. It plays the role of a coordinator connecting design and engineering, ensuring that the beautiful sketches created by designers meet realistic safety and structural standards and can be assembled without problems in production factories."
      },
      {
        q: "SSI 담당은 고객에게 왜 중요한가요?",
        qKr: "SSI 담당은 고객에게 왜 중요한가요?",
        qEn: "Why is the SSI department important to customers?",
        a: "고객이 차를 보거나 만질 때 느끼는 첫인상과 품질은 대부분 SSI의 영역과 연결됩니다. 멀리서 봤을 때 아름다운 비율, 가까이서 봤을 때 정교한 단차와 표면 품질, 문을 열고 닫을 때의 느낌, 외관 부품의 조립 정밀도 이 모든 요소들이 고객이 느끼는 차량 품질과 직결되며, SSI는 기획 단계부터 출시까지 전체 여정에서 이러한 품질을 설계하고 관리하는 팀입니다.",
        aKr: "고객이 차를 보거나 만질 때 느끼는 첫인상과 품질은 대부분 SSI의 영역과 연결됩니다. 멀리서 봤을 때 아름다운 비율, 가까이서 봤을 때 정교한 단차와 표면 품질, 문을 열고 닫을 때의 느낌, 외관 부품의 조립 정밀도 이 모든 요소들이 고객이 느끼는 차량 품질과 직결되며, SSI는 기획 단계부터 출시까지 전체 여정에서 이러한 품질을 설계하고 관리하는 팀입니다.",
        aEn: "The first impression and quality that customers feel when seeing or touching a car are mostly connected to SSI's domain. Beautiful proportions when viewed from afar, precise gaps and surface quality when viewed up close, the feel when opening and closing doors, and the assembly precision of exterior components - all these elements are directly linked to the vehicle quality that customers perceive. SSI is a team that designs and manages this quality throughout the entire journey from planning to launch."
      },
      {
        q: "차량 개발 과정의 언제부터 SSI가 참여하나요?",
        qKr: "차량 개발 과정의 언제부터 SSI가 참여하나요?",
        qEn: "When does SSI participate in the vehicle development process?",
        a: "SSI는 최초 콘셉트 기획 단계부터 참여합니다. 차급(예: 소형 SUV·중형 세단) 방향 설정, 휠베이스 · 비율 · 실내 · 트렁크 공간 배분, 초기 패키징 방향 검토 이후 차량 개발 전 과정에 걸쳐 \"처음 기획한 모습이 실제로 구현 가능한가?\"를 지속적으로 확인합니다.",
        aKr: "SSI는 최초 콘셉트 기획 단계부터 참여합니다. 차급(예: 소형 SUV·중형 세단) 방향 설정, 휠베이스 · 비율 · 실내 · 트렁크 공간 배분, 초기 패키징 방향 검토 이후 차량 개발 전 과정에 걸쳐 \"처음 기획한 모습이 실제로 구현 가능한가?\"를 지속적으로 확인합니다.",
        aEn: "SSI participates from the initial concept planning stage. After setting vehicle segment direction (e.g., compact SUV, mid-size sedan), wheelbase, proportions, interior and trunk space allocation, and initial packaging direction review, SSI continuously verifies throughout the entire vehicle development process whether \"the initially planned design can actually be implemented.\""
      },
      {
        q: "SSI담당에서 일하시는 분들은 주로 어떤 전공 출신인가요?",
        qKr: "SSI담당에서 일하시는 분들은 주로 어떤 전공 출신인가요?",
        qEn: "What majors do people working in the SSI department typically come from?",
        a: "가장 많은 비율은 기계공학, 자동차공학, 항공우주공학 등 공학 계열 전공자들입니다. 여기에 산업공학, 전기·전자, 산업디자인 전공자들도 함께 어울려 일하고 있습니다. 전공이 꼭 자동차 전공일 필요는 없지만, \"물건이 어떻게 구조를 이루고, 어떻게 만들어지는지\"를 좋아하는 분들이 잘 맞는 편입니다. 무엇보다도, 다양한 전공 배경을 가진 사람들이 각자의 강점을 살려 협업하는 문화라, 배우고 섞이려는 태도를 더 중요하게 보고 있습니다.",
        aKr: "가장 많은 비율은 기계공학, 자동차공학, 항공우주공학 등 공학 계열 전공자들입니다. 여기에 산업공학, 전기·전자, 산업디자인 전공자들도 함께 어울려 일하고 있습니다. 전공이 꼭 자동차 전공일 필요는 없지만, \"물건이 어떻게 구조를 이루고, 어떻게 만들어지는지\"를 좋아하는 분들이 잘 맞는 편입니다. 무엇보다도, 다양한 전공 배경을 가진 사람들이 각자의 강점을 살려 협업하는 문화라, 배우고 섞이려는 태도를 더 중요하게 보고 있습니다.",
        aEn: "The largest proportion consists of engineering majors such as mechanical engineering, automotive engineering, and aerospace engineering. Industrial engineering, electrical and electronics, and industrial design majors also work together. While the major doesn't necessarily have to be automotive, people who like \"how things are structured and how they are made\" tend to fit well. Above all, since it's a culture where people with diverse academic backgrounds collaborate by leveraging each other's strengths, we value an attitude of learning and blending more."
      },
      {
        q: "AVD SVI 본부에서 일하고 싶은 사람은 어떤 준비를 하면 좋을까요?",
        qKr: "AVD SVI 본부에서 일하고 싶은 사람은 어떤 준비를 하면 좋을까요?",
        qEn: "What preparation would be good for someone who wants to work in the AVD SVI headquarters?",
        a: "먼저 학교에서는 기초 역학, 재료, 설계 과목을 통해 \"구조를 이해하고 문제를 푸는 연습\"을 충분히 해 두면 도움이 됩니다. 가능하다면 CAD(3D 모델링)나 간단한 시뮬레이션 도구를 다뤄보고, 팀 프로젝트등을 통해 함께 무언가를 만들어 본 경험이 있으면 좋을 것 같습니다. 자동차 회사라고 해서 단순히 자동차만 깊게 파는 사람을 찾는 것은 아닙니다. 오히려 고객의 관점에서 사고하고, 동료들과 솔직하게 소통하며, 실패를 두려워하지 않고 계속 시도해 보려는 태도를 큰 장점으로 봅니다. 마지막으로, 완벽한 사람이기보다는 배우면서 성장하고 싶어 하는 사람, 그리고 \"이 차를 타는 사람에게 어떤 경험을 줄까?\"를 자연스럽게 떠올리는 사람이라면 SSI와 잘 어울릴 것입니다.",
        aKr: "먼저 학교에서는 기초 역학, 재료, 설계 과목을 통해 \"구조를 이해하고 문제를 푸는 연습\"을 충분히 해 두면 도움이 됩니다. 가능하다면 CAD(3D 모델링)나 간단한 시뮬레이션 도구를 다뤄보고, 팀 프로젝트등을 통해 함께 무언가를 만들어 본 경험이 있으면 좋을 것 같습니다. 자동차 회사라고 해서 단순히 자동차만 깊게 파는 사람을 찾는 것은 아닙니다. 오히려 고객의 관점에서 사고하고, 동료들과 솔직하게 소통하며, 실패를 두려워하지 않고 계속 시도해 보려는 태도를 큰 장점으로 봅니다. 마지막으로, 완벽한 사람이기보다는 배우면서 성장하고 싶어 하는 사람, 그리고 \"이 차를 타는 사람에게 어떤 경험을 줄까?\"를 자연스럽게 떠올리는 사람이라면 SSI와 잘 어울릴 것입니다.",
        aEn: "First, it would be helpful to sufficiently practice \"understanding structures and solving problems\" through basic mechanics, materials, and design courses in school. If possible, it would be good to have experience working with CAD (3D modeling) or simple simulation tools, and experience creating something together through team projects. We don't simply look for people who only deeply study cars just because it's an automotive company. Rather, we see great value in an attitude of thinking from the customer's perspective, communicating honestly with colleagues, and continuing to try without fearing failure. Finally, someone who wants to grow while learning rather than being perfect, and who naturally thinks \"what experience can I give to the person driving this car?\" would fit well with SSI."
      },
      {
        q: "앞으로 SSI 담당이 지향하는 목표는 무엇인가요?",
        qKr: "앞으로 SSI 담당이 지향하는 목표는 무엇인가요?",
        qEn: "What are the goals that the SSI department aims for in the future?",
        a: "SSI의 목표는 고객이 '처음 차량을 보는 순간부터, 오랜 기간 사용하는 전 과정'에서 일관되고 신뢰할 수 있는 외관 품질을 제공하는 것입니다. 이를 위해 SSI는 글로벌 팀과 공동 개발, 가상 개발/빠른 검증 등 최신 프로세스 적용, 신소재·신기술의 빠른 도입, 디자인·설계·생산 부서와의 긴밀한 협업을 통해 더 빠르고, 더 정교하고, 더 완성도 높은 차량 외관 품질을 목표로 하고 있습니다.",
        aKr: "SSI의 목표는 고객이 '처음 차량을 보는 순간부터, 오랜 기간 사용하는 전 과정'에서 일관되고 신뢰할 수 있는 외관 품질을 제공하는 것입니다. 이를 위해 SSI는 글로벌 팀과 공동 개발, 가상 개발/빠른 검증 등 최신 프로세스 적용, 신소재·신기술의 빠른 도입, 디자인·설계·생산 부서와의 긴밀한 협업을 통해 더 빠르고, 더 정교하고, 더 완성도 높은 차량 외관 품질을 목표로 하고 있습니다.",
        aEn: "SSI's goal is to provide consistent and reliable exterior quality to customers 'from the moment they first see the vehicle through the entire process of long-term use.' To achieve this, SSI aims for faster, more precise, and higher-quality vehicle exterior quality through joint development with global teams, application of latest processes such as virtual development/rapid verification, quick adoption of new materials and technologies, and close collaboration with design, engineering, and production departments."
      }
    ]
  },
  "pipg-psc": {
    questions: [
      {
        q: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qKr: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qEn: "Please introduce your department and tell us about your current responsibilities in detail.",
        a: "저희 담당은 엔진/트랜스미션 캘리브레이션 경험을 바탕으로 전기차 캘리브레이션, 소프트웨어, 시뮬레이션까지 업무 영역을 확장하며, AI, 가상 기술을 활용해 차량 제어 전반과 안정적인 차량 출시를 지원하고 있습니다. 저는 전기차 업무를 담당하며, 실차와 가상 환경을 통해 전기차 시스템의 안전, 성능과 품질을 사전에 검증하고 양산 전 리스크를 최소화하고 있습니다.",
        aKr: "저희 담당은 엔진/트랜스미션 캘리브레이션 경험을 바탕으로 전기차 캘리브레이션, 소프트웨어, 시뮬레이션까지 업무 영역을 확장하며, AI, 가상 기술을 활용해 차량 제어 전반과 안정적인 차량 출시를 지원하고 있습니다. 저는 전기차 업무를 담당하며, 실차와 가상 환경을 통해 전기차 시스템의 안전, 성능과 품질을 사전에 검증하고 양산 전 리스크를 최소화하고 있습니다.",
        aEn: "Our department expands its work scope from engine/transmission calibration experience to EV calibration, software, and simulation, supporting overall vehicle control and stable vehicle launch using AI and virtual technologies. I am responsible for EV work, pre-verifying the safety, performance, and quality of EV systems through real vehicles and virtual environments, minimizing risks before mass production."
      },
      {
        q: "하루 업무에 대해 소개해주세요.",
        qKr: "하루 업무에 대해 소개해주세요.",
        qEn: "Please tell us about your daily work.",
        a: "보통 전날 밤이나 아침에 북미에서 전달된 업무 메일을 확인하며 하루를 시작합니다. 현재는 시뮬레이션 장비를 활용해 검증 업무를 수행하며, 전기차 시스템이 요구 조건에 맞게 안전하게 동작하는지 검증하고 있습니다.",
        aKr: "보통 전날 밤이나 아침에 북미에서 전달된 업무 메일을 확인하며 하루를 시작합니다. 현재는 시뮬레이션 장비를 활용해 검증 업무를 수행하며, 전기차 시스템이 요구 조건에 맞게 안전하게 동작하는지 검증하고 있습니다.",
        aEn: "I usually start my day by checking work emails from North America that came in the previous night or morning. Currently, I perform verification work using simulation equipment, verifying that EV systems operate safely according to requirements."
      },
      {
        q: "담당하고 있는 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "담당하고 있는 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn: "What competencies do you think are necessary for your work?",
        a: "전기차 검증 업무에는 전기차 시스템에 대한 이해와 함께, 실차와 시뮬레이션을 중심으로 한 가상 검증 환경을 유기적으로 활용하는 역량이 중요하다고 생각합니다. 실차 시험은 여전히 핵심이지만, 사전에 시뮬레이션과 같은 가상 환경에서 조건을 구성해 문제를 줄여가는 접근이 점점 필수적인 요소가 되고 있습니다. 이러한 가상 검증 결과를 바탕으로 추가 시험이 필요한지, 또는 어떤 리스크를 관리해야 하는지를 판단할 수 있는 의사결정 역량 또한 중요한 요소가 되고 있다고 느끼고 있습니다.",
        aKr: "전기차 검증 업무에는 전기차 시스템에 대한 이해와 함께, 실차와 시뮬레이션을 중심으로 한 가상 검증 환경을 유기적으로 활용하는 역량이 중요하다고 생각합니다. 실차 시험은 여전히 핵심이지만, 사전에 시뮬레이션과 같은 가상 환경에서 조건을 구성해 문제를 줄여가는 접근이 점점 필수적인 요소가 되고 있습니다. 이러한 가상 검증 결과를 바탕으로 추가 시험이 필요한지, 또는 어떤 리스크를 관리해야 하는지를 판단할 수 있는 의사결정 역량 또한 중요한 요소가 되고 있다고 느끼고 있습니다.",
        aEn: "I think understanding EV systems and the ability to organically utilize virtual verification environments centered on real vehicles and simulation is important for EV verification work. Real vehicle testing is still core, but the approach of configuring conditions in virtual environments like simulation beforehand to reduce problems is becoming increasingly essential. I also feel that decision-making capabilities to judge whether additional testing is needed or what risks need to be managed based on these virtual verification results are becoming important factors."
      },
      {
        q: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qKr: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qEn: "What is the team culture and what are your team members like?",
        a: "저희 팀은 서로에 대한 배려와 신뢰를 바탕으로 움직이는 팀이라고 생각합니다. 팀 특성상 실차 시험이 많아 차량 이슈를 자주 접하는데, 한 번 도움을 받으면 자연스럽게 서로 돕는 분위기가 형성되어 있고, 누가 시키지 않아도 다 같이 모여 문제를 해결합니다. 덕분에 저도 부담 없이 도움을 요청할 수 있는, 함께 일하기 편한 팀입니다.",
        aKr: "저희 팀은 서로에 대한 배려와 신뢰를 바탕으로 움직이는 팀이라고 생각합니다. 팀 특성상 실차 시험이 많아 차량 이슈를 자주 접하는데, 한 번 도움을 받으면 자연스럽게 서로 돕는 분위기가 형성되어 있고, 누가 시키지 않아도 다 같이 모여 문제를 해결합니다. 덕분에 저도 부담 없이 도움을 요청할 수 있는, 함께 일하기 편한 팀입니다.",
        aEn: "I think our team operates based on mutual consideration and trust. Due to the nature of our team, we frequently encounter vehicle issues as we conduct many real vehicle tests. Once someone receives help, a natural atmosphere of mutual assistance forms, and everyone gathers to solve problems without being asked. Thanks to this, I can request help without burden, making it a comfortable team to work with."
      },
      {
        q: "앞으로의 목표 또는 커리어 방향",
        qKr: "앞으로의 목표 또는 커리어 방향",
        qEn: "Future goals or career direction",
        a: "검증 결과에 책임을 지고, 고객 안전을 기준으로 판단할 수 있는 검증 엔지니어가 되는 것이 제 방향입니다. 단순히 통과 여부를 확인하는 데 그치지 않고, 검증 단계에서 문제를 사전에 설명하고 줄일 수 있는 역할을 목표로 하고 있습니다. 제 시험 결과가 곧 고객의 안전과 직결된다는 인식을 바탕으로, 책임감 있게 검증 업무를 수행하고 싶습니다.",
        aKr: "검증 결과에 책임을 지고, 고객 안전을 기준으로 판단할 수 있는 검증 엔지니어가 되는 것이 제 방향입니다. 단순히 통과 여부를 확인하는 데 그치지 않고, 검증 단계에서 문제를 사전에 설명하고 줄일 수 있는 역할을 목표로 하고 있습니다. 제 시험 결과가 곧 고객의 안전과 직결된다는 인식을 바탕으로, 책임감 있게 검증 업무를 수행하고 싶습니다.",
        aEn: "My direction is to become a verification engineer who takes responsibility for verification results and can make judgments based on customer safety. I aim not just to check pass/fail, but to play a role in explaining and reducing problems in advance during the verification stage. Based on the recognition that my test results are directly connected to customer safety, I want to perform verification work responsibly."
      }
    ]
  },
  "pipg-vpd-pid": {
    questions: [
      {
        q: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qKr: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qEn: "Please introduce your department and tell us about your current responsibilities in detail.",
        a: "저희 담당은 차량의 주행성이나 정숙성처럼, 고객이 실제로 체감하는 성능을 통합적으로 관리하는 역할을 하고 있습니다. 차량 동력성능 개발, 소음&진동, 가상 개발팀이 긴밀하게 협업하며 시험과 해석을 하나의 흐름으로 연결하고, 그 안에서 최적의 차량 성능을 만들어가고 있습니다. 저는 그 중에서도 소음&진동 성능 개발 엔지니어로서, 불쾌한 소음과 진동을 줄이는 역할 뿐만 아니라 차량의 모델이나 브랜드 이미지에 어울리는 엔진 사운드와 전기차 모터 사운드를 만들어가는 업무를 맡고 있습니다.",
        aKr: "저희 담당은 차량의 주행성이나 정숙성처럼, 고객이 실제로 체감하는 성능을 통합적으로 관리하는 역할을 하고 있습니다. 차량 동력성능 개발, 소음&진동, 가상 개발팀이 긴밀하게 협업하며 시험과 해석을 하나의 흐름으로 연결하고, 그 안에서 최적의 차량 성능을 만들어가고 있습니다. 저는 그 중에서도 소음&진동 성능 개발 엔지니어로서, 불쾌한 소음과 진동을 줄이는 역할 뿐만 아니라 차량의 모델이나 브랜드 이미지에 어울리는 엔진 사운드와 전기차 모터 사운드를 만들어가는 업무를 맡고 있습니다.",
        aEn: "Our department plays a role in comprehensively managing performance that customers actually feel, such as vehicle drivability and quietness. Vehicle powertrain performance development, noise & vibration, and virtual development teams closely collaborate to connect testing and analysis into one flow, creating optimal vehicle performance within it. Among these, I work as a noise & vibration performance development engineer, not only reducing unpleasant noise and vibration but also creating engine sounds and electric vehicle motor sounds that match the vehicle model or brand image."
      },
      {
        q: "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn: "What competencies do you think are necessary for your work?",
        a: "이 업무에 필요한 역량은 크게 세 가지라고 생각합니다. 첫 번째는 기본기입니다. 차체, 섀시, 추진 시스템 등 차량 전반에 대한 이해를 바탕으로 소음·진동 현상을 바라볼 수 있어야 합니다. 이런 기본기가 갖춰져 있어야 보다 안정적이면서도 현실적인 해결책을 제시할 수 있다고 생각합니다. 두 번째는 데이터를 읽고 해석하는 능력입니다. 차량 성능 개발은 해석이나 물리 시험, 다양한 가상 툴을 통해 생성되는 데이터를 기반으로 의사결정이 이루어지는 경우가 많기 때문에, 데이터 속에서 의미를 정확히 읽어내는 능력이 중요합니다. 마지막으로는 커뮤니케이션과 끈기입니다. 소음·진동 성능 개발은 설계, 시험, 품질, 생산 등 여러 부서가 유기적으로 연결돼 있어 협업이 필수적인 업무입니다. 또한 소음·진동 문제는 눈에 보이지 않고 한 번에 해결되지 않는 경우가 많아, 끝까지 원인을 파고들며 해결해 나가는 끈기 역시 중요한 역량이라고 생각합니다.",
        aKr: "이 업무에 필요한 역량은 크게 세 가지라고 생각합니다. 첫 번째는 기본기입니다. 차체, 섀시, 추진 시스템 등 차량 전반에 대한 이해를 바탕으로 소음·진동 현상을 바라볼 수 있어야 합니다. 이런 기본기가 갖춰져 있어야 보다 안정적이면서도 현실적인 해결책을 제시할 수 있다고 생각합니다. 두 번째는 데이터를 읽고 해석하는 능력입니다. 차량 성능 개발은 해석이나 물리 시험, 다양한 가상 툴을 통해 생성되는 데이터를 기반으로 의사결정이 이루어지는 경우가 많기 때문에, 데이터 속에서 의미를 정확히 읽어내는 능력이 중요합니다. 마지막으로는 커뮤니케이션과 끈기입니다. 소음·진동 성능 개발은 설계, 시험, 품질, 생산 등 여러 부서가 유기적으로 연결돼 있어 협업이 필수적인 업무입니다. 또한 소음·진동 문제는 눈에 보이지 않고 한 번에 해결되지 않는 경우가 많아, 끝까지 원인을 파고들며 해결해 나가는 끈기 역시 중요한 역량이라고 생각합니다.",
        aEn: "I think there are three main competencies needed for this work. First is fundamentals. You need to be able to view noise and vibration phenomena based on understanding of the entire vehicle, including body, chassis, and powertrain systems. With these fundamentals in place, you can present more stable and realistic solutions. Second is the ability to read and interpret data. Vehicle performance development often makes decisions based on data generated through analysis, physical testing, and various virtual tools, so the ability to accurately read meaning from data is important. Finally, communication and persistence. Noise and vibration performance development is work that requires collaboration as multiple departments such as design, testing, quality, and production are organically connected. Also, noise and vibration problems are often invisible and not solved at once, so persistence in digging into the root cause until resolution is also an important competency."
      },
      {
        q: "진행하셨던 프로젝트 중 인상깊었던 프로젝트가 있나요?",
        qKr: "진행하셨던 프로젝트 중 인상깊었던 프로젝트가 있나요?",
        qEn: "Was there a memorable project you worked on?",
        a: "트레일 블레이저와 트랙스 크로스오버 개발 당시, 소음진동 엔지니어로 참여했던 경험이 특히 기억에 많이 남습니다. 당시 국내외 소형 SUV 시장에서는 대부분 4기통 엔진을 사용하고 있었고, 3기통 엔진을 적용한 두 차종은 소음·진동 측면에서 태생적으로 불리한 조건을 안고 출발해야 했습니다. 그럼에도 불구하고 4기통 차량 수준의 소음·진동 성능 목표를 달성하기 위해 많은 시간과 자원, 그리고 노력이 필요했고, 관련 부서들과의 긴밀한 협업이 필수적이었습니다. 개발 초기부터 양산까지 한순간도 긴장을 늦출 수 없었던 프로젝트였습니다. 완성된 차량들이 양산 이후 국내외 시장에서 판매 성과는 물론, 품질과 상품성, 차량 가치 측면에서도 좋은 평가를 받는 모습을 보며 개인적으로 큰 보람과 자부심을 느꼈습니다. 엔지니어로서의 책임감과 성취감을 동시에 느낄 수 있었던 경험입니다.",
        aKr: "트레일 블레이저와 트랙스 크로스오버 개발 당시, 소음진동 엔지니어로 참여했던 경험이 특히 기억에 많이 남습니다. 당시 국내외 소형 SUV 시장에서는 대부분 4기통 엔진을 사용하고 있었고, 3기통 엔진을 적용한 두 차종은 소음·진동 측면에서 태생적으로 불리한 조건을 안고 출발해야 했습니다. 그럼에도 불구하고 4기통 차량 수준의 소음·진동 성능 목표를 달성하기 위해 많은 시간과 자원, 그리고 노력이 필요했고, 관련 부서들과의 긴밀한 협업이 필수적이었습니다. 개발 초기부터 양산까지 한순간도 긴장을 늦출 수 없었던 프로젝트였습니다. 완성된 차량들이 양산 이후 국내외 시장에서 판매 성과는 물론, 품질과 상품성, 차량 가치 측면에서도 좋은 평가를 받는 모습을 보며 개인적으로 큰 보람과 자부심을 느꼈습니다. 엔지니어로서의 책임감과 성취감을 동시에 느낄 수 있었던 경험입니다.",
        aEn: "The experience of participating as a noise and vibration engineer during the development of Trailblazer and Trax Cross-over particularly stands out in my memory. At that time, most small SUVs in domestic and international markets used 4-cylinder engines, and the two models with 3-cylinder engines had to start with inherently disadvantageous conditions in terms of noise and vibration. Nevertheless, achieving 4-cylinder vehicle-level noise and vibration performance goals required a lot of time, resources, and effort, and close collaboration with related departments was essential. It was a project where we couldn't let our guard down for a moment from early development to mass production. Seeing the completed vehicles receive good evaluations in domestic and international markets after mass production, not only in sales performance but also in quality, product appeal, and vehicle value, I felt great satisfaction and pride personally. It was an experience where I could feel both a sense of responsibility and achievement as an engineer."
      },
      {
        q: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qKr: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qEn: "What is the team culture and what are your team members like?",
        a: "저희 팀은 서로 필요한 부분은 잘 챙겨주면서도, 불필요한 간섭은 거의 없는 분위기입니다. 의견을 말하는 데 부담이 없어서 직급이나 연차에 상관없이 편하게 이야기할 수 있고, 각자의 방식을 존중해주는 팀이라고 생각합니다. 점심시간에는 함께 운동을 하기도 하고, 업무 중간중간 여유가 있을 때는 육아나 재테크, 여행처럼 다양한 주제로 수다도 많이 떠는 편입니다. 한마디로, 일할 때는 자연스럽게 몰입하고 평소에는 친구처럼 편안한 팀입니다.",
        aKr: "저희 팀은 서로 필요한 부분은 잘 챙겨주면서도, 불필요한 간섭은 거의 없는 분위기입니다. 의견을 말하는 데 부담이 없어서 직급이나 연차에 상관없이 편하게 이야기할 수 있고, 각자의 방식을 존중해주는 팀이라고 생각합니다. 점심시간에는 함께 운동을 하기도 하고, 업무 중간중간 여유가 있을 때는 육아나 재테크, 여행처럼 다양한 주제로 수다도 많이 떠는 편입니다. 한마디로, 일할 때는 자연스럽게 몰입하고 평소에는 친구처럼 편안한 팀입니다.",
        aEn: "Our team has an atmosphere where we take good care of each other's needs while rarely interfering unnecessarily. There's no burden in expressing opinions, so we can talk comfortably regardless of rank or years of experience, and I think it's a team that respects each person's way. During lunch, we sometimes exercise together, and when we have free time during work, we often chat about various topics like parenting, investment, or travel. In short, it's a team that naturally immerses itself in work and is comfortable like friends in everyday life."
      },
      {
        q: "내게 GMTCK란?",
        qKr: "내게 GMTCK란?",
        qEn: "What does GMTCK mean to you?",
        a: "제게 GMTCK는 첫 직장이자, 저를 꽤 그럴듯한 직장인으로 만들어준 곳입니다. 시행착오도 많았지만, 그 과정에서 일하는 법과 사람을 대하는 법을 자연스럽게 배웠습니다. MBTI로 치면 I 90% 성향의 저를, 이제는 사람들과 소통하고 의견을 나누는 데 훨씬 편한 사람으로 만들어준 곳이기도 합니다. 또 제가 좋아하는 다양한 차량을 직접 경험하고, 개발해 나가는 과정에서 새로운 도전에 재미를 느낄 수 있는, 제게는 아주 럭셔리한 놀이터 같은 공간이기도 합니다. 그래서 GMTCK는 제 삶에 큰 영향을 준, 고맙고 애정이 가는 회사입니다.",
        aKr: "제게 GMTCK는 첫 직장이자, 저를 꽤 그럴듯한 직장인으로 만들어준 곳입니다. 시행착오도 많았지만, 그 과정에서 일하는 법과 사람을 대하는 법을 자연스럽게 배웠습니다. MBTI로 치면 I 90% 성향의 저를, 이제는 사람들과 소통하고 의견을 나누는 데 훨씬 편한 사람으로 만들어준 곳이기도 합니다. 또 제가 좋아하는 다양한 차량을 직접 경험하고, 개발해 나가는 과정에서 새로운 도전에 재미를 느낄 수 있는, 제게는 아주 럭셔리한 놀이터 같은 공간이기도 합니다. 그래서 GMTCK는 제 삶에 큰 영향을 준, 고맙고 애정이 가는 회사입니다.",
        aEn: "To me, GMTCK is my first workplace and the place that made me into a fairly decent working professional. There were many trials and errors, but I naturally learned how to work and how to treat people through that process. It's also the place that made me, who would be I 90% in MBTI terms, much more comfortable communicating and sharing opinions with people. It's also a very luxurious playground-like space for me where I can directly experience and develop various vehicles I like, and feel excitement about new challenges in that process. So GMTCK is a company that has greatly influenced my life, one I'm grateful for and have affection for."
      }
    ]
  },
  "pipg-thermal": {
    questions: [
      {
        q: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qKr: "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
        qEn: "Please introduce your role and describe your current work in detail.",
        a: "저희 담당은 가상 및 실제 주행 환경에서 차량 열에너지 시스템과 공조 성능을 구현/최적화하고 예측/검증하고 개발하는 업무를 맡고 있어요.\n\n제가 맡고 있는 일은, 전기차 안에서 열이 효율적으로 관리될 수 있도록 조율하고 제어값을 맞추는 일이에요.\n\n예를 들어 아주 더운 여름날, 배터리는 과열되고 실내는 시원하게 해야 할 때, 냉방 에너지를 배터리에 더 써야 할지, 승객에게 더 써야 할지 우선순위를 정해서 Cooling Power를 어떻게 배분할지 조율하는 게 제 역할이에요.\n\n그리고 그렇게 정해진 냉방을 실제로 만들기 위해 콤프레서나 밸브 같은 부품들을 어떻게 작동시킬지도 같이 제어하고 있습니다.",
        aKr: "저희 담당은 가상 및 실제 주행 환경에서 차량 열에너지 시스템과 공조 성능을 구현/최적화하고 예측/검증하고 개발하는 업무를 맡고 있어요.\n\n제가 맡고 있는 일은, 전기차 안에서 열이 효율적으로 관리될 수 있도록 조율하고 제어값을 맞추는 일이에요.\n\n예를 들어 아주 더운 여름날, 배터리는 과열되고 실내는 시원하게 해야 할 때, 냉방 에너지를 배터리에 더 써야 할지, 승객에게 더 써야 할지 우선순위를 정해서 Cooling Power를 어떻게 배분할지 조율하는 게 제 역할이에요.\n\n그리고 그렇게 정해진 냉방을 실제로 만들기 위해 콤프레서나 밸브 같은 부품들을 어떻게 작동시킬지도 같이 제어하고 있습니다.",
        aEn: "Our team implements, optimizes, predicts, verifies, and develops vehicle thermal energy systems and HVAC performance in virtual and real driving environments.\n\nMy job is to coordinate and tune control values so heat is managed efficiently in the electric vehicle.\n\nFor example, on a very hot summer day when the battery must not overheat but the cabin must stay cool, I set priorities—whether to spend more cooling energy on the battery or on occupants—and coordinate how cooling power is split.\n\nI also control how components such as compressors and valves operate to deliver that cooling in practice.",
      },
      {
        q: "담당하고 있는 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qKr: "담당하고 있는 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
        qEn: "What competencies do you think are needed for your work?",
        a: "제가 생각하기에 이 직무에서는 열역학, 열전달, 유체역학 같은 기본 지식, 그리고 로직 해석 능력, 커뮤니케이션 능력 이 세 가지가 특히 중요한 것 같아요.\n\n차량의 HVAC이나 전기차 배터리 열관리는 열 흐름이나 냉매 특성 같은 물리적인 현상을 다루기 때문에, 기초 지식이 있어야 시스템 반응이나 이상 현상을 빠르게 이해할 수 있고요.\n\n또 단순 계산으로 끝나는 게 아니라, 실제 차량에 로직을 적용하고 결과를 분석해야 하기 때문에, \"왜 이런 반응이 나왔지?\", \"이 구간은 왜 튜닝이 필요하지?\" 같은 걸 논리적으로 해석할 수 있는 사고력이 중요해요.\n\n그리고 이 일이 혼자 하는 게 아니라 배터리, 모터, 전장, 소프트웨어팀 등과 협업해야 할 일이 많아서, 문제를 잘 설명하고 조율하는 커뮤니케이션 능력도 꼭 필요하다고 생각합니다.",
        aKr: "제가 생각하기에 이 직무에서는 열역학, 열전달, 유체역학 같은 기본 지식, 그리고 로직 해석 능력, 커뮤니케이션 능력 이 세 가지가 특히 중요한 것 같아요.\n\n차량의 HVAC이나 전기차 배터리 열관리는 열 흐름이나 냉매 특성 같은 물리적인 현상을 다루기 때문에, 기초 지식이 있어야 시스템 반응이나 이상 현상을 빠르게 이해할 수 있고요.\n\n또 단순 계산으로 끝나는 게 아니라, 실제 차량에 로직을 적용하고 결과를 분석해야 하기 때문에, \"왜 이런 반응이 나왔지?\", \"이 구간은 왜 튜닝이 필요하지?\" 같은 걸 논리적으로 해석할 수 있는 사고력이 중요해요.\n\n그리고 이 일이 혼자 하는 게 아니라 배터리, 모터, 전장, 소프트웨어팀 등과 협업해야 할 일이 많아서, 문제를 잘 설명하고 조율하는 커뮤니케이션 능력도 꼭 필요하다고 생각합니다.",
        aEn: "For this role, I think three things matter most: fundamentals such as thermodynamics, heat transfer, and fluid mechanics; the ability to interpret control logic; and communication.\n\nHVAC and EV battery thermal management deal with physical phenomena like heat flow and refrigerant behavior, so foundational knowledge helps you quickly understand system response and anomalies.\n\nBecause work doesn’t end with a simple calculation—you apply logic on real vehicles and analyze results—logical thinking to interpret “why did it respond this way?” or “why does this range need tuning?” is essential.\n\nAnd since you collaborate often with battery, motor, electronics, software, and other teams, you also need communication skills to explain issues clearly and align everyone.",
      },
      {
        q: "진행하셨던 프로젝트 중 인상깊었던 프로젝트가 있나요?",
        qKr: "진행하셨던 프로젝트 중 인상깊었던 프로젝트가 있나요?",
        qEn: "Was there a project you found especially memorable?",
        a: "작년 겨울에, 겨울철 주행거리가 너무 짧게 나와서 그걸 개선하는 프로젝트를 했었는데요. 문제 원인을 보니까 고전압 냉각수 히터가 너무 과하게 작동하면서 배터리를 많이 소모하는 게 주 원인이었어요.\n\n그래서 팀원들과 같이 설정 온도나 내외기 도어 제어 방식을 조정해서, 냉난방 성능은 유지하면서도 주행거리를 늘릴 수 있도록 캘리브레이션을 바꿨던 경험이 있어요.\n\n이런 식으로 제가 한 작업이 실제 차량에 적용되고, 고객이 체감할 수 있는 결과로 이어질 때, \"아, 내가 진짜 의미 있는 일을 하고 있구나\"라는 걸 느껴요.\n\n단순히 책상 앞에서 끝나는 일이 아니라, 실차 반영까지 연결된다는 점이 이 일의 큰 매력이라고 생각합니다.",
        aKr: "작년 겨울에, 겨울철 주행거리가 너무 짧게 나와서 그걸 개선하는 프로젝트를 했었는데요. 문제 원인을 보니까 고전압 냉각수 히터가 너무 과하게 작동하면서 배터리를 많이 소모하는 게 주 원인이었어요.\n\n그래서 팀원들과 같이 설정 온도나 내외기 도어 제어 방식을 조정해서, 냉난방 성능은 유지하면서도 주행거리를 늘릴 수 있도록 캘리브레이션을 바꿨던 경험이 있어요.\n\n이런 식으로 제가 한 작업이 실제 차량에 적용되고, 고객이 체감할 수 있는 결과로 이어질 때, \"아, 내가 진짜 의미 있는 일을 하고 있구나\"라는 걸 느껴요.\n\n단순히 책상 앞에서 끝나는 일이 아니라, 실차 반영까지 연결된다는 점이 이 일의 큰 매력이라고 생각합니다.",
        aEn: "Last winter we ran a project to improve driving range, which had become too short in cold weather. Root-cause analysis showed the high-voltage coolant heater was running excessively and draining the battery.\n\nTogether with the team, we adjusted set temperatures and fresh/recirc air-door control so we could extend range while keeping HVAC performance.\n\nWhen work like that ships on real cars and customers can feel the benefit, I really feel, “I’m doing something meaningful.”\n\nA big appeal of this job is that it doesn’t stop at a desk—it connects all the way to the vehicle on the road.",
      },
      {
        q: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qKr: "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
        qEn: "What is the team culture like, and what are your colleagues like?",
        a: "저희 팀은 자율성과 책임감을 바탕으로 일하는 분위기예요.\n\n일정이나 방식이 딱딱하게 정해진 건 아니고, 각자 자기 업무를 주도적으로 끌고 가는 스타일이 잘 맞는 팀이에요.\n\n무슨 문제가 생겨도 서로 도와주는 분위기라서, 처음 들어오셔도 부담 없이 배우실 수 있을 거예요.\n\n전체적으로 보면 편안하지만, 일은 프로답게 해나가는 그런 팀이라고 생각합니다.",
        aKr: "저희 팀은 자율성과 책임감을 바탕으로 일하는 분위기예요.\n\n일정이나 방식이 딱딱하게 정해진 건 아니고, 각자 자기 업무를 주도적으로 끌고 가는 스타일이 잘 맞는 팀이에요.\n\n무슨 문제가 생겨도 서로 도와주는 분위기라서, 처음 들어오셔도 부담 없이 배우실 수 있을 거예요.\n\n전체적으로 보면 편안하지만, 일은 프로답게 해나가는 그런 팀이라고 생각합니다.",
        aEn: "Our team works with autonomy and ownership.\n\nSchedules and methods aren’t rigid—people who like to drive their own work fit well here.\n\nWhen issues come up, people help each other, so newcomers can learn without too much pressure.\n\nOverall it’s a relaxed environment, but we still get the job done professionally.",
      },
      {
        q: "앞으로의 목표 또는 커리어 방향",
        qKr: "앞으로의 목표 또는 커리어 방향",
        qEn: "Future goals or career direction",
        a: "이 직무는 단순히 HVAC만 보는 게 아니라, 차량 전체의 열 흐름과 에너지 효율을 통합적으로 다루는 일이라 시야가 굉장히 넓어져요.\n\n그래서 경력이 쌓이면 배터리나 모터, 전장 쪽과 협업하면서 전체 Thermal 시스템을 리드하는 역할로 성장할 수 있고, 또는 제어 로직 개발이나 캘리브레이션 전략을 총괄하는 시니어 엔지니어로도 자연스럽게 이어질 수 있어요.\n\n나중에는 통합 열관리 플랫폼을 기획하거나, 글로벌 프로젝트를 리드하는 기회도 열려 있고요.\n\n최근에는 소프트웨어 기반 제어 로직의 중요성이 더욱 커지고 있는 만큼, 열에너지 분야는 하드웨어와 소프트웨어를 아우르는 핵심 영역으로 지속적인 성장 가능성이 있다고 생각합니다.",
        aKr: "이 직무는 단순히 HVAC만 보는 게 아니라, 차량 전체의 열 흐름과 에너지 효율을 통합적으로 다루는 일이라 시야가 굉장히 넓어져요.\n\n그래서 경력이 쌓이면 배터리나 모터, 전장 쪽과 협업하면서 전체 Thermal 시스템을 리드하는 역할로 성장할 수 있고, 또는 제어 로직 개발이나 캘리브레이션 전략을 총괄하는 시니어 엔지니어로도 자연스럽게 이어질 수 있어요.\n\n나중에는 통합 열관리 플랫폼을 기획하거나, 글로벌 프로젝트를 리드하는 기회도 열려 있고요.\n\n최근에는 소프트웨어 기반 제어 로직의 중요성이 더욱 커지고 있는 만큼, 열에너지 분야는 하드웨어와 소프트웨어를 아우르는 핵심 영역으로 지속적인 성장 가능성이 있다고 생각합니다.",
        aEn: "This role isn’t only HVAC—it covers vehicle-wide heat flow and energy efficiency, so your perspective broadens a lot.\n\nAs you gain experience, you can grow into leading the overall thermal system with battery, motor, and electronics partners, or into senior roles owning control-logic development and calibration strategy.\n\nLater there are also opportunities to shape integrated thermal-management platforms or lead global projects.\n\nWith software-based control logic becoming ever more important, thermal energy sits at the intersection of hardware and software—and I see strong long-term growth there.",
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


function mountStaticRoleInterviews() {
  document.querySelectorAll("[data-role-interview-mount]").forEach((bodyEl) => {
    const interviewId = bodyEl.getAttribute("data-role-interview-mount");
    const imageName = getImageNameForInterviewId(interviewId);
    if (!imageName || !interviewData[imageName]) {
      console.warn("[role-interviews] No profile image mapping for", interviewId);
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
    (k) => (interviewData[k].interviewId || "") === interviewId
  );
}

/** data-kr / data-en 등 HTML 속성값 — &, ", < 가 있으면 속성이 끊겨 인터뷰 본문이 잘림 */
function escapeHtmlAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
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
  const currentLang = localStorage.getItem("language") || "kr";
  const imageNameWithoutExt = imageName.replace(".png", "");
  const useTp = data.useTpThumbnail === true;
  const tpImageName = useTp ? imageNameWithoutExt + "_tp.png" : imageName;
  const profileFallback = data.profileFallback || null;
  let profileImagePath;
  if (data.profileImage) {
    profileImagePath = data.profileImage;
  } else if (profileFallback) {
    profileImagePath = profileFallback;
  } else {
    profileImagePath = `./images/profilepic/${tpImageName}`;
  }
  const imgOnError =
    data.profileImage || profileFallback || !useTp
      ? ""
      : ` onerror="this.onerror=null;this.src='./images/profilepic/${imageName}'"`;

  // VE 인터뷰인지 확인
  const isVeInterview = interviewId.startsWith("ve-");
  /** EE System & Product Investigation 다인 캐러셀 슬라이스(VE와 동일 마크업 클래스) */
  const isEeSpiCarouselItem = /^ee-system-investigation-\d+$/.test(
    interviewId,
  );

  // 인터뷰 내용 가져오기 (기존 인터뷰 내용이 있으면 사용, 없으면 빈 템플릿)
  // VE 인터뷰의 경우 roleId로도 찾아봄
  let content = interviewContent[interviewId] || { questions: [] };
  if (isVeInterview && content.questions.length === 0) {
    // VE 인터뷰 ID에서 roleId 추출
    // interviewId 형식: ve-{roleId}-{index} (예: ve-ve-safety-performance-1)
    // ve-ve-safety-performance-1 -> ve-safety-performance
    const parts = interviewId.split('-');
    if (parts.length >= 3) {
      // 마지막 부분(숫자) 제거
      const withoutIndex = parts.slice(0, -1);
      // ve-ve-safety-performance -> ve-safety-performance (첫 번째 ve- 제거)
      let roleId;
      if (withoutIndex[0] === 've' && withoutIndex[1] === 've') {
        // ve-ve-safety-performance -> ve-safety-performance
        roleId = 've-' + withoutIndex.slice(2).join('-');
      } else {
        // ve-safety-performance -> ve-safety-performance
        roleId = withoutIndex.join('-');
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
  const questionsHtml = content.questions && content.questions.length > 0 
    ? content.questions.map((q, index) => {
        const qKr = q.qKr || q.q || "";
        const qEn = q.qEn || q.q || "";
        const answerKr = q.aKr || q.a || "";
        const answerEn = q.aEn || q.a || "";
        const titleShown = currentLang === "kr" ? qKr : qEn;
        const answerShown = currentLang === "kr" ? answerKr : answerEn;
        return `
          <div class="interview-question">
            <h3 class="interview-q-title" data-kr="${escapeHtmlAttr(qKr)}" data-en="${escapeHtmlAttr(qEn)}">
              ${escapeHtmlText(titleShown)}
            </h3>
            ${answerShown ? `<p class="interview-answer" data-kr="${escapeHtmlAttr(answerKr)}" data-en="${escapeHtmlAttr(answerEn)}">${escapeHtmlText(answerShown)}</p>` : ''}
          </div>
        `;
      }).join("")
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

  const formulaBgUrl = getFormulaPicBackgroundUrl(`${interviewId}:${imageName}`);
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
            <img src="${profileImagePath}" alt="Profile" class="profile-img"${imgOnError} />
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
  if (!data) return PROFILE_PLACEHOLDER_IMAGE;
  if (data.profileImage) return data.profileImage;
  if (data.profileFallback) return data.profileFallback;
  const useTp = data.useTpThumbnail === true;
  const imageNameWithoutExt = imageName.replace(".png", "");
  const tpImageName = useTp ? imageNameWithoutExt + "_tp.png" : imageName;
  return `./images/profilepic/${tpImageName}`;
}
