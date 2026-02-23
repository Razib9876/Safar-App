import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://thriving-endurance-production.up.railway.app/api",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
