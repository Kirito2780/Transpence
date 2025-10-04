import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import "./LogInPage.css";
import { useState } from "react";

const LogInPage = () => {
  const { reset, handleSubmit } = useForm();
  const [progress, setProgress] = useState<number>(50);
  const [step, setStep] = useState<number>(0);
  const [stepDirection, setStepDirection] = useState<number>(1);

  const onRegister = () => {
    reset();
  };
  const nextForm = () => {
    setStepDirection(1);
    setStep(1);
    setProgress(100);
  };
  const backForm = () => {
    setStepDirection(-1);
    setStep(0);
    setProgress(50);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const formSteps = [
    <>
      <div className={"LogInInputs"}>
        <input type="text" className={"LogInInput"} placeholder={"username"} />
        <input type="text" className={"LogInInput"} placeholder={"email"} />
        <input type="text" className={"LogInInput"} placeholder={"password"} />
      </div>
      <div className={"LogInButtonFirstWrapper"}>
        <button onClick={nextForm} className={"LogInButtonFirst"}>
          click me
        </button>
      </div>
    </>,
    <div>
      <button onClick={backForm} className={"LogInButtonBack"}>
        back
      </button>
      <div className={"fileUploader"}>
        <label className={"customFileUpload"} htmlFor={"fileUpload"}>
          Choose file
        </label>
        <input type="file" id={"fileUpload"} />
      </div>
    </div>,
  ];

  return (
    <form onSubmit={handleSubmit(onRegister)} className={"registerForm"}>
      <h1 className={"LogInTitle"}>
        <span className={"LogInTitleFirst"}>Trans</span>
        <span className={"LogInTitleSecond"}>pence</span>
      </h1>
      <div className={"LogInProgressWrapper"}>
        <progress
          value={progress}
          max={100}
          className={"LogInProgress"}
        ></progress>
      </div>
      <AnimatePresence>
        <motion.div
          className={"LogInMotion"}
          variants={variants}
          custom={stepDirection}
          key={step}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
        >
          {formSteps[step]}
        </motion.div>
      </AnimatePresence>
    </form>
  );
};

export default LogInPage;
