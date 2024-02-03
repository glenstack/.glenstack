import React from "react";
import { useTable } from "react-table";

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
}) => {
  const [value, setValue] = React.useState(initialValue);

  const onChange = e => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    console.log("Updated data value");
    console.log({ index, id, value });
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (id == "status") {
    return (
      <input
        className={pillMapping[value]}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    );
  } else {
    return <input value={value} onChange={onChange} onBlur={onBlur} />;
  }
};

const pillMapping = {
  single:
    "w-2/5 py-2 px-4 rounded-full bg-rose-200 text-rose-600 font-sans text-center",
  relationship:
    "w-2/5 py-2 px-4 rounded-full bg-yellow-200 text-yellow-600 font-sans text-center",
  complicated:
    "w-2/5 py-2 px-4 rounded-full bg-indigo-200 text-indigo-600 font-sans text-center",
};

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

function Table({ columns, data }) {
  // For this example, we're using pagination to illustrate how to stop
  // the current page from resetting when our data changes
  // Otherwise, nothing is different here.
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable({
    columns,
    data,
    defaultColumn,
  });

  // Render the UI for your table
  return (
    <>
      <div class="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        /Glenstack/Demos/Glenstack-Demo-Table
      </div>
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table
                class="min-w-full divide-y divide-gray-200"
                {...getTableProps()}
              >
                <thead class="bg-gray-50">
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <th
                          scope="col"
                          class="font-sans px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                          {...column.getHeaderProps()}
                        >
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  class="bg-white divide-y divide-gray-200"
                  {...getTableBodyProps()}
                >
                  {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                          return (
                            <td
                              class="font-sans px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                              {...cell.getCellProps()}
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <nav class="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
          <div class="-mt-px w-0 flex-1 flex">
            <a
              href="#"
              class="font-sans border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              <svg
                class="mr-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Previous
            </a>
          </div>
          <div class="hidden md:-mt-px md:flex">
            <a
              href="#"
              class="font-sans border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
            >
              1
            </a>
            <a
              href="#"
              class="font-sans border-rose-500 text-rose-600 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
              aria-current="page"
            >
              2
            </a>
            <a
              href="#"
              class="font-sans border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
            >
              3
            </a>
            <span class="font-sans border-transparent text-gray-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">
              ...
            </span>
            <a
              href="#"
              class="font-sans border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
            >
              8
            </a>
            <a
              href="#"
              class="font-sans border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
            >
              9
            </a>
            <a
              href="#"
              class="font-sans border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
            >
              10
            </a>
          </div>
          <div class="-mt-px w-0 flex-1 flex justify-end">
            <a
              href="#"
              class="font-sans border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Next
              <svg
                class="ml-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: " ",
        columns: [
          {
            Header: "First Name",
            accessor: "firstName",
          },
          {
            Header: "Last Name",
            accessor: "lastName",
          },
          {
            Header: "Age",
            accessor: "age",
          },
          {
            Header: "Status",
            accessor: "status",
          },
        ],
      },
    ],
    []
  );

  const nastyJsonDemoData = [
    {
      firstName: "balloon",
      lastName: "liquid",
      age: 14,
      status: "complicated",
    },
    {
      firstName: "pocket",
      lastName: "coach",
      age: 11,
      status: "single",
    },
    {
      firstName: "possession",
      lastName: "vegetable",
      age: 26,
      status: "single",
    },
    {
      firstName: "amusement",
      lastName: "interest",
      age: 20,
      status: "relationship",
    },
    {
      firstName: "truth",
      lastName: "crib",
      age: 24,
      status: "relationship",
    },
    {
      firstName: "bell",
      lastName: "box",
      age: 23,
      status: "relationship",
    },
    {
      firstName: "departure",
      lastName: "test",
      age: 29,
      status: "complicated",
    },
    {
      firstName: "quilt",
      lastName: "hands",
      age: 7,
      status: "complicated",
    },
    {
      firstName: "seashore",
      lastName: "distribution",
      age: 15,
      status: "relationship",
    },
    {
      firstName: "depth",
      lastName: "cows",
      age: 7,
      status: "single",
    },
  ];

  // eslint-disable-next-line
  const data = React.useMemo(() => nastyJsonDemoData, []);

  return <Table columns={columns} data={data} />;
}

export default App;
