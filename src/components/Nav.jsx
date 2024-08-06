import React, { useState } from 'react';

const RemotEmployeesNav = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
     window.location.href = '/login';
  };
  return (
    <nav className="bg-gray-800 p-4 h-[80px] flex flex-center">

      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold lg:text-[20px]"><a href='/' className='text-1xl'><b className='text-3xl text-yellow-500'>i</b>ROLL</a></div>
         
         <ul className={`lg:flex space-x-4 ${isMenuOpen ? 'hidden lg:flex' : 'hidden'}`}>
         <li  className="text-red-600 bg-white border rounded-lg block py-1 px-4 hover:bg-slate-100 cursor-pointer" onClick={handleLogout}>
            logout 
          </li>
         </ul>
        
         <ul className={`lg:hidden mt-32 ${isMenuOpen ? 'block bg-gray-800' : 'hidden'}`}>
          
          <li>
            
           </li>
          <li className="text-red-600 bg-white border block py-2 px-4 hover:bg-gray-600 cursor-pointer" onClick={handleLogout}>
             logout 
          </li>
         </ul>
      </div>
        {/* Hamburger Menu Icon */}
        <div className="lg:hidden z-100 ">
          <button onClick={handleToggleMenu} className="text-white focus:outline-none ">
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            )}
          </button>
        </div>
    </nav>
  );
}

export default RemotEmployeesNav;
