function range(start, stop, step = 1, inclusive = true) {
  return Array(Math.ceil((stop - start) / step) + (inclusive ? 1 : 0))
    .fill(start)
    .map((x, y) => x + y * step)
}

export default range
