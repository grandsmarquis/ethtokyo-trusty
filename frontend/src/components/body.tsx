import styles from '../styles/body.module.css';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { config } from '../wagmi';
import addresses from '../addresses.json';
import abi from '../abi.json';
import { writeContract, readContract, readContracts, waitForTransactionReceipt } from '@wagmi/core';
import Moment from 'react-moment';

import UpvoteButton from './upvoteButton';
import DisputeButton from './disputeButton';
import SubmitModal from './submitModal';

const Body: React.FC = () => {
  const account = useAccount();
  const [showPopup, setShowPopup] = useState(false);
  const [isSendingTx, setIsSendingTx] = useState(false);

  const [feed, setFeed] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedCount, setFeedCount] = useState(0);

  function indexToId(index: number) {
    return index;
  }

  async function loadFeed() {
    let count = await readContract(
      config,
      {
        abi,
        address: addresses.Space,
        functionName: 'feedCounter',
      }
    );
    setFeedCount(parseInt(count));
    let multiquery = [];
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
      };
    });
    setFeed(f);
    console.log(results);
  }



 

  useEffect(() => {
    loadFeed();
  }, []);

  const handleUpvote = async (id: number) => {
    await upvote(id);
  };

  return (
    <main className={styles.main}>
      <SubmitModal onSuccess={loadFeed} />

      <div className={styles.questionBox}>
        <div className={styles.questions}>
          {feed.map((feedItem, i) => (
            <div key={i} className={styles.question}>
              <div>
                <h3>{feedItem.content}</h3>
                <div className={styles.questionMeta}>
                  Posted by {feedItem.owner} <Moment fromNow>{feedItem.createdAt * 1000}</Moment>
                </div>

                <span className={styles.voteCount}>{feedItem.voteCount}</span>
               
                <UpvoteButton id={indexToId(i)} item={feedItem} onSuccess={loadFeed} />
                <DisputeButton id={indexToId(i)} item={feedItem} onSuccess={loadFeed} />
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
