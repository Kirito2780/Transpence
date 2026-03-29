import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const CreditSelector = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      <h2 className={"creditSelectorHeader"}>Which type of debt you have?</h2>
      <div className={"creditSelectorWrapper"}>
        <div className={"creditSelectorFirstRow"}>
          <button
            className={"creditSelectorBlock"}
            onClick={() => navigate("mortgage")}
          >
            <h2>mortgage</h2>
          </button>
          <button
            className={"creditSelectorBlock"}
            onClick={() => navigate("installment_plan")}
          >
            <h2>Installment plan</h2>
          </button>
        </div>
        <div className={"creditSelectorSecondRow"}>
          <button
            className={"creditSelectorBlock"}
            onClick={() => navigate("consumer_loan")}
          >
            <h2>Consumer loan</h2>
          </button>
          <button
            className={"creditSelectorBlock"}
            onClick={() => navigate("custom")}
          >
            <h2>Other... (microloan, etc.)</h2>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
