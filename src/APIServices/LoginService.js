// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_URL = "https://bcssprojects.in/Saathi/public/api/po-login";

// export const loginUser = async (poid, password) => {
//   try {
//     const response = await axios.post(API_URL, {
//       poid,
//       password,
//     });

//     if (response.data.success) {
//       const { token, user } = response.data; // Ensure the API returns user details
//       await AsyncStorage.setItem("authToken", token);
//       await AsyncStorage.setItem("userDetails", JSON.stringify(user)); // Store user details
//       return { success: true, user };
//     } else {
//       return { success: false, message: response.data.message };
//     }
//   } catch (error) {
//     return { success: false, message: error.response?.data?.message || "Login failed" };
//   }
// };
