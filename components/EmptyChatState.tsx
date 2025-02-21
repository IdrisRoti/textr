import {motion} from "motion/react";
import { PiTranslateLight } from "react-icons/pi";

export const functionsArr = ["Detect Text Language", "Translate Text", "Summerize Text"];

const EmptyChatState = () => {
  return (
    <div className='flex flex-col gap-6 items-center justify-center h-full'>
        <motion.h1
            initial={{
                y: 20,
                opacity: 0,
            }}
            animate={{
                y: 0,
                opacity: 1,
                transition: {delay: .6, duration: .6}
            }} 
            className="text-5xl flex items-center gap-2">
            <PiTranslateLight className="text-purple-600" />
            <span>Textr</span>
        </motion.h1>
        <div className="flex items-center gap-4">
            {
                functionsArr.map((func, i) => (
                    <motion.p 
                        initial={{
                            y: 20,
                            opacity: 0
                        }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            transition: {delay: .05 * i}
                        }}
                        key={func} 
                        className='px-3 py-1.5 text-sm border rounded-full'
                    >
                        {func}
                    </motion.p>
                ))
            }
        </div>
    </div>
  )
}

export default EmptyChatState;