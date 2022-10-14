// if no output name => outputName = input name + (scaled)
export function constructOutputPath(input: string) {
  const file = input.replace(/^.*[\\\/]/, "")
  const separator = "."
  const splitted = file.split(separator)
  const fileExt = splitted[splitted.length - 1]
  const fileName = splitted.filter((s: string) => s !== fileExt).join(separator)

  return `${fileName}_(scaled).${fileExt}`
}
