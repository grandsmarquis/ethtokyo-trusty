import styles from '../styles/body.module.css';

import { useState, useEffect } from 'react';
import { config } from '../wagmi';

import addresses from '../addresses.json';
import abi from '../abi.json';
import { readContract } from '@wagmi/core';
import Moment from 'react-moment';
import { Tooltip } from 'react-tooltip'
import { useAccount } from 'wagmi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faMinus } from '@fortawesome/free-solid-svg-icons';

import UpvoteButton from './upvoteButton';
import DownVoteButton from './downvoteButton';

const Body = (props) => {

    const { address, isConnected } = useAccount();
    const [didUserVote, setDidUserVote] = useState(false);
    const [userRank, setUserRank] = useState("");

    const ranks = [
        "No membership",
        "Invited",
        "Not ranked",
        "Novice",
        "Intermediate",
        "Advanced",
        "Expert",
        "Master"
    ]

    const displayName = (ad, username) => {
        if (username) {
            return username;
        }
        return formatAddress(ad);
    }

    const formatAddress = (ad) => {
        if (ad.length > 8) {
            return `${ad.slice(0, 6)}...${ad.slice(-6)}`;
        }
        return ad;
    };

    async function getUserInfos() {
        if (address == null) {
            setUserRank(ranks[0]);
            return;
        }
        
        const userInfos = await readContract(config, {
            abi,
            address: addresses.Space,
            functionName: 'getUser',
            args: [address],
        });
        setUserRank(ranks[parseInt(userInfos.rank)]);
    }

    async function checkIfUserVoted(address) {
        if (address == null)
            return;
        const didUserVote = await readContract(config, {
            abi,
            address: addresses.Space,
            functionName: 'didUserVote',
            args: [address, props.feedItem.id],
        });
        console.log(didUserVote);
        setDidUserVote(didUserVote);
    }

    useEffect(() => {
        getUserInfos();
        checkIfUserVoted(address);
    }, [address]);


    return (
        <div className={styles.info}>
            <div className={styles.names}>
                <h3>{props.feedItem.content}</h3>
                <div className={styles.questionMeta}>
                    Posted by <b>{userRank}</b> {displayName(props.feedItem.owner, props.feedItem.username)}
                </div>
                <div className={styles.questionMeta}>
                    Posted at <Moment fromNow>{props.feedItem.createdAt * 1000}</Moment>
                </div>
            </div>
            <div className={styles.iconButtons}>
                <UpvoteButton
                    alreadyVoted={didUserVote || address === props.feedItem.owner}
                    id={props.feedItem.id}
                    item={props.feedItem}
                    onSuccess={props.loadFeed}
                />
                <a id={`clickable-upvote-${props.feedItem.id}`}>
                    <span className={styles.voteCount}>{props.feedItem.upvotes}</span>
                </a>
                <DownVoteButton
                    alreadyVoted={didUserVote || address === props.feedItem.owner}
                    id={props.feedItem.id}
                    item={props.feedItem}
                    onSuccess={props.loadFeed}
                />
                <a id={`clickable-downvote-${props.feedItem.id}`}>
                    <span className={styles.voteCount}>{props.feedItem.downvotes > 0 ? "-" : ""}{props.feedItem.downvotes}</span>
                </a>
                <FontAwesomeIcon
                    icon={props.feedItem.score > 0 ? faCheck : props.feedItem.score < 0 ? faXmark : faMinus}
                    style={{ fontSize: '25px', margin: '0px 20px', color: props.feedItem.score > 0 ? 'green' : props.feedItem.score < 0 ? 'red' : 'grey' }}
                />
            </div>
        </div>
    );

};

export default Body;
