import { motion, type Variants } from "framer-motion";
import { useMemo } from "react";

interface MonthPickerProps {
  send: boolean;
  comparePickerAnimations: Variants;
  firstMonth: string;
  setFirstMonth: (arg: string) => void;
  secondMonth: string;
  setSecondMonth: (arg: string) => void;
  handleMonthSend: () => void;
  firstYear: string;
  setFirstYear: (arg: string) => void;
  secondYear: string;
  setSecondYear: (arg: string) => void;
}

export const MonthPicker = ({
  send,
  comparePickerAnimations,
  firstMonth,
  setFirstMonth,
  secondMonth,
  setSecondMonth,
  firstYear,
  setFirstYear,
  secondYear,
  setSecondYear,
  handleMonthSend,
}: MonthPickerProps) => {
  const Months = [
    { name: "January", value: "1" },
    { name: "February", value: "2" },
    { name: "March", value: "3" },
    { name: "April", value: "4" },
    { name: "May", value: "5" },
    { name: "June", value: "6" },
    { name: "July", value: "7" },
    { name: "August", value: "8" },
    { name: "September", value: "9" },
    { name: "October", value: "10" },
    { name: "November", value: "11" },
    { name: "December", value: "12" },
  ];
  const startYear = 1950;
  const currentYear = new Date().getFullYear();

  const years = useMemo(() => {
    let yearList = [];
    for (let i = currentYear; i > startYear; i--) {
      yearList.push(i.toString());
    }
    return yearList;
  }, [startYear, currentYear]);

  const filteredFirstMonths = useMemo(() => {
    if (firstYear == secondYear) {
      return Months.filter((el) => el.value !== secondMonth);
    } else {
      return Months;
    }
  }, [firstYear, secondYear, secondMonth, firstMonth]);

  const filteredSecondMonths = useMemo(() => {
    if (firstYear == secondYear) {
      return Months.filter((el) => el.value !== firstMonth);
    } else {
      return Months;
    }
  }, [firstYear, secondYear, secondMonth, firstMonth]);

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
        <h2 className={"ComparePickerHeader"}>Pick months</h2>
        <div className={"ComparePickerBody"}>
          <div className={"ComparePickerContent"}>
            <h2>First</h2>
            <div>
              <select
                className={"ComparePickerSelect"}
                value={firstMonth}
                onChange={(e) => setFirstMonth(e.target.value)}
              >
                {filteredFirstMonths.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.name}
                  </option>
                ))}
              </select>
              <select
                value={firstYear}
                className={"ComparePickerSelectYear"}
                onChange={(e) => setFirstYear(e.target.value)}
              >
                {years.map((year, index) => (
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
                value={secondMonth}
                className={"ComparePickerSelect"}
                onChange={(e) => setSecondMonth(e.target.value)}
              >
                {filteredSecondMonths.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.name}
                  </option>
                ))}
              </select>
              <select
                value={secondYear}
                onChange={(e) => setSecondYear(e.target.value)}
                className={"ComparePickerSelectYear"}
              >
                {years.map((year, index) => (
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
            onClick={handleMonthSend}
          >
            Calculate
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
