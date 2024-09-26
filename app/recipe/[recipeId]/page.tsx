"use client";

import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
// Import Swiper React components

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import DefaultThumbnail from "@/components/share/DefaultThumbnail";
import Link from "next/link";

// recipe/[recipeId]
export default function RecipePage() {
  const { recipeId } = useParams();
  const supabase = useSupabaseBrowser();
  const router = useRouter();

  const recipeQuery = useQuery({
    queryKey: ["drippin", "recipe", recipeId],
    queryFn: async () => {
      const { data } = await supabase
        .from("recipes")
        .select("*, profiles(handle, email)")
        .eq("id", recipeId)
        .maybeSingle();

      return data;
    },
  });

  if (recipeQuery.isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="sticky top-0 flex flex-row gap-2 items-center text-xl font-bold z-[50] bg-white justify-between px-2 py-2">
        <div className="flex flex-row gap-2 items-center">
          <ArrowLeft className="size-8" onClick={() => router.back()} />
          {recipeQuery.data?.recipe_name}
        </div>
        <div>
          <Link href={`/recipe/${recipeId}/timer`}>
            <button className="btn btn-sm btn-outline">레시피 시작</button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative w-full aspect-[1/1]">
          {recipeQuery.data?.image_url ? (
            <Image
              src={recipeQuery.data?.image_url}
              alt="recipe image"
              fill
              className="object-cover"
            />
          ) : (
            <DefaultThumbnail
              title={recipeQuery.data?.recipe_name || ""}
              handle={recipeQuery.data?.profiles?.handle || ""}
            />
          )}
        </div>
        <div
          className="px-2"
          dangerouslySetInnerHTML={{
            __html: recipeQuery.data?.recipe_description || "",
          }}
        />
      </div>
    </>
  );
}
