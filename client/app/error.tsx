"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="container flex flex-col items-center justify-center gap-y-6 text-center">
      <h1>Bad Request</h1>
      <p>Sorry, we couldn&apos;t find the resources you requested.</p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
