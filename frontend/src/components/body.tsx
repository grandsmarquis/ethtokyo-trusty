import styles from '../styles/body.module.css';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { config } from '../wagmi';
import addresses from '../addresses.json';
import abi from '../abi.json';
import { writeContract, readContract, readContracts, waitForTransactionReceipt } from '@wagmi/core'
import Moment from 'react-moment';

const Body: React.FC = () => {
  const account = useAccount();
  const [showPopup, setShowPopup] = useState(false);
  const [isSendingTx, setIsSendingTx] = useState(false);
  const [inputText, setInputText] = useState('');
  const [questions, setQuestions] = useState([
    "Did the Snapshot proposal with the id",
    "Will Pepe have over a $1 Billion ",
    "Qué puntuación darías del 1 al 3 ?"
  ]);

  const [feed, setFeed] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedCount, setFeedCount] = useState(0);

  async function upvote(id: number) {
    try {
      let tx = await writeContract(config, {
        abi,
        address: addresses.Space,
        functionName: 'upvote',
        args: [id],
      });
      setIsSendingTx(true);
      const transactionReceipt = await waitForTransactionReceipt(config, {
        hash: tx,
      })
      setIsSendingTx(false);
      loadFeed();
    } catch (error) {
      setIsSendingTx(false);
      alert(error.message);
    }
  }

  async function loadFeed() {
    let count = await readContract(
      config,
      {
        abi,
        address: addresses.Space,
        functionName: 'feedCounter',
      }
    )
    setFeedCount(count);
    let multiquery = []
    for (let i = 0; i < count; i++) {
      multiquery.push(
        {
          abi,
          address: addresses.Space,
          functionName: 'getFeed',
          args: [i],
        }
      );
    }
    console.log(multiquery);
    let results = await readContracts(config, {
      contracts: multiquery
    });

    let f = results.map((result) => {
      return {
        content: result.result[0],
        owner: result.result[1],
        createdAt: parseInt(result.result[2]),
        voteCount: parseInt(result.result[3]),
        userPoints: parseInt(result.result[4]),
      }
    });
    setFeed(f);
    console.log(results);
  }

  const handleSubmit = () => {
    setShowPopup(true);
  };

  const handleSend = async () => {
    if (inputText.trim()) {
      // 新しい質問をリストの先頭に追加
      try {
        const result = await writeContract(config, {
          abi,
          address: addresses.Space,
          functionName: 'addFeed',
          args: [
            inputText
          ],
        });
        console.log(result);
        setIsSendingTx(true);
        const transactionReceipt = await waitForTransactionReceipt(config, {
          hash: result,
        })
        setIsSendingTx(false);
        setQuestions([inputText, ...questions]);
        setInputText('');
        setShowPopup(false);
      } catch (error) {
        setIsSendingTx(false);
        console.log(error);
        alert(error.message);
      }
      loadFeed();
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <main className={styles.main}>
      <button className={styles.askButton} onClick={handleSubmit}>Submit</button>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>What did you do?</h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={styles.textInput}
            />
            {isSendingTx && <p>Sending transaction...</p>}
            {!isSendingTx && <p> <button onClick={handleSend} className={styles.sendButton}>Send</button></p>}
          </div>
        </div>
      )}

      <div className={styles.questionBox}>
        <div className={styles.questions}>
          {feed.map((feedItem, i) => (
            <div key={i} className={styles.question}>
              <h3>{feedItem.content}</h3>
              <div className={styles.questionMeta}>
                Posted <Moment fromNow>{feedItem.createdAt * 1000}</Moment> · Reward: 0 ETH
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
