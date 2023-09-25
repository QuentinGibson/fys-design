import clsx from "clsx";
import { useEffect, useState } from "react";
import { BsX } from "react-icons/bs";

interface FlashMessageProps {
  message: flashMessage
}

export default function FlashMessage({ message }: FlashMessageProps) {
  const [hide, setHide] = useState(false)
  const hideFlash = () => {
    setHide(true)
  }
  useEffect(() => {
    setHide(false)
  }, [message])
  return (
    <div className={
      clsx(
        "absolute duration-1000 transform top-0",
        hide && "opacity-0 hidden"
      )}>
      {message.message &&
        <div className={
          clsx(
            "flex justify-center font-sauce py-2 item-center",
            message.level === "SUCCESS" && "bg-emerald-500",
            message.level === "ERROR" && "bg-red-500",
          )}
        >
          {message.message}
          <button className="absolute right-10 top-3" onClick={hideFlash}>
            <BsX />
          </button>
        </div>
      }
    </div>
  );
};
