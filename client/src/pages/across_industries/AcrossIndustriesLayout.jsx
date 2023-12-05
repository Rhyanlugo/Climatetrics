import PageNav from '../../components/PageNav';
import styles from './AcrossIndustriesLayout.module.css';
import { Outlet } from 'react-router-dom';

export default function AcrossIndustriesLayout() {
  return (
    <main className={styles.container}>
      <PageNav />

      <section className="mx-2 my-5 rounded-lg bg-gray-600 p-4">
        <Outlet />
      </section>
    </main>
  );
}
