import styled from "styled-components";
import Image from "next/image";
import { useParams } from "next/navigation";
import type { Order } from "@/api/generated/interfaces";

const DeliveryCard = styled.div`
  display: flex;
  align-items: center;
  background: #2a2a2a96;
  padding: 24px;
  border-radius: 17px;
  color: white;
  width: 100%;
  max-width: 349px;
  height: 96px;
  position: relative;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 30px;
  border: 1px solid #ffffff1a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  margin-left: 13px;
`;

const Title = styled.span`
  font-family: Helvetica;
  font-weight: 300;
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 3px;
`;

const Time = styled.span`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
`;

interface DeliveryProps {
  dictionary?: any;
  order?: Order;
}

// Helper to safely resolve localized fields that may arrive as {en: string, ka: string}
function resolveLocalized(value: any, lang: string): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  // Backend uses 'ka' for Georgian while frontend route uses 'ge'
  const backendLang = lang === "ge" ? "ka" : lang;
  return (
    value[backendLang] ||
    value[lang] ||
    value.en ||
    (Object.values(value).find((v) => typeof v === "string") as string | undefined) ||
    ""
  );
}

function formatDeliveryDate(date: string, lang: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(lang === "en" ? "en-US" : "ka-GE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const Delivery = ({ dictionary, order }: DeliveryProps) => {
  const params = useParams();
  const lang = (params?.lang as string) || "ge";

  // If no order provided, show placeholder
  if (!order) {
    return (
      <DeliveryCard>
        <IconWrapper>
          <Image src={"/assets/Delivery Icon.svg"} alt="icon" width={24} height={24} />
        </IconWrapper>
        <InfoWrapper>
          <Title>{dictionary?.succsessOrder?.expressTitle || "Express delivery"}</Title>
          <Time>{dictionary?.succsessOrder?.expressTime || "40 minutes to 2 hours"}</Time>
        </InfoWrapper>
      </DeliveryCard>
    );
  }

  // shipping_method_details may be null for older orders despite the generated type
  const shippingMethod = order.shipping_method_details as Order["shipping_method_details"] | null;

  const title =
    resolveLocalized(shippingMethod?.name, lang) ||
    dictionary?.succsessOrder?.expressTitle ||
    "Express delivery";

  const subtitle = shippingMethod?.estimated_days
    ? `${shippingMethod.estimated_days} ${dictionary?.checkout?.estimatedDays || "დღე"}`
    : order.estimated_delivery_date
      ? formatDeliveryDate(order.estimated_delivery_date, lang)
      : resolveLocalized(shippingMethod?.description, lang) ||
        dictionary?.succsessOrder?.expressTime ||
        "40 minutes to 2 hours";

  return (
    <DeliveryCard>
      <IconWrapper>
        <Image src={"/assets/Delivery Icon.svg"} alt="icon" width={24} height={24} />
      </IconWrapper>
      <InfoWrapper>
        <Title>{title}</Title>
        <Time>{subtitle}</Time>
      </InfoWrapper>
    </DeliveryCard>
  );
};

export default Delivery;
