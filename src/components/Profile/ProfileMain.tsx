// "use client";
// import styled from "styled-components";
// import DetailBar from "@/components/DetailBar/DetailBar";
// import Personal from "@/components/Profile/PersonalInf";
// import Pass from "@/components/Profile/Pass";
// import MobileDetailDropdown from "@/components/DetailBar/MobileDetailDropdown";

// const StyledComponent = styled.div`
//   background: black;
//   margin-top: 80px;
//   margin-bottom: 219px;

//   @media (max-width: 1080px) {
//     display: flex;
//     align-items: center;
//     flex-direction: column;
//   }
// `;
// const DesktopWrapper = styled.div`
//   @media (max-width: 1080px) {
//     display: none;
//   }
// `;

// const MobileWrapper = styled.div`
//   @media (min-width: 1081px) {
//     display: none;
//   }
// `;
// const ContentWrapper = styled.div`
//   display: flex;
//   flex-direction: row;
//   width: 100%;
//   gap: 24px;
// `;

// const RightSection = styled.div`
//   display: flex;
//   flex-direction: column;
//   flex-grow: 1;
//   gap: 20px;
// `;
// const PageTitle = styled.h1`
//   font-family: "Helvetica";
//   font-weight: 250;
//   font-size: 64px;
//   line-height: 33.8px;
//   color: white;
//   margin-top: 186px;
//   margin-bottom: 71px;

//   @media (max-width: 1080px) {
//     font-size: 34px;
//     line-height: 24px;
//     margin-bottom: 47px;
//   }
// `;

// const MyDetails = () => {
//   return (
//     <StyledComponent>
//       <DesktopWrapper>
//         <PageTitle>ჩემი პროფილი</PageTitle>
//         <ContentWrapper>
//           <DetailBar />
//           <RightSection>
//             <Personal />
//             <Pass />
//           </RightSection>
//         </ContentWrapper>
//       </DesktopWrapper>

//       <MobileWrapper>
//         <MobileDetailDropdown />
//       </MobileWrapper>
//     </StyledComponent>
//   );
// };

// export default MyDetails;
"use client";
import styled from "styled-components";
import { useState } from "react";
import DetailBar from "@/components/DetailBar/DetailBar";
import Personal from "@/components/Profile/PersonalInf";
import MobileDetailDropdown from "@/components/DetailBar/MobileDetailDropdown";
import { useProfileData } from "@/hooks/useProfileData";

const StyledComponent = styled.div`
  margin-top: 80px;
  /* margin-bottom: 219px; */
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1292px;
  @media (max-width: 1332px) {
  }

  @media (max-width: 1080px) {
    max-width: 100%;
    padding: 0 16px;
  }
`;

const DesktopWrapper = styled.div`
  @media (max-width: 1080px) {
    display: none;
  }
`;

const MobileWrapper = styled.div`
  display: none;

  @media (max-width: 1080px) {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 20px;
  margin-bottom: 219px;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 20px;
  /* width: 100%; */
`;

const PageTitle = styled.h1`
  font-family: "Helvetica";
  font-weight: 250;
  font-size: 64px;
  line-height: 33.8px;
  color: white;
  margin-top: 106px;
  margin-bottom: 71px;
  position: relative;
  z-index: 1;

  @media (max-width: 1080px) {
    font-size: 34px;
    line-height: 24px;
    margin-bottom: 20px;
    margin-top: 120px;
    font-family: "Helvetica";
  }
`;

const DetailBarWrapper = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  margin-bottom: 20px;

  @media (min-width: 1081px) {
    display: none;
  }
`;

const SkeletonProfileCard = styled.div`
  width: 100%;
  min-height: 544px;
  border-radius: 17px;
  border: 1px solid #ffffff12;
  background: #1a1a1a96;
  backdrop-filter: blur(114px);
  position: relative;
  overflow: hidden;
  padding: 32px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
    z-index: 1;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  @media (max-width: 1080px) {
    padding: 24px;
    min-height: auto;
  }
`;

const SkeletonRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const SkeletonField = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonLabel = styled.div`
  width: 30%;
  height: 14px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const SkeletonInput = styled.div`
  width: 100%;
  height: 48px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const SkeletonButton = styled.div`
  width: 150px;
  height: 48px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-top: 16px;

  @media (max-width: 1080px) {
    width: 100%;
  }
`;

const MyDetails = ({ dictionary }: any) => {
  const [isDropdownOpen] = useState(false);
  const { profileData, isLoading, error } = useProfileData();

  // Show error state if there's an error
  if (error) {
  }

  return (
    <StyledComponent>
      <Container>
        <DesktopWrapper>
          <PageTitle>{dictionary?.profile?.title || "ჩემი პროფილი"}</PageTitle>
          <ContentWrapper>
            <DetailBar dictionary={dictionary?.profile} />
            <RightSection>
              {isLoading ? (
                <SkeletonProfileCard>
                  <SkeletonRow>
                    <SkeletonField>
                      <SkeletonLabel />
                      <SkeletonInput />
                    </SkeletonField>
                    <SkeletonField>
                      <SkeletonLabel />
                      <SkeletonInput />
                    </SkeletonField>
                  </SkeletonRow>
                  <SkeletonRow>
                    <SkeletonField>
                      <SkeletonLabel />
                      <SkeletonInput />
                    </SkeletonField>
                    <SkeletonField>
                      <SkeletonLabel />
                      <SkeletonInput />
                    </SkeletonField>
                  </SkeletonRow>
                  <SkeletonRow>
                    <SkeletonField>
                      <SkeletonLabel />
                      <SkeletonInput />
                    </SkeletonField>
                  </SkeletonRow>
                  <SkeletonButton />
                </SkeletonProfileCard>
              ) : (
                <Personal
                  dictionary={dictionary?.profile}
                  profileData={profileData}
                  isLoading={isLoading}
                  variant="data"
                />
              )}
            </RightSection>
          </ContentWrapper>
        </DesktopWrapper>

        <MobileWrapper>
          <PageTitle>{dictionary?.profile?.title || "ჩემი პროფილი"}</PageTitle>
          <MobileDetailDropdown dictionary={dictionary?.profile} />
          <DetailBarWrapper $isOpen={isDropdownOpen}>
            <DetailBar dictionary={dictionary?.profile} />
          </DetailBarWrapper>
          <RightSection>
            {isLoading ? (
              <SkeletonProfileCard>
                <SkeletonRow>
                  <SkeletonField>
                    <SkeletonLabel />
                    <SkeletonInput />
                  </SkeletonField>
                  <SkeletonField>
                    <SkeletonLabel />
                    <SkeletonInput />
                  </SkeletonField>
                </SkeletonRow>
                <SkeletonRow>
                  <SkeletonField>
                    <SkeletonLabel />
                    <SkeletonInput />
                  </SkeletonField>
                  <SkeletonField>
                    <SkeletonLabel />
                    <SkeletonInput />
                  </SkeletonField>
                </SkeletonRow>
                <SkeletonRow>
                  <SkeletonField>
                    <SkeletonLabel />
                    <SkeletonInput />
                  </SkeletonField>
                </SkeletonRow>
                <SkeletonButton />
              </SkeletonProfileCard>
            ) : (
              <Personal
                dictionary={dictionary?.profile}
                profileData={profileData}
                isLoading={isLoading}
                variant="data"
              />
            )}
          </RightSection>
        </MobileWrapper>
      </Container>
    </StyledComponent>
  );
};

export default MyDetails;
