import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/Store.tsx";
import { AnimatePresence, motion } from "framer-motion";
import { setToken } from "../../Slices/authSlice.tsx";
import { useDispatch } from "react-redux";

interface ProfileSection {
  email: string;
  id: number;
  username: string;
}

interface ProfileSectionProps {
  setError: (value: boolean) => void;
  setTextMessage: (m: string) => void;
  setMessage: (message: boolean) => void;
}

const ProfilePage = ({ ...props }: ProfileSectionProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState<ProfileSection | null>(null);
  const [change, setChange] = useState<boolean>(false);
  const [oldUsername, setOldUsername] = useState<string>("");
  const [oldEmail, setOldEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [deleteUser, setDeleteUser] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.AuthSlice.token);

  useEffect(() => {
    axios
      .get("http://172.30.88.250:8000/auth/users/me/", {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setUserData(res.data);
        setEmail(res.data.email);
        setUsername(res.data.username);
        setOldEmail(res.data.email);
        setOldUsername(res.data.username);
      })
      .catch((err) => console.log(err));
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
    if (userData) {
      setUsername(userData.username);
      setEmail(userData.email);
      setCurrentPassword("");
      setNewPassword("");
    }
    setChange(false);
  };

  const handleChanges = () => {
    setFetching(true);
    console.log(oldEmail);
    console.log(username);
    if (oldUsername != username) {
      const formDataUsername = new FormData();
      formDataUsername.append("new_username", username);

      axios
        .post(
          "http://172.30.88.250:8000/auth/users/set_username/",
          formDataUsername,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        )
        .then((res) => {
          setFetching(false);
          setUsername(res.data.new_username);
          setOldUsername(res.data.new_username);
          props.setMessage(true);
          props.setTextMessage(res.data.detail);
          console.log(res.data);
          props.setError(false);
        })
        .catch((err) => {
          console.log(err);

          props.setMessage(true);
          props.setTextMessage(err.message);
          props.setError(true);
          props.setMessage(true);
        });
    }
    if (oldEmail != email) {
      const formDataEmail = new FormData();
      formDataEmail.append("email", email);

      axios
        .post(
          "http://172.30.88.250:8000/auth/users/set_email/",
          formDataEmail,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        )
        .then((res) => {
          setEmail(res.data.email);
          setOldEmail(res.data.email);
          props.setMessage(true);
          props.setTextMessage(res.data.detail);
          console.log(res.data);
          props.setError(false);
          setFetching(false);
        })
        .catch((err) => {
          console.log(err);

          props.setMessage(true);
          props.setTextMessage(err.message);
          props.setError(true);
        });
    }
    if (
      currentPassword.length > 0 &&
      newPassword.length > 0 &&
      newPassword != currentPassword
    ) {
      const formDataPassword = new FormData();
      formDataPassword.append("new_password", newPassword);
      formDataPassword.append("current_password", currentPassword);

      axios
        .post(
          "http://172.30.88.250:8000/auth/users/set_password/",
          formDataPassword,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        )
        .then(() => {
          props.setMessage(true);
          setFetching(false);
          props.setError(false);
        })
        .catch((err) => {
          console.log(err);

          props.setMessage(true);
          props.setTextMessage(err.message);
          props.setError(true);
        });
    }

    setChange((prev) => !prev);
  };

  const handleDelete = () => {
    axios
      .delete("http://172.30.88.250:8000/auth/users/me/", {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          current_password: currentPassword,
        },
      })
      .then(() => {
        localStorage.removeItem("token");
        dispatch(setToken(null));
        navigate("/regilog");
      })
      .catch((err) => {
        alert(err);
      });
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

  return (
    <section className={"ProfileSection"}>
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
                <h2 className={"ProfileNickname"}>{userData?.username}</h2>
                <p className={"ProfileEmail"}>{userData?.email}</p>
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
                  setUsername(userData ? userData.username : "");
                  setEmail(userData ? userData.email : "");
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
    </section>
  );
};

export default ProfilePage;
