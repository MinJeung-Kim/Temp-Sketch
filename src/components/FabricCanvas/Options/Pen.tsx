import { useEffect, useCallback, useState } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@src/context/CanvasContext";
import PenIcon from "@src/components/ui/icons/PenIcon";
import { S } from "./styles";

export default function Pen() {
  const { canvas, setMode, selectedColor } = useCanvas();
  const [brushSize, setBrushSize] = useState<number>(3);
  const [showBrushMenu, setShowBrushMenu] = useState<boolean>(false);

  const updateBrush = useCallback(() => {
    if (canvas) {
      const brush = new fabric.PencilBrush(canvas);
      brush.color = selectedColor;
      brush.width = brushSize; // 브러시 크기 설정
      canvas.freeDrawingBrush = brush;
      canvas.renderAll();
    }
  }, [canvas, selectedColor, brushSize]);

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
    setShowBrushMenu(!showBrushMenu);
  };

  const handleBrushSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBrushSize(Number(event.target.value));
  };

  return (
    <S.Button onClick={startDraw}>
      <PenIcon /> 그리기
      {showBrushMenu && (
        <S.BrushWrap>
          <S.Brush
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={handleBrushSizeChange}
          />
          <S.BrushSize $brushSize={brushSize}>{brushSize}</S.BrushSize>
        </S.BrushWrap>
      )}
    </S.Button>
  );
}
