import fs from "fs"
import { scale } from "./scale"

export function fileSizer(inputPath: string, outputPath: string, c: number) {
  try {
    if (!!!Number(c))
      throw Error("Значение коэффициента должно быть числовым...")
    if (!fs.existsSync(inputPath))
      throw Error("Не удалось найти файл по переданному пути...")

    const content = fs.readFileSync(inputPath, "utf8")
    const scaledContent = scale(content, c)

    fs.writeFile(outputPath, scaledContent, (e) => {
      if (e)
        throw Error("Не получилось записать полученные данные в output файл...")
    })
  } catch (e) {
    console.log((e as Error).message)
  }
}
