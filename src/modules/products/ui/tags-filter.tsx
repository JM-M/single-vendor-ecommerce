import { Checkbox } from "@/components/ui/checkbox";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

interface TagsFilterProps {
  value?: string[] | null;
  onChange: (value: string[]) => void;
}

export const TagsFilter = ({ value, onChange }: TagsFilterProps) => {
  const trpc = useTRPC();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        },
      ),
    );

  const onClick = (tag: string) => {
    if (value?.includes(tag)) {
      onChange(value.filter((t) => t !== tag) || []);
    } else {
      onChange([...(value || []), tag]);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages.map((page) =>
          page.docs.map((tag) => {
            const { id, name } = tag;
            return (
              <div
                key={id}
                className="flex cursor-pointer items-center justify-between"
                onClick={() => onClick(name)}
              >
                <p className="font-medium">{name}</p>
                <Checkbox
                  checked={value?.includes(name)}
                  onCheckedChange={() => onClick(name)}
                />
              </div>
            );
          }),
        )
      )}
      {hasNextPage && (
        <button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="inline-flex cursor-pointer items-center justify-start gap-2 text-start font-medium underline disabled:opacity-50"
        >
          {isFetchingNextPage && <LoaderIcon className="size-4 animate-spin" />}
          Load more...
        </button>
      )}
    </div>
  );
};
