import styled from "styled-components";

export const S = {
  Button: styled.button`
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
    width: 100%;
    position: absolute;
    top: 0;
    right: 24px;
    background: white;
    border: 1px solid #ccc;
    padding: 10px;
    z-index: 999;
  `,
  Color: styled.button<{ $color: string }>`
    background: ${({ $color }) => $color};
    width: 20px;
    height: 20px;
  `,
};
