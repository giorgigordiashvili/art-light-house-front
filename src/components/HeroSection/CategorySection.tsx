import React from "react";
import styled from "styled-components";
import Container from "../ui/Container";

const StyledContainer = styled.div`
  width: 100%;
  padding: 44px 0 0 0;
`;

const ScrollableWrapper = styled.div`
  @media (max-width: 1332px) {
    overflow-x: auto;
    scrollbar-width: none;
  }
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: max-content;
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
`;

const Card = styled.div<{
  width: number;
  height: number;
  gradient?: string;
}>`
  position: relative;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background-color: #101010;
  border-radius: 16px;
  padding: 38px;
  color: white;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  backdrop-filter: blur(114px);
  background-repeat: no-repeat;
  background-position: right;
  background-size: contain;
  z-index: 0;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: 16px;
    background: ${(props) => props.gradient || "transparent"};
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: 1;
    pointer-events: none;
  }
`;

const CategorySection = () => {
  return (
    <Container>
      <StyledContainer>
        <ScrollableWrapper>
          <RowWrapper>
            <Row>
              <Card
                width={374}
                height={222}
                gradient="linear-gradient(116.95deg, rgba(255, 255, 255, 0.03) 3.48%, rgba(246, 202, 86, 0.45) 98.94%)"
                style={{ backgroundImage: 'url("/assets/light.png")' }}
              >
                განათება
              </Card>
              <Card
                width={374}
                height={222}
                gradient="linear-gradient(240.36deg, rgba(255, 255, 255, 0.03) 1.87%, rgba(246, 202, 86, 0.45) 93.88%)"
                style={{ backgroundImage: 'url("/assets/PillarLight.png")' }}
              >
                ეზოს განათება
              </Card>
              <Card
                width={505}
                height={222}
                style={{ backgroundImage: 'url("/assets/furniture.png")' }}
              >
                ავეჯი
              </Card>
            </Row>
            <Row>
              <Card
                width={505}
                height={222}
                gradient="linear-gradient(79.22deg, rgba(255, 255, 255, 0.03) 2.74%, rgba(246, 202, 86, 0.45) 81.45%)"
                style={{ backgroundImage: 'url("/assets/decorations.png")' }}
              >
                დეკორაციები
              </Card>
              <Card
                width={374}
                height={222}
                gradient="linear-gradient(330deg, rgba(255, 255, 255, 0.03) 3.22%, rgba(246, 202, 86, 0.45) 97.55%)"
                style={{ backgroundImage: 'url("/assets/moon.png")' }}
              >
                დეკორაციები
              </Card>
              <Card
                width={374}
                height={222}
                style={{ backgroundImage: 'url("/path/to/star.png")' }}
              >
                სხვა
              </Card>
            </Row>
          </RowWrapper>
        </ScrollableWrapper>
      </StyledContainer>
    </Container>
  );
};

export default CategorySection;
