"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const pageName = pathname.split("/").slice(-1).join("");

  const [showPrevious, setShowPrevious] = useState(false);

  useEffect(() => {
    setShowPrevious(pathname !== "/");
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-blue-900 text-white p-3 flex items-center">
      {showPrevious && (
        <Link href="/">
          <svg
            className="w-[24px] mr-4 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
          >
            <path d="M14 5.25L3.25 16 14 26.75V20h14v-8H14zM27 13v6H13v5.336L4.664 16 13 7.664V13z" />
            <path fill="none" d="M0 0h32v32H0z" />
          </svg>
        </Link>
      )}
      <div className="flex w-full align-baseline">
        <h3>Global Power Plants</h3>
        {showPrevious && (
          <span className="flex items-center ml-4 text-xs">
            ({decodeURI(pageName)})
          </span>
        )}
      </div>
    </header>
  );
}
