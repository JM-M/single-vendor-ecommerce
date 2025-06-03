import { CpuIcon } from "lucide-react";

export const ProductHighlights = () => {
  return (
    <ul className="grid grid-cols-3 gap-4">
      <li className="flex items-center gap-3">
        <CpuIcon className="size-16" />
        <span className="font-medium">Intel 10th Generation Core i5</span>
      </li>
      <li className="flex items-center gap-3">
        <CpuIcon className="size-16" />
        <span className="font-medium">Intel 10th Generation Core i5</span>
      </li>
      <li className="flex items-center gap-3">
        <CpuIcon className="size-16" />
        <span className="font-medium">Intel 10th Generation Core i5</span>
      </li>
      <li className="flex items-center gap-3">
        <CpuIcon className="size-16" />
        <span className="font-medium">Intel 10th Generation Core i5</span>
      </li>
      <li className="flex items-center gap-3">
        <CpuIcon className="size-16" />
        <span className="font-medium">Intel 10th Generation Core i5</span>
      </li>
      <li className="flex items-center gap-3">
        <CpuIcon className="size-16" />
        <span className="font-medium">Intel 10th Generation Core i5</span>
      </li>
    </ul>
  );
};
