import React from "react";
import styled from "styled-components";
import { mobileMQ } from "../styles/mediaquery";

const ButtonEl = styled.button`
  background-color: ${({ theme, color, isInverted }) =>
    isInverted ? theme.colors.white : color ?? theme.colors.secondary};
  border: ${({ theme, color, isInverted }) =>
    isInverted
      ? `1px solid ${color ?? theme.colors.secondary}`
      : "1px solid transparent"};
  color: ${({ theme, color, isInverted }) =>
    isInverted ? color ?? theme.colors.secondary : theme.colors.white};
  border-radius: 4px;
  padding: 10px 20px;
  margin: 0 10px;
  margin-bottom: 5px;
  margin-top: 5px;
  ${({ isDisabled }) =>
    isDisabled &&
    `
  opacity: 0.5;
  cursor: not-allowed;
  `}

  cursor: pointer;
  user-select: none;

  transition: font-weight 0.3s ease-out, color 0.3s ease-out;

  ${({ isDisabled }) => !isDisabled && `&:hover { font-weight: bold; }`}

  ${mobileMQ(`
    padding: 8px 15px;
  `)}
`;

export const Button = ({
  name,
  onClick,
  isInverted,
  className,
  color,
  isDisabled,
  type,
}) => (
  <ButtonEl
    onClick={onClick}
    isInverted={isInverted}
    className={className}
    color={color}
    type={type}
    disabled={isDisabled}
    isDisabled={isDisabled}
  >
    {name}
  </ButtonEl>
);
