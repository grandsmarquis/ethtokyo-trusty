import styles from '../styles/footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerColumn}>
          <h3>Learn More</h3>
          <ul>
            <li><a href="#">Learn more</a></li>
            <li><a href="#">Github</a></li>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">White Paper</a></li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h3>Join Us</h3>
          <ul>
            <li><a href="#">Discord</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Medium</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
