import type { ReactNode } from "react";
import { Mafs, Coordinates } from "mafs";
import "mafs/core.css";

interface Props {
  width?: number;
  height?: number;
  xRange?: [number, number];
  yRange?: [number, number];
  children?: ReactNode;
}

export function Graph2D({
  width = 400,
  height = 300,
  xRange = [-4, 4],
  yRange = [-3, 3],
  children,
}: Props) {
  return (
    <Mafs
      width={width}
      height={height}
      viewBox={{ x: xRange, y: yRange }}
      preserveAspectRatio={false}
    >
      <Coordinates.Cartesian
        xAxis={{ lines: 1 }}
        yAxis={{ lines: 1 }}
      />
      {children}
    </Mafs>
  );
}
