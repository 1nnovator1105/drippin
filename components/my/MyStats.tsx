"use client";

import { useQuery } from "@tanstack/react-query";
import useSupabaseBrowser from "@/utils/supabase/client";
import useSession from "@/hooks/useSession";
import { fetchMyStats } from "@/queries/stats";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex-1 rounded-lg bg-stone-50 py-3 text-center">
      <div className="text-lg font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export default function MyStats() {
  const supabase = useSupabaseBrowser();
  const sessionQuery = useSession();
  const userId = sessionQuery.data?.session?.user.id;

  const statsQuery = useQuery({
    queryKey: ["drippin", "stats", userId],
    queryFn: () => fetchMyStats(supabase, userId!),
    enabled: !!userId,
  });

  const stats = statsQuery.data;
  if (!stats) return null;

  return (
    <div className="form-control w-full mt-4">
      <div className="label flex flex-col items-start justify-start">
        <p className="label-text text-base">내 기록 요약</p>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-stone-200 bg-white p-4">
        <div className="flex gap-2">
          <StatBox label="일지" value={stats.totalLogs} />
          <StatBox label="레시피" value={stats.totalRecipes} />
          <StatBox label="이번 달" value={`${stats.thisMonthCount}잔`} />
        </div>

        <div>
          <p className="mb-1 text-xs text-muted-foreground">최근 6개월 일지</p>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthly}>
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                  fill="hsl(var(--brand))"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {stats.topPlaces.length > 0 && (
          <div>
            <p className="mb-1 text-xs text-muted-foreground">자주 마신 곳</p>
            <div className="flex flex-col gap-1">
              {stats.topPlaces.map((p) => (
                <div
                  key={p.name}
                  className="flex justify-between text-sm text-foreground"
                >
                  <span className="truncate">{p.name}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {p.count}회
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.topTags.length > 0 && (
          <div>
            <p className="mb-1 text-xs text-muted-foreground">자주 쓴 태그</p>
            <div className="flex flex-wrap gap-1.5">
              {stats.topTags.map((t) => (
                <span
                  key={t.tag}
                  className="rounded-full bg-brand-soft px-2 py-1 text-xs text-brand"
                >
                  #{t.tag} · {t.count}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
