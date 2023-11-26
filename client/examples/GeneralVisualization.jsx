import { useEffect, useState } from 'react';
import PageNav from '../components/PageNav';
import styles from './GeneralVisualization.module.css';

export default function GeneralVisualization() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:7000/employees');
      const data = await res.json();

      setEmployees(data);
    };

    fetchData();
  }, []);

  return (
    <main className={styles.login}>
      <PageNav />

      <section className="mt-5">
        <div>
          <ul>
            {employees.map((employee) => (
              <li key={employee.id} className="mb-5 bg-black">
                <p>{employee.id}</p>
                <p>{employee.firstName}</p>
                <p>{employee.lastName}</p>
                <p>{employee.email}</p>
                <p>{employee.phone}</p>
                <p>{employee.birthDate}</p>
                <p>{employee.title}</p>
                <p>{employee.dept}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
