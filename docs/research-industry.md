# 양자컴퓨팅 기관·기업 현황 조사

조사 확인일: 2026-11-07 (Asia/Seoul). 이 날짜까지 공개된 자료 중 확인한 주요 이정표를 정리했다. 전 세계의 모든 발표를 포괄한 실시간 장치 목록이나 성능 순위가 아니다. 날짜는 각 카드가 다루는 발표·논문 날짜이며, 서로 다를 수 있다.

## 조사·표현 원칙

- 기관 공식 발표, 연구팀 논문·원자료, 직접적인 학술 반론과 답변을 우선했다. 회사 보도자료는 회사가 발표한 사실의 근거이며 독립적인 성능 인증으로 취급하지 않았다.
- 물리 큐비트, 논리 큐비트, 프로그래머블 큐비트, 회사 자체 지표를 구분했다. 인코딩만 한 논리 큐비트 수와 지속적으로 오류가 정정되는 논리 연산 능력은 같지 않다.
- 메모리 오류율, 단일/두 큐비트 게이트 오류율, 회로 성공률, 후선택 성공률은 서로 다른 측정이다. 다른 방식·실험의 숫자를 순위로 나열하지 않았다.
- 출시·가동, 실험 실증, 부품/시설 개발, 미래 로드맵을 구분했다. 카드의 상태는 해당 이정표의 단계이며 회사 전체의 모든 활동을 평가하는 등급이 아니다.
- 대규모 일반 계산이나 산업 전반의 양자 우위가 이미 입증됐다고 쓰지 않았다. 특정 벤치마크 우위와 경제적·실용적 우위를 구분했다.
- 발표 제목의 “최초”, “최고”, “세계에서 가장 강력” 같은 홍보 표현은 본문 사실로 그대로 옮기지 않았다.

## 확인한 주요 이정표와 근거

### IBM — 2026-11-06

방식: 초전도. 지역: 미국. 단계: 실증.

시카고에 Nighthawk 기반 System Two를 가동했다고 발표했다. 2026년 8월에는 냉각 모듈 두 개를 연결해 15 mK 미만으로 냉각했다. 여러 칩을 함께 쓰기 위한 공학적 진전이다.

대표 지표: 2029년 목표: 논리 큐비트 200개·게이트 1억 회

해석 범위: Starling 수치는 회사의 미래 목표다. 냉각 모듈 연결만으로 대규모 오류 내성 컴퓨터가 완성된 것은 아니다.

발전 방향: qLDPC 오류 정정, 칩 사이 연결, 실시간 해독과 고성능 고전컴퓨터의 결합.

- [IBM, 시카고 System Two 가동 발표](https://newsroom.ibm.com/2026-11-06-ibm-unveils-its-most-advanced-quantum-computer-in-chicago,-marking-a-milestone-for-illinoiss-quantum-future) — 2026-11-06
- [IBM, 모듈형 극저온 시스템 연결](https://newsroom.ibm.com/2026-08-19-ibm-connects-its-first-modular-cryogenic-systems-in-milestone-toward-fault-tolerant-quantum-computing/) — 2026-08-19
- [IBM Starling 아키텍처와 로드맵](https://www.ibm.com/quantum/blog/large-scale-ftqc) — 2025-06-10

### Google Quantum AI — 2026-01-13

방식: 초전도. 지역: 미국. 단계: 실증.

Willow의 2024년 실험은 오류 정정에 쓰는 큐비트 격자를 키울수록 논리 오류가 줄어드는 모습을 보였다. 2026년에는 동적 표면 부호를 실험해 배선 제약과 특정 오류를 줄이는 길을 연구했다.

대표 지표: Willow: 물리 큐비트 105개

해석 범위: Quantum Echoes의 속도 우위는 특정 벤치마크 회로에서의 결과다. 모든 계산이나 신약 개발이 그만큼 빨라졌다는 뜻이 아니다.

발전 방향: 논리 오류의 지속적인 감소와 검증 가능한 양자 시뮬레이션.

- [Google Research, 동적 표면 부호 실험](https://research.google/blog/dynamic-surface-codes-open-new-avenues-for-quantum-error-correction/) — 2026-01-13
- [Google Research, Willow 오류 정정](https://research.google/blog/making-quantum-error-correction-work/) — 2024-12-09
- [Google Research, Quantum Echoes 실험](https://research.google/blog/a-verifiable-quantum-advantage/) — 2025-10-22

### Quantinuum — 2026-10-19

방식: 이온트랩. 지역: 미국·영국. 단계: 실증.

98개 물리 큐비트를 가진 Helios를 2025년 출시했다. 2026년 10월에는 오류 정정 부호의 보호 정도를 키우며 논리 메모리 오류가 감소하는 실험을 발표했다.

대표 지표: 보고된 논리 메모리 오류: 정정 주기당 약 5 × 10⁻⁶

해석 범위: 이 수치는 특정 메모리 실험의 주기당 오류다. 임의의 알고리즘을 100만 회 무오류로 실행했다는 뜻이나 모든 게이트의 오류율이 아니다.

발전 방향: 이온을 이동시키는 구조와 유연한 오류 정정; Apollo는 2029년 목표.

- [Quantinuum, 논리 메모리·게이트 오류 감소 실험](https://www.quantinuum.com/blog/quantinuum-closes-in-on-one-million-error-free-operations) — 2026-10-19
- [Quantinuum, Helios 상용 출시](https://www.quantinuum.com/press-releases/quantinuum-announces-commercial-launch-of-new-helios-quantum-computer-that-offers-unprecedented-accuracy-to-enable-generative-quantum-ai-genqai) — 2025-11-05
- [Helios 98큐비트 프로세서 기술 논문](https://arxiv.org/abs/2511.05465) — 2025-11-07

### IonQ — 2026-09-08

방식: 이온트랩. 지역: 미국·영국. 단계: 개발.

Superion 256 플랫폼을 발표하고, 칩 제작과 시제품의 첫 이온 포획을 보고했다. 전자 제어를 칩에 통합해 큰 시스템을 반복 생산하려는 접근이다.

대표 지표: Superion 256: 고객 인도 목표 2027년

해석 범위: 제품 발표·첫 이온 포획은 256큐비트 전체의 알고리즘 성능 검증과 다르다. 회사 지표 #AQ도 논리 큐비트 개수가 아니다.

발전 방향: 전자식 이온 제어, 칩 제조, qLDPC 오류 정정과 더 큰 프로세서.

- [IonQ, Superion 256 발표와 개발 단계](https://www.ionq.com/news/ionq-launches-superion-product-line-industry-leading-upgradeable-platform-designed-to-scale-manufacturable-fault-tolerant-quantum-computing) — 2026-09-08
- [IonQ 시스템 비교·지표 정의](https://www.ionq.com/quantum-systems/compare) — 확인 2026-11-07

### Harvard·MIT·QuEra — 2026-06-25

방식: 중성원자. 지역: 미국. 단계: 실증.

하버드에서 수행한 연구는 최대 448개 원자 배열로 오류 정정, 논리 연산, 계산 중 원자 재사용 등 핵심 요소를 실험했다. QuEra의 Aquila는 256큐비트 아날로그 시뮬레이터다.

대표 지표: 2025년 논문: 특정 부호에서 최대 96개 논리 큐비트 인코딩

해석 범위: 서로 다른 부호와 실험의 최대값을 합쳐 하나의 완성 장치로 읽으면 안 된다. 일부 결과는 오류가 검출된 실행을 제외하는 후선택을 사용한다. Aquila도 범용 게이트 컴퓨터와 구분한다.

발전 방향: 원자 손실 감지·보충과 논리 연산 확장. Libra의 2028년 출시는 회사 목표.

- [Nature, 중성원자 오류 내성 아키텍처 실험](https://www.nature.com/articles/s41586-025-09848-5) — 2025-11-10
- [QuEra, 2028–2029년 로드맵](https://www.quera.com/press-releases/quera-unveils-gigaquop-class-fault-tolerant-roadmap-and-invites-organizations-to-co-design-quantum-applications) — 2026-06-25

### PsiQuantum — 2026-06-18

방식: 광자. 지역: 미국·호주·영국. 단계: 개발.

Omega 광자 칩셋의 구성 요소를 2025년 발표했다. 2026년에는 호주 Moreton Bay 시설을 착공했다. 광섬유로 많은 광자 칩을 연결하는 시스템을 개발 중이다.

대표 지표: 2026년 성과: 대규모 시설 착공

해석 범위: 시설 착공이나 부품 실증은 백만 큐비트 컴퓨터의 작동 실증이 아니다. 광자는 냉각이 필요 없다고 일반화할 수도 없다. 검출기와 장치 일부는 극저온 인프라를 사용한다.

발전 방향: 광자 손실 감소, 칩 제조·연결, 대규모 냉각 및 오류 정정 통합.

- [PsiQuantum, 호주 Moreton Bay 시설 착공](https://www.psiquantum.com/news-import/psiquantum-breaks-ground-in-australia-on-site-of-worlds-first-utility-scale-quantum-computer) — 2026-06-18
- [PsiQuantum, Omega 칩셋 발표](https://psi-quantum.squarespace.com/news-import/omega) — 2025-02-26
- [Nature, 제조 가능한 광자 양자컴퓨팅 플랫폼](https://www.nature.com/articles/s41586-025-08820-7) — 2025-02-26

### Microsoft — 2026-06-24

방식: 위상. 지역: 미국. 단계: 개발.

2025년 Majorana 1에 이어 2026년 Majorana 2와 긴 패리티 수명을 발표했다. 패리티는 전자 수의 홀짝 같은 성질이다. 위상 성질로 오류를 줄이는 큐비트를 목표로 한다.

대표 지표: Majorana 2 기술 사전논문: 약 20초 패리티 수명

해석 범위: 패리티 수명은 중첩을 유지하는 결맞음 시간과 같은 지표가 아니다. 2025년 실험의 위상 해석은 2026년 Nature 반론과 답변의 대상이다. 완성된 범용 위상 양자컴퓨터로 단정하지 않는다.

발전 방향: 위상 상태의 재현·검증, 여러 측정 방향과 논리 연산, 오류 내성 시제품.

- [Microsoft, Majorana 2 발표](https://quantum.microsoft.com/en-us/insights/blogs/majorana-2-scalable-quantum-processor) — 2026-06-02
- [20 Second Parity Lifetime: 기술 사전논문](https://arxiv.org/abs/2606.03884) — 2026-06-03
- [Nature, 위상 해석에 관한 데이터 재분석·반론](https://www.nature.com/articles/s41586-026-10567-8) — 2026-06-24
- [Nature, Microsoft 연구진의 답변](https://www.nature.com/articles/s41586-026-10568-7) — 2026-06-24

### D-Wave — 2025-05-20

방식: 어닐링. 지역: 캐나다·미국. 단계: 실증.

Advantage2 어닐링 시스템을 클라우드에서 제공한다고 발표했다. 문제를 에너지 지형으로 바꾸고 낮은 에너지의 답을 찾도록 양자 상태를 변화시킨다.

대표 지표: Advantage2: 물리 큐비트 4,400개 이상

해석 범위: 어닐링 장치의 4,400개와 범용 게이트 장치의 큐비트 수는 성능 순위로 비교할 수 없다. 상용 서비스 제공도 모든 최적화 문제에서 고전컴퓨터보다 빠르다는 증거가 아니다.

발전 방향: 노이즈 감소, 연결성 향상, 고전 알고리즘과의 결합 및 문제별 성능 검증.

- [D-Wave, Advantage2 일반 이용 개시](https://www.dwavequantum.com/company/newsroom/press-release/d-wave-announces-general-availability-of-advantage2-quantum-computer-its-most-advanced-and-performant-system/) — 2025-05-20
- [D-Wave 기술 지원: Advantage2 구성](https://support.dwavesys.com/hc/en-us/articles/32105885880087-D-Wave-s-Advantage2-Quantum-Computer-Now-Generally-Available) — 2025-05-20

### RIKEN·Fujitsu — 2025-04-23

방식: 초전도. 지역: 일본. 단계: 실증.

256큐비트 초전도 양자컴퓨터 개발을 발표했다. 냉동기 안에서 더 많은 큐비트를 냉각하고 조밀하게 연결하는 설계를 발전시켰다.

대표 지표: 발표된 장치: 물리 큐비트 256개

해석 범위: 같은 발표의 2026년 1,000큐비트 장치는 개발 목표다. 이 자료만으로 그 목표가 이미 달성됐다고 판단하지 않는다.

발전 방향: 고밀도 배선·열 설계, 오류 정정 연구, 고전·양자 하이브리드 플랫폼.

- [RIKEN, 256큐비트 개발 발표](https://www.riken.jp/en/news_pubs/news/2025/20250422_1/index.html) — 2025-04-23

### USTC·중국과학원 — 2025-03-05

방식: 초전도. 지역: 중국. 단계: 실증.

Zuchongzhi 3.0은 105개 물리 큐비트의 초전도 프로세서다. 연구진은 그중 83개를 사용하는 무작위 회로 샘플링 실험을 수행하고 원자료를 공개했다.

대표 지표: 실험: 83큐비트·32주기 무작위 회로 샘플링

해석 범위: 고전 계산 비용은 특정 알고리즘·가정에 따른 추정이다. 이 실험은 일반 업무나 유용한 산업 문제에서의 보편적 속도 향상을 뜻하지 않는다.

발전 방향: 게이트·측정 정확도, 더 복잡한 회로, 검증 가능한 벤치마크.

- [중국과학원, Zuchongzhi 3.0 실험 발표](https://english.cas.cn/head/202503/t20250305_903086.shtml) — 2025-03-05
- [USTC, 105큐비트 실험 원자료](https://quantum.ustc.edu.cn/node/1196) — 2025-02-10
- [Zuchongzhi 3.0 연구 논문](https://arxiv.org/abs/2412.11924) — 2024-12-16

### 연세대학교 — 2026-11-04

방식: 초전도. 지역: 한국. 단계: 실증.

2024년 도입한 IBM System One의 프로세서를 Nighthawk R2로 업그레이드한다고 공식 발표했다. 오류 정정과 AI·바이오 응용 연구를 확대한다.

대표 지표: Nighthawk R2: 프로그래머블 큐비트 120개

해석 범위: 전체 물리 소자를 합친 458개와 실제 연산에 쓰는 120개는 서로 다른 집계다. 한국 내 설치·활용은 국산 프로세서 개발과도 구분한다.

발전 방향: 실제 하드웨어를 이용한 오류 정정, 교육, 바이오 분야의 고전·양자 공동 연구.

- [연세대, Nighthawk R2 도입·가동식 공식 발표](https://www.yonsei.ac.kr/bbs/sc/50/944557/artclView.do) — 2026-11-04

### 한국표준과학연구원 KRISS — 2026-03-03

방식: 초전도. 지역: 한국. 단계: 개발.

KRISS는 2025년 20큐비트급 초전도 양자컴퓨팅 시스템의 클라우드 시연을 연구 성과로 보고했다. 2026년에는 양자 하드웨어·소프트웨어 기업을 지원하는 사업을 공고했다.

대표 지표: 기관이 보고한 성과: 20큐비트급 클라우드 시연

해석 범위: 시연 규모는 당시 성과다. 향후 더 큰 규모의 목표나 지원사업 공고를 새 프로세서의 완성으로 해석하지 않는다.

발전 방향: 국산 소자·제어·측정 기술, 시스템 통합, 연구 인프라와 산업 생태계.

- [KRISS, 2026년 양자전환 지원사업 공고](https://www.kriss.re.kr/board.es?act=view&bid=0002&list_no=63569&mid=a10503000000) — 2026-03-03
- [KRISS, 2025년 연구 성과 회고](https://www.kriss.re.kr/gallery.es?act=view&bid=0028&list_no=6422&mid=a10504000000) — 2026-01-06

## 재확인 메모

1. **IBM의 날짜 구분:** 2026-11-06 System Two 시카고 가동과 2026-08-19 모듈 냉각은 확인된 발표다. Starling의 200 논리 큐비트·1억 게이트·2029년 수치는 2025-06-10 로드맵의 미래 목표다. 새로운 냉각 모듈의 15 mK 미만은 초기 냉각 실험 온도이며 모든 장치에 보편적인 동작 온도가 아니다.
2. **Google:** 2024-12-09 Willow의 below-threshold QEC와 2026-01-13 동적 표면 부호 실험은 별개의 연구다. Quantum Echoes는 2025-10-22 발표한 특정 벤치마크 실험이며 산업적 효용을 그대로 주장하지 않았다.
3. **Quantinuum:** 2026-10-19 원문은 distance-7 color code에서 syndrome-extraction cycle당 논리 메모리 실패확률 약 5×10⁻⁶를 보고한다. 제목을 따라 “100만 번의 범용 계산 무오류”로 요약하면 틀린다. 논리 2큐비트 Clifford 게이트는 별도 실험이며 더 낮은 code distance를 사용했다.
4. **IonQ:** 2026-09-08 원문은 fabricated chips / first ions trapped / deliveries in 2027를 구분한다. “Superion 256이 지금 256개의 검증된 고성능 큐비트로 상용 운전 중”이라고 쓰지 않았다.
5. **QuEra 공동연구:** 논문은 2025-11-10 온라인 발표, Nature 649권 2026년 1월호 수록이다. 하버드에서 실험했다. 최대 96 논리 큐비트의 high-rate code 결과와 표면 부호 below-threshold 결과를 동일한 하나의 96큐비트 무후선택 오류 내성 계산으로 합치지 않았다. 후선택의 사용 여부는 논문 Methods에서 실험마다 달라진다.
6. **PsiQuantum:** 2025-02-26 Omega 논문 수치는 광자 검출에 조건부이며 손실을 포함하지 않는 항목들이 있다. 서로 다른 플랫폼의 게이트 정확도와 단순 비교하지 않았다. 2026-06-18 발표 본문의 착공일을 사용했다(페이지 상단은 17 Jun). 2027년 하반기는 cryoplant 인도 계획이며 완성된 양자컴퓨터 가동일이 아니다.
7. **Microsoft:** Majorana 2 발표 2026-06-02, 기술 사전논문 최초 제출 2026-06-02/수정 2026-06-03. 약 20초는 parity lifetime이며 T2 결맞음 시간과 동일시하지 않았다. 2026-06-24 Nature Matters Arising와 연구진 Reply를 함께 링크해 논쟁 중인 해석임을 표시했다. 반론은 앞선 InAs–Al 데이터에 대한 것으로, 모든 새 InAs–Pb 데이터가 반증됐다는 주장으로 확대하지 않았다.
8. **D-Wave:** Advantage2의 4,400+는 어닐링 장치의 물리 큐비트 수다. 상용 제공 사실과 특정 문제의 고전 대비 성능 주장은 별개다. D-Wave는 이후 게이트 방식도 개발하므로 “회사는 어닐링만 한다”라고 일반화하지 않았다.
9. **RIKEN/Fujitsu:** 공식 영문 페이지 날짜 2025-04-23을 사용했다(일문 발표 2025-04-22). 그 자료에 실린 2026년 1,000큐비트 목표를 달성 사실로 바꾸지 않았다.
10. **USTC:** 105개는 전체 프로세서, 83개는 대표 샘플링 실험에 사용한 수다. 고전 계산의 수십억 년 환산은 특정 알고리즘과 가정에 따른 추정이므로 생략했다.
11. **연세대:** 공식 2026-11-04 발표가 확인되어 예전 127큐비트 Eagle을 최신 장치로 쓰지 않았다. Nighthawk R2의 120개 programmable qubits와 전체 458개 물리 소자는 집계 범위가 다르다.
12. **KRISS:** 2026-01-06 기관 소식은 2025년 성과 중 20큐비트급 클라우드 시연을 직접 언급한다. 지원사업 공고는 2026-03-03이며 시연 또는 새 프로세서 출시 날짜가 아니다. 근거가 불충분한 50큐비트 목표의 달성 여부는 단정하지 않았다.

## 유지보수

수정 시 카드 날짜와 근거 링크를 함께 갱신하고, 미래 로드맵이 실제로 달성됐는지 별도로 확인한다. 날짜가 지난 계획도 후속 실증 근거가 없으면 자동으로 성과로 승격하지 않는다.
