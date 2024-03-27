import styled from "styled-components";

// Styled Snackbar component
const SnackbarContainer = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 999;
  transition: opacity 0.5s ease;
  opacity: ${(props) => (props.$show ? "1" : "0")};
  pointer-events: ${(props) => (props.$show ? "auto" : "none")};
`;

type Props = {
  message: string;
};
export const Snackbar = ({ message }: Props) => {

  return (
    <SnackbarContainer $show={Boolean(message)}>
      {message}
    </SnackbarContainer>
  );
};

export default Snackbar;
