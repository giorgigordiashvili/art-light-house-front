import React from "react";
import styled from "styled-components";
import Image from "next/image";

const StyledButton = styled.div`
  width: 141px;
  height: 41px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 31px;
  background-color: #ffcb40;
  color: #000000;
  font-family: HelRom;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  cursor: pointer;

  &.authorized {
    justify-content: flex-start;
    gap: 11px;
    padding-right: 18px;
  }

  &.authorized img {
    border-radius: 60px;
    margin: 6px 0 6px 6px;

    @media (max-width: 1080px) {
      margin: 0;
    }
  }

  &.authorized span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 1080px) {
      display: none;
    }
  }

  &.unauthorized {
    position: relative;
  }

  .default-icon {
    display: none;

    @media (max-width: 1080px) {
      display: block;
    }
  }

  .unauthorized-text {
    @media (max-width: 1080px) {
      display: none;
    }
  }

  @media (max-width: 1080px) {
    width: 40px;
    height: 40px;
    justify-content: center;
    padding: 0;
    overflow: hidden;

    &.authorized {
      width: 40px;
      height: 40px;
      justify-content: center;
      padding: 0;
    }

    &.authorized span {
      display: none;
    }
  }
`;

type Props = {
  text?: string;
  username?: string;
  userImage?: string;
  isAuthorized?: boolean;
  onClick?: () => void;
};

const AuthorizationButton = ({ text, username, userImage, isAuthorized, onClick }: Props) => {
  return (
    <StyledButton className={isAuthorized ? "authorized" : "unauthorized"} onClick={onClick}>
      {isAuthorized && userImage && (
        <Image src={userImage} alt="User Profile" width={30} height={30} />
      )}
      {!isAuthorized && (
        <Image
          src="/assets/user.svg"
          alt="Default Icon"
          width={24}
          height={24}
          className="default-icon"
        />
      )}
      {isAuthorized ? (
        <span className="username">{username}</span>
      ) : (
        <span className="unauthorized-text">{text}</span>
      )}
    </StyledButton>
  );
};

export default AuthorizationButton;
