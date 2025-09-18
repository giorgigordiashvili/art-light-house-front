import styled from "styled-components";
import Image from "next/image";
import { ProductImage } from "@/api/generated/interfaces";

const StyleSmallCard = styled.div`
  width: 120px;
  height: 120px;
  background: #1a1a1a96;
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  overflow: hidden;

  img {
    object-fit: cover;
    border-radius: 17px;
  }

  @media (max-width: 1080px) {
    width: 64px;
    height: 64px;
  }
`;

const SmallCard = ({ image }: { image: ProductImage }) => {
  // Check if we have a valid image URL
  const hasValidImage = image.image && typeof image.image === "string" && image.image.trim() !== "";

  if (!hasValidImage) {
    return (
      <StyleSmallCard>
        <div
          style={{
            color: "#ffffff40",
            fontSize: "12px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          No image
        </div>
      </StyleSmallCard>
    );
  }

  return (
    <StyleSmallCard>
      <Image
        src={image.image}
        alt={image.alt_text || "Product image"}
        fill
        style={{ objectFit: "cover" }}
      />
    </StyleSmallCard>
  );
};

export default SmallCard;
