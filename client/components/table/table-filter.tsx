import { Input } from "@/components/ui/input";
import { TableQuery } from "@/lib/query-params/table";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export function TableFilter() {
  const [value, setValue] = useState<string>("");
  const [searchValue] = useDebounce(value, 500);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const searchParams = new URLSearchParams();
    searchParams.set(TableQuery.SEARCH, searchValue);
    router.push(pathname + "?" + searchParams);
  }, [router, searchValue, pathname]);

  return (
    <Input
      placeholder="Search keywords..."
      value={value ?? ""}
      onChange={(e) => setValue(e.target.value)}
      className="max-w-sm"
    />
  );
}
