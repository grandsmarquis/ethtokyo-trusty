import Head from 'next/head';
import '@rainbow-me/rainbowkit/styles.css';
import styles from '../styles/header.module.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const Header = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (address != null) {
      console.log(address);
    }
  }, [address]);

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
                <div className={styles.popupContents}>
                  <p className={styles.popupText}>Repute Score : 30</p>
                  <p className={styles.popupText}>Rank : Novice</p>
                  <p className={styles.popupText}>Voting Power : 30</p>
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