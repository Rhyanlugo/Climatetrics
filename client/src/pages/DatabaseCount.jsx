import { useEffect, useState } from 'react';
import PageNav from '../components/PageNav';
import styles from './DatabaseCount.module.css';
import Spinner from '../components/Spinner';

export default function DatabaseCount() {
  const [databaseCount, setDatabaseCount] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDatabaseCount = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(`http://localhost:7000/databaseCount`);

        const data = await res.json();

        setDatabaseCount(data);
      } catch (err) {
        console.error('There was an error fetching the countries.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatabaseCount();
  }, []);

  return (
    <main className={styles.container}>
      <PageNav />

      <section className="mx-2 my-5 rounded-lg bg-gray-500 p-4">
        {isLoading ? (
          <DisplayLoading />
        ) : (
          <div className="inline-block min-w-full rounded-lg py-2 sm:px-6 lg:px-8">
            <div className="flex justify-center overflow-hidden">
              <table className="text-center  font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr className="text-5xl">
                    <th scope="col" className="px-6 py-4 font-bold ">
                      Table
                    </th>
                    <th scope="col" className="px-6 py-4 font-bold">
                      Row Count
                    </th>
                  </tr>
                </thead>
                <tbody className="text-3xl">
                  {databaseCount.map((table, index) =>
                    index % 2 === 0 ? (
                      <tr
                        className="border-b border-neutral-100 bg-neutral-50 text-neutral-800 dark:bg-neutral-50"
                        key={index}
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          {table.tableName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {table.rowCount}
                        </td>
                      </tr>
                    ) : (
                      <tr
                        className="border-b border-neutral-700 bg-neutral-800 text-neutral-50 dark:border-neutral-600 dark:bg-neutral-700"
                        key={index}
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          {table.tableName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {table.rowCount}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function DisplayLoading() {
  return (
    <div className="mt-5 grid grid-rows-2 items-center justify-center text-lg font-semibold text-black">
      <Spinner />
      <p>Loading data...</p>
    </div>
  );
}
