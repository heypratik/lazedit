import exp from "constants";
import { fabric } from "fabric";
import { ITextboxOptions } from "fabric/fabric-impl";
import * as material from "material-colors";

export const filters = [
  "poloaroid",
  "vintage",
  "luminosity",
  "sepia",
  "grayscale",
  "blacknwhite",
  "invert",
  "brownie",
  "kodachrome",
  "contrast",
  "brightness",
  "technicolor",
  "pixalate",
  "blur",
  "sharpen",
  "emboss",
  "removecolor",
  "vibrance",
   "huerotate",
  "resize",
  "gamma"
]

export const fonts = [
  "Arial",
  "Arial Black",
  "Helvetica",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT",
  "Palatino",
  "Bookman",
  "Comic Sans MS",
  "Impact",
  "Lucida Sans Unicode",
  "Lucida Console",
  "Geneva",
  "Verdana",
]

export const colors = [
  material.red["500"],
  material.pink["500"],
  material.purple["500"],
  material.deepPurple["500"],
  material.indigo["500"],
  material.blue["500"],
  material.lightBlue["500"],
  material.cyan["500"],
  material.teal["500"],
  material.green["500"],
  material.lightGreen["500"],
  material.lime["500"],
  material.yellow["500"],
  material.amber["500"],
  material.orange["500"],
  material.deepOrange["500"],
  material.brown["500"],
  material.grey["500"],
  material.blueGrey["500"],  
  "transparent",
]

export type ActiveTool =
  | "select"
  | "shapes"
  | "text"
  | "images"
  | "draw"
  | "fill"
  | "stroke-color"
  | "stroke-width"
  | "font"
  | "opacity"
  | "filter"
  | "settings"
  | "ai"
  | "remove-bg"
  | "templates";

export const FILL_COLOR = "rgba(0,0,0,1)";
export const STROKE_COLOR = "rgba(0,0,0, 1)";
export const STROKE_WIDTH = 2;
export const STROKE_DASH_ARRAY = []
export const FONT_FAMILY = "Arial";
export const FONT_SIZE = 40;
export const FONT_WEIGHT = 400;

export const selectionDependentTools = ["fill", "font", "filter", "opacity", "remove-bg", "stroke-color", "stroke-width"];

export const JSON_KEYS = [
  "name",
  "gradientAngle",
  "selectable",
  "hasControls",
  "linkData",
  "editable",
  "extensionType",
  "extension"
];

export const CIRCLE_OPTIONS = {
  radius: 150,
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
}

export const RECTANGLE_OPTIONS = {
  width: 400,
  height: 400,
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  angle: 0
}

export const Triangle_OPTIONS = {
  width: 400,
  height: 400,
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  angle: 0
}

export const TEXT_OPTIONS = {
  type:"textbox",
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  fontSize: FONT_SIZE,
  fontFamily: FONT_FAMILY,

}

export interface EditorHookProps {
  defaultState?: string,
  defaultHeight?: number,
  defaultWidth?: number,
  clearSelectionCallback?: () => void;
  saveCallback?: (values: {
    json: string,
    height: number,
    width: number,
  }) => void;
}

export type BuildEditorTypes = {
  save  : (skip?: boolean) => void;
  undo : () => void;
  redo : () => void;
  canUndo : () => boolean;
  canRedo : () => boolean;
  autoZoom: () => void;
  useDelete: () => void;
  copy: () => void;
  paste: () => void;
  canvas: fabric.Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  fontFamily: string;
  strokeDashArray: number[];
  selectedObjects: fabric.Object[];
  setFillColor: (value: string) => void;
  setStrokeColor: (value: string) => void;
  setStrokeWidth: (value: number) => void;
  setStrokeDashArray: (value: number[]) => void; 
  setFontFamily: (value: string) => void;
}

export interface Editor {
  savePng: () => void;
  saveSvg: () => void;
  saveJson: () => void;
  saveJpg: () => void;
  loadJson: (value: string) => void;
  useDelete: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  onUndo: () => void;
  onRedo: () => void;
  getWorkspace: () => fabric.Object | undefined;
  zoomIn: () => void;
  zoomOut: () => void;
  autoZoom: () => void;
  changeSize: (value: { width: number; height: number }) => void;
  changeBackground: (value: string) => void;
  enableDrawingMode: () => void;
  disableDrawingMode: () => void;
  copy: () => void;
  paste: () => void;
  getActiveImageFilters: () => string[];
  changeImageFilter: (value: string) => void;
  addImage: (value: string) => void;
  delete: () => void;
  changeFontSize: (value: number) => void;
  getActiveFontSize: () => number;
  changeTextAlign: (value: string) => void;
  getActiveTextAlign: () => string;
  changeFontUnderline: (value: boolean) => void;
  getActiveFontUnderline: () => boolean;
  getActiveFontLinethrough: () => boolean;
  changeFontLinethrough: (vale: boolean) => void;
  getActiveFontStyle: () => string;
  changeFontStyle: (value: string) => void;
  changeFontWeight: (value: number) => void;
  getActiveFontWeight: () => number;
  getActiveFontFamily: () => string;
  changeFontFamily: (value: string) => void;
  addText: (value: string, options?: ITextboxOptions) => void;
  changeOpacity: (value: number) => void;
  getActiveOpacity: () => number;
  bringForward: () => void;
  sendBackwards: () => void;
  addCircle: () => void;
  addSoftRectangle: () => void;
  addSquare: () => void;
  addTriangle: () => void;
  addTriangleInverse: () => void;
  addDiamond: () => void;
  changeFillColor: (value: string) => void;
  changeStrokeColor: (value: string) => void;
  changeStrokeWidth: (value: number) => void;
  changeStrokeDashArray: (value: number[]) => void;
  getActiveFillColor: () => string;
  getActiveStrokeColor: () => string;
  getActiveStrokeWidth: () => number; 
  getActiveStrokeDashArray: () => number[];
  canvas: fabric.Canvas;
  selectedObjects: fabric.Object[];
}