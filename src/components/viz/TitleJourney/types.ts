import type { TitleDatum } from "../../../data/model/types";

export type NodeDatum = TitleDatum & {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
};
