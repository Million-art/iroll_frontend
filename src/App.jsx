import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';  
import Home from './pages/user/Home';
import Admin from './pages/admin/Admin';

const App = () => {
  return (
    <Router> 
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
