"use client";

import React from 'react';

export default function AuroraLayer({ glowA, glowB, visible }: { glowA?: string; glowB?: string; visible?: boolean }) {
  return (
    <div
      className="ft-aurora-layer"
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0, '--glow-a': glowA, '--glow-b': glowB } as React.CSSProperties}
    />
  );
}
