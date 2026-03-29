import "../AddCreditPage.css";
import { ButtonBack } from "./ButtonBack/ButtonBack.tsx";
import { motion } from "framer-motion";
export const MortgageForm = () => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={"mortgageFormWrapper"}
    >
      <ButtonBack />
      <h2 className={"creditFormHeader"}>Create mortgage dashboard</h2>
      <form>
        <input
          className={"creditFormInput"}
          type="text"
          placeholder="Loan name: (for example: “My house”)"
        />
        <div className={"creditFormInputWithHalfInputs"}>
          <label htmlFor="colorPicker" className={"creditColorInputLabel"}>
            color:
          </label>
          <input
            type="color"
            className={"creditColorInput"}
            id={"colorPicker"}
          />
          <input
            type="text"
            className={"creditFormInputHalf"}
            placeholder={"Icon:"}
          />
        </div>
        <div className={"creditFormInputWithHalfInputs"}>
          <input
            type="text"
            className={"creditFormInputHalf"}
            placeholder={"Down payment:"}
          />
          <input
            type="text"
            className={"creditFormInputHalf"}
            placeholder={"Property value:"}
          />
        </div>
        <div className={"creditFormInputWithButtonWrapper"}>
          <input
            type="text"
            className={"creditFormInputWithButton"}
            placeholder={"Loan amount:  (PV - DP)"}
          />
          <button className={"creditFormInputButton"}>calculate</button>
        </div>
        <input
          type="text"
          className={"creditFormInput"}
          placeholder={"Interest rate: %"}
        />
        <input
          type="text"
          className={"creditFormInput"}
          placeholder={"Loan term (months):"}
        />
        <input
          type="text"
          className={"creditFormInput"}
          placeholder={"loan issuance date:"}
        />
        <div className={"creditFormInputWithButtonWrapper"}>
          <input
            type="text"
            className={"creditFormInputWithButton"}
            placeholder={"Loan end date: (Lin + LT)"}
          />
          <button className={"creditFormInputButton"}>calculate</button>
        </div>
        <div className={"creditFormInputWithButtonWrapper"}>
          <input
            type="text"
            className={"creditFormInputWithButton"}
            placeholder={"Monthly payment:"}
          />
          <button className={"creditFormInputButton"}>calculate</button>
        </div>
        <h2 className={"creditFormHeader"}>Optional</h2>
        <input
          type="text"
          className={"creditFormInput"}
          placeholder={"Commission/Insurance:"}
        />
        <textarea className={"FormTextArea"} placeholder={"Comment:"} />
        <div className={"formConfirmButtonWrapper"}>
          <button className={"formConfirmButton"}>confirm</button>
        </div>
      </form>
    </motion.div>
  );
};
