"use client";
import styled from "styled-components";
import { useState, useMemo, useEffect } from "react";
import CheckoutCard from "@/components/Checkout/CheckoutCard";
import DeliveryOptionCard from "@/components/Checkout/DeliveryOptionCard";
import InputWithLabel from "@/components/Profile/Input";
import TextContainer from "@/components/Checkout/TextContainer";
import Summery from "@/components/CartPage/Summary";
import AddressSelectionModal from "@/components/Checkout/AddressSelectionModal";
import { useAddresses } from "@/hooks/useAddresses";
import PaymentMethodSelectionModal from "@/components/Checkout/PaymentMethodSelectionModal";
import { PaymentMethodData } from "@/types";
import {
  ClientAddress,
  Cart,
  OrderCreateRequest,
  ShippingMethod,
} from "@/api/generated/interfaces";
import {
  ecommerceClientCartGetOrCreateRetrieve,
  ecommerceClientOrdersCreate,
  ecommerceClientCardsRetrieve,
  ecommerceClientShippingMethodsList,
  getStoreTheme,
} from "@/api/generated/api";
import { useRouter, usePathname } from "next/navigation";

// --------------- styled components ---------------
const Container = styled.div`
  width: 100%;
  max-width: 1292px;
  @media (max-width: 1080px) {
    max-width: 100%;
    padding: 0 16px;
  }
`;

const DesktopWrapper = styled.div`
  padding: 20px;
  @media (max-width: 1080px) {
    display: none;
  }
`;

const MobileWrapper = styled.div`
  display: none;
  @media (max-width: 1080px) {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
`;

const PageTitle = styled.h1`
  font-family: "Helvetica";
  font-weight: 250;
  font-size: 64px;
  line-height: 33.8px;
  color: white;
  margin-bottom: 36px;
  @media (max-width: 1080px) {
    font-size: 34px;
    line-height: 20px;
    margin-bottom: 32px;
  }
`;

const Label = styled.p`
  font-family: Helvetica;
  font-weight: 500;
  font-size: 18px;
  line-height: 33.8px;
  color: #ffffff;
  margin-top: 38px;
  margin-bottom: 18px;
  @media (max-width: 1080px) {
    margin-top: 34px;
    font-size: 16px;
  }
`;

const CardsWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 38px;
  @media (max-width: 1080px) {
    flex-direction: column;
  }
`;

const CheckoutContent = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  @media (max-width: 1080px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RightSection = styled.div`
  width: 100%;
  max-width: 472px;
  margin-top: 25px;
  @media (max-width: 1080px) {
    margin-top: 34px;
  }
`;

const PaymentTypeSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
  margin-bottom: 24px;
`;

const PaymentTypeOption = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  background: ${({ $selected }) => ($selected ? "#2a2a2a" : "#1a1a1a96")};
  border: 1px solid ${({ $selected }) => ($selected ? "#FFCB40" : "#ffffff12")};
  border-radius: 12px;
  padding: 18px 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ffffff40;
  }
`;

const RadioCircle = styled.div<{ $selected: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ $selected }) => ($selected ? "#FFCB40" : "#fff")};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::after {
    content: "";
    width: 7.5px;
    height: 7.5px;
    background-color: ${({ $selected }) => ($selected ? "#FFCB40" : "transparent")};
    border-radius: 50%;
  }
`;

const PaymentTypeLabel = styled.div`
  flex: 1;
`;

const PaymentTypeTitle = styled.div`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 14px;
  color: #ffffff;
`;

const PaymentTypeDesc = styled.div`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 12px;
  color: #ffffff99;
  margin-top: 2px;
`;

// --------------- types ---------------
type PaymentType = "card" | "cash_on_delivery";

interface CheckoutProps {
  dictionary?: {
    checkout?: {
      title?: string;
      subTitle1?: string;
      subTitle2?: string;
      subTitle3?: string;
      subTitle4?: string;
      subTitle5?: string;
      cardTitle1?: string;
      cardTitle2?: string;
      cardTitle3?: string;
      cardTitle4?: string;
      cardDescription1?: string;
      cardDescription2?: string;
      cardDescription3?: string;
      cardDescription4?: string;
      placeholder1?: string;
      placeholder2?: string;
      changeButton?: string;
      selectAddress?: string;
      noAddresses?: string;
      defaultAddress?: string;
      addressTypeWork?: string;
      addressTypeHome?: string;
      addressTypeOther?: string;
      summary?: string;
      productPrice?: string;
      deliveryService?: string;
      serviceCommision?: string;
      paymentButton?: string;
      freeShipping?: string;
      cardPayment?: string;
      cardPaymentDesc?: string;
      cashOnDelivery?: string;
      cashOnDeliveryDesc?: string;
      shippingMethod?: string;
      estimatedDays?: string;
    };
  };
}

// --------------- component ---------------
const Checkout: React.FC<CheckoutProps> = ({ dictionary }) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  // Core state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<ClientAddress | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [cart, setCart] = useState<Cart | null>(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Payment method state
  const [paymentType, setPaymentType] = useState<PaymentType>("card");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);

  // Payment config from store theme
  const [showCardPayment, setShowCardPayment] = useState(true);
  const [showCashOnDelivery, setShowCashOnDelivery] = useState(false);

  // Shipping method state
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<number | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Fetch addresses
  const { addresses } = useAddresses();

  // Fetch store theme / payment config
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const theme = await getStoreTheme();
        const paymentConfig = theme?.payment;
        const cardEnabled = paymentConfig?.enable_card_payment ?? true;
        const codEnabled = paymentConfig?.enable_cash_on_delivery ?? false;
        setShowCardPayment(cardEnabled);
        setShowCashOnDelivery(codEnabled);
        // Set default payment type
        if (cardEnabled) {
          setPaymentType("card");
        } else if (codEnabled) {
          setPaymentType("cash_on_delivery");
        }
      } catch {
        // Default to card payment if theme fetch fails
      }
    };
    fetchTheme();
  }, []);

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoadingCart(true);
        const cartData = await ecommerceClientCartGetOrCreateRetrieve();
        const normalized = (cartData as any)?.cart ? (cartData as any).cart : cartData;
        setCart(normalized as Cart);
      } catch {
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCart();
  }, []);

  // Fetch payment methods (cards)
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoadingCards(true);
        const response = await ecommerceClientCardsRetrieve();
        if (response && Array.isArray(response)) {
          const transformed: PaymentMethodData[] = response.map((card: any) => ({
            id: card.id?.toString() || "",
            cardType: (card.card_type?.toLowerCase() === "mastercard"
              ? "mastercard"
              : card.card_type?.toLowerCase() === "amex"
                ? "amex"
                : "visa") as "visa" | "mastercard" | "amex",
            cardNumber: card.masked_card_number || "",
            cvv: "",
            expiry: card.card_expiry || "",
            lastFourDigits: card.masked_card_number?.slice(-4) || "",
          }));
          setPaymentMethods(transformed);
          const defaultCard = (response as any).find((c: any) => c.is_default) || transformed[0];
          if (defaultCard) setSelectedPaymentMethodId(defaultCard.id?.toString() || null);
        }
      } catch (e) {
        console.error("Failed to fetch payment methods", e);
        setPaymentMethods([]);
      } finally {
        setLoadingCards(false);
      }
    };
    fetchCards();
  }, []);

  // Fetch shipping methods
  useEffect(() => {
    const fetchShipping = async () => {
      try {
        setLoadingShipping(true);
        const response = await ecommerceClientShippingMethodsList();
        const methods = (response.results || []).filter((m) => m.is_active !== false);
        setShippingMethods(methods);
        if (methods.length > 0) {
          setSelectedShippingMethodId(methods[0].id);
        }
      } catch {
        setShippingMethods([]);
      } finally {
        setLoadingShipping(false);
      }
    };
    fetchShipping();
  }, []);

  // Default address
  const defaultAddress = useMemo(() => {
    if (addresses.length === 0) return null;
    const foundDefault = addresses.find((addr) => addr.is_default === true);
    return foundDefault || addresses[0];
  }, [addresses]);

  const currentAddress = selectedAddress || defaultAddress;

  // Selected shipping method
  const selectedShippingMethod = useMemo(
    () => shippingMethods.find((m) => m.id === selectedShippingMethodId) || null,
    [shippingMethods, selectedShippingMethodId]
  );

  // Calculate shipping cost (with free shipping threshold)
  const subtotal = cart?.total_amount ? parseFloat(String(cart.total_amount)) : 0;
  const shippingCost = useMemo(() => {
    if (!selectedShippingMethod) return 0;
    const threshold = selectedShippingMethod.free_shipping_threshold
      ? parseFloat(selectedShippingMethod.free_shipping_threshold)
      : null;
    if (threshold !== null && subtotal >= threshold) return 0;
    return parseFloat(selectedShippingMethod.price ?? "0");
  }, [selectedShippingMethod, subtotal]);

  // Address helpers
  const handleAddressSelect = (address: ClientAddress) => {
    setSelectedAddress(address);
    setIsAddressModalOpen(false);
  };

  const getAddressTypeIcon = (type?: string) => {
    switch (type) {
      case "work":
        return "/assets/icons/job.svg";
      case "home":
        return "/assets/home.svg";
      default:
        return "/assets/addressIcon.svg";
    }
  };

  const getAddressTypeName = (type?: string) => {
    switch (type) {
      case "work":
        return dictionary?.checkout?.addressTypeWork || "სამსახური";
      case "home":
        return dictionary?.checkout?.addressTypeHome || "სახლი";
      default:
        return dictionary?.checkout?.addressTypeOther || "სხვა";
    }
  };

  // Handle payment/order creation
  const handlePayment = async () => {
    if (!currentAddress) {
      alert("Please select a delivery address");
      return;
    }

    if (!phoneNumber.trim()) {
      alert("Please enter a phone number");
      return;
    }

    if (paymentType === "card" && paymentMethods.length > 0 && !selectedPaymentMethodId) {
      alert("Please select a payment card");
      return;
    }

    if (!cart || cart.items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      setSubmitting(true);

      const orderData: OrderCreateRequest = {
        cart_id: cart.id,
        delivery_address_id: currentAddress.id,
        notes: deliveryNotes || "",
        ...(selectedShippingMethodId ? { shipping_method_id: selectedShippingMethodId } : {}),
        ...(paymentType === "card" && selectedPaymentMethodId
          ? { card_id: parseInt(selectedPaymentMethodId, 10) }
          : {}),
      };

      const response: any = await ecommerceClientOrdersCreate(orderData);

      const paymentUrl = response?.payment_url;
      if (paymentUrl) {
        window.location.href = paymentUrl;
        return;
      }

      // Cash on delivery or no payment URL — go to success page
      router.push(`/${locale}/succsess`);
    } catch (e) {
      console.error("Order creation failed", e);
      alert("Failed to create order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Payment method display helpers
  const selectedPaymentMethod =
    paymentMethods.find((pm) => pm.id === selectedPaymentMethodId) || null;

  const getCardLogo = (cardType?: string) => {
    switch (cardType) {
      case "visa":
        return "/assets/visa-logo.svg";
      case "mastercard":
        return "/assets/mastercard-logo.svg";
      case "amex":
        return "/assets/amex-logo.svg";
      default:
        return "/assets/paymentIcon.svg";
    }
  };

  const maskNumber = (pm: PaymentMethodData) => {
    const last4 = pm.lastFourDigits || pm.cardNumber.slice(-4);
    return `✲✲✲✲ ✲✲✲✲ ✲✲✲✲  ${last4}`;
  };

  const paymentMethodLabel = selectedPaymentMethod
    ? maskNumber(selectedPaymentMethod)
    : loadingCards
      ? "Loading cards..."
      : paymentMethods.length === 0
        ? "No cards saved"
        : "Select card";

  const paymentMethodTitle = selectedPaymentMethod
    ? dictionary?.checkout?.cardTitle2 || "ბარათი"
    : dictionary?.checkout?.cardTitle2 || "ბარათი";

  // Shipping method display helper
  const getShippingMethodName = (method: ShippingMethod) => {
    if (!method.name) return `Shipping #${method.id}`;
    if (typeof method.name === "string") return method.name;
    const apiLang = locale === "en" ? "en" : "ka";
    return method.name[apiLang] || method.name.ka || method.name.en || `Shipping #${method.id}`;
  };

  const getShippingMethodDesc = (method: ShippingMethod) => {
    if (method.estimated_days) {
      return `${method.estimated_days} ${dictionary?.checkout?.estimatedDays || "დღე"}`;
    }
    if (!method.description) return "";
    if (typeof method.description === "string") return method.description;
    const apiLang = locale === "en" ? "en" : "ka";
    return method.description[apiLang] || method.description.ka || method.description.en || "";
  };

  const getShippingMethodPrice = (method: ShippingMethod) => {
    const threshold = method.free_shipping_threshold
      ? parseFloat(method.free_shipping_threshold)
      : null;
    if (threshold !== null && subtotal >= threshold) {
      return dictionary?.checkout?.freeShipping || "უფასო";
    }
    const price = parseFloat(method.price ?? "0");
    return price === 0 ? dictionary?.checkout?.freeShipping || "უფასო" : `${price.toFixed(2)} ₾`;
  };

  // Payment type selection section
  const renderPaymentTypeSection = () => (
    <>
      <Label>{dictionary?.checkout?.subTitle2 || "გადახდის მეთოდი"}</Label>
      <PaymentTypeSelector>
        {showCardPayment && (
          <PaymentTypeOption
            $selected={paymentType === "card"}
            onClick={() => setPaymentType("card")}
          >
            <RadioCircle $selected={paymentType === "card"} />
            <PaymentTypeLabel>
              <PaymentTypeTitle>
                {dictionary?.checkout?.cardPayment || "ბარათით გადახდა"}
              </PaymentTypeTitle>
              <PaymentTypeDesc>
                {dictionary?.checkout?.cardPaymentDesc || "გადაიხადეთ ბარათით უსაფრთხოდ"}
              </PaymentTypeDesc>
            </PaymentTypeLabel>
          </PaymentTypeOption>
        )}
        {showCashOnDelivery && (
          <PaymentTypeOption
            $selected={paymentType === "cash_on_delivery"}
            onClick={() => setPaymentType("cash_on_delivery")}
          >
            <RadioCircle $selected={paymentType === "cash_on_delivery"} />
            <PaymentTypeLabel>
              <PaymentTypeTitle>
                {dictionary?.checkout?.cashOnDelivery || "ნაღდი ანგარიშსწორება"}
              </PaymentTypeTitle>
              <PaymentTypeDesc>
                {dictionary?.checkout?.cashOnDeliveryDesc || "გადაიხადეთ შეკვეთის მიღებისას"}
              </PaymentTypeDesc>
            </PaymentTypeLabel>
          </PaymentTypeOption>
        )}
      </PaymentTypeSelector>
    </>
  );

  // Card selection section (only if card payment is selected)
  const renderCardSection = () => {
    if (paymentType !== "card") return null;
    return (
      <CheckoutCard
        label={dictionary?.checkout?.cardTitle2 || "ბარათი"}
        method={paymentMethodTitle}
        desc={paymentMethodLabel}
        imageSrc={getCardLogo(selectedPaymentMethod?.cardType)}
        showChangeButton={paymentMethods.length > 0}
        onChangeClick={() => setIsPaymentMethodModalOpen(true)}
        dictionary={dictionary?.checkout}
      />
    );
  };

  // Shipping methods section
  const renderShippingSection = () => {
    if (shippingMethods.length === 0 && !loadingShipping) {
      // Fallback: no shipping methods from API, keep existing hardcoded UI for backward compat
      return null;
    }

    if (loadingShipping) {
      return (
        <>
          <Label>
            {dictionary?.checkout?.shippingMethod || dictionary?.checkout?.subTitle3 || "მიწოდება"}
          </Label>
          <CardsWrapper>
            <DeliveryOptionCard
              method="..."
              desc="იტვირთება..."
              imageSrc="/assets/Delivery Icon.svg"
              selected={false}
              onSelect={() => {}}
            />
          </CardsWrapper>
        </>
      );
    }

    return (
      <>
        <Label>
          {dictionary?.checkout?.shippingMethod || dictionary?.checkout?.subTitle3 || "მიწოდება"}
        </Label>
        <CardsWrapper>
          {shippingMethods.map((method) => (
            <DeliveryOptionCard
              key={method.id}
              method={getShippingMethodName(method)}
              desc={`${getShippingMethodDesc(method)} — ${getShippingMethodPrice(method)}`}
              imageSrc="/assets/Delivery Icon.svg"
              selected={selectedShippingMethodId === method.id}
              disabled={false}
              onSelect={() => setSelectedShippingMethodId(method.id)}
            />
          ))}
        </CardsWrapper>
      </>
    );
  };

  const summaryDictionary = {
    ...dictionary?.checkout,
    summary: dictionary?.checkout?.summary || "შეჯამება",
    productPrice: dictionary?.checkout?.productPrice || "პროდუქტის ღირებულება",
    deliveryService: dictionary?.checkout?.deliveryService || "მიტანის სერვისი",
    serviceCommision: dictionary?.checkout?.serviceCommision || "სერვისის საკომისიო",
    paymentButton: dictionary?.checkout?.paymentButton || "გადახდა",
    freeShipping: dictionary?.checkout?.freeShipping || "უფასო",
  };

  return (
    <Container>
      <DesktopWrapper>
        <PageTitle>{dictionary?.checkout?.title || "შეკვეთის გაფორმება"}</PageTitle>

        <CheckoutContent>
          <LeftSection>
            <CheckoutCard
              label={dictionary?.checkout?.subTitle1 || "მისამართი"}
              method={
                currentAddress
                  ? getAddressTypeName(currentAddress.label as any)
                  : dictionary?.checkout?.cardTitle1 || "სამსახური"
              }
              desc={
                (currentAddress
                  ? `${currentAddress.address}${currentAddress.city ? ", " + currentAddress.city : ""}`
                  : undefined) ||
                dictionary?.checkout?.cardDescription1 ||
                "5 Petre Kavtaradze Street"
              }
              imageSrc={
                currentAddress
                  ? getAddressTypeIcon(currentAddress.label as any)
                  : "/assets/icons/job.svg"
              }
              showChangeButton={true}
              onChangeClick={() => setIsAddressModalOpen(true)}
              dictionary={dictionary?.checkout}
            />

            {renderPaymentTypeSection()}
            {renderCardSection()}
          </LeftSection>

          <RightSection>
            <Summery
              dictionary={summaryDictionary}
              cart={cart}
              onPayment={handlePayment}
              submitting={submitting || loadingCart}
              shippingCost={shippingCost}
            />
          </RightSection>
        </CheckoutContent>

        {renderShippingSection()}

        <InputWithLabel
          icon="/assets/icons/phone icon.svg"
          label={dictionary?.checkout?.subTitle4 || "ტელეფონი"}
          placeholder={dictionary?.checkout?.placeholder1 || "შეიყვანეთ ტელეფონის ნომერი"}
          gap={18}
          value={phoneNumber}
          onChange={setPhoneNumber}
        />

        <Label>{dictionary?.checkout?.subTitle5 || "დამატებითი ინფორმაცია"}</Label>
        <TextContainer
          placeholder={dictionary?.checkout?.placeholder2 || "დამატებითი ინფორმაცია"}
          value={deliveryNotes}
          onChange={(e) => setDeliveryNotes(e.target.value)}
        />
      </DesktopWrapper>

      <MobileWrapper>
        <PageTitle>{dictionary?.checkout?.title || "შეკვეთის გაფორმება"}</PageTitle>

        <CheckoutCard
          label={dictionary?.checkout?.subTitle1 || "მისამართი"}
          method={
            currentAddress
              ? getAddressTypeName(currentAddress.label as any)
              : dictionary?.checkout?.cardTitle1 || "სამსახური"
          }
          desc={
            (currentAddress
              ? `${currentAddress.address}${currentAddress.city ? ", " + currentAddress.city : ""}`
              : undefined) ||
            dictionary?.checkout?.cardDescription1 ||
            "5 Petre Kavtaradze Street"
          }
          imageSrc={
            currentAddress
              ? getAddressTypeIcon(currentAddress.label as any)
              : "/assets/icons/job.svg"
          }
          showChangeButton={true}
          onChangeClick={() => setIsAddressModalOpen(true)}
          dictionary={dictionary?.checkout}
        />

        {renderPaymentTypeSection()}
        {renderCardSection()}

        <RightSection>
          <Summery
            dictionary={summaryDictionary}
            cart={cart}
            onPayment={handlePayment}
            submitting={submitting || loadingCart}
            shippingCost={shippingCost}
          />
        </RightSection>

        {renderShippingSection()}

        <InputWithLabel
          icon="/assets/icons/phone icon.svg"
          label={dictionary?.checkout?.subTitle4 || "ტელეფონი"}
          placeholder={dictionary?.checkout?.placeholder1 || "შეიყვანეთ ტელეფონის ნომერი"}
          gap={18}
          value={phoneNumber}
          onChange={setPhoneNumber}
        />

        <Label>{dictionary?.checkout?.subTitle5 || "დამატებითი ინფორმაცია"}</Label>
        <TextContainer
          placeholder={dictionary?.checkout?.placeholder2 || "დამატებითი ინფორმაცია"}
          value={deliveryNotes}
          onChange={(e) => setDeliveryNotes(e.target.value)}
        />
      </MobileWrapper>

      {/* Address Selection Modal */}
      {isAddressModalOpen && (
        <AddressSelectionModal
          addresses={addresses}
          currentAddressId={currentAddress?.id || null}
          onSelect={handleAddressSelect}
          onClose={() => setIsAddressModalOpen(false)}
          dictionary={dictionary?.checkout}
        />
      )}
      {isPaymentMethodModalOpen && (
        <PaymentMethodSelectionModal
          cards={paymentMethods}
          currentCardId={selectedPaymentMethodId}
          onSelect={(pm) => {
            setSelectedPaymentMethodId(pm.id || null);
            setIsPaymentMethodModalOpen(false);
          }}
          onClose={() => setIsPaymentMethodModalOpen(false)}
          dictionary={dictionary?.checkout}
        />
      )}
    </Container>
  );
};

export default Checkout;
