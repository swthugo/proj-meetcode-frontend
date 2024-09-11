import React from "react";

export default function Header() {
  return (
    <header className="space-y-4">
      <div className="flex flex-col gap-6 justify-center align-center">
        <a href="/">Home</a>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      </div>
      <div className="space-y-4">
        <nav className="flex flex-col justify-start ">
          <h2 className="text-xl">User</h2>
          <a href="/problem">Dashboard</a>
          <a href="/problem/1">Question 1</a>
          <a href="/problem/2">Question 2</a>
        </nav>
        <nav className="flex flex-col justify-start ">
          <h2 className="text-xl">Admin</h2>
          <a href="/admin/dashboard">Admin Dashboard</a>
          <a href="/admin/edit/1">Edit Question 1</a>
          <a href="/admin/edit/2">Edit Question 2</a>
          <a href="/admin/edit/new">Add New</a>
        </nav>
        <nav></nav>
      </div>
    </header>
  );
}
