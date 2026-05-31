import { NavLink, useNavigate } from "react-router-dom";
import "./CreditPage.css";
import "../MainPage/MainPage.css";
import useFetch from "../../Hooks/useFetch.ts";
import { API_URL } from "../../api/api.ts";
import { useEffect, useState } from "react";
import { CreditItem } from "./CreditItem.tsx";
import Modal from "../../Components/Modal/Modal.tsx";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
interface ICredit {
  active: boolean;
  color?: string;
  comment?: string;
  created_at: Date;
  edited_at: Date;
  icon: string;
  id: number;
  loan_amount: number;
  loan_end: Date;
  loan_insurance: Date;
  loan_name: string;
  loan_term: number;
  monthly_payment?: number;
}

const CreditPage = () => {
  const [credits, setCredits] = useState<ICredit[]>([]);
  const [filter, setFilter] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();
  const [date_start, setDate_start] = useState<Date | null>(null);
  const [date_end, setDate_end] = useState<Date | null>(null);
  const loanTypes: string[] = ["Mortgage", "Loan", "Installment", "Other"];
  const [loanArr, setLoanArr] = useState<string[]>([]);
  const fetchFilter = useFetch<ICredit[]>(
    "post",
    `${API_URL}/loan/list/`,
    { headers: { Authorization: `Token ${localStorage.getItem("token")}` } },
    false,
  );
  const CreditPageAnimations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  };
  const fetchCredits = useFetch<ICredit[]>(
    "post",
    `${API_URL}/loan/list/`,
    {
      headers: { Authorization: `Token ${localStorage.getItem("token")}` },
    },
    false,
  );
  useEffect(() => {
    const getCredits = async () => {
      const req = await fetchCredits.fetchData();
      setCredits(req.data);
    };
    void getCredits();
  }, []);
  const handleSearch = async () => {
    let query = search;
    if (query.length <= 3 && query.length > 0) {
      query += "*";
    }
    console.log(query);
  };
  const sendFilter = async () => {
    if (!!date_start && !!date_end) return;
    try {
      const startFormatted = date_start?.toISOString().slice(0, 10);
      const endFormatted = date_end?.toISOString().slice(0, 10);
      const searchData = {
        date_start: startFormatted,
        date_end: endFormatted,
        loan_type: loanArr,
        q: search,
      };
      console.log(searchData);
      const response = await fetchFilter.fetchData(searchData);
      setCredits(response.data);
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    console.log(credits);
  }, [credits]);
  return (
    <div>
      <Modal open={filter}>
        <div className={"CreditFilterWrapper"}>
          <div className={"closeFilterWrapperButtonWrapper"}>
            <button
              className={"closeFilterButton"}
              onClick={() => setFilter(false)}
            >
              x
            </button>
          </div>
          <h1 className={"datePickerHeader"}>Credit filter</h1>
          <h2 className={"datePickerLabel"}>From</h2>
          <DatePicker
            selected={date_start}
            onChange={(date) => {
              setDate_start(date);
              date
                ? sessionStorage.setItem("date_start", date.toISOString())
                : null;
            }}
            dateFormat={"yyyy-MM-dd"}
            className={"myDateInput"}
            portalId="start-date-portal"
          />
          <h2 className={"datePickerLabel"}>to</h2>
          <DatePicker
            selected={date_end}
            onChange={(date) => setDate_end(date)}
            dateFormat={"yyyy-MM-dd"}
            className={"myDateInput"}
            portalId="end-date-portal"
          />
        </div>
        <h2 className={"datePickerTags"}>Loan type</h2>
        <div className={"CreditFilterWrapper"}>
          {loanTypes.map((el, index) => (
            <div className={"categoryItemWrapper"} key={index}>
              <label>{el}</label>
              <input
                type="checkbox"
                value={el}
                onChange={(e) => {
                  const value = e.target.value;
                  setLoanArr((prev) =>
                    prev.includes(value)
                      ? prev.filter((item) => item !== value)
                      : [...prev, value],
                  );
                }}
              />
            </div>
          ))}
        </div>
        <div className={"datePickerButtonWrapper"}>
          <button
            className={"datePickerButton"}
            onClick={() => {
              void sendFilter();
              setFilter(false);
            }}
          >
            Confirm
          </button>
        </div>
      </Modal>
      <header>
        <h1 className={"MainTitlePageCompare"}>
          <NavLink to={"/"} className={"nav-link-compare"}>
            <span className={"MainTitleFirstPageCompare"}>Trans</span>
            <span className={"MainTitleSecondPageCompare"}>pence</span>
          </NavLink>
        </h1>
      </header>
      <motion.main
        variants={CreditPageAnimations}
        animate="animate"
        initial="initial"
        transition={{ duration: 0.2 }}
      >
        <section className={"CreditListSection"}>
          <section className={"FilterCreditSection"}>
            <div className={"FilterCreditSectionMiddlePart"}>
              <input
                type="text"
                className={"searchCreditInput"}
                placeholder={"search operation by name"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    handleSearch();
                  }
                }}
              />

              <svg
                onClick={() => setFilter(true)}
                className={"mainFilterSvg"}
                width="45px"
                height="45px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={"FilterCreditSectionRightPart"}>
              <button
                className={"AddNewCredit"}
                onClick={() => navigate("/loan_create")}
              >
                +
              </button>
            </div>
          </section>
          <div className={"CreditListContainer"}>
            <ul className={"CreditList"}>
              {credits.map((el) => (
                <CreditItem
                  key={el.id}
                  icon={el.icon}
                  loan_amount={el.loan_amount}
                  loan_name={el.loan_name}
                  comment={el.comment}
                  color={el.color}
                  id={el.id}
                />
              ))}
            </ul>
          </div>
        </section>
      </motion.main>
    </div>
  );
};

export default CreditPage;
