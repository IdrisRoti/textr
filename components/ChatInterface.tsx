"use client"

import React, { FormEvent, useEffect, useRef, useState } from 'react'

import { BsSend } from 'react-icons/bs';
import {motion} from "motion/react";

import { detectLang } from '@/lib/utils';
import { TChat } from '@/types';

import UserChatInput from './UserChatInput';
import UserChatOutput from './UserChatOutput';
import EmptyChatState from './EmptyChatState';

const ChatInterface = () => {
    const [inputText, setInputText] = useState("");
    const [chats, setChats] = useState<TChat[]>([]);

    const latestMessageRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if(latestMessageRef.current) {
            latestMessageRef.current.scrollIntoView({ behavior: "smooth"})
        }
    }, [chats])
    
        const handleTextForm = async (e: FormEvent) => {
            e.preventDefault();

            const lang:string = await detectLang(inputText);
            setChats(prev => [...prev, {id: prev.length+1, initText: inputText, lang, translationLang: "en"}]);

            setInputText("");
        }

  return (
    <div className='w-full px-4 max-w-3xl mx-auto h-screen relative py-5 space-y-5'>
        {
            chats.length ? (
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    className="flex flex-col gap-10 max-h-[65vh] overflow-y-auto px-4 scroll-bar-y">
                    {
                        chats.map((chat) => (
                            <div 
                                ref={chat.id === chats.length ? latestMessageRef : null}
                                className='relative flex flex-col gap-3 items-start' 
                                key={chat.id}
                            >
                                <UserChatInput chat={chat} setChats={setChats} /> 
                                <UserChatOutput chat={chat} />
                            </div>
                        ))
                    }
                </motion.div>
            ) : (
                <EmptyChatState />
            )
        }
        

        <motion.form 
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
                transition: {delay: .6, duration: .6}
            }} 
            onSubmit={(e) => handleTextForm(e)} className='w-full h-32 bg-slate-100 absolute left-1/2 -translate-x-1/2 bottom-10 rounded-2xl overflow-hidden scroll-bar-y'>
            <textarea placeholder='Type or paste something...' className='text-black w-full h-full bg-transparent rounded-2xl p-6 focus:outline-none focus:border focus:border-blue-600 focus:placeholder:opacity-0 transition placeholder:duration-500' value={inputText} onChange={(e) => setInputText(e.target.value)} />
            <button disabled={!inputText} className='bg-blue-500 text-white hover:bg-blue-700 transition size-10 grid place-items-center rounded-full absolute right-2 bottom-2 disabled:pointer-events-none disabled:opacity-50'><BsSend /></button>
        </motion.form>
    </div>
  )
}

export default ChatInterface;