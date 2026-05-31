import { ButtonBack } from "./ButtonBack/ButtonBack.tsx";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "./ErrorMessage/ErrorMesage.tsx";
import useFetch from "../../../../Hooks/useFetch.ts";
import { API_URL } from "../../../../api/api.ts";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../Store/Store.ts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Message } from "../../../../Components/Message/Message.tsx";

interface IInstallmentPlanForm {
  loan_type?: string;
  loan_name: string;
  color?: string;
  icon?: number;
  loan_amount: number;
  loan_term: number;
  loan_insurance: Date;
  loan_end: Date;
  comment?: string;
  commission?: number;
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
export const InstallmentPlanForm = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [icons, setIcons] = useState<IIconsResponse>();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IInstallmentPlanForm>({ defaultValues: { icon: 1 } });
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
  const onSubmitInstallmentPlan = async (data: IInstallmentPlanForm) => {
    try {
      const formData = new FormData();
      formData.append("loan_type", "Installment");
      formData.append("loan_name", data.loan_name);
      formData.append("color", data.color || "");
      formData.append("icon", data.icon?.toString() || "");
      formData.append("loan_amount", data.loan_amount.toString());
      formData.append("loan_term", data.loan_term.toString());
      formData.append("loan_insurance", data.loan_insurance.toString());
      formData.append("loan_end", data.loan_end.toString());
      formData.append("comment", data.comment || "");
      formData.append("commission", data.commission?.toString() || "");
      const req = await fetchForm.fetchData(formData);
      const res = req.data;
      setMessage(res.message);
      navigate("/credit");
    } catch (e) {
      setError(true);
      console.log(e);
    }
  };

  return (
    <div>
      <Message open={open} error={error} setOpen={setOpen}>
        {message}
      </Message>
      <ButtonBack />
      <h2 className={"creditFormHeader"}>Create Installment plan dashboard</h2>
      <form
        onSubmit={handleSubmit(onSubmitInstallmentPlan)}
        className={"creditForm"}
      >
        <div className={"creditFormInputWrapper"}>
          <input
            type="text"
            className={"creditFormInput"}
            placeholder={"Loan name: (for example: “phone”)"}
            {...register("loan_name", {
              required: {
                value: true,
                message: "this field is required",
              },
            })}
          />
          <div className={"errorContainer"}>
            {errors.loan_name && (
              <ErrorMessage message={errors.loan_name.message} />
            )}
          </div>
        </div>
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
        <div className={"creditFormInputWrapper"}>
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
          <div className={"errorContainer"}>
            {errors.loan_amount && (
              <ErrorMessage message={errors.loan_amount.message} />
            )}
          </div>
        </div>
        <div className={"creditFormInputWrapper"}>
          <input
            className={"creditFormInput"}
            type="text"
            placeholder={"Loan term (months):"}
            {...register("loan_term", {
              required: {
                value: true,
                message: "this field is required",
              },
            })}
          />
          <div className={"errorContainer"}>
            {errors.loan_term && (
              <ErrorMessage message={errors.loan_term.message} />
            )}
          </div>
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
          <div className={"errorContainer"}>
            {errors.loan_insurance && (
              <ErrorMessage message={errors.loan_insurance.message} />
            )}
          </div>
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
          <div className={"errorContainer"}>
            {errors.loan_end && (
              <ErrorMessage message={errors.loan_end.message} />
            )}
          </div>
        </div>
        <h2 className={"creditFormHeader"}>Optional</h2>

        <input
          type="text"
          className={"creditFormInput"}
          placeholder={"Commission/Insurance:"}
          {...register("commission")}
        />
        <input
          type="text"
          className={"creditFormInput"}
          placeholder={"Comment:"}
          {...register("comment")}
        />
        <div className={"formConfirmButtonWrapper"}>
          <button className={"formConfirmButton"}>confirm</button>
        </div>
      </form>
    </div>
  );
};
