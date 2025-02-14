import {fabric} from 'fabric'
import { useCallback, useState, useMemo } from "react"
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize"
import { BuildEditorTypes, Editor, CIRCLE_OPTIONS, RECTANGLE_OPTIONS, FILL_COLOR, STROKE_WIDTH, STROKE_COLOR, EditorHookProps, STROKE_DASH_ARRAY, TEXT_OPTIONS, FONT_FAMILY, FONT_WEIGHT, FONT_SIZE } from '../types'
import { useCanvasEvents } from './use-canvas-events'
import { createFilter, isTextType, downloadFile, transformText } from '../utils'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
  } from "@/components/ui/context-menu"
import { ITextboxOptions } from 'fabric/fabric-impl'
import { useClipboard } from "./use-clipboard";
import { useHistory } from "./use-history";
import {useHotkeys} from './use-hotkeys'
import { JSON_KEYS } from '../types'
  

const buildEditor = ({
    useDelete,
    save,
    undo,
    redo,
    canUndo,
    canRedo,
    autoZoom,
    copy,
    paste,
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    setFillColor,
    setStrokeColor,
    setStrokeWidth,
    selectedObjects,
    strokeDashArray,
    setStrokeDashArray,
    fontFamily,
    setFontFamily,
}: BuildEditorTypes): Editor => {

    const generateSaveOptions = () => {
        const { width, height, left, top } = getworkspace() as fabric.Rect;
    
        return {
          name: "Image",
          format: "png",
          quality: 1,
          width,
          height,
          left,
          top,
        };
      };
    
      const savePng = () => {
        const options = generateSaveOptions();
    
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        const dataUrl = canvas.toDataURL(options);
    
        downloadFile(dataUrl, "png");
        autoZoom();
      };
    
      const saveSvg = () => {
        const options = generateSaveOptions();
    
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        const dataUrl = canvas.toDataURL(options);
    
        downloadFile(dataUrl, "svg");
        autoZoom();
      };
    
      const saveJpg = () => {
        const options = generateSaveOptions();
    
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        const dataUrl = canvas.toDataURL(options);
    
        downloadFile(dataUrl, "jpg");
        autoZoom();
      };
    
      const saveJson = async () => {
        const dataUrl = canvas.toJSON(JSON_KEYS);
    
        await transformText(dataUrl.objects);
        const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(dataUrl, null, "\t"),
        )}`;
        downloadFile(fileString, "json");
      };
    
      const loadJson = (json: string) => {
        const data = JSON.parse(json);
    
        canvas.loadFromJSON(data, () => {
          autoZoom();
        });
      };



    const getworkspace = () => {
        return canvas.getObjects().find((object) => object.name === 'clip')
    }

    const center = (object: fabric.Object) => {
        const workspace = getworkspace()
        const center = workspace!.getCenterPoint()

        if (!center) return

        // @ts-ignore
        canvas._centerObject(object, center)
        // canvas.centerObject(object) 
    }

    const addToCanvas = (object: fabric.Object) => {
        center(object)
        canvas.add(object)
        canvas.setActiveObject(object)
    }


    return {
        canUndo,
        canRedo,
        onUndo: () => undo(),
        onRedo: () => redo(),
        getWorkspace: () => getworkspace(),
        autoZoom: () => autoZoom(),

        zoomIn: () => {
            let zoomRatio = canvas.getZoom();
            zoomRatio += 0.05;
            const center = canvas.getCenter();
            canvas.zoomToPoint(
              new fabric.Point(center.left, center.top),
              zoomRatio > 1 ? 1 : zoomRatio
            );
          },
          zoomOut: () => {
            let zoomRatio = canvas.getZoom();
            zoomRatio -= 0.05;
            const center = canvas.getCenter();
            canvas.zoomToPoint(
              new fabric.Point(center.left, center.top),
              zoomRatio < 0.2 ? 0.2 : zoomRatio,
            );
          },

        changeSize: (value: { width: number; height: number }) => {
            const workspace = getworkspace();
      
            workspace?.set(value);
            autoZoom();
            save();
          },
          changeBackground: (value: string) => {
            const workspace = getworkspace();
            workspace?.set({ fill: value });
            canvas.renderAll();
            save();
          },

        enableDrawingMode: () => {
            canvas.discardActiveObject();
            canvas.renderAll();
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.width = strokeWidth;
            canvas.freeDrawingBrush.color = strokeColor;
          },
          disableDrawingMode: () => {
            canvas.isDrawingMode = false;
          },
        //   onUndo: () => undo(),
        //   onRedo: () => redo(),

        copy: () => copy(),
        paste: () => paste(),
        useDelete: () => useDelete(),

        getActiveImageFilters: () => { // this wont work at all
            const selectedObject = selectedObjects[0]

            if (!selectedObject) {
                return []
            }

            // @ts-ignore
            const value = selectedObject.get("filters") || []

            return value 
        },

        changeImageFilter: (value: string) => {
            canvas.getActiveObjects().forEach((object) => {
                if (object.type === 'image') {
                    const imageObject = object as fabric.Image
                     const effect = createFilter(value)

                     imageObject.filters = effect ? [effect] : []

                        imageObject.applyFilters()
                        canvas.renderAll()
                }
            })

            canvas.renderAll()
        }, 

        addImage: (value: string) => {
            fabric.Image.fromURL(value, (img) => {
                const workspace = getworkspace()
                img.scaleToWidth(workspace!.width || 0)
                img.scaleToHeight(workspace!.height || 0)
                addToCanvas(img)
        }, {
            crossOrigin: 'anonymous'
        }
        )},

        delete: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.remove(object)
                canvas.discardActiveObject()
                canvas.renderAll()
            })
        },

        // copy: () => {
        //     canvas.getActiveObjects().forEach((object) => {
        //         setCopiedObject(object)
        //         console.log(object)
        //     })
        // },

        // paste: () => {
        //     if (copiedObject) {
        //         const newObject = fabric.util.object.clone(copiedObject);
        //         addToCanvas(newObject);
        //         setCopiedObject(null)
        //         canvas.renderAll();
        //     }
        // },

        // duplicate: () => {
        //     canvas.getActiveObjects().forEach((object) => {
        //         const newObject = fabric.util.object.clone(object);
        //         addToCanvas(newObject);
        //     })
        //     canvas.renderAll();
        // },
        


        addText: (value, options) => {
            const object = new fabric.Textbox(value, {
                ...TEXT_OPTIONS,
                fill: fillColor,
                ...options
            })

            addToCanvas(object)
        },

        changeOpacity: (value: number) => {
            canvas.getActiveObjects().forEach((object) => {
                object.set({ opacity: value })
            })

            canvas.renderAll()
        },

        changeFontWeight: (value: number) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    // @ts-ignore
                    object.set({ fontWeight: value })
                }
            })

            canvas.renderAll()
        },
        changeFontSize: (value: number) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    // @ts-ignore
                    object.set({ fontSize: value })
                }
            })

            canvas.renderAll()
        },
        getActiveFontSize: () => {
            const selectedObject = selectedObjects[0]

            if (!selectedObject) {
                return FONT_SIZE
            }

            // @ts-ignore
            const value = selectedObject.get("fontSize") || FONT_SIZE
            return value
 
        },
        changeTextAlign: (value: ITextboxOptions["textAlign"]) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    // @ts-ignore
                    object.set({ textAlign: value })
                }
            })

            canvas.renderAll()
        },
        getActiveTextAlign: () => {
            const selectedObject = selectedObjects[0]

            if (!selectedObject) {
                return "left"
            }

            // @ts-ignore
            const value = selectedObject.get("textAlign") || "left"
            return value
 
        },
        changeFontUnderline: (value: boolean) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    // @ts-ignore
                    object.set({ underline: value })
                }
            })

            canvas.renderAll()
        },
        getActiveFontUnderline: () => {
            const selectedObject = selectedObjects[0]

            if (!selectedObject) {
                return false
            }

            // @ts-ignore
            const value = selectedObject.get("underline") || false
            return value
 
        },
        changeFontLinethrough: (value: boolean) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    // @ts-ignore
                    object.set({ linethrough: value })
                }
            })

            canvas.renderAll()
        },
        getActiveFontLinethrough: () => {
            const selectedObject = selectedObjects[0]

            if (!selectedObject) {
                return false
            }

            // @ts-ignore
            const value = selectedObject.get("linethrough") || false
            return value
 
        },
        changeFontStyle: (value: string) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    // @ts-ignore
                    object.set({ fontStyle: value })
                }
            })

            canvas.renderAll()
        },
        getActiveFontStyle: () => {
            const selectedObject = selectedObjects[0]

            if (!selectedObject) {
                return "normal"
            }

            // @ts-ignore
            const value = selectedObject.get("fontStyle") || "normal"
            return value
 
        },

        getActiveOpacity: () => {
            const selectedObject = selectedObjects[0]

            if (!selectedObject) {
                return 1
            }

            const value = selectedObject.get("opacity") || 1

            return value 
        },

        bringForward: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.bringForward(object)
            })

            canvas.renderAll()

            const workspace = getworkspace()
            workspace?.sendToBack()
        },
        sendBackwards: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.sendBackwards(object)
            })

            canvas.renderAll()
            const workspace = getworkspace()
            workspace?.sendToBack()
        },

        changeFontFamily: (value: string) => {
            setFontFamily(value)
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    // @ts-ignore
                    object.set({ fontFamily: value })
                }
            })

            canvas.renderAll()
        },

        changeFillColor: (value: string) => {
            setFillColor(value)
            canvas.getActiveObjects().forEach((object) => {
                object.set({ fill: value })
            })

            canvas.renderAll()
        },

        changeStrokeColor: (value: string) => {
            setStrokeColor(value)
            canvas.getActiveObjects().forEach((object) => {
                // Text types don't have stroke
                if (isTextType(object.type)) {
                    object.set({ fill: value })
                    return;
                }


                object.set({ stroke: value })
            })

            canvas.freeDrawingBrush.color = value;
            canvas.renderAll()
        },

        changeStrokeWidth: (value: number) => {
            setStrokeWidth(value)
            canvas.getActiveObjects().forEach((object) => {
                object.set({ strokeWidth: value })
            })

            canvas.freeDrawingBrush.width = value;

            canvas.renderAll()
        },

        changeStrokeDashArray: (value: number[]) => {
            setStrokeDashArray(value)
            canvas.getActiveObjects().forEach((object) => {
                object.set({ strokeDashArray: value })
            })

            canvas.renderAll()
        },


        addCircle: () => {
            const object = new fabric.Circle({
                ...CIRCLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth
            })

            addToCanvas(object)
        },

        addSoftRectangle: () => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
                rx: 50,
                ry: 50,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth
            })

            addToCanvas(object)
        },

        addSquare: () => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth
            })

            addToCanvas(object)
        },

        addTriangle: () => {
            const object = new fabric.Triangle({
                ...RECTANGLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth
            })

            addToCanvas(object)
        },
        addTriangleInverse: () => {
            const object = new fabric.Triangle({
                ...RECTANGLE_OPTIONS,
                angle: 180,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth
            })

            addToCanvas(object)
        },
        addDiamond: () => {
            const HEIGTH = 400
            const WIDTH = 400

            const object = new fabric.Polygon([
                { x: WIDTH / 2, y: 0 },
                { x: WIDTH, y: HEIGTH / 2 },
                { x: WIDTH / 2, y: HEIGTH },
                { x: 0, y: HEIGTH / 2 },
            ], {
                ...RECTANGLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth
            })

            addToCanvas(object)
        },

        canvas,
        getActiveFillColor: () => {
            const selectedObject = selectedObjects[0]

            if (!selectedObject) {
                return fillColor
            }

            const value = selectedObject.get("fill") || fillColor

            return value as string
 
        },
        getActiveFontWeight: () => {
            const selectedObject = selectedObjects[0]

            if (!selectedObject) {
                return FONT_WEIGHT
            }

            // @ts-ignore
            const value = selectedObject.get("fontWeight") || FONT_WEIGHT
            return value
 
        },
        getActiveFontFamily: () => {
            const selectedObject = selectedObjects[0]

            if (!selectedObject) {
                return fontFamily
            }

            // @ts-ignore
            const value = selectedObject.get("fontFamily") || fontFamily
            return value
 
        },
        getActiveStrokeColor: () => {
            const selectedObject = selectedObjects[0]

            if (!selectedObject) {
                return strokeColor
            }

            const value = selectedObject.get("stroke") || strokeColor

            return value 

        },
        getActiveStrokeWidth: () => {
            const selectedObject = selectedObjects[0]

            if (!selectedObject) {
                return strokeWidth
            }

            const value = selectedObject.get("strokeWidth") || strokeWidth

            return value 

        },
        getActiveStrokeDashArray: () => {
            const selectedObject = selectedObjects[0]

            if (!selectedObject) {
                return strokeDashArray 
            }

            const value = selectedObject.get("strokeDashArray") || strokeDashArray

            return value 

        },
        selectedObjects
    }
}

export const useEditor = ({
    clearSelectionCallback
}: EditorHookProps) => {

    const [canvas, setCanvas] = useState<fabric.Canvas | null >(null)
    const [container, setContainer] = useState<HTMLDivElement | null>(null)
    const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([])
    const [fontFamily, setFontFamily] = useState<string>(FONT_FAMILY)
    const [fillColor, setFillColor] = useState<string>(FILL_COLOR)
    const [strokeColor, setStrokeColor] = useState<string>(STROKE_COLOR)
    const [strokeWidth, setStrokeWidth] = useState<number>(STROKE_WIDTH)
    const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY)

    const { 
        save, 
        canRedo, 
        canUndo, 
        undo, 
        redo,
        canvasHistory,
        setHistoryIndex,
      } = useHistory({ 
        canvas,
        // saveCallback
      });
    

    const { copy, paste, useDelete } = useClipboard({ canvas });


    const {autoZoom} = useAutoResize({
        canvas,
        container
    })

    useCanvasEvents({
        save,
        canvas,
        setSelectedObjects,
        clearSelectionCallback
    })

    useHotkeys({
        canvas,
        undo,
        redo,
        save,
        copy,
        paste,
        useDelete
    })

    const editor = useMemo(() => {
        if (canvas) {
            return buildEditor({
                useDelete,
                save,
                undo,
                redo,
                canUndo,
                canRedo,
                autoZoom,
                copy,
                paste,
                fontFamily,
                setFontFamily,
                canvas,
                fillColor,
                strokeColor,
                strokeWidth,
                strokeDashArray,
                setStrokeDashArray,
                setFillColor,
                setStrokeColor,
                setStrokeWidth,
                selectedObjects,
            })
        }

        return undefined
    } , [autoZoom, canvas, fillColor, strokeColor, strokeWidth, selectedObjects, strokeDashArray, fontFamily, save,
        undo,
        redo,
        canUndo,
        canRedo,])

    
    const init = useCallback(({
        initialCanvas,
        initialContainer
    }: {
        initialCanvas: fabric.Canvas,
        initialContainer: HTMLDivElement,
    }) => {

        fabric.Object.prototype.set({
            transparentCorners: false,
            cornerColor: '#fff',
            cornerStyle: 'circle',
            borderColor: "#000",
            borderScaleFactor: 1.5,
            borderOpacityWhenMoving: 1,
            cornerStrokeColor: "#000",
        })

        const initialWorkspace=  new fabric.Rect({
            width:  900,
            height: 1200,
            fill: 'white',
            name: 'clip',
            selectable: false,
            hasControls: false,
            shadow: new fabric.Shadow({
                color: 'rgba(0,0,0,0.8)',
                blur: 5,
            }),
        })


        initialCanvas.setWidth(initialContainer!.offsetWidth)
        initialCanvas.setHeight(initialContainer!.offsetHeight)

        initialCanvas.add(initialWorkspace)
        initialCanvas.centerObject(initialWorkspace)
        initialCanvas.clipPath = initialWorkspace
        setCanvas(initialCanvas)
        setContainer(initialContainer)

        const currentState = JSON.stringify(
            initialCanvas.toJSON(JSON_KEYS)
          );
          canvasHistory.current = [currentState];
          setHistoryIndex(0);


    }, [
        canvasHistory, // No need, this is from useRef
        setHistoryIndex, // No need, this is from useState
    ])

    return {init, editor}
    
}