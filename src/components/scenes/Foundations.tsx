import { useId } from 'react';
import type { ReactNode } from 'react';
import type { FilmCue } from '../ConceptFilm';

type Props = { progress: number };
const C = { mint: '#8be3c5', gold: '#f0c77b', purple: '#b8a8ed', white: '#f3f8f5', muted: '#98b7b1', line: '#254a49', blue: '#82b8eb' };
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const phase = (t: number, from: number, to: number) => clamp((t - from) / (to - from));
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const curve = (f: (x: number) => number, x0: number, x1: number, y0: number, width: number, amplitude: number, count = 160) => Array.from({ length: count + 1 }, (_, index) => {
  const u = index / count;
  return `${index ? 'L' : 'M'}${(x0 + width * u).toFixed(2)},${(y0 - amplitude * f(lerp(x0, x1, u))).toFixed(2)}`;
}).join(' ');

function Diagram({ label, children }: { label: string; children: ReactNode }) {
  const patternId = useId().replace(/:/g, "");
  return <svg viewBox="0 0 900 440" role="img" aria-label={label} className="film-scene" preserveAspectRatio="xMidYMid meet"><defs><pattern id={`grid-${patternId}`} width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.8" fill={C.line} /></pattern></defs><rect width="900" height="440" fill={`url(#grid-${patternId})`} />{children}</svg>;
}
function Text({ x, y, children, color = C.muted, size = 18, anchor = 'start', opacity = 1 }: { x: number; y: number; children: ReactNode; color?: string; size?: number; anchor?: 'start' | 'middle' | 'end'; opacity?: number }) {
  return <text x={x} y={y} fill={color} fontSize={size} textAnchor={anchor} opacity={opacity} fontFamily="system-ui, sans-serif">{children}</text>;
}
function Formula({ x, y, children, color = C.white, size = 29, opacity = 1 }: { x: number; y: number; children: ReactNode; color?: string; size?: number; opacity?: number }) {
  return <text x={x} y={y} fill={color} fontSize={size} textAnchor="middle" opacity={opacity} fontFamily="Georgia, 'Times New Roman', serif">{children}</text>;
}
function Axis({ x1, x2, y, label }: { x1: number; x2: number; y: number; label?: string }) {
  return <g><path d={`M${x1} ${y}H${x2}`} stroke={C.line} strokeWidth="2" /><path d={`M${x2 - 6} ${y - 4}L${x2} ${y}L${x2 - 6} ${y + 4}`} fill="none" stroke={C.muted} />{label && <Text x={x2} y={y + 22} anchor="end" size={15}>{label}</Text>}</g>;
}

export function WaveScene({ progress: t }: Props) {
  const merge = ease(phase(t, .24, .56));
  const squared = ease(phase(t, .56, .78));
  const detection = phase(t, .77, 1);
  const travel = Math.min(t, .60) * 15;
  const yA = lerp(130, 195, merge), yB = lerp(270, 195, merge);
  const envelope = (x: number) => Math.exp(-(((x - 320) / 185) ** 2) / 2);
  const a = (x: number) => envelope(x) * Math.sin((x - 80) / 24 - travel);
  const b = (x: number) => envelope(x) * Math.sin((x - 80) / 24 - travel + .85);
  const sumAt = (x: number) => .5 * (a(x) + b(x));
  const pathA = curve(a, 80, 560, yA, 480, 36);
  const pathB = curve(b, 80, 560, yB, 480, 36);
  const sum = curve(sumAt, 80, 560, 195, 480, 72);
  const density = (x: number) => sumAt(80 + (x - 625) / 230 * 480) ** 2;
  const pPath = curve(density, 625, 855, 330, 230, 150);
  const count = Math.floor(detection * 110);
  const weights = Array.from({ length: 231 }, (_, index) => density(625 + index));
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
  const dots = Array.from({ length: count }, (_, index) => {
    const pick = ((index * .61803398875 + .19) % 1) * weightSum;
    let accumulated = 0, bin = 0;
    for (; bin < weights.length - 1; bin++) { accumulated += weights[bin]; if (accumulated >= pick) break; }
    return { x: 625 + bin, y: 96 + ((index * 43) % 105), opacity: .8 };
  });
  return <Diagram label="두 확률 진폭의 파동이 합쳐지고 그 크기의 제곱이 검출 확률 분포가 되는 과정">
    <Text x={65} y={44} color={C.white} size={21}>먼저 파동처럼 더하고, 그다음 확률로 바꿉니다.</Text>
    <Text x={65} y={77} size={15}>ψ는 확률 진폭 · 세로 높이는 개념적인 진폭, 가로축은 스크린 위치</Text>
    <Axis x1={70} x2={565} y={195} label="위치 x" />
    <g opacity={1 - squared * .45}><path d={pathA} fill="none" stroke={C.mint} strokeWidth="3.5" /><path d={pathB} fill="none" stroke={C.gold} strokeWidth="3.5" /></g>
    <path d={sum} fill="none" stroke={C.purple} strokeWidth="4" opacity={merge} />
    <Text x={80} y={110} color={C.mint} opacity={1 - merge}>경로 1 · ψ₁</Text><Text x={80} y={316} color={C.gold} opacity={1 - merge}>경로 2 · ψ₂</Text>
    <Formula x={320} y={370} color={C.purple} opacity={merge} size={28}>ψ합 = ψ₁ + ψ₂</Formula>
    <path d="M578 195H610M602 187L610 195L602 203" stroke={C.purple} strokeWidth="2.5" fill="none" opacity={squared} />
    <g opacity={squared}><rect x="624" y="88" width="232" height="124" rx="9" fill="#193b3b" />{dots.map((dot, index) => <circle key={index} cx={dot.x} cy={dot.y} r="2" fill={C.gold} opacity={dot.opacity} />)}<Text x={740} y={75} anchor="middle" size={16}>점 하나씩 검출</Text><Axis x1={625} x2={855} y={330} label="위치 x" /><path d={pPath} fill="none" stroke={C.mint} strokeWidth="3" /><Formula x={740} y={380} color={C.mint} size={24}>P(x) ∝ |ψ합|²</Formula></g>
    <Text x={450} y={421} anchor="middle" size={15}>파동 높이가 음수여도 확률은 음수가 아닙니다. 점들은 분포를 설명하는 도식입니다.</Text>
  </Diagram>;
}

export function QubitScene({ progress: t }: Props) {
  const theta = ease(phase(t, .06, .48)) * Math.PI / 3;
  const alpha = Math.cos(theta), beta = Math.sin(theta);
  const square = ease(phase(t, .48, .78));
  const sample = phase(t, .8, 1);
  const cx = 215, cy = 320, r = 180;
  const x = cx + r * alpha, y = cy - r * beta;
  const marker = useId().replace(/:/g, '');
  return <Diagram label="두 기준 상태를 축으로 놓고 상태 벡터의 성분 알파와 베타를 제곱하여 측정 확률을 얻는 과정">
    <defs><marker id={`qubit-arrow-${marker}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill={C.white} /></marker></defs>
    <Text x={65} y={44} color={C.white} size={21}>상태의 두 성분을, 두 결과의 확률로.</Text><Text x={65} y={76} size={15}>실수 진폭인 한 단면만 그린 상태 지도입니다. 입자의 실제 위치가 아닙니다.</Text>
    <path d={`M${cx} ${cy - r}A${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={C.line} strokeWidth="2" strokeDasharray="5 6" />
    <path d={`M${cx} ${cy}H${cx + r + 35}M${cx} ${cy}V${cy - r - 20}`} stroke={C.line} strokeWidth="2" />
    <Formula x={cx + r + 30} y={cy + 32} size={24} color={C.mint}>|0⟩</Formula><Formula x={cx} y={cy - r - 31} size={24} color={C.gold}>|1⟩</Formula>
    <line x1={cx} y1={cy} x2={x} y2={y} stroke={C.white} strokeWidth="4" markerEnd={`url(#qubit-arrow-${marker})`} />
    <line x1={x} y1={y} x2={x} y2={cy} stroke={C.mint} strokeWidth="2" strokeDasharray="5 5" /><line x1={x} y1={y} x2={cx} y2={y} stroke={C.gold} strokeWidth="2" strokeDasharray="5 5" />
    <path d={`M${cx} ${cy}H${x}`} stroke={C.mint} strokeWidth="5" /><path d={`M${cx} ${cy}V${y}`} stroke={C.gold} strokeWidth="5" />
    <circle cx={x} cy={y} r="5" fill={C.white} />
    <Formula x={cx + (x - cx) / 2} y={cy + 30} size={25} color={C.mint}>α = {alpha.toFixed(2)}</Formula><Text x={cx - 17} y={cy - (cy - y) / 2} anchor="end" color={C.gold} size={22}>β</Text>
    <g opacity={square}><rect x="550" y="115" width="130" height="130" fill="none" stroke={C.mint} strokeWidth="2" /><rect x="550" y={245 - alpha ** 2 * 130} width="130" height={alpha ** 2 * 130} fill={C.mint} opacity=".35" /><rect x="720" y="115" width="130" height="130" fill="none" stroke={C.gold} strokeWidth="2" /><rect x="720" y={245 - beta ** 2 * 130} width="130" height={beta ** 2 * 130} fill={C.gold} opacity=".35" /><Formula x={615} y={282} size={26} color={C.mint}>|α|² = {(alpha ** 2 * 100).toFixed(0)}%</Formula><Formula x={785} y={282} size={26} color={C.gold}>|β|² = {(beta ** 2 * 100).toFixed(0)}%</Formula><Text x={700} y={314} anchor="middle" size={17}>두 확률의 합 = 100%</Text></g>
    <g opacity={sample}><Text x={700} y={341} anchor="middle" color={C.white} size={16}>독립 시행의 예시 · 배치는 도식</Text>{Array.from({ length: Math.floor(sample * 24) }, (_, index) => <rect key={index} x={553 + index % 12 * 24} y={355 + Math.floor(index / 12) * 26} width="18" height="18" rx="3" fill={index % 4 === 0 ? C.mint : C.gold} />)}</g>
    <Formula x={310} y={390} color={C.white} size={26}>|ψ⟩ = α|0⟩ + β|1⟩</Formula><Text x={450} y={425} anchor="middle" size={15}>이 진폭 평면의 각도는 θ/2 · 아래 블로흐 구의 각도는 θ · 벡터 길이는 1</Text>
  </Diagram>;
}

export function InterferenceScene({ progress: t }: Props) {
  const prepared = ease(phase(t, .02, .22));
  const phi = ease(phase(t, .25, .70)) * Math.PI;
  const mixed = ease(phase(t, .65, .87));
  const p0 = Math.cos(phi / 2) ** 2, p1 = Math.sin(phi / 2) ** 2;
  const cx = 270, cy = 225, r = 95;
  const x2 = cx + Math.cos(phi) * r, y2 = cy - Math.sin(phi) * r;
  const sx = r * (1 + Math.cos(phi)), sy = -r * Math.sin(phi);
  const label = phi < .1 ? '같은 방향: 더해집니다.' : phi > Math.PI - .1 ? '반대 방향: 상쇄됩니다.' : '방향 차이가 결과 확률을 바꿉니다.';
  return <Diagram label="하다마드 위상 하다마드 회로에서 두 복소수 진폭의 방향이 달라지고 합과 차가 출력 확률을 바꾸는 과정">
    <Text x={65} y={44} color={C.white} size={21}>보이지 않던 위상 차이를, 보이는 확률로.</Text>
    <g transform="translate(80 85)"><Formula x={0} y={23} size={25}>|0⟩</Formula><path d="M26 15H610" stroke={C.line} strokeWidth="2" />{['H', 'P(φ)', 'H'].map((gate, index) => <g key={gate + index}><rect x={100 + index * 170} y="-6" width="70" height="44" rx="7" fill={index === 1 ? '#403a5a' : '#264d46'} stroke={index === 1 ? C.purple : C.mint} strokeWidth={index === 2 ? 1 + mixed * 2 : 2} opacity={index === 0 ? 1 : index === 1 ? prepared : mixed} /><Formula x={135 + index * 170} y={23} size={23} opacity={index === 0 ? 1 : index === 1 ? prepared : mixed}>{gate}</Formula></g>)}<Text x={660} y={21} size={18}>측정</Text></g>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.line} strokeWidth="2" /><path d={`M${cx - r - 20} ${cy}H${cx + r + 20}M${cx} ${cy - r - 20}V${cy + r + 20}`} stroke={C.line} strokeWidth="1" />
    <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={C.mint} strokeWidth="4" opacity={prepared} />
    <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={C.gold} strokeWidth="4" opacity={prepared} />
    <circle cx={x2} cy={y2} r="5" fill={C.gold} opacity={prepared} />
    <line x1={cx} y1={cy} x2={cx + sx} y2={cy + sy} stroke={C.purple} strokeWidth="4" opacity={mixed} />
    <Text x={140} y={365} size={18} color={C.purple}>{label}</Text><Formula x={270} y={403} size={26} color={C.gold}>φ = {(phi / Math.PI * 180).toFixed(0)}°</Formula>
    <g opacity={mixed}><path d="M470 225H515M506 217L515 225L506 233" fill="none" stroke={C.purple} strokeWidth="2" /><Text x={660} y={175} color={C.white} anchor="middle" size={18}>마지막 H 후 확률</Text>{[p0, p1].map((p, index) => <g key={index}><Text x={557} y={220 + index * 75} size={22} color={index ? C.gold : C.mint}>{index}</Text><rect x="590" y={200 + index * 75} width="215" height="26" rx="4" fill="#254542" /><rect x="590" y={200 + index * 75} width={215 * p} height="26" rx="4" fill={index ? C.gold : C.mint} /><Text x={865} y={221 + index * 75} anchor="end" color={C.white} size={19}>{(p * 100).toFixed(0)}%</Text></g>)}<Formula x={692} y={374} size={25} color={C.mint}>P(0) = |1 + eⁱᶲ|²/4</Formula><Formula x={692} y={411} size={24} color={C.gold}>P(1) = |1 − eⁱᶲ|²/4</Formula></g>
  </Diagram>;
}

export function BellScene({ progress: t }: Props) {
  const split = ease(phase(t, .12, .42));
  const link = ease(phase(t, .45, .70));
  const measured = phase(t, .75, 1);
  const nodes = [{ label: '00', x: 180, y: 190 }, { label: '01', x: 650, y: 190 }, { label: '10', x: 180, y: 320 }, { label: '11', x: 650, y: 320 }];
  const bar00 = lerp(1, .5, split), bar10 = .5 * split * (1 - link), bar11 = .5 * split * link;
  const probabilities = [bar00, 0, bar10, bar11];
  const moverX = lerp(180, 650, link);
  return <Diagram label="하나의 공동 상태가 하다마드와 제어 반전 연산을 거쳐 00과 11의 벨 중첩이 되는 과정">
    <Text x={65} y={44} color={C.white} size={21}>두 큐비트를, 하나의 공동 상태로 설명합니다.</Text>
    <Formula x={450} y={93} size={29}>{t < .12 ? '|00⟩' : t < .42 ? `${Math.sqrt(bar00).toFixed(2)}|00⟩ + ${Math.sqrt(bar10).toFixed(2)}|10⟩` : t < .45 ? '(|00⟩ + |10⟩) / √2' : t < .70 ? `${Math.sqrt(bar00).toFixed(2)}|00⟩ + ${Math.sqrt(bar10).toFixed(2)}|10⟩ + ${Math.sqrt(bar11).toFixed(2)}|11⟩` : '(|00⟩ + |11⟩) / √2'}</Formula>
    <Text x={450} y={131} anchor="middle" color={C.purple} size={17}>{t < .25 ? '처음에는 두 큐비트 모두 0' : t < .58 ? 'A에 H: A의 두 가능성을 중첩' : 'CNOT: A=1인 성분에서만 B를 뒤집음'}</Text>
    <path d="M180 190V320" stroke={C.mint} strokeWidth="3" strokeDasharray="6 6" opacity={split} /><path d="M180 320H650" stroke={C.gold} strokeWidth="3" strokeDasharray="6 6" opacity={link} />
    {nodes.map((node, index) => <g key={node.label} opacity={index === 0 ? 1 : index === 1 ? .25 : index === 2 ? .3 + split * .7 * (1 - link) : .3 + link * .7}><rect x={node.x - 54} y={node.y - 29} width="108" height="58" rx="11" fill={index === 0 || index === 3 && link > .5 ? '#245248' : '#173636'} stroke={index === 0 ? C.mint : index === 3 ? C.gold : C.line} strokeWidth="2" /><Formula x={node.x} y={node.y + 10} size={28} color={index === 0 ? C.mint : index === 3 ? C.gold : C.muted}>|{node.label}⟩</Formula><Text x={node.x + 90} y={node.y + 7} size={18} color={C.white}>{Math.round(probabilities[index] * 100)}%</Text></g>)}
    <circle cx={180} cy={lerp(190, 320, split)} r="7" fill={C.mint} opacity={split * (1 - link)} /><circle cx={moverX} cy="320" r="7" fill={C.gold} opacity={link} />
    <g opacity={measured}><path d="M252 190C370 190 440 320 594 320" fill="none" stroke={C.purple} strokeWidth="2" strokeDasharray="4 6" /><Text x={450} y={252} anchor="middle" color={C.purple} size={20}>전체에 담긴 상관관계</Text><Text x={450} y={282} anchor="middle" color={C.white} size={19}>각 쌍은 00 또는 11</Text></g>
    <Text x={450} y={395} anchor="middle" color={C.white} size={18}>Z 기준에서 00: 50% · 11: 50%</Text><Text x={450} y={426} anchor="middle" size={15}>이 점선은 상관관계의 도식입니다. 공간 속 신호나 초광속 메시지가 아닙니다.</Text>
  </Diagram>;
}

export const foundationFilmCues: Record<'waves' | 'qubit' | 'interference' | 'entanglement', FilmCue[]> = {
  waves: [
    { title: '두 경로의 진폭', description: '두 틈을 지나는 가능성은 각각 파동 같은 확률 진폭으로 표시합니다. 진폭에는 크기와 위상이 있습니다.', formula: 'ψ₁(x), ψ₂(x) · x는 검출 위치' },
    { title: '진폭을 먼저 더하기', description: '두 파동이 같은 방향이면 커지고 반대 방향이면 작아집니다. 확률을 더하기 전에 진폭끼리 더해야 합니다.', formula: 'ψ합(x) = ψ₁(x) + ψ₂(x)' },
    { title: '크기를 제곱하기', description: '합친 진폭의 크기를 제곱하면 위치별 검출 확률의 모양이 됩니다. 음의 진폭이 음의 확률을 뜻하지는 않습니다.', formula: 'P(x) ∝ |ψ합(x)|² · ∝는 비례한다는 뜻' },
    { title: '점들이 분포를 드러내기', description: '한 번은 점 하나로 도착합니다. 많은 검출 결과를 모으면 밝고 어두운 간섭 무늬가 드러납니다. 점 배치는 원리를 위한 도식입니다.', formula: '한 번의 검출: 한 점 · 많은 검출: 확률 분포' },
  ],
  qubit: [
    { title: '두 기준 상태', description: '상태를 나타내는 두 축에 |0⟩과 |1⟩이라는 이름을 붙입니다. 이 그림은 입자의 실제 위치가 아닌 상태 지도입니다.', formula: '|ψ⟩ = α|0⟩ + β|1⟩' },
    { title: '벡터의 두 성분', description: '상태 화살표의 가로 성분 α와 세로 성분 β가 두 확률 진폭입니다. 여기서는 실수 진폭인 한 단면만 그렸습니다. 이 평면의 기울기는 θ/2이며, 아래 블로흐 구에서 쓰는 각도 θ와는 다릅니다.', formula: 'α = cos(θ/2), β = sin(θ/2) · 이 그림의 φ = 0' },
    { title: '진폭에서 확률로', description: '각 진폭의 크기를 제곱하면 해당 결과를 얻을 확률입니다. 아래 조절형 실험에서는 이 원리를 블로흐 구 전체로 확장합니다.', formula: 'P(0) = |α|², P(1) = |β|² · 합은 1' },
    { title: '새로 준비하고 측정', description: '그림의 마지막 상태는 0이 25%, 1이 75%입니다. 같은 상태를 매번 새로 준비하면 여러 시행의 비율이 이 확률에 가까워집니다.', formula: '확률 25% ≠ 매 네 번마다 반드시 한 번' },
  ],
  interference: [
    { title: 'H로 반반 만들기', description: '첫 하다마드 H는 0 상태를 두 기준 상태의 같은 크기 중첩으로 만듭니다. 두 진폭의 크기는 1/√2입니다.', formula: '|0⟩ → (|0⟩ + |1⟩)/√2' },
    { title: '위상 방향 돌리기', description: 'P(φ)는 |1⟩ 성분의 진폭 방향을 돌립니다. 아직 Z 기준 측정 확률은 반반입니다. 화살표는 1과 eⁱᶲ의 방향만 보여 줍니다.', formula: '(|0⟩ + eⁱᶲ|1⟩)/√2' },
    { title: '다시 만나 간섭하기', description: '마지막 H에서 두 성분이 다시 섞입니다. 0으로 가는 진폭은 합, 1로 가는 진폭은 차에 비례합니다.', formula: '0의 진폭: (1 + eⁱᶲ)/2 · 1의 진폭: (1 − eⁱᶲ)/2' },
    { title: '위상이 확률로 나타나기', description: '위상 차이가 180°면 0 쪽 진폭은 상쇄되고 1이 반드시 나옵니다. 같은 50:50 중첩이라도 상대 위상이 계산 결과를 바꿀 수 있습니다.', formula: 'P(0) = cos²(φ/2) · P(1) = sin²(φ/2)' },
  ],
  entanglement: [
    { title: '공동 상태에서 시작', description: '|00⟩의 첫 자리는 A, 둘째 자리는 B입니다. 처음에는 둘 모두 0으로 준비합니다.', formula: '|A B⟩ = |0 0⟩' },
    { title: 'A의 가능성 나누기', description: 'A에 H를 적용하면 00과 10이 같은 진폭으로 중첩됩니다. 이때 B는 두 성분에서 모두 0입니다.', formula: '(|00⟩ + |10⟩)/√2' },
    { title: '조건에 따라 B 뒤집기', description: 'CNOT는 A=1인 성분에서만 B를 바꿉니다. 그래서 10 성분이 11로 이동합니다. 이는 기준 상태 사이의 연산을 그린 도식입니다.', formula: '00 → 00 · 10 → 11' },
    { title: '벨 상태를 측정하기', description: '결과는 00 또는 11이 반반입니다. 각자의 결과는 무작위이며 원하는 값을 보내지는 못합니다. 아래 실험에서 고전적 혼합과의 차이도 비교합니다.', formula: '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2' },
  ],
};
