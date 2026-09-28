/* Narration follows the presentation clock; audio runs on the Web Audio clock.
   The supplied recordings retain their original pitch and speed. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.IrelandNarration = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';
  const assetBase = root.document?.currentScript?.src || '';
  const STORAGE_KEY = 'ire2036-narration';
  const DEFAULTS = Object.freeze({ voice: 'female', volume: .9, offset: 0, duck: true, duckLevel: .24 });
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const finite = (v, fallback, lo, hi) => typeof v === 'number' && Number.isFinite(v) ? clamp(v, lo, hi) : fallback;
  function normalize(input = {}) {
    return {
      voice: ['female', 'male', 'off'].includes(input.voice) ? input.voice : DEFAULTS.voice,
      volume: finite(input.volume, DEFAULTS.volume, 0, 1.2),
      offset: finite(input.offset, DEFAULTS.offset, -1, 1),
      duck: typeof input.duck === 'boolean' ? input.duck : DEFAULTS.duck,
      duckLevel: finite(input.duckLevel, DEFAULTS.duckLevel, 0, 1)
    };
  }

  // Boundaries are in the original recordings. Gaps between cues give the
  // landscape room to breathe without slowing or stretching the speaker.
  const TRACKS = {
    female: { label: 'Female', file: 'audio/narration-female.mp3', duration: 138, cues: [
      {
            "at": 1,
            "from": 0,
            "to": 14.85,
            "label": "Atlantic dawn"
      },
      {
            "at": 22.25,
            "from": 14.85,
            "to": 26.96,
            "label": "The coast"
      },
      {
            "at": 40.25,
            "from": 26.96,
            "to": 40.96,
            "label": "The land · our people"
      },
      {
            "at": 60,
            "from": 40.96,
            "to": 58.52,
            "label": "Open economy"
      },
      {
            "at": 78.25,
            "from": 58.52,
            "to": 64.16,
            "label": "The next decade"
      },
      {
            "at": 94,
            "from": 64.16,
            "to": 81.97,
            "label": "Energy"
      },
      {
            "at": 112,
            "from": 81.97,
            "to": 96.3,
            "label": "Transport"
      },
      {
            "at": 128,
            "from": 96.3,
            "to": 109.34,
            "label": "Dublin"
      },
      {
            "at": 144,
            "from": 109.34,
            "to": 123.7,
            "label": "Housing"
      },
      {
            "at": 162,
            "from": 123.7,
            "to": 138,
            "label": "Together"
      }
]
     },
    male: { label: 'Male', file: 'audio/narration-male.mp3', duration: 133.68, cues: [
      {
            "at": 1,
            "from": 0,
            "to": 14.65,
            "label": "Atlantic dawn"
      },
      {
            "at": 22.25,
            "from": 14.65,
            "to": 26.2,
            "label": "The coast"
      },
      {
            "at": 40.25,
            "from": 26.2,
            "to": 39.75,
            "label": "The land · our people"
      },
      {
            "at": 60,
            "from": 39.75,
            "to": 57.05,
            "label": "Open economy"
      },
      {
            "at": 78.25,
            "from": 57.05,
            "to": 62.5,
            "label": "The next decade"
      },
      {
            "at": 94,
            "from": 62.5,
            "to": 79.85,
            "label": "Energy"
      },
      {
            "at": 112,
            "from": 79.85,
            "to": 93.3,
            "label": "Transport"
      },
      {
            "at": 128,
            "from": 93.3,
            "to": 105.82,
            "label": "Dublin"
      },
      {
            "at": 144,
            "from": 105.82,
            "to": 119.8,
            "label": "Housing"
      },
      {
            "at": 162,
            "from": 119.8,
            "to": 133.68,
            "label": "Together"
      }
]
     }
  };

  function locate(cues, showTime, offset = 0) {
    const t = showTime - offset;
    for (let i = 0; i < cues.length; i++) {
      const cue = cues[i], end = cue.at + cue.to - cue.from;
      if (t >= cue.at && t < end) return { index: i, cue, position: cue.from + t - cue.at, remaining: end - t };
    }
    return null;
  }

  function validate(track, duration = 180) {
    let previousEnd = 0, previousSourceEnd = 0;
    if (!track.cues.length) throw new Error('Narration needs timed cues');
    for (const cue of track.cues) {
      if (![cue.at, cue.from, cue.to].every(Number.isFinite) || cue.at < previousEnd - .001 ||
          cue.from < previousSourceEnd - .001 || cue.from < 0 || cue.to <= cue.from ||
          cue.to > track.duration + .06 || cue.at + cue.to - cue.from > duration + .001) {
        throw new Error('Invalid or overlapping narration cue: ' + cue.label);
      }
      previousEnd = cue.at + cue.to - cue.from;
      previousSourceEnd = cue.to;
    }
    return true;
  }

  class Player {
    constructor(options = {}) {
      this.tracks = options.tracks || TRACKS;
      this.base = options.baseURL || assetBase;
      this.Context = options.Context || root.AudioContext || root.webkitAudioContext;
      this.fetcher = options.fetcher || root.fetch?.bind(root);
      this.storage = options.storage;
      if (this.storage === undefined) { try { this.storage = root.localStorage; } catch (_) {} }
      let saved = {};
      try { saved = JSON.parse(this.storage?.getItem(STORAGE_KEY) || '{}'); } catch (_) {}
      this.settings = normalize(saved && typeof saved === 'object' ? saved : {});
      this.buffers = {}; this.states = {}; this.errors = {};
      this.ctx = null; this.output = null; this.source = null; this.envelope = null;
      this.key = ''; this.startedAt = 0; this.sourceOffset = 0;
      this.showTime = 0; this.playing = false; this.drift = 0; this.reanchors = 0;
    }

    context() {
      if (!this.ctx) {
        if (!this.Context) throw new Error('Audio is not supported in this browser');
        this.ctx = new this.Context({ latencyHint: 'playback' });
        this.output = this.ctx.createGain();
        this.output.gain.value = this.settings.volume;
        this.output.connect(this.ctx.destination);
      }
      return this.ctx;
    }

    async prepare() {
      if (this.preparing) return this.preparing;
      this.preparing = Promise.all(Object.entries(this.tracks).map(async ([id, track]) => {
        if (this.buffers[id]) return;
        this.states[id] = 'loading';
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 25000);
        try {
          validate(track);
          const response = await this.fetcher(new URL(track.file, this.base), { signal: abort.signal });
          if (!response.ok) throw new Error('Recording could not load (' + response.status + ')');
          const bytes = await response.arrayBuffer();
          const buffer = await this.context().decodeAudioData(bytes);
          if (Math.abs(buffer.duration - track.duration) > .2) throw new Error('Recording length does not match its cue sheet');
          this.buffers[id] = buffer; this.states[id] = 'ready'; delete this.errors[id];
        } catch (error) {
          this.states[id] = 'error'; this.errors[id] = error.name === 'AbortError' ? 'Recording download timed out' : error.message;
        } finally { clearTimeout(timer); }
      })).finally(() => { this.preparing = null; });
      return this.preparing;
    }

    // Call directly from the operator's gesture, including play after a pause.
    unlock() {
      try {
        const ctx = this.context();
        if (ctx.state !== 'running') return ctx.resume().catch(() => {});
      } catch (_) {}
      return Promise.resolve();
    }

    configure(patch) {
      const before = this.settings;
      this.settings = normalize({ ...before, ...patch });
      if (before.voice !== this.settings.voice || before.offset !== this.settings.offset) this.stop();
      if (this.output) this.output.gain.setTargetAtTime(this.settings.volume, this.ctx.currentTime, .025);
      try { this.storage?.setItem(STORAGE_KEY, JSON.stringify(this.settings)); } catch (_) {}
      this.update(this.showTime, this.playing);
    }

    stop() {
      if (this.source) {
        const source = this.source, envelope = this.envelope, now = this.ctx.currentTime;
        // A six-millisecond release avoids a waveform discontinuity on scrubs.
        envelope.gain.cancelScheduledValues(now);
        envelope.gain.setValueAtTime(envelope.gain.value, now);
        envelope.gain.linearRampToValueAtTime(0, now + .006);
        try { source.stop(now + .007); } catch (_) {}
      }
      this.source = null; this.envelope = null; this.key = ''; this.drift = 0;
    }

    update(showTime, playing) {
      this.showTime = showTime; this.playing = !!playing;
      const id = this.settings.voice, track = this.tracks[id];
      const cue = track ? locate(track.cues, showTime, this.settings.offset) : null;
      if (!playing || !cue || !this.buffers[id] || this.ctx?.state !== 'running') {
        if (this.source) this.stop();
        return;
      }
      const key = id + ':' + cue.index;
      this.drift = this.source ? this.sourceOffset + this.ctx.currentTime - this.startedAt - cue.position : 0;
      if (this.key === key && this.source && Math.abs(this.drift) < .12) return;
      this.stop();
      const ctx = this.ctx, now = ctx.currentTime;
      const source = ctx.createBufferSource(), envelope = ctx.createGain();
      source.buffer = this.buffers[id];
      source.connect(envelope); envelope.connect(this.output);
      const remaining = Math.min(cue.remaining, source.buffer.duration - cue.position);
      if (remaining <= .001) { source.disconnect(); envelope.disconnect(); return; }
      const fade = Math.min(.006, remaining / 3);
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(1, now + fade);
      envelope.gain.setValueAtTime(1, now + remaining - fade);
      envelope.gain.linearRampToValueAtTime(0, now + remaining);
      this.source = source; this.envelope = envelope; this.key = key;
      this.startedAt = now; this.sourceOffset = cue.position; this.reanchors++;
      source.onended = () => {
        source.disconnect(); envelope.disconnect();
        if (this.source === source) { this.source = null; this.envelope = null; this.key = ''; }
      };
      source.start(now, cue.position, remaining);
    }

    get duckGain() {
      const active = this.source && this.playing && this.settings.volume > .001;
      return active && this.settings.duck ? this.settings.duckLevel : 1;
    }

    status() {
      const id = this.settings.voice, track = this.tracks[id];
      const cue = track ? locate(track.cues, this.showTime, this.settings.offset) : null;
      return {
        voice: id, label: track?.label || 'Off', ready: this.states[id] === 'ready',
        state: id === 'off' ? 'off' : this.states[id] || 'loading', error: this.errors[id] || '',
        speaking: !!this.source && this.playing, muted: this.settings.volume < .001, cue: cue?.cue.label || '',
        expectedPosition: cue?.position ?? null,
        position: this.source ? this.sourceOffset + this.ctx.currentTime - this.startedAt : null,
        drift: this.drift, reanchors: this.reanchors, context: this.ctx?.state || 'unavailable',
        duckGain: this.duckGain, settings: { ...this.settings }
      };
    }
  }

  return { Player, TRACKS, DEFAULTS, normalize, locate, validate };
});
