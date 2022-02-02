import styled from "styled-components";

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  input {
    height: 120px;
    width: 100px;
    display: block;
    background: #ffffff;
    border: 1px solid #d0d5da;
    box-sizing: border-box;
    border-radius: 8px;
    margin: 0 4px;
    text-align: center;
    font-size: 2rem;

    @media (max-width: 768px) {
      height: 76px;
      width: 64px;
    }

    @media (max-width: 414px) {
      height: 48px;
      width: 40px;
    }

    &:last-child {
      margin: 0;
    }
  }

  hr {
    width: 24px;
    height: 1px;
    background: #c4c4c4;
    border: none;
    margin: 0 16px;

    @media (max-width: 768px) {
      margin: 0 4px;
    }
  }
`;

export default InputWrapper;
