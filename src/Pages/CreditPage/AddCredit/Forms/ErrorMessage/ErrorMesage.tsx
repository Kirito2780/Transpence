interface IMessageProps {
  message: string | undefined;
}

export const ErrorMessage = ({ message }: IMessageProps) => {
  return <span className={"formErrorMessage"}>{message}</span>;
};
