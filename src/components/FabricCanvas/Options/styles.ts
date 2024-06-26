import styled from "styled-components";

export const S = {
  Button: styled.button`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  `,
  Wrap: styled.div`
    position: relative;
    width: 100%;
  `,
  Colors: styled.div`
    position: absolute;
    top: 0;
    right: 131px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.58rem;
    background: white;
    border: 1px solid #ccc;
    padding: 1rem;
    z-index: 999;
  `,
  Color: styled.button<{ $color: string }>`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1.5px solid rgb(209, 214, 219);
    background: ${({ $color }) => $color};
  `,
  ShapeOptions: styled.div`
    position: absolute;
    top: 0;
    right: 131px;
    background: white;
    border: 1px solid #ccc;
    padding: 1rem;
    z-index: 999;
  `,
  BrushWrap: styled.div`
    position: absolute;
    top: 0;
    right: 131px;
    background: white;
    border: 1px solid #ccc;
    padding: 1rem;
    height: 30px;
    z-index: 999;
  `,
  Brush: styled.input``,
  BrushSize: styled.span<{ $brushSize: number }>`
    position: absolute;
    bottom: 3px;
    left: ${({ $brushSize }) => `calc(${($brushSize / 60) * 100}% )`};
    font-size: 0.7rem;
    border-radius: 50%;
    background: #ccc;
    padding: 0.2rem;
  `,
};
