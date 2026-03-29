import { useNavigate } from "react-router-dom";

export const ButtonBack = () => {
  const navigate = useNavigate();

  return (
    <button className={"CreditFormButtonBack"} onClick={() => navigate(-1)}>
      Back
    </button>
  );
};
