import { type SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/Store.ts";
import { AnimatePresence, motion } from "framer-motion";
import { setToken } from "../../Slices/authSlice.tsx";
import { useDispatch } from "react-redux";
import { setCurrency } from "../../Slices/currencySlice.tsx";
import { API_URL } from "../../api/api.ts";
import useFetch from "../../Hooks/useFetch.ts";

interface ProfileSection {
  email: string;
  id: number;
  username: string;
}
interface INewNameResponse {
  detail: string;
  username: string;
}
interface INewEmailResponse {
  detail: string;
  email: string;
}

interface INewCurrencyArray {
  currency: SetStateAction<string[]>;
}
interface INewPasswordResponse {
  new_password: string;
  current_password: string;
}
interface ProfileSectionProps {
  setError: (value: boolean) => void;
  setTextMessage: (m: string) => void;
  setMessage: (message: boolean) => void;
  setChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfilePage = ({ ...props }: ProfileSectionProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [change, setChange] = useState<boolean>(false);
  const [oldUsername, setOldUsername] = useState<string>("");
  const [oldEmail, setOldEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [deleteUser, setDeleteUser] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(false);
  const [currencyList, setCurrencyList] = useState<string[]>([]);
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const currency = useSelector(
    (state: RootState) => state.CurrencySlice.currency,
  );
  const getUserData = useFetch<ProfileSection>(
    "get",
    `${API_URL}/auth/users/me/`,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  const data = getUserData.state;
  const deleteUserRequest = useFetch(
    "delete",
    `${API_URL}/auth/users/me/`,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    },
    false,
  );
  const changeUserUsername = useFetch<INewNameResponse>(
    "post",
    `${API_URL}/auth/users/set_username/`,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    },
    false,
  );
  const changeUserEmail = useFetch<INewEmailResponse>(
    "post",
    `${API_URL}/auth/users/set_email/`,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    },
    false,
  );
  const changeUserPassword = useFetch<INewPasswordResponse>(
    "post",
    `${API_URL}/auth/users/set_password/`,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    },
    false,
  );
  const getCurrency = useFetch<INewCurrencyArray>(
    "get",
    `${API_URL}/currency/`,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    },
    false,
  );

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      dispatch(setCurrency(savedCurrency));
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData.fetchData();
        if (response?.status == 404) {
          navigate("/regilog");
        }
        if (response) {
          setEmail(response.data.email);
          setUsername(response.data.username);
          setOldEmail(response.data.email);
          setOldUsername(response.data.username);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchUserData();
  }, [fetching]);

  const changeInputs = [
    <input
      className={"ChangeInputs"}
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />,
    <input
      className={"ChangeInputs"}
      type="text"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />,
    <input
      className={"ChangeInputs"}
      type="text"
      placeholder={"currentPassword"}
      onChange={(e) => setCurrentPassword(e.target.value)}
    />,
    <input
      className={"ChangeInputs"}
      type="text"
      placeholder={"newPassword"}
      onChange={(e) => setNewPassword(e.target.value)}
    />,
  ];

  const handleCancel = () => {
    if (data) {
      setUsername(data.username);
      setEmail(data.email);
      setCurrentPassword("");
      setNewPassword("");
    }
    setChange(false);
  };

  const handleChanges = async () => {
    try {
      setFetching(true);
      if (oldUsername != username) {
        try {
          const formDataUsername = new FormData();
          formDataUsername.append("new_username", username);

          const nameResponse =
            await changeUserUsername.fetchData(formDataUsername);

          if (nameResponse.status == 400) {
            props.setTextMessage(nameResponse.data.detail);
            props.setError(true);
            props.setMessage(true);
            return;
          }

          setUsername(nameResponse.data.username);
          setOldUsername(nameResponse.data.username);

          props.setMessage(true);
          props.setTextMessage(nameResponse.data.detail);
          props.setError(false);

          props.setChanges((prev: boolean) => !prev);
        } catch (e) {
          console.log(e);
          props.setMessage(true);
          props.setError(true);
        } finally {
          setFetching(false);
        }
      }
      if (oldEmail != email) {
        try {
          const formDataEmail = new FormData();
          formDataEmail.append("email", email);
          const emailResponse = await changeUserEmail.fetchData(formDataEmail);
          setEmail(emailResponse.data.email);
          setOldEmail(emailResponse.data.email);
          props.setMessage(true);
          props.setTextMessage(emailResponse.data.detail);
          props.setError(false);
          setFetching(false);

          if (emailResponse.status == 400) {
            props.setTextMessage(emailResponse.data.detail);
            props.setError(true);
            props.setMessage(true);
            return;
          }
        } catch (e) {
          console.log(e);
          props.setMessage(true);
          props.setError(true);
        }
      }
      if (
        currentPassword.length > 0 &&
        newPassword.length > 0 &&
        newPassword != currentPassword
      ) {
        try {
          const formDataPassword = new FormData();
          formDataPassword.append("new_password", newPassword);
          formDataPassword.append("current_password", currentPassword);
          const passwordResponse =
            await changeUserPassword.fetchData(formDataPassword);
          console.log(passwordResponse.status);
          props.setMessage(true);
          setFetching(false);
          props.setError(false);
        } catch (e) {
          console.log(e);
          props.setMessage(true);
          props.setError(true);
        }
      }
    } catch (e) {
      console.log(e);
    }

    setChange((prev) => !prev);
  };
  const handleDelete = async () => {
    try {
      await deleteUserRequest.fetchData({
        current_password: currentPassword,
      });
      localStorage.removeItem("token");
      dispatch(setToken(null));
      navigate("/regilog");
    } catch (e) {
      console.log(e);
    }
  };

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 0 },
    visible: { opacity: 1, y: 20 },
  };
  useEffect(() => {
    const getCurrencyFetch = async () => {
      try {
        const currencyResponse = await getCurrency.fetchData();
        console.log(getCurrency.state);
        if (currencyResponse?.data.currency.length > 0) {
          setCurrencyList(currencyResponse.data.currency);
        }
      } catch (e) {
        console.log(e);
      }
    };
    void getCurrencyFetch();
  }, []);

  return (
    <motion.section
      className={"ProfileSection"}
      initial={{ x: "-500px" }}
      animate={{ x: 0 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
    >
      <div className={"ProfileBio"}>
        {!deleteUser ? (
          <>
            {change ? (
              <>
                <AnimatePresence>
                  <motion.div
                    variants={container}
                    className="ChangeInputsWrapper"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {changeInputs.map((inputEl, index) => (
                      <motion.div
                        className={"ChangeInputs"}
                        initial={{ opacity: 0, y: 0 }}
                        variants={item}
                        animate={{ opacity: 1, y: 20 }}
                        exit={{ opacity: 0, y: 20 }}
                        key={index}
                      >
                        {inputEl}
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </>
            ) : (
              <>
                <h2 className={"ProfileNickname"}>{data?.username}</h2>
                <p className={"ProfileEmail"}>{data?.email}</p>
                <select
                  className={"currencySelector"}
                  name="currency"
                  id="currency"
                  value={currency}
                  onChange={(e) => {
                    dispatch(setCurrency(e.target.value));
                    localStorage.setItem("currency", e.target.value);
                  }}
                >
                  {currencyList.map((e, index) => (
                    <option value={e} key={index}>
                      {e}
                    </option>
                  ))}
                </select>
              </>
            )}
          </>
        ) : (
          <>
            <h2 className={"deleteHeader"}>Are you sure?????</h2>
            <input
              className={"ChangeInputsDelete"}
              type="text"
              placeholder={"currentPassword"}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </>
        )}
      </div>
      <div className={"ProfileButtons"}>
        {!deleteUser ? (
          <>
            {change ? (
              <button className={"ProfileButton"} onClick={handleChanges}>
                Confirm
              </button>
            ) : (
              <button
                className={"ProfileButton"}
                onClick={() => {
                  setUsername(data ? data.username : "");
                  setEmail(data ? data.email : "");
                  setChange((prev) => !prev);
                }}
              >
                Change
              </button>
            )}
            {change ? (
              <button onClick={handleCancel} className={"ProfileButtonDelete"}>
                Cancel
              </button>
            ) : (
              <button
                className={"ProfileButtonDelete"}
                onClick={() => setDeleteUser(true)}
              >
                Delete
              </button>
            )}
          </>
        ) : (
          <>
            <button
              className={
                currentPassword.length == 0
                  ? "ProfileButtonDeleteDisabled"
                  : "ProfileButtonDelete"
              }
              onClick={handleDelete}
              disabled={currentPassword.length == 0}
            >
              Yes
            </button>
            <button
              className={"ProfileButton"}
              onClick={() => setDeleteUser(false)}
            >
              No
            </button>
          </>
        )}
      </div>
    </motion.section>
  );
};

export default ProfilePage;
