// src/components/StyledComponents.js
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.primaryBackground};
  color: ${({ theme }) => theme.primaryText};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
`;

export const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.inputText};
  background-color: ${({ theme }) => theme.inputBackground};
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 4px;
`;

export const Button = styled.button`
  padding: 0.5rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.buttonText};
  background-color: ${({ theme }) => theme.buttonBackground};
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: darken(${({ theme }) => theme.buttonBackground}, 10%);
  }
`;
