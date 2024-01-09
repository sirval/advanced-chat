import { Link } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import InviteFriends from "./InviteFriends";

export default function ChatSidebar({recentMessages, users}) {
    const [toggleSidebar, setToggleSidebar] = useState("recent");
    const [activeButton, setActiveButton] = useState("");

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    console.log(toggleSidebar);
    const showSideBar = () => {
        if (toggleSidebar === "recent") {
            return recentUsersList();
        }
        if(toggleSidebar === "all users"){
            return usersList();
        }

        if(toggleSidebar === "invite friends"){
            return inviteFriends();
        }
    }

    const myFriends = () => {
        console.log('friends');
        setToggleSidebar("all users");
        setActiveButton('text-violet-300');
        return showSideBar();
    }

    const recentChatList = () => {
       console.log('chats');
       setToggleSidebar("recent");
       setActiveButton('text-violet-300');
       return showSideBar(); 
    }

    const invite = () => {
        console.log('invite');
        setToggleSidebar("invite friends");
        setActiveButton('text-violet-300');
        return showSideBar();
    }

    useEffect(() => {
        function handleClickOutside(event) {
          if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
          ) {
            setDropdownVisible(false);
          }
        }
    
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
          window.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

      const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
      };
    
      // Handle dropdown option clicks
      const handleOption1 = () => {
        // Handle option 1 click
      };
    
      const handleOption2 = () => {
        // Handle option 2 click
      };

    // console.log(users);
    const recentUsersList = () => {
        if (recentMessages?.length > 0) {
            return (
                <div className="user-list h-screen overflow-y-auto">
                    {
                        recentMessages.map((user, index) => (
                            <div key={index}>
                                <Link href={route('chat.index', user?.user_id)}>
                                    <div className="flex px-5 py-3 transition hover:cursor-pointer hover:bg-slate-100">
                                        <div className="pr-4">
                                            {user?.avatar !== undefined ? (
                                                <img src={user?.avatar} width="50" alt="User Avatar" />
                                            ) : (
                                                <i className="fa fa-user-circle text-gray-300 text-5xl"></i>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-md text-violet-500">
                                                {user?.name?.length > 0 ? user?.name : ''}
                                            </h3>
                                            <p className="h-5 overflow-hidden text-sm font-light text-gray-400">
                                                {user?.message.length > 2 ? user?.message.substring(0, 55) + '...' : user?.message}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    }
                    
                </div>
            );
        } 
       
    };

    const usersList = () => {
        if (users?.length > 0) {
            return (
                users.map((user, index) => (
                    <div key={index}>
                        <Link href={route('chat.index', user?.user_id)}>
                            <div className="flex px-5 py-3 transition hover:cursor-pointer hover:bg-slate-100">
                                <div className="pr-4">
                                    {user?.avatar !== undefined ? (
                                        <img src={user?.avatar} width="50" alt="User Avatar" />
                                    ) : (
                                        <i className="fa fa-user-circle text-gray-300 text-5xl"></i>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-md text-violet-500">
                                        {user?.name?.length > 0 ? user?.name : ''}
                                    </h3>
                                    <p className="h-5 overflow-hidden text-sm font-light text-gray-400">Start chatting...</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))
                
            )
        }
    }

    const showMoreDetail = () => {
        return (
            <>
                <div className="relative inline-block text-left">
                    <button
                        onClick={toggleDropdown}
                        className={`fa fa-ellipsis-v ml-3 ${
                        toggleSidebar === "invite friends"
                            ? "text-violet-300"
                            : "text-gray-200"
                        } h-full py-1 mb-1`}
                    ></button>
                    <div
                        id="dropdown"
                        className={`${
                        dropdownVisible ? "" : "hidden"
                        } origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
                    >
                        {/* Dropdown content goes here */}
                        <div className="py-1">
                        <button
                            onClick={handleOption1}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                            Option 1
                        </button>
                        <button
                            onClick={handleOption2}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                            Option 2
                        </button>
                        {/* Add more options as needed */}
                        </div>
                    </div>
                </div>

            </>
        )
    }

    const inviteFriends = () => {
        return (
        <>
            <InviteFriends status={true}/>
        </>)
    }

    return (
        <>
            <div className="search-box h-10 text-slate-300 mb-5">
                <div className="flex justify-between border-b border-slate-100 px-5 pb-4">
              
                    {
                        // receiverInfo?.avatar !== undefined ?
                            // <img src={receiverInfo.avatar} width="40" />
                            // :
                            <i className="fa fa-user-circle text-gray-300 text-5xl pr-2"></i>
                    }
                  
                    <div className="flex items-center">
                        <form className="flex items-center">
                            <i className="fa fa-search flex-shrink-0"></i>
                            <input type="search" className="font-light border-0 hover:border-0 focus:border-0 focus:ring-0 !shadow-none focus:!outline-none h-full py-1" placeholder="Search" />
                        </form>
                    </div>
                    <div className="flex items-center">
                        <button className={`fa fa-message ${toggleSidebar === "recent" ? activeButton : 'text-gray-200'} pr-3 h-full py-1 mb-1`} onClick={recentChatList}></button>
                        <button className={`fa fa-users ${toggleSidebar === "all users" ? activeButton : 'text-gray-200'} h-full py-1 mb-1`} onClick={myFriends}></button>
                        <button className={`fa fa-plus ml-3 ${toggleSidebar === "invite friends" ? activeButton : 'text-gray-200'} h-full py-1 mb-1`} onClick={invite}></button>
                        <button className={`fa fa-ellipsis-v ml-3 ${toggleSidebar === "more" ? activeButton : 'text-gray-200'} h-full py-1 mb-1`}></button>
                    </div>
                </div>
            </div>


            
            <div className="user-list h-screen overflow-y-auto">
                {
                    showSideBar()
                }
            </div>
        </>
    );
}
