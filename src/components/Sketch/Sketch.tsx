import { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";

export default function Sketch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [mode, setMode] = useState<string>("");
  const [isDown, setIsDown] = useState<boolean>(false);
  const [line, setLine] = useState<fabric.Line | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvasInstance = new fabric.Canvas(canvasRef.current, {
        backgroundColor: "white",
      });
      setCanvas(canvasInstance);

      canvasInstance.perPixelTargetFind = true;
      canvasInstance.targetFindTolerance = 4;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Delete") {
          const activeObject = canvasInstance.getActiveObject();
          if (activeObject) {
            canvasInstance.remove(activeObject);
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

  const addShape = (shape: fabric.Object) => {
    if (canvas) {
      canvas.add(shape);
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
      if (mode !== "pencil") {
        setMode("pencil");
        canvas.isDrawingMode = true;
        const brush = new fabric.ExtendedPencilBrush(canvas);
        brush.color = "black";
        brush.width = 3;
        brush.globalCompositeOperation = "source-over";
        canvas.freeDrawingBrush = brush;
        canvas.renderAll();
      } else {
        setMode("select");
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.renderAll();
      }
    }
  };

  const clearCanvas = () => {
    canvas?.clear();
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
      }
    }
  };

  useEffect(() => {
    if (canvas) {
      canvas.on("mouse:down", handleMouseDown);
      canvas.on("mouse:move", handleMouseMove);
      canvas.on("mouse:up", handleMouseUp);
    }

    return () => {
      if (canvas) {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMove);
        canvas.off("mouse:up", handleMouseUp);
      }
    };
  }, [canvas, mode, line]);

  return (
    <div>
      <button onClick={addHex}>Add Hexagon</button>
      <button onClick={addRect}>Add Rectangle</button>
      <button onClick={addTriangle}>Add Triangle</button>
      <button onClick={startDraw}>Start Drawing</button>
      <button onClick={clearCanvas}>Clear Canvas</button>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid #ccc" }}
      />
    </div>
  );
}
