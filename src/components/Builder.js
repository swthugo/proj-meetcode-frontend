import React from "react";

export default function Builder({ className, children }) {
  return (
    <main className={`w-screen h-screen max-h-screen overflow-hidden p-4 ${className}`}>
      {children}
    </main>
  );
}
