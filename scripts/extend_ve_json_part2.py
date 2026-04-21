# -*- coding: utf-8 -*-
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


VES = {
    "ve-ve-virtual-engineering-solution-1": {
        "questions": [
            Q(
                "현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
                "Please describe your current work in detail.",
                """현재 저는 Virtual Integration Solution 1팀의 팀장으로서, 차량의 가장 기본이 되는 Body & Closure 구조를 담당하는 Design engineer와 CAE engineer가 함께 협업하는 팀을 이끌고 있습니다. 우리 팀은 Body Structure와 Hood, Side Door, Liftgate 등 Closure structure를 설계하고, 각종 구조 관련 해석을 수행하여 Virtual 단계에서 성능을 확보하는 역할을 맡고 있습니다. 이때 Structure에는 다양한 Exterior part, Interior part, Electrical module, Chassis part들이 조립되기 때문에, 이들이 제 성능을 발휘할 수 있도록 그 기반이 되는 뼈대를 설계,해석하는 것이 핵심입니다.

개인적으로는 Team leader로서 각 Program의 이슈와 일정을 조율하고, Design engineer와 CAE engineer들이 함께 성장할 수 있도록 역할 설계, 교육 및 Upskill, 정기,비정기 1 on 1 미팅 등을 통해 지원하고 있습니다. 궁극적으로는 Body & Closure 구조 분야에서 설계와 해석이 하나의 팀으로 움직이는 조직 문화를 만들고, All-in-one engineer가 성장할 수 있는 환경을 조성하는 것이 제가 맡고 있는 가장 중요한 업무입니다.""",
                "I lead VIS1 where design and CAE engineers collaborate on body and closure structures—hood, doors, liftgate—and virtual performance. My focus is coaching, staffing, and building a culture where design and analysis move as one team.",
            ),
            Q(
                "하루 업무에 대해 소개해주세요.",
                "Please describe a typical day.",
                """보통 저는 회사에 아침 7시 20분쯤 도착합니다. 현재 자율 좌석제를 운영하고 있어서, 제가 좋아하는 자리를 먼저 잡거나, 함께 일하는 동료나 후배들과 가까운 자리에 앉습니다. 때로는 혼자, 때로는 동료나 후배들과 함께 커피 한 잔을 마시면서 가볍게 이야기를 나누며 하루를 시작합니다.

업무는 비교적 일찍 시작하는 편입니다. 지난 밤에 온 메일, 어제 다 처리하지 못한 일, 그리고 오늘 캘린더에 잡혀 있는 일정을 먼저 확인합니다. 그중에서 리스크가 될 수 있는 이슈는 따로 표시해 두고, 당일 내로 반드시 다뤄야 할 안건과 후순위로 미뤄도 되는 안건을 나눠 정리합니다. 중요한 미팅이나 사안이 있으면, 미리 준비해야 할 사항이 있는지 살펴보고, 관련된 팀원들에게 짧은 코멘트나 질문을 보내 서로 공유하려고 합니다. 어떻게 보면 이 시간이, “오늘 어디에 시간을 가장 많이 써야 하는가?”를 결정하는 일종의 daily briefing 시간입니다. 필요할 때는 사내 AI agent 툴을 활용해 제 일정을 다시 한 번 점검하기도 합니다.

이후에는 저희 팀원들의 근태와 휴가 사용 현황을 확인합니다. 특히 조금 긴 휴가를 사용하는 경우에는, 해당 팀원의 서브 담당자들과 업무 조율이 잘 되어 있는지까지 함께 살펴봅니다. 그런 다음에는 유관 부서와 회의를 하거나, 각 프로젝트별로 중요한 메일을 읽으면서 팀원들에게 내용을 공유하고, 각 담당자에게 필요한 피드백을 보내는 식으로 오전 시간을 보냅니다.

점심시간에는 사내 GYM에 들러 가벼운 유산소 운동을 하고, 그 후에 식사를 합니다. 오후에는 여러 미팅에 참석하거나, 현재 진행 중인 프로젝트별 주요 이슈를 점검하고, 제 직속 상사로부터 내려오는 요청 사항에 대응합니다. 또한 제가 맡고 있는 팀원이 19명이라, 오전과 오후 일정 중간중간에 정기적,비정기적인 1 on 1 미팅을 통해 팀원들과 함께 고민을 나누거나, 한 가지 주제를 두고 깊이 토론하는 시간도 갖습니다.

이렇게 지내다 보면 어느덧 퇴근 시간이 가까워집니다. 종종 글로벌 팀과의 conference call이 잡혀 있어서 회사에서 야근을 하기도 하고, 시간이 너무 늦게 잡힌 회의는 퇴근 후 집에서 접속해 참석하기도 합니다. 이렇게 적어놓고 보니, 나름 꽤 바쁘게 하루를 보내고 있는 것 같네요.""",
                "Early start, triage mail and risks, support attendance and coverage, meetings and program issues, many 1:1s with a 19-person team, gym at lunch, global calls late—busy but structured days.",
            ),
            Q(
                "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
                "What competencies matter for this work?",
                """우리 팀은 Body & Closure structure를 담당하는 Design Engineer와 CAE Engineer가 함께 협업하는 팀입니다. 각자는 Body structure와 Closure structure의 설계와 해석을 맡고 있지만, 우리는 여기서 한 걸음 더 나아가 서로의 업무를 잘 이해하고 일부를 커버해 주는 All-in-one 지향 조직을 목표로 합니다.

그래서 각자의 전문성을 기반으로 하되, 설계와 해석의 경계를 조금씩 넘나들며 이웃 영역까지 도와줄 수 있는 확장성을 중요하게 생각합니다. 이를 위해서는 “내 일만 한다”는 태도보다는, 옆 동료의 관점과 제약 조건까지 이해하려는 오픈 마인드가 필수입니다.

또한 설계팀, 유관 해석팀, 프로그램팀, 글로벌 동료들과 계속 대화를 해야 하기 때문에, 자신의 생각을 분명히 전달하고, 다른 사람의 이야기를 충분히 듣는 커뮤니케이션 능력도 매우 중요합니다. 그리고 한 번 맡은 업무에 대해서는 일정과 품질에 책임을 지려는 Ownership이 우리 팀의 기본 기대치입니다.

문제가 생겼을 때는 남 탓보다는 문제 정의 – 대안 설계 – 해석 – 피드백 – 개선의 흐름으로 풀어가려 하고, 새로운 툴과 교육, 피드백을 통해 계속 배우고자 하는 성장 지향성을 가진 사람이 우리 VIS 1팀이 지향하는 All-in-one engineer에 알맞는 인재라고 생각합니다.""",
                "All-in-one mindset across design and CAE, open communication, ownership, structured problem solving, and continuous learning.",
            ),
            Q(
                "진행하셨던 프로젝트 중 인상 깊었던 프로젝트가 있나요?",
                "Was there a memorable project?",
                """Virtual Integration Solution 1 team의 팀장으로 부임하기 전에, 실무자였던 충돌해석 엔지니어 관점에서는 VISTIQ(Project명: L234) 프로젝트가 가장 기억에 남습니다. VISTIQ는 같은 BEV3 project 안에서 가장 크고 무거운 차량이라, 충돌 해석 관점에서 보면 말 그대로 worst case 차량이었습니다. Simulation Lead Engineer로서 낮에는 서브 팀 엔지니어들과 유관 부서 엔지니어들과 함께 이슈를 풀고, 밤에는 글로벌 카운터파트와 거의 매일 회의를 하며 그날 진행된 내용들을 정리하고 방향을 결정해야 했습니다. “어떻게 버텼나” 싶을 정도로 강행군이었지만, 결국 성공적으로 런치를 마무리했고, 그만큼 고생이 보상받는 느낌이어서 지금도 가장 먼저 떠오르는 프로젝트입니다.

개발 프로젝트는 아니지만, 2025년에 진행했던 DIFA 행사 진행도 저에게는 큰 의미가 있었습니다. Core team leader로서 여러 소모임의 의견을 취합 및 정리하고, 부스 운영과 예산, 외부 업체와의 협업을 리드하면서, “우리 GMTCK의 과거,현재,미래를 어떻게 하나의 스토리로 보여줄 것인가”를 처음부터 끝까지 고민해 볼 수 있었기 때문입니다. 현장에서 직접 고객들을 만나 설명하고 피드백을 듣는 경험은, 책상 앞에서 해석만 할 때와는 또 다른 보람을 주는 시간이었습니다.""",
                "VISTIQ/L234 as simulation lead—the heaviest BEV3 variant—and leading DIFA 2025 as a core team leader to tell GMTCK’s story to customers.",
            ),
            Q(
                "내게 GMTCK란?",
                "What does GMTCK mean to you?",
                """내게 GMTCK란, 학교이자 놀이터 같은 곳입니다. 차체 설계 엔지니어로 시작해 충돌 해석 엔지니어를 거쳐, 지금은 Virtual Integration Solution 1팀의 팀장으로 일하고 있습니다. 이곳은 매번 새로운 도전 과제와 숙제를 던져주고, 저는 그것을 풀어가는 과정에서 수많은 사람들을 만나고 또 헤어지며 조금씩 성장해 왔습니다.

문제를 정의하고 함께 토론하며 해법을 찾고, 결과에 대한 피드백을 받으며 다시 개선해 나가는 일상이 이곳에서의 공부입니다. 그 사이사이 팀과 조직을 위한 크고 작은 이벤트를 기획하고 참여하며, 서로를 격려하고 웃을 수 있었던 기억들은 이곳을 놀이터처럼 느끼게 만듭니다.

그래서 내게 GMTCK는 단순한 직장이 아니라 “배우고, 부딪히고, 함께 즐기며 앞으로 나아가게 해 주는 삶의 한 장”입니다.""",
                "GMTCK is both school and playground—a chapter of life where learning, collaboration, and growth never stop.",
            ),
        ]
    },
    "ve-ve-virtual-engineering-solution-2": {
        "questions": [
            Q(
                "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
                "Please introduce your role and responsibilities.",
                """

차량을 실제로 만들기 전에 가상(Virtual) 환경에서 먼저 설계하고 검증하며, Body, Interior, Exterior, Electric 등 다양한 부품을 직접 3D 모델링하고 설계 아이디어를 구체화합니다. 개발 과정에서 발생할 수 있는 문제를 초기에 발견하고 해결하는 것이 주요 역할입니다.

특히 트렁크나 테일게이트와 같은 차체 구조 부품(Rear Closure) 설계 경험을 바탕으로 구조 안정성과 패키지 조건을 함께 고려해 설계를 검토해 왔습니다. Design Studio, 설계 팀, 해석 팀과 협업하며 각 부품이 차량 전체에서 자연스럽게 어울리도록 설계 방향을 조율하고 있습니다.

현재는 Virtual Program Execution 3 Team 소속으로 Virtual Engineering 기반 설계 및 검증 업무를 수행하며, 더 빠르고 효율적인 차량 개발 방식과 디지털 기반 개발 프로세스를 지속적으로 연구하고 있습니다.""",
                "Virtual design engineer modeling body, interior, exterior, and electrical parts; deep rear-closure experience; collaborating with studio, design, and CAE; now on VPE3 pursuing digital development efficiency.",
            ),
            Q(
                "하루 업무에 대해 소개해주세요.",
                "Please describe your daily work.",
                """하루 업무는 프로그램 진행 단계와 이슈 상황에 따라 매일 조금씩 달라집니다.

설계 초기에는 Design Studio와 함께 디자인 요구사항과 패키지 조건을 검토하며 차량의 기본 방향을 잡습니다. 이 과정에서 스타일 검토를 위한 단면도와 3D 모델을 직접 만들며, 디자인이 실제 구조와 양산 조건에 잘 맞는지 하나씩 확인하면서 설계를 구체화합니다.

이후에는 화면 앞에서 형상을 여러 번 수정하고 구조를 바꿔 보며 “어떤 방법이 가장 합리적일까”를 계속 고민합니다. 그렇게 정리된 결과를 바탕으로 Design Studio, 설계 팀, 해석 팀과 논의하며 차량 전체 관점에서 최적의 방향을 찾아갑니다.

연구소에는 다양한 업무 공간이 마련되어 있어 가끔은 라운지로 자리를 옮겨 작업하기도 합니다. 환경이 바뀌면 생각이 환기되고 새로운 아이디어가 떠오르는 경우가 많습니다. 이런 작은 고민과 선택들이 모여 한 대의 차량이 완성됩니다.""",
                "Days vary by phase—early work with studio on requirements and sections, iterative CAD iterations, then alignment with studio, design, and CAE; sometimes moving to a lounge to refresh ideas.",
            ),
            Q(
                "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
                "What competencies are important?",
                """결국 Design Engineer에게 가장 중요한 것은 직접 설계해 보고, 스스로 문제를 해결해 보는 경험이라고 생각합니다. 3D 모델링으로 아이디어를 구체화하고, 설계 과정에서 발생하는 다양한 이슈를 하나씩 부딪혀 해결해 나가며 실력이 쌓인다고 느끼고 있습니다.

또 여러 부서와 함께 일하는 일이 많기 때문에 Design Studio, 설계 팀, 해석 팀과 원활하게 소통하고 의견을 조율하는 커뮤니케이션 능력도 중요합니다. 혼자 잘하는 것보다 함께 방향을 맞추는 능력이 더 큰 차이를 만든다고 생각합니다.

기술적인 전문성과 협업 역량이 함께 갖춰질 때 차량 전체를 보는 시야가 생기고, 더 완성도 높은 설계로 이어진다고 느끼고 있습니다.""",
                "Hands-on design practice, structured problem solving, and communication that aligns studio, design, and analysis teams.",
            ),
            Q(
                "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
                "What is your team culture like?",
                """저희 팀은 편하게 질문하고 의견을 나눌 수 있는 분위기가 자연스럽게 자리 잡혀 있습니다. 혼자 오래 고민하기보다는 옆자리 동료에게 “이 방향이 맞을까요?” 하고 바로 물어볼 수 있고, 이런 작은 대화들이 문제 해결에 큰 도움이 됩니다.

필요하면 언제든 도움을 요청할 수 있어 심리적으로도 편안하게 일할 수 있으며, 이런 문화 덕분에 새로운 시도도 부담 없이 해볼 수 있습니다.

최근에는 AI 기반 도구와 디지털 기술도 적극적으로 활용하면서 반복적인 업무를 줄이고, 엔지니어가 더 중요한 설계 판단과 문제 해결에 집중할 수 있도록 업무 방식을 계속 개선하고 있습니다.""",
                "Open, ask-friendly culture; psychological safety to try new things; adopting AI/digital tools to reduce repetitive work.",
            ),
            Q(
                "앞으로의 목표 또는 커리어 방향",
                "Future goals or career direction",
                """Virtual Engineering과 디지털 기술을 적극 활용해 차량 개발을 더 빠르고 효율적으로 만드는 방법을 계속 고민하고 있습니다. 반복적인 업무는 자동화하고, Design Engineer가 더 본질적인 설계와 문제 해결에 집중할 수 있는 환경을 만드는 것이 목표입니다.

기술과 협업을 통해 실제 개발 현장에 도움이 되는 가치를 만들고, 장기적으로는 차량 전체를 이해하며 여러 팀을 연결하고 개발 프로세스까지 함께 고민하는 Design Engineer로 성장하고 싶습니다.""",
                "Drive virtual engineering and automation so engineers focus on core design decisions; grow into a connector across teams and processes.",
            ),
        ]
    },
    "ve-ve-virtual-engineering-solution-3": {
        "questions": [
            Q(
                "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
                "Please introduce your role and responsibilities.",
                """저는 Virtual Engineering Solutions Division팀에서, 차량 전체를 연결하는 와이어링 하네스의 3D 설계와 회로 정보를 연계하는 업무를 담당하고 있습니다.

하네스는 차량 곳곳을 지나가기 때문에 주변 부품과 간섭이 없도록 경로를 결정하고 패키징을 조율하는 역할을 합니다.

또한 실제 공장에서 하네스가 원활하게 조립될 수 있도록 굽힘 반경, 고정 위치, 작업 접근성 등을 고려하여 설계하고, 사전에 품질 이슈를 예방할 수 있도록 다양한 조건을 검토하고 있습니다.""",
                "I design 3D wiring harness routing and align it with circuit data—packaging for interference, manufacturability, bend radius, retention, and quality risk prevention.",
            ),
            Q(
                "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
                "What competencies are essential?",
                """담당 업무에는 총 5가지 핵심 역량이 필요하다고 생각합니다.

1. 3D 모델링 및 도면 이해도: NX, Teamcenter 등을 활용한 3D 설계 및 데이터 관리 능력
2. 전기, 회로 시스템 이해: 회로 정보와 하네스 모델을 일관성 있게 연결하는 능력
3. 커뮤니케이션 역량: 바디, 전장, 샤시 등 다양한 부서와 협업하며 의견을 조율하는 능력
4. 패키징 이해도: 차량 구조와 공간 제약을 파악해 합리적인 하네스 경로를 설계하는 능력
5. 논리적 문제 해결력: 간섭, 품질, 성능 이슈 발생 시 원인을 분석하고 해결방안을 제시하는 능력""",
                "3D literacy (NX/Teamcenter), electrical/circuit consistency, cross-functional communication, packaging insight, and logical root-cause problem solving.",
            ),
            Q(
                "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
                "What is your team culture like?",
                """저희 팀은 협업 중심의 분위기가 잘 형성되어 있습니다. 차량 전체 패키지를 다루다 보니 복잡한 문제도 있지만, 팀원들은 각자의 경험을 공유하고 문제를 함께 해결하는 문화가 있습니다.""",
                "Strong collaboration—complex full-vehicle packaging problems are solved by sharing experience openly.",
            ),
            Q(
                "앞으로의 목표 또는 커리어 방향",
                "Future goals or career direction",
                """앞으로는 전장 패키징에 대한 전문성을 더욱 강화하고, 단순한 설계를 넘어 고객 관점에서 안전과 품질까지 고려하는 하네스 전문가로 성장하고 싶습니다. 하나의 배선이 완성되기까지 필요한 다양한 요소들을 폭넓게 이해하고, 더 안정적이고 편리한 차량 개발에 기여하는 것이 목표입니다.""",
                "Grow deeper expertise in electrical packaging and become a harness specialist who considers safety, quality, and customer experience—not just routing.",
            ),
            Q(
                "내게 GMTCK란?",
                "What does GMTCK mean to you?",
                """GMTCK는 저에게 성장 기회를 주는 곳이며, 복잡한 시스템을 함께 만들어 가며 팀워크의 가치를 배우는 곳이라고 생각합니다. 전동화와 전장 기술이 빠르게 변화하는 환경 속에서, 계속해서 스스로 발전하고 도전할 수 있게 만드는 회사라고 생각합니다.""",
                "GMTCK is a place of growth and teamwork while building complex systems—especially in fast-moving electrification and electronics.",
            ),
        ]
    },
}

if __name__ == "__main__":
    base = json.loads(VE_JSON.read_text(encoding="utf-8"))
    base.update(VES)
    VE_JSON.write_text(json.dumps(base, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Merged VES keys:", list(VES.keys()), "total:", len(base))
