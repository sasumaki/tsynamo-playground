import styled from "styled-components";
import { FaGithub } from "react-icons/fa";


type Props = {
  handleSave: () => void
}
export const Header = ({ handleSave}: Props) => {
  return (
    <HeaderContainer>
     <TitleWithLink/>
     <SaveButton handleSave={handleSave} />
    </HeaderContainer>
  );
};

const SaveButton = ({ handleSave }: Props) => {
  const isMacOS = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

  return (
    <div>
      <TextButton onClick={handleSave} $isMacOS={isMacOS}>
        Save
      </TextButton>
    </div>
  );
}
// Styled component for the text button
const TextButton = styled.button<{$isMacOS: boolean}>`
  position: relative;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  /* Add more styles as needed */

  /* Pseudo-element for the hint text */
  &::after {
    content: ${({ $isMacOS }) => ($isMacOS ? "'⌘+S'" : "'Ctrl+S'")};
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  /* Show hint text on hover */
  &:hover::after {
    opacity: 1;
  }
`;


const TitleWithLink = () => {
  return  (<a
  target="_blank"
  style={{ textDecoration: "none" }}
  href={"https://github.com/woltsu/tsynamo"}
>
  <Title>
    Tsynamo Playground <FaGithub color="white" />
  </Title>
</a>)
}

const Title = styled.p`
  color: white;
  font-family: Menlo, Monaco, "Courier New", monospace;
  margin: 2px;
`;
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: var(--vscode-bg);
  padding-left: 2.5%;
  border-bottom: 2px;
  border-style: solid;
  border-color: #343030;
`;
