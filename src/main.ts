import { createRenderer } from 'vue'
import { isOn } from '@vue/shared'
import { useResizeObserver } from '@vueuse/core'
import * as PIXI from 'pixi.js'
import patchEvents from './patchEvent'
import App from './App.vue'
import { set } from './utils'

// 创建画布
const app = new PIXI.Application({ backgroundColor: '#242424' })
app.stage.sortableChildren = true
const canvas = app.view as HTMLCanvasElement
canvas.id = 'canvas'

document.body.appendChild(canvas)

// 设置 canvas 为满尺寸
useResizeObserver(canvas, ([entry]) => {
  app.renderer.resize(entry.contentRect.width, entry.contentRect.height)
})

// 自定义渲染器
const renderer = createRenderer<PIXI.DisplayObject | null, PIXI.Container>({
  createElement(type, isSVG, isCustomizedBuiltIn, props) {
    return new PIXI[type]() as PIXI.Container
  },
  insert(el, parent, anchor) {
    if (!el || !parent) return
    const i = parent.children.indexOf(anchor)
    if (i > -1) parent.addChildAt(el, i)
    else parent.addChild(el)
  },
  remove(el) {
    el?.removeFromParent()
  },
  patchProp(el, key, preVal, nextVal) {
    if (!el) return
    if (typeof el[key] === 'function') {
      el[key](...nextVal)
    } else if (isOn(key)) {
      patchEvents(el, key, nextVal)
    } else {
      set(el, key, nextVal, ':')
    }
  },
  createText(text) {
    return new PIXI.Text(text)
  },
  createComment(text) {
    const comment = new PIXI.Text(`<!-- ${text} -->`)
    comment.visible = false
    return comment
  },
  setText(node: PIXI.Text, text) {
    node.text = text
  },
  setElementText() {},
  parentNode(node) {
    return node?.parent
  },
  nextSibling(node) {
    return node?.parent.children[node.parent.getChildIndex(node) + 1]
  }
})

renderer.createApp(App).mount(app.stage)
