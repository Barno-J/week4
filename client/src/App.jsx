import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlogPage from './pages/Blog.jsx';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlogPage />} />
      </Routes>
    </Router>
  );
}

export default App
