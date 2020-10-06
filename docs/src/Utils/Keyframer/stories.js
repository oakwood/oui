import * as React from 'react'
import { keyframer, range } from '@oakwood/oui-utils'

export default {
  title: 'Utils/Keyframer',
  component: keyframer,
}

const UI = ({ widthP, colorP, ...args }) => {
  const [progress, setProgress] = React.useState(0)
  const handleChange = React.useCallback(
    (e) => {
      setProgress(e.target.value)
    },
    [setProgress],
  )
  const handleRef = React.useCallback(
    (canvas) => {
      if (canvas == null) {
        return
      }
      const ctx = canvas.getContext('2d')
      if (ctx == null) {
        return
      }
      const iRange = range(0, 100, 0.1, true)
      const widthFactor = ctx.canvas.width / 100
      const heightFactor = ctx.canvas.height / 100
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.strokeStyle = 'hotpink'
      ctx.beginPath()
      ctx.moveTo(0, widthP(0))
      for (let i = 0; i < iRange.length; i += 1) {
        ctx.lineTo(iRange[i] * widthFactor, ctx.canvas.height - widthP(iRange[i]) * heightFactor)
      }
      ctx.stroke()
      ctx.strokeStyle = 'deepskyblue'
      ctx.beginPath()
      ctx.moveTo(0, colorP(0))
      for (let i = 0; i < iRange.length; i += 1) {
        ctx.lineTo(
          iRange[i] * widthFactor,
          ctx.canvas.height - (colorP(iRange[i]) / 2.55) * heightFactor,
        )
      }
      ctx.stroke()
    },
    [widthP, colorP],
  )
  const background = `rgb(${colorP(progress).toFixed(2)}, ${colorP(progress).toFixed(2)}, ${colorP(
    progress,
  ).toFixed(2)})`
  return (
    <>
      <div>
        <input
          type="range"
          id="volume"
          name="volume"
          min="0"
          max="100"
          value={progress}
          step="0.1"
          onChange={handleChange}
          style={{ width: '100%' }}
        />
        <br />
        Progress: {progress}
        <br />
        Keyframe output:
        <br />
        Width: {widthP(progress).toFixed(2)}
        <br />
        Color: {background}
      </div>
      <div
        onChange={handleChange}
        style={{
          height: 50,
          background,
          width: `${widthP(progress)}%`,
        }}
      />
      <div style={{ position: 'relative', width: '100%', height: 50, top: 10 }}>
        <canvas ref={handleRef} style={{ width: '100%', height: 150 }} {...args} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${progress}%`,
            width: 1,
            height: 150,
            background: '#000',
          }}
        />
      </div>
    </>
  )
}

const Template = ({ widthKeyframes, colorKeyframes, ...args }) => {
  const widthP = React.useMemo(
    () =>
      keyframer(widthKeyframes.map((frame) => frame.split('|').map((i) => parseInt(i, 10) || 0))),
    [widthKeyframes],
  )
  const colorP = React.useMemo(
    () =>
      keyframer(colorKeyframes.map((frame) => frame.split('|').map((i) => parseInt(i, 10) || 0))),
    [colorKeyframes],
  )
  return <UI widthP={widthP} colorP={colorP} {...args} />
}

export const Default = Template.bind({})
Default.args = {
  widthKeyframes: ['0|0', '25|80', '75|100', '95|90', '100|0'],
  colorKeyframes: ['0|255', '10|0', '50|255', '75|150', '95|100', '100|255'],
  width: 750,
  height: 200,
}
