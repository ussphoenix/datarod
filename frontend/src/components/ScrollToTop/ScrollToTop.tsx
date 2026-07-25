import { useEffect, useState } from "react";

import { ArrowUpIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function ScrollToTop(): React.JSX.Element {
  const [visible, setVisible] = useState<boolean>(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(document.documentElement.scrollTop > 300);
    };
    window.addEventListener("scroll", toggleVisible);
    return () => {
      window.removeEventListener("scroll", toggleVisible);
    };
  }, []);

  return (
    <button
      type="button"
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
