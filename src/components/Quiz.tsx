import { useState } from 'react';

const questions = [
  { text:'큐비트 10개를 한 번 측정하면 1,024개의 답을 전부 읽을 수 있다.',answer:false,explanation:'10큐비트에는 1,024개 기준 상태의 진폭이 있지만 한 번의 Z 측정에서 얻는 것은 10자리 비트열 하나입니다.' },
  { text:'중첩의 상대 위상은 간섭을 거치면 측정 확률에 영향을 줄 수 있다.',answer:true,explanation:'H–P–H 실험처럼 위상을 바꾼 뒤 다시 섞으면 확률이 달라집니다. 중첩을 계산에 활용하는 핵심입니다.' },
  { text:'얽힌 두 큐비트를 이용하면 원하는 메시지를 빛보다 빠르게 보낼 수 있다.',answer:false,explanation:'각자의 측정 결과는 무작위입니다. 두 결과를 비교하려면 고전적인 통신이 필요합니다.' },
  { text:'0 K는 −273.15°C이며, 모든 양자컴퓨터가 그 온도에서 작동해야 하는 것은 아니다.',answer:true,explanation:'0 K는 절대영도이고, 정확히 도달하지는 못합니다. 초전도 칩과 이온·원자·광자 시스템은 냉각 대상과 조건이 다릅니다.' },
  { text:'물리 큐비트가 1,000개인 장치는 논리 큐비트 100개인 장치보다 반드시 뛰어나다.',answer:false,explanation:'서로 다른 지표입니다. 오류율, 오류정정 코드, 게이트·연결 구조와 목표 계산을 함께 봐야 합니다.' },
  { text:'양자컴퓨터의 이점은 문제와 알고리즘, 실제 구현 비용에 따라 달라진다.',answer:true,explanation:'특정 문제에서의 가속이 모든 계산의 가속을 뜻하지는 않습니다. 고전컴퓨터와 함께 사용하는 도구로 보는 것이 정확합니다.' },
];
export function Quiz() {
  const [answers,setAnswers] = useState<Record<number,boolean>>({});
  const count=Object.keys(answers).length, correct=questions.filter((item,index)=>answers[index]===item.answer).length;
  return <div className="quiz"><div className="lab-top"><span><b>CHECK YOUR UNDERSTANDING</b> 여섯 문장으로 점검하기</span><span className="lab-badge">점수보다 이유를 보세요</span></div><div id="quiz-questions">{questions.map((item,index)=><div className="quiz-question" key={item.text}><p id={`quiz-question-${index}`}>{index+1}. {item.text}</p><div className="quiz-options" role="group" aria-labelledby={`quiz-question-${index}`}>{[true,false].map(answer=><button key={String(answer)} className={answers[index]===answer?'chosen':''} aria-pressed={answers[index]===answer} onClick={()=>setAnswers(current=>({...current,[index]:answer}))}>{answer?'맞다 O':'아니다 X'}</button>)}</div>{answers[index]!==undefined && <p className={`quiz-explanation ${answers[index]===item.answer?'':'incorrect'}`} aria-live="polite">{answers[index]===item.answer?'맞았습니다.':'다시 생각해 보세요.'} {item.explanation}</p>}</div>)}</div><p className="quiz-score" id="quiz-score" aria-live="polite">{count?`${count} / 6문항 응답 · ${correct}문항 정답`:'각 문장이 맞는지 틀린지 골라 보세요.'}</p><button className="button outline" id="quiz-reset" onClick={()=>setAnswers({})}>다시 풀기</button></div>;
}
