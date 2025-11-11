import { useMemo, useState } from "react";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pagesLength: number;
}

const Pagination = ({
  currentPage,
  setCurrentPage,
  pagesLength,
}: PaginationProps) => {
  const [startPage, setStartPage] = useState<number>(1);

  const paginationButtons = useMemo(() => {
    const buttons: number[] = [];
    const maxPage = Math.min(startPage + 4, pagesLength);

    for (let i = startPage; i <= maxPage; i++) {
      buttons.push(i);
    }

    return buttons;
  }, [pagesLength, startPage]);

  const handlePrevRange = () => {
    setStartPage((prev) => Math.max(prev - 5, 1));
  };

  const handleNextRange = () => {
    setStartPage((prev) => {
      const next = prev + 5;
      return next > pagesLength ? prev : Math.min(next, pagesLength - 4);
    });
  };

  return (
    <div className="PagiButtonsWrapper">
      <button className="PagiButtonsArrowLeft" onClick={handlePrevRange}>
        ←
      </button>

      {paginationButtons.map((num) => (
        <button
          key={num}
          className={`PagiButtons ${num === currentPage ? "active" : ""}`}
          onClick={() => setCurrentPage(num)}
        >
          {num}
        </button>
      ))}

      <button className="PagiButtonsArrowRight" onClick={handleNextRange}>
        →
      </button>
    </div>
  );
};

export default Pagination;
