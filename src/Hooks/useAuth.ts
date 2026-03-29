import { useSelector } from "react-redux";
import type { RootState } from "../Store/Store.ts";
import { useEffect, useState } from "react";
import axios from "axios";

export const useAuth = () => {
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const [userName, setUserName] = useState<string>("");
  const headers = {
    Authorization: `Token ${token}`,
    "Content-Type": "application/json",
  };
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://172.30.88.250:8000/auth/users/me/", { headers })
      .then((res) => {
        setUserName(res.data.username);
      })
      .catch((err) => {
        if (err.status == 401) {
          localStorage.clear();
          location.reload();
        }
      });
  }, [token]);
  const logout = async () => {
    if (!token) return;
    try {
      await axios
        .post("http://172.30.88.250:8000/auth/token/logout/", {}, { headers })
        .catch((err) => console.log(err));

      localStorage.removeItem("token");
      location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  return { logout, userName };
};
