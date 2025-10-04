import { type SubmitHandler, useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import "./RegisterPage.css";
import { useState } from "react";

interface IForm {
  username: string;
  email: string;
  password: string;
  file?: FileList;
}

const RegisterPage = () => {
  const {
    reset,
    handleSubmit,
    formState: { errors },
    register,
    trigger,
  } = useForm<IForm>({ mode: "onBlur" });
  const [progress, setProgress] = useState<number>(50);
  const [step, setStep] = useState<number>(0);
  const [stepDirection, setStepDirection] = useState<number>(1);

  const onRegister: SubmitHandler<IForm> = () => {
    reset();
    alert("asdadasa");
  };
  const nextForm = async () => {
    const isValid = await trigger(["username", "email", "password"]);
    if (!isValid) return;
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
      <div className={"RegisterInputs"}>
        <input
          type="text"
          className={"RegisterInput"}
          placeholder={"username"}
          {...register("username", {
            required: "field is required",
            minLength: {
              value: 5,
              message: "Username is too short",
            },
          })}
        />
        {errors.username && (
          <span className={"RegisterErrorUserNameMessage"}>
            {errors.username.message}
          </span>
        )}
        <input
          type="text"
          className={"RegisterInput"}
          placeholder={"email"}
          {...register("email", {
            required: "field is required",
            pattern: {
              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              message: "enter valid email",
            },
          })}
        />
        {errors.email && (
          <span className={"RegisterErrorEmailMessage"}>
            {errors.email.message}
          </span>
        )}
        <input
          type="text"
          className={"RegisterInput"}
          placeholder={"password"}
          {...register("password", {
            required: "field is required",
            minLength: {
              value: 6,
              message: "password is too short",
            },
          })}
        />
        {errors.password && (
          <span className={"RegisterErrorPasswordMessage"}>
            {errors.password.message}
          </span>
        )}
      </div>
      <div className={"RegisterButtonFirstWrapper"}>
        <button
          type={"button"}
          onClick={nextForm}
          className={"RegisterButtonFirst"}
          disabled={
            errors.password || errors.email || errors.username ? true : false
          }
        >
          next step
        </button>
      </div>
    </>,
    <div>
      <button
        type={"button"}
        onClick={backForm}
        className={"RegisterButtonBack"}
      >
        back
      </button>
      <div className={"fileUploader"}>
        <label className={"customFileUpload"} htmlFor={"fileUpload"}>
          Choose file
        </label>
        <input type="file" id={"fileUpload"} />
      </div>
      <div className={"RegisterButtonFirstWrapper"}>
        <button type={"submit"} className={"RegisterButtonFirst"}>
          confirm
        </button>
      </div>
    </div>,
  ];

  return (
    <form onSubmit={handleSubmit(onRegister)} className={"registerForm"}>
      <h1 className={"RegisterTitle"}>
        <span className={"RegisterTitleFirst"}>Trans</span>
        <span className={"RegisterTitleSecond"}>pence</span>
      </h1>
      <div className={"RegisterProgressWrapper"}>
        <progress
          value={progress}
          max={100}
          className={"RegisterProgress"}
        ></progress>
      </div>
      <AnimatePresence>
        <motion.div
          className={"RegisterMotion"}
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

export default RegisterPage;
