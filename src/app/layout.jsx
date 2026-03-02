import "@/styles/index.css";
import Providers from "./providers";

export const metadata = {
  title: "Pacific Market",
  description: "Pacific Market Registry",
  icons: {
    icon: "/pm_favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
