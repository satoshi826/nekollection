import axios from 'axios'
import useSWR from 'swr'
import {useRecoilValue, useRecoilState} from 'recoil'
import {shopIDListState, pointState, collectionState} from '../states'
import {faker} from '@faker-js/faker'

faker.locale = 'ja'

export default function ShopPage() {

  const shopIDList = useRecoilValue(shopIDListState)
  console.log({shopIDList})

  return (
    <div style={shopPage}>
      {shopIDList.map(id =>
        <NekoCard key={id} id={id}/>
      )}
      <Spacer/>
    </div>
  )
}

function NekoCard({id}) {

  const fetcher = () => axios.get('https://aws.random.cat/meow').then((res) => res.data.file) // swr用のPromiseを返す関数 通常fetcher
  const nameGetter = () => faker.name.fullName() // fetcherじゃなくても良い = 非同期関数の結果の状態管理としても使える
  const pointGetter = () => (Math.floor(Math.random() * 15) + 1) * 100

  const {data : imgsrc} = useSWR(id + 'src', fetcher)
  const {data : name} = useSWR(id + 'name', nameGetter)
  const {data : point} = useSWR(id + 'point', pointGetter)

  const [myPoint, setPoint] = useRecoilState(pointState)
  const [shopIDList, setShopIDList] = useRecoilState(shopIDListState)
  const [collection, setCollection] = useRecoilState(collectionState)

  const shortagePoint = point - myPoint

  const buyNeko = () => {
    const newShopIDList = shopIDList.map((shopID) => (shopID === id) ? Date.now().toString() : shopID)
    setShopIDList(newShopIDList)
    setPoint(myPoint - point)
    setCollection([...collection, {name, imgsrc, point, id: Date.now()}])
  }

  return (
    <div style={card(point)}>
      <div style={cardName}>{name}</div>
      <img src={imgsrc} height='160px'/>
      <div style={cardPoint}>{point} POINT</div>
      {(shortagePoint > 0)
        ? <div style={{textAlign: 'center'}}>{shortagePoint} POINT 不足</div>
        : <button onClick={buyNeko}>BUY</button>
      }
    </div>
  )
}

function Spacer() {
  return new Array(6).fill().map((_, i) =>
    <div key={i} style={{width: '160px', margin: '3px'}}/>
  )
}

//----------------------------------------------------------------

const shopPage = {
  position      : 'absolute',
  display       : 'flex',
  flexWrap      : 'wrap',
  justifyContent: 'space-between',
  overflow      : 'auto',
  padding       : '20px',
  maxHeight     : '100%',
}

const card = (point) => ({
  display       : 'flex',
  flexDirection : 'column',
  justifyContent: 'space-between',
  width         : '160px',
  margin        : '3px',
  marginTop     : '20px',
  background    : pointToColor(point),
  border        : '2px solid #eee',
  color         : '#fff',
})

const cardName = {
  fontSize : '1.2rem',
  textAlign: 'center',
}

const cardPoint = {
  fontSize : '1rem',
  textAlign: 'center',
}

function pointToColor(point) {
  if(point > 1400) return '#f2f'
  if(point > 1100) return '#a32'
  if(point > 900) return '#119'
  if(point > 700) return '#171'
  if(point > 400) return '#660'
  return '#333'
}