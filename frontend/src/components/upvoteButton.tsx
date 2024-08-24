import styles from '../styles/body.module.css';
import { useState } from 'react';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { config } from '../wagmi';
import addresses from '../addresses.json';
import abi from '../abi.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const Body: React.FC<{ id: string, onSuccess: () => void }> = (props) => {
    const [isSendingTx, setIsSendingTx] = useState(false);

    async function upvote(id: number) {
        console.log(id);
        try {
            let tx = await writeContract(config, {
                abi,
                address: addresses.Space,
                functionName: 'upvote',
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
                <div className={styles.voteSection}>
                    <button
                        className={styles.iconButton}
                        onClick={() => upvote(Number(props.id))}
                    >
                        <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
                    </button>
                </div>
            )}
        </span>
    );
};

export default Body;
