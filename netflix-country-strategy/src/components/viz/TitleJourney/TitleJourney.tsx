import { useMemo } from "react";
import { useStoryStore } from "../../../state/storyStore";
import type { TitleDatum } from "../../../data/model/types";
import type { NodeDatum } from "./types";
import { DotStage } from "./DotStage";

export function TitleJourney({ data }: { data: TitleDatum[] }) {
  const chapterKey = useStoryStore((s) => s.chapterKey());
  const focus = useStoryStore((s) => s.focus);

  // Convert once to nodes (keep minimal)
  const nodes = useMemo(() => data.map((d) => ({ ...d })) as NodeDatum[], [data]);

  return (
    <DotStage data={nodes} chapter={chapterKey} focus={focus} />
  );
}
