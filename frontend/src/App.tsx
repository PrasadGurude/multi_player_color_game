import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import Play from './components/Play';


function App() {

      const [formData, setFormData] = useState({
          roomId: '',
          username: ''
      });
  
      const [ws, setWs] = useState<WebSocket | undefined>()
      const [userColor, setUserColor] = useState('')

  return (
    <div>
      <Toaster position='top-right' />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home formData={formData} setFormData={setFormData} ws={ws} setWs={setWs} userColor={userColor} />} ></Route>
          <Route path="/play/:roomId/:username" element={<Play ws={ws} formData={formData} userColor={userColor} setWs={setWs} setUserColor={setUserColor}/>} ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
