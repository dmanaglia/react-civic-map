import { useEffect, useRef } from "react";

export function useTooltip() {
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create tooltip once on mount
    const tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.pointerEvents = "none";
    tooltip.style.background = "rgba(0,0,0,0.7)";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "4px 8px";
    tooltip.style.borderRadius = "4px";
    tooltip.style.fontSize = "12px";
    tooltip.style.fontFamily = "sans-serif";
    tooltip.style.visibility = "hidden";
    document.body.appendChild(tooltip);

    tooltipRef.current = tooltip;

    return () => {
      tooltip.remove();
    };
  }, []);

  function showTooltip(text: string, x: number, y: number) {
    if (!tooltipRef.current) return;
    tooltipRef.current.innerText = text;
    tooltipRef.current.style.visibility = "visible";
    tooltipRef.current.style.top = `${y + 10}px`;
    tooltipRef.current.style.left = `${x + 10}px`;
  }

  function hideTooltip() {
    if (tooltipRef.current) tooltipRef.current.style.visibility = "hidden";
  }

  return { showTooltip, hideTooltip };
}
