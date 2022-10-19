import { parse } from "node-html-parser"

const numReg = /-?\d+([\.\,]\d+)?/gs

/**
 * pretty straightforward way. Just scales every number it finds
 * @param str input string that is expected to have numbers
 * @param k coefficient
 * @returns str but with all scaled numbers by a number of coefficient
 */
function repl(str: string, k: number) {
  return str.replace(numReg, (match) => {
    const mult = +match * k
    return String(mult)
  })
}

let ElementType:
  | SVGElement
  | SVGEllipseElement
  | SVGPathElement
  | SVGRectElement
  | SVGCircleElement
  | SVGLineElement
  | SVGPolylineElement
  | SVGPolygonElement
  | SVGTextElement
  | SVGImageElement

function mutate(node: typeof ElementType, c: number, attrs: string[]) {
  for (const attr of attrs) {
    const current = node.getAttribute(attr)
    if (current) {
      const scaled = repl(current, c)
      if (scaled) node.setAttribute(attr, scaled)
    }
  }
}

function AnimationProcessor(
  animation: SVGAnimateElement | SVGAnimateTransformElement,
  c: number
) {
  const animateAttribute = ["values", "from", "to", "by"]

  mutate(animation, c, animateAttribute)
}

function EllipseProcessor(ellipse: SVGEllipseElement, c: number) {
  const svgAttributes = ["cx", "cy", "rx", "ry"]

  mutate(ellipse, c, svgAttributes)
}
function PathProcessor(path: SVGPathElement, c: number) {
  const pathAttributes = ["d"]

  mutate(path, c, pathAttributes)
}
function RectProcessor(rect: SVGRectElement, c: number) {
  const rectAttributes = ["x", "y", "width", "height"]

  mutate(rect, c, rectAttributes)
}
function CircleProcessor(circle: SVGCircleElement, c: number) {
  const circleAttributes = ["cx", "cy", "r"]

  mutate(circle, c, circleAttributes)
}
function LineProcessor(line: SVGLineElement, c: number) {
  const lineAttributes = ["x1", "x2", "y1", "y2"]

  mutate(line, c, lineAttributes)
}
function PolyLineProcessor(polyline: SVGPolylineElement, c: number) {
  const polylineAttributes = ["points"]

  mutate(polyline, c, polylineAttributes)
}
function PolygonProcessor(polygon: SVGPolygonElement, c: number) {
  const polygonAttributes = ["points"]

  mutate(polygon, c, polygonAttributes)
}
function TextProcessor(text: SVGTextElement, c: number) {
  const textAttributes = ["x", "y", "fontSize"]

  mutate(text, c, textAttributes)
}
function ImageProcessor(image: SVGImageElement, c: number) {
  const imageAttributes = ["width", "height"]

  mutate(image, c, imageAttributes)
}

const processors = {
  rect: RectProcessor,
  path: PathProcessor,
  ellipse: EllipseProcessor,
  circle: CircleProcessor,
  line: LineProcessor,
  polyline: PolyLineProcessor,
  polygon: PolygonProcessor,
  text: TextProcessor,
  image: ImageProcessor,
  animate: AnimationProcessor,
  animateTransform: AnimationProcessor,
}

let Tag:
  | "path"
  | "rect"
  | "circle"
  | "ellipse"
  | "line"
  | "polyline"
  | "polygon"
  | "text"
  | "image"
  | "animate"
  | "animateTransform"

const tags: typeof Tag[] = [
  "path",
  "rect",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "text",
  "image",
  "animate",
  "animateTransform",
]

const traverse = (node: any, c: number) => {
  for (const tag of tags) {
    const matches = node.getElementsByTagName(tag)
    if (matches.length > 0) {
      for (const match of matches) processors[tag](match, c)
    }
  }
}

export function scale(str: string, c: number) {
  const root = parse(str)
  const svg = root.querySelector("svg")

  if (!svg) return
  const viewBox = svg.getAttribute("viewbox")
  if (viewBox) {
    const newViewBox = repl(viewBox, c)
    svg.setAttribute("viewbox", newViewBox)
  }

  traverse(svg, c)
  return root.innerHTML
}
