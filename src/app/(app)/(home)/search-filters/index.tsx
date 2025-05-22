import { Categories } from "./categories";
import { SearchInput } from "./search-input";

export const SearchFilters = () => {
  return (
    <div
      className="flex w-full flex-col gap-4 border-b px-12 py-8 lg:px-4"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <Categories />
      </div>
    </div>
  );
};

export const SearchFiltersSkeleton = () => {
  return (
    <div
      className="flex w-full flex-col gap-4 border-b px-12 py-8 lg:px-4"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
};
