import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LumaApp from './pages/LumaApp';
import Home from './pages/Home'
import Hero from './pages/Hero';

const App = () => {
  return (
      <Router>
          <Routes>
          <Route path='/Home' element={<Home />} />
          <Route path='/LumaApp' element={<LumaApp />} />
          <Route path='/' element={<Hero />} />
          </Routes>
      </Router>
  )
}

export default App;