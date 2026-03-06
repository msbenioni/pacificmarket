import "@/styles/index.css";
import Providers from "./providers";
import { HydrationErrorSuppressor } from "@/components/shared/HydrationErrorSuppressor";

export const metadata = {
  title: "Pacific Market",
  description: "Pacific Market",
  icons: {
    icon: "/pm_favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <HydrationErrorSuppressor />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
