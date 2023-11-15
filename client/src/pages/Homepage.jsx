import { Link } from 'react-router-dom';
import PageNav from '../components/PageNav';
import styles from './Homepage.module.css';

export default function Homepage() {
  return (
    <div className="">
      <main className={styles.homepage}>
        <PageNav />

        <section>
          <h1>
            Climate affects us all.
            <br />
            Climatetrics helps you visualize it.
          </h1>
          <h2>
            We recognize that climate and weather play an integral role in all
            aspects of our lives, not just on an individual basis but on a
            global scale.
          </h2>

          <Link to="/visualization" className="cta hover:bg-blue-200">
            Start visualizing now
          </Link>
        </section>
      </main>
    </div>
  );
}
