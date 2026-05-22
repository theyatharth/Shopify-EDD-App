import { checkDeliveryServiceability } from "./app/services/shiprocket.server.js";

async function runTest() {
  console.log("🚀 Starting Shiprocket API Test...");
  console.log("Email:", process.env.SHIPROCKET_EMAIL);
  console.log("password:", process.env.SHIPROCKET_PASSWORD);

  try {
    // Testing with the Udaipur pincode
    const result = await checkDeliveryServiceability({
      deliveryPincode: "313002",
      weight: 1
    });

    console.log("\n✅ SUCCESS! Shiprocket responded with:");
    console.log(result);

  } catch (err) {
    console.log("\n❌ ERROR:");
    console.error(err.message);
  }
}

runTest();