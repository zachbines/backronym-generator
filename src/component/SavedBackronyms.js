import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
const SavedBackronyms = ({ backronymList, deleteBackronym, firebaseLoading }) => {
    //styling for BeatLoader
    const override = css`
    display: block;
    text-align: center;
    margin: 3rem 0;
    `;

    return (
        <section className="savedBackronyms">
            <h2>Completed Backronyms</h2>

            {firebaseLoading
                ? < BeatLoader color={"#81003C"} loading={firebaseLoading} size={20} css={override} />
                :   <ul>
                        {
                            // backronym = {
                            //     word: USER'S INPUT,
                            //     backronym: BACKRONYM CREATED BY USER USING THEIR WORD
                            // }
                            backronymList.map((backronym) => {
                                return (
                                    <li className="backronym" key={backronym.key}>
                                        <p><span>{backronym.word}:</span> {backronym.backronym}</p>
                                        <button onClick={() => deleteBackronym(backronym)}>Delete</button>
                                    </li>
                                )
                            })
                        }
                    </ul>
            }
        </section>
    )
}

export default SavedBackronyms;