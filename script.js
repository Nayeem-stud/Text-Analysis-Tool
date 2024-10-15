const charCount = document.getElementById("char");
const wordCount = document.getElementById("word");
const sentences = document.getElementById("sentences");
const spaces = document.getElementById("spaces");
const punctuations = document.getElementById("punctuations");
const readability = document.getElementById("readability");
const sentiment = document.getElementById("sentimentResult");
const keywords = document.getElementById("keywordsResult");
const category = document.getElementById("categoryResult");
const classification = document.getElementById("classificationResult");
const copyBtn = document.getElementById("copyBtn");
const btn = document.getElementById("analyzeBtn");
const textArea = document.getElementById("textInput");

btn.addEventListener('click', () => {
    const text = textArea.value.trim();
    if (!text) {
        alert("Please enter some text.");
        return;
    }

    charCount.innerHTML = text.length;
    wordCount.innerHTML = countWords(text);
    sentences.innerHTML = countSentences(text);
    punctuations.innerHTML = puncCount(text);
    spaces.innerHTML = (text.match(/\s/g) || []).length;
    readability.innerHTML = calculateReadability(text);

    analyzeText(text);
});

copyBtn.addEventListener('click', () => {
    const results = `
        Character Count: ${charCount.innerHTML}
        Word Count: ${wordCount.innerHTML}
        Sentence Count: ${sentences.innerHTML}
        Space Count: ${spaces.innerHTML}
        Punctuation Count: ${punctuations.innerHTML}
        Readability Score: ${readability.innerHTML}
        Sentiment: ${sentiment.innerHTML}
        Keywords: ${keywords.innerHTML}
        Category: ${category.innerHTML}
        Classification: ${classification.innerHTML}
    `;
    navigator.clipboard.writeText(results).then(() => {
        alert('Results copied to clipboard!');
    });
});

function countWords(text) {
    return text.split(/\s+/).filter(word => word.length > 0).length;
}

function countSentences(text) {
    const regex = /[\w|\)][.?!](\s|$)/g;
    const senCount = text.match(regex);
    return senCount ? senCount.length : 0;
}

function puncCount(text) {
    const regex = /[.,?;:'"!-(){}]/g;
    const punctuationCount = text.match(regex);
    return punctuationCount ? punctuationCount.length : 0;
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

function analyzeText(text) {
    // Expanded keyword lists
    const positiveWords = ['happy', 'great', 'good', 'fantastic', 'awesome', 'excellent', 'amazing', 'love', 'satisfied', 'wonderful', 'positive', 'perfect', 'best', 'brilliant', 'outstanding', 'joyful', 'pleasure', 'success', 'delighted', 'thrilled'];
    const negativeWords = ['sad', 'bad', 'terrible', 'horrible', 'angry', 'disappointed', 'awful', 'hate', 'worst', 'negative', 'poor', 'dissatisfied', 'frustrated', 'unhappy', 'disaster', 'disgusting', 'miserable', 'pain', 'failure', 'frustrating'];
    const neutralWords = ['okay', 'fine', 'neutral', 'average', 'acceptable', 'fair'];
    const intensifiers = ['very', 'extremely', 'incredibly', 'really', 'super', 'absolutely', 'truly', 'especially'];

    // Sentiment analysis
    const wordsArray = text.split(/\s+/);
    let sentimentScore = 0;
    const keywordsArray = [];
    
    wordsArray.forEach(word => {
        const lowerWord = word.toLowerCase();
        if (positiveWords.includes(lowerWord)) {
            sentimentScore++;
            keywordsArray.push(lowerWord);
        } else if (negativeWords.includes(lowerWord)) {
            sentimentScore--;
            keywordsArray.push(lowerWord);
        }
    });

    sentiment.innerHTML = sentimentScore > 0 ? 'Positive' : sentimentScore < 0 ? 'Negative' : 'Neutral';
    keywords.innerHTML = keywordsArray.length ? keywordsArray.join(', ') : 'None';

    // Classification based on score
    const classificationText = sentimentScore > 0 ? 'Positive Content' : sentimentScore < 0 ? 'Negative Content' : 'Neutral Content';
    classification.innerHTML = classificationText;

    // Category assignment
    if (text.includes('politics')) {
        category.innerHTML = 'Politics';
    } else if (text.includes('sports')) {
        category.innerHTML = 'Sports';
    } else if (text.includes('technology')) {
        category.innerHTML = 'Technology';
    } else {
        category.innerHTML = 'General';
    }
}
