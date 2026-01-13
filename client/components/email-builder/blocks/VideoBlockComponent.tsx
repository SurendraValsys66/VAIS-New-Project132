import React from "react";
import { VideoBlock } from "../types";
import { Film } from "lucide-react";

interface VideoBlockComponentProps {
  block: VideoBlock;
  isSelected: boolean;
  onSrcChange: (src: string) => void;
}

export const VideoBlockComponent: React.FC<VideoBlockComponentProps> = ({
  block,
  isSelected,
  onSrcChange,
}) => {
  const width =
    block.widthUnit === "%"
      ? `${block.width}%`
      : `${block.width}px`;

  const borderStyle =
    block.borderWidth > 0
      ? `border: ${block.borderWidth}px solid ${block.borderColor};`
      : "";

  const containerStyle: React.CSSProperties = {
    width: width,
    textAlign: block.alignment as any,
    padding: `${block.padding}px`,
    margin: `${block.margin}px`,
    borderRadius: `${block.borderRadius}px`,
    display: block.alignment === "center" ? "block" : "inline-block",
    marginLeft: block.alignment === "center" ? "auto" : undefined,
    marginRight: block.alignment === "center" ? "auto" : undefined,
  };

  if (borderStyle) {
    const borderParts = borderStyle.split(";").filter(Boolean);
    borderParts.forEach((part) => {
      if (part.includes("border")) {
        const [, value] = part.split(":");
        (containerStyle as any).border = value.trim();
      }
    });
  }

  const videoContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: block.height,
    backgroundColor: "#f5f5f5",
    borderRadius: `${block.borderRadius}px`,
  };

  const placeholderStyle: React.CSSProperties = {
    width: "100%",
    height: block.height,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: `${block.borderRadius}px`,
  };

  return (
    <div
      className={`relative transition-all ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      style={containerStyle}
    >
      {block.src ? (
        <div style={videoContainerStyle}>
          <video
            width="100%"
            height={block.height}
            controls
            poster={block.thumbnail}
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: `${block.borderRadius}px`,
            }}
          >
            <source src={block.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div style={placeholderStyle}>
          <div className="text-center">
            <Film className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">Video not available</p>
          </div>
        </div>
      )}
    </div>
  );
};
