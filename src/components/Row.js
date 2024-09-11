import React from "react";

export default function Row({ children, className }) {
  return (
    <div className={`w-[96%] md:w-[80%] md:max-w-screen-lg mx-auto ${className}`}>
      {children}
    </div>
  );
}
