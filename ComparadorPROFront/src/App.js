import './App.css';
import Player from './components/player.search';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons'

library.add(fas, faTwitter, faFontAwesome)

function App() {
  return (
    <div className='d-block'>
      <h1 className='font-w'>Comparador PRO🔥🔥</h1>
      <div className='player-template'>
        <Player />
      </div>      
    </div>
  );
}

export default App;
