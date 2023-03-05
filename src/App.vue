<template>
  <!-- 头部 -->
  <Graphics :zIndex="1">
    <Graphics :beginFill="[0x2d333b]" :drawRect="[0, 0, width, 55]" endFill :alpha="0.75" />
    <Text text="🐍 SNAKE" :x="12" :style:lineHeight="55" style:fill="white" />
    <Sprite :texture="Texture.from('https://huodoushigemi.github.io/docx2vue/assets/github-540f5a2f.svg')" :x="256" :y="5" :width="45" :height="45" cursor="pointer" @click="toGithub" />
  </Graphics>

  <!-- 网格 -->
  <template v-for="i in maxW">
    <Graphics :lineStyle="[1]" :moveTo="[i * size, 0]" :lineTo="[i * size, maxH * size]" />
  </template>
  <template v-for="i in maxH">
    <Graphics :lineStyle="[1]" :moveTo="[0, i * size]" :lineTo="[maxW * size, i * size]" />
  </template>

  <!-- 食物 -->
  <Text text="🍔" :x="food[0] * size" :y="food[1] * size" :style:fontSize="size / 1.4" :style:lineHeight="size" />

  <!-- 蛇身 -->
  <template v-for="p in snake">
    <Graphics :x="p[0] * size" :y="p[1] * size" :drawRect="[0, 0, size, size]" :beginFill="['#000']" />
  </template>

  <Text text="按空格 暂停/继续" :x="maxW * size * 0.45" :y="maxH * size * 0.8" :style:fill="0xcccccc80" />
  <Text v-if="!isActive" text="暂停中……" :x="maxW * size * 0.45" :y="maxH * size * 0.85" :style:fill="0xcccccc80" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useIntervalFn, useWindowSize } from '@vueuse/core'
import { Texture } from 'pixi.js'

type Point = [x: number, y: number]

const num = 10
const { width, height } = useWindowSize()
const size = computed(() => Math.min(width.value, height.value) / num)
const maxW = computed(() => (width.value / size.value) >> 0)
const maxH = computed(() => (height.value / size.value) >> 0)

// 蛇身
const snake = ref<Point[]>([
  [2, num >> 1],
  [1, num >> 1],
  [0, num >> 1]
])

// 食物
const food = ref<Point>(genFood())

// 方向
let direction = 'ArrowRight'
let nextDirection = direction

window.addEventListener('keydown', e => {
  // 按空格 暂停/继续
  if (e.key == ' ') return isActive.value ? pause() : resume()
  // 🎮 ↑ ↓ ← →
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return
  if (direction == 'ArrowUp' && e.key == 'ArrowDown') return
  if (direction == 'ArrowDown' && e.key == 'ArrowUp') return
  if (direction == 'ArrowLeft' && e.key == 'ArrowRight') return
  if (direction == 'ArrowRight' && e.key == 'ArrowLeft') return
  nextDirection = e.key
})

const { resume, pause, isActive } = useIntervalFn(() => {
  direction = nextDirection
  const head = snake.value[0]
  let next!: Point

  if (direction == 'ArrowUp') next = [head[0], head[1] - 1]
  if (direction == 'ArrowDown') next = [head[0], head[1] + 1]
  if (direction == 'ArrowLeft') next = [head[0] - 1, head[1]]
  if (direction == 'ArrowRight') next = [head[0] + 1, head[1]]

  // 撞墙
  if (!isRange(next)) return pause(), alert('撞墙身亡，游戏结束')
  // 自尽
  if (snake.value.slice(0, -1).some(e => isSamePoint(e, next))) return pause(), alert('咬到自己，游戏结束')

  snake.value.unshift(next)

  // 吃到食物
  if (isSamePoint(next, food.value)) {
    food.value = genFood()
  } else {
    snake.value.pop()
  }
}, 250)

function toGithub() {
  const a = document.createElement('a')
  a.href = 'https://github.com/huodoushigemi/vue-canvas-snake.git'
  a.target = '_blank'
  a.click()
}

function isSamePoint(p1: Point, p2: Point) {
  return p1[0] == p2[0] && p1[1] == p2[1]
}
function isRange(p: Point) {
  console.log(p)
  return p[0] >= 0 && p[0] < maxW.value && p[1] >= 0 && p[1] < maxH.value
}
function random(max: number, min = 0) {
  return (min + Math.random() * (max - min)) >> 0
}
function genFood() {
  let point!: Point
  do point = [random(maxW.value), random(maxH.value)]
  while (snake.value.some(e => isSamePoint(e, point)))
  return point
}
</script>
