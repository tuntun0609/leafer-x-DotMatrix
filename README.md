# leafer-x-dot-matrix

点阵背景插件，为 Leafer 应用提供可自定义的点阵背景。

![demo](https://github.com/tuntun0609/leafer-x-dot-matrix/blob/master/images/demo.png)



## 安装

```bash
npm install leafer-x-dot-matrix
```



## 类型定义

```typescript
interface IDotMatrixConfig {
  dotSize?: number;            // 点的大小
  dotColor?: string;           // 点的颜色
  dotMatrixGapMap?: number[];  // 点阵间距可选值
  targetDotMatrixPixel?: number; // 期望点阵间距（像素）
}
```



## 基础使用

```typescript
import { App } from '@leafer-ui/core'
import { DotMatrix } from 'leafer-x-dot-matrix'

const app = new App({
  view: window
})

// 创建点阵实例
const dotMatrix = new DotMatrix(app)

// 启用点阵显示
dotMatrix.enableDotMatrix(true)
```



## API 文档

### 构造函数

```typescript
constructor(app: App, config?: IDotMatrixConfig)
```

#### 参数

- `app`: Leafer App 实例
- `config`: 可选的配置项



#### 配置项

| 属性                   | 类型     | 默认值                 | 说明               |
| ---------------------- | -------- | ---------------------- | ------------------ |
| `dotSize`              | number   | 1.5                    | 点的大小（像素）   |
| `dotColor`             | string   | '#D2D4D7'              | 点的颜色           |
| `dotMatrixGapMap`      | number[] | [10, 25, 50, 100, 200] | 点阵间距的可选值   |
| `targetDotMatrixPixel` | number   | 50                     | 期望的点阵显示间距 |



### 实例属性

```typescript
// 所有属性都支持动态修改，样式属性修改后调用dotMatrixRef.renderDotMatrix()来重新渲染点阵
dotMatrix.enable: boolean            // 是否启用点阵
dotMatrix.dotSize: number           // 点的大小
dotMatrix.dotColor: string          // 点的颜色
dotMatrix.dotMatrixGapMap: number[] // 点阵间距可选值
dotMatrix.targetDotMatrixPixel: number // 目标点阵间距
```



### 实例方法

#### enableDotMatrix(enable: boolean)

控制点阵的显示/隐藏

```typescript
// 显示点阵
dotMatrix.enableDotMatrix(true)

// 隐藏点阵
dotMatrix.enableDotMatrix(false)
```

#### renderDotMatrix()

手动触发点阵重绘（通常不需要手动调用，如动态更改点阵样式属性时，需手动调用触发渲染）

```typescript
dotMatrix.renderDotMatrix()
```



## 使用示例

```typescript
// 创建带配置的实例
const dotMatrix = new DotMatrix(app, {
  dotSize: 2,
})

// 启用点阵
dotMatrix.enableDotMatrix(true)

// 动态修改样式
dotMatrix.dotSize = 3
dotMatrix.dotColor = '#FF0000'
// 手动重新渲染
dotMatrix.renderDotMatrix()
```



## 注意事项

1. 插件会扩展 App 类型，添加 `dotMatrix: Leafer` 属性
2. 必须传入有效的 Leafer App 实例
3. 点阵默认是禁用的，需要调用 `enableDotMatrix(true)` 来启用
4. 点阵会自动添加到 App 的 `tree` 层的下层，保证不会影响内容展示
