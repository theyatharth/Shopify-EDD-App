import { checkDeliveryServiceability } from "../services/shiprocket.server";

export async function loader({ request }) {
  const url = new URL(request.url);
  const pincode = url.searchParams.get("pincode");
  const weight = url.searchParams.get("weight") || 1;

  if (!pincode) {
    return Response.json({
      success: false,
      message: "Pincode required",
    });
  }

  try {
    const result = await checkDeliveryServiceability({
      deliveryPincode: pincode,
      weight,
    });

    return Response.json(result);
  } catch (err) {
    console.error(err);
    return Response.json({
      success: false,
      message: "Server error",
    });
  }
}
