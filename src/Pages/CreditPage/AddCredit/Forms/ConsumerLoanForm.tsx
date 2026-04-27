import { ButtonBack } from "./ButtonBack/ButtonBack.tsx";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "./ErrorMessage/ErrorMesage.tsx";

interface IFormValues {
  name: string;
  loan_amount: number;
  interest_rate: number;
  loan_term: number;
  loan_insurance: Date;
  loan_end: Date;
  color?: string;
  icon?: number;
  comment?: string;
  commission?: number;
}

export const ConsumerLoanForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({ mode: "onSubmit" });

  const onSubmitCredit = (data: IFormValues) => {
    console.log(data);
  };

  return (
    <div>
      <ButtonBack />
      <h2 className={"creditFormHeader"}>Create consumer loan dashboard</h2>
      <form onSubmit={handleSubmit(onSubmitCredit)} className={"creditForm"}>
        <div className={"creditFormInputWrapper"}>
          <input
            type="text"
            className={"creditFormInput"}
            placeholder={"Loan name: (for example: “phone”)"}
            {...register("name", {
              required: {
                value: true,
                message: "this field is required",
              },
            })}
          />
          <div className={"errorContainer"}>
            {errors.name && <ErrorMessage message={errors.name.message} />}
          </div>
        </div>
        <div className={"creditFormInputWithHalfInputs"}>
          <label htmlFor="colorPicker" className={"creditColorInputLabel"}>
            color:
          </label>
          <input
            type="color"
            className={"creditColorInput"}
            id={"colorPicker"}
            {...register("color")}
          />
          <input
            type="text"
            className={"creditFormInputHalf"}
            placeholder={"Icon:"}
            {...register("icon")}
          />
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
            type="text"
            className={"creditFormInput"}
            placeholder={"interest rate: %"}
            {...register("interest_rate", {
              required: {
                value: true,
                message: "this field is required",
              },
            })}
          />
          <div className={"errorContainer"}>
            {errors.interest_rate && (
              <ErrorMessage message={errors.interest_rate.message} />
            )}
          </div>
        </div>
        <div className={"creditFormInputWrapper"}>
          <input
            type="text"
            className={"creditFormInput"}
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
