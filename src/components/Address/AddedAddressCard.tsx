// import React, { useState } from "react";
// import styled from "styled-components";
// import EditIcon from "./EditIcon";
// import EditModal from "./EditModal/EditModal";
// import AddressModal from "./AddressModal/AddressModal";
// import Image from "next/image";

// const StyledContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 62px;
//   width: 367px;
//   height: 100px;
//   background-color: #2a2a2a96;
//   border: 1px solid #ffffff12;
//   border-radius: 10px;
//   padding: 26px 23px 26px 26px;
//   position: relative;
//   @media (max-width: 1080px) {
//     width: 100%;
//     gap: 0;
//     justify-content: space-between;
//   }
// `;

// const StyledContent = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 20px;
// `;

// const StyledPlace = styled.p`
//   font-family: Helvetica;
//   font-weight: 700;
//   font-size: 13px;
//   color: #ffffff;
// `;

// const StyledAddress = styled.p`
//   font-family: Helvetica;
//   font-weight: 400;
//   font-size: 13px;
//   color: #ffffff;
// `;

// const StyledTextWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   min-width: 170px;
//   max-width: 170px;
// `;

// const Overlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
//   background-color: #000000cc;
//   display: flex;
//   justify-content: center;
//   align-items: flex-start;
//   padding-top: 140px;
//   z-index: 9999;
// `;

// const StyledModal = styled.div`
//   @media (max-width: 1080px) {
//     position: fixed;
//     bottom: 0;
//     width: 100%;
//   }
// `;

// type AddressData = {
//   place: string;
//   address: string;
//   additionalInfo?: string;
// };

// const iconMap: Record<string, string> = {
//   სახლი: "/assets/home.svg",
//   სამსახური: "/assets/briefcase.svg",
//   სხვა: "/assets/pin.svg",
// };

// const AddedAddressCard = ({ data }: { data: AddressData }) => {
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
//   const [addressData, setAddressData] = useState<AddressData>(data);

//   const handleEditClick = () => {
//     setIsEditModalOpen(false);
//     setIsAddressModalOpen(true);
//   };

//   const handleSave = (updatedData: AddressData) => {
//     setAddressData(updatedData);
//     setIsAddressModalOpen(false);
//   };

//   return (
//     <StyledContainer>
//       <StyledContent>
//         <Image src={iconMap[addressData.place]} width={24} height={24} alt="icon" />
//         <StyledTextWrapper>
//           <StyledPlace>{addressData.place}</StyledPlace>
//           <StyledAddress>{addressData.address}</StyledAddress>
//         </StyledTextWrapper>
//       </StyledContent>

//       <EditIcon onClick={() => setIsEditModalOpen(!isEditModalOpen)} />

//       {isEditModalOpen && (
//         <EditModal onClose={() => setIsEditModalOpen(false)} onEdit={handleEditClick} />
//       )}

//       {isAddressModalOpen && (
//         <Overlay onClick={() => setIsAddressModalOpen(false)}>
//           <StyledModal onClick={(e) => e.stopPropagation()}>
//             <AddressModal
//               onClose={() => setIsAddressModalOpen(false)}
//               onSave={handleSave}
//               initialData={addressData}
//             />
//           </StyledModal>
//         </Overlay>
//       )}
//     </StyledContainer>
//   );
// };

// export default AddedAddressCard;

import React, { useState } from "react";
import styled from "styled-components";
import EditIcon from "./EditIcon";
import Image from "next/image";
import EditModal from "./EditModal/EditModal";

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 62px;
  width: 367px;
  height: 100px;
  background-color: #2a2a2a96;
  border: 1px solid #ffffff12;
  border-radius: 10px;
  padding: 26px 23px 26px 26px;
  position: relative;
  @media (max-width: 1080px) {
    width: 100%;
    gap: 0;
    justify-content: space-between;
  }
`;

const StyledContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StyledPlace = styled.p`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 13px;
  color: #ffffff;
`;

const StyledAddress = styled.p`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 13px;
  color: #ffffff;
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 170px;
  max-width: 170px;
`;

type AddressData = {
  place: string;
  address: string;
  additionalInfo?: string;
};

const iconMap: Record<string, string> = {
  სახლი: "/assets/home.svg",
  სამსახური: "/assets/briefcase.svg",
  სხვა: "/assets/pin.svg",
};

const AddedAddressCard = ({
  data,
  onEditAddress,
}: {
  data: AddressData;
  onEditAddress: () => void;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <StyledContainer>
      <StyledContent>
        <Image src={iconMap[data.place]} width={24} height={24} alt="icon" />
        <StyledTextWrapper>
          <StyledPlace>{data.place}</StyledPlace>
          <StyledAddress>{data.address}</StyledAddress>
        </StyledTextWrapper>
      </StyledContent>

      <EditIcon onClick={() => setIsEditModalOpen(!isEditModalOpen)} />

      {isEditModalOpen && (
        <EditModal
          onClose={() => setIsEditModalOpen(false)}
          onEdit={() => {
            setIsEditModalOpen(false);
            onEditAddress();
          }}
        />
      )}
    </StyledContainer>
  );
};

export default AddedAddressCard;
