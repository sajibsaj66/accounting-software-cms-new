import "./../globals.css";
import ClientLayout from "@/component/ClientLayout";

export const metadata = {
  title: "Salis ERP",
  description: "CRM Dashboard",
};

export default function RootLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
}
