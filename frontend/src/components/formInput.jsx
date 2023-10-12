import React from "react";
import styled from "styled-components";

const Input = styled.input`
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  margin: 10px 0;
  padding: 12px;
  width: 100%;
  ${({ isDisabled }) =>
    isDisabled &&
    `
  opacity: 0.5;
  cursor: not-allowed;
  `}
`;

const Textarea = styled.textarea`
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  margin: 10px 0;
  padding: 12px;
  width: 100%;
  resize: none;
  height: 100%;
  flex: 1;
  ${({ isDisabled }) =>
    isDisabled &&
    `
  opacity: 0.5;
  cursor: not-allowed;
  `}
`;

const InputContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  margin: 15px 0;
  width: 100%;
`;

const TextContainer = styled(InputContainer)`
  flex: 2;
  height: 100%;
  margin-left: 10px;
`;

const InputLabel = styled.label`
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.black};
`;

export const FormInput = ({
  value,
  label,
  name,
  type,
  onChange,
  className,
  placeholder,
  isDisabled,
}) => (
  <InputContainer className={className}>
    <InputLabel>{label}</InputLabel>
    <Input
      type={type || "text"}
      isDisabled={isDisabled}
      placeholder={placeholder || label}
      value={value}
      onChange={onChange}
      name={name}
      disabled={isDisabled}
    />
  </InputContainer>
);

export const FormTextArea = ({
  value,
  label,
  name,
  type,
  onChange,
  placeholder,
  className,
  isDisabled,
}) => (
  <TextContainer className={className}>
    <InputLabel>{label}</InputLabel>
    <Textarea
      type={type || "text"}
      placeholder={placeholder || label}
      onChange={onChange}
      name={name}
      disabled={isDisabled}
      value={value}
      rows="10"
    />
  </TextContainer>
);
