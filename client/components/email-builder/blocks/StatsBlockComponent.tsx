import React from "react";
import { StatsBlock } from "../types";
import { renderBlockToHTML } from "../utils";

interface StatsBlockComponentProps {
  block: StatsBlock;
  isSelected: boolean;
  onUpdate: (block: StatsBlock) => void;
}

export const StatsBlockComponent: React.FC<StatsBlockComponentProps> = ({
  block,
  isSelected,
}) => {
  const html = renderBlockToHTML(block);

  return (
    <div
      className={`w-full rounded-lg overflow-hidden transition-all ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
