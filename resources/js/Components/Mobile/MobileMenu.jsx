import React, { useState } from 'react';
import { Transition } from 'react-transition-group';
import ChatSidebar from '../Chat/ChatSidebar';

function MobileMenu(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sm:hidden">
      <button
        onClick={toggleMenu}
        className="block text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:outline-none"
      >
        ☰
      </button>

      <Transition in={isOpen} timeout={300} unmountOnExit>
        {(state) => (
          <div
            className={`absolute top-0 left-0 right-0 bg-white border-r border-slate-100 pt-2 pb-4 transition-opacity ${
              state === 'entered' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChatSidebar recentMessages={props.recentMessages} users={props.chatlist} />
          </div>
        )}
      </Transition>
    </div>
  );
}

export default MobileMenu;
