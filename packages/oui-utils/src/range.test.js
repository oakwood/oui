import range from './range'

describe('range', () => {
  it('is a function and returns an array', () => {
    expect(typeof range).toEqual('function')
    expect(Array.isArray(range(1, 10))).toEqual(true)
  })

  it('returns stepped arrays', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4, 5])
    expect(range(1, 3, 2)).toEqual([1, 3])
    expect(range(5, 1, -2)).toEqual([5, 3, 1])
  })

  it('can return decimal-stepped arrays', () => {
    expect(range(0, 1, 0.25)).toEqual([0, 0.25, 0.5, 0.75, 1])
  })

  it('can return a non-inclusive array', () => {
    expect(range(0, 3, 1, false)).toEqual([0, 1, 2])
  })
})
