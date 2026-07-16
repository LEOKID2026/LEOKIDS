import { useEffect, useState } from "react";
import Link from "next/link";

export default function OfflineReconnectBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (online) {
    return (
      <div
        className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-900"
        dir="ltr"
      >
        Connection restored -{" "}
        <Link href="/student/login" className="font-bold text-emerald-800 underline underline-offset-2">
          Back to the app
        </Link>
      </div>
    );
  }

  return null;
}
