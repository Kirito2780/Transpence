import "./LogInPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/Store.tsx";
import { setToken } from "../../Slices/authSlice.tsx";

interface IForm {
  username: string;
  password: string;
}

const LoginPage = () => {
  const [click, setClick] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const token: string | null = useSelector(
    (state: RootState) => state.AuthSlice.token,
  );
  const { reset, handleSubmit, register } = useForm<IForm>();

  const variants = {
    enter: () => ({
      x: 1 > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
  };

  const handleLogIn: SubmitHandler<IForm> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const res = await axios.post(
        "http://172.30.88.250:8000/auth/token/login/",
        formData,
      );
      if (!token) {
        dispatch(setToken(res.data.auth_token));
        localStorage.setItem("token", res.data.auth_token);
      }
      reset();
      navigate("/");
      setLoading(true);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };
  if (loading) {
    return <h2 className={"loading"}>Loading.....</h2>;
  }

  return (
    <div>
      <form className={"LogInForm"} onSubmit={handleSubmit(handleLogIn)}>
        <h1 className={"LogInTitle"}>
          <span className={"LogInTitleFirst"}>Trans</span>
          <span className={"LogInTitleSecond"}>pence</span>
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
        <AnimatePresence>
          <motion.div
            variants={variants}
            initial={"enter"}
            animate={"center"}
            transition={{ duration: 0.3 }}
          >
            <div className={"LogInInputs"}>
              <input
                type="text"
                placeholder={"username"}
                className={"LogInInput"}
                {...register("username", {
                  required: {
                    value: true,
                    message: "this field is required!",
                  },
                })}
              />
              <div className={"LogInInputWrapper"}>
                <input
                  type={click ? "text" : "password"}
                  placeholder={"password"}
                  className={"LogInInput"}
                  {...register("password", {
                    required: {
                      value: true,
                      message: "this field is required!",
                    },
                  })}
                />
                <button
                  type="button"
                  className={"LogInEyeButton"}
                  onClick={() => setClick((prev) => !prev)}
                >
                  {click ? (
                    <svg
                      width="30px"
                      height="30px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.60603 6.08062C2.11366 5.86307 2.70154 6.09822 2.9191 6.60585L1.99995 6.99977C2.9191 6.60585 2.91924 6.60618 2.9191 6.60585L2.91858 6.60465C2.9183 6.604 2.91851 6.60447 2.91858 6.60465L2.9225 6.61351C2.92651 6.62253 2.93339 6.63785 2.94319 6.65905C2.96278 6.70147 2.99397 6.76735 3.03696 6.85334C3.12302 7.02546 3.25594 7.27722 3.43737 7.58203C3.80137 8.19355 4.35439 9.00801 5.10775 9.81932C5.28532 10.0105 5.47324 10.2009 5.67173 10.3878C5.68003 10.3954 5.68823 10.4031 5.69633 10.4109C7.18102 11.8012 9.25227 12.9998 12 12.9998C13.2089 12.9998 14.2783 12.769 15.2209 12.398C16.4469 11.9154 17.4745 11.1889 18.3156 10.3995C19.2652 9.50815 19.9627 8.54981 20.4232 7.81076C20.6526 7.44268 20.8207 7.13295 20.9299 6.91886C20.9844 6.81192 21.0241 6.72919 21.0491 6.67538C21.0617 6.64848 21.0706 6.62884 21.0758 6.61704L21.0808 6.60585C21.2985 6.0985 21.8864 5.86312 22.3939 6.08062C22.9015 6.29818 23.1367 6.88606 22.9191 7.39369L22 6.99977C22.9191 7.39369 22.9192 7.39346 22.9191 7.39369L22.9169 7.39871L22.9134 7.40693L22.9019 7.43278C22.8924 7.4541 22.879 7.48354 22.8618 7.52048C22.8274 7.59434 22.7774 7.69831 22.7115 7.8275C22.5799 8.08566 22.384 8.44584 22.1206 8.86844C21.718 9.5146 21.152 10.316 20.4096 11.1241L21.2071 11.9215C21.5976 12.312 21.5976 12.9452 21.2071 13.3357C20.8165 13.7262 20.1834 13.7262 19.7928 13.3357L18.9527 12.4955C18.3884 12.9513 17.757 13.3811 17.0558 13.752L17.8381 14.9544C18.1393 15.4173 18.0083 16.0367 17.5453 16.338C17.0824 16.6392 16.463 16.5081 16.1618 16.0452L15.1763 14.5306C14.4973 14.7388 13.772 14.8863 13 14.9554V16.4998C13 17.0521 12.5522 17.4998 12 17.4998C11.4477 17.4998 11 17.0521 11 16.4998V14.9556C10.2253 14.8864 9.50014 14.7386 8.82334 14.531L7.83814 16.0452C7.53693 16.5081 6.91748 16.6392 6.45457 16.338C5.99165 16.0367 5.86056 15.4173 6.16177 14.9544L6.94417 13.7519C6.24405 13.3814 5.61245 12.9515 5.04746 12.4953L4.20706 13.3357C3.81654 13.7262 3.18337 13.7262 2.79285 13.3357C2.40232 12.9452 2.40232 12.312 2.79285 11.9215L3.59029 11.1241C2.74529 10.2043 2.12772 9.292 1.71879 8.605C1.5096 8.25356 1.35345 7.95845 1.2481 7.74776C1.19539 7.64234 1.15529 7.55783 1.12752 7.49771C1.11363 7.46765 1.10282 7.44366 1.09505 7.42618L1.08566 7.4049L1.08267 7.39801L1.0816 7.39553L1.08117 7.39453C1.08098 7.39409 1.08081 7.39369 1.99995 6.99977L1.08117 7.39453C0.863613 6.8869 1.0984 6.29818 1.60603 6.08062Z"
                        fill="#1C274C"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="30px"
                      height="30px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                        stroke="#1C274C"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                        stroke="#1C274C"
                        strokeWidth="1.5"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {error ? (
                <span className={"LogInErrorPasswordMessage"}>
                  wrong username or password
                </span>
              ) : null}
            </div>
            <div className={"LogInButtonWrapper"}>
              <button className={"LogInButton"} type={"submit"}>
                Log In
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </form>
    </div>
  );
};

export default LoginPage;
