import { motion, type Variants } from "framer-motion";
import { useMemo } from "react";

interface YearPickerProps {
  comparePickerAnimations: Variants;
  send: boolean;
  handleYearsSend: () => void;
  firstNYear: number;
  secondNYear: number;
  setFirstNYear: (year: number) => void;
  setSecondNYear: (year: number) => void;
}

export const YearPicker = ({
  comparePickerAnimations,
  send,
  handleYearsSend,
  firstNYear,
  secondNYear,
  setFirstNYear,
  setSecondNYear,
}: YearPickerProps) => {
  const startYear = 1950;
  const currentYear = new Date().getFullYear();
  const yearsN = useMemo(() => {
    let yearList = [];
    for (let i = currentYear; i > startYear; i--) {
      yearList.push(i);
    }
    return yearList;
  }, [startYear, currentYear]);

  const filteredFirstNYears = useMemo(() => {
    return yearsN.filter((el) => el !== secondNYear);
  }, [firstNYear, secondNYear]);

  const filteredSecondNYears = useMemo(() => {
    return yearsN.filter((el) => el !== firstNYear);
  }, [firstNYear, secondNYear]);

  return (
    <motion.div
      className={"ComparePickerWrapper"}
      variants={comparePickerAnimations}
      initial={"initial"}
      animate={"animate"}
      exit={"sent"}
      transition={{
        duration: 0.3,
      }}
    >
      <motion.div
        className={"ComparePicker"}
        variants={comparePickerAnimations}
        initial={"initial"}
        animate={send ? "sent" : "animate"}
        transition={{
          duration: 0.3,
        }}
      >
        <h2 className={"ComparePickerHeader"}>Pick year</h2>
        <div className={"ComparePickerBody"}>
          <div className={"ComparePickerContent"}>
            <h2>First</h2>
            <div>
              <select
                value={firstNYear}
                className={"ComparePickerSelectYear"}
                onChange={(e) => setFirstNYear(Number(e.target.value))}
              >
                {filteredFirstNYears.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={"ComparePickerContent"}>
            <h2>Second</h2>
            <div>
              <select
                value={secondNYear}
                onChange={(e) => setSecondNYear(Number(e.target.value))}
                className={"ComparePickerSelectYear"}
              >
                {filteredSecondNYears.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className={"ComparePickerButtonWrapper"}>
          <motion.button
            className={"ComparePickerButton"}
            whileHover={{ cursor: "pointer", scale: 1.2 }}
            whileTap={{ scale: 0.6 }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 500,
              damping: 20,
            }}
            onClick={handleYearsSend}
          >
            Calculate
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
