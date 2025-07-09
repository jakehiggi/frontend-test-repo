"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Log In</h1>
      <form className="space-y-4">
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Button type="submit" className="w-full">Log In</Button>
      </form>
    </div>
  );
}
