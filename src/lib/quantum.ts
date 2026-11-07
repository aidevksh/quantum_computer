/** Ideal educational models; no quantum hardware is contacted. */
export const radians = (degrees: number) => degrees * Math.PI / 180;
export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const percent = (value: number, digits = 1) => `${(value * 100).toFixed(digits)}%`;
export function qubit(theta: number, phi: number) {
  return {
    alpha: { re: Math.cos(theta / 2), im: 0 },
    beta: { re: Math.cos(phi) * Math.sin(theta / 2), im: Math.sin(phi) * Math.sin(theta / 2) },
    p0: Math.cos(theta / 2) ** 2, p1: Math.sin(theta / 2) ** 2,
    x: Math.sin(theta) * Math.cos(phi), y: Math.sin(theta) * Math.sin(phi), z: Math.cos(theta),
  };
}
export const interference = (phi: number) => ({ p0: Math.cos(phi / 2) ** 2, p1: Math.sin(phi / 2) ** 2 });
export function grover(size: number, target: number, iterations: number) {
  if (!Number.isInteger(size) || size < 2 || !Number.isInteger(target) || target < 0 || target >= size || !Number.isInteger(iterations) || iterations < 0) throw new RangeError('Invalid search parameters');
  let amplitudes = Array<number>(size).fill(1 / Math.sqrt(size));
  const history = [amplitudes.slice()];
  for (let index = 0; index < iterations; index++) {
    amplitudes[target] *= -1;
    const mean = amplitudes.reduce((sum, value) => sum + value, 0) / size;
    amplitudes = amplitudes.map(value => 2 * mean - value);
    history.push(amplitudes.slice());
  }
  return { amplitudes, probabilities: amplitudes.map(value => value ** 2), history };
}
/** Normalized unitary interpolation for the four-stage Grover explanation.
 * This is a mathematical illustration, not a hardware pulse schedule.
 */
export function groverEvolution(progress: number) {
  const p = clamp(progress);
  const smooth = (x: number) => { const value=clamp(x);return value*value*(3-2*value); };
  const phase=Math.PI*smooth(p*4-1),diffusion=Math.PI*smooth(p*4-2);
  const beforeRe=[.5,.5,.5,.5*Math.cos(phase)],beforeIm=[0,0,0,.5*Math.sin(phase)];
  const meanRe=beforeRe.reduce((a,b)=>a+b,0)/4,meanIm=beforeIm.reduce((a,b)=>a+b,0)/4;
  // P_s + exp(i*diffusion)(I-P_s), whose endpoint is reflection about the mean.
  const real=beforeRe.map((value,i)=>meanRe+Math.cos(diffusion)*(value-meanRe)-Math.sin(diffusion)*(beforeIm[i]-meanIm));
  const imag=beforeIm.map((value,i)=>meanIm+Math.sin(diffusion)*(beforeRe[i]-meanRe)+Math.cos(diffusion)*(value-meanIm));
  return {real,imag,probabilities:real.map((value,i)=>value**2+imag[i]**2)};
}
export function thermal(temperature: number, frequencyGHz = 5) {
  if (temperature <= 0) return 0;
  return 1 / (1 + Math.exp(6.62607015e-34 * frequencyGHz * 1e9 / (1.380649e-23 * temperature)));
}
export const majorityError = (p: number) => 3 * p * p * (1 - p) + p ** 3;
export const coherence = (time: number, t2 = 40) => Math.exp(-time / t2);
export const bellProbabilities = () => [0.5, 0, 0, 0.5];
export const phaseFlipMixtureX = (p: number) => ({ bellSame: 1 - p, classicalSame: 0.5 });
export function sampleIndex(probabilities: number[], random = Math.random()) {
  let total = 0;
  for (let i = 0; i < probabilities.length; i++) { total += probabilities[i]; if (random < total) return i; }
  return probabilities.length - 1;
}
