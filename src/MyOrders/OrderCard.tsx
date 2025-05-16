"use client";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const Card = styled.div`
  display: flex;
  align-items: center;
  background: #2a2a2a96;
  padding: 27px 25px;
  border-radius: 10px;
  color: white;
  width: 100%;
  position: relative;
  height: 79px;
  cursor: pointer;
`;

const Id = styled.span`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
  margin-right: 12px;
`;

const Divider = styled.div`
  width: 1px;
  height: 16px;
  background-color: #ffffff;
  opacity: 0.2;
`;

const Date = styled.span`
  font-family: Helvetica;
  font-weight: 300;
  font-size: 16px;
  color: #ffffff;
  margin-left: 12px;
  flex-grow: 1;
`;

const Details = styled.span`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 16px;
  line-height: 159%;
  color: #ffcb40;
  margin-right: 12px;
`;

const OrderCard = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/orderdetail");
  };

  return (
    <Card onClick={handleClick}>
      <Id>#22435</Id>
      <Divider />
      <Date>22 დეკემბერი</Date>
      <Details>დეტალურად</Details>
    </Card>
  );
};

export default OrderCard;
