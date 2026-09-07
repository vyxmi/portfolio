import { ViewTransition, type ReactNode } from "react";

export default function SharedElement({name,children}: {name:string;children:ReactNode}){
  return <ViewTransition name={name} share="portfolio-morph" default="none">{children}</ViewTransition>;
}
