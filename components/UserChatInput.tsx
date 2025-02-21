import { PiTranslateLight } from "react-icons/pi";

import {motion} from "motion/react";
import { languageSelect } from "@/constants";
import { getLanguage, translateText } from "@/lib/utils";
import { TChat } from "@/types";

type TUserChatInput = {
    chat: TChat;
    setChats: React.Dispatch<React.SetStateAction<TChat[]>>
}

const UserChatInput = ({chat, setChats}: TUserChatInput) => {

    const translate = async (lang: string, text: string, id: number, targetLang: string) => {
        try {
            const result = await translateText(lang, targetLang, text);
            setChats(prev => prev.map((chat) => chat.id === id ? {...chat, translatedText: result, error: ""} : chat))
        } catch (error) {
            console.log(error)
            setChats(prev => prev.map((chat) => chat.id === id ? {...chat, translatedText: "", error: "Something went wrong, please try again."} : chat))
        }
    }
    
    const summerize = (id: number) => {
        setChats(prev => prev.map((chat) => chat.id === id ? {...chat, error: "Oops! Sorry, summerization is not availaible at this time, try again next time."} : chat))
    }

  return (
    <div className="ml-auto w-[80%]">
    <motion.p 
        initial={{
            y: 20
        }}
        animate={{
            y: 0,
            transition: { ease: "easeInOut"}
        }}
        className='p-3 bg-slate-50 font-medium rounded-xl'
    >
            {chat.initText}
            <small className='block mt-3 font-thin'>Language detected: {getLanguage(chat.lang)}</small>
    </motion.p> 
    {chat.error && <small className='text-red-600'>{chat.error}</small>}
    <div className="flex items-center gap-3 mt-3"> 
        <select
            onChange={(e) => setChats((prev) => prev.map((ch) => ch.id === chat.id  ? {...ch, translationLang: e.target.value} : ch))}
            className='bg-transparent hover:bg-red-600/5 transition duration-500 outline-none border rounded-full px-4 py-1 text-sm flex items-center gap-2 ml-auto'>
            {
                languageSelect.map((lang) => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))
            }
        </select>   
        <button onClick={() => translate(chat.lang, chat.initText,chat.id, chat.translationLang)} className='bg-transparent hover:bg-red-600/5 transition duration-500 outline-none border rounded-full px-4 py-1 text-sm flex items-center gap-2'>
            <PiTranslateLight className='text-red-600' />
            <span>Translate</span>
        </button>  
        {
            chat.initText.length > 150 && (
                <button onClick={() => summerize(chat.id)} className='bg-transparent hover:bg-green-600/5 transition duration-500 outline-none border rounded-full px-4 py-1 text-sm flex items-center gap-2'>
                    <PiTranslateLight className='text-green-600' />
                    <span>Summerize</span>
                </button>
            )
        }        
    </div>            
</div>
  )
}

export default UserChatInput