import styled from "styled-components";
import { CanvasProvider } from "./context/CanvasContext";
import FabricCanvas from "./components/FabricCanvas/FabricCanvas";
import "./App.css";

export default function App() {
  return (
    <S.Root>
      <CanvasProvider>
        <FabricCanvas />
      </CanvasProvider>
    </S.Root>
  );
}

const S = {
  Root: styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 3rem;
  `,
};
