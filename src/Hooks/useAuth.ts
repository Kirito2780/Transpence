import { useSelector } from "react-redux";
import type { RootState } from "../Store/Store.ts";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api/api.ts";

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
      .get(`${API_URL}/auth/users/me/`, { headers })
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
        .post(`${API_URL}/auth/token/logout/`, {}, { headers })
        .catch((err) => console.log(err));

      localStorage.removeItem("token");
      location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  return { logout, userName };
};
