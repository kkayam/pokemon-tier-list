import "@/styles/globals.css";
import GoogleAnalytics from "./GoogleAnalytics";

export default function App({ Component, pageProps }) {
  return <>
    <Component {...pageProps} />
    <GoogleAnalytics />
  </>;
}
