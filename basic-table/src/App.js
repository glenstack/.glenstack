import React from 'react';
import styled from 'styled-components';
import { useTable } from 'react-table';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody
        className="bg-white divide-y divide-gray-200"
        {...getTableBodyProps()}
      >
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td
                    className="text-sm text-gray-500"
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Table 1',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
          {
            Header: 'Age',
            accessor: 'age',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
        ],
      },
    ],
    [],
  );

  const nastyJsonDemoData = [
    {
      firstName: 'balloon',
      lastName: 'liquid',
      age: 14,
      status: 'complicated',
    },
    {
      firstName: 'pocket',
      lastName: 'coach',
      age: 11,
      status: 'single',
    },
    {
      firstName: 'possession',
      lastName: 'vegetable',
      age: 26,
      status: 'single',
    },
    {
      firstName: 'amusement',
      lastName: 'interest',
      age: 20,
      status: 'relationship',
    },
    {
      firstName: 'truth',
      lastName: 'crib',
      age: 24,
      status: 'relationship',
    },
    {
      firstName: 'bell',
      lastName: 'box',
      age: 23,
      status: 'relationship',
    },
    {
      firstName: 'departure',
      lastName: 'test',
      age: 29,
      status: 'complicated',
    },
    {
      firstName: 'quilt',
      lastName: 'hands',
      age: 7,
      status: 'complicated',
    },
    {
      firstName: 'seashore',
      lastName: 'distribution',
      age: 15,
      status: 'relationship',
    },
    {
      firstName: 'depth',
      lastName: 'cows',
      age: 7,
      status: 'single',
    },
    {
      firstName: 'weight',
      lastName: 'flower',
      age: 20,
      status: 'complicated',
    },
    {
      firstName: 'ray',
      lastName: 'hole',
      age: 27,
      status: 'single',
    },
    {
      firstName: 'credit',
      lastName: 'audience',
      age: 9,
      status: 'single',
    },
    {
      firstName: 'dock',
      lastName: 'muscle',
      age: 6,
      status: 'relationship',
    },
    {
      firstName: 'childhood',
      lastName: 'plough',
      age: 22,
      status: 'complicated',
    },
    {
      firstName: 'friend',
      lastName: 'estate',
      age: 28,
      status: 'single',
    },
    {
      firstName: 'rabbits',
      lastName: 'machine',
      age: 4,
      status: 'single',
    },
    {
      firstName: 'alley',
      lastName: 'category',
      age: 6,
      status: 'single',
    },
    {
      firstName: 'aunt',
      lastName: 'top',
      age: 22,
      status: 'complicated',
    },
    {
      firstName: 'union',
      lastName: 'thread',
      age: 24,
      status: 'relationship',
    },
  ];

  // eslint-disable-next-line
  const data = React.useMemo(() => nastyJsonDemoData, []);

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default App;
