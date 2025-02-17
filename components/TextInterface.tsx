"use client"

import React, { useEffect } from 'react'

const detectLang = async () => {
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
        // @ts-expect-error type of self.translation is unknown
        monitor(m) {
            // @ts-expect-error type of self.translation is unknown
        m.addEventListener('downloadprogress', (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
        });
            },
        });
    }
    const result= await detector.detect("Hola, Como te llamas?");
    const {detectedLanguage} = result[0]
    console.log(detectedLanguage)
    return detectedLanguage;
}

const translateText = async () => {
    // @ts-expect-error type of self.ai is unknown
    const translatorCapabilities = await self.ai.translator.capabilities();
    const canTranslate = translatorCapabilities.languagePairAvailable('es', 'fr');
    console.log("canTranslate", canTranslate);

}

const TextInterface = () => {
    useEffect(() => {
        translateText();
    }, [])

  return (
    <div>TextInterface</div>
  )
}

export default TextInterface