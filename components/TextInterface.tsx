"use client"

import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { BsSend } from 'react-icons/bs';
import { PiTranslateLight } from "react-icons/pi";

import {motion} from "motion/react"

const languageSelect = [
    {
        label: "English",
        value: "en"
    },
    {
        label: "Portuguese",
        value: "pt"
    },
    {
        label: "Spanish",
        value: "es"
    },
    {
        label: "Russian",
        value: "ru"
    },
    {
        label: "Turkish",
        value: "tr"
    },
    {
        label: "French",
        value: "fr"
    },
]

const detectLang = async (LangToDetect: string) => {
    // @ts-expect-error type of self.ai is unknown
    const languageDetectorCapabilities = await self.ai.languageDetector.capabilities();
    const canDetect = languageDetectorCapabilities.languageAvailable('en');
    console.log("canDetect", canDetect);

    let detector;
    if (canDetect === 'no') {
    // The language detector isn't usable.
    return;
    }
    if (canDetect === 'readily') {
    // @ts-expect-error type of self.ai is unknown
    detector = await self.ai.languageDetector.create();
    } else {
    // @ts-expect-error type of self.translation is unknown
    detector = await self.ai.languageDetector.create({
        // @ts-expect-error type of m is unknown
        monitor(m) {
            // @ts-expect-error type of e is unknown
        m.addEventListener('downloadprogress', (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
        });
            },
        });
    }
    const result= await detector.detect(LangToDetect);
    const {detectedLanguage} = result[0]
    console.log(detectedLanguage)
    return detectedLanguage;
}

const translateText = async (sourceLang: string, targetLang: string, LangToTranslate: string) => {
    // @ts-expect-error type of self.ai is unknown
    const translatorCapabilities = await self.ai.translator.capabilities();
    const canTranslate = translatorCapabilities.languagePairAvailable(sourceLang, targetLang);
    console.log("canTranslate", canTranslate);

    let translator;

    if (canTranslate === "no"){
        // The language translator isn't usable.
        console.log("Sorry your text cannot be translated")
        return;
    }

    if (canTranslate === "readily"){
        console.log("Translating...")
        // @ts-expect-error type of self.ai is unknown
        translator = await self.ai.translator.create({
            sourceLanguage: sourceLang,
            targetLanguage: targetLang,
          });
    } else {
        console.log("Have to download")
        // @ts-expect-error type of self.ai is unknown
        translator = await self.ai.translator.create({
            sourceLanguage: sourceLang,
            targetLanguage: targetLang,
            // @ts-expect-error type of m is unknown
            monitor(m) {
                // @ts-expect-error type of e is unknown
              m.addEventListener('downloadprogress', (e) => {
                console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
              });
            },
          }); 
          console.log("translator", translator);
    }

    const result= await translator.translate(LangToTranslate);
    return result;
}

const summerizeText = async () => {
    // @ts-expect-error type of self.ai is unknown
    // if ('ai' in self && 'summarizer' in self.ai) {
    //     console.log("canSummerize?")
    //   }

    const summerizerCapabilities = await ai.summarizer.capabilities();
    console.log("summerizerCapabilities", summerizerCapabilities)

    // // @ts-expect-error type of ai is unknown
    // const summarizer = await ai.summarizer.create({
    //     // @ts-expect-error type of m is unknown
    //     monitor(m) {
    //     // @ts-expect-error type of e is unknown
    //       m.addEventListener('downloadprogress', (e) => {
    //         console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
    //       });
    //     }
    //   });
    
    const options = {
        sharedContext: 'This is a scientific article',
        type: 'key-points',
        format: 'markdown',
        length: 'medium',
      };
    
      // @ts-expect-error type of ai is unknown
      const available = (await self.ai.summarizer.capabilities()).available;
      let summarizer;
      if (available === 'no') {
        // The Summarizer API isn't usable.
        console.log("Summerizer not available")
        return;
      }
      if (available === 'readily') {
        // The Summarizer API can be used immediately .
        // @ts-expect-error type of ai is unknown
        summarizer = await self.ai.summarizer.create(options);
      } else {
        // The Summarizer API can be used after the model is downloaded.
        // @ts-expect-error type of ai is unknown
        summarizer = await self.ai.summarizer.create(options);
        // @ts-expect-error type of e is unknown
        summarizer.addEventListener('downloadprogress', (e) => {
            console.log("downloadprogress", e.loaded, e.total);
        });
        await summarizer.ready;
    }
    console.log("summarizer", summarizer)
}

const getLanguage = (shortCode: string) => {
    switch (shortCode) {
        case "en":
            return "English"
        case "pt":
            return "Portuguese"
        case "es":
            return "Spanish"
        case "ru":
            return "Russian"
        case "tr":
            return "Turkish"
        case "fr":
            return "French"
    
        default:
            break;
    }
}

const TextInterface = () => {
    const [inputText, setInputText] = useState("");
    const [chats, setChats] = useState<{
        id: number, 
        initText: string,
        translatedText?: string,
        lang: string,
        error?: string,
        translationLang: string
    }[]>([]);

    const latestMessageRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        summerizeText()
    }, [])

    useEffect(() => {
        if(latestMessageRef.current) {
            latestMessageRef.current.scrollIntoView({ behavior: "smooth"})
        }
    }, [chats])
    
        const handleText = async (e: FormEvent) => {
            e.preventDefault();

            const lang:string = await detectLang(inputText);
            const FullLang = getLanguage(lang);
            console.log("Language detected", FullLang);
            setChats(prev => [...prev, {id: prev.length+1, initText: inputText, lang, translationLang: "en"}])
        }

        const translate = async (lang: string, text: string, id: number, targetLang: string) => {
            const result = await translateText(lang, targetLang, text);
            setChats(prev => prev.map((chat) => chat.id === id ? {...chat, translatedText: result} : chat))
            console.log("result", result);
        }

        const summerize = (id: number) => {
            setChats(prev => prev.map((chat) => chat.id === id ? {...chat, error: "Oops! Sorry, summerization is not availaible at this time, try again next time."} : chat))
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
                        {
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
                                        key={i}>
                                            {char}
                                    </motion.span>
                                ))}
                            </p>
                        }
                    </div>
                ))
            }
        </div>
        <form onSubmit={(e) => handleText(e)} className='w-full h-32 bg-slate-100 absolute left-1/2 -translate-x-1/2 bottom-10 rounded-2xl overflow-hidden'>
            <textarea placeholder='Type or paste something...' className='text-black w-full h-full bg-transparent rounded-2xl p-6' onChange={(e) => setInputText(e.target.value)} />
            <button disabled={!inputText} className='bg-blue-500 text-white hover:bg-blue-700 transition size-10 grid place-items-center rounded-full absolute right-2 bottom-2 disabled:pointer-events-none disabled:opacity-50'><BsSend /></button>
        </form>
    </div>
  )
}

export default TextInterface;