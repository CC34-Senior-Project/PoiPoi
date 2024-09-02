import { useCallback, useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // remove filter param's value from URL
  const removeFiltersQueryString = useCallback((): string => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filters", "");

    return params.toString();
  }, [searchParams]);

  // add filters param's value to URL
  const createFiltersQueryString = useCallback(
    (value: string): string => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("filters", value);

      return params.toString();
    },
    [searchParams]
  );

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
                const filter = tag.toLowerCase();

                // update selectedFilters by selection (add/remove)
                selectedFilters = selectedFilters
                  .map((selectedFilter) => selectedFilter.toLowerCase())
                  .includes(filter)
                  ? selectedFilters.filter(
                      (tagInFilter) => tagInFilter !== filter
                    )
                  : [...selectedFilters, filter];
                !isDisabled && setSelectedFilters(selectedFilters);

                // set timer to disable button, prevent accidentally clicking
                setDisabled(true);

                // add to URL params
                // if no selectedFilter, remove param's value
                if (selectedFilters.length === 0) {
                  router.push(pathname + "?" + removeFiltersQueryString());
                } else {
                  const param = `${selectedFilters.join(",")}`;
                  router.push(
                    pathname + "?" + createFiltersQueryString(param)
                  );
                }
              }}
              variant={
                selectedFilters
                  .map((tag) => tag.toLowerCase())
                  .includes(tag.toLowerCase())
                  ? "default"
                  : "button"
              }
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
