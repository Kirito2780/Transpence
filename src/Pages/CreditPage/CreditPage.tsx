import { NavLink } from "react-router-dom";
import "./CreditPage.css";

const CreditPage = () => {
  return (
    <div>
      <header>
        <h1 className={"MainTitlePageCompare"}>
          <NavLink to={"/"} className={"nav-link-compare"}>
            <span className={"MainTitleFirstPageCompare"}>Trans</span>
            <span className={"MainTitleSecondPageCompare"}>pence</span>
          </NavLink>
        </h1>
      </header>
    </div>
  );
};

export default CreditPage;
