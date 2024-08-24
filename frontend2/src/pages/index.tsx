import type { NextPage } from 'next';
import Header from '../components/header';
import Body from '../components/body';
import Footer from '../components/footer';

const Home: NextPage = () => {
  return (
    <div>
      <Header />

      <Body />

      <Footer />
    </div>
  );
};

export default Home;
