import axios from "axios";
import { type JSX, useEffect, useState } from "react";
import { API_URL } from "../../../api/api.ts";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Store/Store.ts";
import { useNavigate } from "react-router-dom";

export const CreditAvailability = ({ children }: { children: JSX.Element }) => {
  const [isCredit, setIsCredit] = useState<boolean | null>(null);
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .post(
        `${API_URL}/loan/list/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        },
      )
      .then((res) => {

        if (res.data.length > 0) {
          setIsCredit(true);
        } else {
          setIsCredit(false);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (isCredit == false) navigate("/loan_create");
  }, [isCredit]);

  return children;
};
