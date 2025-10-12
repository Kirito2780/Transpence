import "./InfoItem.css";

interface IinfoItemsProps {
  tags: string;
  total: number;
  svg: string;
  date: string;
  title: string;
}

const InfoItem = (props: IinfoItemsProps) => {
  return (
    <div className="infoItem">
      <div className="infoItemTitle">
        <div
          dangerouslySetInnerHTML={{ __html: props.svg }}
          className={"infoSvg"}
        ></div>
        <div>{props.title}</div>
      </div>
      <div className="infoItemWrapper">
        <div className={"itemTag"}>{props.tags}</div>
        <div>{props.date}</div>
      </div>
      <div className={"infoTotal"}>{props.total}</div>
    </div>
  );
};

export default InfoItem;
