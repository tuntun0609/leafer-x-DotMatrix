import { App, LayoutEvent, Leafer, ResizeEvent } from '@leafer-ui/core'
import { ICanvasContext2D } from 'leafer-ui'

declare module '@leafer-ui/core' {
  interface App {
    dotMatrix: Leafer
  }
}

const isNil = (value: any): boolean => value === null || value === undefined

interface IDotMatrixConfig {
  dotSize?: number
  dotColor?: string
  dotMatrixGapMap?: number[]
  // 期望的点阵在页面展示时间隔的像素
  targetDotMatrixPixel?: number
}

export class DotMatrix {
  private app: App
  private dotMatrixLeafer: Leafer

  public enable = true
  public dotSize = 1.5
  public dotColor = '#D2D4D7'
  public dotMatrixGapMap: number[] = [10, 25, 50, 100, 200]
  public targetDotMatrixPixel = 50

  constructor(app: App, config?: IDotMatrixConfig) {
    if (!app.isApp) {
      throw new Error('target must be an App')
    }
    this.app = app

    if (!isNil(config)) {
      this.dotSize = config.dotSize || this.dotSize
      this.dotColor = config.dotColor || this.dotColor
      this.dotMatrixGapMap = config.dotMatrixGapMap || this.dotMatrixGapMap
      this.targetDotMatrixPixel = config.targetDotMatrixPixel || this.targetDotMatrixPixel
    }

    this.dotMatrixLeafer = new Leafer({
      hittable: false,
    })

    app.dotMatrix = this.dotMatrixLeafer

    // 添加到 tree 之前
    app.addBefore(this.dotMatrixLeafer, this.app.tree)

    // 兼容监听事件
    this.renderDotMatrix = this.renderDotMatrix.bind(this)
  }

  public renderDotMatrix() {
    // 设置画布的矩阵信息（默认会带上屏幕像素比），用于解决屏幕像素比的问题
    this.dotMatrixLeafer.canvas.setWorld({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })

    const ctx = this.dotMatrixLeafer.canvas.context

    // tree层世界坐标信息
    const { worldTransform } = this.app.tree
    const vpt = [
      worldTransform.a,
      worldTransform.b,
      worldTransform.c,
      worldTransform.d,
      worldTransform.e,
      worldTransform.f,
    ]

    const scale = this.getScaleX()

    const pageX = -(vpt[4] / vpt[0])
    const pageY = -(vpt[5] / vpt[3])
    const pageWidth = this.app.zoomLayer.width / scale
    const pageHeight = this.app.zoomLayer.height / scale

    // 点阵间隔
    const dotGap = this.getDotGap()

    // 计算起始点和结束点
    const startX = Math.floor(pageX / dotGap) * dotGap
    const startY = Math.floor(pageY / dotGap) * dotGap
    const endX = Math.ceil((pageX + pageWidth) / dotGap) * dotGap
    const endY = Math.ceil((pageY + pageHeight) / dotGap) * dotGap

    // 清除之前的绘制内容
    ctx.clearRect(0, 0, this.app.zoomLayer.width, this.app.zoomLayer.height)

    // 设置点的样式
    ctx.fillStyle = this.dotColor

    for (let x = startX; x <= endX; x += dotGap) {
      for (let y = startY; y <= endY; y += dotGap) {
        const relativeX = x - pageX
        const relativeY = y - pageY
        const worldX = relativeX * scale
        const worldY = relativeY * scale

        this.drawPoint(ctx, worldX, worldY, this.dotSize)
      }
    }
  }

  private getDotGap() {
    const scale = this.getScaleX()

    const targetValue = this.targetDotMatrixPixel
    return this.dotMatrixGapMap.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev * scale - targetValue)
      const currDiff = Math.abs(curr * scale - targetValue)
      return prevDiff < currDiff ? prev : curr
    })
  }

  /**
   * 获取X轴缩放比例
   */
  private getScaleX() {
    const scale = this.app.zoomLayer.scaleX
    if (!scale) {
      return 1
    }
    return scale
  }

  private drawPoint(ctx: ICanvasContext2D, x: number, y: number, dotSize: number) {
    ctx.beginPath()
    ctx.arc(x, y, dotSize, 0, Math.PI * 2)
    ctx.fill()
  }

  public enableDotMatrix(enable: boolean) {
    this.enable = enable
    if (enable) {
      this.app.tree.on(LayoutEvent.AFTER, this.renderDotMatrix)
      this.app.tree.on(ResizeEvent.RESIZE, this.renderDotMatrix)
      setTimeout(() => {
        this.renderDotMatrix()
      }, 100)
    } else {
      this.app.tree.off(LayoutEvent.AFTER, this.renderDotMatrix)
      this.app.tree.off(ResizeEvent.RESIZE, this.renderDotMatrix)
      this.dotMatrixLeafer.forceRender()
    }
  }
}
