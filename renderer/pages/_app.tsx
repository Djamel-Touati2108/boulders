import React from "react";
import type { AppProps } from "next/app";
import "../styles/app.css";
import useAuth from "../hooks/useAuth";

export default function Boulders({ Component, pageProps }: AppProps) {
  return (
    <div className="w-full h-screen rounded-2xl bg-background overflow-hidden">
      <Component {...pageProps} />
    </div>
  );
}
