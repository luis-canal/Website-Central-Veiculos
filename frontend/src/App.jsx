import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Estoque from './Estoque';
import Carro from './Carro';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/carro/:id" element={<Carro />} />
      </Routes>
    </Router>
  );
}

export default App;
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
