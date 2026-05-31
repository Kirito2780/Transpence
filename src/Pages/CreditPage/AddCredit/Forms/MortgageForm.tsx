import "../AddCreditPage.css";
import { ButtonBack } from "./ButtonBack/ButtonBack.tsx";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "./ErrorMessage/ErrorMesage.tsx";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../Store/Store.ts";
import useFetch from "../../../../Hooks/useFetch.ts";
import { API_URL } from "../../../../api/api.ts";
import { Message } from "../../../../Components/Message/Message.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IMortageForm {
  loan_type: string;
  loan_name: string;
  loan_amount: number;
  color?: string;
  down_payment: number;
  property_value: number;
  interest_rate?: number;
  loan_insurance: Date;
  loan_end: Date;
  commission?: number;
  comment?: string;
  icon?: number;
}
interface IResponse {
  message: string;
}
interface IIcons {
  id: number;
  icon: string;
  name: string;
}
interface IIconsResponse {
  svg: IIcons[];
}

export const MortgageForm = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [icons, setIcons] = useState<IIconsResponse>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IMortageForm>({ mode: "onSubmit", defaultValues: { icon: 1 } });
  const token = useSelector((state: RootState) => state.AuthSlice.token);

  const fetchForm = useFetch<IResponse>(
    "post",
    `${API_URL}/loan/create/`,
    { headers: { Authorization: `Token ${token}` } },
    false,
  );
  const fetchIcons = useFetch<IIconsResponse>(
    "get",
    `${API_URL}/loan/icons/`,
    { headers: { Authorization: `Token ${token}` } },
    false,
  );
  useEffect(() => {
    const getIcons = async () => {
      const req = await fetchIcons.fetchData();
      const res = req.data;
      setIcons(res);
      console.log(res);
    };
    void getIcons();
  }, []);
  const SendMortgageForm = async (data: IMortageForm) => {
    try {
      const formData = new FormData();
      formData.append("loan_type", "Mortgage");
      formData.append("loan_name", data.loan_name);
      formData.append("color", data.color || "");
      formData.append("loan_amount", data.loan_amount.toString());
      formData.append("down_payment", data.down_payment.toString());
      formData.append("property_value", data.property_value.toString());
      formData.append("interest_rate", data.interest_rate?.toString() || "");
      formData.append("loan_insurance", data.loan_insurance.toString());
      formData.append("loan_end", data.loan_end.toString());
      formData.append("comment", data.comment || "");
      formData.append("commission", data.commission?.toString() || "");
      formData.append("icon", data.icon?.toString() || "");
      console.log(formData);
      const req = await fetchForm.fetchData(formData);
      const res = req.data;
      setMessage(res.message);
      setOpen(true);
      navigate("/credit");
    } catch (e) {
      console.log(e);
      setError(true);
      setOpen(true);
      setMessage("Something went wrong");
    }
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={"mortgageFormWrapper"}
    >
      <Message open={open} setOpen={setOpen} error={error}>
        {message}
      </Message>
      <ButtonBack />
      <h2 className={"creditFormHeader"}>Create mortgage dashboard</h2>
      <form
        onSubmit={handleSubmit(SendMortgageForm)}
        className={"mortgageCreditForm"}
      >
        <input
          className={"creditFormInput"}
          type="text"
          placeholder="Loan name: (for example: “My house”)"
          {...register("loan_name", {
            required: {
              value: true,
              message: "this field is required",
            },
          })}
        />
        <div className={"creditFormInputWithHalfInputs"}>
          <label htmlFor="colorPicker" className={"creditColorInputLabel"}>
            color:
          </label>
          <input
            type="color"
            defaultValue={"#333333"}
            className={"creditColorInput"}
            id={"colorPicker"}
            {...register("color")}
          />
          <select
            defaultValue={"1"}
            {...register("icon", {
              required: {
                value: true,
                message: "this field is required",
              },
            })}
          >
            {icons ? (
              icons.svg.map((el) => (
                <option value={el.id} key={el.id}>
                  {el.name}
                </option>
              ))
            ) : (
              <option>no icons</option>
            )}
          </select>
        </div>
        <input
          type="text"
          className={"creditFormInput"}
          placeholder={"Loan amount"}
          {...register("loan_amount", {
            required: {
              value: true,
              message: "this field is required",
            },
          })}
        />
        <div className={"creditFormInputWithHalfInputs"}>
          <div className={"creditFormInputHalfWrapper"}>
            <input
              type="text"
              className={"creditFormInputHalf"}
              placeholder={"Down payment:"}
              {...register("down_payment", {
                required: {
                  value: true,
                  message: "this field is required",
                },
              })}
            />
            <div className={"errorContainer"}>
              {errors.down_payment && (
                <ErrorMessage message={errors.down_payment.message} />
              )}
            </div>
          </div>
          <div className={"creditFormInputHalfWrapper"}>
            <input
              type="text"
              className={"creditFormInputHalf"}
              placeholder={"Property value:"}
              {...register("property_value", {
                required: {
                  value: true,
                  message: "this field is required",
                },
              })}
            />

            {errors.property_value && (
              <ErrorMessage message={errors.property_value.message} />
            )}
          </div>
        </div>
        <div className={"creditFormInputWrapper"}>
          <input
            type="text"
            maxLength={3}
            className={"creditFormInput"}
            placeholder={"Interest rate: %"}
            {...register("interest_rate", {
              required: {
                value: true,
                message: "this field is required",
              },
              maxLength: {
                value: 3,
                message: "length is too high",
              },
            })}
          />
          {errors.interest_rate && (
            <ErrorMessage message={errors.interest_rate.message} />
          )}
        </div>
        <div className={"creditFormInputWrapper"}>
          <input
            type="date"
            className={"creditFormInputDate"}
            {...register("loan_insurance", {
              required: {
                value: true,
                message: "this field is required",
              },
            })}
          />
          <label htmlFor={"loan_end"} className={"creditInputLabel"}>
            loan issuance date
          </label>
          {errors.loan_insurance && (
            <ErrorMessage message={errors.loan_insurance.message} />
          )}
        </div>
        <div className={"creditFormInputWrapper"}>
          <input
            id={"loan_end"}
            type="date"
            className={"creditFormInputDate"}
            {...register("loan_end", {
              required: {
                value: true,
                message: "this field is required",
              },
            })}
          />
          <label htmlFor={"loan_end"} className={"creditInputLabel"}>
            Loan end date
          </label>
          {errors.loan_end && (
            <ErrorMessage message={errors.loan_end.message} />
          )}
        </div>

        <h2 className={"creditFormHeader"}>Optional</h2>
        <input
          type="text"
          className={"creditFormInput"}
          placeholder={"Commission/Insurance:"}
          {...register("commission")}
        />
        <textarea
          className={"FormTextArea"}
          placeholder={"Comment:"}
          {...register("comment")}
        />
        <div className={"formConfirmButtonWrapper"}>
          <button className={"formConfirmButton"}>confirm</button>
        </div>
      </form>
    </motion.div>
  );
};
