import styles from '../styles/body.module.css';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { config } from '../wagmi';
import addresses from '../addresses.json';
import abi from '../abi.json';
import { writeContract, readContract, readContracts, waitForTransactionReceipt } from '@wagmi/core';
import Moment from 'react-moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

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
      });
      setIsSendingTx(false);
      loadFeed();
    } catch (error) {
      setIsSendingTx(false);
      console.error(error);
      alert(error.message);
    }
  }

  async function loadFeed() {
    try {
      let count = await readContract(config, {
        abi,
        address: addresses.Space,
        functionName: 'feedCounter',
      });

      setFeedCount(count);
      let multiquery = [];
      for (let i = 0; i < count; i++) {
        multiquery.push({
          abi,
          address: addresses.Space,
          functionName: 'getFeed',
          args: [i],
        });
      }

      let results = await readContracts(config, {
        contracts: multiquery,
      });

      let f = results.map((result) => {
        return {
          content: result.result[0],
          owner: result.result[1],
          createdAt: parseInt(result.result[2]),
          voteCount: parseInt(result.result[3]),
          userPoints: parseInt(result.result[4]),
        };
      });

      console.log('Fetched feed data:', f); // ここで取得したデータを確認する

      setFeed(f); // 取得したデータで feed ステートを更新
    } catch (error) {
      console.error('Error loading feed:', error);
    }
  }


  const handleSubmit = () => {
    setShowPopup(true);
  };

  const handleSend = async () => {
    if (inputText.trim()) {
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
        });
        setIsSendingTx(false);
        setQuestions([inputText, ...questions]);
        setInputText('');
        setShowPopup(false);
      } catch (error) {
        setIsSendingTx(false);
        console.error(error);
        alert(error.message);
      }
      loadFeed();
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const handleUpvote = async (id: number) => {
    await upvote(id);
  };

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
            {!isSendingTx && <p><button onClick={handleSend} className={styles.sendButton}>Send</button></p>}
          </div>
        </div>
      )}

      <div className={styles.questionBox}>
        <div className={styles.questions}>
          {feed.map((feedItem, i) => (
            <div key={i} className={styles.question}>
              <div>
                <h3>{feedItem.content}</h3>
                <div className={styles.questionMeta}>
                  Posted by {feedItem.owner}
                </div>
              </div>
              <div className={styles.voteSection}>
                <button
                  className={styles.iconButton}
                  onClick={() => handleUpvote(i)}
                  style={{ marginBottom: "8px" }}
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                </button>
                <span className={styles.voteCount}
                  style={{ marginRight: "10px" }}>{feedItem.voteCount}</span>
                <button
                  className={styles.iconButton}
                >
                  <FontAwesomeIcon icon={faThumbsDown} />
                </button>
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
