import { createRenderer } from 'vue'
import { isOn } from '@vue/shared'
import './style.css'
import App from './App.vue'
import { useResizeObserver } from '@vueuse/core'
import * as PIXI from 'pixi.js'
import { DisplayObjectEvents } from 'pixi.js'
import patchEvents from './patchEvent'

const set = (obj: Record<string, any>, key: string, val: any, op = '.') => {
  const keys = key.split(op)
  obj = keys.slice(0, -1).reduce((o, e) => (o[e] ??= {}), obj)
  return (obj[keys.at(-1)] = val)
}

const app = new PIXI.Application({ backgroundColor: '#242424' })
app.stage.sortableChildren = true
const canvas = app.view as HTMLCanvasElement
canvas.id = 'canvas'

document.body.appendChild(canvas)

// new PIXI.Graphics().clear()

// 设置 canvas 为满尺寸
useResizeObserver(canvas, ([entry]) => {
  app.renderer.resize(entry.contentRect.width, entry.contentRect.height)
})

const renderer = createRenderer<PIXI.DisplayObject | null, PIXI.Container>({
  createElement(type, isSVG, isCustomizedBuiltIn, props) {
    return new PIXI[type]() as PIXI.Container
  },
  insert: (el, parent, anchor) => {
    if (!el || !parent) return
    const i = parent.children.indexOf(anchor)
    if (i > -1) parent.addChildAt(el, i)
    else parent.addChild(el)
  },
  remove: el => el?.removeFromParent(),
  patchProp: (el, key, preVal, nextVal) => {
    if (!el) return
    if (typeof el[key] === 'function') {
      el[key](...nextVal)
    } else if (isOn(key)) {
      patchEvents(el, key, nextVal)
    } else {
      set(el, key, nextVal, ':')
    }
  },
  createText: text => new PIXI.Text(text),
  createComment: text => {
    const comment = new PIXI.Text(`<!-- ${text} -->`)
    comment.visible = false
    return comment
  },
  setText: (node: PIXI.Text, text) => (node.text = text),
  setElementText: () => null,
  parentNode: node => node?.parent,
  nextSibling: node => node?.parent.children[node.parent.getChildIndex(node) + 1]
})

renderer.createApp(App).mount(app.stage)

function createInvoker(el: PIXI.DisplayObject, name: keyof DisplayObjectEvents, val) {
  const invoker = () => invoker.value()
  invoker.value = val
  console.log(invoker.value)
  el.on(name, () => console.log(name))
  return invoker
}
