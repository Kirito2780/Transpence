import { type SubmitHandler, useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import "./RegisterPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const navigate = useNavigate();

  const onRegister: SubmitHandler<IForm> = (data) => {
    const formData = new FormData();

    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.file && data.file.length > 0) {
      formData.append("file", data.file[0]);
    }

    axios
      .post("http://172.30.88.250:8000/auth/users/", formData)
      .then((res) => {
        console.log("success", res);
      })
      .catch((err) => {
        console.log("error", err);
      });
    alert(`Register successfully,Check ${data.email} to log in`);
    reset();
    navigate("/regilog");
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
        <input
          type="file"
          id={"fileUpload"}
          accept={".xlsx"}
          {...register("file")}
        />
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
      <button
        className={"BackToRegiLog"}
        type="button"
        onClick={() => navigate("/regilog")}
      >
        <svg
          width="25px"
          height="25px"
          viewBox="0 0 32 32"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>arrow-left-circle</title>
          <desc>Created with Sketch Beta.</desc>
          <defs></defs>
          <g
            id="Page-1"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="Icon-Set"
              transform="translate(-256.000000, -1087.000000)"
              fill="gray"
            >
              <path
                d="M279,1102 L268.414,1102 L272.536,1097.88 C272.926,1097.49 272.926,1096.86 272.536,1096.46 C272.145,1096.07 271.512,1096.07 271.121,1096.46 L265.464,1102.12 C265.225,1102.36 265.15,1102.69 265.205,1103 C265.15,1103.31 265.225,1103.64 265.464,1103.88 L271.121,1109.54 C271.512,1109.93 272.145,1109.93 272.536,1109.54 C272.926,1109.15 272.926,1108.51 272.536,1108.12 L268.414,1104 L279,1104 C279.552,1104 280,1103.55 280,1103 C280,1102.45 279.552,1102 279,1102 L279,1102 Z M272,1117 C264.268,1117 258,1110.73 258,1103 C258,1095.27 264.268,1089 272,1089 C279.732,1089 286,1095.27 286,1103 C286,1110.73 279.732,1117 272,1117 L272,1117 Z M272,1087 C263.164,1087 256,1094.16 256,1103 C256,1111.84 263.164,1119 272,1119 C280.836,1119 288,1111.84 288,1103 C288,1094.16 280.836,1087 272,1087 L272,1087 Z"
                id="arrow-left-circle"
              ></path>
            </g>
          </g>
        </svg>
      </button>
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
          transition={{ duration: 0.3 }}
        >
          {formSteps[step]}
        </motion.div>
      </AnimatePresence>
    </form>
  );
};

export default RegisterPage;
