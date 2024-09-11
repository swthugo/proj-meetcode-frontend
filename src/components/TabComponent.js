import React from "react";

export function TabButton({ label, icon, isActive, onClick }) {
  const tabStyle =
    "pl-2 pr-3 py-1 text-sm font-medium cursor-pointer rounded-md hover:bg-gray-200 flex items-center gap-1.5";
  return (
    <div
      className={`${tabStyle} ${isActive ? "opacity-80" : "opacity-50"}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

export default function TabBar({ children }) {
  return (
    <div className="tab-bar flex items-center gap-1 p-1 bg-gray-50 ">
      {children}
    </div>
  );
}

export function TabDivier() {
  return <div className="w-[1px] h-4 rounded bg-slate-300"></div>;
}

export function TabSection({ isActive, children, className }) {
  const tabSectionStyle = "p-4 w-full h-full min-w-96 overflow-auto";

  return (
    <div
      className={`${tabSectionStyle} ${className} ${
        isActive ? "block" : "hidden"
      }`}
    >
      {children}
    </div>
  );
}
