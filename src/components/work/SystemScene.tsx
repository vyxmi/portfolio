"use client";
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Group, MathUtils, PlaneGeometry, SRGBColorSpace, TextureLoader } from "three";

const source="/case-studies/carinsurance-com/desktop-before-after.png";
// Regions of the actual redesigned page, not invented example components.
const regions=[
  {x:0,y:0,w:1,h:.11,z:.2},
  {x:0,y:.11,w:.62,h:.65,z:.8},
  {x:.62,y:.11,w:.38,h:.65,z:1.7},
  {x:0,y:.76,w:.62,h:.24,z:1.1},
  {x:.62,y:.76,w:.38,h:.24,z:.4},
];
function PagePieces({separation,angle}: {separation:number;angle:number}) {
  const loadedTexture=useLoader(TextureLoader,source);
  const texture=useMemo(()=>{const copy=loadedTexture.clone();copy.colorSpace=SRGBColorSpace;copy.needsUpdate=true;return copy;},[loadedTexture]);
  const group=useRef<Group>(null);
  const invalidate=useThree(state=>state.invalidate);
  const viewportWidth=useThree(state=>state.viewport.width);
  const progress=useRef(separation);
  const rotation=useRef(angle);
  const geometries=useMemo(()=>regions.map(r=>{
    const geometry=new PlaneGeometry(r.w*5.8,r.h*3.8);
    const uv=geometry.attributes.uv;
    for(let i=0;i<uv.count;i++)uv.setXY(i,.5+(r.x+uv.getX(i)*r.w)*.5,1-r.y-r.h+uv.getY(i)*r.h);
    return geometry;
  }),[]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  useEffect(()=>()=>geometries.forEach(g=>g.dispose()),[geometries]);
  useEffect(()=>{invalidate();},[separation,angle,invalidate]);
  useFrame((_,delta)=>{
    progress.current=MathUtils.damp(progress.current,separation,7,delta);
    rotation.current=MathUtils.damp(rotation.current,angle,9,delta);
    const p=progress.current;
    if(group.current){
      group.current.rotation.set(-.12*p,rotation.current,0);
      group.current.children.forEach((mesh,i)=>{
        const r=regions[i];
        mesh.position.set((r.x+r.w/2-.5)*5.8*(1+p*.16),(.5-r.y-r.h/2)*3.8*(1+p*.22),r.z*p);
      });
    }
    if(Math.abs(p-separation)>.001||Math.abs(rotation.current-angle)>.001)invalidate();
  });
  return <group ref={group} position={[0,0,-.6]} scale={Math.min(1,viewportWidth/7.5)}>{geometries.map((geometry,i)=><mesh key={i} geometry={geometry}><meshBasicMaterial map={texture} toneMapped={false}/></mesh>)}</group>;
}
function FlatPage(){
  return <div className="system-static"><Image src={source} alt="Redesigned CarInsurance.com interface" width={1005} height={329} sizes="(max-width:900px) 180vw, 120vw"/></div>;
}
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}>{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<FlatPage/>:this.props.children;}
}
export default function SystemScene(){
  const [separation,setSeparation]=useState(.65);
  const [angle,setAngle]=useState(-.25);
  const drag=useRef<{x:number;angle:number}|null>(null);
  return <div className="system-scene">
    <div className="system-canvas" data-cursor="rotate ↔"
      onPointerDown={e=>{if(e.button!==0)return;drag.current={x:e.clientX,angle};e.currentTarget.setPointerCapture(e.pointerId);}}
      onPointerMove={e=>{if(drag.current)setAngle(MathUtils.clamp(drag.current.angle+(e.clientX-drag.current.x)*.004,-.65,.65));}}
      onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}>
      <SceneBoundary><Canvas aria-hidden="true" frameloop="demand" dpr={[1,1.5]} camera={{position:[0,0,9],fov:35}} gl={{alpha:true,antialias:true,powerPreference:"low-power"}} fallback={<FlatPage/>}>
        <Suspense fallback={null}><PagePieces separation={separation} angle={angle}/></Suspense>
      </Canvas></SceneBoundary>
    </div>
    <div className="system-controls">
      <button onClick={()=>{setSeparation(0);setAngle(0);}} aria-pressed={separation===0}>interface</button>
      <input type="range" min="0" max="1" step=".01" value={separation} onChange={e=>setSeparation(Number(e.target.value))} aria-label="Separate interface layers"/>
      <button onClick={()=>{setSeparation(1);setAngle(-.3);}} aria-pressed={separation===1}>pieces</button>
    </div>
  </div>;
}
