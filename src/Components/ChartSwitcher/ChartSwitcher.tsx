import type { Dispatch, SetStateAction } from "react";

type ChartSwitcherProps = {
  setChangeDiagram: Dispatch<SetStateAction<boolean>>;
  changeDiagram: boolean;
};

export const ChartSwitcher = ({
  setChangeDiagram,
  changeDiagram,
}: ChartSwitcherProps) => {
  return (
    <div className={"toggleDiagramTypeWrapper"}>
      <span
        className={"toggleDiagramTypeSpan"}
        onClick={() => setChangeDiagram((prev: boolean) => !prev)}
      >
        monthly
      </span>
      <input
        type="checkbox"
        id={"toggleDiagramType"}
        className={"toggleDiagramTypeInput"}
        checked={changeDiagram}
        onChange={() => setChangeDiagram((prev: boolean) => !prev)}
      />
      <label
        htmlFor={"toggleDiagramType"}
        className={"toggleDiagramTypeLabel"}
      ></label>

      <span
        className={"toggleDiagramTypeSpan"}
        onClick={() => setChangeDiagram((prev: boolean) => !prev)}
      >
        by tags
      </span>
    </div>
  );
};
