// import BeatLoader to be used for loading state
import BeatLoader from "react-spinners/BeatLoader";
// import BackcronymDefinition
import BackcronymDefinition from "./BackronymDefinition.js";
import { css } from "@emotion/react";

const WordDisplay = ({ wordOptions, letterList, changeLetters, getRandomWord, currentWord, chosenWords, isLoading }) => {
    // getting a random word from the array received from the API
    const handleRejectChoice = () => {
        getRandomWord(wordOptions);
    }

    // removing the first letter from each word the user has selected for their backronym when displaying on page
    const splitFirstLetter = (word) => {
        return word.substring(1);
    }

    const override = css`
       display: block;
       padding-top: 35px; 
    `;
 
    return (
            <section className="wordDisplay">
                <div className="wordChoice">
                    
                    {/* if the user's backronym is complete: */}
                    {chosenWords.length === letterList.length && chosenWords.length > 0 
                        ? <h2 className="loadHeight">Backcronym completed!</h2>
                        : isLoading 
                            ? <div className="loadHeight">
                                < BeatLoader color={"#81003C"} loading={isLoading} size={20} css={override}/>  
                              </div>              
                            : currentWord && <h2 className="loadHeight">{currentWord}</h2>
                    }
                    {/* same condition as above: */}
                    {chosenWords.length === letterList.length && chosenWords.length > 0
                        ? ""
                        : letterList.length

                            // if the user has submitted a word, display buttons for selecting/rejecting words to add to their backronym
                            ? <div className="flexButtons">

                                    <button
                                        className="wordDisplayButton"
                                        onClick={changeLetters} 
                                        key="accept"
                                        disabled={
                                            // disable button when geting data from API 
                                            isLoading
                                                ? true
                                                : false
                                        }>Accept Word
                                    </button>
                                    <button 
                                        className="wordDisplayButton" 
                                        onClick={handleRejectChoice} 
                                        key="reject"
                                        >Change Word
                                    </button>

                                </div>
                            : <BackcronymDefinition />
                    }
                </div>
                
                {/* if the user has submitted a word, display their word and their in-progress backronym */}
                {letterList.length ? 

                <div className="wordList">
                    <ul className="firstLetterList">
                        {
                            // map through the letterList array to list each letter vertically
                            letterList.map((letter, index) => {
                                return (
                                    <li key={index} className="letterList">
                                        <p>{letter}</p>
                                    </li>
                                )
                            })
                        }
                    </ul>

                    <ul className="restOfWord">
                        {
                            // map through the chosenWords array to list each split word with its corresponding letter
                            chosenWords.map((word, index) => {
                                return (
                                    <li key={index}>
                                        <p>
                                            <span aria-hidden="true">{splitFirstLetter(word)}</span>
                                            <span className="srOnly">{word}</span>
                                        </p>
                                    </li>
                                )
                            })
                        }
                    </ul> 
                </div>  : "" }
            </section> 
    )
}

export default WordDisplay;