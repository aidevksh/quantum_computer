# 온도·하드웨어·오류정정 조사 노트

검토 기준: **2026-11-07**. 아래 자료는 표준 기관, 해당 장치를 만든 연구팀·대학·기업의 1차 자료만 사용했다. 발표 자료의 장래 목표는 실증 결과와 구별한다. 날짜가 없는 상시 문서는 ‘날짜 미표시’로 적는다. 본문의 수치 예시는 별도 설명이 없는 한 특정 장치의 종합 성능 예측이 아니다.

## 1. 독자가 먼저 이해해야 할 이야기

온도는 물질의 열적 상태를 나타낸다. 원자·분자의 불규칙한 운동과 연결되지만, 모든 계에서 ‘원자 속도 하나’로 정의할 수 있는 양은 아니다. 켈빈은 과학에서 사용하는 절대온도 단위이며 `°K`가 아닌 `K`로 쓴다. `T(K) = t(°C) + 273.15`이다. 1 K만큼 변화하는 것은 1°C만큼 변화하는 것과 같다. 따라서 절대영도는 **0 K = −273.15°C**다. [H01]

절대영도는 ‘원자와 전자가 완전히 멈추는 온도’라고 설명하면 부정확하다. 가장 낮은 에너지 상태에도 **영점운동**이라는 양자적 운동이 남을 수 있다. 이것은 열 때문에 일어나는 운동과 다르다. 유한한 물리 과정으로 정확히 0 K에 도달할 수 없으며, 실험에서는 그 가까이 접근한다. ‘우주보다 차갑다’보다 ‘0 K보다 0.015 K 높은 온도’가 개념적으로 명확하다. [H01, H02]

초전도 양자컴퓨터에서 극저온이 필요한 이유는 전기저항을 없애는 것만이 아니다. 큐비트의 `0`과 `1` 사이 에너지 차이가 작아 열이 뜻하지 않은 들뜸을 만들기 쉽다. 낮은 온도와 차폐·필터로 이러한 잡음을 줄인다. IBM의 칩 검사실은 **15 mK = 0.015 K = −273.135°C**를 보고한다. 이는 모든 양자컴퓨터의 표준 작동온도가 아니다. [H03, H04, H08]

## 2. 온도 인터랙션을 위한 식

### 섭씨와 켈빈

`t(°C) = T(K) − 273.15`

`1 mK = 0.001 K`. 예를 들어 15 mK는 15 K와 1,000배 다르다.

### 열에너지와 큐비트 에너지

`E_thermal ≈ k_B T`, `ΔE = h f`

- `T`: 켈빈 온도.
- `k_B = 1.380649 × 10⁻²³ J/K`: 온도를 에너지 규모와 연결하는 볼츠만 상수.
- `h = 6.62607015 × 10⁻³⁴ J·s`: 플랑크 상수.
- `f`: 큐비트의 두 에너지 준위 사이 전이에 해당하는 주파수. 아래는 교육용 **5 GHz** 예시.
- `ΔE`: 두 준위 사이의 에너지 차이. `h f / k_B ≈ 0.239962 K`이다. [H07, H08]

두 준위만 있고 두 준위의 축퇴도가 같으며, 주위 온도와 **열평형**에 도달했다는 이상화에서는:

`p_excited(T) = 1 / (1 + exp(ΔE / (k_B T)))`

이는 `p_1 / p_0 = exp(−ΔE/(k_B T))`와 `p_0 + p_1 = 1`에서 구한다. `p_excited`는 가만히 두었을 때 높은 에너지 준위에 있을 확률이며 **장치 전체의 오류율**과 같지 않다. 높은 온도에서 50%에 접근하는 것은 두 준위 모델의 성질이다. 실제 초전도체는 높은 온도에서 양자컴퓨터로 작동하지 않으며 실제 원자는 더 많은 에너지 준위를 가지므로, 300 K까지 곡선을 그릴 경우 ‘모델을 수학적으로 연장한 구간’이라고 표시해야 한다.

| 온도 | 섭씨 | 이상적 5 GHz 두 준위 모델의 들뜸 확률 |
|---|---:|---:|
| 10 mK | −273.140°C | 약 0.00000000379% |
| 15 mK | −273.135°C | 약 0.0000113% |
| 20 mK | −273.130°C | 약 0.000616% |
| 35 mK | −273.115°C | 약 0.105% |
| 100 mK | −273.050°C | 약 8.32% |
| 1 K | −272.150°C | 약 44.03% |

**실제 장치와의 차이:** 냉장고가 차갑다고 큐비트의 유효온도와 들뜸 확률이 이상식 그대로 되지는 않는다. 2015년 3D transmon 실험은 35–150 mK에서 열분포와 일치했지만 더 낮은 냉장고 온도에서도 약 0.1%의 잔류 들뜸을 관측했다. 그 원인에는 배선에서 유입되는 잡음·비평형 효과 등이 있을 수 있다. 교육용 곡선에 실측 성능이라는 표기를 붙이지 않는다. [H08]

### 권장 조작

온도 슬라이더는 `T = 10^x K`로 두어 예를 들어 0.001–300 K를 탐색하게 한다. 로그축에는 0을 표시할 수 없으므로 **0 K는 별도 경계선**으로 그린다. 실온·액체질소·액체헬륨·15 mK 버튼을 둔다. 에너지 막대 두 개(`k_B T`, `h f`)와 위 식의 들뜸확률을 함께 바꾸면 냉각의 이유가 보인다. 열에너지 `k_BT`는 전형적인 에너지 규모이며, 개별 입자가 모두 이 에너지를 갖는다는 뜻이 아니다.

희석냉동기의 층별 그림에 **실온 → 약 50 K → 약 4 K → 약 0.1 K → 약 0.01–0.02 K**를 넣을 수 있다. 장치마다 온도와 단계가 달라지는 **개념도·예시**라고 표시한다. IBM의 공개 강연 그림에는 40 K, 3 K, 0.9 K, 0.1 K, 0.015 K가 나온다. [H05] 2026년 IBM의 두 모듈 연결 시험은 4 K까지 5일 미만, 최종 15 mK 미만을 보고한다. ‘냉각 모듈 실증’과 ‘2029년 Starling 목표’는 다른 주장이다. [H04]

## 3. 모든 방식이 같은 냉장고를 쓰지는 않는다

| 방식 | `0`과 `1`을 담는 물리계 | 온도 설명 | 주요 과제 |
|---|---|---|---|
| 초전도 회로 | 인공 전기회로의 두 에너지 준위 | 칩을 보통 수십 mK 수준으로 냉각. IBM 사례 15 mK. 실험실 전체가 이 온도인 것은 아님. | 오류 감소, 배선, 냉각, 연결성, 논리 연산 |
| 이온트랩 | 전하를 띤 원자의 내부 에너지 준위 | 상온 트랩도 가능하나, 이온의 운동 자체는 레이저로 냉각. 일부 이온 실험은 저온 트랩을 사용. | 정밀 제어, 광학계, 연산속도, 모듈 연결 |
| 중성원자 | 중성 원자의 내부 에너지 준위 | 상온의 진공장치 안에서 원자 운동을 레이저로 매우 차갑게 만듦. 대형 희석냉동기 불필요. | 원자 손실, 게이트 정확도, 읽기·다시 채우기, 오류정정 |
| 광자 | 빛의 경로·편광 등 | 빛 자체에 초전도 칩과 똑같은 냉각 논리를 적용하지 않는다. 광원·검출기 등의 부품은 저온이 필요할 수 있음. PsiQuantum의 설계 발표는 4 K를 제시. | 광자 손실, 광원·검출, 대규모 연결 |

근거: 초전도 [H03]; 이온 [H06]; 중성원자 [H09]; 광자 [H10]. 특정 기업의 모든 비교 우위 표현을 일반 사실로 받아들이지 않는다. 특히 H10의 ‘모든 대형 양자시스템은 극저온’이라는 마케팅 문구는 이온·중성원자 사례와 맞지 않으므로 교재에서 사용하지 않는다. ‘상온 양자컴퓨터’는 ‘원자도 차갑지 않다’는 뜻이 아니다.

## 4. 왜 큐비트 개수만으로 성능을 말할 수 없을까

**물리 큐비트**는 실제 장치의 정보 단위다. **논리 큐비트**는 여러 물리 큐비트 사이의 관계에 정보를 분산하고 오류의 흔적을 반복 검사하여 보호하는 정보 단위다. 미지의 양자상태를 단순 복사해 여러 개 보관하는 것이 아니다. 필요한 물리 큐비트 수는 부호, 오류 확률·상관관계, 연결 구조, 원하는 신뢰도, 알고리즘과 필요한 보조 자원에 따라 달라진다. **‘논리 1개 = 물리 1,000개’는 보편적인 환산식이 아니다.** [H11, H12]

연산 도중 환경으로 정보가 새어 나가면 상대위상에 대한 질서가 깨지고 간섭이 약해질 수 있다. 이를 **결맞음 상실(decoherence)**이라고 부른다. 에너지가 떨어지는 진폭감쇠와 위상정보가 흐트러지는 dephasing을 구분한다. `Z` 오류는 `|0⟩`는 유지하고 `|1⟩`의 부호를 뒤집는다. `|+⟩ = (|0⟩+|1⟩)/√2`는 `|−⟩ = (|0⟩−|1⟩)/√2`가 된다. 두 상태를 곧바로 0/1로 읽으면 모두 반반이지만, H 게이트 뒤에 측정하면 결과가 반대로 나타난다. 그래서 확률 막대만 보며 양자정보가 같다고 판단할 수 없다. [H11, H13]

오류정정은 데이터값을 직접 다 읽는 대신, 큐비트 사이의 **관계에 생긴 이상(신드롬)**을 보조 큐비트로 검사한다. 그 결과를 고전 컴퓨터의 decoder가 해석한다. 단순한 3비트 다수결 그림은 좋은 출발점이지만 ‘이것으로 모든 양자 오류를 고친다’고 설명하면 안 된다. 비트 오류와 위상 오류를 함께 다루는 부호가 필요하다. [H11, H12]

### 검증된 성과 예시와 그 한계

Google Quantum AI의 Nature 논문(온라인 발표 2024-12-09)은 Willow에서 부호 거리를 2 늘릴 때 논리 오류가 약 2.14배 줄어드는 아래 임계값 동작을 보고했다. 거리 7 메모리는 데이터·측정·누설 제거용 합계 101개 물리 큐비트를 사용하고 보정 주기당 논리 오류는 0.143%였다. 이는 **보호된 양자 메모리의 실증**이다. 오류정정된 대규모 범용 알고리즘 전체를 완성했다는 뜻은 아니다. 논문은 2026-04-28 정정 이력이 있다. [H14]

교육용 부호 거리 그림에 `2d²−1`을 쓴다면 ‘특정 회전 표면부호 메모리의 데이터+검사용 기본 큐비트 수’로 한정한다. 실제 장치의 추가 누설제거 큐비트·통신·논리 게이트 보조자원은 더 필요하다. 예를 들어 거리7 기본 97개와 이 실험의 101개는 추가 큐비트 포함 여부가 다르다. [H14]

## 5. 어떤 문제에서 유용하며, 어디까지 왔나

양자컴퓨터는 CPU가 하던 모든 일을 더 빨리 하는 교체품이 아니다. 이점은 문제 구조와 알고리즘에 의존한다. 분자·물질의 양자 시뮬레이션, 구조를 이용한 정수 소인수분해, 특정 탐색 등의 가능성과, 데이터 입력·출력 및 오류정정 비용을 함께 설명한다. 최적화·머신러닝에서 모든 문제의 실용적 속도 향상이 입증된 것처럼 쓰지 않는다. 현재 잡음이 있는 장치의 유용성은 회로 깊이·반복 횟수·고전 계산 비교에 따라 달라진다. NISQ라는 용어의 출발점은 Preskill의 2018년 논문이다. 이 오래된 논문을 2026년 회사 현황의 근거로 쓰지는 않는다. [H15]

### 암호 이야기는 정확하게

충분히 크고 정확한 양자컴퓨터가 생기면 Shor 알고리즘으로 RSA·타원곡선 등 일부 널리 쓰이는 공개키 암호를 위협할 수 있다. 모든 암호가 같은 방식으로 깨지는 것은 아니다. **현재 장치가 실사용 공개키 암호를 이미 깨고 있다는 설명은 틀리다.** 2026-10-06 미국 GAO 보고서는 현재 양자컴퓨터는 그러한 암호를 아직 깰 수 없다고 명시한다. [H16]

NIST는 **2024-08-13** 첫 세 최종 PQC 표준을 발표했다. FIPS 203/ML-KEM은 키 설정용, FIPS 204/ML-DSA와 FIPS 205/SLH-DSA는 전자서명용이다. PQC는 기존 컴퓨터에서 실행하는 새로운 수학 기반 방어법이며, 양자컴퓨터나 양자통신 장비를 설치해야 한다는 뜻이 아니다. 충분한 장치가 등장할 시점을 확정해서 말하지 않는다. [H17]

## 6. 출처 목록 및 지원하는 주장

각 항목의 요약은 독립적인 한국어 요약이며 원문 장문을 전재하지 않았다.

- **H01 — NIST, Kelvin: Introduction.** 최초 2018-05-14, 업데이트 2026-01-05. `0 K = −273.15°C`, kelvin 표기, 영점운동과 열운동 구별. https://www.nist.gov/si-redefinition/kelvin-introduction
- **H02 — NIST, About Cryogenics.** 원문 백과사전 2002, 페이지 최초 2016-09-07, 업데이트 2025-08-18. 절대영도 도달불가와 최저에너지, 저온 유체 끓는점. 설명에서는 원문의 ‘무한 입력전력’ 표현을 만능 증명처럼 확대하지 않음. https://www.nist.gov/mml/acmd/cryogenic-technologies-project/about-cryogenics
- **H03 — IBM Research, How to test a quantum computer chip.** 2024-12-18. 초전도 칩 검사에 희석냉동기 사용, 15 mK. https://research.ibm.com/blog/ibm-quantum-characterization-lab-tour
- **H04 — IBM, IBM Connects Its First Modular Cryogenic Systems in Milestone Toward Fault-Tolerant Quantum Computing.** 2026-08-19. 두 모듈 연결 냉각 시험에서 4 K까지 5일 미만, 최종 15 mK 미만. 2027/2029 내용은 회사의 장래 계획. https://newsroom.ibm.com/2026-08-19-ibm-connects-its-first-modular-cryogenic-systems-in-milestone-toward-fault-tolerant-quantum-computing/
- **H05 — IBM Research의 CERN 공개 강연 자료, Quantum Computing.** 2018년 CERN 행사 자료. 냉동기 개념도에 40 K/3 K/0.9 K/0.1 K/0.015 K; 보편적 표준 단계라는 의미 아님. https://indico.cern.ch/event/719844/contributions/3019718/attachments/1749768/2835637/CERN_Tavernelli4_l.pdf
- **H06 — UCSB, Researchers demonstrate integrated stabilized laser chips performing clock and quantum operations on a room temperature trapped ion qubit.** 2026-03-30. 상온 표면트랩과 정밀 광제어의 실증. 이온의 운동온도까지 실온이라는 뜻이 아님. https://news.ucsb.edu/2026/022479/researchers-demonstrate-integrated-stabilized-laser-chips-performing-clock-and-quantum
- **H07 — NIST SP 961, CODATA Recommended Values of the Fundamental Physical Constants: 2022.** 2024-05. `h`와 `k_B` 고정값. https://physics.nist.gov/cuu/pdf/wall_2022.pdf
- **H08 — X. Y. Jin et al., Thermal and Residual Excited-State Population in a 3D Transmon Qubit.** Physical Review Letters 114, 240501, 2015-06-15. 5 GHz/15 mK 예시, 이상 열평형과 실제 잔류 들뜸 구별, 35–150 mK 열평형 범위, 저온에서 약 0.1% 포화. https://doi.org/10.1103/PhysRevLett.114.240501 ; 저자 공개본 https://arxiv.org/abs/1412.2772
- **H09 — QuEra, Using Neutral-Atom Arrays to Build Quantum Computers.** 날짜 미표시 상시 문서, 현재 내용에 2026-10 현황 표기. 루비듐 원자, 광집게와 레이저냉각, 희석냉각 없이 원자계 제어. 모든 마케팅 우위 주장을 채택하지 않음. https://www.quera.com/neutral-atom-platform
- **H10 — PsiQuantum, PsiQuantum and Linde Engineering Collaborate to Deliver Cryogenic Plant for World’s First Utility-Scale Quantum Computer in Brisbane.** 2025-05-08; PsiQuantum 페이지에는 월일만 있지만 협력사 Linde의 같은 날 발표 H18로 연도 확인. 미래 설계는 4 K를 제시하며 완성된 시스템이 아님. ‘모든 양자컴퓨터 극저온’이라는 본문 일반화는 사용 금지. https://www.psiquantum.com/news-import/psiquantum-linde
- **H11 — IBM Quantum Learning, Foundations of quantum error correction: Correcting quantum errors, Introduction.** 날짜 미표시; 대응 공식 강의 영상 2024-11-13. 외부 환경과 분리하면서 제어·측정해야 하는 긴장, 9큐비트 Shor 부호 소개. https://quantum.cloud.ibm.com/learning/en/courses/foundations-of-quantum-error-correction/correcting-quantum-errors/introduction
- **H12 — IBM Quantum Learning, Error correction II: When is error correction the right tool for quantum advantage?** 날짜 미표시 상시 강의. X/Z 오류, 신드롬, 부호 거리, 물리/논리 큐비트, 보조자원과 decoder 비용. https://quantum.cloud.ibm.com/learning/en/courses/tools-for-quantum-advantage/error-correction-ii
- **H13 — IBM Quantum Learning, General formulation of quantum information: Quantum channels.** 날짜 미표시. dephasing은 밀도행렬의 비대각 성분을 없애며 0/1 확률은 유지될 수 있음. https://learning.quantum.ibm.com/course/general-formulation-of-quantum-information/quantum-channels
- **H14 — Google Quantum AI and Collaborators, Quantum error correction below the surface code threshold.** 온라인 2024-12-09, Nature 638, 920–926 (2025), 정정 2026-04-28. Willow에서 아래 임계값 양자 메모리·2.14배 억제·101개 물리 큐비트·0.143% 주기당 논리 오류. https://www.nature.com/articles/s41586-024-08449-y
- **H15 — John Preskill, Quantum Computing in the NISQ era and beyond.** Quantum 2, 79, 2018-08-06. NISQ 용어와 잡음이 회로 크기에 주는 제약. https://doi.org/10.22331/q-2018-08-06-79
- **H16 — U.S. GAO, Quantum Computing: Federal Actions Needed to Prepare for Emerging Cyber Threat.** 2026-10-06, 정정 2026-10-14. 현재 양자장치는 실사용 암호를 아직 깨지 못하며 장래 관련 장치의 등장 시기 불확실. https://www.gao.gov/products/gao-27-108740
- **H17 — NIST, NIST Releases First 3 Finalized Post-Quantum Encryption Standards.** 2024-08-13. FIPS203/204/205 확정, 키설정과 서명 구별, 마이그레이션 준비. https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards
- **H18 — Linde Engineering, Linde Engineering to Deliver Large Cryogenic Plant to PsiQuantum in Australia.** 2025-05-08. Omega 칩셋과 기타 장치가 든 캐비닛을 4 K 범위로 냉각하는 설비 공급 계약. H10 날짜와 냉각 대상 확인에 더 적합한 협력사 1차 자료. https://www.linde-engineering.com/news-and-events/press-releases/2025/linde-engineering-to-deliver-large-cryogenic-plant-to-psiquantum-in-australia

## 7. 확인 기록

- 웹에서 위 원문을 열어 주장 및 날짜를 확인했다. 2026-11-07 이후 발표를 근거로 채택하지 않았다.
- 일부 상시 문서의 발행일은 원문에서 확정할 수 없어 날짜 미표시로 적었다. PsiQuantum 발표 연도는 협력사 Linde의 같은 사건 발표로 교차 확인했다.
- 위 5 GHz 들뜸확률 표는 고정된 SI 상수로 Python `math.exp`를 사용해 직접 계산했다. `hf/k_B = 0.23996215366831103 K`.
- 교재 제작 시 ‘이상 모델’, ‘특정 실험 결과’, ‘기업 발표의 미래 목표’를 시각적으로 구별해야 한다.
