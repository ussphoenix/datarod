import { useEffect, useState } from "react";

import { ArrowUpIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function ScrollToTop(): React.ReactNode {
  const [visible, setVisible] = useState<boolean>(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
    return () => {
      window.removeEventListener("scroll", toggleVisible);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={clsx(
        "fixed bottom-8 right-8 flex h-10 w-10 items-center justify-center rounded-full bg-lcarsBlue-800 hover:bg-lcarsPurple-100",
        !visible && "hidden",
      )}
    >
      <ArrowUpIcon className="size-6 text-white" />
    </button>
  );
}
