<template>
  <!-- 顶部 -->
  <Graphics :zIndex="1">
    <Graphics :beginFill="[0x2d333b]" :drawRect="[0, 0, width, 55]" endFill :alpha="0.75" />
    <Text text="🐍 SNAKE" :x="12" :style:lineHeight="55" style="fill: white" />
    <Sprite texture="https://huodoushigemi.github.io/docx2vue/assets/github-540f5a2f.svg" :x="256" :y="5" :width="45" :height="45" cursor="pointer" @click="toGithub" />
  </Graphics>

  <!-- 网格 -->
  <template v-for="i in maxX">
    <Graphics :x="i * size" :lineStyle="[1]" :moveTo="[0, 0]" :lineTo="[0, maxY * size]" />
  </template>
  <template v-for="i in maxY">
    <Graphics :y="i * size" :lineStyle="[1]" :moveTo="[0, 0]" :lineTo="[maxX * size, 0]" />
  </template>

  <!-- 食物 -->
  <Text text="🍔" :x="food[0] * size" :y="food[1] * size" :style="{ fontSize: size / 1.4, lineHeight: size }" />

  <!-- 蛇身 -->
  <template v-for="p in snake">
    <Graphics :x="p[0] * size" :y="p[1] * size" :beginFill="[0]" :drawRect="[0, 0, size, size]" endFill />
  </template>

  <Text text="按空格 暂停/继续" :x="maxX * size * 0.45" :y="maxY * size * 0.8" style="fill: #cccccc80" />
  <Text v-if="!isActive" text="暂停中……" :x="maxX * size * 0.45" :y="maxY * size * 0.85" style="fill: #cccccc80" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useIntervalFn, useWindowSize } from '@vueuse/core'

type Point = [x: number, y: number]

// 网格数量
const num = 10
const { width, height } = useWindowSize()
const size = computed(() => Math.min(width.value, height.value) / num)
// 边界
const maxX = computed(() => (width.value / size.value) >> 0)
const maxY = computed(() => (height.value / size.value) >> 0)

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

// loop
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

// p1 == p2
function isSamePoint(p1: Point, p2: Point) {
  return p1[0] == p2[0] && p1[1] == p2[1]
}
// 是否越界
function isRange(p: Point) {
  return p[0] >= 0 && p[0] < maxX.value && p[1] >= 0 && p[1] < maxY.value
}
// 生成随机数
function random(max: number, min = 0) {
  return (min + Math.random() * (max - min)) >> 0
}
// 生成食物
function genFood() {
  let point!: Point
  do point = [random(maxX.value), random(maxY.value)]
  while (snake.value.some(e => isSamePoint(e, point)))
  return point
}
</script>
