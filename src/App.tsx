import styles from './app.module.css'

import { WORDS } from './utils/words'
import type { Challenge } from './utils/words'
import { ToastContainer } from 'react-toastify';

import { Button } from './components/Button'
import { Header } from "./components/Header"
import { Input } from './components/Input'
import { Letter } from './components/Letter'
import { LetterUsed, type LetterUsedProps } from './components/LettersUsed'
import { Tip } from './components/Tip'
import { useEffect,useState } from 'react'

const ATTEMPTS_MARGIN = 5

function App() {
  const [score,setScore] = useState(0)
  const [lettersUsed,setLettersUsed] = useState<LetterUsedProps[]>([])
  const [letter,setLetter] = useState('')
  const [challenge,setChallenge] = useState< Challenge | null>()

  
  
 function handleRestartGame(){
   const isConfirmed = window.confirm("Você tem certeza que deseja reiniciar?")

   if(isConfirmed){
    startGame()
   }
 }

 function startGame(){
   const index = Math.floor(Math.random() * WORDS.length)
   const randomWord = WORDS[index]
   setChallenge(randomWord)

   setScore(0)
   setLetter('')
   setLettersUsed([])
 }

 function handleConfirm(){
    if(!challenge) {
      return
    }

    if(!letter.trim()){
      return alert("Digite uma letra!")
    }

    const value = letter.toLocaleUpperCase()
    const exists = lettersUsed.find((used) => used.value.toLocaleUpperCase() === value)

    if(exists){
      setLetter("")
      return alert("Você já utilizou essa letra!" + value)
    }

    const hits = challenge.word.toUpperCase().split('').filter((char) => char === value).length
    const correct = hits > 0
    const currentScore = score + hits

    setLettersUsed((prevState) => [...prevState,{value,correct}])
    setScore(currentScore)
    setLetter('')
 }

 function endGame(message:string){
    alert(message)
    startGame()
 }

 useEffect(()=>{
    startGame()
 },[])

 useEffect(()=>{
   if(!challenge){
    return
   }

   setTimeout(()=>{
      if(score === challenge.word.length){
        return endGame("Parabéns você descobriu a palavra!")
      }

      const attemptLimit = challenge.word.length + ATTEMPTS_MARGIN

      if(lettersUsed.length === attemptLimit){
        return endGame("Que pena,você usou todas as tentativas!")
      }
   },200)

 },[score,lettersUsed.length])


 if(!challenge) {
   return
 }

 
  return (
    <>
     
     <ToastContainer />
     <div className={styles.container}>
         <main>
          <Header current={lettersUsed.length} max={challenge.word.length + ATTEMPTS_MARGIN} onRestart={handleRestartGame} />
          <Tip tip={challenge.tip} />
          
          <div className={styles.word}> 
            {
              challenge.word.split("").map((letter,index) => {
                const letterUsed = lettersUsed.find((used) => used.value.toUpperCase() === letter.toUpperCase())
                return <Letter key={index} value={letterUsed?.value} color={letterUsed?.correct ? "correct" : "default"} />
                  
                
              }
            )
            }

          </div>

          <h4>Palpite</h4>

          <div className={styles.gues}>
            <Input
              autoFocus maxLength={1}
              placeholder='?'
              value={letter}
              onChange={(e)=> setLetter(e.target.value)}

            />
            <Button title='Confirmar' onClick={handleConfirm} />
          </div>

          <LetterUsed data={lettersUsed} />
         </main>
     </div>
      
    </>
  )
}

export default App
