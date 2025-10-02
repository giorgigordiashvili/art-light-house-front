"use client";
import styled from "styled-components";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const Container = styled.div`
  width: 472px;
  height: 544px;
  background: #1a1a1a96;
  backdrop-filter: blur(114px);
  border: 1px solid #ffffff12;
  border-radius: 17px;
  color: #edededcc;
  font-family: inherit;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1;
  @media (max-width: 1080px) {
    display: none;
  }
`;

// არ გადაეცემა logout როგორც DOM prop
const Item = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "logout",
})<{ logout?: boolean }>`
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
  padding: 0 24px;
  height: 24px;
  color: ${({ logout }) => (logout ? "#FF4D4F" : "#edededcc")};
  &:hover {
    background: linear-gradient(90deg, #f7cb57 0%, #ffd700 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: brightness(0) saturate(100%) invert(67%) sepia(81%) saturate(360%) hue-rotate(5deg)
      brightness(104%) contrast(102%);
  }
  margin-top: 24px;
  margin-bottom: 24px;
`;

// არ გადაეცემა last როგორც DOM prop
const Divider = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "last",
})<{ last?: boolean }>`
  height: 1px;
  background-color: #242424;
  margin-top: ${({ last }) => (last ? "105px" : "0")};
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  position: relative;
  flex-shrink: 0;
  transition: filter 0.3s ease;
`;

const DetailBar = ({ dictionary }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, isAuthenticated } = useAuth();
  const parts = (pathname || "/").split("/");
  const currentLocale = parts[1];
  const supportedLocales = ["ge", "en"];
  const localePrefix = supportedLocales.includes(currentLocale) ? `/${currentLocale}` : "";

  const menuItems = [
    {
      label: dictionary?.detailBar1 || "My details",
      icon: "/assets/icons/Details.svg",
      route: "/profile",
    },
    {
      label: dictionary?.detailBar2 || "My addresses",
      icon: "/assets/icons/misamarti.svg",
      route: "/address",
    },
    {
      label: dictionary?.detailBar3 || "My orders",
      icon: "/assets/icons/Shekvetebi.svg",
      route: "/orders",
    },
    {
      label: dictionary?.detailBar4 || "Payment methods",
      icon: "/assets/icons/gadaxda.svg",
      route: "/checkout",
    },
    {
      label: dictionary?.detailBar5 || "Settings",
      icon: "/assets/icons/settings.svg",
      route: "/settings",
    },
  ];

  const handleSignOut = async () => {
    const homePath = localePrefix || "/";
    try {
      if (isAuthenticated) {
        await logout();
      }
      router.push(homePath);
    } catch (error) {
      console.error("Logout error:", error);
      router.push(homePath);
    }
  };

  const handleMenuItemClick = (route: string) => (e: React.MouseEvent) => {
    // Check for Ctrl+click (Windows/Linux) or Cmd+click (Mac) or middle-click
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      window.open(`${localePrefix}${route}`, "_blank");
      return;
    }
    router.push(`${localePrefix}${route}`);
  };

  const handleMenuItemMouseDown = (route: string) => (e: React.MouseEvent) => {
    // Handle middle-click (mouse wheel click)
    if (e.button === 1) {
      e.preventDefault(); // Prevent default middle-click behavior
      window.open(`${localePrefix}${route}`, "_blank");
    }
  };

  return (
    <Container>
      {menuItems.map(({ label, icon, route }, index) => (
        <div key={label}>
          {index !== 0 && <Divider />}
          <Item onClick={handleMenuItemClick(route)} onMouseDown={handleMenuItemMouseDown(route)}>
            <IconWrapper>
              <Image src={icon} alt={label} width={24} height={24} />
            </IconWrapper>
            {label}
          </Item>
        </div>
      ))}
      <Divider last />
      <Item logout onClick={handleSignOut}>
        <IconWrapper>
          <Image
            src="/assets/icons/Logout.svg"
            alt={dictionary?.detailBar6 || "Logout"}
            width={24}
            height={24}
          />
        </IconWrapper>
        {dictionary?.detailBar6 || "Logout"}
      </Item>
    </Container>
  );
};

export default DetailBar;
