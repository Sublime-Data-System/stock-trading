import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useCreateAlert = (user: any) => {
  const createChart = async (data: any) => {
    const accessToken = user?.accessToken;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (accessToken) {
      await axios.post(`${API_URL}/stock/alert`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } else {
      throw new Error("Access token is missing");
    }
  };
  const onSuccess = () => {
    alert("Alert created successfully");
  };

  return useMutation({
    mutationFn: createChart,
    onSuccess,
  });
};

export default useCreateAlert;
