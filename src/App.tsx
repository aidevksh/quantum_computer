import { useEffect, useRef, useState } from 'react';
import { ChapterContent, chapterInfo, type ChapterId } from './content/Chapters';

const ids = chapterInfo.map(item=>item.id);
function currentChapter(): ChapterId { const hash=location.hash.slice(1);return ids.includes(hash as ChapterId)?hash as ChapterId:'start'; }
function previousVisits(): ChapterId[] { try { const data:unknown=JSON.parse(localStorage.getItem('quantum-visited-v1')||'[]');return Array.isArray(data)?data.filter((id):id is ChapterId=>typeof id==='string'&&ids.includes(id as ChapterId)):[]; } catch { return []; } }

export function App() {
  const [active,setActive]=useState<ChapterId>(currentChapter),[visited,setVisited]=useState<ChapterId[]>(previousVisits),[menu,setMenu]=useState(false),[mobile,setMobile]=useState(()=>matchMedia('(max-width: 900px)').matches);
  const main=useRef<HTMLElement>(null),sidebar=useRef<HTMLElement>(null),menuButton=useRef<HTMLButtonElement>(null);
  const index=ids.indexOf(active),item=chapterInfo[index];
  useEffect(()=>{
    const navigate=()=>{setActive(currentChapter());setMenu(false);window.scrollTo({top:0,behavior:'instant'});main.current?.focus({preventScroll:true});};
    window.addEventListener('hashchange',navigate);return()=>window.removeEventListener('hashchange',navigate);
  },[]);
  useEffect(()=>{setVisited(current=>current.includes(active)?current:[...current,active]);document.title=`${String(index).padStart(2,'0')} ${item.title} — 양자, 처음부터`;},[active,index,item.title]);
  useEffect(()=>{try{localStorage.setItem('quantum-visited-v1',JSON.stringify(visited));}catch{/* Progress is optional. */}},[visited]);
  useEffect(()=>{const query=matchMedia('(max-width:900px)'),change=()=>{setMobile(query.matches);setMenu(false);};query.addEventListener('change',change);return()=>query.removeEventListener('change',change);},[]);
  useEffect(()=>{if(menu)sidebar.current?.querySelector('a')?.focus();},[menu]);
  useEffect(()=>{
    const keydown=(event:KeyboardEvent)=>{
      if(event.key==='Escape'&&menu){setMenu(false);menuButton.current?.focus();}
      if(event.key==='Tab'&&mobile&&menu){const links=[...sidebar.current!.querySelectorAll('a')],first=links[0],last=links.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
    };
    document.addEventListener('keydown',keydown);return()=>document.removeEventListener('keydown',keydown);
  },[menu,mobile]);
  return <>
    <a className="skip-link" href="#main" onClick={event=>{event.preventDefault();main.current?.focus();main.current?.scrollIntoView();}}>본문으로 건너뛰기</a>
    <aside ref={sidebar} className={`sidebar ${menu?'open':''}`} id="sidebar" aria-label="학습 목차" inert={mobile&&!menu} aria-hidden={mobile&&!menu?true:undefined}>
      <a className="brand" href="#start" onClick={()=>setMenu(false)}><span className="brand-icon" aria-hidden="true">q.</span><span>양자, 처음부터<small>A VISUAL GUIDE TO QUANTUM</small></span></a>
      <p className="nav-label">YOUR LEARNING JOURNEY</p><nav id="chapter-nav">{chapterInfo.map((chapter,i)=><a key={chapter.id} href={`#${chapter.id}`} data-page={chapter.id} className={`${active===chapter.id?'active':''} ${visited.includes(chapter.id)?'visited':''}`} aria-current={active===chapter.id?'page':undefined} onClick={()=>setMenu(false)}><span>{String(i).padStart(2,'0')}</span>{chapter.title}<i/></a>)}</nav>
      <div className="sidebar-bottom"><div className="progress-meta"><span>열어 본 장</span><b id="progress-text">{visited.length} / 10</b></div><div className="progress-track"><div style={{width:`${visited.length*10}%`}}/></div><p>애니메이션 8편 · 실험 8개 · 기호 해설</p><a href="#next" className="source-shortcut" onClick={()=>setMenu(false)}>참고 자료 &amp; 용어집 ↗</a></div>
    </aside>
    <div className={`mobile-shade ${menu?'open':''}`} onClick={()=>setMenu(false)}/>
    <div className="workspace"><header className="topbar"><button className="menu-button" id="menu-toggle" ref={menuButton} aria-label="목차 열기" aria-expanded={menu} aria-controls="sidebar" onClick={()=>setMenu(current=>!current)}>☰</button><span className="breadcrumb">VISUAL SCIENCE BOOK <span>/</span><b>{item.title}</b></span><span className="edition">한국어판 <span>·</span> 조사 기준 2026.11.07</span></header>
      <main id="main" ref={main} tabIndex={-1}>{chapterInfo.map(chapter=><section className="chapter" key={chapter.id} data-chapter={chapter.id} hidden={active!==chapter.id} aria-labelledby={`title-${chapter.id}`}><ChapterContent id={chapter.id}/></section>)}
        <nav className="chapter-pagination" aria-label="장 이동"><a id="previous-chapter" className={index===0?'invisible':''} href={`#${ids[Math.max(0,index-1)]}`}><small>← 이전 장</small><b>{chapterInfo[Math.max(0,index-1)].title}</b></a><span id="page-indicator">{String(index+1).padStart(2,'0')} / 10</span><a id="next-chapter" className={index===ids.length-1?'invisible':''} href={`#${ids[Math.min(ids.length-1,index+1)]}`}><small>다음 장 →</small><b>{chapterInfo[Math.min(ids.length-1,index+1)].title}</b></a></nav>
        <footer><span>양자, 처음부터 <span className="footer-dot">·</span> 눈으로 이해하는 작은 실험실</span><a href="https://github.com/aidevksh/quantum_computer" target="_blank" rel="noreferrer">소스 코드 · Apache 2.0 ↗</a></footer>
      </main>
    </div>
  </>;
}
