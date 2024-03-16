import { useState } from 'react';
import { Appointments, List, Login } from './pages';
import { Calender, Search } from './components';
import { Routes, Route } from 'react-router-dom';

import './App.css'

function App() {

  return (
    <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/list" element={<List />} />
          <Route path="/calender" element={<Calender />} />
          <Route path="/search" element={<Search />} />
        </Routes>
    </>
  );
}

export default App
