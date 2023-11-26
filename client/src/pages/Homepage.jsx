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
            A series of glimpses into our changing climate as it has unfolded
            for decades, offering a visualization of 🌎 transformation.
            <br />
            Explore how this phenomenon continues to shape our world.
          </h2>

          <Link to="/visualization" className="cta hover:bg-blue-200">
            Start visualizing now
          </Link>
        </section>
      </main>
    </div>
  );
}
