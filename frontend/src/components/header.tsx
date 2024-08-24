import Head from 'next/head';
import styles from '../styles/header.module.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const Header: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { address, isConnected } = useAccount();

  return (
    <div>
      <Head>
        <title>ETH Tokyo 24</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.logo}>ETH Tokyo 24</div>
          <div
            className={styles.logInWrapper}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <ConnectButton />
            {isConnected && isHovered && (
              <div className={styles.popup}>
                <p>Name: Ryota Kyoya</p>
                <p>Reputation Score: </p>
                <div className={styles.meterContainer}>
                  <div className={styles.meterFill} style={{ width: '50% ' }}></div>
                  <div className={styles.meterDivisions}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;