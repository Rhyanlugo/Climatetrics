import PageNav from '../../components/PageNav';
import styles from './AcrossIndustries.module.css';
import AcrossIndustriesByCountry from './AcrossIndustriesByCountry';
import AcrossIndustriesByContinent from './AcrossIndustriesByContinent';

export default function AcrossIndustries() {
  return (
    <main className={styles.container}>
      <PageNav />

      <section className="grid-row-2 grid grid-flow-row gap-4">
        <div className="mx-2 my-5 rounded-lg bg-black p-4">
          <AcrossIndustriesByCountry />
        </div>
        <div className="mx-2 rounded-lg bg-red-500 p-4">
          <AcrossIndustriesByContinent />
        </div>
      </section>
    </main>
  );
}
