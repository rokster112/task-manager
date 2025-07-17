export function DashboardSelectChange(e, setSearchParams, query) {
  setSearchParams((searchParams) => {
    searchParams.set(query, e.target.value);
    return searchParams;
  });
}
