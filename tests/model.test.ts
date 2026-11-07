import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as q from '../src/lib/quantum';
const close = (a: number,b: number) => assert.ok(Math.abs(a-b) < 1e-10, `${a} != ${b}`);
test('qubit states normalize, Bloch points remain on unit sphere, phase leaves Z probabilities unchanged', () => {
  for (let t=0;t<=180;t+=5) for (let p=0;p<=360;p+=15) {
    const s=q.qubit(t*Math.PI/180,p*Math.PI/180);
    close(s.p0+s.p1,1); close(s.x*s.x+s.y*s.y+s.z*s.z,1);
    close(s.p1,q.qubit(t*Math.PI/180,0).p1);
  }
});
test('H phase H recovers deterministic endpoints and balanced midpoint', () => {
  close(q.interference(0).p0,1); close(q.interference(Math.PI).p1,1);
  close(q.interference(Math.PI/2).p0,0.5);
});
test('Grover amplitudes normalize; four-item search succeeds in one iteration and overshoots in two', () => {
  for (let n of [4,8,16]) for(let target=0;target<n;target++) for(let k=0;k<12;k++) {
    close(q.grover(n,target,k).probabilities.reduce((a,b)=>a+b,0),1);
  }
  close(q.grover(4,2,1).probabilities[2],1);
  close(q.grover(4,2,2).probabilities[2],0.25);
});
test('animated Grover path conserves probability and reaches the oracle and diffusion states', () => {
  for(let index=0;index<=1000;index++) close(q.groverEvolution(index/1000).probabilities.reduce((a,b)=>a+b,0),1);
  const oracle=q.groverEvolution(.5);
  close(oracle.real[3],-.5);oracle.probabilities.forEach(value=>close(value,.25));
  const final=q.groverEvolution(1);
  final.probabilities.forEach((value,i)=>close(value,i===3?1:0));
});
test('thermal model has correct limits and monotonicity', () => {
  close(q.thermal(0),0); assert.ok(q.thermal(0.015)<0.000001);
  assert.ok(q.thermal(300)>0.499); assert.ok(q.thermal(0.1)<q.thermal(1));
});
test('three-bit repetition code suppresses independent bit flips only below 50%', () => {
  close(q.majorityError(0.1),0.028); close(q.majorityError(0.5),0.5);
  assert.ok(q.majorityError(0.7)>0.7);
});
test('Bell state and classical mixture differ when both are measured in X', () => {
  assert.deepEqual(q.bellProbabilities(),[0.5,0,0,0.5]);
  close(q.phaseFlipMixtureX(0).bellSame,1); close(q.phaseFlipMixtureX(0).classicalSame,0.5);
});
