// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// src/components/PlayerRegister.jsx
import React, { useState } from 'react';
import { ref, set, get, child } from 'firebase/database';
import { db } from '../firebase';

const PlayerRegister = ({ onRegister }) => {
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    const num = number.trim();
    if (!num || isNaN(num) || +num < 1 || +num > 60) {
      setError('Введите номер от 1 до 60');
      return;
    }

    const snapshot = await get(child(ref(db), `players/${num}`));
    if (snapshot.exists()) {
      setError('Этот номер уже занят');
      return;
    }

    await set(ref(db, `players/${num}`), {
      alive: true,
      taskProgress: 0,
      lastVoteTime: 0
    });

    onRegister(num);
  };

  return (
    <div className="p-4 max-w-sm mx-auto text-center">
      <h2 className="text-xl font-bold mb-2">Введите свой номер игрока</h2>
      <input
        type="text"
        className="p-2 border rounded w-full mb-2 text-black"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        onClick={handleRegister}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Зарегистрироваться
      </button>
    </div>
  );
};

export default PlayerRegister;

// src/App.jsx
import React, { useState } from 'react';
import PlayerRegister from './components/PlayerRegister';

const App = () => {
  const [playerNumber, setPlayerNumber] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      {!playerNumber ? (
        <PlayerRegister onRegister={setPlayerNumber} />
      ) : (
        <div className="text-center">
          <h1 className="text-2xl mb-4">Добро пожаловать, Игрок {playerNumber}</h1>
          {/* Здесь позже будет HUD, задачи и голосование */}
        </div>
      )}
    </div>
  );
};

export default App;
