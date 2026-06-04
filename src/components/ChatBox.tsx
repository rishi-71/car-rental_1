"use client";

import React, { useState, useEffect, useRef} from "react";
import PusherClient from 'pusher-js';

let pusherClient : PusherClient | null = null;

if(typeof window !== 'undefined'){
    pusherClient = new PusherClient(
        process.env.NEXT_PUBLIC_PUSHER_KEY!,
        {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        }
    )
}


interface Message {
    _id: string;
    text: string;
    senderId: string;
    createdAt: string;
}

interface ChatBoxProps {
    currentUserId: string;
    receiverId: string;
    carId: string;
    conversationId?: string;
}

export default function ChatBox({ currentUserId, receiverId, carId, conversationId }: ChatBoxProps){
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
        console.log("ChatBox IDs check:", { currentUserId, receiverId, carId });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingHistory, setIsFetchingHistory] = useState(true);
    const [activeConversationId, setActiveConversationId] = useState(conversationId);


  const chatContainerRef = useRef<HTMLDivElement>(null);

const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

    useEffect(() => {
        scrollToBottom();

    },[messages]);

    useEffect(()=>{
        const fetchHistory = async () => {
            try {
                const res = await fetch(`/api/messages?receiverId=${receiverId}&carId=${carId}`,{ cache: 'no-store'});
                if(res.ok){
                    const data = await res.json();
                    setMessages(data.messages);
                    if(data.conversationId && !activeConversationId){
                        setActiveConversationId(data.conversationId);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch chat history: ", error);
            } finally {
                setIsFetchingHistory(false);
            }
        };
        fetchHistory();
    },[receiverId, carId]);

    useEffect(()=>{
        if(!activeConversationId || !pusherClient) return;

        const channelName = `chat-${activeConversationId}`;

        const channel = pusherClient.subscribe(channelName);

        channel.bind('new-message', (incomingMessage: any) =>{
            setMessages((prev) => {
                const messageExists = prev.some((msg) => msg._id === incomingMessage._id);
                //if(isDuplicate) return prevMessages;

                if(messageExists){
                  return prev;
                }
                return [...prev, incomingMessage];
            })
        });

        return () => {
            pusherClient.unsubscribe(channelName);

        };


    }, [activeConversationId]);

    const sendMessage = async (e: React.FormEvent)=>{
        e.preventDefault();
        if(!newMessage.trim()) return;

        setIsLoading(true);
        const textToSend = newMessage;
        setNewMessage("");

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    text: textToSend,
                    receiverId,
                    carId
                }),
            });
            const data = await res.json();

            if(res.ok){
                if(!activeConversationId && data.conversationId) {
                    setActiveConversationId(data.conversationId);
                }
                setMessages((prev) => [...prev, data]);
            }
        } catch (error) {
            console.error("Failed to send Message",error);
        }finally{
            setIsLoading(false);
        }

    };
    return (
    <div className="flex flex-col h-[400px] w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 font-bold flex justify-between items-center">
        <span>Chat with Host</span>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Online"></div>
      </div>

      {/* Messages Area */}
<div ref={chatContainerRef}className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {isFetchingHistory ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-slate-400 text-sm mt-10">Send a message to start the conversation!</p>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={`${msg._id}-${index}`} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-slate-200 text-slate-800 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}

      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
         className="flex-1 bg-slate-100 text-slate-900 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading || !newMessage.trim()}
          className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
}