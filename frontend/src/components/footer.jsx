import styles from '../styles/footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerColumn}>
          <h3>Learn More</h3>
          <ul>
            <li><a href="https://github.com/grandsmarquis/ethtokyo-trusty" target="blank">Github</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
