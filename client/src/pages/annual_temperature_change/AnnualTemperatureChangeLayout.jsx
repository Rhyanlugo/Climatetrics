import PageNav from '../../components/PageNav';
import styles from './AnnualTemperatureChangeLayout.module.css';
import AnnualTemperatureChangeByCountries from './AnnualTemperatureChangeByCountries';

export default function AnnualTemperatureChangeLayout() {
  return (
    <main className={styles.container}>
      <PageNav />

      <section className="grid-row-3 grid grid-flow-row gap-4">
        <div className="mx-2 my-5 rounded-lg bg-gray-600 p-4">
          <AnnualTemperatureChangeByCountries />
        </div>
      </section>
    </main>
  );
}
