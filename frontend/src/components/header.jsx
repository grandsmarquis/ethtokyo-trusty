import Head from 'next/head';
import '@rainbow-me/rainbowkit/styles.css';
import styles from '../styles/header.module.css';
import { config } from '../wagmi';
import abi from '../abi.json';
import addresses from '../addresses.json';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { readContract } from '@wagmi/core';


const Header = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { address, isConnected } = useAccount();
  const [userInfos, setUserInfos] = useState(null);
  const [name, setName] = useState("");

  const ranks =[
    "No membership",
    "Invited",
    "Not ranked",
    "Novice",
    "Intermediate",
    "Advanced",
    "Expert",
    "Master"
  ]
  async function loadUser() {
    console.log(address);
    let userInfos = await readContract(config, {
      abi: abi,
      address: addresses.Space,
      functionName: 'getUser',
      args: [address],
    });
    console.log(userInfos);
    setUserInfos({
      rank: ranks[parseInt(userInfos.rank)],
      points: parseInt(userInfos.points),
      voteCount: parseInt(userInfos.voteCount),
    });
  }

  async function getName() {
    let name = await readContract(config, {
      abi: abi,
      address: addresses.Space,
      functionName: 'name',
      args: [],
    });
    setName(name);
  }
  useEffect(async => {
    getName();
    if (address != null) {
      loadUser();
    }
  }, [address]);

  return (
    <div>
      <Head>
        <title>{name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.logo}>{name}</div>
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