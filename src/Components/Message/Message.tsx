import "./Message.css";
import { type ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

type MessageProps = {
  setOpen: (isOpen: boolean) => void;
  open: boolean;
  error: boolean;
  children: ReactNode;
};

export const Message = ({ error, open, setOpen, children }: MessageProps) => {
  const dialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialog.current) return;

    if (open) {
      dialog.current.show();
    } else {
      dialog.current.close();
    }
  }, [open]);

  const variants = {
    animate: { width: "400px", height: "100px", opacity: 1 },
    initial: { width: "0px", height: "0px", opacity: 0 },
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.dialog
          onClick={() => setOpen(false)}
          variants={variants}
          animate={open ? "animate" : "initial"}
          className={!error ? "Message" : "ErrorMessage"}
          ref={dialog}
        >
          {children}
        </motion.dialog>
      )}
    </AnimatePresence>,
    document.getElementById("message") as HTMLElement,
  );
};
