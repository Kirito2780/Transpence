import axios, { type AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../Store/Store.ts";

const useFetch = <Tresp, Treq = unknown>(
  method: "get" | "post" | "delete",
  url: string,
  options?: AxiosRequestConfig,
  immediate = true,
) => {
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const [state, setState] = useState<Tresp | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const headers = useMemo(
    () => ({
      Authorization: token
        ? `Token ${token}`
        : localStorage.getItem("token")
          ? `Token ${localStorage.getItem("token")}`
          : undefined,
      "Content-Type": "application/json",
    }),
    [token],
  );
  const fetchData = useCallback(
    async (payload?: Treq) => {
      try {
        let response;

        if (method == "get") {
          setLoading(true);
          response = await axios.get<Tresp>(url, {
            ...options,
            headers: { ...headers, ...options?.headers },
          });
        } else if (method == "post") {
          response = await axios.post<Tresp>(url, payload, {
            ...options,
            headers: {
              ...headers,
              ...options?.headers,
            },
          });
        } else {
          response = await axios.delete<Tresp>(url, {
            ...options,
            headers: {
              ...headers,
            },
            data: payload,
          });
        }
        setState(response.data);
        return response;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [method, url, token],
  );

  useEffect(() => {
    if (!immediate) return;
    void fetchData();
  }, [immediate, fetchData]);

  return { loading, state, fetchData };
};

export default useFetch;
