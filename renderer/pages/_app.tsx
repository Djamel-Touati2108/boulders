import React from "react";
import type { AppProps } from "next/app";
import "../styles/app.css";
import useAuth from "../hooks/useAuth";
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Boulders({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId="102002937120-074tdfupgs0h1v4hnjljqf8jlh2fb83h.apps.googleusercontent.com">
    <div className="w-full h-screen rounded-2xl bg-background overflow-hidden">
      <Component {...pageProps} />
    </div>
    </GoogleOAuthProvider>
  );
}
