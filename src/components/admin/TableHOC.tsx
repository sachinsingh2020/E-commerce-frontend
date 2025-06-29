import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import {
  useTable,
  useSortBy,
  usePagination,
  type Column,
  type TableOptions,
  type Row,
  type Cell,
  type HeaderGroup,
  type UseSortByColumnProps,
  type UsePaginationInstanceProps,
  type UseSortByInstanceProps,
  type TableState,
} from "react-table";

function TableHOC<T extends object>(
  columns: Column<T>[],
  data: T[],
  containerClassname: string,
  heading: string,
  showPagination: boolean = false
) {
  return function HOC() {
    const options: TableOptions<T> = {
      columns,
      data,
      initialState: {
        pageSize: 6,
      } as Partial<TableState<T>>,
    };

    const tableInstance = useTable<T>(
      options,
      useSortBy,
      usePagination
    ) as ReturnType<typeof useTable<T>> &
      UsePaginationInstanceProps<T> &
      UseSortByInstanceProps<T>;

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      nextPage,
      previousPage,
      canNextPage,
      canPreviousPage,
      pageCount,
      state,
    } = tableInstance;

    const { pageIndex } = state as Partial<{ pageIndex: number }>;

    return (
      <div className={containerClassname}>
        <h2 className="heading">{heading}</h2>

        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup: HeaderGroup<T>) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const col = column as typeof column & UseSortByColumnProps<T>;
                  return (
                    <th {...col.getHeaderProps(col.getSortByToggleProps())}>
                      {col.render("Header")}
                      {col.isSorted && (
                        <span>
                          {col.isSortedDesc ? (
                            <AiOutlineSortDescending />
                          ) : (
                            <AiOutlineSortAscending />
                          )}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row: Row<T>) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell: Cell<T>) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {showPagination && (
          <div className="table-pagination">
            <button disabled={!canPreviousPage} onClick={previousPage}>
              Prev
            </button>
            <span>{`${pageIndex ? pageIndex + 1 : 1} of ${pageCount}`}</span>
            <button disabled={!canNextPage} onClick={nextPage}>
              Next
            </button>
          </div>
        )}
      </div>
    );
  };
}

export default TableHOC;
