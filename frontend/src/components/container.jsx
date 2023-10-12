import { mobileMQ, tabletMQ, desktopMQ } from "../styles/mediaquery";
import styled from "styled-components";

export const Container = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  padding: 70px;
  margin: 0 auto;
  max-width: 1000px;
  width: 100%;
  height: 100%;
  ${desktopMQ(`
    padding: 70px;
    max-width: 800px;
  `)}
  ${tabletMQ(`
    padding: 20px;
    max-width: 100%;
  `)}
  ${mobileMQ(`
    padding: 10px;
    max-width: 100%;
  `)}
  overflow: auto;
`;

export const ChildContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
