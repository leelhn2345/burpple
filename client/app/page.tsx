import { columns, Restaurant } from "../components/table/table-column";
import { DataTable } from "../components/table/table";

type Response = {
  total: number;
  data: Restaurant[];
};

async function getData(queryParams: URLSearchParams): Promise<Response> {
  // Fetch data from your API here.
  let url = `${process.env.BACKEND_URL}/restaurants`;
  if (queryParams.toString().length > 0) {
    url += `?${queryParams}`;
  }
  const res = await fetch(url, {
    cache: "no-cache",
  });
  console.log(res);
  return res.json();
}

type Props = {
  searchParams: {
    search?: string;
    column?: string;
    limit?: number;
    offset?: number;
    sort?: "asc" | "desc";
  };
};

export default async function Home({ searchParams }: Props) {
  const queryParams = new URLSearchParams();
  Object.entries(searchParams).map(([k, v]) => {
    if (v) {
      queryParams.append(k, v.toString());
    }
  });
  const data = await getData(queryParams);
  return (
    <div className="container py-2">
      <DataTable
        columns={columns}
        totalRowCount={data.total}
        data={data.data}
      />
    </div>
  );
}
