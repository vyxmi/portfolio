import DotGrid from "./DotGrid";
import Magnet from "./Magnet";

const lines = ["take abstract product problems apart", "understand the system underneath", "& fit the pieces back together so they work better"];
export default function Intro() {
  return <section id="hero" className="fm-intro" data-magnet-field>
    <DotGrid fade />
    <div className="fm-intro-content">
      <h1>i use design as a medium to</h1>
      <div className="fm-intro-words">{lines.map((line, i) => <div className="fm-word-line" key={line}>{line.split(" ").map((word, j) => <Magnet key={`${j}-${word}`} draggable intro rotation={[-1.7, 2.2, -2.7, 3.1, -1.9][(j + i) % 5]}>{word}</Magnet>)}</div>)}</div>
    </div>
  </section>;
}
