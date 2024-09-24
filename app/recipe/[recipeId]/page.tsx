"use client";

import AreaStepChart from "@/components/charts/AreaStepChart";
import LineStepChart from "@/components/charts/LineStepChart";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

// recipe/[recipeId]
export default function RecipePage() {
  const { recipeId } = useParams();
  const supabase = useSupabaseBrowser();

  const recipeQuery = useQuery({
    queryKey: ["drippin", "recipe", recipeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*, profiles(handle, email)")
        .eq("id", recipeId)
        .maybeSingle();

      console.log(data);

      return data;
    },
  });

  if (recipeQuery.isLoading) return <div>Loading...</div>;

  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];

  const makeChartData = () => {
    const rawBrewingInfo = JSON.parse(
      recipeQuery.data?.raw_brewing_info as string,
    );

    const brewingInfo = rawBrewingInfo?.filter(
      (value: any) => value.time && value.water,
    );

    const chartData = brewingInfo?.map((value: any, index: number) => {
      // 자기 order 이전의 time, water 누적
      const prevBrewingInfo = brewingInfo.slice(0, index);
      const prevTime = prevBrewingInfo.reduce(
        (acc: number, curr: any) => acc + curr.time,
        0,
      );
      const prevWater = prevBrewingInfo.reduce(
        (acc: number, curr: any) => acc + curr.water,
        0,
      );

      const label = value.label;
      const time = value.time;
      const water = value.water;

      return {
        label: label,
        time: prevTime + time,
        water: prevWater + water,
      };
    });

    // chartData 맨 앞에 water 0, time 0 추가
    return [{ time: 0, water: 0 }, ...chartData];
  };

  return (
    <div>
      <AreaStepChart
        chartData={makeChartData()}
        xAxisDataKey="time"
        yAxisDataKey="water"
      />
    </div>
  );
}
