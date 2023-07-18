import { SWRConfig } from "swr";
import "../global.css";

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function App({ Component, pageProps }: any) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <script
        defer
        src="https://developers.kakao.com/sdk/js/kakao.min.js"
      ></script>
      <div className="w-full">
        <div className="max-w-lg m-auto">
          <Component {...pageProps} />
        </div>
      </div>
    </SWRConfig>
  );
}
