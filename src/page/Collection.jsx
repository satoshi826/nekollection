import React from 'react'
import {useRecoilState, useRecoilValue} from 'recoil'
import {DndContext, MouseSensor, TouchSensor, useSensor, useSensors} from '@dnd-kit/core'
import {SortableContext, useSortable, arrayMove} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {collectionState} from '../states'

export default function CollectionPage() {

  const sensors = useSensors(useSensor(TouchSensor), useSensor(MouseSensor))
  const [collectionList, setCollectionList] = useRecoilState(collectionState)

  const handleDragEnd = (event) => {
    const {active, over} = event
    if (active.id !== over.id) {
      setCollectionList((items) => {
        const oldIndex = items.findIndex(({id}) => id === active.id)
        const newIndex = items.findIndex(({id}) => id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div style={collectionPage}>
      <DndContext
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={collectionList.map(({id}) => id)}>
          {collectionList.map(({id}) => id).map((item) =>
            <NekoCard key={item} id={item}/>
          )}
        </SortableContext>
        <Spacer/>
      </DndContext>
    </div>

  )
}

function NekoCard({id}) {

  const collectionList = useRecoilValue(collectionState)
  const {imgsrc, name, point} = collectionList.find(collection => collection.id === id)

  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id})

  const movable = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div style={{...card(point), ...movable}} ref={setNodeRef} {...attributes} {...listeners}>
      <div style={cardName} >{name}</div>
      <img src={imgsrc} height='160px'/>
      <div style={cardPoint}>{point} POINT</div>
    </div>
  )
}

function Spacer() {
  return new Array(6).fill().map((_, i) =>
    <div key={i} style={{width: '160px', margin: '3px'}}/>
  )
}

//----------------------------------------------------------------

const collectionPage = {
  position      : 'absolute',
  display       : 'flex',
  flexWrap      : 'wrap',
  justifyContent: 'space-between',
  overflow      : 'auto',
  overflowX     : 'hidden',
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