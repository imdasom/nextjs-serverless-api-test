import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import {useState} from "react";

const Home: NextPage = () => {
    const [domain, setDomain] = useState('');
    const [key, setKey] = useState('');
    const [token, setToken] = useState('');
  return (
    <div className={styles.container}>
        domain <input type={'string'} value={domain} onChange={(e) => setDomain(e.target.value)}/>
        <br/>
        key <input type={'string'} value={key} onChange={(e) => setKey(e.target.value)}/>
     <button onClick={() => {
        fetch(`${domain}/api/auth-token?key=${key}`);
     }}>
       인증번호발급
     </button>
        <div>
            token <input type={'string'} value={token} onChange={(e) => setToken(e.target.value)}/>
        <button onClick={() => {
            fetch(`${domain}/api/auth-token?key=${key}&token=${token}`, {
                method: 'POST'
            });
        }}>
            인증번호검증
        </button>
        </div>
    </div>
  )
}

export default Home
