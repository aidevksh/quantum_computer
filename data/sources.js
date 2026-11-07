/* Primary and institution-authored references, checked on 2026-11-07.
   Detailed claim mappings and model assumptions are recorded in docs/research-*.md. */
window.SOURCES = [
  {
    id: 'feynman', title: 'The Feynman Lectures on Physics, III-1: Quantum Behavior',
    organization: 'Caltech', date: '상시 자료',
    url: 'https://www.feynmanlectures.caltech.edu/III_01.html',
    note: '이중 슬릿에서 점으로 검출되는 입자와 확률 진폭의 간섭, 경로 정보가 남을 때의 변화를 설명합니다.'
  },
  {
    id: 'born', title: 'Quantum information — Single systems',
    organization: 'IBM Quantum Learning', date: '상시 자료',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information',
    note: '확률 진폭의 정규화, 크기의 제곱으로 측정 확률을 구하는 Born 규칙과 위상에 따른 연산 차이를 설명합니다.'
  },
  {
    id: 'photon', title: 'Einstein and the Photoelectric Effect',
    organization: 'OpenStax · Rice University', date: '상시 자료',
    url: 'https://openstax.org/books/physics/pages/21-2-einstein-and-the-photoelectric-effect',
    note: '광자 한 개의 에너지가 E = hf이며 진동수에 비례한다는 관계를 설명합니다.'
  },
  {
    id: 'qubit', title: 'Lecture 1: Bits and Qubits',
    organization: 'University of Cambridge · Steven Herbert', date: '2024년 강의',
    url: 'https://www.cl.cam.ac.uk/teaching/2324/QuantComp/Quantum_Computing_Lecture_1_2024.pdf',
    note: '비트와 큐비트의 차이, 중첩 및 한 번의 측정으로 상태의 모든 진폭을 읽을 수 없는 이유를 소개합니다.'
  },
  {
    id: 'bloch', title: 'Bloch sphere',
    organization: 'IBM Quantum Learning', date: '상시 자료',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/general-formulation-of-quantum-information/density-matrices/bloch-sphere',
    note: '한 큐비트의 θ·φ 표현과 구의 좌표, 전역 위상 생략, 순수 상태와 혼합 상태의 차이를 설명합니다.'
  },
  {
    id: 'gates', title: 'Quantum bits, gates, and circuits',
    organization: 'IBM Quantum Learning · Kifumi Numata', date: '2024-04-19',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/utility-scale-quantum-computing/bits-gates-and-circuits',
    note: 'H와 위상 게이트, CNOT, 측정, 회로 깊이 및 큐비트를 제어하는 회로 모형을 설명합니다.'
  },
  {
    id: 'interference', title: 'Quantum Coins — Superposition and interference',
    organization: 'IBM Quantum Learning', date: '상시 자료',
    url: 'https://quantum.cloud.ibm.com/learning/en/modules/quantum-mechanics/superposition-with-qiskit',
    note: '동전 비유의 한계와 H 연산을 통한 간섭을 설명하며, 교재의 H–P–H 확률식은 이 연산 규칙으로 직접 계산했습니다.'
  },
  {
    id: 'grover', title: 'Grover’s algorithm',
    organization: 'IBM Quantum Learning', date: '상시 자료',
    url: 'https://quantum.cloud.ibm.com/learning/en/modules/computer-science/grovers',
    note: '검사 함수인 오라클, 진폭 증폭, 적절한 반복 횟수와 비구조화 탐색의 제곱근 질의 가속을 설명합니다.'
  },
  {
    id: 'groverpaper', title: 'A fast quantum mechanical algorithm for database search',
    organization: 'Lov K. Grover · Bell Labs', date: '1996-05-29 · 최초 제출',
    url: 'https://arxiv.org/abs/quant-ph/9605043',
    note: '위상 조작과 평균에 대한 반사를 이용해 구조 없는 탐색의 질의 수를 줄이는 원논문입니다.'
  },
  {
    id: 'entanglement', title: 'What Is Entanglement and Why Is It Important?',
    organization: 'Caltech Science Exchange', date: '상시 자료',
    url: 'https://scienceexchange.caltech.edu/topics/quantum-science-explained/entanglement',
    note: '여러 측정 방향에서 드러나는 양자 상관관계와 고전적 상관의 차이, 초광속 통신에 관한 오해를 설명합니다.'
  },
  {
    id: 'bell', title: 'Entanglement and correlations',
    organization: 'Microsoft Learn · Azure Quantum', date: '상시 자료',
    url: 'https://learn.microsoft.com/en-us/azure/quantum/concepts-entanglement',
    note: 'H와 CNOT로 Bell 상태를 준비하는 과정과 00·11의 측정 확률, 분리 가능한 상태의 정의를 설명합니다.'
  },
  {
    id: 'nosignaling', title: 'Lecture 4: Important Concepts in Quantum Mechanics',
    organization: 'University of Cambridge', date: '2026년 강의',
    url: 'https://www.cl.cam.ac.uk/teaching/2526/QuantComp/Quantum_Computing_Lecture_4_2026.pdf',
    note: '상대방의 국소 연산으로 자신의 측정 통계를 바꿀 수 없다는 no-signalling 원리와 상태 복제의 한계를 설명합니다.'
  },
  {
    id: 'multiqubit', title: 'Quantum information — Multiple systems',
    organization: 'IBM Quantum Learning', date: '상시 자료',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/multiple-systems/quantum-information',
    note: '여러 큐비트의 공동 상태, n자리 기준 비트열과 복소수 진폭, 전체 및 부분 측정 규칙을 설명합니다.'
  },
  {
    id: 'holevo', title: 'Chapter 5: Quantum Information Theory',
    organization: 'Caltech · John Preskill', date: '상시 자료',
    url: 'https://www.preskill.caltech.edu/ph229/notes/chap5.pdf',
    note: '양자 상태에 연속적인 진폭을 쓸 수 있다는 사실이 임의의 고전 정보를 무제한 읽을 수 있다는 뜻은 아님을 Holevo 경계로 설명합니다.'
  },
  {
    id: 'qec', title: 'Error correction II: When is error correction the right tool?',
    organization: 'IBM Quantum Learning', date: '상시 자료',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/tools-for-quantum-advantage/error-correction-ii',
    note: '물리·논리 큐비트, 비트·위상 오류, 신드롬과 고전 해독, 오류정정에 필요한 자원을 설명합니다.'
  },
  {
    id: 'willow', title: 'Quantum error correction below the surface code threshold',
    organization: 'Google Quantum AI and Collaborators · Nature', date: '2024-12-09 · 온라인 발표',
    url: 'https://www.nature.com/articles/s41586-024-08449-y',
    note: '오류정정 부호를 키울수록 논리 오류가 줄어든 양자 메모리 실험이며, 대규모 범용 계산의 완성을 뜻하지 않습니다.'
  },
  {
    id: 'noise', title: 'Quantum channels',
    organization: 'IBM Quantum Learning', date: '상시 자료',
    url: 'https://learning.quantum.ibm.com/course/general-formulation-of-quantum-information/quantum-channels',
    note: '환경과의 상호작용에 따른 위상 감쇠와 진폭 감쇠를 설명하며, 교재의 지수 감쇠식은 설명용 모형입니다.'
  },
  {
    id: 'kelvin', title: 'Kelvin: Introduction',
    organization: 'NIST', date: '2018-05-14 · 최초 게시',
    url: 'https://www.nist.gov/si-redefinition/kelvin-introduction',
    note: '절대온도 켈빈, 정확한 0 K = −273.15°C 관계와 절대영도에도 남을 수 있는 양자적 영점운동을 설명합니다.'
  },
  {
    id: 'zero', title: 'About Cryogenics',
    organization: 'NIST', date: '2016-09-07 · 최초 게시',
    url: 'https://www.nist.gov/mml/acmd/cryogenic-technologies-project/about-cryogenics',
    note: '극저온의 뜻과 절대영도에 접근하는 냉각, 정확한 절대영도에 도달할 수 없다는 한계를 설명합니다.'
  },
  {
    id: 'ibmtemp', title: 'How to test a quantum computer chip',
    organization: 'IBM Research', date: '2024-12-18',
    url: 'https://research.ibm.com/blog/ibm-quantum-characterization-lab-tour',
    note: '초전도 양자칩을 검사하는 희석냉동기와 약 15 mK의 냉각 사례를 소개합니다.'
  },
  {
    id: 'iontemp', title: 'Integrated stabilized laser chips performing operations on a room-temperature trapped-ion qubit',
    organization: 'University of California, Santa Barbara', date: '2026-03-30',
    url: 'https://news.ucsb.edu/2026/022479/researchers-demonstrate-integrated-stabilized-laser-chips-performing-clock-and-quantum',
    note: '이온트랩 장치의 상온 설계 사례이며, 레이저로 냉각하는 이온의 운동 온도와 주변 장치의 온도를 구분해야 합니다.'
  },
  {
    id: 'neutraltemp', title: 'Using Neutral-Atom Arrays to Build Quantum Computers',
    organization: 'QuEra Computing', date: '상시 자료',
    url: 'https://www.quera.com/neutral-atom-platform',
    note: '광집게로 원자를 배열하고 레이저 냉각하는 방식과 희석냉동기 없이 원자계를 제어하는 환경을 설명합니다.'
  },
  {
    id: 'photonhardware', title: 'Large cryogenic plant for PsiQuantum in Australia',
    organization: 'Linde Engineering', date: '2025-05-08',
    url: 'https://www.linde-engineering.com/news-and-events/press-releases/2025/linde-engineering-to-deliver-large-cryogenic-plant-to-psiquantum-in-australia',
    note: '광자 방식도 장치 일부에 극저온 설비를 쓰는 사례로, PsiQuantum의 약 4 K 냉각 설비 공급 계획을 설명합니다.'
  },
  {
    id: 'thermal', title: 'Thermal and Residual Excited-State Population in a 3D Transmon Qubit',
    organization: 'X. Y. Jin et al. · Physical Review Letters', date: '2015-06-15',
    url: 'https://doi.org/10.1103/PhysRevLett.114.240501',
    note: '열평형에서의 두 준위 들뜸 확률과 실제 장치의 잔류 들뜸을 구별하므로 온도 계산값을 전체 오류율로 읽으면 안 됩니다.'
  },
  {
    id: 'simulation', title: 'Simulating nature',
    organization: 'IBM Quantum Learning', date: '상시 자료',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/quantum-computing-in-practice/simulating-nature',
    note: '분자와 물질을 양자 장치로 모사하는 목적, 상태 준비·시간 변화·측정으로 이어지는 계산 절차를 설명합니다.'
  },
  {
    id: 'shor', title: 'Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer',
    organization: 'Peter W. Shor · AT&T Research', date: '1995-08-30 · 최초 제출',
    url: 'https://arxiv.org/abs/quant-ph/9508027',
    note: '인수분해와 이산로그를 효율적으로 푸는 이론적 알고리즘이며, 모든 계산이나 모든 암호에 적용되는 가속은 아닙니다.'
  },
  {
    id: 'resources', title: 'Quantum Computing: Federal Actions Needed to Prepare for Emerging Cyber Threat',
    organization: 'U.S. Government Accountability Office', date: '2026-10-06',
    url: 'https://www.gao.gov/products/gao-27-108740',
    note: '현재 장치가 실사용 공개키 암호를 해독하지 못하고 있으며 충분한 장치의 등장 시점과 자원에 불확실성이 있음을 설명합니다.'
  },
  {
    id: 'nisq', title: 'Quantum Computing in the NISQ era and beyond',
    organization: 'John Preskill · Quantum', date: '2018-08-06',
    url: 'https://doi.org/10.22331/q-2018-08-06-79',
    note: 'NISQ라는 용어의 배경과 잡음이 있는 중간 규모 장치의 가능성·제약을 논의하는 논문으로 최신 제품 목록의 근거는 아닙니다.'
  },
  {
    id: 'pqc', title: 'NIST Releases First 3 Finalized Post-Quantum Encryption Standards',
    organization: 'NIST', date: '2024-08-13',
    url: 'https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards',
    note: '기존 컴퓨터에서 사용하는 첫 세 최종 포스트양자암호 표준과 키 설정·전자서명 알고리즘의 구분을 발표합니다.'
  },
  {
    id: 'constants', title: 'CODATA Recommended Values of the Fundamental Physical Constants: 2022',
    organization: 'NIST · SP 961', date: '2024-05',
    url: 'https://physics.nist.gov/cuu/pdf/wall_2022.pdf',
    note: '온도 실험 계산에 사용한 플랑크 상수 h와 볼츠만 상수 kB의 정확한 SI 값을 제공합니다.'
  },
  {
    id: 'qecintro', title: 'Correcting quantum errors: Introduction',
    organization: 'IBM Quantum Learning', date: '상시 자료',
    url: 'https://quantum.cloud.ibm.com/learning/en/courses/foundations-of-quantum-error-correction/correcting-quantum-errors/introduction',
    note: '미지의 양자 상태를 단순 복사하지 않고 여러 큐비트에 인코딩하여 오류를 교정하는 원리를 소개합니다.'
  },
  {
    id: 'fridge', title: 'Quantum Computing — CERN lecture',
    organization: 'IBM Research · Ivano Tavernelli', date: '2018년 강연',
    url: 'https://indico.cern.ch/event/719844/contributions/3019718/attachments/1749768/2835637/CERN_Tavernelli4_l.pdf',
    note: '여러 단계로 온도가 낮아지는 초전도 양자컴퓨터 냉동기 개념도를 제공하며 각 단계 온도는 장치마다 다릅니다.'
  }
];
