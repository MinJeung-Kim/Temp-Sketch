import { useEffect, useCallback } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@src/context/CanvasContext";

import PenIcon from "@src/components/ui/icons/PenIcon";
import { S } from "./styles";

export default function Pen() {
  const { canvas, setMode, selectedColor } = useCanvas();

  const updateBrush = useCallback(() => {
    if (canvas) {
      const brush = new fabric.PencilBrush(canvas);
      brush.color = selectedColor;
      brush.width = 3;
      canvas.freeDrawingBrush = brush;
      canvas.renderAll();
    }
  }, [canvas, selectedColor]);

  useEffect(() => {
    if (canvas && canvas.isDrawingMode) {
      updateBrush();
    }
  }, [selectedColor, canvas, updateBrush]);

  const startDraw = () => {
    if (canvas) {
      setMode("pencil");
      updateBrush();
      canvas.isDrawingMode = true;
      canvas.renderAll();
    }
  };

  return (
    <S.Button onClick={startDraw}>
      <PenIcon /> 그리기
    </S.Button>
  );
}
