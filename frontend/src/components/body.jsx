import styles from '../styles/body.module.css';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { config } from '../wagmi';
import addresses from '../addresses.json';
import abi from '../abi.json';
import { writeContract, readContract, readContracts, waitForTransactionReceipt } from '@wagmi/core';
import Moment from 'react-moment';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'



import UpvoteButton from './upvoteButton';
import DownVoteButton from './downvoteButton';
import SubmitModal from './submitModal';

const Body = () => {
  const account = useAccount();
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

  const formatAddress = (address) => {
    if (address.length > 8) {
      return `${address.slice(0, 6)}...${address.slice(-6)}`;
    }
    return address;
  };


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
              <div className={styles.info}>
                <div className={styles.names}>
                  <h3>{feedItem.content}</h3>
                  <div className={styles.questionMeta}>
                    Posted by {formatAddress(feedItem.owner)}
                  </div>
                  <div className={styles.questionMeta}>
                    Posted at <Moment fromNow>{feedItem.createdAt * 1000}</Moment>
                  </div>
                </div>
                <div className={styles.iconButtons}>
                  <UpvoteButton id={feedItem.id} item={feedItem} onSuccess={loadFeed} />
                  <a id="clickable"><span className={styles.voteCount}>{feedItem.score}</span></a><Tooltip anchorSelect="#clickable" clickable> <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Upvotes: {feedItem.upvotes}</span>
                    <span>Downvotes: {feedItem.downvotes}</span>
                  </div></Tooltip>
                  <DownVoteButton id={feedItem.id} item={feedItem} onSuccess={loadFeed} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div >
    </main >
  );
};

export default Body;
