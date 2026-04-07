#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""One-off builder for data/interview-content-ve.json — run from repo root: python3 scripts/build-ve-interview-json.py"""
import json
from pathlib import Path

def Q(qkr, qen, akr, aen):
    return {
        "q": qkr,
        "qKr": qkr,
        "qEn": qen,
        "a": akr,
        "aKr": akr,
        "aEn": aen,
    }

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "interview-content-ve.json"

DATA = {
    "ve-ve-safety-performance-1": {
        "questions": [
            Q(
                "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
                "Please introduce your role and describe your current work in detail.",
                """저는 GMTCK Virtual Safety 2팀에서 Crash CAE, 즉 차량 충돌 해석을 담당하고 있습니다. 쉽게 말하면, 실제로 차를 벽에 부딪히기 전에 컴퓨터 속에서 수십 번, 수백 번 미리 부딪혀 보면서 차량의 안전 성능을 확인하고 개선 방향을 제시하는 역할입니다. 정면, 측면, 후면, SOF(Small overlap frontal) 등 다양한 충돌 조건에 대해 LS-DYNA와 전·후처리 툴을 사용해 유한요소 모델을 구축하고, 법규와 NCAP 기준을 만족하는지 가상으로 평가합니다. 그 과정에서 차체 변형, 에너지 흐름과 같은 결과를 분석해 약한 구조를 찾아내고, 설계 부서와 협업해 구조 변경안이나 보강안을 제안합니다. 이후 실차 충돌 시험 결과가 나오면 해석과 비교해 모델을 보정하고, 이때 얻은 노하우를 다음 프로젝트에서도 활용할 수 있도록 표준과 가이드로 정리하는 것까지가 제 업무의 큰 흐름입니다.""",
                "I work on Crash CAE (vehicle crash simulation) on Virtual Safety Team 2: building FE models in LS-DYNA for frontal, side, rear, SOF and other load cases, assessing regulatory and NCAP targets, proposing structural changes with design, correlating with physical tests, and turning lessons learned into standards.",
            ),
            Q(
                "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
                "What competencies do you think are necessary for your work?",
                """이 일을 잘 수행하기 위해서는 몇 가지 중요한 역량이 필요합니다. 우선 구조역학, 재료역학, 동역학 등 기계·자동차 공학의 기초 이론과 유한요소법에 대한 이해가 있어야 해석 결과를 단순한 숫자가 아닌 물리적 현상과 연결할 수 있습니다. 여기에 LS-DYNA, HyperMesh, ANSA 와 같은 해석 툴을 스스로 찾아 익혀 가는 능력도 중요합니다. 더불어 수많은 그래프와 영상, 상해 지표 속에서 핵심 원인과 주요 영향을 주는 인자를 골라낼 수 있는 데이터 분석력과 문제 해결 능력이 필요합니다. 설계와 시험, 타 CAE 팀과의 협업이 필수이기 때문에 상대의 눈높이에 맞춰 결과를 설명하고 의견을 조율하는 커뮤니케이션 능력도 중요하며, 글로벌 조직과의 협업을 위한 기본적인 영어 소통 능력이 있으면 많은 도움이 됩니다. 마지막으로, 한 번에 정답이 나오지 않는 해석 특성상 오너십과 책임감, 그리고 문제를 끝까지 파고드는 끈기와 새로운 기법을 계속 배우려는 학습 의지가 이 일을 오래, 잘 해 나가는 데 큰 밑바탕이 됩니다.""",
                "Fundamentals in structural mechanics, FEA, and tools like LS-DYNA; data analysis and problem-solving; communication across design, test, and CAE; English for global work; ownership, persistence, and continuous learning.",
            ),
            Q(
                "진행하셨던 프로젝트 중 인상 깊었던 프로젝트가 있나요?",
                "Was there a project you found especially memorable?",
                """제가 진행했던 프로젝트 중 가장 인상 깊었던 사례는 신규 소형 SUV의 정면 스몰오버랩 조건에서 운전석 하체 상해가 기준을 초과했던 과제입니다. 초기 해석과 시험에서 하퇴부 하중이 규정치를 크게 넘는 결과가 나와 원인을 찾는 것이 첫 번째 과제였습니다. 페달과 풋레스트, 인스트루먼트 패널 하부 구조를 중심으로 변형 모드와 하중 경로, 에너지 분포를 시간대별로 분석해 보니, 하부 멤버 일부가 너무 일찍 국부 좌굴을 일으키며 하중이 운전석 쪽으로 집중되는 현상이 근본 원인이었습니다. 이를 해결하기 위해 하부 멤버의 단면을 바꾸고, 보강 패치 위치와 형상을 조정하며, 하중 전달 경로 자체를 바꾸는 여러 설계안을 설계팀과 함께 검토했습니다. 각각에 대해 반복적으로 해석을 수행해 상해값뿐 아니라 중량과 비용, 다른 충돌 조건에 미치는 영향까지 고려한 끝에 최종안을 도출했고, 이후 실차 시험에서 해석과 거의 유사한 변형 패턴과 상해 경향이 재현되는 것을 확인할 수 있었습니다. 이 경험을 통해 숫자만 보는 것이 아니라 실제 차가 어떻게 찌그러지고 힘이 어떻게 흐르는지를 머릿속에 그리며 해석하는 물리적 이해의 중요성과, 정답 하나를 찾기보다 현실적인 최적안을 찾아가는 과정이 엔지니어의 역할이라는 점, 그리고 복잡한 문제일수록 설계·시험·해석이 함께 머리를 맞대야 빠르게 해법에 도달할 수 있다는 협업의 가치를 크게 느꼈습니다.""",
                "A small SUV small-overlap case where driver lower-leg injury exceeded limits: root-caused load path through pedals, footrest, and IP, iterated design with engineering, matched test correlation—highlighting physical intuition and cross-functional teamwork.",
            ),
            Q(
                "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
                "What is the team culture like, and what are your colleagues like?",
                """우리 팀의 문화와 동료들에 대해 말씀드리면, 난이도 높은 Crash CAE 업무를 혼자서 버티는 구조가 아니라 서로 도우면서 함께 성장하는 분위기라고 소개하고 싶습니다. 처음에는 LS-DYNA 카드 하나, 결과 화면 하나도 낯설 수 있다는 것을 모두 알고 있기 때문에, 선배들이 자신이 만든 모델과 리포트를 공유하며 왜 이런 조건을 썼는지, 어떤 그래프를 어떻게 봐야 하는지를 실제 예시로 설명해 줍니다. “이건 왜 이렇게 했나요?”, “이 조건 말고 이런 접근은 어떨까요?”와 같은 질문을 편하게 할 수 있고, 신입의 의견이라도 타당하면 실제 업무에 반영되는 경우도 많습니다. 또한 프로젝트 일정은 엄격하지만 불필요한 반복 작업을 줄이고 자동화와 표준화를 통해 효율적으로 일하려는 문화가 자리 잡아 있어, 일과 삶의 균형을 유지하려는 분위기입니다. 정기적인 세미나와 스터디를 통해 새로운 법규와 NCAP 동향, 해석 기법, 소재 트렌드를 공유하며 개인이 아니라 팀 전체의 전문성을 함께 끌어올리려는 점도 큰 특징입니다.""",
                "Collaborative, mentoring-heavy culture; open questions; automation and standards; seminars on regulations and methods; focus on work-life balance and lifting the whole team’s expertise.",
            ),
            Q(
                "내게 GMTCK란?",
                "What does GMTCK mean to you?",
                """제게 GMTCK는 몇 가지 의미를 동시에 갖는 곳입니다. 먼저, 학교처럼 저를 성장시키는 실전형 배움의 장입니다. 대학에서 책으로만 접하던 이론을 실제 차량 개발 프로젝트에 적용해 보고, 한 차종이 기획에서 양산까지 이어지는 전 과정을 가까이에서 경험하며 이론과 현실의 차이를 몸으로 배울 수 있는 곳입니다. 동시에, 다양한 직무의 동료들이 함께 성과를 만들어 가는 팀이기도 합니다. 설계, 해석, 시험, 생산, 품질 등 여러 조직이 하나의 목표를 향해 움직이는 과정에서 나 혼자 잘한다고 끝나는 일이 아니라, 서로 도우며 어려운 문제를 풀어가는 팀워크의 힘을 매일 체감합니다. 무엇보다도, 우리가 수행하는 해석 하나, 설계 변경 하나가 실제 도로 위 고객의 안전과 연결된다는 점에서 GMTCK는 기술을 통해 사람들의 삶을 조금 더 안전하고 편리하게 만드는 책임 있는 회사라고 생각합니다. 그래서 저는 이곳에서 하는 모든 해석과 제안이 단순히 숫자를 맞추는 작업이 아니라, 누군가의 일상을 지키는 일이라고 믿고 업무에 임하고 있습니다.""",
                "GMTCK is a place of hands-on learning from concept to production, cross-functional teamwork, and responsibility—where analysis ties directly to customer safety on the road.",
            ),
        ]
    },
    "ve-ve-safety-performance-2": {
        "questions": [
            Q(
                "현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
                "Please describe your current responsibilities in detail.",
                """저는 컴퓨터 시뮬레이션(CAE)을 통해 차량의 충돌·안전 성능을 사전에 검증함으로써, 실제 차량이 만들어지기 전에 탑승자의 상해를 최소화하도록 설계를 개발·개선하는 Safety CAE 엔지니어입니다.

에어백이 언제, 어떤 조건에서, 어떤 방식으로 전개되는지, 안전벨트가 충돌 순간 탑승자의 몸을 어떻게 제어하고 잡아주는지, IP와 시트 구조가 충돌 시 탑승자를 얼마나 효과적으로 보호하는지 등을 해석 프로그램으로 정밀하게 분석합니다.

또한 단일 조건에서의 성능 검증에 그치지 않고, 탑승 자세, 시트·스티어링 위치, 충돌 속도와 각도, 부품 제조 편차 등 다양한 변수들을 체계적으로 변화시키는 variation study(Robustness/민감도 분석)를 수행합니다. 이를 통해 실제 양산·운용 환경에서 발생할 수 있는 변동을 고려한 안전 성능의 안정성을 확인하고, 설계 변동 허용 범위와 주요 영향 인자를 정의하며, 튜닝 우선순위를 제시합니다.

이러한 수십·수백 건의 가상 충돌 시뮬레이션과 variation study 결과를 바탕으로, 법규 및 NCAP 등 각종 안전 등급 요구사항 충족 여부를 검토하고, 필요한 구조 변경과 튜닝 방향을 제안하여 설계에 반영되도록 합니다.

즉, 실제 고객이 차량을 타기 전에 다양한 ‘가상의 사고’와 조건 변동을 미리 재현·평가하여, 현실에서의 편차까지 고려된 더 안전한 차를 만들어 가는 역할을 수행하고 있습니다.""",
                "Safety CAE engineer using simulation to validate crash and occupant protection before hardware exists—including airbag, belt, IP, and seat behavior, plus robustness studies—and feeding regulatory/NCAP compliance and tuning direction to design.",
            ),
            Q(
                "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
                "What competencies do you think are necessary for your work?",
                """자동차 공학·기계공학 기반의 기초 역학 이해와, 이를 바탕으로 유한요소 해석(FEM)·충돌/승객보호 시뮬레이션을 배우고자 하는 강한 의지가 필요합니다. LS-DYNA와 같은 해석 툴, 전/후처리 도구를 빠르게 익히고 표준 절차와 가이드라인을 성실히 따라갈 수 있는 학습 능력과 꼼꼼함이 중요합니다. 해석 결과를 분석하여 “이 설계가 왜 안전한지/위험한지”를 다른 엔지니어와 이해하기 쉽게 소통하는 커뮤니케이션 능력도 필수입니다. 마지막으로, 수치 하나·곡선 하나에도 “이게 고객 안전에 어떤 의미인지”를 고민하는 강한 제품 안전 마인드와 책임감이 가장 중요한 기본 자질입니다.""",
                "Mechanics fundamentals, FEM and occupant-protection simulation, tool proficiency and discipline, clear communication of results, and a strong product-safety mindset.",
            ),
            Q(
                "진행하셨던 프로젝트 중 인상 깊었던 프로젝트가 있나요?",
                "Was there a project you found especially memorable?",
                """쉐보레 볼트 EV가 가장 인상 깊었습니다. 소형 전기차의 작은 패키지 안에서 에어백·벨트·IP·시트 구조를 조합해 FMVSS / NCAP 요구조건을 만족시키는 것이 쉽지 않았습니다. 다양한 충돌 조건을 동시에 만족시키기 위해 수십 번씩 시뮬레이션을 돌리고, 각 케이스에서 부상 지표를 낮추기 위해 설계 방향을 제안했던 경험이 기억에 남습니다.

무엇보다도 제가 지금 직접 볼트 EV를 타고 출퇴근을 하고 있어서, 이 프로젝트는 단순히 “회사 차를 개발한다”는 느낌이 아니라 “내가 매일 타는 차, 내 가족이 탈 수도 있는 차의 안전을 내가 책임진다”는 감각을 주었습니다. 그래서 해석 결과 하나, 그래프 하나를 볼 때도 항상 “이 상황이 실제 도로에서 나에게 일어난다면 안전할까?”를 떠올리며 더 보수적으로 판단하게 되었고, 그 과정이 Safety CAE 엔지니어로서 제 역할과 책임을 다시 한 번 자각하게 해 준 프로젝트였습니다.""",
                "Chevrolet Bolt EV: challenging packaging for FMVSS/NCAP; many simulation loops. Driving the same vehicle daily made the safety mission personal and reinforced conservative judgment.",
            ),
            Q(
                "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
                "What is the team culture like, and what are your colleagues like?",
                """저희 팀은 전기차를 포함한 신차의 승객 보호·충돌 안전을 담당하는 팀으로, 이를 Occupant, Vehicle Structure, PCEI 세 가지 축에서 통합적으로 다루고 있습니다.

Occupant 측면에서는 컴퓨터 시뮬레이션(CAE)을 통해 더미 거동, 탑승자 부상지수 등을 예측하고, 이를 바탕으로 시트·에어백·벨트 시스템의 설계 방향을 제안합니다. 동시에 실차·슬레드 시험 결과를 함께 보면서 해석 모델을 지속적으로 보정하고, 탑승자 보호 성능을 최적화합니다.

Vehicle Structure 측면에서는 차체 구조의 변형 모드, 하중 경로, 에너지 흡수 거동을 CAE로 분석해 구조 콘셉트를 제안하고, 실제 충돌 시험 결과와의 차이를 프로그램 단계에서 빠르게 피드백하여 구조 성능을 개선해 나갑니다.

PCEI(Post‑Crash Electrical Integrity) 측면에서는 충돌 이후 고전압 배터리와 고전압 전기 시스템의 전기적 무결성을 확보하는 것을 목표로 합니다. CAE를 통해 충돌 시 배터리 및 전장 부품의 거동과 패키징 리스크를 사전에 검토하고, 실차 충돌 시험 결과를 바탕으로 절연, 전기차단, 화재·감전 위험을 종합적으로 평가하여 설계·패키징 개선 방향을 제안합니다.

팀 동료들은 대체로 데이터와 사실을 중심으로 이야기하면서도, 질문과 의견 제기를 편하게 할 수 있는 분위기를 만들어 줍니다. 신규 입사자나 다른 분야에서 온 동료에게도 배경 설명을 충분히 해 주고, 해석 결과나 시험 영상을 같이 보며 “왜 이런 결과가 나왔는지”를 끝까지 같이 고민해 주는 스타일입니다. 이런 개방적이고 협업적인 팀 문화 덕분에, 서로 믿고 맡기면서도 함께 성장해 나갈 수 있다고 느끼고 있습니다.""",
                "Integrated occupant, structure, and post-crash electrical integrity work; data-driven, open discussion, and deep collaborative debugging of results.",
            ),
            Q(
                "내게 GMTCK란?",
                "What does GMTCK mean to you?",
                """저에게 GMTCK는 그냥 직장이 아니라, 제가 만든 해석과 아이디어가 실제 차량이 되어 도로 위를 달리는 걸 직접 볼 수 있는 무대입니다.

전기차와 신차의 안전을 개발하면서 매일 배우고 성장하고, 동시에 제가 타는 차, 제 가족이 탈 차의 안전을 함께 만들어 간다는 실감을 주는 엔지니어로서의 집 같은 곳이라고 생각합니다.""",
                "GMTCK is where simulation becomes real vehicles on the road—a place that feels like home for an engineer building the safety of cars you and your family drive.",
            ),
        ]
    },
}

if __name__ == "__main__":
    OUT.write_text(json.dumps(DATA, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Wrote", OUT, "keys:", list(DATA.keys()))
