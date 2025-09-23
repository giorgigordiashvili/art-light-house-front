"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import styled from "styled-components";

const SidebarContainer = styled.aside`
  width: 280px;
  height: 100vh;
  background: #1a1a1a;
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

const Logo = styled.div`
  padding: 24px;
  border-bottom: 1px solid #333;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #fff;
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 24px 0;
`;

const NavSection = styled.div`
  margin-bottom: 32px;

  h3 {
    padding: 0 24px;
    margin: 0 0 16px 0;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #888;
    letter-spacing: 0.5px;
  }
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: ${(props) => (props.$isActive ? "#fff" : "#ccc")};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  background: ${(props) => (props.$isActive ? "#333" : "transparent")};
  border-right: ${(props) => (props.$isActive ? "3px solid #007bff" : "3px solid transparent")};

  &:hover {
    background: #333;
    color: #fff;
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 12px;
  }
`;

const UserSection = styled.div`
  padding: 24px;
  border-top: 1px solid #333;

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #007bff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      font-weight: 600;
    }

    .details {
      .name {
        font-weight: 600;
        margin-bottom: 2px;
      }
      .role {
        font-size: 0.875rem;
        color: #888;
      }
    }
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #c82333;
  }
`;

const AdminSidebar = () => {
  const pathname = usePathname();
  const { user, signOut } = useAdminAuth();

  const isActive = (path: string) => pathname === path;

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      signOut();
    }
  };

  return (
    <SidebarContainer>
      <Logo>
        <h2>Admin Panel</h2>
      </Logo>

      <Navigation>
        <NavSection>
          <h3>Main</h3>
          <NavList>
            <NavItem>
              <NavLink href="/admin" $isActive={isActive("/admin")}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                </svg>
                Dashboard
              </NavLink>
            </NavItem>
          </NavList>
        </NavSection>

        <NavSection>
          <h3>Management</h3>
          <NavList>
            <NavItem>
              <NavLink href="/admin/products" $isActive={isActive("/admin/products")}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.5-1.1 1.9c-.1.3-.1.6-.1.9 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25L7.7 13H19l1.8-3.5L20.8 2H5.21L4.27 0H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
                Products
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/admin/categories" $isActive={isActive("/admin/categories")}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Categories
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/admin/attributes" $isActive={isActive("/admin/attributes")}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Attributes
              </NavLink>
            </NavItem>
          </NavList>
        </NavSection>
      </Navigation>

      <UserSection>
        <div className="user-info">
          <div className="avatar">
            {user?.first_name?.charAt(0) || user?.email?.charAt(0) || "A"}
          </div>
          <div className="details">
            <div className="name">
              {user?.first_name
                ? `${user.first_name} ${user.last_name}`.trim()
                : user?.email || "Admin User"}
            </div>
            <div className="role">Administrator</div>
          </div>
        </div>
        <LogoutButton onClick={handleSignOut}>Sign Out</LogoutButton>
      </UserSection>
    </SidebarContainer>
  );
};

export default AdminSidebar;
