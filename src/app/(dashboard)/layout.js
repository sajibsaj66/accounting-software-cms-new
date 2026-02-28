import "./../globals.css";
import ClientLayout from "@/component/ClientLayout";

export const metadata = {
  title: "CRM Pro",
  description: "CRM Dashboard",
};

export default function RootLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
}
