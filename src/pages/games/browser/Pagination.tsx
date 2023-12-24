import { useDemos } from "./context.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useDemoBrowserSettings } from "./hooks.ts";
import { ChangeEvent } from "react";
import { btnSecondary, formInput, sizeSmall } from "../ui/theme.ts";

const PER_PAGE = 20;
export const Pagination = () => {
  const { count } = useDemos();
  const { settings, nextPage, prevPage } = useDemoBrowserSettings();
  const pageCount = Math.ceil(count / PER_PAGE);

  if (0 === count || pageCount < 2) {
    return null;
  }

  const hasNextPage = settings.page < pageCount;
  const hasPreviousPage = settings.page > 1;

  return (
    <div className="flex items-center space-x-3">
      <button
        disabled={!hasPreviousPage}
        className={`${sizeSmall} ${btnSecondary}`}
        onClick={prevPage}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="mr-1" /> Previous
      </button>
      <PagNumberSelect pageCount={pageCount} />
      <button
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
  const { settings, setPage } = useDemoBrowserSettings();

  if (pageCount < 2) {
    return null;
  }

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const pageNumber = parseInt(e.target.value);
    setPage(pageNumber);
  }

  const pageNumbers = Array.from(Array(pageCount).keys());

  return (
    <div className="flex items-center space-x-2">
      <select
        className={formInput}
        value={settings.page}
        onChange={handleChange}
      >
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
