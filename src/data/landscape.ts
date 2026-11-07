export interface ResearchLink { title: string; url: string; date: string; }
export interface Institution { id:string; name:string; category:string; region:string; date:string; status:'실증'|'개발'|'계획'; title:string; body:string; metric:string; caveat:string; direction:string; sources:ResearchLink[]; }
/* Primary-source research checked 2026-11-07. Numbers across unlike tasks are not rankings. */
export const landscape: Institution[] = [
  {
    id: 'ibm', name: 'IBM', category: '초전도', region: '미국', date: '2026-11-06', status: '실증',
    title: '운영 중인 장치에서, 모듈형 오류 정정으로',
    body: '시카고에 Nighthawk 기반 System Two를 가동했다고 발표했다. 2026년 8월에는 냉각 모듈 두 개를 연결해 15 mK 미만으로 냉각했다. 여러 칩을 함께 쓰기 위한 공학적 진전이다.',
    metric: '2029년 목표: 논리 큐비트 200개·게이트 1억 회',
    caveat: 'Starling 수치는 회사의 미래 목표다. 냉각 모듈 연결만으로 대규모 오류 내성 컴퓨터가 완성된 것은 아니다.',
    direction: 'qLDPC 오류 정정, 칩 사이 연결, 실시간 해독과 고성능 고전컴퓨터의 결합.',
    sources: [
      {title: 'IBM, 시카고 System Two 가동 발표', url: 'https://newsroom.ibm.com/2026-11-06-ibm-unveils-its-most-advanced-quantum-computer-in-chicago,-marking-a-milestone-for-illinoiss-quantum-future', date: '2026-11-06'},
      {title: 'IBM, 모듈형 극저온 시스템 연결', url: 'https://newsroom.ibm.com/2026-08-19-ibm-connects-its-first-modular-cryogenic-systems-in-milestone-toward-fault-tolerant-quantum-computing/', date: '2026-08-19'},
      {title: 'IBM Starling 아키텍처와 로드맵', url: 'https://www.ibm.com/quantum/blog/large-scale-ftqc', date: '2025-06-10'}
    ]
  },
  {
    id: 'google', name: 'Google Quantum AI', category: '초전도', region: '미국', date: '2026-01-13', status: '실증',
    title: '더 크게 보호할수록 오류가 줄어드는가?',
    body: 'Willow의 2024년 실험은 오류 정정에 쓰는 큐비트 격자를 키울수록 논리 오류가 줄어드는 모습을 보였다. 2026년에는 동적 표면 부호를 실험해 배선 제약과 특정 오류를 줄이는 길을 연구했다.',
    metric: 'Willow: 물리 큐비트 105개',
    caveat: 'Quantum Echoes의 속도 우위는 특정 벤치마크 회로에서의 결과다. 모든 계산이나 신약 개발이 그만큼 빨라졌다는 뜻이 아니다.',
    direction: '논리 오류의 지속적인 감소와 검증 가능한 양자 시뮬레이션.',
    sources: [
      {title: 'Google Research, 동적 표면 부호 실험', url: 'https://research.google/blog/dynamic-surface-codes-open-new-avenues-for-quantum-error-correction/', date: '2026-01-13'},
      {title: 'Google Research, Willow 오류 정정', url: 'https://research.google/blog/making-quantum-error-correction-work/', date: '2024-12-09'},
      {title: 'Google Research, Quantum Echoes 실험', url: 'https://research.google/blog/a-verifiable-quantum-advantage/', date: '2025-10-22'}
    ]
  },
  {
    id: 'quantinuum', name: 'Quantinuum', category: '이온트랩', region: '미국·영국', date: '2026-10-19', status: '실증',
    title: '개수와 함께, 연산의 정확도를 높이기',
    body: '98개 물리 큐비트를 가진 Helios를 2025년 출시했다. 2026년 10월에는 오류 정정 부호의 보호 정도를 키우며 논리 메모리 오류가 감소하는 실험을 발표했다.',
    metric: '보고된 논리 메모리 오류: 정정 주기당 약 5 × 10⁻⁶',
    caveat: '이 수치는 특정 메모리 실험의 주기당 오류다. 임의의 알고리즘을 100만 회 무오류로 실행했다는 뜻이나 모든 게이트의 오류율이 아니다.',
    direction: '이온을 이동시키는 구조와 유연한 오류 정정; Apollo는 2029년 목표.',
    sources: [
      {title: 'Quantinuum, 논리 메모리·게이트 오류 감소 실험', url: 'https://www.quantinuum.com/blog/quantinuum-closes-in-on-one-million-error-free-operations', date: '2026-10-19'},
      {title: 'Quantinuum, Helios 상용 출시', url: 'https://www.quantinuum.com/press-releases/quantinuum-announces-commercial-launch-of-new-helios-quantum-computer-that-offers-unprecedented-accuracy-to-enable-generative-quantum-ai-genqai', date: '2025-11-05'},
      {title: 'Helios 98큐비트 프로세서 기술 논문', url: 'https://arxiv.org/abs/2511.05465', date: '2025-11-07'}
    ]
  },
  {
    id: 'ionq', name: 'IonQ', category: '이온트랩', region: '미국·영국', date: '2026-09-08', status: '개발',
    title: '전자 제어와 반도체 제조로 확장하기',
    body: 'Superion 256 플랫폼을 발표하고, 칩 제작과 시제품의 첫 이온 포획을 보고했다. 전자 제어를 칩에 통합해 큰 시스템을 반복 생산하려는 접근이다.',
    metric: 'Superion 256: 고객 인도 목표 2027년',
    caveat: '제품 발표·첫 이온 포획은 256큐비트 전체의 알고리즘 성능 검증과 다르다. 회사 지표 #AQ도 논리 큐비트 개수가 아니다.',
    direction: '전자식 이온 제어, 칩 제조, qLDPC 오류 정정과 더 큰 프로세서.',
    sources: [
      {title: 'IonQ, Superion 256 발표와 개발 단계', url: 'https://www.ionq.com/news/ionq-launches-superion-product-line-industry-leading-upgradeable-platform-designed-to-scale-manufacturable-fault-tolerant-quantum-computing', date: '2026-09-08'},
      {title: 'IonQ 시스템 비교·지표 정의', url: 'https://www.ionq.com/quantum-systems/compare', date: '확인 2026-11-07'}
    ]
  },
  {
    id: 'quera', name: 'Harvard·MIT·QuEra', category: '중성원자', region: '미국', date: '2026-06-25', status: '실증',
    title: '레이저로 원자를 배열하고, 계산 중에 재사용',
    body: '하버드에서 수행한 연구는 최대 448개 원자 배열로 오류 정정, 논리 연산, 계산 중 원자 재사용 등 핵심 요소를 실험했다. QuEra의 Aquila는 256큐비트 아날로그 시뮬레이터다.',
    metric: '2025년 논문: 특정 부호에서 최대 96개 논리 큐비트 인코딩',
    caveat: '서로 다른 부호와 실험의 최대값을 합쳐 하나의 완성 장치로 읽으면 안 된다. 일부 결과는 오류가 검출된 실행을 제외하는 후선택을 사용한다. Aquila도 범용 게이트 컴퓨터와 구분한다.',
    direction: '원자 손실 감지·보충과 논리 연산 확장. Libra의 2028년 출시는 회사 목표.',
    sources: [
      {title: 'Nature, 중성원자 오류 내성 아키텍처 실험', url: 'https://www.nature.com/articles/s41586-025-09848-5', date: '2025-11-10'},
      {title: 'QuEra, 2028–2029년 로드맵', url: 'https://www.quera.com/press-releases/quera-unveils-gigaquop-class-fault-tolerant-roadmap-and-invites-organizations-to-co-design-quantum-applications', date: '2026-06-25'}
    ]
  },
  {
    id: 'psiquantum', name: 'PsiQuantum', category: '광자', region: '미국·호주·영국', date: '2026-06-18', status: '개발',
    title: '빛과 반도체 공정으로 큰 장치 만들기',
    body: 'Omega 광자 칩셋의 구성 요소를 2025년 발표했다. 2026년에는 호주 Moreton Bay 시설을 착공했다. 광섬유로 많은 광자 칩을 연결하는 시스템을 개발 중이다.',
    metric: '2026년 성과: 대규모 시설 착공',
    caveat: '시설 착공이나 부품 실증은 백만 큐비트 컴퓨터의 작동 실증이 아니다. 광자는 냉각이 필요 없다고 일반화할 수도 없다. 검출기와 장치 일부는 극저온 인프라를 사용한다.',
    direction: '광자 손실 감소, 칩 제조·연결, 대규모 냉각 및 오류 정정 통합.',
    sources: [
      {title: 'PsiQuantum, 호주 Moreton Bay 시설 착공', url: 'https://www.psiquantum.com/news-import/psiquantum-breaks-ground-in-australia-on-site-of-worlds-first-utility-scale-quantum-computer', date: '2026-06-18'},
      {title: 'PsiQuantum, Omega 칩셋 발표', url: 'https://psi-quantum.squarespace.com/news-import/omega', date: '2025-02-26'},
      {title: 'Nature, 제조 가능한 광자 양자컴퓨팅 플랫폼', url: 'https://www.nature.com/articles/s41586-025-08820-7', date: '2025-02-26'}
    ]
  },
  {
    id: 'microsoft', name: 'Microsoft', category: '위상', region: '미국', date: '2026-06-24', status: '개발',
    title: '위상 보호를 노리지만, 해석 검증이 중요',
    body: '2025년 Majorana 1에 이어 2026년 Majorana 2와 긴 패리티 수명을 발표했다. 패리티는 전자 수의 홀짝 같은 성질이다. 위상 성질로 오류를 줄이는 큐비트를 목표로 한다.',
    metric: 'Majorana 2 기술 사전논문: 약 20초 패리티 수명',
    caveat: '패리티 수명은 중첩을 유지하는 결맞음 시간과 같은 지표가 아니다. 2025년 실험의 위상 해석은 2026년 Nature 반론과 답변의 대상이다. 완성된 범용 위상 양자컴퓨터로 단정하지 않는다.',
    direction: '위상 상태의 재현·검증, 여러 측정 방향과 논리 연산, 오류 내성 시제품.',
    sources: [
      {title: 'Microsoft, Majorana 2 발표', url: 'https://quantum.microsoft.com/en-us/insights/blogs/majorana-2-scalable-quantum-processor', date: '2026-06-02'},
      {title: '20 Second Parity Lifetime: 기술 사전논문', url: 'https://arxiv.org/abs/2606.03884', date: '2026-06-03'},
      {title: 'Nature, 위상 해석에 관한 데이터 재분석·반론', url: 'https://www.nature.com/articles/s41586-026-10567-8', date: '2026-06-24'},
      {title: 'Nature, Microsoft 연구진의 답변', url: 'https://www.nature.com/articles/s41586-026-10568-7', date: '2026-06-24'}
    ]
  },
  {
    id: 'dwave', name: 'D-Wave', category: '어닐링', region: '캐나다·미국', date: '2025-05-20', status: '실증',
    title: '최적화 문제에 집중하는 다른 계산 방식',
    body: 'Advantage2 어닐링 시스템을 클라우드에서 제공한다고 발표했다. 문제를 에너지 지형으로 바꾸고 낮은 에너지의 답을 찾도록 양자 상태를 변화시킨다.',
    metric: 'Advantage2: 물리 큐비트 4,400개 이상',
    caveat: '어닐링 장치의 4,400개와 범용 게이트 장치의 큐비트 수는 성능 순위로 비교할 수 없다. 상용 서비스 제공도 모든 최적화 문제에서 고전컴퓨터보다 빠르다는 증거가 아니다.',
    direction: '노이즈 감소, 연결성 향상, 고전 알고리즘과의 결합 및 문제별 성능 검증.',
    sources: [
      {title: 'D-Wave, Advantage2 일반 이용 개시', url: 'https://www.dwavequantum.com/company/newsroom/press-release/d-wave-announces-general-availability-of-advantage2-quantum-computer-its-most-advanced-and-performant-system/', date: '2025-05-20'},
      {title: 'D-Wave 기술 지원: Advantage2 구성', url: 'https://support.dwavesys.com/hc/en-us/articles/32105885880087-D-Wave-s-Advantage2-Quantum-Computer-Now-Generally-Available', date: '2025-05-20'}
    ]
  },
  {
    id: 'riken', name: 'RIKEN·Fujitsu', category: '초전도', region: '일본', date: '2025-04-23', status: '실증',
    title: '칩을 키우면서 냉각·배선 문제 해결',
    body: '256큐비트 초전도 양자컴퓨터 개발을 발표했다. 냉동기 안에서 더 많은 큐비트를 냉각하고 조밀하게 연결하는 설계를 발전시켰다.',
    metric: '발표된 장치: 물리 큐비트 256개',
    caveat: '같은 발표의 2026년 1,000큐비트 장치는 개발 목표다. 이 자료만으로 그 목표가 이미 달성됐다고 판단하지 않는다.',
    direction: '고밀도 배선·열 설계, 오류 정정 연구, 고전·양자 하이브리드 플랫폼.',
    sources: [
      {title: 'RIKEN, 256큐비트 개발 발표', url: 'https://www.riken.jp/en/news_pubs/news/2025/20250422_1/index.html', date: '2025-04-23'}
    ]
  },
  {
    id: 'ustc', name: 'USTC·중국과학원', category: '초전도', region: '중국', date: '2025-03-05', status: '실증',
    title: '특정 샘플링 문제에서 계산 우위 시험',
    body: 'Zuchongzhi 3.0은 105개 물리 큐비트의 초전도 프로세서다. 연구진은 그중 83개를 사용하는 무작위 회로 샘플링 실험을 수행하고 원자료를 공개했다.',
    metric: '실험: 83큐비트·32주기 무작위 회로 샘플링',
    caveat: '고전 계산 비용은 특정 알고리즘·가정에 따른 추정이다. 이 실험은 일반 업무나 유용한 산업 문제에서의 보편적 속도 향상을 뜻하지 않는다.',
    direction: '게이트·측정 정확도, 더 복잡한 회로, 검증 가능한 벤치마크.',
    sources: [
      {title: '중국과학원, Zuchongzhi 3.0 실험 발표', url: 'https://english.cas.cn/head/202503/t20250305_903086.shtml', date: '2025-03-05'},
      {title: 'USTC, 105큐비트 실험 원자료', url: 'https://quantum.ustc.edu.cn/node/1196', date: '2025-02-10'},
      {title: 'Zuchongzhi 3.0 연구 논문', url: 'https://arxiv.org/abs/2412.11924', date: '2024-12-16'}
    ]
  },
  {
    id: 'yonsei', name: '연세대학교', category: '초전도', region: '한국', date: '2026-11-04', status: '실증',
    title: '국내에서도 실제 장치로 연구·교육',
    body: '2024년 도입한 IBM System One의 프로세서를 Nighthawk R2로 업그레이드한다고 공식 발표했다. 오류 정정과 AI·바이오 응용 연구를 확대한다.',
    metric: 'Nighthawk R2: 프로그래머블 큐비트 120개',
    caveat: '전체 물리 소자를 합친 458개와 실제 연산에 쓰는 120개는 서로 다른 집계다. 한국 내 설치·활용은 국산 프로세서 개발과도 구분한다.',
    direction: '실제 하드웨어를 이용한 오류 정정, 교육, 바이오 분야의 고전·양자 공동 연구.',
    sources: [
      {title: '연세대, Nighthawk R2 도입·가동식 공식 발표', url: 'https://www.yonsei.ac.kr/bbs/sc/50/944557/artclView.do', date: '2026-11-04'}
    ]
  },
  {
    id: 'kriss', name: '한국표준과학연구원 KRISS', category: '초전도', region: '한국', date: '2026-03-03', status: '개발',
    title: '국산 시스템과 소자·제어 기술 쌓기',
    body: 'KRISS는 2025년 20큐비트급 초전도 양자컴퓨팅 시스템의 클라우드 시연을 연구 성과로 보고했다. 2026년에는 양자 하드웨어·소프트웨어 기업을 지원하는 사업을 공고했다.',
    metric: '기관이 보고한 성과: 20큐비트급 클라우드 시연',
    caveat: '시연 규모는 당시 성과다. 향후 더 큰 규모의 목표나 지원사업 공고를 새 프로세서의 완성으로 해석하지 않는다.',
    direction: '국산 소자·제어·측정 기술, 시스템 통합, 연구 인프라와 산업 생태계.',
    sources: [
      {title: 'KRISS, 2026년 양자전환 지원사업 공고', url: 'https://www.kriss.re.kr/board.es?act=view&bid=0002&list_no=63569&mid=a10503000000', date: '2026-03-03'},
      {title: 'KRISS, 2025년 연구 성과 회고', url: 'https://www.kriss.re.kr/gallery.es?act=view&bid=0028&list_no=6422&mid=a10504000000', date: '2026-01-06'}
    ]
  }
];
