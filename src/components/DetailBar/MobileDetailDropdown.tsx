"use client";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

const Wrapper = styled.div`
  width: 350px;
  max-width: 100%;
  background-color: transparent;
  z-index: 1;

  @media (min-width: 1080px) {
    display: none;
    width: 100%;
    max-width: 100%;
  }
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #1a1a1a96;
  backdrop-filter: blur(114px);
  border-radius: 16px;
  border: 1px solid #ffffff12;
  cursor: pointer;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;

  span {
    background: linear-gradient(90deg, #f7cb57 0%, #ffd700 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
    font-size: 14px;
    line-height: 28px;
  }

  img {
    filter: brightness(0) saturate(100%) invert(67%) sepia(81%) saturate(360%) hue-rotate(5deg)
      brightness(104%) contrast(102%);
  }
`;

const HeaderRight = styled.div<{ open: boolean }>`
  transition: transform 0.3s ease;
  transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0deg)")};
`;

const DropdownMenu = styled.div`
  margin-top: 8px;
  background-color: #1a1a1a96;
  backdrop-filter: blur(114px);
  border: 1px solid #ffffff12;
  border-radius: 17px;
  overflow: hidden;
`;

const MenuItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 16px 24px;
  /* 20 არის თუ 16 გასარკვევია პადინგ ტოპ */
  font-weight: 700;
  font-size: 14px;
  line-height: 28px;
  cursor: pointer;
  border-bottom: 1px solid #242424;
  background-color: transparent;

  &:last-child {
    border-bottom: none;
  }

  color: ${({ selected }) => (selected ? "transparent" : "#edededcc")};
  background: ${({ selected }) =>
    selected ? "linear-gradient(90deg, #F7CB57 0%, #FFD700 100%)" : "none"};
  background-clip: ${({ selected }) => (selected ? "text" : "unset")};
  -webkit-background-clip: ${({ selected }) => (selected ? "text" : "unset")};
  -webkit-text-fill-color: ${({ selected }) => (selected ? "transparent" : "#edededcc")};

  &:hover {
    color: transparent;
    background: linear-gradient(90deg, #f7cb57 0%, #ffd700 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  img {
    flex-shrink: 0;
    filter: ${({ selected }) =>
      selected
        ? `brightness(0) saturate(100%) invert(67%) sepia(81%) saturate(360%) hue-rotate(5deg)
        brightness(104%) contrast(102%)`
        : "none"};
  }

  &:hover img {
    filter: brightness(0) saturate(100%) invert(67%) sepia(81%) saturate(360%) hue-rotate(5deg)
      brightness(104%) contrast(102%);
  }
`;

const MobileDetailDropdown = ({ dictionary }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const parts = (pathname || "/").split("/");
  const currentLocale = parts[1];
  const supportedLocales = ["ge", "en"];
  const localePrefix = supportedLocales.includes(currentLocale) ? `/${currentLocale}` : "";

  const menuItems = useMemo(
    () => [
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
    ],
    [dictionary]
  );

  // Determine current page based on pathname
  const getCurrentMenuItem = () => {
    const currentPath = pathname?.replace(`/${currentLocale}`, "") || "";
    const matchedItem = menuItems.find((item) => currentPath === item.route);
    return matchedItem || menuItems[0];
  };

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(getCurrentMenuItem());

  // Update selected item when pathname changes
  useEffect(() => {
    const currentPath = pathname?.replace(`/${currentLocale}`, "") || "";
    const matchedItem = menuItems.find((item) => currentPath === item.route);
    if (matchedItem) {
      setSelectedItem(matchedItem);
    }
  }, [pathname, currentLocale, menuItems]);

  const handleSelect = (item: { label: string; icon: string; route: string }) => {
    setSelectedItem(item);
    setOpen(false);
    router.push(`${localePrefix}${item.route}`);
  };

  const handleMenuItemClick =
    (item: { label: string; icon: string; route: string }) => (e: React.MouseEvent) => {
      // Check for Ctrl+click (Windows/Linux) or Cmd+click (Mac) or middle-click
      if (e.ctrlKey || e.metaKey || e.button === 1) {
        window.open(`${localePrefix}${item.route}`, "_blank");
        return;
      }
      handleSelect(item);
    };

  const handleMenuItemMouseDown =
    (item: { label: string; icon: string; route: string }) => (e: React.MouseEvent) => {
      // Handle middle-click (mouse wheel click)
      if (e.button === 1) {
        e.preventDefault(); // Prevent default middle-click behavior
        window.open(`${localePrefix}${item.route}`, "_blank");
      }
    };

  return (
    <Wrapper>
      <DropdownHeader onClick={() => setOpen(!open)}>
        <HeaderLeft>
          <Image src={selectedItem.icon} alt="აიქონი" width={24} height={24} />
          <span>{selectedItem.label}</span>
        </HeaderLeft>
        <HeaderRight open={open}>
          <Image
            src="/assets/icons/Dropdown Icon.svg"
            alt="Dropdown Arrow"
            width={24}
            height={24}
          />
        </HeaderRight>
      </DropdownHeader>

      {open && (
        <DropdownMenu>
          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              onClick={handleMenuItemClick(item)}
              onMouseDown={handleMenuItemMouseDown(item)}
              selected={item.label === selectedItem.label}
            >
              <Image src={item.icon} alt={item.label} width={24} height={24} />
              {item.label}
            </MenuItem>
          ))}
        </DropdownMenu>
      )}
    </Wrapper>
  );
};

export default MobileDetailDropdown;
