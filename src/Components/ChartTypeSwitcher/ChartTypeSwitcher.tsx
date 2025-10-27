import type { Dispatch, SetStateAction } from "react";

type ChartTypeSwitcherProps = {
  setChecked: Dispatch<SetStateAction<boolean>>;
  checked: boolean;
};

const ChartTypeSwitcher = ({ setChecked, checked }: ChartTypeSwitcherProps) => {
  return (
    <div className={"toggleGraphContainer"}>
      <svg
        fill={checked ? "#000" : "#fff"}
        height="25px"
        width="25px"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 59.903 59.903"
        className={"pieChartSvg"}
        onClick={() => setChecked((checked: boolean) => !checked)}
      >
        <g>
          <path
            d="M57.313,42.578l0.39-0.924c5.998-15.377-0.878-32.875-15.924-39.262C38.039,0.805,34.099,0,30.07,0
		C18.002,0,7.157,7.178,2.442,18.286c-3.131,7.376-3.202,15.53-0.2,22.96s8.717,13.246,16.094,16.377
		c3.736,1.586,7.588,2.28,11.616,2.28h0c3.808,0,7.627-0.606,11.182-2.019l0.935-0.372L31.63,31.677L57.313,42.578z"
          />
          <path
            d="M59.579,46.078L35.93,36.039l9.36,23.166c0.171,0.424,0.578,0.698,1.036,0.698l0.267-0.011l0.198-0.091
		c5.565-2.545,10.162-6.933,12.944-12.352c0.143-0.276,0.163-0.602,0.058-0.895L59.579,46.078z"
          />
        </g>
      </svg>
      <svg
        width="30px"
        height="30px"
        viewBox="0 0 24 24"
        fill={checked ? "#fff " : "#000"}
        onClick={() => setChecked((checked) => !checked)}
        xmlns="http://www.w3.org/2000/svg"
        className={"barChartSvg"}
      >
        <path
          d="M12 19L12 11"
          stroke={checked ? "#fff " : "#000"}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M7 19L7 15"
          stroke={checked ? "#fff " : "#000"}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M17 19V6"
          stroke={checked ? "#fff " : "#000"}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="checkbox"
        className={"toggleGraph"}
        id={"toggleGraph"}
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
      />
      <label htmlFor="toggleGraph" className={"toggleGraphLabel"}></label>
    </div>
  );
};
export default ChartTypeSwitcher;
