import { useEffect, useRef } from 'react'
import { App as LeaferApp, Rect } from 'leafer-editor'
import './App.css'
import { DotMatrix } from 'leafer-x-dot-matrix'

const App = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null)

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

    dotMatrix.enableDotMatrix(true)

    return () => {
      app.destroy()
    }
  }, [])

  return (
    <div className="content" style={{ width: '100vw', height: '100vh' }}>
      <div style={{ width: '100%', height: '100%' }} ref={canvasContainerRef}></div>
    </div>
  )
}

export default App
