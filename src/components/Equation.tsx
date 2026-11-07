import { useId, useState, type ReactNode } from 'react';
import { equations, type MathVisual } from '../data/equations';

interface EquationProps { id: string; children?: ReactNode }
const roleNames = { state: '상태의 이름', amplitude: '확률 진폭', operation: '계산 방법', quantity: '변하는 값·상수', unit: '단위' };

function MiniVisual({ kind }: { kind: MathVisual }) {
  const [value, setValue] = useState(kind === 'temperature' ? .015 : kind === 'energy' ? 600 : kind === 'angle' ? 90 : kind === 'phase' ? 90 : kind === 'decay' ? 40 : kind === 'sum' ? 3 : .5);
  const inputId = useId();
  if (kind === 'reflection') return <div className="eq-mini eq-mini-reflection"><svg viewBox="0 0 340 83" role="img" aria-label="평균 0.25를 사이에 두고 이전 진폭 −0.5와 새 진폭 1이 같은 거리에 있습니다."><line x1="25" y1="43" x2="315" y2="43" stroke="#bccbaa"/><line x1="170" y1="14" x2="170" y2="58" stroke="#ab813d" strokeDasharray="3 4"/><path d="M40 35 Q170 -5 300 35" fill="none" stroke="#617f4c"/><circle cx="40" cy="43" r="5" fill="#a778ab"/><circle cx="300" cy="43" r="5" fill="#356a50"/><text x="40" y="74" textAnchor="middle">a = −0.5</text><text x="170" y="74" textAnchor="middle">ā = 0.25</text><text x="300" y="74" textAnchor="middle">a′ = 1</text></svg><p>평균에서 아래로 0.75 → 평균에서 위로 0.75</p></div>;
  const config = kind === 'angle' ? { min:0,max:180,step:1,label:'큐비트의 각도 θ',unit:'°' } : kind === 'phase' ? { min:0,max:360,step:1,label:'상대 위상 φ',unit:'°' } : kind === 'temperature' ? { min:0,max:300,step:.001,label:'절대온도 T',unit:' K' } : kind === 'energy' ? { min:400,max:800,step:10,label:'빛의 진동수 f',unit:' THz' } : kind === 'decay' ? { min:0,max:160,step:1,label:'기다린 시간 t',unit:' μs' } : kind === 'sum' ? { min:1,max:6,step:1,label:'큐비트 수 n',unit:'개' } : { min:-1,max:1,step:.05,label:'실수 진폭 a',unit:'' };
  const angle = (kind === 'angle' ? value/2 : value)*Math.PI/180;
  return <div className={`eq-mini eq-mini-${kind}`}>
    <label htmlFor={inputId}>{config.label}<output>{kind === 'amplitude' ? value.toFixed(2) : value}{config.unit}</output></label>
    <input id={inputId} type="range" min={config.min} max={config.max} step={config.step} value={value} onChange={event=>setValue(Number(event.target.value))} aria-label={config.label}/>
    {kind === 'amplitude' && <div className="eq-square-demo"><svg viewBox="0 0 150 100" aria-hidden="true"><rect x="10" y="8" width="80" height="80" fill="#e1e9d5" stroke="#b0c199"/><rect x="10" y={88-Math.abs(value)*80} width={Math.abs(value)*80} height={Math.abs(value)*80} fill="#87a568"/><text x="104" y="52">a²</text></svg><p><strong>|{value.toFixed(2)}|² = {(value*value).toFixed(3)}</strong><span>채워진 정사각형의 넓이 = {(value*value*100).toFixed(1)}%</span></p></div>}
    {(kind === 'angle' || kind === 'phase') && <div className="eq-angle-demo"><svg viewBox="0 0 165 120" role="img" aria-label={`${kind==='angle'?'진폭을 정하는 절반 각도':'위상'} ${kind==='angle'?value/2:value}도인 원 위의 화살표`}><circle cx="65" cy="61" r="43" fill="none" stroke="#bacaa7"/><line x1="12" y1="61" x2="120" y2="61" stroke="#cfdbc1"/><line x1="65" y1="8" x2="65" y2="114" stroke="#cfdbc1"/><line x1="65" y1="61" x2={65+43*Math.cos(angle)} y2={61-43*Math.sin(angle)} stroke="#356a50" strokeWidth="3"/><circle cx={65+43*Math.cos(angle)} cy={61-43*Math.sin(angle)} r="4" fill="#ab813d"/><line x1={65+43*Math.cos(angle)} y1="61" x2={65+43*Math.cos(angle)} y2={61-43*Math.sin(angle)} stroke="#a778ab" strokeDasharray="3 3"/><text x="124" y="65">{kind==='angle'?'cos':'실수'}</text><text x="70" y="14">{kind==='angle'?'sin':'i'}</text></svg><p>{kind==='angle'?<><strong>θ/2 = {value/2}°</strong><span>cos² = {(Math.cos(angle)**2).toFixed(3)}<br/>sin² = {(Math.sin(angle)**2).toFixed(3)}</span></>:<><strong>크기 1 · 방향 {value}°</strong><span>cos φ = {Math.cos(angle).toFixed(2)}<br/>sin φ = {Math.sin(angle).toFixed(2)}</span></>}</p></div>}
    {kind === 'temperature' && <div className="eq-number-demo"><div className="eq-mini-presets"><button type="button" onClick={()=>setValue(0)}>0 K 기준</button><button type="button" onClick={()=>setValue(.015)}>15 mK</button><button type="button" onClick={()=>setValue(293.15)}>20°C</button></div><strong>{value} K</strong><span>− 273.15 →</span><strong>{(value-273.15).toFixed(3).replace('-','−')}°C</strong><small>0 K는 변환의 기준입니다. 냉각으로 정확히 도달할 수는 없습니다.</small></div>}
    {kind === 'energy' && <div className="eq-number-demo"><strong>{value} THz</strong><span>× h →</span><strong>{(6.62607015e-34*value*1e12).toExponential(2)} J</strong><small>이 보조 실험은 광자 에너지 예입니다. 1 THz = 10¹² Hz.</small></div>}
    {kind === 'decay' && <div className="eq-decay-demo"><div><i style={{width:`${Math.exp(-value/40)*100}%`}}/></div><p>e<sup>−t/40</sup> = <strong>{Math.exp(-value/40).toFixed(3)}</strong><br/>T₂=40 μs인 모형에서 남은 결맞음 비율</p></div>}
    {kind === 'sum' && <div className="eq-sum-demo"><div aria-hidden="true">{Array.from({length:2**value},(_,index)=><i key={index}/>)}</div><p>2<sup>{value}</sup> = <strong>{2**value}개 기준 상태</strong><br/>한 번의 Z 측정 결과는 {value}자리 비트열 하나</p></div>}
  </div>;
}

export function Equation({ id, children }: EquationProps) {
  const entry = equations[id];
  const [selected, setSelected] = useState(0);
  const panelId = useId();
  if (!entry) return <div className="equation equation-explainer">{children}<p className="eq-reading">수식에 나온 값은 이 장의 설명과 함께 읽어 보세요.</p></div>;
  const term = entry.symbols[Math.min(selected,entry.symbols.length-1)];
  return <div className="equation equation-explainer" data-equation={id}>
    {children ?? <><span>{entry.formula}</span><p>{entry.meaning}</p></>}
    <div className="eq-reading"><span>소리 내어 읽으면</span><p>{entry.reading}</p></div>
    <div className="eq-symbol-heading"><b>기호 하나씩 보기</b><span>기호를 누르면 뜻과 예시가 바뀝니다.</span></div>
    <div className="eq-symbol-list" role="group" aria-label={`${entry.title}: 기호 선택`}>
      {entry.symbols.map((item,index)=><button type="button" className={`eq-symbol eq-role-${item.role}${selected===index?' is-selected':''}`} key={item.symbol} onClick={()=>setSelected(index)} aria-pressed={selected===index} aria-controls={panelId}><span>{item.symbol}</span><small>{item.name.split(' · ')[0]}</small></button>)}
    </div>
    <div id={panelId} className={`eq-definition eq-role-${term.role}`} aria-live="polite" aria-atomic="true">
      <div className="eq-definition-heading"><strong>{term.symbol}</strong><div><b>{term.name}</b><small>{roleNames[term.role]}{term.unit ? ` · 단위: ${term.unit}` : ''}</small></div></div>
      <p>{term.meaning}</p><div className="eq-example"><b>예를 들면</b><span>{term.example}</span></div>
    </div>
    {term.visual && <MiniVisual key={`${id}-${term.visual}`} kind={term.visual}/>}
  </div>;
}

export default Equation;
