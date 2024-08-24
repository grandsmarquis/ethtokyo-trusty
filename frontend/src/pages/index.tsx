import type { NextPage } from 'next';
import Header from '../components/header';
import Body from '../components/body';
import Footer from '../components/footer';
import styles from '../styles/home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Body />
      <Footer />
    </div>
  );
};

export default Home;
