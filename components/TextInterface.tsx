"use client"

import React, { FormEvent, useState } from 'react'

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

const TextInterface = () => {
    const [inputText, setInputText] = useState("Thank you so much");
    const [translatedText, setTranslatedText] = useState("");
    
        const handleText = async (e: FormEvent) => {
            e.preventDefault()
            const lang:string = await detectLang(inputText);
            console.log("Language detected",lang)

            const result = await translateText(lang, "fr", inputText);
            setTranslatedText(result)
            console.log("result", result);
        }

  return (
    <div className='w-full h-screen'>
        <form onSubmit={(e) => handleText(e)} className='w-full h-full flex items-center gap-4 p-10'>
            {
                translatedText && <p>{translatedText}</p>
            }
            <input className='text-black' type="text" onChange={(e) => setInputText(e.target.value)} />
            <button>Submit</button>
        </form>
    </div>
  )
}

export default TextInterface