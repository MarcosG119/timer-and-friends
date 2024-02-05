import React, { useState } from 'react';
import Timer from './Timer';
import BulletinBoard from './BulletinBoard';   

const MyComponent: React.FC = () => {
    const [activeTimer, setActiveTimer] = useState<boolean>(false);
    
    
    const handleActivateTimer = () => {
        setActiveTimer(true);
    }


    return (
        <>





        
            {!activeTimer && 
            <>
                <button onClick={handleActivateTimer}>Press me to get started!</button>
            </>
            }



            {activeTimer && 
            <>
                <Timer />
                <BulletinBoard />
            </>
            }
        </>
    );
};

export default MyComponent;