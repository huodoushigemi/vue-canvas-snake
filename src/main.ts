import { createRenderer } from 'vue'
import { isOn, isString, parseStringStyle } from '@vue/shared'
import { useResizeObserver } from '@vueuse/core'
import * as PIXI from 'pixi.js'
import patchEvent from './patchEvent'
import App from './App.vue'
import { get, set } from './utils'
import { ITextStyle, Sprite, Text, TextStyle, Texture } from 'pixi.js'

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

const OP = ':'

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
  patchProp(el, key, preVal, nxtVal) {
    if (!el) return
    const ori = get(el, key, OP)
    if (typeof ori === 'function') {
      ori.apply(el, Array.isArray(nxtVal) ? nxtVal : [])
    } else if (isOn(key)) {
      patchEvent(el, key, nxtVal)
    } else {
      switch (key) {
        case 'style':
          if (preVal == nxtVal && isString(nxtVal)) return
          const preStyle = (isString(preVal) ? parseStringStyle(preVal) : preVal) as ITextStyle
          const nxtStyle = (isString(nxtVal) ? parseStringStyle(nxtVal) : nxtVal) as ITextStyle
          // (el as Text).style = new TextStyle(nxtStyle)
          // 由于直接 new TextStyle 开销较大，所以这里进行了优化
          for (const k in preStyle) if (!(k in nxtStyle)) (el as Text).style[k] = TextStyle.defaultStyle[k]
          Object.assign((el as Text).style, nxtStyle)
          break;
        case 'texture':
          (el as Sprite).texture = isString(nxtVal) ? Texture.from(nxtVal) : nxtVal
          break;
        default:
          set(el, key, nxtVal, OP)
          break;
      }
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
