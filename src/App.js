import './App.css';
import React from 'react'
import UserInterface from './components/UserInterface/UserInterface';
import { useSelector } from 'react-redux'
import AdminInterface from './components/AdminInterface/AdminInterface';

function App() {
  const adminMode = useSelector(state => state.adminMode);

  return (
    <div className='app-main'>
      {adminMode.active ? <AdminInterface /> : <UserInterface />}
    </div>
  );
}

export default App;
