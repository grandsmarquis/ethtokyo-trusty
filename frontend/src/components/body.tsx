import styles from '../styles/Home.module.css';
import { useAccount } from 'wagmi';

const Body: React.FC = () => {
  const account = useAccount();

  return (
    <main className={styles.main}>
      <button className={styles.askButton}>Submit</button>

      <div className={styles.questionBox}>
        {/* <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.activeTab}`}>Open</button>
          <button className={styles.tab}>Upcoming</button>
          <button className={styles.tab}>Resolved</button>
        </div> */}
        <div className={styles.questions}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.question}>
              <h3>
                {i < 3
                  ? `Did the Snapshot proposal with the id `
                  : i === 3
                  ? "Will Pepe have over a $1 Billion dollar market cap on 4/20/2024?"
                  : "Qué puntuación darías del 1 al 3 a la reunión de hoy?"}
              </h3>
              <div className={styles.questionMeta}>
                Posted {i === 0 ? "10 months" : "1 year"} ago · Reward: 0 ETH
              </div>
            </div>
          ))}
        </div>

        <div className={styles.loadMore}>
          <button>Load More</button>
        </div>
      </div>
    </main>
  );
};

export default Body;
