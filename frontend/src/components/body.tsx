import styles from '../styles/body.module.css';
import { useAccount } from 'wagmi';
import { useState } from 'react';

const Body: React.FC = () => {
  const account = useAccount();
  const [showPopup, setShowPopup] = useState(false);
  const [inputText, setInputText] = useState('');
  const [questions, setQuestions] = useState([
    "Did the Snapshot proposal with the id",
    "Will Pepe have over a $1 Billion ",
    "Qué puntuación darías del 1 al 3 ?"
  ]);

  const handleSubmit = () => {
    setShowPopup(true);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      setQuestions([inputText, ...questions]);
      setInputText('');
      setShowPopup(false);
    }
  };

  return (
    <main className={styles.main}>
      <button className={styles.askButton} onClick={handleSubmit}>Submit</button>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>What did you do?</h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={styles.textInput}
            />
            <button onClick={handleSend} className={styles.sendButton}>Send</button>
          </div>
        </div>
      )}

      <div className={styles.questionBox}>
        <div className={styles.questions}>
          {questions.map((question, i) => (
            <div key={i} className={styles.question}>
              <h3>{question}</h3>
              <div className={styles.questionMeta}>
                Posted {i === 0 ? "Just now" : i < 5 ? "A moment ago" : "Some time ago"} · Reward: 0 ETH
              </div>
            </div>
          ))}
        </div>
        <div className={styles.loadMore}>
          <button>Load More</button>
        </div>
      </div>
    </main>
  );
};

export default Body;
