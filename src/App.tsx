import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Train } from './pages/Train';
import { Phrases } from './pages/Phrases';
import { Config } from './pages/Config';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/train" element={<Train />} />
          <Route path="/phrases" element={<Phrases />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

