import styles from '../styles/body.module.css';

import { useState, useEffect } from 'react';
import { config } from '../wagmi';
import addresses from '../addresses.json';
import abi from '../abi.json';
import { readContract } from '@wagmi/core';
import Moment from 'react-moment';
import { Tooltip } from 'react-tooltip'

import UpvoteButton from './upvoteButton';
import DownVoteButton from './downvoteButton';

const Body = (props) => {

    const formatAddress = (address) => {
        if (address.length > 8) {
            return `${address.slice(0, 6)}...${address.slice(-6)}`;
        }
        return address;
    };

    async function loadUserInfos(address) {
        const user = await readContract(config, {
            abi,
            address: addresses.Space,
            functionName: 'getUserInfos',
            args: [address],
        });
        console.log(user);
    }

    useEffect(() => {
        // loadUserInfos();
    }, []);


    return (
        <div className={styles.info}>
            <div className={styles.names}>
                <h3>{props.feedItem.content}</h3>
                <div className={styles.questionMeta}>
                    Posted by {formatAddress(props.feedItem.owner)}
                </div>
                <div className={styles.questionMeta}>
                    Posted at <Moment fromNow>{props.feedItem.createdAt * 1000}</Moment>
                </div>
            </div>
            <div className={styles.iconButtons}>
                <UpvoteButton id={props.feedItem.id} item={props.feedItem} onSuccess={props.loadFeed} />
                <a id="clickable"><span className={styles.voteCount}>{props.feedItem.score}</span></a><Tooltip anchorSelect="#clickable" clickable> <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Upvotes: {props.feedItem.upvotes}</span>
                    <span>Downvotes: {props.feedItem.downvotes}</span>
                </div></Tooltip>
                <DownVoteButton id={props.feedItem.id} item={props.feedItem} onSuccess={props.loadFeed} />
            </div>
        </div>
    );
};

export default Body;
