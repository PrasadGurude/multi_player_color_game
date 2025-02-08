import { useEffect, useState } from 'react'

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Play from './components/Play'

function App() {
  const [roomId, setroomId] = useState<string>("")
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('')
  const [userColor, setUserColor] = useState('red')
  const [ws, setWs] = useState<WebSocket | null>(null);
  useEffect(() => {
    // Initialize WebSocket connection when the component mounts
    const socket = new WebSocket('ws://localhost:8080'); // Change this to your WebSocket server URL

    // Define the WebSocket events
    socket.onopen = () => {

      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      setMessage(event.data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    setWs(socket);

    // Cleanup the WebSocket connection when the component unmounts
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home roomId={roomId} setroomId={setroomId} />} />
          <Route path="/play" element={<Play ws={ws} message = {message} userColor={userColor} rooId={roomId} username= {username} />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
