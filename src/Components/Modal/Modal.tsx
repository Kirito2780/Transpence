import { createPortal } from "react-dom";
import "./Modal.css";
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

  return createPortal(
    <div className={open ? "ModalBackground" : ""}>
      <dialog ref={dialog} className="Modal">
        {children}
      </dialog>
    </div>,
    document.getElementById("modal") as HTMLElement,
  );
};
export default Modal;
