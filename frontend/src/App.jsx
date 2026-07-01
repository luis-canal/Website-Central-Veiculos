import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './Home';
import Estoque from './Estoque';
import Carro from './Carro';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/carro/:id" element={<Carro />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
