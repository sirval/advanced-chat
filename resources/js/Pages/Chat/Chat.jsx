import React, { useState } from 'react';
import ChatSidebar from '@/Components/Chat/ChatSidebar';
import ChatBody from '@/Components/Chat/ChatBody';
import ChatUserInfoHeader from '@/Components/Chat/ChatUserInfoHeader';
import ChatInput from '@/Components/Chat/ChatInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatIntro from '@/Components/Chat/ChatIntro';

export default function Chat(prop) {

    const [myMessages, setMyMessages] = useState({
        messages: prop.messages || [],
      });
      
      const currentUserID = prop?.auth?.user?.id;
      
      Echo.private(`messenger`).listen('MessageSent', (e) => {
        const newMessage = JSON.parse(e.message);
        // Check if the message is sent by the current user
        const isSender = newMessage.sender_id === currentUserID;
        // Update the appropriate message list based on sender or receiver
        setMyMessages((prevState) => {
          const updatedMessages = [...prevState.messages];
          // Check for duplicates based on message ID and whether it's the sender
          const isDuplicate = updatedMessages.some(
            (msg) => msg.id === newMessage.id && (isSender || msg.sender_id !== currentUserID)
          );
      
          if (!isDuplicate) {
            updatedMessages.push(newMessage);
          }
      
          return {
            ...prevState,
            messages: updatedMessages,
          };
        });
      });
      
      console.log(prop);
      const messages = () => {
        if (myMessages?.messages?.length > 0) {
          return <ChatBody messages={myMessages?.messages} receiverId={prop?.receiverInfo?.id} />;
        } else {
          return (
            <div className="flex justify-center items-center bg-slate-100 h-screen">
                <div className="w-100 px-4">
                    <div className="overflow-y-auto">
                       <ChatIntro receiver={prop?.receiverInfo}/>
                    </div>
                </div>
            </div>
          );
        }
      };
    
    return (
        <AuthenticatedLayout
            user={prop?.auth?.user}
            // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Chat</h2>}
        >
             <div className="">
                <div className="py-12">
                    <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-2 text-gray-900">
                                <div className="messanger p-4">
                                    <div className="flex">
                                        <div className="w-50 border-r border-slate-100 bg-white pt-2">
                                            <ChatSidebar recentMessages={prop?.recentMessages} users={prop?.chatlist} />
                                        </div>

                                        <div className="w-1000">
                                            {prop.receiverInfo ? (
                                                <ChatUserInfoHeader receiverInfo={prop?.receiverInfo} />
                                            ) : (
                                                ''
                                            )}

                                            <div className="messanger mt-4">
                                                <div className="max-w-8xl px-4">
                                                    <div className="overflow-y-auto">
                                                        {messages()}
                                                    </div>
                                                </div>
                                            {prop.receiverInfo ? (
                                                <ChatInput receiverId={prop?.receiverInfo?.id} />
                                                ) : (
                                                ''
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                

            </div>
           
        </AuthenticatedLayout>
    );
}
