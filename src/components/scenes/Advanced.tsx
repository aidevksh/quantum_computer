import { useId, type ReactNode } from 'react';
import '../../styles/advanced-scenes.css';
import { groverEvolution } from '../../lib/quantum';

export type AdvancedSceneProps = { progress: number };
type Cue = { title: string; description: string; formula?: string };

export const advancedFilmCues: Record<'algorithm' | 'scale' | 'noise' | 'temperature', Cue[]> = {
  algorithm: [
    { title: '네 후보를 같은 크기로 준비', description: '처음에는 네 진폭이 모두 ½입니다. 확률은 진폭 크기의 제곱이므로 각각 ¼, 즉 25%입니다.', formula: 'a = ½  →  |a|² = ¼' },
    { title: '검사 규칙이 정답의 위상만 뒤집기', description: '11이 정답이라고 합시다. 오라클은 그 진폭을 +½에서 −½로 돌립니다. 크기는 같으므로 아직 확률은 모두 25%입니다.', formula: 'a₁₁ : +½ → −½  ·  평균 ā = ¼' },
    { title: '평균을 거울로 삼아 반사', description: '평균에서 떨어진 만큼 반대편으로 옮깁니다. 정답 진폭 −½는 1이 되고, 다른 진폭 ½는 0이 됩니다.', formula: 'a′ = 2ā − a  ·  2 × ¼ − (−½) = 1' },
    { title: '마지막에 측정하면 정답으로', description: '최종 상태의 진폭은 0, 0, 0, 1입니다. 이 특별한 네 후보·정답 하나·무잡음 예에서는 한 차례로 정답 확률이 100%가 됩니다.', formula: 'P(11) = |1|² = 100%' },
  ],
  scale: [
    { title: '한 큐비트, 두 가지 기준 상태', description: '측정으로 구별하는 이름은 0과 1입니다. 두 갈래는 실제 컴퓨터 두 대가 아니라 상태를 표현하는 두 성분입니다.', formula: 'n = 1  →  2¹ = 2' },
    { title: '큐비트를 더하면 갈래마다 다시 둘', description: '앞 큐비트의 각 비트열에 0이나 1을 하나씩 붙입니다. 기준 상태의 수는 2, 4, 8, 16…으로 두 배씩 늘어납니다.', formula: '기준 상태 수 = 2ⁿ' },
    { title: '빨리 커지는 것은 상태 공간', description: '여섯 큐비트라면 64개 진폭이 하나의 상태를 설명합니다. 이를 임의의 독립적인 답 64개를 곧바로 읽는 능력과 혼동하지 마세요.', formula: 'n = 6  →  2⁶ = 64개 진폭' },
    { title: '한 번의 측정은 비트열 하나', description: '가능한 비트열 중 하나만 나옵니다. 여섯 큐비트를 측정하면 여섯 자리 결과 하나. 진폭 전체를 조사하려면 여러 번 새로 준비해야 합니다.', formula: '2ⁿ개 진폭  ≠  한 번에 읽는 2ⁿ개 답' },
  ],
  noise: [
    { title: '위상이 가지런하면 선명한 간섭', description: '|+⟩ 상태는 두 진폭의 위상 관계를 알고 있는 상태입니다. 마지막 H 뒤에는 결과 0이 확실합니다.', formula: 't = 0  ·  P(0) = 1' },
    { title: '환경이 위상 정보를 흐트러뜨리기', description: 'C(t)는 처음을 1로 정한 남은 결맞음 비율입니다. 기다리면 상태 지도에서 평균 화살표가 짧아집니다. 보라색 화살표들은 위상 분산을 나타낸 도식입니다.', formula: '남은 결맞음 비율 C(t) = exp(−t / T₂)' },
    { title: '간섭의 대비도 함께 작아지기', description: '결맞음이 사라질수록 밝고 어두운 결과의 차이가 줄어듭니다. 에너지를 잃는 과정은 생략한 순수 위상감쇠 모형입니다.', formula: 'P(0) = [1 + C(t)] / 2' },
    { title: '순수한 중첩과 무작위 혼합의 차이', description: '≫는 ‘매우 크다’는 뜻입니다. 기다린 시간이 T₂보다 매우 길면 결과는 반반에 가까워집니다. T₂=40 μs는 설명용 수치입니다.', formula: 't ≫ T₂  →  P(0) ≈ P(1) ≈ ½' },
  ],
  temperature: [
    { title: '두 에너지 높이 사이의 간격', description: 'ΔE(델타 E)는 두 에너지의 차이입니다. 상태 0과 1 사이의 간격을 hf로 정했으며, 이 모형의 f는 5 GHz입니다.', formula: 'ΔE = hf  ·  hf/k_B ≈ 0.240 K' },
    { title: '열 에너지가 크면 위쪽도 섞이기', description: '온도가 높을수록 높은 에너지 상태가 열로 채워지기 쉽습니다. 4 K의 값은 두 준위 모형의 계산값이며 초전도 칩의 작동 온도가 아닙니다.', formula: 'p₁ = 1 / [1 + exp(hf / k_BT)]' },
    { title: '차갑게 만들어 열에 의한 들뜸 억제', description: '≪는 ‘매우 작다’는 뜻입니다. 열 에너지 k_B T가 상태 간격 hf보다 매우 작아지면, 열로 높은 상태에 올라갈 확률이 줄어듭니다.', formula: 'k_BT ≪ hf  →  p₁ ≈ 0' },
    { title: '0 K가 아니라, 0 K 가까이', description: '15 mK는 0.015 K, 섭씨 −273.135°C입니다. 정확히 0 K에 도달하는 것은 아니며 모든 양자컴퓨터가 이 냉각 방식을 쓰지도 않습니다.', formula: '0.015 K = −273.135°C  ·  0 K = −273.15°C' },
  ],
};

const C = { mint: '#a6e8cc', gold: '#f2ca75', purple: '#b6a6f7', ink: '#102326', muted: '#9bb6b4', grid: '#315052', white: '#f4fbf7' };
const clamp = (value: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, value));
const smooth = (value: number) => { const x = clamp(value); return x * x * (3 - 2 * x); };
const stageProgress = (progress: number, stage: number) => clamp(progress * 4 - stage);
const nudge = (value: number) => Math.abs(value) < 0.0005 ? 0 : value;

function Label({ x, y, children, color = C.muted, size = 16, anchor = 'start', opacity = 1, weight = 400 }: { x: number; y: number; children: ReactNode; color?: string; size?: number; anchor?: 'start' | 'middle' | 'end'; opacity?: number; weight?: number }) {
  return <text x={x} y={y} fill={color} fontSize={size} textAnchor={anchor} opacity={opacity} fontWeight={weight}>{children}</text>;
}

function Arrow({ x1, y1, x2, y2, color = C.mint, opacity = 1, width = 2 }: { x1: number; y1: number; x2: number; y2: number; color?: string; opacity?: number; width?: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const points = `${x2},${y2} ${x2 - 10 * Math.cos(angle - .38)},${y2 - 10 * Math.sin(angle - .38)} ${x2 - 10 * Math.cos(angle + .38)},${y2 - 10 * Math.sin(angle + .38)}`;
  return <g opacity={opacity}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} /><polygon points={points} fill={color} /></g>;
}

function SceneFrame({ children, label }: { children: ReactNode; label: string }) {
  return <svg className="advanced-scene" viewBox="0 0 900 440" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet"><rect width="900" height="440" fill={C.ink} />{children}</svg>;
}

/** Continuous unitary phase interpolation keeps the complex state normalized. */
export function GroverScene({ progress }: AdvancedSceneProps) {
  const p = clamp(progress);
  const { real, imag, probabilities } = groverEvolution(p);
  const baseline = 250, scale = 122, xs = [103, 230, 357, 484];
  const showAverage = p >= .5 && p < .83;
  const final = smooth(stageProgress(p, 3));
  const step = Math.min(3, Math.floor(p * 4));
  return <SceneFrame label="그로버 탐색의 진폭과 확률: 네 진폭 준비, 정답 위상 반전, 평균을 기준으로 반사, 정답 확률 증폭">
    <Label x={42} y={36} color={C.mint} size={17}>진폭의 방향을 바꿔, 정답의 확률로</Label>
    <Label x={42} y={63} size={15}>{['네 후보를 같은 크기로 준비', '정답 11의 위상만 180° 회전', '평균을 기준으로 진폭 반사', '11에 확률이 모인 최종 상태'][step]}</Label>
    {[1, .5, 0, -.5].map(value => <g key={value}><line x1={60} x2={552} y1={baseline - value * scale} y2={baseline - value * scale} stroke={C.grid} strokeDasharray={value === 0 ? undefined : '4 8'} /><Label x={47} y={baseline - value * scale + 5} anchor="end" size={15}>{value > 0 ? '+' : ''}{value}</Label></g>)}
    <Label x={62} y={99} size={15}>막대: 진폭의 실수 성분</Label>
    {showAverage && <g><line x1={62} x2={558} y1={baseline - .25 * scale} y2={baseline - .25 * scale} stroke={C.gold} strokeWidth={2} strokeDasharray="6 5" /><Label x={557} y={baseline - .25 * scale - 10} anchor="end" color={C.gold} size={16}>ā = ¼</Label></g>}
    {xs.map((x, i) => <g key={i}>
      {showAverage && <line x1={x} x2={x} y1={baseline - (i === 3 ? -.5 : .5) * scale} y2={baseline - (i === 3 ? 1 : 0) * scale} stroke={i === 3 ? C.gold : C.muted} strokeWidth={2} opacity={.35} strokeDasharray="4 5" />}
      <rect x={x - 23} y={Math.min(baseline, baseline - real[i] * scale)} width={46} height={Math.max(2, Math.abs(real[i] * scale))} rx={3} fill={i === 3 ? C.gold : C.mint} opacity={i === 3 ? 1 : .82} />
      <circle cx={x} cy={baseline - real[i] * scale} r={5} fill={i === 3 ? C.gold : C.mint} />
      <Label x={x} y={real[i] >= 0 ? baseline - real[i] * scale - 14 : baseline - real[i] * scale + 23} anchor="middle" color={i === 3 ? C.gold : C.mint} size={18}>{nudge(real[i]).toFixed(2)}</Label>
      <Label x={x} y={340} anchor="middle" color={C.white} size={19}>|{i.toString(2).padStart(2, '0')}⟩</Label>
      <Label x={x} y={367} anchor="middle" color={i === 3 ? C.gold : C.muted} size={19}>{(probabilities[i] * 100).toFixed(0)}%</Label>
      <rect x={x - 35} y={383} width={70} height={7} rx={3} fill={C.grid} /><rect x={x - 35} y={383} width={70 * clamp(probabilities[i])} height={7} rx={3} fill={i === 3 ? C.gold : C.mint} />
    </g>)}
    <line x1={600} x2={600} y1={92} y2={389} stroke={C.grid} />
    <Label x={748} y={106} anchor="middle" color={C.gold} size={17}>정답 진폭 a₁₁</Label>
    <circle cx={748} cy={214} r={77} fill="none" stroke={C.grid} />
    <line x1={653} y1={214} x2={843} y2={214} stroke={C.grid} /><line x1={748} y1={120} x2={748} y2={306} stroke={C.grid} />
    <Label x={842} y={237} anchor="end" size={15}>실수</Label><Label x={761} y={135} size={15}>허수</Label>
    <Arrow x1={748} y1={214} x2={748 + real[3] * 77} y2={214 - imag[3] * 77} color={C.gold} width={3} />
    <circle cx={748 + real[3] * 77} cy={214 - imag[3] * 77} r={5} fill={C.gold} />
    <Label x={748} y={335} anchor="middle" color={C.white} size={24}>P(11) = {(probabilities[3] * 100).toFixed(0)}%</Label>
    <Label x={748} y={365} anchor="middle" color={C.gold} size={17} opacity={final}>확률 = 진폭 크기의 제곱</Label>
    <Label x={450} y={423} anchor="middle" size={15}>게이트 변화를 보여 주는 연속 수학 모형 · 실제 제어 펄스의 궤적은 아님</Label>
  </SceneFrame>;
}

export function ScaleScene({ progress }: AdvancedSceneProps) {
  const p = clamp(progress);
  const growth = p < .25 ? 1 / 6 : p < .5 ? (1 + 2 * smooth((p - .25) / .25)) / 6 : p < .75 ? .5 + .5 * smooth((p - .5) / .25) : 1;
  const depth = Math.max(1, Math.min(6, Math.ceil(growth * 6)));
  const selected = '101101';
  const measurement = smooth((p - .77) / .2);
  const count = 2 ** depth;
  const curve = Array.from({ length: 61 }, (_, i) => { const n = i / 10; return `${650 + n / 6 * 180},${300 - 2 ** n / 64 * 100}`; }).join(' ');
  return <SceneFrame label="추가하는 큐비트마다 두 갈래로 늘어나는 기준 상태와, 측정 시 얻는 한 비트열의 차이">
    <Label x={42} y={36} color={C.mint} size={17}>가능한 성분은 두 배씩, 읽는 결과는 하나</Label>
    <Label x={42} y={63} size={15}>갈래는 상태의 성분을 나열한 그림입니다. 실제 분기하는 세계나 컴퓨터가 아닙니다.</Label>
    <g opacity={1 - .58 * measurement}>
      <circle cx={55} cy={225} r={5} fill={C.mint} />
      {Array.from({ length: 6 }, (_, level) => {
        const d = level + 1, nodes = 2 ** d, opacity = smooth((growth * 6 - level) * 2);
        return <g key={d} opacity={opacity}>
          {Array.from({ length: nodes }, (_, i) => {
            const parent = Math.floor(i / 2), parentY = 85 + (parent + .5) / (nodes / 2) * 280;
            const y = 85 + (i + .5) / nodes * 280;
            return <g key={i}><path d={`M${55 + level * 78},${parentY} C${85 + level * 78},${parentY} ${103 + level * 78},${y} ${133 + level * 78},${y}`} fill="none" stroke={d === depth ? C.mint : C.grid} strokeWidth={d < 4 ? 1.7 : 1.1} /><circle cx={133 + level * 78} cy={y} r={d < 4 ? 3.5 : 2} fill={C.mint} /></g>;
          })}
          <Label x={55 + d * 78} y={393} anchor="middle" size={16}>{d}개</Label>
        </g>;
      })}
    </g>
    {Array.from({ length: 6 }, (_, level) => {
      const d = level + 1, prefix = Number.parseInt(selected.slice(0, d), 2), previous = d === 1 ? 0 : Number.parseInt(selected.slice(0, d - 1), 2);
      return <g key={d} opacity={measurement}><path d={`M${55 + level * 78},${85 + (previous + .5) / 2 ** level * 280} C${85 + level * 78},${85 + (previous + .5) / 2 ** level * 280} ${103 + level * 78},${85 + (prefix + .5) / 2 ** d * 280} ${133 + level * 78},${85 + (prefix + .5) / 2 ** d * 280}`} fill="none" stroke={C.gold} strokeWidth={3} /><circle cx={133 + level * 78} cy={85 + (prefix + .5) / 2 ** d * 280} r={4} fill={C.gold} /></g>;
    })}
    <line x1={588} y1={90} x2={588} y2={390} stroke={C.grid} />
    <Label x={735} y={110} anchor="middle" size={16}>n = {depth} 큐비트</Label>
    <Label x={735} y={165} anchor="middle" color={C.mint} size={47} weight={650}>2{['⁰', '¹', '²', '³', '⁴', '⁵', '⁶'][depth]} = {count}</Label>
    <Label x={735} y={192} anchor="middle" size={16}>개의 기준 상태 · 각각의 진폭</Label>
    <line x1={650} y1={300} x2={844} y2={300} stroke={C.grid} /><line x1={650} y1={300} x2={650} y2={202} stroke={C.grid} />
    <polyline points={curve} fill="none" stroke={C.mint} strokeWidth={2} /><circle cx={650 + depth / 6 * 180} cy={300 - count / 64 * 100} r={5} fill={C.gold} />
    <Label x={650} y={324} size={15}>0</Label><Label x={840} y={324} anchor="end" size={15}>6 큐비트</Label>
    <g opacity={measurement}><rect x={620} y={344} width={240} height={46} rx={9} fill="#293e39" stroke={C.gold} /><Label x={740} y={374} anchor="middle" color={C.gold} size={24}>측정 → 101101</Label></g>
    <Label x={450} y={425} anchor="middle" size={15}>{measurement > .5 ? '64개 진폭을 한꺼번에 읽는 대신, 여섯 자리 비트열 하나를 얻습니다.' : '새 큐비트의 0 / 1을 각 비트열 뒤에 붙이면, 가능한 기준 상태가 두 배가 됩니다.'}</Label>
  </SceneFrame>;
}

export function NoiseScene({ progress }: AdvancedSceneProps) {
  const p = clamp(progress), time = p * 160, coherence = Math.exp(-time / 40), p0 = (1 + coherence) / 2;
  const wavePath = (contrast: number) => Array.from({ length: 121 }, (_, i) => `${515 + i / 120 * 330},${225 - 78 * contrast * Math.cos(i / 120 * Math.PI * 4)}`).join(' ');
  const id = useId().replace(/:/g, '');
  return <SceneFrame label="시간에 따라 줄어드는 결맞음과 간섭 대비, 0의 확률이 100퍼센트에서 50퍼센트로 가는 순수 위상감쇠">
    <defs><radialGradient id={`noise-${id}`}><stop stopColor={C.mint} stopOpacity=".15" /><stop offset="1" stopColor={C.mint} stopOpacity="0" /></radialGradient></defs>
    <Label x={42} y={36} color={C.mint} size={17}>위상 정보를 잃으면, 간섭도 흐려집니다.</Label>
    <Label x={42} y={64} size={15}>순수 위상감쇠 모형 · T₂ = 40 μs · 에너지 변화는 생략</Label>
    <circle cx={250} cy={220} r={137} fill={`url(#noise-${id})`} />
    <circle cx={250} cy={220} r={110} fill="none" stroke={C.grid} strokeWidth={1.7} />
    <ellipse cx={250} cy={220} rx={110} ry={37} fill="none" stroke={C.grid} strokeDasharray="4 6" />
    <line x1={113} y1={220} x2={386} y2={220} stroke={C.grid} /><line x1={250} y1={84} x2={250} y2={356} stroke={C.grid} />
    {Array.from({ length: 20 }, (_, i) => {
      const phase = (i / 19 - .5) * Math.PI * 2 * (1 - coherence);
      return <Arrow key={i} x1={250} y1={220} x2={250 + Math.cos(phase) * 105} y2={220 - Math.sin(phase) * 34} color={C.purple} opacity={(1 - coherence) * .13} width={1.2} />;
    })}
    <Arrow x1={250} y1={220} x2={250 + coherence * 110} y2={220} width={4} />
    <circle cx={250 + coherence * 110} cy={220} r={6} fill={C.mint} />
    <Label x={371} y={215} color={C.mint} size={17}>|+⟩</Label>
    <Label x={250} y={385} anchor="middle" size={17}>상태 지도 · 입자의 위치 아님</Label>
    <Label x={250} y={414} anchor="middle" color={C.mint} size={19}>모형의 평균 길이 C = {coherence.toFixed(3)}</Label>
    <line x1={452} y1={95} x2={452} y2={390} stroke={C.grid} />
    <Label x={680} y={112} anchor="middle" color={C.white} size={19}>간섭 무늬의 대비</Label>
    <line x1={515} y1={225} x2={845} y2={225} stroke={C.grid} />
    <polyline points={wavePath(1)} fill="none" stroke={C.grid} strokeWidth={1.4} strokeDasharray="4 6" />
    <polyline points={wavePath(coherence)} fill="none" stroke={C.mint} strokeWidth={3} />
    <Label x={515} y={325} size={15}>처음의 대비</Label><line x1={617} y1={319} x2={665} y2={319} stroke={C.grid} strokeWidth={2} strokeDasharray="4 6" />
    <Label x={695} y={325} color={C.mint} size={15}>현재</Label><line x1={738} y1={319} x2={785} y2={319} stroke={C.mint} strokeWidth={3} />
    <Label x={680} y={375} anchor="middle" color={C.gold} size={25}>마지막 H 뒤 P(0) = {(p0 * 100).toFixed(1)}%</Label>
    <Label x={680} y={412} anchor="middle" size={18}>기다린 시간 t = {time.toFixed(0)} μs</Label>
  </SceneFrame>;
}

export function TemperatureScene({ progress }: AdvancedSceneProps) {
  const p = clamp(progress), temperature = 4 * Math.pow(.015 / 4, p);
  const population = 1 / (1 + Math.exp(.23996215366831105 / temperature));
  const warm = clamp(temperature / 4), levels = [4, 1, .1, .015];
  const percent = population * 100;
  const percentText = percent < .01 ? percent.toFixed(7) : percent.toFixed(2);
  const percentGroundText = percent < .01 ? (100 - percent).toFixed(5) : (100 - percent).toFixed(2);
  return <SceneFrame label="5기가헤르츠 두 준위 모형에서 4켈빈부터 15밀리켈빈까지 냉각할 때 높은 에너지 상태의 열평형 확률이 감소하는 모습">
    <Label x={42} y={36} color={C.mint} size={17}>열 에너지보다 상태 사이 간격이 크도록</Label>
    <Label x={42} y={63} size={15}>두 준위 열평형의 수학 모형 · 높은 온도는 초전도 칩의 작동 범위를 뜻하지 않음</Label>
    <Label x={168} y={106} anchor="middle" color={C.white} size={19}>단계적으로 열을 빼내기</Label>
    {levels.map((temp, i) => {
      const width = 226 - i * 30, y = 139 + i * 61, cooled = temperature <= temp * 1.08;
      return <g key={temp}><rect x={168 - width / 2} y={y} width={width} height={35} rx={17} fill={cooled ? '#244c49' : '#343e36'} stroke={cooled ? C.mint : '#697453'} /><Label x={168} y={y + 24} anchor="middle" color={cooled ? C.mint : C.gold} size={18}>{temp === .015 ? '15 mK · 양자칩' : `${temp} K`}</Label>{i < 3 && <g><line x1={130} x2={130} y1={y + 35} y2={y + 61} stroke={C.grid} strokeWidth={3} /><line x1={206} x2={206} y1={y + 35} y2={y + 61} stroke={C.grid} strokeWidth={3} /></g>}</g>;
    })}
    <Label x={168} y={404} anchor="middle" size={15}>냉각 단계의 개념도</Label>
    <line x1={322} y1={98} x2={322} y2={392} stroke={C.grid} />
    <Label x={486} y={108} anchor="middle" color={C.white} size={19}>에너지 간격 ΔE = hf</Label>
    <line x1={375} y1={167} x2={579} y2={167} stroke={C.gold} strokeWidth={3} /><line x1={375} y1={319} x2={579} y2={319} stroke={C.mint} strokeWidth={3} />
    <Label x={370} y={157} color={C.gold} size={19}>|1⟩</Label><Label x={370} y={349} color={C.mint} size={19}>|0⟩</Label>
    <line x1={591} y1={177} x2={591} y2={309} stroke={C.purple} strokeWidth={2} /><path d="M585 185 L591 175 L597 185 M585 301 L591 311 L597 301" fill="none" stroke={C.purple} strokeWidth={2} /><Label x={574} y={251} anchor="end" color={C.purple} size={20}>hf</Label>
    {Array.from({ length: 14 }, (_, i) => {
      const alpha = clamp(population * 28 - i, 0, 1);
      const x = 396 + (i % 7) * 26, y = 143 - Math.floor(i / 7) * 22;
      return <circle key={`excited-${i}`} cx={x} cy={y} r={6} fill={C.gold} opacity={alpha} />;
    })}
    {Array.from({ length: 14 }, (_, i) => <circle key={`ground-${i}`} cx={396 + (i % 7) * 26} cy={294 - Math.floor(i / 7) * 22} r={6} fill={C.mint} opacity={clamp((1 - population) * 20 - i)} />)}
    <Arrow x1={421} y1={188} x2={421} y2={267} color={C.gold} opacity={.5 + .5 * (1 - warm)} />

    <Label x={486} y={386} anchor="middle" size={15}>점은 비율의 개념도</Label>
    <line x1={633} y1={98} x2={633} y2={392} stroke={C.grid} />
    <Label x={755} y={123} anchor="middle" color={C.mint} size={29}>{temperature.toFixed(3)} K</Label>
    <Label x={755} y={154} anchor="middle" size={17}>{(temperature - 273.15).toFixed(3).replace('-', '−')}°C</Label>
    <Label x={666} y={204} color={C.gold} size={16}>높은 상태 |1⟩</Label>
    <Label x={666} y={235} color={C.gold} size={26}>{percentText}%</Label>
    <rect x={666} y={250} width={180} height={9} rx={4} fill={C.grid} /><rect x={666} y={250} width={180 * population} height={9} rx={4} fill={C.gold} />
    <Label x={666} y={296} color={C.mint} size={16}>낮은 상태 |0⟩</Label>
    <Label x={666} y={327} color={C.mint} size={26}>{percentGroundText}%</Label>
    <rect x={666} y={342} width={180} height={9} rx={4} fill={C.grid} /><rect x={666} y={342} width={180 * (1 - population)} height={9} rx={4} fill={C.mint} />
    <Label x={450} y={432} anchor="middle" size={15}>0 K = −273.15°C는 별도의 기준점 · 정확한 0 K에 도달한 장치가 아닙니다.</Label>
  </SceneFrame>;
}
