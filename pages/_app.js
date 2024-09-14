import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react"
import GoogleAnalytics from "./GoogleAnalytics";

export default function App({ Component, pageProps }) {
  return <>
    <Component {...pageProps} />
    <GoogleAnalytics />
  </>;
}
