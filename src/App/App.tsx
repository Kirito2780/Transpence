import RegisterPage from "../Pages/Register Page/RegisterPage.tsx";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../Pages/LogIn Page/LogInPage.tsx";
import RegiLogPage from "../Pages/RegiLog Page/RegiLogPage.tsx";

function App() {
  return (
    <main className="App">
      <Routes>
        <Route path="/" element={<RegiLogPage />} />
        <Route path={"/register"} element={<RegisterPage />} />
        <Route path={"/login"} element={<LoginPage />} />
      </Routes>
    </main>
  );
}

export default App;
