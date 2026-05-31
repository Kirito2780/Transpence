import { NavLink, useParams } from "react-router-dom";
import useFetch from "../../Hooks/useFetch.ts";
import { API_URL } from "../../api/api.ts";
import "./CreditItemPage.css";
import { useEffect, useState } from "react";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts";
import { CreditItemOperation } from "../../Components/CreditItemOperation/CreditItemOperation.tsx";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Message } from "../../Components/Message/Message.tsx";

type Operation = {
  id: 0;
  pay_date: Date;
  title: string;
  amount: string;
};

interface ICreditItem {
  icon: string;
  loan_id: string;
  loan_name: string;
  loan_type: string;
  operations: Operation[];
  total_paid: number;
  left_to_pay: number;
  loan_amount: number;
}
interface IResponse {
  status: number;
  message: string;
}
interface IForm {
  title: string;
  pay_date: string;
  amount: string;
}
export const CreditItemPage = () => {
  const { id } = useParams();
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [data, setData] = useState<ICreditItem>();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>();
  const formAnimations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  };
  useEffect(() => {
    const getCreditItemData = async () => {
      try {
        const req = await CreditItemInfoFetch.fetchData();
        const res = req.data;
        setData(res);
      } catch (e) {
        console.log(e);
      }
    };
    void getCreditItemData();
  }, [isFetched]);
  const sendOperationFetch = useFetch<IResponse>(
    "post",
    `${API_URL}/loan_detail/${id}/ops_create/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    },
    false,
  );
  const sendOperation = async (data: IForm) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("pay_date", data.pay_date);
      formData.append("amount", data.amount);
      console.log(formData);
      const req = await sendOperationFetch.fetchData(formData);
      console.log(req);
      setModal(true);
      setError(false);
      setMessage(req.data.message);
      setIsAdd(false);
      setIsFetched((prev) => !prev);
      if (req.data.status === 400) {
        setError(true);
      }
      reset();
    } catch (e) {
      console.log(e);
      setModal(true);
      setError(true);
    }
  };

  const CreditItemInfoFetch = useFetch<ICreditItem>(
    "post",
    `${API_URL}/loan_detail/${id}/detailed/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    },
    false,
  );

  return (
    <div>
      <Message open={modal} setOpen={setModal} error={error}>
        {message}
      </Message>
      <header>
        <h1 className={"MainTitlePageCompare"}>
          <NavLink to={"/"} className={"nav-link-compare"}>
            <span className={"MainTitleFirstPageCompare"}>Trans</span>
            <span className={"MainTitleSecondPageCompare"}>pence</span>
          </NavLink>
        </h1>
      </header>
      <div className={"CreditItemPageContainer"}>
        <section className={"CreditItemOverallInfo"}>
          <div
            className={"CreditItemIcon"}
            dangerouslySetInnerHTML={{ __html: data ? data.icon : "" }}
          ></div>
          <div>
            <h1>{data?.loan_name}</h1>
            <h4>{data?.loan_type}</h4>
          </div>
        </section>
        <section className={"CreditItemMainSection"}>
          <div className={"CreditItemMainSectionUpperPart"}>
            <div className={"CreditItemMainSectionUpperPartStatistic"}>
              <div className={"CreditItemChartWrapper"}>
                {data && (
                  <PieChart
                    series={[
                      {
                        data: [
                          {
                            label: "total paid",
                            value: data.total_paid,
                            color: "darkgreen",
                          },
                          {
                            label: "left to pay",
                            value: data.left_to_pay,
                            color: "darkred",
                          },
                        ],
                        highlightScope: { fade: "global", highlight: "item" },
                        faded: {
                          innerRadius: 30,
                          additionalRadius: -30,
                          color: "gray",
                        },
                        arcLabel: (d) => {
                          const percent = (
                            (d.value / data.loan_amount) *
                            100
                          ).toFixed(0);
                          if (Number(percent) > 4) {
                            return `${percent}%`;
                          }
                          return "";
                        },
                      },
                    ]}
                    height={300}
                    width={300}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: "white",
                        fontSize: 14,
                        fontWeight: 600,
                      },
                    }}
                  />
                )}
              </div>
              <div className={"CreditItemMainPaymentInfoWrapper"}>
                <span className={"CreditItemMainPaymentInfoText"}>
                  Total paid:{data?.total_paid}
                </span>
                <span className={"CreditItemMainPaymentInfoText"}>
                  Left to pay:{data?.left_to_pay}
                </span>
              </div>
            </div>
            <div className={"CreditItemMainSectionUpperPartHeadings"}>
              <span>Title</span>
              <span>pay_date</span>
              <span>amount</span>
            </div>
          </div>
          <div className={"CreditItemMainSectionLowerPart"}>
            <ul className={"CreditItemMainSectionLowerPartList"}>
              {data?.operations.map((el, index) => (
                <CreditItemOperation
                  pay_date={el.pay_date}
                  amount={el.amount}
                  title={el.title}
                  key={index}
                />
              ))}
            </ul>
            {!isAdd ? (
              <button
                className={"CreditItemMainSectionLowerPartAddButton"}
                onClick={() => setIsAdd(true)}
              >
                +
              </button>
            ) : (
              <motion.div
                className={"CreditItemMainSectionLowerPartFormWrapper"}
                variants={formAnimations}
                animate="animate"
                initial="initial"
                transition={{ duration: 0.2 }}
              >
                <form
                  onSubmit={handleSubmit(sendOperation)}
                  className={"CreditItemMainSectionLowerPartForm"}
                >
                  <input
                    {...register("title", {
                      required: {
                        value: true,
                        message: "this field is required",
                      },
                    })}
                    placeholder={errors.title ? errors.title.message : ""}
                    type="text"
                    className={"CreditItemMainSectionLowerPartFormInput"}
                  />
                  <input
                    {...register("pay_date", {
                      required: {
                        value: true,
                        message: "this field is required",
                      },
                    })}
                    placeholder={
                      errors.pay_date
                        ? errors.pay_date.message
                        : "(year-month-day)"
                    }
                    type="text"
                    className={"CreditItemMainSectionLowerPartFormInput"}
                  />
                  <input
                    {...register("amount", {
                      required: {
                        value: true,
                        message: "this field is required",
                      },
                    })}
                    placeholder={errors.amount ? errors.amount.message : ""}
                    type="text"
                    className={"CreditItemMainSectionLowerPartFormInput"}
                  />

                  <div>
                    <button
                      className={
                        "CreditItemMainSectionLowerPartOperationAddButton"
                      }
                    >
                      +
                    </button>
                    <button
                      onClick={() => {
                        setIsAdd(false);
                        reset();
                      }}
                      className={
                        "CreditItemMainSectionLowerPartOperationAddButton"
                      }
                    >
                      x
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
