import RegisterPage from "../Pages/Register Page/RegisterPage.tsx";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../Pages/LogIn Page/LogInPage.tsx";
import RegiLogPage from "../Pages/RegiLog Page/RegiLogPage.tsx";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../Store/Store.tsx";
import { useEffect, lazy, Suspense } from "react";
import { setToken } from "../Slices/authSlice.tsx";
import ItemPage from "../Pages/ItemPage/ItemPage.tsx";

const MainPage = lazy(() => import("../Pages/Main Page/MainPage.tsx"));
const ProfilePage = lazy(() => import("../Pages/ProfilePage/ProfilePage.tsx"));

function App() {
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const dispatch = useDispatch();

  useEffect(() => {
    const local_token = localStorage.getItem("token");
    if (local_token && !token) {
      dispatch(setToken(local_token));
    }
  }, []);

  return (
    <main className="App">
      <Suspense fallback={<p>Loading....</p>}>
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
              <Route path={"/profile"} element={<ProfilePage />} />
              <Route path={"/operations/:id"} element={<ItemPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Suspense>
    </main>
  );
}

export default App;
