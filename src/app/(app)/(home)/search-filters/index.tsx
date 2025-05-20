import { Categories } from "./categories";
import { SearchInput } from "./search-input";

interface Props {
  data: any;
}

export const SearchFilters = ({ data }: Props) => {
  return (
    <div className="flex w-full flex-col gap-4 border-b px-12 py-8 lg:px-4">
      <SearchInput />
      <Categories data={data} />
    </div>
  );
};
