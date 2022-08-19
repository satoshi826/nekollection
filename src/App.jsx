import {useState} from 'react'
import {Link, useLocation, Route} from 'wouter'
import {useRecoilValue} from 'recoil'
import {pointState} from './states'

import ShopPage from './page/Shop'
import CollectionPage from './page/Collection'
import GamePage from './page/Game'

export default function App() {

  const [isOpenSide, setIsOpenSide] = useState(window.matchMedia('(min-width: 768px)').matches)

  return (
    <div style={grid(isOpenSide)}>
      <Header setIsOpenSide={setIsOpenSide}/>
      <Sidebar />
      <Main />
    </div>
  )
}

//---------------------------------

function Main() {
  return(
    <div style={main}>
      <Route path="/game" component={GamePage}/>
      <Route path="/shop" component={ShopPage}/>
      <Route path="/collection" component={CollectionPage}/>
    </div>
  )
}

//---------------------------------

function Header({setIsOpenSide}) {
  return(
    <div style={head}>
      <Hamburger setIsOpenSide={setIsOpenSide}/>
      <div style={headTitle}>
        Nekollection
      </div>
      <MyPoint/>
    </div>
  )
}

function Hamburger({setIsOpenSide}) {
  return(
    <div style={{width: '60px', margin: '20px', userSelect: 'none'}} onClick={() => setIsOpenSide((isOpen) => !isOpen)}>
      <svg
        width={40}
        height={60}
        stroke="white"
      >
        <line x1="0" y1="25" x2="40" y2="25"/>
        <line x1="0" y1="35" x2="40" y2="35"/>
        <line x1="0" y1="45" x2="40" y2="45"/>
      </svg>
    </div>
  )
}

function MyPoint() {

  const myPoint = useRecoilValue(pointState)

  return(
    <div style={headPoint}>
      {myPoint} P
    </div>
  )
}

//---------------------------------

function Sidebar() {

  const navInfos = [
    {title: 'Game', href: '/game'},
    {title: 'Shop', href: '/shop'},
    {title: 'Collection', href: '/collection'},
  ]

  return(
    <div style={side}>
      {navInfos.map((navInfo, i) => <Nav key={i} {...navInfo}/>)}
    </div>
  )
}

function Nav({title, href}) {
  const [location] = useLocation()
  const isActive = location === href
  return(
    <Link href={href} >
      <div style={sideNav(isActive)}>{title}</div>
    </Link>
  )
}

//----------------------------------------------------------------

const grid = (isOpenSide) => ({
  display            : 'grid',
  // overflow           : 'hidden',
  gridTemplateRows   : '70px auto',
  gridTemplateColumns: isOpenSide ? '210px 1fr' : '0px 1fr',
  gridTemplateAreas  : `
  "head head"
  "side main"
  `,
  width : '100%',
  height: '100%',
})

const main = {
  gridArea  : 'main',
  width     : '100%',
  background: '#181818',
  position  : 'relative'
}

//---------------------------------

const head = {
  gridArea      : 'head',
  background    : '#666',
  borderBottom  : '1px solid #000',
  display       : 'flex',
  alignItems    : 'center',
  justifyContent: 'space-between'
}

const headTitle = {
  fontSize: '2rem',
  color   : '#fff'
}

const headPoint = {
  width    : '100px',
  margin   : '20px',
  padding  : '5px',
  textAlign: 'center',
  fontSize : '1.2rem',
  color    : '#fff',
  border   : '1px solid #eee',
}

//---------------------------------

const side = {
  gridArea     : 'side',
  background   : '#333',
  borderRight  : '1px solid #000',
  display      : 'flex',
  flexDirection: 'column',
}

const sideNav = (isActive) => ({
  fontSize   : '1.8rem',
  cursor     : 'pointer',
  userSelect : 'none',
  marginTop  : '15px',
  marginLeft : '15px',
  color      : isActive ? '#aaf' : '#ddd',
  borderRight: isActive && '3px solid #88f',
})