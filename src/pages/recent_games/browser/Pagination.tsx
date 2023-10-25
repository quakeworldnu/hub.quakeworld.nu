import { useDemos } from "./context.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useDemoBrowserSettings } from "./hooks.ts";

const PER_PAGE = 20;
const btnClass = "py-2 px-3 bg-slate-800 hover:bg-slate-700 rounded text-xs";

export const Pagination = () => {
  const { count, isLoading } = useDemos();
  const { settings, setPage } = useDemoBrowserSettings();

  function handleNextClick() {
    setPage(settings.page + 1);
  }

  function handlePrevClick() {
    setPage(settings.page - 1);
  }

  const totalPages = Math.ceil(count / PER_PAGE);

  if (0 === count || totalPages < 2) {
    return null;
  }

  const hasNextPage = settings.page < totalPages;
  const hasPreviousPage = settings.page > 1;

  return (
    <div className="flex items-center space-x-3">
      <button
        disabled={!hasPreviousPage || isLoading}
        className={btnClass}
        onClick={handlePrevClick}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="mr-1" /> Previous
      </button>
      <div className="text-xs">
        {settings.page} / {totalPages}
      </div>
      <button
        disabled={!hasNextPage || isLoading}
        className={btnClass}
        onClick={handleNextClick}
      >
        Next <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
      </button>
    </div>
  );
};
