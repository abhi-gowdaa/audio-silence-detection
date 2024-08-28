import React from 'react';
import AudioUpload from './components/AudioUpload';

function App() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <h1 style={{color:'#fff'}}>Silence Detection</h1>
        <AudioUpload/>
    </div>
    
    );
}

export default App;
