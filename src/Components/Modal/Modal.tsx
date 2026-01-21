import { createPortal } from "react-dom";
import "./Modal.css";
import { motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  children: ReactNode;
};

const Modal = ({ children, open }: ModalProps) => {
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
    active: { scale: 1, opacity: 1 },
    inactive: { scale: 0, opacity: 0 },
  };

  return createPortal(
    <div className={open ? "ModalBackground" : ""}>
      <motion.dialog
        variants={variants}
        animate={open ? "active" : "inactive"}
        ref={dialog}
        className="Modal"
      >
        {children}
      </motion.dialog>
    </div>,
    document.getElementById("modal") as HTMLElement,
  );
};
export default Modal;
