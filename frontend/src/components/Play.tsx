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

    type Color = 'red' | 'blue' | 'green';
    
    const [colors, setColors] = useState<Record<string, Color>>({
        box1: 'green',
        box2: 'red',
        box3: 'red',
        box4: 'red',
        box5: 'red',
        box6: 'red',
        box7: 'red',
        box8: 'red',
        box9: 'red',
        box10: 'red',
        box11: 'red',
        box12: 'red',
        box13: 'red',
        box14: 'red',
        box15: 'red',
        box16: 'red',
        box17: 'red',
        box18: 'red',
        box19: 'red',
        box20: 'red',
        box21: 'red',
        box22: 'red',
        box23: 'red',
        box24: 'red',
    })

    const colorClasses: Record<'red' | 'blue' | 'green', string> = {
        red: 'bg-red-300',
        blue: 'bg-blue-300',
        green: 'bg-green-300',
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