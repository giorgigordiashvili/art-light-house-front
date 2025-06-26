"use client";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SidebarContainer = styled.div`
  background-color: #fff;
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 100;
`;

const LogoContainer = styled.div`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #f3f5f9;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 1.5rem 0;
  margin: 0;
  flex: 1;
`;

const NavItem = styled.li<{ $isActive: boolean }>`
  padding: 0;
  margin: 0;
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  color: ${(props) => (props.$isActive ? "#2B3445" : "#7D879C")};
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  text-decoration: none;
  transition: all 0.2s;
  border-left: 4px solid ${(props) => (props.$isActive ? "#2B3445" : "transparent")};
  background-color: ${(props) => (props.$isActive ? "#F3F5F9" : "transparent")};

  &:hover {
    background-color: #f3f5f9;
    color: #2b3445;
  }
`;

const NavFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #f3f5f9;
  display: flex;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserImage = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f3f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.8rem;
`;

const UserName = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
`;

const UserRole = styled.div`
  font-size: 0.8rem;
  color: #7d879c;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #7d879c;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    color: #d23f57;
  }
`;

interface AdminSidebarProps {
  username?: string;
  role?: string;
}

const AdminSidebar = ({ username = "Admin User", role = "Administrator" }: AdminSidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Products", path: "/admin/products" },
    { name: "Attributes", path: "/admin/attributes" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Customers", path: "/admin/customers" },
    { name: "Languages", path: "/admin/languages" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <SidebarContainer>
      <LogoContainer>
        <Link href="/">
          <Image src="/assets/Logo.png" alt="Art Light House" width={140} height={40} />
        </Link>
      </LogoContainer>

      <NavList>
        {navItems.map((item) => (
          <NavItem key={item.path} $isActive={pathname === item.path}>
            <NavLink href={item.path} $isActive={pathname === item.path}>
              {item.name}
            </NavLink>
          </NavItem>
        ))}
      </NavList>

      <NavFooter>
        <UserInfo>
          <UserImage>
            <Image src="/assets/user.svg" alt="User" width={20} height={20} />
          </UserImage>
          <div>
            <UserName>{username}</UserName>
            <UserRole>{role}</UserRole>
          </div>
        </UserInfo>
        <LogoutButton>
          <Image src="/assets/exitIcon.svg" alt="Logout" width={18} height={18} />
        </LogoutButton>
      </NavFooter>
    </SidebarContainer>
  );
};

export default AdminSidebar;
