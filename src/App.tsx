import { useRef } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import VersionSwitcher from './components/VersionSwitcher';

function App()
{
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div id="app">
            <VersionSwitcher currentVersion="new" />
            <PhaserGame ref={phaserRef} />
        </div>
    )
}

export default App
