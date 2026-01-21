import DatePicker from "react-datepicker";
import { useState } from "react";

interface HistoryFilter {
  date_start: string;
  date_end: string;
  tags: string[];
}

interface HistoryFilterModalProps {
  onApply: (filters: HistoryFilter) => void;
  onClose: () => void;
}

export const HistoryFilterModal = ({
  onApply,
  onClose,
}: HistoryFilterModalProps) => {
  const types = ["Create", "Delete", "Action", "Change"];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 0);
  const lastDay = new Date(year, month + 1, 0);
  const [date_start, setDate_start] = useState<Date | null>(firstDay);
  const [date_end, setDate_end] = useState<Date | null>(lastDay);
  const [typeArr, setTypeArr] = useState<string[]>([]);

  const handleSend = () => {
    onApply({
      date_start: date_start?.toISOString().slice(0, 10) ?? "",
      date_end: date_end?.toISOString().slice(0, 10) ?? "",
      tags: typeArr,
    });

    onClose();
  };

  return (
    <>
      <div className="datePickerWrapper">
        <h2 className="datePickerHeader">Select logs time interval</h2>

        <label className="datePickerLabel">from</label>
        <DatePicker
          selected={date_start}
          onChange={(date) => setDate_start(date)}
          dateFormat="yyyy-MM-dd"
          className="myDateInput"
        />

        <label className="datePickerLabel">to</label>
        <DatePicker
          selected={date_end}
          onChange={(date) => setDate_end(date)}
          dateFormat="yyyy-MM-dd"
          className="myDateInput"
        />
      </div>

      <div className="FilterWrapper">
        <h2>Select log types</h2>

        {types.map((el) => (
          <div key={el} className="FilterItem">
            <label>{el}</label>
            <input
              type="checkbox"
              checked={typeArr.includes(el)}
              onChange={() =>
                setTypeArr((prev: string[]) =>
                  prev.includes(el)
                    ? prev.filter((i) => i !== el)
                    : [...prev, el],
                )
              }
            />
          </div>
        ))}

        <button className="datePickerButton" onClick={handleSend}>
          Send
        </button>
      </div>
    </>
  );
};
