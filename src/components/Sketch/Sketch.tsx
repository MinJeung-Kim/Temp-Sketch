import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";

const FabricCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [mode, setMode] = useState<string>("");
  const [isDown, setIsDown] = useState<boolean>(false);
  const [line, setLine] = useState<fabric.Line | null>(null);
  const [undoHistory, setUndoHistory] = useState<string[]>([]);
  const [redoHistory, setRedoHistory] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputStyle, setInputStyle] = useState<React.CSSProperties>({});
  const [inputPosition, setInputPosition] = useState<{
    left: number;
    top: number;
  }>({ left: 0, top: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvasElement = canvasRef.current;
      const context = canvasElement.getContext("2d", {
        willReadFrequently: true,
      });
      if (!context) {
        console.error("2D context not available");
        return;
      }

      const canvasInstance = new fabric.Canvas(canvasElement, {
        backgroundColor: "white",
      });
      setCanvas(canvasInstance);

      // Save the initial empty state
      saveState(canvasInstance);

      canvasInstance.perPixelTargetFind = true;
      canvasInstance.targetFindTolerance = 4;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Delete") {
          const activeObject = canvasInstance.getActiveObject();
          if (activeObject) {
            canvasInstance.remove(activeObject);
            saveState(canvasInstance);
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        canvasInstance.dispose();
      };
    }
  }, []);

  const saveState = (canvasInstance: fabric.Canvas) => {
    const json = JSON.stringify(canvasInstance.toJSON());
    const newUndoHistory = [...undoHistory, json];
    setUndoHistory(newUndoHistory);
    setRedoHistory([]); // Clear redo history when a new state is saved
  };

  const undo = () => {
    if (canvas && undoHistory.length > 1) {
      const newRedoHistory = [undoHistory.pop()!, ...redoHistory];
      setRedoHistory(newRedoHistory);
      const previousState = undoHistory[undoHistory.length - 1];
      canvas.loadFromJSON(previousState, () => {
        canvas.renderAll();
        setUndoHistory([...undoHistory]);
      });
    }
  };

  const redo = () => {
    if (canvas && redoHistory.length > 0) {
      const nextState = redoHistory.shift()!;
      setUndoHistory([...undoHistory, nextState]);
      setRedoHistory(redoHistory);
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
      });
    }
  };

  const addShape = (shape: fabric.Object) => {
    if (canvas) {
      canvas.add(shape);
      saveState(canvas);
    }
  };

  const createPolygon = (sideCount: number, radius: number) => {
    const sweep = (Math.PI * 2) / sideCount;
    const points = [];
    for (let i = 0; i < sideCount; i++) {
      points.push({
        x: radius + radius * Math.cos(i * sweep),
        y: radius + radius * Math.sin(i * sweep),
      });
    }
    return points;
  };

  const addHex = () => {
    const points = createPolygon(6, 50);
    const hex = new fabric.Polygon(points, {
      left: canvas!.width! / 2,
      top: canvas!.height! / 2,
      fill: "rgba(0,0,0,0)",
      stroke: "black",
      strokeWidth: 3,
      originX: "center",
      originY: "center",
    } as fabric.Polygon);
    addShape(hex);
  };

  const addRect = () => {
    const rect = new fabric.Rect({
      left: canvas!.width! / 2,
      top: canvas!.height! / 2,
      fill: "rgba(0,0,0,0)",
      stroke: "black",
      width: 50,
      height: 50,
      originX: "center",
      originY: "center",
      strokeWidth: 3,
    } as fabric.Rect);
    addShape(rect);
  };

  const addTriangle = () => {
    const triangle = new fabric.Triangle({
      left: canvas!.width! / 2,
      top: canvas!.height! / 2,
      fill: "rgba(0,0,0,0)",
      stroke: "black",
      width: 44,
      height: 44,
      originX: "center",
      originY: "center",
      strokeWidth: 3,
    } as fabric.Triangle);
    addShape(triangle);
  };

  const startDraw = () => {
    if (canvas) {
      setMode("pencil");
      const brush = new fabric.PencilBrush(canvas);
      brush.color = "black";
      brush.width = 3;
      canvas.freeDrawingBrush = brush;
      canvas.isDrawingMode = true;
      canvas.renderAll();
    }
  };

  const startSelect = () => {
    if (canvas) {
      setMode("select");
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.renderAll();
    }
  };

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      saveState(canvas);
    }
  };

  const deleteSelectedObject = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
        saveState(canvas);
      }
    }
  };

  const handleCanvasClick = (event: fabric.IEvent) => {
    if (mode === "text" && canvas) {
      const pointer = canvas.getPointer(event.e);
      setInputStyle({
        left: pointer.x,
        top: pointer.y,
        position: "absolute",
        border: "1px solid #000",
        background: "transparent",
        color: "#000",
        fontSize: "20px",
        outline: "none",
        zIndex: 1,
      });
      setInputPosition({ left: pointer.x, top: pointer.y });
      setInputVisible(true);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleInputBlur = () => {
    if (canvas && inputRef.current) {
      const value = inputRef.current.value;
      if (value) {
        const text = new fabric.IText(value, {
          left: inputPosition.left,
          top: inputPosition.top,
          fontFamily: "Arial",
          fontSize: 20,
          fill: "#000",
          originX: "left",
          originY: "top",
        });
        canvas.add(text);
        saveState(canvas);
      }
      setInputVisible(false);
      inputRef.current.value = "";
    }
  };

  const handleMouseDown = (o: fabric.IEvent) => {
    if (canvas) {
      setIsDown(true);
      const pointer = canvas.getPointer(o.e);
      const points = [pointer.x, pointer.y, pointer.x, pointer.y];

      if (mode === "draw") {
        const newLine = new fabric.Line(points, {
          strokeWidth: 1,
          fill: "black",
          stroke: "black",
          originX: "center",
          originY: "center",
        });
        canvas.add(newLine);
        setLine(newLine);
        saveState(canvas); // Save state after starting a new line
      }
    }
  };

  const handleMouseMove = (o: fabric.IEvent) => {
    if (canvas && isDown) {
      const pointer = canvas.getPointer(o.e);

      if (mode === "draw" && line) {
        line.set({ x2: pointer.x, y2: pointer.y });
        canvas.renderAll();
      }
    }
  };

  const handleMouseUp = () => {
    if (canvas) {
      setIsDown(false);
      if (line) {
        line.setCoords();
        saveState(canvas); // Save state after completing the line
      }
    }
  };

  const setBackgroundImage = (file: File) => {
    if (canvas) {
      const reader = new FileReader();
      reader.onload = (e) => {
        fabric.Image.fromURL(e.target?.result as string, (img) => {
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width! / img.width!,
            scaleY: canvas.height! / img.height!,
          });
          saveState(canvas);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setBackgroundImage(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (canvas) {
      canvas.on("mouse:down", handleCanvasClick);
      canvas.on("mouse:down", handleMouseDown);
      canvas.on("mouse:move", handleMouseMove);
      canvas.on("mouse:up", handleMouseUp);
      canvas.on("object:added", () => saveState(canvas));
      canvas.on("object:modified", () => saveState(canvas));
      canvas.on("object:removed", () => saveState(canvas));
    }
  }, [canvas, mode, line]);

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        ref={inputRef}
        style={{ ...inputStyle, display: inputVisible ? "block" : "none" }}
        onBlur={handleInputBlur}
      />
      <button onClick={() => setMode("text")}>Add Text</button>
      <button onClick={addHex}>Add Hexagon</button>
      <button onClick={addRect}>Add Rectangle</button>
      <button onClick={addTriangle}>Add Triangle</button>
      <button onClick={startDraw}>Start Drawing</button>
      <button onClick={startSelect}>Select</button>
      <button onClick={clearCanvas}>Clear Canvas</button>
      <button onClick={deleteSelectedObject}>Delete Selected Object</button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
      <button onClick={clearCanvas}>Clear Canvas</button>
      <button onClick={() => fileInputRef.current?.click()}>
        Set Background Image
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid #ccc" }}
      />
    </div>
  );
};

export default FabricCanvas;
