import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { v4 } from 'uuid'

type HomeProps = {
    formData: {
        roomId: string;
        username: string;
    },
    setFormData: React.Dispatch<React.SetStateAction<{
        roomId: string;
        username: string;
    }>>,
    ws: WebSocket | undefined,
    setWs: React.Dispatch<React.SetStateAction<WebSocket | undefined>>,
    userColor:string


}


export const Home: React.FC<HomeProps> = (props) => {

    const navigate = useNavigate()


    const handleChange = (e: any) => {
        props.setFormData({
            ...props.formData,
            [e.target.name]: e.target.value  // Dynamically update the correct field
        });
    }

    const createNewRoom = () => {
        const newRoomId = v4();  // Generates a unique room ID
        props.setFormData({ ...props.formData, roomId: newRoomId }); // Set the generated ID
        toast.success('new room created')
    }

    const joinRoom = () => {
        if (!props.formData.roomId || !props.formData.username) {
            toast.error('ROOM ID & USERNAME both are required')
            return;
        }

        navigate(`/play/${props.formData.roomId}/${props.formData.username}`)


    }

    const handleInputEnter = (e: any) => {
        if (e.code === "Enter") {
            joinRoom();
        }
    }

    return (

        <div className='homePageWrapper flex justify-center items-center h-screen bg-slate-950 text-white flex-col'>
            <div className='formWrapper flex flex-col w-96 justify-center space-y-3 p-4 bg-slate-900 rounded-sm shadow-green-950 shadow-2xl'>
                <img src="/code-sync.png" alt="code-sync-logo" className='h-20 w-40' />
                <h4 className='mainLable font-bold text-white'>Paste invitation Room ID</h4>
                <input
                    type="text"
                    name="roomId"
                    onChange={handleChange}
                    value={props.formData.roomId}
                    placeholder='ROOM ID'
                    onKeyUp={handleInputEnter}
                    className=' bg-white text-gray-700 p-1 pl-2 font-sans rounded-lg' />
                <input
                    type="text"
                    name="username"
                    onChange={handleChange}
                    value={props.formData.username}
                    onKeyUp={handleInputEnter}
                    placeholder='USERNAME'
                    className=' bg-white text-gray-600 p-1 pl-2 font-sans rounded-lg' />
                <button
                    onClick={joinRoom}
                    className='bg-green-600  p-2 py-1 w-20 rounded-md self-end' >Join</button>
                <p className='text-center' >If you don't have an invitethen create <span onClick={createNewRoom} className='text-green-600 underline cursor-pointer'>new room</span></p>
            </div>
            <footer className='fixed bottom-5'>
                <h4>Build with 💛 by <a href="https://github.com/PrasadGurude" className='text-green-600 cursor-pointer'>Prasad Gurude</a> </h4>
            </footer>
        </div>
    )
}

export default Home