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
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import DetailBar from "@/components/DetailBar/DetailBar";
import Personal from "@/components/Profile/PersonalInf";
import MobileDetailDropdown from "@/components/DetailBar/MobileDetailDropdown";
import { getCurrentClient } from "@/api/generated/api";
import { useAuth } from "@/contexts/AuthContext";

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
  /* Keep 20px from the viewport edge once the 1292px content no longer fits */
  @media (max-width: 1332px) {
    padding-inline: 20px;
  }

  @media (max-width: 1080px) {
    max-width: 100%;
    padding: 0 20px;
  }
`;

// Single tree for desktop and mobile so the form (and its state) is mounted once.
// DetailBar hides itself at <=1080px and MobileDetailDropdown hides itself on desktop.
const PageBody = styled.div`
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

  @media (max-width: 1080px) {
    flex-direction: column;
    margin-bottom: 0;
  }
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

const ErrorCard = styled.div`
  width: 100%;
  border-radius: 17px;
  border: 1px solid #ffffff12;
  background: #1a1a1a96;
  backdrop-filter: blur(114px);
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  p {
    color: #999;
    font-size: 18px;
    text-align: center;
    margin: 0;
  }

  @media (max-width: 1080px) {
    padding: 24px;
  }
`;

const RetryButton = styled.button`
  min-width: 143px;
  height: 48px;
  padding: 0 20px;
  border: none;
  border-radius: 10px;
  background: #ffcb40;
  color: #000000;
  font-family: "Helvetica";
  font-weight: 700;
  font-size: 14px;
  line-height: 28px;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #fafafa;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
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
  const params = useParams();
  const isGeorgian = params?.lang !== "en";
  const { user, isAuthenticated, isLoading: authLoading, updateUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep the latest values in refs so the refresh does not depend on unstable identities
  const userRef = useRef(user);
  userRef.current = user;
  const updateUserRef = useRef(updateUser);
  updateUserRef.current = updateUser;

  // AuthContext already holds the current client, so the form renders from it right away.
  // The request below only refreshes it in the background (cookie auth does not re-verify
  // the stored user) and keeps AuthContext/localStorage in sync.
  const refreshProfile = async () => {
    if (!isAuthenticated) {
      setError("User not authenticated");
      return;
    }

    try {
      setIsRefreshing(true);
      setError(null);
      const data = await getCurrentClient();
      if (JSON.stringify(data) !== JSON.stringify(userRef.current)) {
        updateUserRef.current(data);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch profile data");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated]);

  const profileData = user;
  const isLoading = authLoading || (!profileData && isRefreshing);
  const showError = !isLoading && !!error && !profileData;

  const skeleton = (
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
  );

  return (
    <StyledComponent>
      <Container>
        <PageBody>
          <PageTitle>{dictionary?.profile?.title || "ჩემი პროფილი"}</PageTitle>
          <MobileDetailDropdown dictionary={dictionary?.profile} />
          <ContentWrapper>
            <DetailBar dictionary={dictionary?.profile} />
            <RightSection>
              {isLoading ? (
                skeleton
              ) : showError ? (
                <ErrorCard>
                  <p>
                    {dictionary?.profile?.loadError ||
                      (isGeorgian ? "პროფილის ჩატვირთვა ვერ მოხერხდა" : "Failed to load profile")}
                  </p>
                  <RetryButton type="button" onClick={refreshProfile} disabled={isRefreshing}>
                    {dictionary?.profile?.retry || (isGeorgian ? "ხელახლა ცდა" : "Try again")}
                  </RetryButton>
                </ErrorCard>
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
        </PageBody>
      </Container>
    </StyledComponent>
  );
};

export default MyDetails;
