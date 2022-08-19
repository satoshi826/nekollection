import axios from 'axios'
import useSWR from 'swr'
import {useState} from 'react'
import {useRecoilState} from 'recoil'
import {pointState} from '../states'

const questionTypes = [
  {point: 400, answer: 15},
  {point: 200, answer: 10},
  {point: 200, answer: 10},
  {point: 50, answer: 5},
  {point: 50, answer: 5},
  {point: 50, answer: 5},
]

const getQuestionType = () => ({time: Date.now(), ...questionTypes[(Math.floor(Math.random() * 6))]}) //timeを付与することでユニークに

export default function GamePage() {

  const [myPoint, setPoint] = useRecoilState(pointState)

  const [questionType, setQuestionType] = useState(getQuestionType())
  const [resultObj, setResultObj] = useState(null)

  const params = {
    action     : 'query',
    format     : 'json',
    list       : 'random',
    rnlimit    : questionType.answer,
    rnnamespace: '0',
    origin     : '*'
  }

  const fetcher = () => axios.get('https://ja.wikipedia.org/w/api.php', {params}).then((res) => res.data.query.random)// ランダムに記事情報を取得
  const {data : randomWordList} = useSWR(questionType.time, fetcher)// questionTypeの変更時 = clickAnswer時に再取得するように
  console.log({randomWordList})

  const randomSelector = () => randomWordList?.[(Math.floor(Math.random() * 5))] // ランダム記事リストの中から解答を決定
  const {data : answerWord} = useSWR(randomWordList?.[0].id + 'answerWord', randomSelector) // randomWordListが更新されるとanswerWordを再セットするように
  console.log({answerWord})

  const clickAnswer = (id) => {
    console.log(questionType)
    const isCorrect = id === answerWord.id
    isCorrect && setPoint(myPoint + questionType.point)
    setResultObj({isCorrect, correctAnswer: answerWord.title, point: questionType.point})
    setQuestionType(getQuestionType())
  }

  return (
    <div style={gamePage}>
      <Question answerWord={answerWord} />
      <Answer randomWordList={randomWordList} clickAnswer={clickAnswer}/>
      {resultObj && <Result resultObj={resultObj} setResultObj={setResultObj}/>}
    </div>
  )
}

//-----------------------------------

function Question({answerWord}) {

  const params = {
    action     : 'query',
    format     : 'json',
    prop       : 'extracts',
    exintro    : '',
    explaintext: '',
    redirects  : 1,
    pageids    : answerWord?.id,
    origin     : '*'
  }

  const fetcher = () => axios
    .get('https://ja.wikipedia.org/w/api.php', {params}) // 記事のサマリーを取得
    .then((res) => {
      const text = res.data?.query.pages[answerWord?.id].extract
      const filteredText = '○○○' + text.substr(text.indexOf('は、')) // は，以前に記事名があるという仮定
      if (filteredText.length > 6) return filteredText
      return text.replace(/（.*）/g, '').replace(' ', '').replaceAll(answerWord.title, '○○○')
    })

  const {data : question} = useSWR(answerWord?.id, fetcher)
  console.log({question})

  return (
    <div style={container}>
      <div style={title}>Question</div>
      <div style={questionText}>{question}</div>
    </div>
  )
}

//-----------------------------------


function Answer({randomWordList, clickAnswer}) {
  return (
    <div style={container}>
      <div style={title}>Answer</div>
      <div style={answerList}>
        {randomWordList?.map(({title, id}, i) =>
          <button key={id} style={answerButton} onClick={() => {
            clickAnswer(id)
          }}>
            {i + 1}. {title}
          </button>
        )}
      </div>
    </div>
  )
}

//----------------------------------------------------------------

function Result({resultObj, setResultObj}) {
  return (
    <div style={result}>
      <div style={resultPop}>
        <div style={resultIs(resultObj.isCorrect)}>
          {resultObj.isCorrect ? '○' : 'X' }
        </div>
        <div style={resultText}>
          {resultObj.isCorrect ? resultObj.point + ' P GET!' : '正解: ' + resultObj.correctAnswer}
        </div>
        <button style={resultButton} onClick={() => {
          setResultObj(null)
        }}>
        NEXT
        </button>
      </div>
    </div>
  )
}

//----------------------------------------------------------------

const gamePage = {
  display            : 'grid',
  gridTemplateColumns: '100%',
  justifyContent     : 'center',
  overflow           : 'auto',
  minwidth           : '100%',
  height             : '100%',
  paddingTop         : '10px',
}

const container = {
  paddingLeft : '20px',
  paddingRight: '20px',
  minwidth    : '100%',
}

const title = {
  fontSize: '1.8rem',
  color   : '#fff',
}

//-----------------------------------

const questionText = {
  maxHeight : '200px',
  minwidth  : '100%',
  margin    : '5px',
  padding   : '20px',
  fontSize  : '1.2rem',
  color     : '#fff',
  background: '#555',
  overflow  : 'auto',
}

//-----------------------------------

const answerList = {
  display       : 'flex',
  margin        : '5px',
  flexWrap      : 'wrap',
  justifyContent: 'space-between',
  background    : '#444',
  maxHeight     : '200px',
  minwidth      : '100%',
  overflow      : 'auto'
}

const answerButton = {
  fontSize  : '1.2rem',
  flexGrow  : '1',
  color     : '#fff',
  background: '#888',
  margin    : '5px 10px',
}

//-----------------------------------

const result = {
  position      : 'absolute',
  minWidth      : '100%',
  minHeight     : '100%',
  display       : 'flex',
  justifyContent: 'center',
  alignItems    : 'center'
}

const resultPop = {
  background    : '#888',
  width         : '300px',
  display       : 'flex',
  flexDirection : 'column',
  justifyContent: 'center',
  alignItems    : 'center',
  border        : '3px solid #222',
}

const resultIs = (isCorrect) => ({
  fontSize  : '6rem',
  textAlign : 'center',
  margin    : '20px',
  width     : '200px',
  background: '#eee',
  color     : isCorrect ? '#f55' : '#55f',
})

const resultText = {
  fontSize  : '1.2rem',
  textAlign : 'center',
  margin    : '20px',
  width     : '250px',
  background: '#eee',
}

const resultButton = {
  fontSize: '3rem',
}