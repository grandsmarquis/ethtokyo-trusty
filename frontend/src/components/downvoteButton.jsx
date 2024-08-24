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

    async function upvote(id) {
        console.log(id)
        try {
            let tx = await writeContract(config, {
                abi,
                address: addresses.Space,
                functionName: 'challengeFeed',
                args: [parseInt(props.id)],
            });
            setIsSendingTx(true);
            const transactionReceipt = await waitForTransactionReceipt(config, {
                hash: tx,
            })
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
            {isSendingTx && <button style={{ marginRight: '10px' }}>Sending</button>}
            {!isSendingTx &&  
                <button
                  className={styles.iconButton}
                >
               👎
                </button> }
        </span>
    );
};

export default Body;
