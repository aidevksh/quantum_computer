import { ConceptFilm } from './ConceptFilm';
import { WaveScene, QubitScene, InterferenceScene, BellScene, foundationFilmCues } from './scenes/Foundations';
import { GroverScene, ScaleScene, NoiseScene, TemperatureScene, advancedFilmCues } from './scenes/Advanced';

const films = {
  waves: { Scene:WaveScene, title:'두 파동을 더하면, 도착할 곳이 달라집니다', cues:foundationFilmCues.waves },
  qubit: { Scene:QubitScene, title:'화살표의 성분이 측정 확률이 되기까지', cues:foundationFilmCues.qubit },
  interference: { Scene:InterferenceScene, title:'위상을 돌리고, 진폭을 다시 만나게 하기', cues:foundationFilmCues.interference },
  entanglement: { Scene:BellScene, title:'두 큐비트의 정보를 하나의 상태에 담기', cues:foundationFilmCues.entanglement },
  algorithm: { Scene:GroverScene, title:'그로버 탐색: 부호 반전에서 정답의 확률까지', cues:advancedFilmCues.algorithm },
  scale: { Scene:ScaleScene, title:'가능한 상태는 두 배씩, 읽는 결과는 하나씩', cues:advancedFilmCues.scale },
  noise: { Scene:NoiseScene, title:'위상 관계가 흐려지면, 간섭도 사라집니다', cues:advancedFilmCues.noise },
  temperature: { Scene:TemperatureScene, title:'열 에너지와 상태 간격의 줄다리기', cues:advancedFilmCues.temperature },
};
export type FilmKind = keyof typeof films;
export function ChapterFilm({kind}:{kind:FilmKind}) {
  return <ConceptFilm id={kind} {...films[kind]} duration={32}/>;
}
