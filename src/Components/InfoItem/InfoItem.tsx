import "./InfoItem.css";
import { Link } from "react-router-dom";

interface IinfoItemsProps {
  id: number;
  title: string;
  date: string;
  operation_type: string;
  tags: string;
  total: number;
  svg: string;
}

const InfoItem = (props: IinfoItemsProps) => {
  return (
    <Link to={`/operations/${props.id}`} className="infoItem">
      <div className="infoItemTitle">
        <div
          dangerouslySetInnerHTML={{ __html: props.svg }}
          className={"infoSvg"}
        ></div>
        <div>{props.title}</div>
      </div>
      <div className="infoItemWrapper">
        <div className={"itemTag"}>{props.operation_type}</div>
        <div>{props.date}</div>
      </div>
      <div className={"infoTotal"}>{props.total}</div>
    </Link>
  );
};

export default InfoItem;
