import type { Files } from "./FilesSection.tsx";
import React from "react";

interface FilesItemProps {
  data: Files;
  setSelected: (id: number) => void;
  selected: number[];
}

const FileSectionItem = ({ data, setSelected, selected }: FilesItemProps) => {
  const TimeData = new Date(data.uploaded_at);

  const ResultTime = TimeData.toLocaleString("en-US");

  return (
    <div
      className={
        selected.includes(data.id)
          ? "FileSectionItemClicked"
          : "FileSectionItem"
      }
      onClick={() => {
        setSelected(data.id);
      }}
    >
      <h4>{data.file_name}</h4>
      <span>{ResultTime}</span>
    </div>
  );
};

export default React.memo(FileSectionItem);
