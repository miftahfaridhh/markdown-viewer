import { useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { splitIntoBlocks } from "./block-splitter";
import { BlockRenderer } from "./BlockRenderer";

interface Props {
  content: string;
}

export function VirtualizedRenderer({ content }: Props) {
  const blocks = useMemo(() => splitIntoBlocks(content), [content]);
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: blocks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  return (
    <div
      ref={parentRef}
      style={{ overflow: "auto", height: "100%" }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            data-index={item.index}
            ref={virtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${item.start}px)`,
            }}
          >
            <BlockRenderer content={blocks[item.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
