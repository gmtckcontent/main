/**
 * One-off generator: node scripts/build-interview-content-ee.mjs
 * Writes data/interview-content-ee.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "data", "interview-content-ee.json");

const eeSystemInvestigation = {
  questions: [
    {
      q: "System & Product Investigation 담당 소개해주세요.",
      qKr: "System & Product Investigation 담당 소개해주세요.",
      qEn: "Please introduce the System & Product Investigation department.",
      a: "System & Product Investigation 담당은 차량 시스템 통합 관점의 사전 품질 확보부터, 시장에서 발생하는 품질 이슈 분석, 그리고 대외 커뮤니케이션이 필요한 기술 검토 및 개선 활동 지원까지 수행하며, 고객의 안전을 최우선으로 하는 원칙 아래 제품 품질 전반을 책임지는 담당입니다.",
      aKr: "System & Product Investigation 담당은 차량 시스템 통합 관점의 사전 품질 확보부터, 시장에서 발생하는 품질 이슈 분석, 그리고 대외 커뮤니케이션이 필요한 기술 검토 및 개선 활동 지원까지 수행하며, 고객의 안전을 최우선으로 하는 원칙 아래 제품 품질 전반을 책임지는 담당입니다.",
      aEn: "The System & Product Investigation department is responsible for overall product quality under the principle of customer safety first—from securing upfront quality from a vehicle systems integration perspective, to analyzing quality issues in the market, to supporting technical reviews and improvement activities that require external communication.",
    },
    {
      q: "현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
      qKr: "현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
      qEn: "Please describe your current responsibilities in detail.",
      a: "저의 업무는 대외 기관으로부터 접수되는 각종 문의와 확인 요청에 대해 공식 창구로서 체계적으로 대응하고 관리하는 역할을 수행합니다. 엔지니어링, 품질, 법규, 법무 등 다양한 유관 조직과 협업하여 사실관계와 기술적 내용을 명확하게 정리하고, SUFS(Speak Up For Safety)를 통한 내부 검토 과정과 그 결과를 일관된 방식으로 설명합니다. 또한 필드 조치(Field Action)와 서비스 개선 활동이 원활하게 진행될 수 있도록 실행을 지원하고 관련 업무를 조율하는 것이 핵심 업무입니다.",
      aKr: "저의 업무는 대외 기관으로부터 접수되는 각종 문의와 확인 요청에 대해 공식 창구로서 체계적으로 대응하고 관리하는 역할을 수행합니다. 엔지니어링, 품질, 법규, 법무 등 다양한 유관 조직과 협업하여 사실관계와 기술적 내용을 명확하게 정리하고, SUFS(Speak Up For Safety)를 통한 내부 검토 과정과 그 결과를 일관된 방식으로 설명합니다. 또한 필드 조치(Field Action)와 서비스 개선 활동이 원활하게 진행될 수 있도록 실행을 지원하고 관련 업무를 조율하는 것이 핵심 업무입니다.",
      aEn: "My role is to respond to and manage inquiries and verification requests from external organizations systematically as the official channel. I collaborate with engineering, quality, regulatory, legal, and other stakeholders to clarify facts and technical content, and explain internal review through SUFS (Speak Up For Safety) and its outcomes in a consistent way. Supporting execution and coordinating related work so that field actions and service improvement activities run smoothly is at the core of the job.",
    },
    {
      q: "팀 소개를 부탁드립니다.",
      qKr: "팀 소개를 부탁드립니다.",
      qEn: "Please introduce your team.",
      a: "External Investigation & FA Execution Team은 대외 기관과의 공식 커뮤니케이션 창구 역할을 수행하며, 필요한 기술 검토와 안내를 통해 안정적인 문제 해결을 지원합니다. 또한 고객 안전과 만족을 최우선으로 삼아, 내부에서 결정된 품질 개선 조치가 시장에서 원활하게 실행될 수 있도록 프로젝트 전반을 조율하는 오케스트레이션 역할도 수행합니다.",
      aKr: "External Investigation & FA Execution Team은 대외 기관과의 공식 커뮤니케이션 창구 역할을 수행하며, 필요한 기술 검토와 안내를 통해 안정적인 문제 해결을 지원합니다. 또한 고객 안전과 만족을 최우선으로 삼아, 내부에서 결정된 품질 개선 조치가 시장에서 원활하게 실행될 수 있도록 프로젝트 전반을 조율하는 오케스트레이션 역할도 수행합니다.",
      aEn: "The External Investigation & FA Execution Team serves as the official communication channel with external bodies and supports stable problem resolution through technical review and guidance as needed. We also orchestrate projects so that quality improvement actions decided internally are executed smoothly in the market, with customer safety and satisfaction as the top priority.",
    },
    {
      q: "하루 업무에 대해 소개해 주세요.",
      qKr: "하루 업무에 대해 소개해 주세요.",
      qEn: "Please walk us through a typical workday.",
      a: "대외 보고를 위한 문서를 준비하고, 유관 부서와 협업해 기술적 사실관계를 정리합니다. 작성된 문서는 내부 검토를 통해 표현과 책임 범위를 정확하게 조율하며, 주요 이슈는 리더십에 적시에 공유해 조직의 대응 방향을 맞춰 나갑니다.",
      aKr: "대외 보고를 위한 문서를 준비하고, 유관 부서와 협업해 기술적 사실관계를 정리합니다. 작성된 문서는 내부 검토를 통해 표현과 책임 범위를 정확하게 조율하며, 주요 이슈는 리더십에 적시에 공유해 조직의 대응 방향을 맞춰 나갑니다.",
      aEn: "I prepare documents for external reporting and work with related departments to organize technical facts. Drafts are refined through internal review so wording and scope of responsibility are accurate, and major issues are shared with leadership in a timely manner so the organization stays aligned on how to respond.",
    },
    {
      q: "해당 직무를 희망하는 지원자들에게 꿀팁이 있다면요?",
      qKr: "해당 직무를 희망하는 지원자들에게 꿀팁이 있다면요?",
      qEn: "Any tips for candidates who want this role?",
      a: "제도와 프로세스가 빠르게 변화하는 영역이기 때문에, 새로운 절차를 신속하게 이해하고 다양한 조직과 협업해본 경험이 큰 도움이 됩니다. 또한 주어진 이슈를 구조화해 판단하고, 합리적인 대응 방향을 설정하는 사고력은 업무에서 매우 중요한 역량입니다.",
      aKr: "제도와 프로세스가 빠르게 변화하는 영역이기 때문에, 새로운 절차를 신속하게 이해하고 다양한 조직과 협업해본 경험이 큰 도움이 됩니다. 또한 주어진 이슈를 구조화해 판단하고, 합리적인 대응 방향을 설정하는 사고력은 업무에서 매우 중요한 역량입니다.",
      aEn: "Policies and processes change quickly in this space, so experience learning new procedures fast and collaborating across organizations helps a lot. Structured thinking to assess issues and set reasonable response directions is also a critical competency.",
    },
    {
      q: "업무 수행에 필요한 역량은 무엇이라고 생각하시나요?",
      qKr: "업무 수행에 필요한 역량은 무엇이라고 생각하시나요?",
      qEn: "What competencies do you think are essential for this work?",
      a: "프로세스와 시스템에 대한 이해, 여러 이해관계자와 원활하게 소통할 수 있는 커뮤니케이션 능력, 그리고 맡은 일을 끝까지 책임지고 완수하려는 자세가 중요합니다.",
      aKr: "프로세스와 시스템에 대한 이해, 여러 이해관계자와 원활하게 소통할 수 있는 커뮤니케이션 능력, 그리고 맡은 일을 끝까지 책임지고 완수하려는 자세가 중요합니다.",
      aEn: "Understanding processes and systems, communication skills to work smoothly with many stakeholders, and a mindset to own tasks through completion matter most.",
    },
    {
      q: "인상 깊었던 프로젝트가 있다면 소개해 주세요.",
      qKr: "인상 깊었던 프로젝트가 있다면 소개해 주세요.",
      qEn: "Please share a project that left a strong impression on you.",
      a: "신차 출시를 앞두고 예상치 못한 이슈가 발견되었을 때, 관련 사항을 신속하게 공유하고 필요한 절차를 투명하게 진행한 경험이 기억에 남습니다. 긴밀한 협업과 효율적인 실행을 통해 고객 신뢰를 유지하면서도 계획된 일정에 맞춰 차량을 시장에 선보일 수 있었던 의미 있는 사례였습니다.",
      aKr: "신차 출시를 앞두고 예상치 못한 이슈가 발견되었을 때, 관련 사항을 신속하게 공유하고 필요한 절차를 투명하게 진행한 경험이 기억에 남습니다. 긴밀한 협업과 효율적인 실행을 통해 고객 신뢰를 유지하면서도 계획된 일정에 맞춰 차량을 시장에 선보일 수 있었던 의미 있는 사례였습니다.",
      aEn: "When an unexpected issue surfaced before a new vehicle launch, I remember how we shared information quickly and ran the required steps transparently. Through close collaboration and efficient execution we maintained customer trust and still brought the vehicle to market on schedule—a meaningful case for me.",
    },
    {
      q: "앞으로의 목표와 커리어 방향은 무엇인가요?",
      qKr: "앞으로의 목표와 커리어 방향은 무엇인가요?",
      qEn: "What are your future goals and career direction?",
      a: "대외 기관과의 공식 커뮤니케이션 창구 역할을 수행하며, 주요 이슈에 대해 선제적인 리스크 관리와 전략적 대응 방향을 제안할 수 있는 전문가로 성장하고 싶습니다.",
      aKr: "대외 기관과의 공식 커뮤니케이션 창구 역할을 수행하며, 주요 이슈에 대해 선제적인 리스크 관리와 전략적 대응 방향을 제안할 수 있는 전문가로 성장하고 싶습니다.",
      aEn: "I want to grow as an expert in the official external communication role—able to propose proactive risk management and strategic responses on major issues.",
    },
    {
      q: "팀 문화나 함께 일하는 동료들은 어떤가요?",
      qKr: "팀 문화나 함께 일하는 동료들은 어떤가요?",
      qEn: "What is the team culture and what are your colleagues like?",
      a: "우리 팀은 서로를 존중하고 포용하는 ‘One Team’ 문화를 기반으로 일합니다. 각자의 역할은 다르지만 중요한 이슈 앞에서는 경험을 나누고 함께 해답을 찾는 협력적인 분위기가 강합니다. 믿고 함께 일할 수 있는 동료들이 있다는 점이 이 팀의 가장 큰 장점이라고 생각합니다.",
      aKr: "우리 팀은 서로를 존중하고 포용하는 ‘One Team’ 문화를 기반으로 일합니다. 각자의 역할은 다르지만 중요한 이슈 앞에서는 경험을 나누고 함께 해답을 찾는 협력적인 분위기가 강합니다. 믿고 함께 일할 수 있는 동료들이 있다는 점이 이 팀의 가장 큰 장점이라고 생각합니다.",
      aEn: "Our team works in a respectful, inclusive ‘One Team’ culture. Roles differ, but on important issues we share experience and find answers together—a strong collaborative atmosphere. I think the biggest strength is colleagues you can trust and work with reliably.",
    },
    {
      q: "내게 GMTCK란?",
      qKr: "내게 GMTCK란?",
      qEn: "What does GMTCK mean to you?",
      a: "하루하루의 경험과 선택이 쌓여 개인의 성장과 회사의 미래를 함께 만들어가는 현재진행형 무대입니다.",
      aKr: "하루하루의 경험과 선택이 쌓여 개인의 성장과 회사의 미래를 함께 만들어가는 현재진행형 무대입니다.",
      aEn: "A work in progress where daily experience and choices add up to grow both people and the company’s future together.",
    },
  ],
};

const eeVerification = {
  questions: [
    {
      q: "팀 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
      qKr: "팀 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
      qEn: "Please introduce your team and describe your current responsibilities in detail.",
      a: `저희 팀은 크게 Electric System Bench(ESB) Lab과 Infotainment System Bench(ISB) Lab으로 구성되어 있습니다. ESB Lab은 Bench Test를 기반으로 주요 전장 시스템의 통합 검증을 수행하며, 모든 전장 ECU와 주변 부품에 대한 소프트웨어 검증을 담당하고 있습니다.

ISB Lab은 ISP, VCU, Telematics 관련 시스템의 성능 평가 및 소프트웨어 검증을 수행하며, 이 외에도 Sound Tuning, Antenna Reception, Navigation 평가 업무를 함께 진행하고 있습니다. 그중 제가 담당하고 있는 업무는 Antenna Reception 분야로, 안테나의 실차 성능 개발과 평가를 시작으로 수신 성능(Reception) 튜닝 및 종합 평가까지 전 과정을 담당하고 있습니다.`,
      aKr: `저희 팀은 크게 Electric System Bench(ESB) Lab과 Infotainment System Bench(ISB) Lab으로 구성되어 있습니다. ESB Lab은 Bench Test를 기반으로 주요 전장 시스템의 통합 검증을 수행하며, 모든 전장 ECU와 주변 부품에 대한 소프트웨어 검증을 담당하고 있습니다.

ISB Lab은 ISP, VCU, Telematics 관련 시스템의 성능 평가 및 소프트웨어 검증을 수행하며, 이 외에도 Sound Tuning, Antenna Reception, Navigation 평가 업무를 함께 진행하고 있습니다. 그중 제가 담당하고 있는 업무는 Antenna Reception 분야로, 안테나의 실차 성능 개발과 평가를 시작으로 수신 성능(Reception) 튜닝 및 종합 평가까지 전 과정을 담당하고 있습니다.`,
      aEn: `Our team consists mainly of the Electric System Bench (ESB) Lab and the Infotainment System Bench (ISB) Lab. The ESB Lab performs integrated verification of major electrical systems based on bench testing and is responsible for software verification for all electrical ECUs and related parts.

The ISB Lab evaluates performance and verifies software for ISP, VCU, and Telematics-related systems, and also handles Sound Tuning, Antenna Reception, and Navigation evaluation. My focus is Antenna Reception—from vehicle-level antenna performance development and evaluation through reception tuning and overall assessment.`,
    },
    {
      q: "담당 업무를 수행하기 위해 필요한 역량은 무엇이라고 생각하시나요?",
      qKr: "담당 업무를 수행하기 위해 필요한 역량은 무엇이라고 생각하시나요?",
      qEn: "What competencies do you think are necessary for your work?",
      a: `Infotainment System Bench 및 Antenna Reception SVE 업무를 수행하기 위해서는 다양한 역량이 요구됩니다. 우선 전기,전자공학에 대한 기초 지식과 함께 자동차 시스템 및 통신에 대한 전반적인 이해가 필요합니다.

그러나 무엇보다 중요한 역량은 소비자 관점에서 문제를 바라보고 질문할 수 있는 적극성, 그리고 발견한 문제를 다양한 관점에서 끝까지 해결하려는 책임감이라고 생각합니다.`,
      aKr: `Infotainment System Bench 및 Antenna Reception SVE 업무를 수행하기 위해서는 다양한 역량이 요구됩니다. 우선 전기,전자공학에 대한 기초 지식과 함께 자동차 시스템 및 통신에 대한 전반적인 이해가 필요합니다.

그러나 무엇보다 중요한 역량은 소비자 관점에서 문제를 바라보고 질문할 수 있는 적극성, 그리고 발견한 문제를 다양한 관점에서 끝까지 해결하려는 책임감이라고 생각합니다.`,
      aEn: `Working on the Infotainment System Bench and Antenna Reception SVE requires a range of skills. You need fundamentals in electrical and electronic engineering and a broad understanding of automotive systems and communications.

Above all, I think the most important traits are the initiative to look at issues from the customer’s perspective and ask questions, and the ownership to drive problems to resolution from multiple angles.`,
    },
    {
      q: "진행하셨던 프로젝트 중 가장 인상 깊었던 프로젝트가 있다면 소개해 주세요.",
      qKr: "진행하셨던 프로젝트 중 가장 인상 깊었던 프로젝트가 있다면 소개해 주세요.",
      qEn: "Please introduce the most memorable project you have worked on.",
      a: `유럽 및 중동의 실차 테스트 환경(라디오 수신 환경)을 시뮬레이션으로 구축했던 프로젝트가 가장 인상 깊습니다. 이 프로젝트를 위해 MPG의 다수 엔지니어들과 협업하여, 유럽 현지에서 전파 및 전계 데이터를 Recording해 Source를 확보하고, 이를 법규 및 스펙에 맞게 송출할 수 있는 환경을 구축했습니다.

또한 개발 중인 차량을 활용해 시스템의 완성도를 평가해야 했기 때문에, 송출 방식, 시험 환경, 장비 세팅 등에 대해 많은 논의와 검증이 필요했습니다. 약 1년에 걸친 회의와 실험 끝에 시뮬레이션 환경을 성공적으로 구축했으며, 현재는 이 시험 환경이 유럽 현지 실차 시험을 효과적으로 대체하고 있습니다.`,
      aKr: `유럽 및 중동의 실차 테스트 환경(라디오 수신 환경)을 시뮬레이션으로 구축했던 프로젝트가 가장 인상 깊습니다. 이 프로젝트를 위해 MPG의 다수 엔지니어들과 협업하여, 유럽 현지에서 전파 및 전계 데이터를 Recording해 Source를 확보하고, 이를 법규 및 스펙에 맞게 송출할 수 있는 환경을 구축했습니다.

또한 개발 중인 차량을 활용해 시스템의 완성도를 평가해야 했기 때문에, 송출 방식, 시험 환경, 장비 세팅 등에 대해 많은 논의와 검증이 필요했습니다. 약 1년에 걸친 회의와 실험 끝에 시뮬레이션 환경을 성공적으로 구축했으며, 현재는 이 시험 환경이 유럽 현지 실차 시험을 효과적으로 대체하고 있습니다.`,
      aEn: `The project that simulated European and Middle East on-road radio reception environments stands out. We worked with many MPG engineers to record wave and field data in Europe, build sources, and create an environment that could transmit per regulations and specs.

Because we had to assess system maturity using vehicles under development, we needed extensive discussion and validation of transmission methods, test setups, and equipment. After roughly a year of meetings and testing we stood up the simulation successfully, and it now effectively replaces certain European field tests.`,
    },
    {
      q: "팀 문화나 함께 일하시는 동료들은 어떤가요?",
      qKr: "팀 문화나 함께 일하시는 동료들은 어떤가요?",
      qEn: "What is the team culture and what are your colleagues like?",
      a: `저희 팀은 각 분야의 전문성을 갖춘 구성원들이 모여 있는 조직입니다. 일반적으로는 서로 다른 전문성과 경험, 개성으로 인해 소통이 어려울 수 있지만, 저희 팀은 그렇지 않습니다.

수평적인 조직 문화 속에서 누구나 자유롭게 의견을 제시할 수 있으며, 다양한 관점이 존중받는 분위기 속에서 협업이 이루어지고 있습니다.

추가로 팀 내에 캠핑 모임, 테니스 모임, 게임 모임 등 동료들과 함께 즐기는 문화는 우리 팀의 자랑입니다.`,
      aKr: `저희 팀은 각 분야의 전문성을 갖춘 구성원들이 모여 있는 조직입니다. 일반적으로는 서로 다른 전문성과 경험, 개성으로 인해 소통이 어려울 수 있지만, 저희 팀은 그렇지 않습니다.

수평적인 조직 문화 속에서 누구나 자유롭게 의견을 제시할 수 있으며, 다양한 관점이 존중받는 분위기 속에서 협업이 이루어지고 있습니다.

추가로 팀 내에 캠핑 모임, 테니스 모임, 게임 모임 등 동료들과 함께 즐기는 문화는 우리 팀의 자랑입니다.`,
      aEn: `Our team brings together people with deep expertise in different areas. That mix can make communication hard elsewhere, but not here.

In a flat culture, anyone can speak up, and diverse viewpoints are respected as we collaborate.

We’re also proud of our informal groups—camping, tennis, gaming—and the fun we share outside work.`,
    },
    {
      q: "앞으로의 목표 또는 커리어 방향에 대해 말씀해 주세요.",
      qKr: "앞으로의 목표 또는 커리어 방향에 대해 말씀해 주세요.",
      qEn: "Please share your future goals or career direction.",
      a: `GM에는 Specialist 혹은 기술부장이라는 기술 중심의 커리어 트랙이 존재합니다. 저의 개인적인 목표는 현재 담당하고 있는 업무에 대한 오랜 경험과 깊이 있는 전문성을 바탕으로, 해당 분야에서 인정받는 Specialist로 성장하는 것입니다.`,
      aKr: `GM에는 Specialist 혹은 기술부장이라는 기술 중심의 커리어 트랙이 존재합니다. 저의 개인적인 목표는 현재 담당하고 있는 업무에 대한 오랜 경험과 깊이 있는 전문성을 바탕으로, 해당 분야에서 인정받는 Specialist로 성장하는 것입니다.`,
      aEn: `GM offers technical career paths such as Specialist or technical lead roles. My goal is to build on long experience and deep expertise in my current work and grow into a recognized Specialist in this field.`,
    },
  ],
};

/** ee-system-investigation-1(윤애진),-2(권민들),ee-certification 등은 data/interview-content-ee.json에서 직접 유지할 수 있음 */
const payload = {
  "ee-system-investigation-2": eeSystemInvestigation,
  "ee-verification-1": eeVerification,
};

fs.writeFileSync(out, JSON.stringify(payload, null, 2), "utf8");
console.log("Wrote", out);
