"use client"

import React, { FormEvent, useEffect, useRef, useState } from 'react'

import { BsSend } from 'react-icons/bs';

import { detectLang } from '@/lib/utils';
import { TChat } from '@/types';
import UserChatInput from './UserChatInput';
import UserChatOutput from './UserChatOutput';

const TextInterface = () => {
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
            setChats(prev => [...prev, {id: prev.length+1, initText: inputText, lang, translationLang: lang}])
        }

  return (
    <div className='w-full px-4 max-w-2xl mx-auto h-screen relative py-5 space-y-5'>
        <div className="flex flex-col gap-10 max-h-[65vh] overflow-y-auto px-4">
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
        </div>

        <form onSubmit={(e) => handleTextForm(e)} className='w-full h-32 bg-slate-100 absolute left-1/2 -translate-x-1/2 bottom-10 rounded-2xl overflow-hidden'>
            <textarea placeholder='Type or paste something...' className='text-black w-full h-full bg-transparent rounded-2xl p-6' onChange={(e) => setInputText(e.target.value)} />
            <button disabled={!inputText} className='bg-blue-500 text-white hover:bg-blue-700 transition size-10 grid place-items-center rounded-full absolute right-2 bottom-2 disabled:pointer-events-none disabled:opacity-50'><BsSend /></button>
        </form>
    </div>
  )
}

export default TextInterface;