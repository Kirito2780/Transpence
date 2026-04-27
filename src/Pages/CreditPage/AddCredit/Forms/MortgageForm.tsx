import "../AddCreditPage.css";
import { ButtonBack } from "./ButtonBack/ButtonBack.tsx";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "./ErrorMessage/ErrorMesage.tsx";
interface IMortageForm {
  loan_type: string;
  loan_name: string;
  color?: string;
  down_payment: number;
  property_value: number;
  loan_amount: number;
  interest_rate?: number;
  loan_insurance: Date;
  loan_end: Date;
  monthly_payment?: number;
  commission?: number;
  comment?: string;
  icon?: number;
}

export const MortgageForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IMortageForm>({ mode: "onSubmit" });
  const SendMortgageForm = (data: IMortageForm) => {
    console.log(data);
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={"mortgageFormWrapper"}
    >
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
          {...register("loan_name")}
        />
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
