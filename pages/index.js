import { useState } from "react";

export default function Home() {
  const [playing, setPlaying] = useState(false);

  const guitar = [[62, 66, 69, 73], [57, 62, 64, 67], [59, 62, 66, 69], [55, 59, 62, 64], [52, 55, 59, 62], [57, 62, 64, 67]];
  const bass = [[38], [33], [35], [31], [28], [33]];
  const drums = [[36, 42], [38, 42], [36, 42], [38, 42], [36, 42], [38, 42]];

  const playPart = (ctx, notes, offset = 0, duration = 1.2, volume = 0.1) => {
    const now = ctx.currentTime + offset;
    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(440 * Math.pow(2, (note - 69) / 12), now);
      gain.gain.setValueAtTime(volume, now);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    });
  };

  const playSong = async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    setPlaying(true);
    for (let i = 0; i < guitar.length; i++) {
      playPart(ctx, guitar[i], 0, 1.5, 0.15);
      playPart(ctx, bass[i], 0, 1.2, 0.2);
      playPart(ctx, drums[i], 0, 0.5, 0.05);
      await new Promise(res => setTimeout(res, 2000));
    }
    setPlaying(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🎸 RHCP-Style Band Player</h1>
      <p>This plays a Red Hot Chili Peppers-style instrumental using Web Audio.</p>
      <button onClick={playSong} disabled={playing}>
        {playing ? "Playing..." : "Play Full Song"}
      </button>
    </div>
  );
}
