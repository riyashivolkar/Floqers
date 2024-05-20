import React, { useEffect, useState } from 'react';
import './App.css';
import useFetch from './hooks/useFetch';
import './index.css'

interface SalaryData {
  work_year: string;
  experience_level: string;
  employment_type: string;
  job_title: string;
  salary: number;
  salary_currency: string;
  salary_in_usd: number;
  employee_residence: string;
  remote_ratio: number;
  company_location: string;
  company_size: string;
}

interface TableData {
  year: string;
  totalJobs: number;
  averageSalary: number;
}

const App: React.FC = () => {
  const [data, setData] = useState<SalaryData[]>([]);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const { fetchCsvData } = useFetch();

  useEffect(() => {
    fetchCsvData('/data/salaries.csv', setData);
  }, [fetchCsvData]);

  useEffect(() => {
    const processedData = data.reduce((acc, curr) => {
      const year = curr.work_year;
      if (!acc[year]) {
        acc[year] = { totalJobs: 0, totalSalary: 0 };
      }
      acc[year].totalJobs += 1;
      acc[year].totalSalary += curr.salary_in_usd;
      return acc;
    }, {} as Record<string, { totalJobs: number; totalSalary: number }>);

    const tableDataArray = Object.keys(processedData).map(year => ({
      year,
      totalJobs: processedData[year].totalJobs,
      averageSalary: processedData[year].totalSalary / processedData[year].totalJobs,
    }));

    setTableData(tableDataArray);
  }, [data]);

  return (
    <div className="min-h-screen bg-darkBg text-darkText ">
      <h1 className="text-3xl font-bold underline">
        ML Engineer salaries from 2020 to 2024
      </h1>

      {tableData.length ? (
        <table className="w-full mt-8 table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-darkBorder">Year</th>
              <th className="px-4 py-2 border border-darkBorder">Number of Jobs</th>
              <th className="px-4 py-2 border border-darkBorder">Average Salary (USD)</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border border-darkBorder">{row.year}</td>
                <td className="px-4 py-2 border border-darkBorder">{row.totalJobs}</td>
                <td className="px-4 py-2 border border-darkBorder">{row.averageSalary.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default App;
