import "./CreditItemOperation.css";

interface CreditItemOperationProps {
  pay_date: Date;
  amount: string;
  title: string;
}

export const CreditItemOperation = ({
  pay_date,
  amount,
  title,
}: CreditItemOperationProps) => {
  return (
    <div className={"CreditItemOperation"}>
      <span className={"CreditItemOperationText"}>{title}</span>
      <span className={"CreditItemOperationText"}>{pay_date.toString()}</span>
      <span className={"CreditItemOperationText"}>{amount}</span>
    </div>
  );
};
