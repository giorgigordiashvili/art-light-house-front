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
import { Address, Cart, OrderCreateRequest } from "@/api/generated/interfaces";
import { cartGet, ordersCreate } from "@/api/generated/api";
import { useRouter, usePathname } from "next/navigation";

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
    };
  };
}

const Checkout: React.FC<CheckoutProps> = ({ dictionary }) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [cart, setCart] = useState<Cart | null>(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch addresses
  const { addresses } = useAddresses();

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoadingCart(true);
        const cartData = await cartGet();
        setCart(cartData);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, []);

  // Get default address or first address
  const defaultAddress = useMemo(() => {
    if (addresses.length === 0) return null;

    // Find default address
    const foundDefault = addresses.find((addr) => addr.is_default === true);
    if (foundDefault) return foundDefault;

    // If no default, return first address
    return addresses[0];
  }, [addresses]);

  // Use selected address or default address
  const currentAddress = selectedAddress || defaultAddress;

  const toggleDelivery = (method: string) => {
    setSelectedDelivery(selectedDelivery === method ? null : method);
  };

  const getDeliverySelected = (method?: string) => selectedDelivery === method;
  const getDeliveryDisabled = (method?: string) =>
    selectedDelivery !== null && selectedDelivery !== method;

  const handleAddressSelect = (address: Address) => {
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

    if (!selectedDelivery) {
      alert("Please select a delivery method");
      return;
    }

    if (!cart || cart.items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      setSubmitting(true);

      // Map delivery method from Georgian to API value
      const deliveryMethodMap: Record<string, string> = {
        "ექსპრეს მოტანა": "express",
        "შემდეგ დღეს მოტანა": "standard",
      };

      const deliveryMethod = deliveryMethodMap[selectedDelivery] || "express";

      // Prepare order data
      const orderData: OrderCreateRequest = {
        delivery_address: currentAddress.id,
        phone_number: phoneNumber,
        delivery_method: deliveryMethod as any,
        delivery_notes: deliveryNotes || "",
        payment_method: "card", // Default to card as per requirement
        items: cart.items.map((item) => ({
          product: item.product,
          quantity: item.quantity || 1,
        })),
        from_cart: true, // User is ordering from cart
      };

      // Create order
      const response = await ordersCreate(orderData);

      console.log("Order created successfully:", response);

      // Redirect to success page
      router.push(`/${locale}/succsess`);
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
                  ? getAddressTypeName(currentAddress.address_type as any)
                  : dictionary?.checkout?.cardTitle1 || "სამსახური"
              }
              desc={
                currentAddress?.address_string ||
                dictionary?.checkout?.cardDescription1 ||
                "5 Petre Kavtaradze Street"
              }
              imageSrc={
                currentAddress
                  ? getAddressTypeIcon(currentAddress.address_type as any)
                  : "/assets/icons/job.svg"
              }
              showChangeButton={true}
              onChangeClick={() => setIsAddressModalOpen(true)}
              dictionary={dictionary?.checkout}
            />

            <CheckoutCard
              label={dictionary?.checkout?.subTitle2 || "გადახდის მეთოდი"}
              method={dictionary?.checkout?.cardTitle2 || "ბარათი"}
              desc={
                dictionary?.checkout?.cardDescription2 ||
                "ტრანზაქციის შემდეგ თქვენი ბარათის მონაცემები შეინახება ბანკის დაცულ სერვერზე"
              }
              imageSrc="/assets/icons/gadaxda.svg"
              showChangeButton={false}
              dictionary={dictionary?.checkout}
            />
          </LeftSection>

          <RightSection>
            <Summery
              dictionary={dictionary?.checkout}
              cart={cart}
              onPayment={handlePayment}
              submitting={submitting || loadingCart}
            />
          </RightSection>
        </CheckoutContent>

        <Label>{dictionary?.checkout?.subTitle3 || "მიწოდება"}</Label>
        <CardsWrapper>
          <DeliveryOptionCard
            method={dictionary?.checkout?.cardTitle3 || "ექსპრეს მოტანა"}
            desc={dictionary?.checkout?.cardDescription3 || "40 წუთიდან 2 საათამდე"}
            imageSrc="/assets/Delivery Icon.svg"
            selected={getDeliverySelected(dictionary?.checkout?.cardTitle3)}
            disabled={getDeliveryDisabled(dictionary?.checkout?.cardTitle3)}
            onSelect={() => toggleDelivery(dictionary?.checkout?.cardTitle3 || "")}
          />
          <DeliveryOptionCard
            method={dictionary?.checkout?.cardTitle4 || "შემდეგ დღეს მოტანა"}
            desc={dictionary?.checkout?.cardDescription4 || "10:00 - დან 13:00 საათამდე"}
            imageSrc="/assets/icons/IconDate.svg"
            selected={getDeliverySelected(dictionary?.checkout?.cardTitle4)}
            disabled={getDeliveryDisabled(dictionary?.checkout?.cardTitle4)}
            onSelect={() => toggleDelivery(dictionary?.checkout?.cardTitle4 || "")}
          />
        </CardsWrapper>

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
              ? getAddressTypeName(currentAddress.address_type as any)
              : dictionary?.checkout?.cardTitle1 || "სამსახური"
          }
          desc={
            currentAddress?.address_string ||
            dictionary?.checkout?.cardDescription1 ||
            "5 Petre Kavtaradze Street"
          }
          imageSrc={
            currentAddress
              ? getAddressTypeIcon(currentAddress.address_type as any)
              : "/assets/icons/job.svg"
          }
          showChangeButton={true}
          onChangeClick={() => setIsAddressModalOpen(true)}
          dictionary={dictionary?.checkout}
        />

        <CheckoutCard
          label={dictionary?.checkout?.subTitle2 || "გადახდის მეთოდი"}
          method={dictionary?.checkout?.cardTitle2 || "ბარათი"}
          desc={
            dictionary?.checkout?.cardDescription2 ||
            "ტრანზაქციის შემდეგ თქვენი ბარათის მონაცემები შეინახება ბანკის დაცულ სერვერზე"
          }
          imageSrc="/assets/icons/gadaxda.svg"
          showChangeButton={false}
          dictionary={dictionary?.checkout}
        />

        <RightSection>
          <Summery
            dictionary={dictionary?.checkout}
            cart={cart}
            onPayment={handlePayment}
            submitting={submitting || loadingCart}
          />
        </RightSection>

        <Label>{dictionary?.checkout?.subTitle3 || "მიწოდება"}</Label>
        <CardsWrapper>
          <DeliveryOptionCard
            method={dictionary?.checkout?.cardTitle3 || "ექსპრეს მოტანა"}
            desc={dictionary?.checkout?.cardDescription3 || "40 წუთიდან 2 საათამდე"}
            imageSrc="/assets/Delivery Icon.svg"
            selected={getDeliverySelected(dictionary?.checkout?.cardTitle3)}
            disabled={getDeliveryDisabled(dictionary?.checkout?.cardTitle3)}
            onSelect={() => toggleDelivery(dictionary?.checkout?.cardTitle3 || "")}
          />
          <DeliveryOptionCard
            method={dictionary?.checkout?.cardTitle4 || "შემდეგ დღეს მოტანა"}
            desc={dictionary?.checkout?.cardDescription4 || "10:00 - დან 13:00 საათამდე"}
            imageSrc="/assets/icons/IconDate.svg"
            selected={getDeliverySelected(dictionary?.checkout?.cardTitle4)}
            disabled={getDeliveryDisabled(dictionary?.checkout?.cardTitle4)}
            onSelect={() => toggleDelivery(dictionary?.checkout?.cardTitle4 || "")}
          />
        </CardsWrapper>

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
    </Container>
  );
};

export default Checkout;
