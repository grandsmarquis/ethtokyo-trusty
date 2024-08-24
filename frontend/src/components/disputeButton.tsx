import styles from '../styles/Home.module.css';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { config } from '../wagmi';
import addresses from '../addresses.json';
import abi from '../abi.json';


const Body: React.FC = (props) => {

    const [isSendingTx, setIsSendingTx] = useState(false);

    async function upvote(id: number) {
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
        <div>
            {isSendingTx && <button style={{ marginRight: '10px' }}>Sending</button>}
            {!isSendingTx && <button style={{ marginRight: '10px' }} onClick={() => upvote(props.id)}>Dispute</button> }
        </div>
    );
};

export default Body;
