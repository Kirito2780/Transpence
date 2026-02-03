import "./ItemPage.css";
import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/Store.tsx";

interface IItemData {
  id: number;
  title: string;
  date: string;
  operation_type: string;
  tag: string;
  amount: number;
  svg: string;
}

const ItemPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<IItemData | null>(null);
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const currency = useSelector(
    (state: RootState) => state.CurrencySlice.currency,
  );

  useEffect(() => {
    if (!id || !token) return;

    axios
      .get<IItemData>(`http://172.30.88.250:8000/operations/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        setData(res.data);
      });
  }, [token, id]);

  return (
    <div className="ItemPageContainer">
      <NavLink to={"/"} className={"BackToMain"}>
        <svg
          width="30px"
          height="30px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12H19M5 12L11 6M5 12L11 18"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </NavLink>
      {data && (
        <>
          <h1 className={"ItemPageTitle"}>
            <span className={"MainTitleFirst"}>Trans</span>
            <span className={"MainTitleSecond"}>pence</span>
          </h1>
          <div
            dangerouslySetInnerHTML={{ __html: data.svg }}
            className={"ItemPageSVG"}
          ></div>
          <section className={"ItemPageFirstSection"}>
            <h2 className={"ItemTitle"}>{data.title}</h2>
            <h6
              className={
                data.operation_type == "income"
                  ? "ItemPageIncome"
                  : "ItemPageExpense"
              }
            >
              {data.operation_type == "income" ? <span>+</span> : null}
              {data.amount}
              <span>{currency}</span>
            </h6>
            <p>{data.date}</p>
          </section>
          <section className={"ItemPageSecondSection"}>
            <p className={"ItemPageExtraInfoP"}>
              <span>Operation Type</span>

              <span>{data.operation_type}</span>
            </p>
          </section>
          <section className={"ItemPageThirdSection"}>
            <p className={"ItemPageExtraInfoP"}>
              <span>Tag</span>
              <span>{data.tag}</span>
            </p>
          </section>
        </>
      )}
    </div>
  );
};

export default ItemPage;
