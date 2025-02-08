import React, { useEffect, useState } from 'react'

type PlayProps = {
    ws: WebSocket | null;
    message: string;
    userColor: string;
    roomId:string
    username:string
}

export const Play: React.FC<PlayProps> = (props) => {

    type Color = 'red' | 'blue' | 'green';

    const [userColor, setUserColor] = useState(props.userColor)

    const [color, setColor] = useState<Record<string, Color>>({
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


    return (
        <div className='bg-slate-900 h-screen flex flex-col justify-center items-center'>
            <h1 className='font-bold text-white text-4xl mb-5'>Game</h1>
            <div className="grid grid-cols-6 grid-rows-4 gap-4">
                {[...Array(24)].map((_, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            if (props.ws) {
                                props.ws.send(
                                    JSON.stringify({
                                        type: 'move',
                                        payload: {
                                            box: 1 + index,
                                            roomId:props.roomId,
                                            username:props.username
                                        }
                                    })
                                );
                            }
                        }}
                        className={`w-20 h-16 flex justify-center items-center text-black font-bold ${colorClasses[color[`box${1 + index}`]]
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