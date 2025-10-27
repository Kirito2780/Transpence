import RegisterPage from "../Pages/Register Page/RegisterPage.tsx";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../Pages/LogIn Page/LogInPage.tsx";
import RegiLogPage from "../Pages/RegiLog Page/RegiLogPage.tsx";
import MainPage from "../Pages/Main Page/MainPage.tsx";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../Store/Store.tsx";
import { useEffect, useState } from "react";
import { setToken } from "../Slices/authSlice.tsx";
import ItemPage from "../Pages/ItemPage/ItemPage.tsx";

function App() {
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    const local_token = localStorage.getItem("token");
    if (local_token && !token) {
      dispatch(setToken(local_token));
    }

    setLoading(false);
  }, [token, dispatch]);

  if (loading) {
    return <h1 className={"loading"}>Loading......................</h1>;
  }

  return (
    <main className="App">
      <Routes>
        {!token ? (
          <>
            <Route path={"/regilog"} element={<RegiLogPage />} />
            <Route path={"/register"} element={<RegisterPage />} />
            <Route path={"/login"} element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/regilog" replace />} />
          </>
        ) : (
          <>
            <Route path={"/"} element={<MainPage />} />
            <Route path={"/operations/:id"} element={<ItemPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </main>
  );
}

export default App;
