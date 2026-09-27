/* Ireland 2036 rendering policy. No framework or browser dependency. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.IrelandRuntime = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  function outputSize(width, height, dpr, maxDimension = 16384, maxPixels = 33554432) {
    const w = Math.max(1, width), h = Math.max(1, height);
    const scale = Math.min(Math.max(1, dpr || 1), maxDimension / w, maxDimension / h, Math.sqrt(maxPixels / (w * h)));
    return { width: Math.max(1, Math.floor(w * scale)), height: Math.max(1, Math.floor(h * scale)), scale };
  }

  // Rolling frame intervals include real stalls. Never substitute a clamped simulation dt.
  class FrameMeter {
    constructor(capacity = 240) { this.samples = new Float64Array(capacity); this.clear(); }
    clear() { this.count = 0; this.cursor = 0; this.sum = 0; }
    push(ms) {
      if (!Number.isFinite(ms) || ms <= 0) return;
      if (this.count === this.samples.length) this.sum -= this.samples[this.cursor];
      else this.count++;
      this.samples[this.cursor] = ms; this.sum += ms;
      this.cursor = (this.cursor + 1) % this.samples.length;
    }
    read() {
      if (!this.count) return { fps: 0, p95: 0, missed: 0, frames: 0 };
      const sorted = Array.from(this.samples.subarray(0, this.count)).sort((a, b) => a - b);
      return { fps: 1000 * this.count / this.sum, p95: sorted[Math.ceil(this.count * .95) - 1],
        missed: sorted.filter(ms => ms > 20).length / this.count, frames: this.count };
    }
  }

  class QualityGovernor {
    constructor(maxIndex, index = 3) { this.maxIndex = maxIndex; this.index = clamp(index, 0, maxIndex); this.reset(); }
    reset() { this.slow = 0; this.fast = 0; this.cooldown = 0; }
    decide({ fps, p95, gpuMs }, elapsed = 1) {
      this.cooldown = Math.max(0, this.cooldown - elapsed);
      const overloaded = fps < 56 || p95 > 23 || (gpuMs != null && gpuMs > 16);
      const headroom = fps >= 59 && p95 < 19 && gpuMs != null && gpuMs < 10.5;
      this.slow = overloaded ? this.slow + elapsed : 0;
      this.fast = headroom ? this.fast + elapsed : 0;
      if (this.cooldown) return this.index;
      if (this.slow >= 2 && this.index > 0) {
        this.index--; this.reset(); this.cooldown = 4;
      } else if (this.fast >= 10 && this.index < this.maxIndex) {
        this.index++; this.reset(); this.cooldown = 10;
      }
      return this.index;
    }
  }
  return { outputSize, FrameMeter, QualityGovernor };
});
