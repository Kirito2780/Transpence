import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import type { IFilterForm } from "./MainPage.tsx";
import React from "react";

interface FilterSectionProps {
  setFilter: (filter: boolean) => void;
  setExpIncArr: React.Dispatch<React.SetStateAction<string[]>>;
  handleFilterSubmit: (filter: IFilterForm) => void;
}

export const FilterSection = ({
  setFilter,
  setExpIncArr,
  handleFilterSubmit,
}: FilterSectionProps) => {
  const { handleSubmit, register } = useForm<IFilterForm>({
    mode: "onBlur",
  });

  return (
    <motion.div
      className={"operationFilterSectionOpened"}
      initial={{ maxHeight: 0, opacity: 0 }}
      animate={{ maxHeight: 250, opacity: 1 }}
      exit={{ maxHeight: 0, opacity: 0 }}
    >
      <div className={"mainFilterCloseButtonWrapper"}>
        <button
          className={"mainFilterCloseButton"}
          onClick={() => setFilter(false)}
        >
          x
        </button>
      </div>
      <form onSubmit={handleSubmit(handleFilterSubmit)}>
        <div className={"mainSliderWrapper"}>
          <label htmlFor={"mainFilterInputFrom"} style={{ color: "white" }}>
            From
          </label>
          <input
            type="text"
            id={"mainFilterInputFrom"}
            className={"mainFilterInput"}
            {...register("min_sum")}
          />
          <label htmlFor={"mainFilterInputTo"} style={{ color: "white" }}>
            To
          </label>
          <input
            type="text"
            id={"mainFilterInputTo"}
            className={"mainFilterInput"}
            {...register("max_sum")}
          />
        </div>
        <section className={"mainFilterRiseFallButtonsSectionWrapper"}>
          <div className={"mainFilterRiseButtonBlock"}>
            <label className={"mainFilterButtonText"}>ascending</label>
            <input type="checkbox" />
          </div>
          <div className={"mainFilterFallButtonBlock"}>
            <label className={"mainFilterButtonText"}>descending</label>
            <input type="checkbox" />
          </div>
        </section>

        <section className={"mainFilterExpenseIncomesButtonsSectionWrapper"}>
          <div className={"mainFilterFallButtonBlock"}>
            <h2 className={"mainFilterButtonText"}>Incomes</h2>
            <input
              type="checkbox"
              value={"income"}
              onChange={(e) => {
                const value = e.target.value;
                setExpIncArr((prev: string[]) =>
                  prev.includes(value)
                    ? prev.filter((it) => it != value)
                    : [...prev, value],
                );
              }}
            />
          </div>
          <div className={"mainFilterFallButtonBlock"}>
            <h2 className={"mainFilterButtonText"}>Expenses</h2>
            <input
              type="checkbox"
              value={"expense"}
              onChange={(e) => {
                const value = e.target.value;
                setExpIncArr((prev: string[]) =>
                  prev.includes(value)
                    ? prev.filter((it) => it != value)
                    : [...prev, value],
                );
              }}
            />
          </div>
        </section>
        <div className={"mainFilterSubmitButtonWrapper"}>
          <button className={"mainFilterSubmitButton"}>Submit</button>
        </div>
      </form>
    </motion.div>
  );
};
