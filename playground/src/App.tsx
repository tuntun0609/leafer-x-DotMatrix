import { useEffect, useRef, useState } from 'react'
import { App as LeaferApp, Rect } from 'leafer-editor'
import { DotMatrix } from 'leafer-x-dot-matrix'

import styles from './App.module.css'
import './App.css'
import { Button, ColorPicker } from 'antd'

const App = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const dotMatrixRef = useRef<DotMatrix | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [dotColor, setDotColor] = useState('#D2D4D7')

  useEffect(() => {
    if (!canvasContainerRef.current) {
      return
    }

    const app = new LeaferApp({
      view: canvasContainerRef.current,
      editor: {}, // 会自动创建 editor实例、tree层、sky层
    })

    app.tree.add(
      Rect.one({ editable: true, fill: '#FEB027', cornerRadius: [20, 0, 0, 20] }, 100, 100)
    )
    app.tree.add(
      Rect.one({ editable: true, fill: '#FFE04B', cornerRadius: [0, 20, 20, 0] }, 300, 100)
    )

    const dotMatrix = new DotMatrix(app)
    dotMatrixRef.current = dotMatrix
    dotMatrix.enableDotMatrix(true)
    setEnabled(true)

    return () => {
      app.destroy()
    }
  }, [])

  useEffect(() => {
    if (dotMatrixRef.current) {
      dotMatrixRef.current.enableDotMatrix(enabled)
    }
  }, [enabled])

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <Button onClick={() => {
          setEnabled(!enabled)
        }}>
          {enabled ? '关闭' : '启用'}
        </Button>
        <ColorPicker value={dotColor} onChangeComplete={color => {
          const hexColor = color.toHexString()
          setDotColor(hexColor)
          if (dotMatrixRef.current) {
            dotMatrixRef.current.dotColor = hexColor
            dotMatrixRef.current.renderDotMatrix()
          }
        }} />
      </div>
      <div className={styles.canvasContainer} ref={canvasContainerRef}></div>
    </div>
  )
}

export default App
