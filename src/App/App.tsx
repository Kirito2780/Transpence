import RegisterPage from "../Pages/RegisterPage/RegisterPage.tsx";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../Pages/LogInPage/LogInPage.tsx";
import RegiLogPage from "../Pages/RegiLogPage/RegiLogPage.tsx";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../Store/Store.ts";
import { useEffect, lazy, Suspense, useState } from "react";
import { setToken } from "../Slices/authSlice.tsx";
import { CreditAvailability } from "../Pages/CreditPage/CreditAvailavility/CreditAvailability.tsx";
import { MortgageForm } from "../Pages/CreditPage/AddCredit/Forms/MortgageForm.tsx";
import { CreditSelector } from "../Pages/CreditPage/AddCredit/CreditSelector/CreditSelector.tsx";
import { InstallmentPlanForm } from "../Pages/CreditPage/AddCredit/Forms/InstallmentPlanForm.tsx";
import { ConsumerLoanForm } from "../Pages/CreditPage/AddCredit/Forms/ConsumerLoanForm.tsx";
import { CustomForm } from "../Pages/CreditPage/AddCredit/Forms/CustomForm.tsx";
const MainPage = lazy(() => import("../Pages/MainPage/MainPage.tsx"));
const ProfilePage = lazy(() => import("../Pages/ProfilePage/ProfilePage.tsx"));
const ComparePage = lazy(() => import("../Pages/ComparePage/ComparePage.tsx"));
const MonthPage = lazy(
  () => import("../Pages/ComparePage/MonthPage/MonthPage.tsx"),
);
const YearPage = lazy(
  () => import("../Pages/ComparePage/YearPage/YearPage.tsx"),
);
const ItemPage = lazy(() => import("../Pages/ItemPage/ItemPage.tsx"));
const AddCreditPage = lazy(
  () => import("../Pages/CreditPage/AddCredit/AddCreditPage.tsx"),
);
const CreditPage = lazy(() => import("../Pages/CreditPage/CreditPage.tsx"));

function App() {
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const local_token = localStorage.getItem("token");
    if (local_token && !token) {
      dispatch(setToken(local_token));
    }
    setLoading(false);
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

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
              <Route path={"/compare"} element={<ComparePage />} />
              <Route path={"/compare/month"} element={<MonthPage />} />
              <Route path={"/compare/year"} element={<YearPage />} />
              <Route path={"/loan_create"} element={<AddCreditPage />}>
                <Route index element={<CreditSelector />} />
                <Route path={"mortgage"} element={<MortgageForm />} />
                <Route
                  path={"installment_plan"}
                  element={<InstallmentPlanForm />}
                />
                <Route path={"consumer_loan"} element={<ConsumerLoanForm />} />
                <Route path={"custom"} element={<CustomForm />} />
              </Route>

              <Route
                path={"/credit"}
                element={
                  <CreditAvailability>
                    <CreditPage />
                  </CreditAvailability>
                }
              />
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
