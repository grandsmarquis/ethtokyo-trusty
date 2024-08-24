import styles from '../styles/Home.module.css';
import { useAccount } from 'wagmi';
import { Modal } from 'react-responsive-modal';
import { useState } from 'react';
import 'react-responsive-modal/styles.css';



const Body: React.FC = () => {

    const [isSubmitModalOpen, setisSubmitModalOpen] = useState(false);
    const [submissionContent, setSubmissionContent] = useState('');

    return (
        <div>
            <button className={styles.askButton} onClick={() => setisSubmitModalOpen(true)}>Submit</button>
            <Modal open={isSubmitModalOpen} onClose={() => setisSubmitModalOpen(false)}>
                <div>
                    <h1>Submit</h1>
                    <textarea  placeholder='What did you achieve?' value={submissionContent} onChange={(e) => setSubmissionContent(e.target.value)}></textarea>
                    <button>Submit</button>
                </div>
            </Modal>
        </div> 
  );
};

export default Body;
