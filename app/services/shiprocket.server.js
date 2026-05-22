import axios from "axios";
import { SHIPROCKET_CREDS } from "../../secrets.js";

let shiprocketToken = null;
let tokenExpiry = null;

async function getShiprocketToken() {

  // reuse token if valid
  if (
    shiprocketToken &&
    tokenExpiry &&
    new Date() < tokenExpiry
  ) {
    return shiprocketToken;
  }

  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: SHIPROCKET_CREDS.email,
      password: SHIPROCKET_CREDS.password
    }
  );

  shiprocketToken = response.data.token;

  // token valid ~10 days usually
  tokenExpiry = new Date(
    Date.now() + 9 * 24 * 60 * 60 * 1000
  );

  return shiprocketToken;
}

export async function checkDeliveryServiceability({
  deliveryPincode,
  weight = 1,
  cod = 0,
}) {

  const token = await getShiprocketToken();

  const response = await axios.get(
    "https://apiv2.shiprocket.in/v1/external/courier/serviceability/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },

      params: {
        pickup_postcode: SHIPROCKET_CREDS.PICKUP_PINCODE,
        delivery_postcode: deliveryPincode,
        weight,
        cod,
      },
    }
  );

  const data = response.data.data;

  const recommendedCourierId =
    data.shiprocket_recommended_courier_id;

  const courier =
    data.available_courier_companies.find(
      (c) =>
        c.courier_company_id ===
        recommendedCourierId
    );

  if (!courier) {
    return {
      success: false,
      message: "Delivery unavailable",
    };
  }

  return {
    success: true,
    etd: courier.etd,
    days: courier.estimated_delivery_days,
  };
}