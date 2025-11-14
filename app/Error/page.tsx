"use client";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Unknown error";
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Login Error</h1>
      <p>{error}</p>
      <a href="/Login">Volver al login</a>
    </div>
  );
}
