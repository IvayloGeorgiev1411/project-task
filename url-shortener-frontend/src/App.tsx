import { Routes, Route } from 'react-router-dom';

import { HomePage } from './pages/Homepage/HomePage';
import Header from './components/Header/Header';
import Stats from './pages/Stats/Stats';
import Container from './components/Container';

function App() {
  return (
    <Container>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/stats/:secretCode' element={<Stats />} />
      </Routes>
    </Container>
  );
}
export default App;
