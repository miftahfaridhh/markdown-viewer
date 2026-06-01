const SMALL_FILE_THRESHOLD = 512 * 1024; // 512 KB — below this, single-pass render

export function shouldVirtualize(content: string): boolean {
  return content.length > SMALL_FILE_THRESHOLD;
}

/**
 * Splits a markdown document into top-level blocks at blank-line boundaries.
 * Code fences (``` or ~~~) are treated as atomic units and never split internally.
 * Each returned string is a complete, independently-renderable markdown block.
 */
export function splitIntoBlocks(content: string): string[] {
  const lines = content.split("\n");
  const blocks: string[] = [];
  const current: string[] = [];
  let inFence = false;
  let fenceMarker = "";

  for (const line of lines) {
    if (!inFence) {
      const fenceMatch = /^(`{3,}|~{3,})/.exec(line);
      if (fenceMatch) {
        inFence = true;
        fenceMarker = fenceMatch[1][0];
        current.push(line);
        continue;
      }

      if (line.trim() === "") {
        if (current.length > 0) {
          blocks.push(current.join("\n"));
          current.length = 0;
        }
      } else {
        current.push(line);
      }
    } else {
      current.push(line);
      const closingMatch = /^(`{3,}|~{3,})/.exec(line);
      if (closingMatch && closingMatch[1][0] === fenceMarker && closingMatch[1].length >= 3) {
        inFence = false;
        fenceMarker = "";
      }
    }
  }

  if (current.length > 0) {
    blocks.push(current.join("\n"));
  }

  return blocks.filter((b) => b.trim().length > 0);
}
