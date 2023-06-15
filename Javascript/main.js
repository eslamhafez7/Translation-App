let textFrom = document.querySelector(".text-from");
let textTo = document.querySelector(".text-to");
let selectTag = document.querySelectorAll("select"),
translatebutton = document.querySelector("button");
let exchangeIcon = document.querySelector(".exchange");
let icons = document.querySelectorAll(".icons i");


selectTag.forEach((tag, id) => {
    for(const countryCode in countries) {
        // console.log(countries[countryCode]);
        let selected;
        // Add English as the default language 
        if(id == 0 && countryCode == "en-GB") {
            selected = "selected"
        // Add Arabic as the default language 
        }else if (id == 1 && countryCode == "ar-SA"){
            selected = "selected";
        }
        let option = `<option value="${countryCode}" ${selected}>${countries[countryCode]}</option>`;
        tag.insertAdjacentHTML("beforeend", option); // adding options tag inside select tag
    }
});


translatebutton.addEventListener("click", () => {
    let text = textFrom.value,
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
    console.log(text, translateFrom, translateTo);
    const apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiURL).then(res => res.json()).then (data => {
        console.log(data);
        textTo.value = data.responseData.translatedText;
        textTo.setAttribute("placeholder", "Translating...");
    });
});

exchangeIcon.addEventListener("click", () => {
    // Exchanging textarea and select value
    let tempText = textFrom.value,
    tempLang = selectTag[0].value;
    textFrom.value = textTo.value;
    selectTag[0].value = selectTag[1].value;
    textTo.value = tempText;
    selectTag[1].value = tempLang;
})


let typingTimer;
const doneTypingInterval = 500; // milliseconds

textFrom.addEventListener("input", () => {
    clearTimeout(typingTimer); // Clear the previous timer

typingTimer = setTimeout(() => {
    translateText();
    }, doneTypingInterval);
});



function translateText() {
    let text = textFrom.value;
    let translateFrom = selectTag[0].value;
    let translateTo = selectTag[1].value;
const apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

fetch(apiURL)
    .then(res => res.json())
    .then(data => {
        textTo.value = data.responseData.translatedText;
    });
};

// console.log(icons);
// icons.forEach(icon => {
//     icon.addEventListener("click", ({target}) => {
//         // console.log(target);
//         if(target.classList.contains("fa-copy")) {
//             if(target.id == "from") {
//                 navigator.clipboard.writeText(textFrom.value);
//             }else {
//                 navigator.clipboard.writeText(textTo.value);
//             }
//         }else {
//             console.log("Speech icon clicked")
//         }
//     })
// })

icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
      // console.log(target);
    if (target.classList.contains("fa-copy")) {
        if (target.id == "from") {
            new ClipboardJS('#from', {
            text: function() {
                return textFrom.value;
            }
    });
        } else {
            new ClipboardJS('#to', {
            text: function() {
                return textTo.value;
            }
        });
        }
    } else {
        let utterance;
        if(target.id == "from") {
            utterance = new SpeechSynthesisUtterance(textFrom.value);
            utterance.lang = selectTag[0].value;
        }else {
            utterance = new SpeechSynthesisUtterance(textTo.value);
            utterance.lang = selectTag[1].value;
        }
        speechSynthesis.speak(utterance);
    }
    });
});
