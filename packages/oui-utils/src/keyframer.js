import lerp from './lerp'

export default function keyframer(framesInput, interpolator = lerp) {
  if (
    !Array.isArray(framesInput) ||
    framesInput.length < 1 ||
    framesInput.some((frame) => !Array.isArray(frame) || frame.some((i) => !Number.isFinite(i)))
  ) {
    throw new Error('Invalid frames supplied')
  }
  if (typeof interpolator !== 'function' || interpolator.length !== 3) {
    throw new Error('Invalid interpolator supplied')
  }
  const sorted = framesInput.slice(0).sort((a, b) => a[0] - b[0])
  const [min, startValue] = sorted[0]
  const [max, endValue] = sorted[sorted.length - 1]
  return (p) => {
    if (p <= min) {
      return startValue
    }
    if (p >= max) {
      return endValue
    }
    let i = 0
    while (p > sorted[i][0]) {
      i += 1
    }
    const [inMin, outMin] = sorted[i - 1]
    const [inMax, outMax] = sorted[i]
    return interpolator(outMin, outMax, (p - inMin) / (inMax - inMin))
  }
}
