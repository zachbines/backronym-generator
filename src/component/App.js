import '../App.css';
import { useState, useEffect } from 'react';
import firebase from '../config/firebase.js';
import UserInputForm from './UserInputForm.js';
import WordDisplay from './WordDisplay.js';
import SavedBackronyms from "./SavedBackronyms.js";

function App() {
    // for the first letter:
    // https://api.datamuse.com/sug?s={the first letter of userWord}

    // for every subsequent letter:
    // https://api.datamuse.com/words?lc={the last item in chosenWords}&sp={currentLetter}*

    // the word submitted by the user to create a backronym with
    const [userWord, setUserWord] = useState('');

    // the letters of userWord spread into an array 
    const [letters, setLetters] = useState([]);

    // the index of the letters array
    const [index, setIndex] = useState();

    // the letter within 'letters' at the current index
    const [currentLetter, setCurrentLetter] = useState('')

    // words corresponding to the current letter that are returned from the API
    const [wordOptions, setWordOptions] = useState([]);

    // the word from wordOptions that is currently being suggested to the user
    const [currentWord, setCurrentWord] = useState("")

    // the words that the user has chosen so far for the current backronym being generated
    const [chosenWords, setChosenWords] = useState([])

    // when set to true, generator is waiting to receive API data
    const [isLoading, setIsLoading] = useState(false)

    // the completed backronyms that are stored in the database
    const [backronyms, setBackronyms] = useState([]);

    // user input error message is triggered when set to true
    const [inputError, setInputError] = useState(false);

    // when set to true, app is loading data from Firebase
    const [firebaseLoading, setFirebaseLoading] = useState(false)

    // reading data from Firebase and assigning it to the state of the list of finished backronyms to be displayed
    useEffect(() => {
        setFirebaseLoading(true);
        const dbRef = firebase.database().ref();

        dbRef.on('value', (response) => {
            const newDataArray = []
            const data = response.val();

            for (let key in data) {
                newDataArray.unshift({ key: key, word: data[key].word, backronym: data[key].backronym });
            }

            setBackronyms(newDataArray);

            setFirebaseLoading(false);
        });

    }, []);

    // delete items from Firebase
    const handleBackronymDelete = (backronym) => {
        const dbRef = firebase.database().ref();
        dbRef.child(backronym.key).remove();
    };

    const handleInput = (event) => {
        setUserWord(event.target.value);
    }

    const handleClick = (userWord) => (event) => {
        event.preventDefault();

        // make sure the user can only input letters and spread their word into individual letters
        // define regular expressions
        let re = /^([a-z]+)$/i;

        if (re.test(userWord)) {
            setInputError(false);
            const userLetters = [...userWord];

            setLetters(userLetters);
            setCurrentLetter(userLetters[0]);
            setIndex(0);
            setChosenWords([]);
        } else {
            setInputError(true);
        }
    }

    // resetting the user input and word/letter/current backronym states
    const handleReset = (event) => {
        event.preventDefault();
        setChosenWords([]);
        setLetters([]);
        setCurrentWord('');
        setUserWord('');
    }

    // selecting a random item from the array returned from the API
    const getRandomWord = (array) => {
        const randomIndex = Math.floor(Math.random() * array.length);
        const randomWord = array[randomIndex];

        setCurrentWord(randomWord);
    }

    // when the user adds a word to their current backronym, save that word while the backronym is in progress
    const saveWord = (word) => {
        setChosenWords([...chosenWords, word]);
    }

    // when the user clicks the 'accept word' button...
    const changeLetters = () => {
        // save the newly accepted word...
        if (index < letters.length) {
            saveWord(currentWord);

            // ...and if there are unused letters left in the backronym, move on to the next letter
            // else the backronym is complete and is pushed to Firebase
            if (index < letters.length - 1) {
                setIndex(index + 1)
                const nextLetter = letters[index + 1];
                setCurrentLetter(nextLetter);
            } else {
                const dbRef = firebase.database().ref();

                const wordListToSave = [...chosenWords, currentWord];

                const backronym = {
                    word: letters.join(''),
                    backronym: wordListToSave.join(' ')
                }
                dbRef.push(backronym);

                //clear user input
                setUserWord('');
            }
        }
    }

    // the number of words we want to receive from the API when it is called
    const numberOfAPIWords = 30;

    // API call for first letter of userWord
    useEffect(
        () => {
            setIsLoading(true);
            fetch(`https://api.datamuse.com/sug?s=${letters[0]}&max=${numberOfAPIWords}`)
                .then((response) => {
                    return response.json()
                })
                .then((firstWords) => {

                    if (letters.length) {
                        // filter out one-letter words from the API response 
                        const firstWordsArray = firstWords.filter(wordObj => wordObj.word.length > 1).map((filteredWordObj) => {
                            return filteredWordObj.word;
                        })
                        setWordOptions(firstWordsArray);
                        getRandomWord(firstWordsArray);
                    }
                    setIsLoading(false);
                })
        }, [letters])

    // API call for all letters except the first one
    useEffect(
        () => {
            setIsLoading(true);
            fetch(`https://api.datamuse.com/words?lc=${chosenWords[chosenWords.length - 1]}&sp=${currentLetter}*&max=${numberOfAPIWords}`)
                .then((response) => {
                    return response.json()
                })
                .then((words) => {
                    // if the chosenWord state has length AND if there are more than 5 choices returned from the API
                    if (chosenWords.length && words.length > 5) {
                        // filter out one-letter words from the API response
                        const wordsArray = words.filter(wordObj => wordObj.word.length > 1).map((filteredWordObj) => {
                            return filteredWordObj.word;
                        })
                        setWordOptions(wordsArray);
                        getRandomWord(wordsArray);
                    } else if (chosenWords.length && words.length <= 5) {
                        // backup API call to the endpoint used for the first letter if less than 5 options are returned from the other endpoint
                        fetch(`https://api.datamuse.com/sug?s=${currentLetter}&max=${numberOfAPIWords}`)
                            .then((response) => {
                                return response.json()
                            })
                            .then((words) => {
                                // filter out one-letter words from the API response
                                const wordsArray = words.filter(wordObj => wordObj.word.length > 1).map((filteredWordObj) => {
                                    return filteredWordObj.word;
                                })
                                setWordOptions(wordsArray);
                                getRandomWord(wordsArray);
                            })
                    }
                    setIsLoading(false);
                })
        }, [chosenWords, currentLetter]
    )

    return (
        <>
            <div className="wrapper">
                <h1>Backronym Generator</h1>

                <UserInputForm
                    userWord={userWord}
                    handleInput={handleInput}
                    handleClick={handleClick}
                    handleReset={handleReset}
                    inputError={inputError}
                />

                <div className="flexAllTheBackronyms">
                    <WordDisplay
                        wordOptions={wordOptions}
                        letterList={letters}
                        changeLetters={changeLetters}
                        getRandomWord={getRandomWord}
                        currentWord={currentWord}
                        chosenWords={chosenWords}
                        isLoading={isLoading}
                    />

                    <SavedBackronyms
                        backronymList={backronyms}
                        deleteBackronym={handleBackronymDelete}
                        firebaseLoading={firebaseLoading}
                    />
                </div>
            </div>

            <footer>Created at <a href="https://junocollege.com/" target="_blank" rel="noopener noreferrer">Juno College</a></footer>
        </>
    );
}

export default App;