import React from "react";
import Image from "next/image";

const TrashIcon = () => {
  return <Image src={"/assets/DeleteIcon.svg"} width={18} height={18} alt="trash-bin" />;
};

export default TrashIcon;
