let charCount = document.getElementById("char");
let wordCount = document.getElementById("word");
let sentences = document.getElementById("sentences");
let spaces = document.getElementById("spaces");
let punctuations = document.getElementById("punctuations");
let readability = document.getElementById("readability");

const textArea = document.querySelector("#textarea");
const btn = document.getElementById("process-btn");
const copyBtn = document.getElementById("copy-btn");

btn.addEventListener('click', () => {
    let text = textArea.value;
    charCount.innerHTML = text.length;
    wordCount.innerHTML = countWords(text);
    sentences.innerHTML = countSentences(text);
    punctuations.innerHTML = puncCount(text);
    spaces.innerHTML = text.split(" ").length - 1;
    readability.innerHTML = calculateReadability(text);
});

copyBtn.addEventListener('click', () => {
    const results = `
        Character Count: ${charCount.innerHTML}
        Word Count: ${wordCount.innerHTML}
        Sentence Count: ${sentences.innerHTML}
        Space Count: ${spaces.innerHTML}
        Punctuation Count: ${punctuations.innerHTML}
        Readability Score: ${readability.innerHTML}
    `;
    navigator.clipboard.writeText(results).then(() => {
        alert('Results copied to clipboard!');
    });
});

function countWords(text) {
    let tempText = text.replace(/[.,!%&*;:'"-()]/g, "");
    tempText = tempText.split(/\n/);
    let tempList = [];
    tempText.forEach(word => tempList.push(word.split(" ")));
    return extract(tempList).filter(char => char != '').length;
}

function extract(arr) {
    return arr.reduce((wordList, word) => {
        return wordList.concat(Array.isArray(word) ? extract(word) : word)
    }, []);
}

function countSentences(text) {
    const regex = /[\w|\)][.?!](\s|$)/g;
    let senCount = text.match(regex);
    return senCount ? senCount.length : 0;
}

function puncCount(text) {
    const regex = /[.,?;:'"!-(){}]/g;
    let puntuationCount = text.match(regex);
    return puntuationCount ? puntuationCount.length : 0;
}

function calculateReadability(text) {
    const words = countWords(text);
    const sentences = countSentences(text);
    const syllables = text.split(' ').reduce((total, word) => total + countSyllables(word), 0);
    return (206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words))).toFixed(2);
}

function countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    const syllableMatches = word.match(/[aeiouy]{1,2}/g);
    return syllableMatches ? syllableMatches.length : 0;
}
