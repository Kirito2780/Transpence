import { useState } from "react";

export const HistorySection = () => {
  const [unwrapped, setUnwrapped] = useState(false);

  return (
    <section
      className={
        unwrapped ? "HistorySectionUnwrapper" : "HistorySectionWrapper"
      }
    >
      <button onClick={() => setUnwrapped((prev) => !prev)}>show more</button>
    </section>
  );
};
