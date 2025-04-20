"use client"

import { jwtDecode } from "jwt-decode"

const getUser = () => {
  const token = localStorage.getItem("token")
  const user = token ? jwtDecode(token) : null
  return user
}

export default getUser