# -*- coding: utf-8 -*-
"""Merge VIC/VES interview blocks into data/interview-content-ve.json"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VE_JSON = ROOT / "data" / "interview-content-ve.json"


def Q(qkr, qen, akr, aen):
    return {
        "q": qkr,
        "qKr": qkr,
        "qEn": qen,
        "a": akr,
        "aKr": akr,
        "aEn": aen,
    }


EXTRA = {
    "ve-ve-virtual-integration-1": {
        "questions": [
            Q(
                "Virtual Integration Center 담당 소개를 해주세요.",
                "Please introduce the Virtual Integration Center.",
                """Virtual Integration Center는 연구소 전반의 컴퓨터 시뮬레이션 기술과 리소스를 유기적으로 연결하며, AI/머신러닝, 프로세스 자동화, 가상 기반 개발 기술을 점진적으로 도입해 보다 효율적이고 유연한 개발 방식을 만들어갑니다. 이러한 새로운 방식들은 컴퓨터 시뮬레이션 마일스톤과 연계된 모든 프로세스에 적용되어 시뮬레이션 결과들이 프로그램 실행의 흐름에 잘 연결되도록 허브 역할을 수행하고, 이러한 흐름 속에서 시뮬레이션팀이 조직의 경계를 넘어 함께 협업할 수 있도록 가상 통합 그룹을 이끌고 있습니다. 더 나아가 자율주행을 향해 고도화되는 능동 안전 개발 과정 속에서, 가상과 실차 영역을 유기적으로 연결하며 가상 기반 자율주행 개발을 가속하고, 모두가 공감하며 함께 나아가는 ‘Road to Virtual’을 차근차근 실현해 나가고 있는 담당입니다.""",
                "VIC connects simulation resources across the lab, drives AI/ML and automation, acts as a hub so simulation milestones feed program execution, leads virtual integration across silos, and accelerates virtual AD development on the ‘Road to Virtual.’",
            ),
            Q(
                "현재 담당하고 계신 업무를 소개해주세요.",
                "Please describe your current work.",
                """VIC 조직에서 VPIM(Virtual Performance Integration Manager) 역할을 맡고 있습니다. Integration Manager로서 다양한 해석 조직의 관점을 하나의 통합된 시각으로 정리하여, 프로그램 매니지먼트 및 유관 부서들과 효과적으로 소통하는 것이 주요 업무입니다. 개발 초기 단계에서는 마켓 요구사항 검토와 아키텍처 대역폭 설정에 기여하며, 이후 양산 전 검증 단계에 이르기까지 해석 기반 결과가 차량 성능 목표와 일관되게 연계되고, 프로그램 매니지먼트의 의사결정으로 이어질 수 있도록 가교 역할을 수행합니다. 아울러 컴퓨터 시뮬레이션 과정에서 도출되는 이슈를 체계적으로 관리하고, 시뮬레이션 기반 전략 및 실행 계획을 수립하며, 하드웨어 최적화 및 비용 절감 워크샵에 적극 참여함으로써 실질적인 성과로 이어질 수 있도록 실행력을 강화하고 있습니다.""",
                "As VPIM, I align simulation perspectives for program management, bridge market and architecture early work through verification, manage simulation issues and execution plans, and engage in cost and hardware optimization workshops.",
            ),
            Q(
                "담당 역할·업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
                "What competencies does this integration role require?",
                """Integration을 효과적으로 수행하기 위해서는 각 컴퓨터 시뮬레이션 영역에 대한 기술적 이해를 바탕으로, 결과의 의미와 한계를 스스로 해석할 수 있는 엔지니어링 판단력이 중요합니다. 단일 해석 결과에 머무르기보다, 다양한 시뮬레이션과 개발 단계의 정보를 종합해 하나의 방향으로 연결하는 시각이 자연스럽게 요구되고, 서로 다른 관점과 우선순위를 가진 조직과 협업하며, 각자의 의견을 이해하고 조율해 나가는 과정에서 소통 역량이 중요한 역할을 합니다. 개발 초기부터 양산 단계까지 개발 흐름을 경험하며, 변경 사항이 성능과 일정에 미치는 영향을 함께 고려하는 균형 잡힌 판단이 이 역할의 깊이를 더하게 되고, 개인의 해답보다 프로그램 전체에 최적의 선택을 고민하며 그 결과를 끝까지 연결해 책임지는 태도는 Integration 역할을 완성해 나간다고 볼 수 있습니다.""",
                "Technical depth across simulation domains, synthesis across stages, stakeholder communication, balanced trade-offs on performance and schedule, and program-level ownership.",
            ),
            Q(
                "진행하셨던 프로젝트 중 인상 깊었던 프로젝트가 있나요?",
                "Was there a memorable project?",
                """소형 EV 차량 개발 프로젝트에서의 경험이 가장 인상 깊게 남아 있습니다. 계획된 변경 컨텐츠를 기반으로 개발 계획이 수립되고 실행을 앞두고 있던 시점에, 차량 성능의 뼈대가 되는 아키텍처 일부가 변경되면서 주어진 일정 내 목표 달성이 어려운 상황에 직면했습니다. 개발 기간을 단순히 연장하는 선택지는 회사의 포트폴리오와 개발 비용 측면에서 큰 부담으로 이어질 수 있었기에, 기존과는 다른 접근이 필요하다는 점에 모두가 공감하고 있던 상황이었습니다. 이에 따라 대규모 조직에서는 쉽지 않은, 상황에 맞게 판단하고 빠르게 조정하는 사고 방식을 바탕으로 스크럼 업무 방식을 도입하게 되었습니다. 그 과정에서 관련 팀들은 지금까지 축적해 온 경험과 지식을 최대한 활용하며 대응에 나섰고, 각자의 역할과 경계를 넘어 하나의 팀으로 서로의 업무를 지원했습니다. 이러한 변칙적인 스케줄과 유연한 협업 방식은 위기 상황에 효과적으로 대응한 사례로 이어졌으며, 결과적으로 제한된 조건 속에서도 품질 있는 제품을 고객에게 인도하는 의미 있는 성과로 남았습니다.""",
                "A small EV program where architecture change threatened the schedule; we adopted scrum-style execution, crossed boundaries, and still delivered quality under constraints.",
            ),
            Q(
                "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
                "What is your team culture like?",
                """제가 속해 있는 팀은 글로벌 회사라는 점을 가장 실감하게 되는 공간입니다. 글로벌 팀과 함께 회의를 하다 보면, 같은 이슈를 두고도 서로 다른 배경과 시각에서 접근하는 모습을 자연스럽게 접하게 되고, 그 과정 자체가 일의 일부가 됩니다. 업무는 직급보다는 역할과 책임을 중심으로 흘러가며, 필요한 의견이라면 누구든 거리낌 없이 이야기할 수 있는 분위기에서 각자가 맡은 일에는 몰입하지만, 동시에 서로의 상황을 살피고 필요할 때는 기꺼이 손을 보태는 문화가 자리 잡고 있습니다. 무엇보다 바쁜 일정 속에서도 일과 삶의 균형을 지키려는 공감대가 있고, 이런 배려 덕분에 팀 안에서는 혼자 버틴다는 느낌보다 함께 움직인다는 안정감을 더 많이 느끼게 됩니다. 그래서 저의 팀 문화와 동료들은 말로 설명하기보다, 함께 일해보며 자연스럽게 느끼게 되는 분위기입니다.""",
                "Global, role-based collaboration; open dialogue; mutual support; shared respect for work-life balance.",
            ),
            Q(
                "앞으로의 목표 또는 커리어 방향",
                "Future goals or career direction",
                """Integration 관점의 개입 범위를 점진적으로 넓혀, 해석 기반 가상 엔지니어링이 개발 전반에서 보다 선제적으로 활용될 수 있도록 가속화를 이끌고자 합니다. 이를 통해 컴퓨터 시뮬레이션 결과가 의사결정의 핵심 입력으로 작동하고, 미래 예측이 점점 어려워지는 환경 속에서도 의사결정권자가 더 빠르고 명확하며 균형 잡힌 판단을 내릴 수 있도록 기반을 다지는 것이 목표입니다. 이와 함께 차량 개발 전반의 의사결정 흐름을 보다 넓은 시야에서 바라보며, 성능 목표와 일정·비용 요소가 유기적으로 연결된 상태에서 예상하지 못한 변화에도 빠르고 효과적으로 대응할 수 있도록 스크럼 기반 협업 방식을 차량 개발 프로세스에 더욱 실질적으로 녹여냄으로서 장기적으로는 기술과 프로세스 그리고 조직을 더욱 단단하게 연결하고, 차량 개발의 주요 의사결정과 실행 과정에 보다 깊이 관여하며 실질적인 가치를 만들어 가도록 커리어를 만들고자 합니다.""",
                "Expand integration influence so virtual engineering is proactive in decisions; embed scrum-like collaboration more deeply; tie technology, process, and organization for faster, clearer decisions.",
            ),
            Q(
                "내게 GMTCK란?",
                "What does GMTCK mean to you?",
                """나에게 GM TCK는 하루의 고민과 선택들이 자연스럽게 쌓여 커리어가 되어가는 장소라고 생각됩니다. 이곳에서 방대한 컴퓨터 시뮬레이션 데이터베이스를 기반으로 한 개발을 경험해왔고, 매 순간의 배움과 함께 스스로의 판단 기준을 다져가며 성장해왔습니다. 특히 차량 안전에 대해서는 어떤 상황에서도 타협하지 않는 원칙이 있어, 일의 결과뿐만 아니라 업무의 과정, 책임, 기준의 중요함을 체감해왔고, 더 나아가 글로벌 기업으로서 다양한 문화와 배경을 가진 동료들과 함께 일하며, 서로 다른 관점을 이해하고 신뢰를 쌓아가는 경험은 일하는 나를 넘어 사람으로서의 시야와 태도를 함께 성장시키는 계기가 되었습니다. 그런 점에서 GM TCK는 저의 성장이 구체적인 형태로 쌓여 온 공간이지 않을까요.""",
                "GMTCK is where daily choices become a career—built on simulation at scale, non-negotiable safety values, and growth through global teamwork.",
            ),
        ]
    },
    "ve-ve-virtual-integration-2": {
        "questions": [
            Q(
                "팀 소개 및 현재 팀에서 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
                "Please introduce your team and your current work.",
                """저는 GMTCK Virtual Method & Optimization Team에서 AI/ML Engineer로 근무하고 있습니다. 저희 팀은 Simulation · Data Analysis · AI/ML 기술을 활용해 개발 과정을 빠르고 효율적으로 만드는 일을 하고 있습니다.

그 안에서 저는 엔지니어링 현장에서 실제로 쓰이는 “AI tool을 개발하는 엔지니어”라고 소개할 수 있을 것 같습니다. 다른 엔지니어분들이 어려움을 겪는 일을 AI/ML 혹은 Automation tool로 개발하여, 더 고부가가치 업무에 집중하실 수 있게 돕고 있습니다.""",
                "On Virtual Method & Optimization, I build AI/ML and automation tools engineers actually use to remove friction and focus on higher-value work.",
            ),
            Q(
                "팀 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
                "What competencies does this team need?",
                """먼저 가장 기본이 되는 것은 데이터와 알고리즘에 대한 이해입니다. 머신러닝/딥러닝의 원리를 이해하고, Python 기반으로 데이터를 다루고 모델을 설계·개선할 수 있는 능력이 필요합니다. 특히, 현실적인 제약(데이터 품질, 컴퓨팅 리소스, 일정 등) 안에서 어떻게 구현하고 최적화할지를 고민하는 시각이 매우 중요합니다.

동시에, 이 팀에서 특히 중요하다고 느끼는 역량은 문제 정의 능력과 커뮤니케이션 능력입니다. AI 모델을 만드는 것보다 더 어려운 일이 “어떤 문제를 AI로 풀어야 하는지, 또 풀 수 있는지”를 정의하는 일입니다. 이를 위해서는 현업 엔지니어, 다양한 부서와 소통하며, 그분들의 언어를 데이터와 알고리즘의 언어로 번역할 수 있어야 합니다.""",
                "Data and algorithms, pragmatic ML under constraints, problem framing, and translating domain language into data/ML solutions.",
            ),
            Q(
                "진행하셨던 프로젝트 중 인상 깊었던 프로젝트가 있나요?",
                "Was there a memorable project?",
                """가장 인상 깊었던 프로젝트는 차량 시험 영상에서 얼굴과 번호판을 자동으로 익명화하는 영상 비식별화(Pri-View) 프로젝트입니다. 차량 개발에 필요한 도로 주행 영상을 활용하면서도 개인정보 보호와 보안 규정을 지키기 위해, 저희 데이터와 환경에 맞는 커스텀 모델과 파이프라인을 직접 설계했습니다. 그 결과 상용 솔루션 의존도를 없애 라이선스 비용을 0원으로 줄였고, 국내 도로 환경에 최적화된 학습을 통해 기존 대비 탐지 정확도도 향상시킬 수 있었습니다.""",
                "Pri-View: anonymizing faces and plates in road-test video with a custom pipeline—eliminated license fees and improved accuracy for Korean road scenes.",
            ),
            Q(
                "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
                "What is your team culture like?",
                """저희 팀의 가장 큰 장점은 전문성과 친근함이 동시에 있는 팀이라는 점입니다. 각자 설계, 해석, 소프트웨어 개발 등 서로 다른 백그라운드를 가지고 있지만, 문제를 마주했을 때는 직급과 연차에 상관없이 아이디어를 자유롭게 토론하는 문화를 가지고 있습니다. 다양한 관점에서 문제를 바라볼 수 있기에 집단지성이 잘 발휘되는 분위기입니다.

또 하나 좋다고 느끼는 점은 서로의 일을 ’우리 일’로 받아들이는 태도입니다. 많은 업무량에 허덕이고 있으면 모두 발벗고 나서서 도와주려고 하고, 작은 성과라도 나면 팀 전체가 진심으로 함께 기뻐해 줍니다. AI/ML이라는 새로운 분야에서 항상 배우고 도전해야 하는 만큼, 이런 동료들이 있다는 것이 큰 힘이 됩니다.""",
                "Deep expertise with a friendly tone; open ideation; shared ownership; celebrate wins together.",
            ),
            Q(
                "내게 GMTCK란?",
                "What does GMTCK mean to you?",
                """저에게 GMTCK는 “끊임없는 성장의 무대”입니다. 입사 초에는 Powertrain DRE업무를 하면서 Hardware개발에 대한 업무를 하다가, 지금 팀에서 AI/ML 영역으로 확장해 오면서, 회사와 함께 저 스스로의 역할도 계속 진화해 왔습니다. 그 과정에서 성장에 대한 기회를 주고, 실패하더라도 다시 시도할 수 있게 지지해 준 곳이 바로 GMTCK였습니다.

또한 GMTCK는 “혼자서는 절대 만들 수 없는 결과를, 함께 만들어가는 곳”이기도 합니다. AI/ML이라는 기술만으로는 아무것도 할 수 없고, 차량 구조를 이해하는 엔지니어, 현장을 잘 아시는 생산·품질 담당자 분들, 그리고 다양한 지원 조직이 함께할 때 비로소 고객에게 의미 있는 가치를 전달할 수 있습니다. 그 협업의 한 가운데에서, 데이터와 AI/ML로 연결고리를 만드는 역할을 맡고 있다는 점이 저에게는 큰 자부심입니다.""",
                "GMTCK is a stage for growth—from Powertrain DRE to AI/ML—and a place where collaboration turns technology into customer value.",
            ),
        ]
    },
    "ve-ve-virtual-integration-3": {
        "questions": [
            Q(
                "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
                "Please introduce your role and responsibilities.",
                """제가 소속된 ADAS 조직은 Super Cruise를 포함한 주행 보조·자동주행 기능 전반을 대상으로, 기능 정의부터 시스템 아키텍처, 캘리브레이션, 필드 이슈 대응까지 차량의 실제 주행 거동을 End‑to‑End로 책임지는 핵심 엔지니어링 조직입니다. 또한 HIL/SIL 및 시뮬레이션 기반의 Virtual 검증 체계 전환을 주도하며, 실차 의존도를 낮추고 개발 효율과 품질을 동시에 향상시키는 역할을 수행하고 있습니다. 저는 ADAS 개발 관련 프로그램 전반을 리드하며, SW 적용 일정과 캘리브레이션 통합을 포함한 ADAS 개발 계획을 수립·운영하고 있습니다. 아울러 이슈 조율과 부서 간 협업을 통해 개발 리드타임을 단축하고, 각 프로그램에서 ADAS 개발이 효율적이고 일관되게 진행되도록 총괄 관리하고 있습니다.""",
                "ADAS leads end-to-end driving assistance and automated driving—including Super Cruise—from definition through architecture, calibration, and field issues, and drives virtual validation (HIL/SIL). I lead programs across ADAS plans, software deployment, calibration integration, and cross-functional coordination.",
            ),
            Q(
                "하루 업무에 대해 소개해주세요.",
                "Please describe your daily work.",
                """하루 업무는 프로그램 단위 개발 계획 점검, 데이터 기반 ADAS 이슈 리뷰, 캘리브레이션·프로그램 팀과의 협업으로 구성됩니다. 프로그램의 SW 적용 일정, 캘리브레이션 통합 계획, 검증 게이트 로드맵을 점검하고, 주요 리스크와 우선순위를 정리해 공유합니다. 이후 로그 분석 리뷰를 통해 SW 변경과 캘리브레이션 조정 중 최적의 기술적 해결 방향을 도출하고 실제 계획으로 연결합니다. 마지막으로 주요 ADAS 이슈와 리스크를 정리·공유하고 우선순위와 책임을 명확히 하여, 각 프로그램의 ADAS 개발이 효율적이고 안정적으로 진행되도록 리딩 합니다.""",
                "Daily work spans program plan reviews, data-driven ADAS issue reviews, and collaboration with calibration and program teams—aligning schedules, integration plans, validation gates, log triage, and clear ownership.",
            ),
            Q(
                "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
                "What competencies are essential?",
                """ADAS 개발에는 아키텍처를 전체적으로 이해하고, 이슈 발생 시 영향 범위를 구조적으로 파악할 수 있는 시스템적 사고가 필요합니다. 이에 더해 로그와 데이터 기반의 분석 역량, 캘리브레이션을 통해 실제 주행 거동을 설계하는 감각, 그리고 실도로 주행 경험을 통해 축적된 도메인 이해가 함께 요구됩니다. 또한 ADAS는 여러 조직과 긴밀히 협업해야 하는 영역인 만큼, 서로 다른 관점을 조율하고 합의를 이끌어내는 커뮤니케이션 역량이 중요합니다. 여기에 SW·캘리브레이션·검증을 아우르는 End‑to‑End 계획 및 실행력, 그리고 정의된 과제를 끝까지 책임지고 완결시키는 오너십이 핵심 역량이라고 생각합니다.""",
                "Systems thinking, log/data analysis, calibration intuition, on-road domain knowledge, strong communication, end-to-end execution, and ownership.",
            ),
            Q(
                "진행하셨던 프로젝트 중 인상 깊었던 프로젝트가 있나요?",
                "Was there a memorable project?",
                """제가 가장 인상 깊게 기억하는 프로젝트는 MY27 Bolt ADAS 개발입니다. 해당 프로그램은 짧은 개발 일정과 ADAS 센서·하드웨어의 낮은 성숙도로 인해 개발 지연이나 양산 일정에 영향을 줄 수 있는 높은 리스크를 안고 시작되었습니다. 이러한 제약 속에서 저는 관련 조직 간 긴밀한 협업을 이끌고, 담당 영역에서는 캘리브레이션과 검증 계획을 우선순위 중심으로 재정렬하여 핵심 기능과 주요 리스크를 중심으로 개발 흐름을 안정화했습니다. 그 결과, 캘리브레이션·검증팀의 높은 실행력과 빠른 피드백을 바탕으로 여러 제약에도 불구하고 개발 지연 없이 계획된 일정 내에 프로젝트를 성공적으로 마무리할 수 있었으며, 선제적 리스크 관리와 협업의 중요성을 다시 한번 확인한 경험이었습니다.""",
                "MY27 Bolt ADAS: aggressive schedule and immature sensors/hardware; re-prioritized calibration and validation, stabilized flow, and delivered on time through collaboration.",
            ),
            Q(
                "앞으로의 목표 또는 커리어 방향",
                "Future goals or career direction",
                """앞으로는 Virtual 기반 ADAS 개발을 표준화하고 조직 전반으로 확산시키는 것을 목표로 하고 있습니다. HIL/SIL 및 시뮬레이션 중심의 개발 체계로 전환하여 실차 의존도를 낮추고, 개발 리드타임 단축을 주도하고자 합니다. 또한 Cross‑functional 리더십을 확장해, SW·캘리브레이션·검증을 넘어 시스템, HMI, DMS, 맵/클라우드까지 아우르는 ADAS End‑to‑End Technical Leader로 성장하는 것이 목표입니다. 이를 통해 개별 기능이 아닌 고객이 체감하는 전체 주행 경험을 기준으로 의사결정을 이끄는 리더가 되고자 합니다.""",
                "Standardize virtual ADAS development, reduce vehicle reliance, shorten lead time, and grow into an end-to-end ADAS technical leader across SW, calibration, validation, systems, HMI, DMS, and map/cloud.",
            ),
        ]
    },
}

if __name__ == "__main__":
    base = json.loads(VE_JSON.read_text(encoding="utf-8"))
    base.update(EXTRA)
    VE_JSON.write_text(json.dumps(base, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Merged keys:", list(EXTRA.keys()), "total keys:", len(base))
