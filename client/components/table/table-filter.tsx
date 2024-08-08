import { Input } from "@/components/ui/input";
import { TableQuery } from "@/lib/query-params/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export function TableFilter() {
  const [value, setValue] = useState<string>("");
  const [searchValue] = useDebounce(value, 500);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value.length < 2) {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    router.push(
      pathname + "?" + createQueryString(TableQuery.SEARCH, searchValue),
    );
  }, [router, searchValue, createQueryString, pathname]);

  return (
    <Input
      placeholder="Search keywords..."
      value={value ?? ""}
      onChange={(e) => setValue(e.target.value)}
      className="max-w-sm"
    />
  );
}
