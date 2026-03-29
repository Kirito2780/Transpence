import { NavLink, Outlet } from "react-router-dom";
import "./AddCreditPage.css";
const AddCreditPage = () => {
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
      <main>
        <div className={"credit"}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AddCreditPage;
