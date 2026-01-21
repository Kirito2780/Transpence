import type { HistorySectionData } from "./HistorySection.tsx";
interface HistorySectionItemProps {
  props: HistorySectionData;
}

export const HistorySectionItem = ({ props }: HistorySectionItemProps) => {
  const TimeData = new Date(props.created_at);

  const ResultTime = TimeData.toLocaleString("en-US");
  return (
    <div className="HistorySectionItem">
      <div>
        <h2 style={{ color: props.action_color }}>{props.action_type}</h2>
        <h2>{props.details}</h2>
      </div>
      <div>
        <h2>{ResultTime}</h2>
      </div>
    </div>
  );
};
