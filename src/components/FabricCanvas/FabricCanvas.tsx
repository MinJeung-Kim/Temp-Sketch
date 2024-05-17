import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import Pen from "../Pen";
import Undo from "../Undo";
import Redo from "../Redo";
import Text from "../Text";
import Color from "../Color";
import Reset from "../Reset";
import Delete from "../Delete";
import Select from "../Select";
import AddShape from "../AddShape";
import AddImage from "../AddImage";
import AddBackground from "../AddBackground";
import { useCanvas } from "@src/context/CanvasContext";
import { S } from "./styles";

export default function FabricCanvas() {
  const { saveState, canvas, mode } = useCanvas();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDown, setIsDown] = useState<boolean>(false);
  const [line, setLine] = useState<fabric.Line | null>(null);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputStyle, setInputStyle] = useState<React.CSSProperties>({});
  const [inputPosition, setInputPosition] = useState<{
    left: number;
    top: number;
  }>({ left: 0, top: 0 });

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
        saveState(canvas);
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
        saveState(canvas);
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
    <S.Canvas>
      <AddShape />
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
      <Color />
    </S.Canvas>
  );
}
