import styled from "styled-components";
import { FaGithub } from "react-icons/fa";

export const Header = () => {
  return (
    <HeaderContainer>
      <a
        target="_blank"
        style={{ textDecoration: "none" }}
        href={"https://github.com/woltsu/tsynamo"}
      >
        <Title>
          Tsynamo Playground <FaGithub color="white" />
        </Title>
      </a>
    </HeaderContainer>
  );
};

const Title = styled.p`
  color: white;
  font-family: Menlo, Monaco, "Courier New", monospace;
  margin: 2px;
`;
const HeaderContainer = styled.div`
  background-color: var(--vscode-bg);
  padding-left: 2.5%;
  border-bottom: 2px;
  border-style: solid;
  border-color: #343030;
`;
