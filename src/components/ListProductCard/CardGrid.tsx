import styled from "styled-components";
import Card from "./Card";

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const DesktopOnly = styled.div`
  display: block;

  @media (max-width: 1080px) {
    display: none;
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 1080px) {
    display: block;
  }
`;

const CardGrid = ({ dictionary }: any) => {
  return (
    <>
      <DesktopOnly>
        <GridWrapper>
          {Array.from({ length: 11 }).map((_, i) => (
            <Card key={i} dictionary={dictionary} />
          ))}
        </GridWrapper>
      </DesktopOnly>

      <MobileOnly>
        <GridWrapper>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} dictionary={dictionary} />
          ))}
        </GridWrapper>
      </MobileOnly>
    </>
  );
};

export default CardGrid;
