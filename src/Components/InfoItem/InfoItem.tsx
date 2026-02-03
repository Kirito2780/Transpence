import "./InfoItem.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/Store.tsx";

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
  const currency = useSelector(
    (state: RootState) => state.CurrencySlice.currency,
  );

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
      <div className={"infoTotal"}>
        {props.total}
        <span>{currency}</span>
      </div>
    </Link>
  );
};

export default InfoItem;
