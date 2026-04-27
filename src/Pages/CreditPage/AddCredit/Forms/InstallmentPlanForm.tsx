import { ButtonBack } from "./ButtonBack/ButtonBack.tsx";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "./ErrorMessage/ErrorMesage.tsx";

interface IInstallmentPlanForm {
  name: string;
  color?: string;
  icon?: number;
  loan_amount: number;
  loan_term: number;
  loan_insurance: Date;
  loan_end: Date;
  comment?: string;
  commission?: number;
}

export const InstallmentPlanForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IInstallmentPlanForm>();

  const onSubmitinstallmentPlan = (data: IInstallmentPlanForm) => {
    console.log(data);
  };

  return (
    <div>
      <ButtonBack />
      <h2 className={"creditFormHeader"}>Create Installment plan dashboard</h2>
      <form
        onSubmit={handleSubmit(onSubmitinstallmentPlan)}
        className={"creditForm"}
      >
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
