"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { BrainObject } from "@/lib/brain/types";

interface BrainConnectionsValue {
  objectsById: Map<string, BrainObject>;
  registerNode: (id: string, el: HTMLElement | null) => void;
  getNode: (id: string) => HTMLElement | undefined;
  /** the object whose relations should currently be considered for drawing, if any */
  activeId: string | null;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  pinnedId: string | null;
  togglePinned: (id: string) => void;
}

const BrainConnectionsContext = createContext<BrainConnectionsValue | null>(null);

// Holds the object graph plus a live registry of mounted DOM nodes, so
// connector lines can be computed on demand (hover / pin) without every
// object needing to know about every other object. No connections are
// drawn until something is actively hovered or pinned.
export function BrainConnectionsProvider({ objects, children }: { objects: BrainObject[]; children: ReactNode }) {
  const nodes = useRef(new Map<string, HTMLElement>());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  const objectsById = useMemo(() => new Map(objects.map((o) => [o.id, o])), [objects]);

  const registerNode = useCallback((id: string, el: HTMLElement | null) => {
    if (el) nodes.current.set(id, el);
    else nodes.current.delete(id);
  }, []);

  const getNode = useCallback((id: string) => nodes.current.get(id), []);

  const togglePinned = useCallback((id: string) => {
    setPinnedId((prev) => (prev === id ? null : id));
  }, []);

  const value = useMemo<BrainConnectionsValue>(
    () => ({
      objectsById,
      registerNode,
      getNode,
      activeId: pinnedId ?? hoveredId,
      hoveredId,
      setHoveredId,
      pinnedId,
      togglePinned,
    }),
    [objectsById, registerNode, getNode, pinnedId, hoveredId, togglePinned]
  );

  return <BrainConnectionsContext.Provider value={value}>{children}</BrainConnectionsContext.Provider>;
}

export function useBrainConnections() {
  const ctx = useContext(BrainConnectionsContext);
  if (!ctx) throw new Error("useBrainConnections must be used within BrainConnectionsProvider");
  return ctx;
}
