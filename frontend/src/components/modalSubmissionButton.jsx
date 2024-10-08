import { Modal } from 'react-responsive-modal';
import { useState } from 'react';
import 'react-responsive-modal/styles.css';
import styles from '../styles/body.module.css';


const Body= () => {

    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [submissionContent, setSubmissionContent] = useState('');

    return (
        <div>
            <button className={styles.askButton} onClick={() => setIsSubmitModalOpen(true)}>Submit</button>
            <Modal open={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)}>
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
