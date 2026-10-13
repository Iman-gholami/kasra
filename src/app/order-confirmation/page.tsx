import { Confirmation } from "@/components/confirmation";
export const metadata = {
  title: "تأیید نمایشی",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <div className="container page">
      <Confirmation />
    </div>
  );
}
