"use client";

import { Activity, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { secToKoreanTime } from "@/utils/utils";

export const description = "A step area chart";

const chartConfig = {
  label: {
    label: "label",
    color: "hsl(var(--chart-1))",
    icon: Activity,
  },
  water: {
    label: "물",
    color: "hsl(var(--chart-1))",
    icon: Activity,
  },
  time: {
    label: "시간",
    color: "hsl(var(--chart-1))",
    icon: Activity,
  },
} satisfies ChartConfig;

export default function AreaStepChart({
  chartData,
  xAxisDataKey,
  yAxisDataKey,
}: {
  chartData: any;
  xAxisDataKey: string;
  yAxisDataKey: string;
}) {
  console.log(chartData);

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 24,
          left: 12,
          right: 24,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xAxisDataKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            if (value === 0) return "";
            return secToKoreanTime(value);
          }}
        />
        <YAxis
          dataKey={yAxisDataKey}
          type="number"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          tickFormatter={(value) => {
            return value + "g";
          }}
        />
        <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
        <Area
          dataKey={yAxisDataKey}
          type="step"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
