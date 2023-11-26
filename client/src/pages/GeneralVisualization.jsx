import PageNav from '../components/PageNav';
import styles from './GeneralVisualization.module.css';

export default function GeneralVisualization() {
  return (
    <main className={styles.login}>
      <PageNav />

      <section>
        <div className="mt-5 bg-black">Test 1</div>

        <div className="mt-5 bg-red-950">Test 2</div>
      </section>
    </main>
  );
}
