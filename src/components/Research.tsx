import { useState } from 'react';
import { sources } from '../data/sources';
import { landscape } from '../data/landscape';

export function SourceLine({ ids }: { ids: string }) {
  return <div className="source-line"><span>근거 · 더 읽기</span>{ids.split(',').map(id => {
    const source = sources.find(item => item.id === id);
    return source ? <a key={id} href={source.url} target="_blank" rel="noreferrer">{source.title}</a> : null;
  })}</div>;
}

export function Sources() {
  const seen = new Set<string>();
  const all = [...sources, ...landscape.flatMap(item => item.sources.map((source, i) => ({ ...source, id: `${item.id}-${i}`, organization: item.name, note: `8장 ${item.name}의 대표 성과·현황·계획의 근거 자료입니다.` })))].filter(source => { if (seen.has(source.url)) return false; seen.add(source.url); return true; });
  return <div id="sources-list" className="sources-list">{all.map((source, i) => <div className="source-item" id={`source-${source.id}`} key={source.url}><span>{String(i + 1).padStart(2, '0')}</span><div><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a><p>{source.note}</p><small>{source.organization} · 발표 {source.date} · 확인 2026.11.07</small></div></div>)}</div>;
}

export function Landscape() {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const filters = [['all','전체'],['초전도','초전도'],['이온','이온'],['중성원자','중성원자'],['광자','광자'],['기타','기타 방식']];
  const filtered = landscape.filter(item => {
    const categoryMatches = filter === 'all' || item.category === filter || (filter === '이온' && item.category === '이온트랩') || (filter === '기타' && ['위상','어닐링'].includes(item.category));
    return categoryMatches && [item.name,item.category,item.region,item.body,item.direction].join(' ').toLocaleLowerCase('ko-KR').includes(query.toLocaleLowerCase('ko-KR').trim());
  });
  return <><div className="landscape-toolbar"><div className="filter-group" id="landscape-filters" role="group" aria-label="구현 방식 필터">{filters.map(([id,label]) => <button key={id} data-filter={id} className={filter===id?'active':''} aria-pressed={filter===id} onClick={()=>setFilter(id)}>{label}</button>)}</div><label className="search-label"><span className="sr-only">기관 또는 기술 검색</span><input type="search" id="landscape-search" placeholder="기관·기술 검색" value={query} onChange={event=>setQuery(event.target.value)}/></label></div><p id="landscape-count" className="small" aria-live="polite">{landscape.length}개 기관·협력체 중 {filtered.length}개 표시</p><div id="landscape-list" className="landscape-list">{!filtered.length && <p className="no-results">일치하는 기관이 없습니다. 검색어를 줄이거나 전체 방식을 선택해 보세요.</p>}{filtered.map(item=><article className="institution" key={item.id}><div className="institution-top"><span className="institution-category">{item.category} / {item.region}</span><span className={`institution-status ${item.status==='계획'?'plan':item.status==='개발'?'develop':''}`}>{item.status}</span></div><h2>{item.name}</h2><p className="milestone">{item.title}</p><time className="institution-date" dateTime={item.date}>대표 발표 {item.date}</time><p>{item.body}</p><p className="metric">{item.metric}</p><p className="caveat">{item.caveat}</p><p className="direction"><b>DEVELOPMENT DIRECTION</b>{item.direction}</p><details><summary>근거 자료 {item.sources.length}개 · 원문 보기</summary>{item.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title} · {source.date}</a>)}</details></article>)}</div></>;
}
