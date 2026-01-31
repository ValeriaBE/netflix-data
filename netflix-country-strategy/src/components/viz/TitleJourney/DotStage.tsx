import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { theme } from "../../../styles/theme";
import type { ChapterKey, FocusMode } from "../../../app/constants";
import type { NodeDatum } from "./types";
import { getTargets } from "./layouts";

function nodeRadius(n: NodeDatum) {
  // small variation (subtle) to make it feel less uniform
  if (n.type === "Movie") return 3.3;
  if (n.type === "TV Show") return 3.7;
  return 3.2;
}

function colorFor(n: NodeDatum) {
  return n.country === "United States" ? theme.colors.accent : "#7A151A";
}

export function DotStage({
  data,
  chapter,
  focus,
  width = 920,
  height = 560,
}: {
  data: NodeDatum[];
  chapter: ChapterKey;
  focus: FocusMode;
  width?: number;
  height?: number;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const simRef = useRef<d3.Simulation<NodeDatum, undefined> | null>(null);

  const [hover, setHover] = useState<{
    x: number;
    y: number;
    node: NodeDatum;
  } | null>(null);

  const filtered = useMemo(() => {
    if (focus === "both") return data;
    if (focus === "us") return data.filter((d) => d.country === "United States");
    return data.filter((d) => d.country === "Canada");
  }, [data, focus]);

  // initialize random positions (stable-ish)
  const nodes = useMemo(() => {
    const rng = d3.randomLcg(0.42);
    return filtered.map((d) => ({
      ...d,
      x: (d.x ?? width / 2) + (rng() - 0.5) * 40,
      y: (d.y ?? height / 2) + (rng() - 0.5) * 40,
    })) as NodeDatum[];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, width, height]);

  // Render + update on chapter changes
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("background", theme.colors.bg);

    // Background card
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("rx", theme.radius.lg)
      .attr("fill", theme.colors.bg)
      .attr("stroke", theme.colors.border);

    // Group labels (optional, subtle)
    const labelLayer = svg.append("g").attr("opacity", 0.9);

    const dotLayer = svg.append("g");

    const circles = dotLayer
      .selectAll("circle")
      .data(nodes, (d: any) => d.id)
      .join("circle")
      .attr("r", (d) => nodeRadius(d))
      .attr("fill", (d) => colorFor(d))
      .attr("opacity", 0.95)
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.25)
      .style("cursor", "default")
      .on("mousemove", function (event, d) {
        const [mx, my] = d3.pointer(event, svg.node() as any);
        setHover({ x: mx, y: my, node: d });
      })
      .on("mouseleave", () => setHover(null));

    // Force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "collide",
        d3.forceCollide<NodeDatum>().radius((d) => nodeRadius(d) + 0.9).iterations(2)
      )
      .force("charge", d3.forceManyBody().strength(-2.2))
      .force("x", d3.forceX<NodeDatum>(width / 2).strength(0.06))
      .force("y", d3.forceY<NodeDatum>(height / 2).strength(0.06))
      .alpha(1)
      .alphaDecay(0.05)
      .on("tick", () => {
        circles.attr("cx", (d) => d.x ?? width / 2).attr("cy", (d) => d.y ?? height / 2);
      });

    simRef.current = simulation;

    // apply chapter targets
    const applyTargets = (key: ChapterKey) => {
      const targets = getTargets(key, nodes, width, height);

      // add faint labels for major groupings (first pass)
      labelLayer.selectAll("*").remove();
      const groups = new Map<string, { x: number; y: number; count: number }>();
      for (const n of nodes) {
        const t = targets.get(n.id);
        if (!t) continue;
        const g = t.group;
        const prev = groups.get(g) ?? { x: t.x, y: t.y, count: 0 };
        groups.set(g, { x: t.x, y: t.y, count: prev.count + 1 });
      }

      const labelData = Array.from(groups.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 8)
        .map(([k, v]) => ({ key: k, ...v }));

      labelLayer
        .selectAll("text")
        .data(labelData)
        .join("text")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y - 140)
        .attr("text-anchor", "middle")
        .attr("fill", theme.colors.muted)
        .attr("font-size", 12)
        .attr("font-weight", 700)
        .text((d) => d.key);

      simulation
        .force(
          "x",
          d3
            .forceX<NodeDatum>((d) => targets.get(d.id)?.x ?? width / 2)
            .strength(0.12)
        )
        .force(
          "y",
          d3
            .forceY<NodeDatum>((d) => targets.get(d.id)?.y ?? height / 2)
            .strength(0.12)
        )
        .alpha(0.9)
        .restart();
    };

    applyTargets(chapter);

    return () => {
      simulation.stop();
    };
  }, [nodes, chapter, width, height]);

  return (
    <div style={{ position: "relative" }}>
      <svg ref={svgRef} width={width} height={height} />

      {hover && (
        <div
          style={{
            position: "absolute",
            left: Math.min(hover.x + 14, width - 240),
            top: Math.min(hover.y + 14, height - 120),
            width: 240,
            pointerEvents: "none",
            background: theme.colors.tooltipBg,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.md,
            padding: 10,
            color: theme.colors.text,
            fontSize: 12,
            lineHeight: 1.4,
            boxShadow: `0 12px 30px ${theme.colors.shadow}`,
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 6 }}>
            {hover.node.country} • {hover.node.type}
          </div>
          <div style={{ color: theme.colors.muted }}>
            <div><b>Rating:</b> {hover.node.rating || "Unrated"}</div>
            <div><b>Genre:</b> {hover.node.genre || "Unknown"}</div>
            <div><b>Year:</b> {hover.node.year ?? "—"}</div>
          </div>
        </div>
      )}
    </div>
  );
}
