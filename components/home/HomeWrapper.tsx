"use client";

import { useEffect, useState } from "react";
import SearchIcon from "../icon/SearchIcon";
import RecipeCard from "./RecipeCard";
import LogCard from "./LogCard";

export default function HomeWrapper() {
  const [selectedTab, setSelectedTab] = useState<string>("레시피");

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between px-3 pt-4 items-center">
        <div>
          <div
            role="tablist"
            className="tabs gap-[15px] tabs-bordered tabs-lg xs:tabs-sm"
          >
            <input
              type="radio"
              name="my_tabs"
              role="tab"
              className="tab"
              aria-label="레시피"
              style={{
                borderColor: selectedTab !== "레시피" ? "transparent" : "#000",
              }}
              checked={selectedTab === "레시피"}
              onChange={() => {
                setSelectedTab("레시피");
              }}
            />
            <input
              type="radio"
              name="my_tabs"
              role="tab"
              className="tab"
              aria-label="일지"
              style={{
                borderColor: selectedTab !== "일지" ? "transparent" : "#000",
              }}
              checked={selectedTab === "일지"}
              onChange={() => {
                setSelectedTab("일지");
              }}
            />
          </div>
        </div>

        <div>
          <SearchIcon />
        </div>
      </div>

      <div className="mt-5 px-3">
        <div className="carousel w-full">
          {selectedTab === "레시피" && (
            <div
              id="slide1"
              className="carousel-item relative w-full gap-3 flex-col flex"
            >
              <RecipeCard />
              <RecipeCard />
              <RecipeCard />
              <RecipeCard />
              <RecipeCard />
              <RecipeCard />
              <RecipeCard />
              <RecipeCard />
              <RecipeCard />
            </div>
          )}

          {selectedTab === "일지" && (
            <div
              id="slide2"
              className="carousel-item relative w-full gap-3 flex-col flex"
            >
              <LogCard />
              <LogCard />
              <LogCard />
              <LogCard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
