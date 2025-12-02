import { afterEach, expect } from '@rstest/core';
import * as jestDomMatchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

expect.extend(jestDomMatchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock HTMLCanvasElement.getContext for lottie-web
HTMLCanvasElement.prototype.getContext = (() => ({
  fillStyle: '',
  fillRect: () => {},
  drawImage: () => {},
  getImageData: () => ({ data: [] }),
  putImageData: () => {},
  createImageData: () => [],
  setTransform: () => {},
  resetTransform: () => {},
  save: () => {},
  restore: () => {},
  scale: () => {},
  rotate: () => {},
  translate: () => {},
  transform: () => {},
  beginPath: () => {},
  closePath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  bezierCurveTo: () => {},
  quadraticCurveTo: () => {},
  arc: () => {},
  arcTo: () => {},
  ellipse: () => {},
  rect: () => {},
  fill: () => {},
  stroke: () => {},
  clip: () => {},
  clearRect: () => {},
  measureText: () => ({ width: 0 }),
  fillText: () => {},
  strokeText: () => {},
})) as any;
