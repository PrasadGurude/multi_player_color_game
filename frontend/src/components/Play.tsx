import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';

type PlayProps = {
    ws: WebSocket | undefined,
    formData: {
        roomId: string,
        username: string
    },
    userColor: string,
    setWs: React.Dispatch<React.SetStateAction<WebSocket | undefined>>,
    setUserColor: React.Dispatch<React.SetStateAction<string>>

}

export const Play: React.FC<PlayProps> = (props) => {

    type Color = 'red' | 'blue' | 'green' | 'white';
    
    const [colors, setColors] = useState<Record<string, Color>>({
        box1: 'white',
        box2: 'white',
        box3: 'white',
        box4: 'white',
        box5: 'white',
        box6: 'white',
        box7: 'white',
        box8: 'white',
        box9: 'white',
        box10: 'white',
        box11: 'white',
        box12: 'white',
        box13: 'white',
        box14: 'white',
        box15: 'white',
        box16: 'white',
        box17: 'white',
        box18: 'white',
        box19: 'white',
        box20: 'white',
        box21: 'white',
        box22: 'white',
        box23: 'white',
        box24: 'white',
    })

    const colorClasses: Record<'red' | 'blue' | 'green' | 'white', string> = {
        red: 'bg-red-300',
        blue: 'bg-blue-300',
        green: 'bg-green-300',
        white: "bg-white"
    };

    useEffect(() => {
        if (!props.formData.username || !props.formData.roomId || props.ws) return;
        const newWs = new WebSocket('ws://localhost:8080');
        props.setWs(newWs);

        newWs.onopen = () => {
            setTimeout(() => {
                newWs.send(
                    JSON.stringify({
                        type: 'join',
                        payload: {
                            username: props.formData.username,
                            roomId: props.formData.roomId,
                        },
                    })
                );
            }, 500); // Small delay to ensure WebSocket is fully open
        };

        newWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'join') {
                console.log('User joined:', data.payload.username);
                toast.success(`${data.payload.username} joined the game`);                toast.success(`${data.payload.username} joined the game`)
                props.setUserColor(`${data.payload.color}`)

            } else if (data.type === "move") {
                setColors(prevColors => ({
                    ...prevColors,
                    [`box${data.payload.box}`]: data.payload.color as Color
                }));
            }
            console.log('Message from server:', data);
        };

        newWs.onclose = () => {
            console.log('WebSocket connection closed. Attempting to reconnect...');
            toast.error("Connection error.");
        
        };

        newWs.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            console.log("Closing WebSocket...");
            newWs.close();
        };

    }, [props.formData])

    const handleBoxClick = (index: number) => {
        if (props.ws) {
            props.ws.send(
                JSON.stringify({
                    type: 'move',
                    payload: {
                        box: index + 1,
                        roomId: props.formData.roomId,
                        username: props.formData.username,
                    },
                })
            );
        }
    };

    return (
        <div className='bg-slate-900 h-screen flex flex-col justify-center items-center'>
            <h1 className='font-bold text-white text-4xl mb-5'>Game</h1>
            <div className="grid grid-cols-6 grid-rows-4 gap-4">
                {[...Array(24)].map((_, index) => (
                    <div
                        key={index}
                        onClick={() => {handleBoxClick(index)}}
                        className={`w-20 h-16 flex justify-center items-center text-black font-bold ${colorClasses[colors[`box${1 + index}`] as Color]
                            }`}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Play