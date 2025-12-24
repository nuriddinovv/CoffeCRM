import { request } from "../utils/axios"

export const getAllProducts = () => {
   return request({ method: "get", url: "/product/" })
}