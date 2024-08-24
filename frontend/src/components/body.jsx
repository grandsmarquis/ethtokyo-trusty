import styles from '../styles/body.module.css';
import { useState, useEffect } from 'react';
import { config } from '../wagmi';
import addresses from '../addresses.json';
import abi from '../abi.json';
import { writeContract, readContract, readContracts, waitForTransactionReceipt } from '@wagmi/core';
import 'react-tooltip/dist/react-tooltip.css'




import SubmitModal from './submitModal';
import FeedItem from './feedItem';

const Body = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isSendingTx, setIsSendingTx] = useState(false);

  const [feed, setFeed] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedCount, setFeedCount] = useState(0);

  function indexToId(index) {
    return index;
  }

  async function loadFeed() {
    let count = await readContract(config, {
      abi,
      address: addresses.Space,
      functionName: 'getFeedCount',
    });
    setFeedCount(parseInt(count));
    let multiquery = [];
    for (let i = 0; i < count; i++) {
      multiquery.push({
        abi,
        address: addresses.Space,
        functionName: 'getFeed',
        args: [i],
      });
    }
    console.log(multiquery);
    let results = await readContracts(config, {
      contracts: multiquery
    });
    console.log(results);
    let i = 0;
    let f = results.map((result) => {
      return {
        content: result.result.content,
        owner: result.result.owner,
        upvotes: parseInt(result.result.upvotes),
        downvotes: parseInt(result.result.downvotes),
        createdAt: parseInt(result.result.createdAt),
        score: parseInt(result.result.upvotes) - parseInt(result.result.downvotes),
        id: i++,
      };
    });
    setFeed(f);
  }


  useEffect(() => {
    loadFeed();
  }, []);

  const handleUpvote = async (id) => {
    await upvote(id);
  };

  return (
    <main className={styles.main}>
      <SubmitModal onSuccess={loadFeed} />
      <div className={styles.questionBox}>
        <div className={styles.questions}>
          {feed.slice().reverse().map((feedItem) => (
            <div key={feedItem.id} className={styles.question}>
              <FeedItem feedItem={feedItem} loadFeed={loadFeed} />
            </div>
          ))}
        </div>
      </div >
    </main >
  );
};

export default Body;
