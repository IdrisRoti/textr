import toast from "react-hot-toast";

export const getLanguage = (shortCode: string) => {
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

export const detectLang = async (LangToDetect: string) => {
    // @ts-expect-error type of self.ai is unknown
    const languageDetectorCapabilities = await self.ai.languageDetector.capabilities();
    const canDetect = languageDetectorCapabilities.languageAvailable('en');
    console.log("canDetect", canDetect);

    let detector;
    if (canDetect === 'no') {
    // The language detector isn't usable.
    toast.error("Looks like Language detection is not supported this device");
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
    const {detectedLanguage} = result[0];
    console.log(detectedLanguage)
    return detectedLanguage;
}

export const translateText = async (sourceLang: string, targetLang: string, TextToTranslate: string) => {
    // @ts-expect-error type of self.ai is unknown
    const translatorCapabilities = await self.ai.translator.capabilities();
    const canTranslate = translatorCapabilities.languagePairAvailable(sourceLang, targetLang);
    console.log("canTranslate", canTranslate);

    let translator;

    if (canTranslate === "no"){
        // The language translator isn't usable.
        toast.error("Looks like Translation is not allowed on this device")
        return;
    }

    if (canTranslate === "readily"){
        // @ts-expect-error type of self.ai is unknown
        translator = await self.ai.translator.create({
            sourceLanguage: sourceLang,
            targetLanguage: targetLang,
          });
    } else {
        console.log("Have to download")
        toast.error(`Sorry boss. Translation from ${getLanguage(sourceLang)} to ${getLanguage(targetLang)} is not supported at this time, try again later.`)
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

    const result= await translator.translate(TextToTranslate);
    return result;
}

export const summerizeText = async () => {
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