import {atom} from 'recoil'
import localforage from 'localforage'

export const pointState = atom({
  key    : 'point',
  default: 1000,
  effects: [localForageEffect()],
})

export const shopIDListState = atom({
  key    : 'shopIDList',
  default: new Array(12).fill().map((_, i) => i.toString()),
})

export const collectionState = atom({
  key    : 'collection',
  default: [],
  effects: [localForageEffect()],
})



function localForageEffect() {
  return ({setSelf, onSet, trigger, node}) => { //stateの永続化用
    const loadPersisted = async () => {
      const savedValue = await localforage.getItem(node.key)
      if (savedValue !== null) setSelf(JSON.parse(savedValue))
    }
    if (trigger === 'get') loadPersisted()
    onSet((newValue, _, isReset) => {
      isReset ? localforage.removeItem(node.key) : localforage.setItem(node.key, JSON.stringify(newValue))
    })
  }
}
