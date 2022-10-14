const numReg = /-?\d+([\.\,]\d+)?/gs

export function scale(str: string, k: number) {
  return str.replace(numReg, (match) => {
    const mult = +match.replace(",", ".") * k
    return String(mult)
  })
}
