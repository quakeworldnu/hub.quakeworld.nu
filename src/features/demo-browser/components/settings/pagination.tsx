import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import type { ChangeEvent } from "react";
import { FontAwesomeIcon } from "@/components/ui/icon";
import { btnSecondary, formInput, sizeSmall } from "@/components/ui/theme";
import { useGameSettings } from "@/features/demo-browser/stores/browser-settings";
import { useGames } from "@/features/demo-browser/stores/games";

const PER_PAGE = 15;

export const Pagination = () => {
  const { count, hasGames } = useGames();
  const { page, nextPage, prevPage } = useGameSettings();
  const pageCount = Math.ceil(count / PER_PAGE);

  if (!hasGames || pageCount < 2) {
    return null;
  }

  const hasNextPage = page < pageCount;
  const hasPreviousPage = page > 1;

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        disabled={!hasPreviousPage}
        className={`${sizeSmall} ${btnSecondary}`}
        onClick={prevPage}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="mr-1" /> Previous
      </button>
      <PagNumberSelect pageCount={pageCount} />
      <button
        type="button"
        disabled={!hasNextPage}
        className={`${sizeSmall} ${btnSecondary}`}
        onClick={nextPage}
      >
        Next <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
      </button>
    </div>
  );
};

const PagNumberSelect = ({ pageCount = 1 }: { pageCount: number }) => {
  const { page, setPage } = useGameSettings();

  if (pageCount < 2) {
    return null;
  }

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const pageNumber = Number.parseInt(e.target.value, 10);
    setPage(pageNumber);
  }

  const pageNumbers = Array.from(Array(pageCount).keys());

  return (
    <div className="flex items-center space-x-2">
      <select className={formInput} value={page} onChange={handleChange}>
        {pageNumbers.map((p) => (
          <option key={p} value={1 + p}>
            {1 + p}
          </option>
        ))}
      </select>
      <div className="text-xs">of {pageCount}</div>
    </div>
  );
};
