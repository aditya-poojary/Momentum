import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../store/projectsSlice";

export default function ProjectFilter() {
  const filter = useSelector((state) => state.projects.filter);
  const dispatch = useDispatch();

  const categories = ["All", "Must do", "Should Do", "Can do"];

  const handleSetFilter = (category) => {
    console.log("Setting filter to:", category); // Debug
    dispatch(setFilter(category));
  };

  return (
    <div className="flex gap-3 p-3 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleSetFilter(category)}
          className={`flex h-8 items-center justify-center gap-x-2 rounded-xl pl-4 pr-4 transition-colors duration-200 ${
            filter === category
              ? "bg-[#d0dbe6]"
              : "bg-[#e7edf3] hover:bg-[#d0dbe6]"
          }`}
        >
          <p className="text-[#0e141b] text-sm font-medium">{category} Tasks</p>
        </button>
      ))}
    </div>
  );
}
