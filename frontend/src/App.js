import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LumaApp from './pages/LumaApp';
import Home from './pages/Home'
import Hero from './pages/Hero';
import SignIn from './pages/SignIn';

const App = () => {
  return (
      <Router>
          <Routes>
          <Route path='/Home' element={<Home />} />
          <Route path='/diagram/:id' element={<LumaApp />} />
          <Route path='/SignIn' element={<SignIn />} />
          <Route path='/' element={<Hero />} />
          </Routes>
      </Router>
  )
}

export default App;