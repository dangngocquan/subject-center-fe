import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Course {
  day?: string;
  name: string;
  time?: string;
  score?: number;
}

export interface Grade {
  label: string;
  score: number;
}

export interface ScheduleCard {
  title: string;
  subtitle: string;
  time?: string;
}
