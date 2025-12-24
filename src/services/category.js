import { request } from "../utils/axios"

export const getAllCategories = () => {
   return request({ method: "get", url: "/category/" })
}