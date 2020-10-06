import keyframer from './keyframer'

describe('keyframer', () => {
  it('is a function and returns a function', () => {
    expect(typeof keyframer).toEqual('function')
    expect(
      typeof keyframer([
        [0, 0],
        [1, 1],
      ]),
    ).toEqual('function')
  })

  it('to by default linearly interpolate between keyframes', () => {
    const p = keyframer([
      [0, 0],
      [1, 10],
      [3, 20],
      [5, -20],
    ])
    expect(p(-1)).toEqual(0)
    expect(p(0)).toEqual(0)
    expect(p(0.5)).toEqual(5)
    expect(p(1)).toEqual(10)
    expect(p(2)).toEqual(15)
    expect(p(3)).toEqual(20)
    expect(p(4)).toEqual(0)
    expect(p(5)).toEqual(-20)
    expect(p(6)).toEqual(-20)
  })

  it('should work with unsorted keyframes', () => {
    const p = keyframer([
      [5, -20],
      [0, 0],
      [3, 20],
      [1, 10],
    ])
    expect(p(-1)).toEqual(0)
    expect(p(0)).toEqual(0)
    expect(p(1)).toEqual(10)
    expect(p(2)).toEqual(15)
    expect(p(3)).toEqual(20)
    expect(p(4)).toEqual(0)
    expect(p(5)).toEqual(-20)
    expect(p(6)).toEqual(-20)
  })

  it('should not accept faulty keyframes', () => {
    expect(() => keyframer([])).toThrow('Invalid frames supplied')
    expect(() => keyframer('hej')).toThrow('Invalid frames supplied')
    expect(() => keyframer([['a', 'b']])).toThrow('Invalid frames supplied')
    expect(() =>
      keyframer([
        ['a', 'b'],
        [0, 1],
      ]),
    ).toThrow('Invalid frames supplied')
  })

  it('should not accept an invalid interpolator', () => {
    expect(() => keyframer([[0, 0]], 'hej')).toThrow('Invalid interpolator supplied')
    expect(() => keyframer([[0, 0]], (a, b) => a + b)).toThrow('Invalid interpolator supplied')
  })

  it('should handle a single keyframe', () => {
    const p = keyframer([[1337, 42]])
    expect(p(0)).toEqual(42)
    expect(p(1337)).toEqual(42)
    expect(p(42)).toEqual(42)
    expect(p(35425345)).toEqual(42)
  })
})
