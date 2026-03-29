import "./RegiLog.css";
import { NavLink } from "react-router-dom";

const RegiLogPage = () => {
  return (
    <div>
      <div className="RegiLogSender">
        <h1 className={"RegiLogTitle"}>
          <span className={"RegiLogTitleFirst"}>Trans</span>
          <span className={"RegiLogTitleSecond"}>pence</span>
        </h1>
        <h3 className={"RegiLogSuggestion"}>What you want to do?</h3>
        <div className={"RegiLogSuggestionWrapper"}>
          <NavLink to={"/register"} className={"RegiLogSender_1"}>
            <span>Register</span>
          </NavLink>
          <NavLink to={"/login"} className={"RegiLogSender_2"}>
            <span>Log In</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default RegiLogPage;
