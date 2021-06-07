# Backronym Generator

This React/API web application was built collaboratively in a small group as per client's requests. 


## Project Description

The definition of [backronym](https://en.wikipedia.org/wiki/Backronym) is "an acronym deliberately formed from a phrase
whose initial letters spell out a particular word or words, either to create a memorable name
or as a fanciful explanation of a word’s origin."

## How to Use 
* The user will be able to input a word and get a suggession of another word generated for the first letter of the input word. 
* If the user accepts the suggested word, the word will be saved and the app will move onto the next letter of the input word and get a word generated based on the meaning of the previous chosen word. 
* If the user rejects the suggested word, a new word will be suggested until the user makes a choice for the current letter.
* Once the backcronym is completed, the original word and completed backcronym will be saved into the Firebase database and presented on the page.
* The saved backcronyms can be deleted from the database if user clicks the "delete" button. 

## Resources  
* Datamuse API (http://www.datamuse.com/api/), a word-finding query engine for developers.

