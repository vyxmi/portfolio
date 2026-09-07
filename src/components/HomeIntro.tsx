import Link from "next/link";
import Image from "next/image";

export default function HomeIntro() {
  return <header className="home-intro" id="intro">
    <Link href="/about" className="intro-person"><Image src="/about/portrait.webp" alt="" width={68} height={80} priority/><span>vyomi seth<span>product designer · bay area</span></span></Link>
    <div className="intro-composition">
      <h1>i use <span>design</span><br/> as a medium</h1>
      <p>to take messy problems apart, understand the system underneath, and fit the pieces together so they <span>work better</span></p>
    </div>
  </header>;
}
