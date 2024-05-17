import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import { ExtendedPencilBrush } from "../CustomPencilBrush";

const FabricCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [mode, setMode] = useState<string>("");
  const [isDown, setIsDown] = useState<boolean>(false);
  const [line, setLine] = useState<fabric.Line | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);

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
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push(json);
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (canvas && currentHistoryIndex > 0) {
      const newHistoryIndex = currentHistoryIndex - 1;
      const previousState = history[newHistoryIndex];
      canvas.loadFromJSON(previousState, () => {
        canvas.renderAll();
        setCurrentHistoryIndex(newHistoryIndex);
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
    const id = Date.now();
    const points = createPolygon(6, 50);
    const hex = new fabric.Polygon(points, {
      id,
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
    const id = Date.now();
    const rect = new fabric.Rect({
      id,
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
    const id = Date.now();
    const triangle = new fabric.Triangle({
      id,
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
      const brush = new ExtendedPencilBrush(canvas);
      brush.color = "black";
      brush.width = 3;
      brush.globalCompositeOperation = "source-over";
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

  useEffect(() => {
    if (canvas) {
      canvas.on("mouse:down", handleMouseDown);
      canvas.on("mouse:move", handleMouseMove);
      canvas.on("mouse:up", handleMouseUp);
      canvas.on("object:added", () => saveState(canvas));
      canvas.on("object:modified", () => saveState(canvas));
      canvas.on("object:removed", () => saveState(canvas));
    }

    return () => {
      if (canvas) {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMove);
        canvas.off("mouse:up", handleMouseUp);
        canvas.off("object:added", () => saveState(canvas));
        canvas.off("object:modified", () => saveState(canvas));
        canvas.off("object:removed", () => saveState(canvas));
      }
    };
  }, [canvas, mode, line]);

  return (
    <div>
      <button onClick={addHex}>Add Hexagon</button>
      <button onClick={addRect}>Add Rectangle</button>
      <button onClick={addTriangle}>Add Triangle</button>
      <button onClick={startDraw}>Start Drawing</button>
      <button onClick={startSelect}>Select</button>
      <button onClick={clearCanvas}>Clear Canvas</button>
      <button onClick={deleteSelectedObject}>Delete Selected Object</button>
      <button onClick={undo}>Undo</button>
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
