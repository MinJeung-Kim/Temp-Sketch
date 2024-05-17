import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import Pen from "../Pen";
import Undo from "../Undo";
import Redo from "../Redo";
import Text from "../Text";
import Reset from "../Reset";
import Delete from "../Delete";
import Select from "../Select";
import AddImage from "../AddImage";
import AddBackground from "../AddBackground";
import { useCanvas } from "@src/context/CanvasContext";

const FabricCanvas: React.FC = () => {
  const { saveState, canvas, mode } = useCanvas();
  const [isDown, setIsDown] = useState<boolean>(false);
  const [line, setLine] = useState<fabric.Line | null>(null);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputStyle, setInputStyle] = useState<React.CSSProperties>({});
  const [inputPosition, setInputPosition] = useState<{
    left: number;
    top: number;
  }>({ left: 0, top: 0 });
  const [showShapeMenu, setShowShapeMenu] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    setShowShapeMenu(false); // 메뉴 닫기
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
    setShowShapeMenu(false); // 메뉴 닫기
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
    setShowShapeMenu(false); // 메뉴 닫기
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
      <button onClick={() => setShowShapeMenu(!showShapeMenu)}>
        Add Shape
      </button>
      {showShapeMenu && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "10px",
            background: "white",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <button onClick={addHex}>Add Hexagon</button>
          <button onClick={addRect}>Add Rectangle</button>
          <button onClick={addTriangle}>Add Triangle</button>
        </div>
      )}
      <Text
        inputRef={inputRef}
        inputPosition={inputPosition}
        setInputVisible={setInputVisible}
        inputStyle={inputStyle}
        inputVisible={inputVisible}
      />
      <Pen />
      <Select />
      <Reset />
      <Delete />
      <Undo />
      <Redo />
      <AddBackground />
      <AddImage />
    </div>
  );
};

export default FabricCanvas;
