import React from 'react'
import { Outlet } from 'react-router-dom';
const Educator = () => {
  return (
    <div>
        <h1>Educator page</h1>
        <div>
            {<Outlet/>} 
            {/* Outlet: hiện router con */}
        </div>
    </div>
  )
}

export default Educator;