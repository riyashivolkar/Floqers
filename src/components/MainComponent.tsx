import React, { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import { useTable, useSortBy, Column } from 'react-table';
import 'tailwindcss/tailwind.css';

interface SalaryData {
    work_year: string;
    salary_in_usd: number;
}

interface TableData {
    year: string;
    totalJobs: number;
    averageSalary: number;
}

const MainComponent: React.FC = () => {
    const [data, setData] = useState<SalaryData[]>([]);
    const [tableData, setTableData] = useState<TableData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/salaries.csv');
                const csvData = await response.text();
                const parsedData = Papa.parse<SalaryData>(csvData, { header: true }).data;
                setData(parsedData);
            } catch (error) {
                console.error('Error fetching or parsing CSV data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data.length === 0) return;

        const yearMap = new Map<string, { totalJobs: number; totalSalary: number }>();

        data.forEach((entry) => {
            const year = entry.work_year;
            const salary = parseFloat(entry.salary_in_usd.toString());
            if (!isNaN(salary)) {
                if (!yearMap.has(year)) {
                    yearMap.set(year, { totalJobs: 1, totalSalary: salary });
                } else {
                    const yearData = yearMap.get(year)!;
                    yearData.totalJobs += 1;
                    yearData.totalSalary += salary;
                    yearMap.set(year, yearData);
                }
            }
        });

        const tableDataArray = Array.from(yearMap).map(([year, { totalJobs, totalSalary }]) => ({
            year,
            totalJobs,
            averageSalary: totalSalary / totalJobs,
        }));

        setTableData(tableDataArray);
    }, [data]);

    const columns: Column<TableData>[] = useMemo(
        () => [
            {
                Header: 'Year',
                accessor: 'year',
            },
            {
                Header: 'Number of Total Jobs',
                accessor: 'totalJobs',
            },
            {
                Header: 'Average Salary (USD)',
                accessor: 'averageSalary',
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: tableData }, useSortBy);

    return (
        <div>
            <h2>Main Table</h2>
            <table {...getTableProps()} className="w-full border border-collapse border-gray-200 table-auto">
                <thead className="bg-gray-100">
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className="px-4 py-2 border border-gray-300"
                                >
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} className="hover:bg-gray-50">
                                {row.cells.map((cell) => {
                                    return <td {...cell.getCellProps()} className="px-4 py-2 border border-gray-300">{cell.render('Cell')}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default MainComponent;
