import React, { Dispatch, SetStateAction, use, useEffect, useState } from 'react'

interface HomeProps {
    roomId: string;
    setroomId: Dispatch<SetStateAction<string>>
}

export const Home: React.FC<HomeProps> = () => {
    useEffect(() => {

    }, [])
    return (
        <div>
            Home
        </div>
    )
}

export default Home