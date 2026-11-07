import { useEffect, useId, useRef, useState } from 'react';
import type { ComponentType } from 'react';

export type FilmCue = { title: string; description: string; formula?: string };

export type ConceptFilmProps = {
  id: string;
  title: string;
  kicker?: string;
  cues: FilmCue[];
  Scene: ComponentType<{ progress: number }>;
  duration?: number;
};

/** A small, seekable mathematical film. The diagram and its caption share one clock. */
export function ConceptFilm({ id, title, kicker = 'ANIMATED EXPLAINER', cues, Scene, duration = 24 }: ConceptFilmProps) {
  const generatedId = useId();
  const headingId = `${id}-${generatedId}-title`;
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const time = useRef(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(!document.hidden);
  const [speed, setSpeed] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const cueIndex = Math.min(cues.length - 1, Math.floor(progress * cues.length));
  const cue = cues[cueIndex];

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.16 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => { if (media.matches) setPlaying(false); };
    document.addEventListener('visibilitychange', updateVisibility);
    media.addEventListener('change', updateMotion);
    return () => {
      document.removeEventListener('visibilitychange', updateVisibility);
      media.removeEventListener('change', updateMotion);
    };
  }, []);

  useEffect(() => {
    if (!playing || (!visible && !expanded) || !documentVisible) return;
    let frame = 0;
    let last: number | null = null;
    const tick = (stamp: number) => {
      if (last !== null) {
        time.current = Math.min(1, time.current + Math.min(100, stamp - last) / (duration * 1000) * speed);
        setProgress(time.current);
      }
      last = stamp;
      if (time.current < 1) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, visible, expanded, documentVisible, duration, speed]);

  useEffect(() => {
    const element = dialog.current;
    if (!expanded || !element) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => {
      if (element.open) element.close();
      document.body.style.overflow = previousOverflow;
      expandButton.current?.focus({ preventScroll: true });
    };
  }, [expanded]);

  useEffect(() => {
    const closeOnNavigation = () => setExpanded(false);
    window.addEventListener('hashchange', closeOnNavigation);
    return () => window.removeEventListener('hashchange', closeOnNavigation);
  }, []);

  function seek(value: number) {
    setPlaying(false);
    time.current = Math.max(0, Math.min(1, value));
    setProgress(time.current);
  }

  function togglePlay() {
    if (progress >= 1) { time.current = 0; setProgress(0); }
    setPlaying(value => !value);
  }

  return (
    <section className="concept-film" ref={root} id={`film-${id}`} aria-labelledby={headingId} data-film={id}>
      <div className="film-heading">
        <div><span className="film-kicker">{kicker}</span><h2 id={headingId}>{title}</h2></div>
        <div className="film-heading-actions"><span className="film-duration">{duration}초 개념 애니메이션</span><button ref={expandButton} type="button" className="film-expand" onClick={() => setExpanded(true)} aria-haspopup="dialog">⛶ 그림 크게 보기</button></div>
      </div>
      <div className="film-stage"><Scene progress={progress} /></div>
      <div className="film-narration">
        <span className="film-step-number">{String(cueIndex + 1).padStart(2, '0')} / {String(cues.length).padStart(2, '0')}</span>
        <div><h3>{cue?.title}</h3><p>{cue?.description}</p>{cue?.formula && <div className="film-live-formula">{cue.formula}</div>}</div>
      </div>
      <div className="film-controls">
        <button type="button" className="film-play" onClick={togglePlay} aria-label={playing ? '애니메이션 일시정지' : '애니메이션 재생'} aria-pressed={playing}>
          <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span> {playing ? '일시정지' : '재생'}
        </button>
        <button type="button" className="film-replay" onClick={() => { seek(0); setPlaying(true); }} aria-label="처음부터 다시 재생">↺ <span>다시 보기</span></button>
        <label className="film-scrubber"><span className="sr-only">애니메이션 시간 탐색</span><input type="range" min="0" max="1000" step="1" value={Math.round(progress * 1000)} onChange={event => seek(Number(event.target.value) / 1000)} aria-label={`${title} 재생 위치`} aria-valuetext={`${(progress * duration).toFixed(1)}초 / ${duration}초`} /></label>
        <span className="film-clock">{Math.floor(progress * duration).toString().padStart(2, '0')} / {duration}s</span>
        <label className="film-speed"><span className="sr-only">애니메이션 재생 속도</span><select value={speed} onChange={event => setSpeed(Number(event.target.value))} aria-label="애니메이션 재생 속도"><option value="0.5">0.5×</option><option value="1">1×</option><option value="1.5">1.5×</option></select></label>
      </div>
      <div className="film-cues" role="group" aria-label="애니메이션 설명 단계">
        <button type="button" className="film-step-arrow" onClick={() => seek(Math.max(0, cueIndex - 1) / cues.length)} disabled={cueIndex === 0} aria-label="이전 설명 단계">←</button>
        {cues.map((item, index) => <button type="button" key={item.title} className={cueIndex === index ? 'active' : ''} onClick={() => seek(index / cues.length)} aria-pressed={cueIndex === index}><span>{index + 1}</span>{item.title}</button>)}
        <button type="button" className="film-step-arrow" onClick={() => seek(Math.min(cues.length - 1, cueIndex + 1) / cues.length)} disabled={cueIndex === cues.length - 1} aria-label="다음 설명 단계">→</button>
      </div>
      <p className="film-footnote">그림과 자막이 같은 시간축을 따릅니다. 멈추거나 시간 막대를 끌어 중간 과정을 살펴보세요. 소리는 없습니다.</p>
      <dialog ref={dialog} className="film-dialog" aria-labelledby={`${headingId}-expanded`} aria-describedby={`${headingId}-instructions`} onCancel={event => { event.preventDefault(); setExpanded(false); }} onClose={() => setExpanded(false)}>
        {expanded && <>
          <div className="film-dialog-heading"><h2 id={`${headingId}-expanded`}>{title}</h2><button type="button" className="film-dialog-close" onClick={() => setExpanded(false)} autoFocus aria-label="확대 보기 닫기">닫기 ✕</button></div>
          <div className="film-zoom-toolbar"><p id={`${headingId}-instructions`}>작은 화면에서는 그림을 좌우로 밀어 살펴보세요. Esc 키로 닫을 수 있습니다.</p><label>그림 크기 <input type="range" min="1" max="2" step="0.25" value={zoom} onChange={event => setZoom(Number(event.target.value))} aria-label="확대된 그림 배율" /><output>{zoom.toFixed(2)}×</output></label></div>
          <div className="film-dialog-stage" tabIndex={0} aria-label="확대된 애니메이션 그림. 가로로 스크롤할 수 있습니다."><div className="film-dialog-canvas" style={{ width: `${zoom * 100}%`, minWidth: `${650 * zoom}px` }}><Scene progress={progress} /></div></div>
          <div className="film-narration film-dialog-narration"><span className="film-step-number">{cueIndex + 1} / {cues.length}</span><div><h3>{cue?.title}</h3><p>{cue?.description}</p>{cue?.formula && <div className="film-live-formula">{cue.formula}</div>}</div></div>
          <div className="film-controls film-dialog-controls"><button type="button" className="film-play" onClick={togglePlay} aria-label={playing ? '확대 애니메이션 일시정지' : '확대 애니메이션 재생'} aria-pressed={playing}>{playing ? 'Ⅱ 일시정지' : '▶ 재생'}</button><button type="button" className="film-replay" onClick={() => { seek(0); setPlaying(true); }} aria-label="확대 애니메이션 처음부터 다시 재생">↺</button><label className="film-scrubber"><input type="range" min="0" max="1000" step="1" value={Math.round(progress * 1000)} onChange={event => seek(Number(event.target.value) / 1000)} aria-label="확대 애니메이션 재생 위치" aria-valuetext={`${(progress * duration).toFixed(1)}초 / ${duration}초`} /></label><span className="film-clock">{Math.floor(progress * duration).toString().padStart(2, '0')} / {duration}s</span><label className="film-speed"><select value={speed} onChange={event => setSpeed(Number(event.target.value))} aria-label="확대 애니메이션 재생 속도"><option value="0.5">0.5×</option><option value="1">1×</option><option value="1.5">1.5×</option></select></label></div>
        </>}
      </dialog>
    </section>
  );
}
