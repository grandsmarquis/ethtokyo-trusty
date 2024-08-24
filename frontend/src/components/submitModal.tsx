import styles from '../styles/body.module.css';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { config } from '../wagmi';
import addresses from '../addresses.json';
import abi from '../abi.json';

const Body: React.FC = (props) => {
    const [isSendingTx, setIsSendingTx] = useState(false);
    const [inputText, setInputText] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setInputText('');
    };

    const handleSubmitItemToFeed = async () => {
        if (inputText.trim()) {
            try {
                const result = await writeContract(config, {
                    abi,
                    address: addresses.Space,
                    functionName: 'addFeed',
                    args: [inputText],
                });
                console.log(result);
                setIsSendingTx(true);
                const transactionReceipt = await waitForTransactionReceipt(config, {
                    hash: result,
                });
                setIsSendingTx(false);
                setInputText('');
                setShowPopup(false);
            } catch (error) {
                setIsSendingTx(false);
                console.error(error);
                alert(error.message);
            }
            props.onSuccess();
        }
    };

    return (
        <div>
            <button className={styles.askButton} onClick={handleSubmit}>Submit</button>
            {showPopup &&
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <button className={styles.closeButton} onClick={handleClosePopup}>✖</button>
                        <h2>What did you do?</h2>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className={styles.textInput}
                        />
                        {isSendingTx && <p>Sending transaction...</p>}
                        {!isSendingTx && <p><button onClick={handleSubmitItemToFeed} className={styles.sendButton}>Send</button></p>}
                    </div>
                </div>}
        </div>
    );
};

export default Body;
