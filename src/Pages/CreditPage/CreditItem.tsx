import { NavLink } from "react-router-dom";
import "./CreditPage.css";
interface CreditItemProps {
  icon: string;
  loan_amount: number;
  loan_name: string;
  comment?: string;
  color?: string;
  id: number;
}

export const CreditItem = ({
  loan_amount,
  loan_name,
  icon,
  comment,
  color,
  id,
}: CreditItemProps) => {
  return (
    <NavLink
      to={`/credit/${id}`}
      className={"CreditItem"}
      style={{ backgroundColor: color ? color : "#6a6a6a" }}
    >
      <div className={"CreditItemLeftPart"}>
        <div
          dangerouslySetInnerHTML={{ __html: icon }}
          className={"infoSvg"}
        ></div>
        <div>
          <h2 className={"textBox"}>{loan_name}</h2>
          {comment && <h2 className={"textBox"}>{comment}</h2>}
        </div>
      </div>
      <div className={"CreditItemRightPart"}>
        <h2 className={"textBox"}>{loan_amount}</h2>
        <div className={"DeleteButtonWrapper"}>
          <button className={"DeleteButton"}>X</button>
        </div>
      </div>
    </NavLink>
  );
};
