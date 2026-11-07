/* Ideal educational models. No hardware is contacted. */
(function (root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else root.Quantum = model;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const qubit = (theta, phi) => ({
    alpha: { re: Math.cos(theta / 2), im: 0 },
    beta: { re: Math.cos(phi) * Math.sin(theta / 2), im: Math.sin(phi) * Math.sin(theta / 2) },
    p0: Math.cos(theta / 2) ** 2,
    p1: Math.sin(theta / 2) ** 2,
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(theta)
  });
  const interference = phi => ({ p0: Math.cos(phi / 2) ** 2, p1: Math.sin(phi / 2) ** 2 });
  function grover(n, target, iterations) {
    if (!Number.isInteger(n) || n < 2 || !Number.isInteger(target) || target < 0 || target >= n) throw new RangeError('Invalid search space');
    let amplitudes = Array(n).fill(1 / Math.sqrt(n));
    const history = [amplitudes.slice()];
    for (let i = 0; i < iterations; i++) {
      amplitudes[target] *= -1;
      const mean = amplitudes.reduce((a,b) => a + b, 0) / n;
      amplitudes = amplitudes.map(a => 2 * mean - a);
      history.push(amplitudes.slice());
    }
    return { amplitudes, probabilities: amplitudes.map(a => a * a), history };
  }
  const thermal = (temperature, frequencyGHz = 5) => {
    if (temperature <= 0) return 0;
    return 1 / (1 + Math.exp((6.62607015e-34 * frequencyGHz * 1e9) / (1.380649e-23 * temperature)));
  };
  const majorityError = p => 3 * p * p * (1 - p) + p ** 3;
  const coherence = (time, t2 = 40) => Math.exp(-time / t2);
  const bellProbabilities = () => [0.5, 0, 0, 0.5];
  const phaseFlipMixtureX = p => ({ bellSame: 1 - p, classicalSame: 0.5 });
  return { clamp, qubit, interference, grover, thermal, majorityError, coherence, bellProbabilities, phaseFlipMixtureX };
});
