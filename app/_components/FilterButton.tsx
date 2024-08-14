import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

export default function FilterButton({
  filters,
  selectedFilters,
  setSelectedFilters,
}: {
  filters: string[];
  selectedFilters: string[];
  setSelectedFilters: (filters: string[]) => void;
}) {
  const [isDisabled, setDisabled] = useState(false);
  const delay = 200;

  useEffect(() => {
    if (!isDisabled) {
      // timeout elapsed, nothing to do
      return;
    }

    // isDisabled was changed to true, set back to false after `delay`
    const handle = setTimeout(() => {
      setDisabled(false);
    }, delay);
    return () => clearTimeout(handle);
  }, [isDisabled, delay]);

  return (
    <div className="flex gap-2 overflow-x-scroll no-scrollbar px-4">
      {filters.map((tag) => (
        <a key={tag} className="list-none">
          <li>
            <Badge
              id={`${tag}-filter`}
              onClick={() => {
                selectedFilters = selectedFilters.includes(tag)
                  ? selectedFilters.filter((tagInFilter) => tagInFilter !== tag)
                  : [...selectedFilters, tag];
                !isDisabled && setSelectedFilters(selectedFilters);
                setDisabled(true);
              }}
              variant={selectedFilters.includes(tag) ? "default" : "button"}
              className="cursor-pointer"
            >
              {tag}
            </Badge>
          </li>
        </a>
      ))}
    </div>
  );
}
