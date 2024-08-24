import styles from '../styles/body.module.css';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { config } from '../wagmi';
import addresses from '../addresses.json';
import abi from '../abi.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const Body = (props) => {

    const [isSendingTx, setIsSendingTx] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false); // Tooltip用の状態

    async function downvote(id) {
        if (props.alreadyVoted) {
            return;
        }
        console.log(id);
        try {
            let tx = await writeContract(config, {
                abi,
                address: addresses.Space,
                functionName: 'downvote',
                args: [parseInt(props.id)],
            });
            setIsSendingTx(true);
            const transactionReceipt = await waitForTransactionReceipt(config, {
                hash: tx,
            });
            props.onSuccess();
        } catch (error) {
            setIsSendingTx(false);
            console.error(error);
            alert(error.message);
        }
        setIsSendingTx(false);
    }

    return (
        <span>
            {isSendingTx ? (
                <div className={styles.loader}></div>
            ) : (
                <div
                    className={styles.voteSection}
                    onMouseEnter={() => props.alreadyVoted && setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <button
                        className={`${styles.iconButton} ${props.alreadyVoted ? styles.disabledButton : ''}`}
                        onClick={() => downvote(Number(props.id))}
                        disabled={props.alreadyVoted}
                    >
                        <FontAwesomeIcon icon={faThumbsDown}></FontAwesomeIcon>
                    </button>
                    {showTooltip && props.alreadyVoted && (
                        <div className={styles.tooltipText}>You have already voted</div>
                    )}
                </div>
            )}
        </span>
    );
};

export default Body;