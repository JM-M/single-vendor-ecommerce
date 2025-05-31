"use client";

import { Backdrop } from "@/components/backdrop";
import { Input } from "@/components/ui/input";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { LoaderIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { SearchInputResults } from "./search-input-results";

interface Props {
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const SearchInput = ({
  disabled,
  defaultValue = "",
  onChange,
}: Props) => {
  const [searchValue, setSearchValue] = useState(defaultValue);
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const [isOpen, setIsOpen] = useState(false);

  const trpc = useTRPC();
  const {
    data,
    isLoading,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions(
      {
        search: debouncedSearchValue,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        },
        enabled: !!debouncedSearchValue,
      },
    ),
  );

  const products = data?.pages.flatMap((page) => page.docs);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange?.(searchValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [onChange, searchValue]);

  useEffect(() => {
    const onScroll = () => {
      setIsOpen(false);
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [setIsOpen]);

  return (
    <div className="flex w-full items-center gap-2">
      {isOpen && <Backdrop className="z-10" onClick={() => setIsOpen(false)} />}
      <div className="relative z-10 w-full">
        <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
        <Input
          className="pl-8"
          placeholder="Search products"
          value={searchValue}
          onChange={(e) => {
            if (products && products.length > 0 && !isOpen) {
              setIsOpen(true);
            }
            if (!e.target.value) setIsOpen(false);
            setSearchValue(e.target.value);
          }}
          disabled={disabled}
        />
        {/* TODO: Debug loading state */}
        {isFetching && (
          <LoaderIcon className="absolute top-1/2 right-3 size-5 -translate-y-1/2 animate-spin text-neutral-500" />
        )}
        {isOpen && <SearchInputResults products={products} />}
      </div>
      {/* <Button variant="elevated" asChild>
        <Link href={`/s?q=${searchValue}`}>Search</Link>
      </Button> */}
    </div>
  );
};
