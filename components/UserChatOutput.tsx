import { TChat } from '@/types';
import {motion} from "motion/react";

const UserChatOutput = ({chat}: {chat: TChat}) => {
  return (
    chat.translatedText &&
        <p className='p-3 bg-slate-200/80 font-medium rounded-xl w-[80%]'>
            <small className='block mb-3 font-thin'>Translated text</small>
                {chat.translatedText.split("").map((char, i) => (
                    <motion.span 
                        initial={{
                            opacity: 0
                        }}
                        animate={{
                            opacity: 1,
                            transition: {delay: .02*i}
                        }}
                        key={i}
                    >
                        {char}
                    </motion.span>
                ))}
        </p>
  )
}

export default UserChatOutput