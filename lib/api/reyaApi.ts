import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
export const getCurrentAmmPositions = async (
  market_index: number = 0,
  token: string,
  signout: () => void
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/position/amm-position?market_index=${market_index}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (res.status === 401) {
    signout();
  }
  return res.data;
};
export const pnlSinceInception = async (
  market_index: number = 0,
  token: string,
  signout: () => void
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/position/pnl-inception?market_index=${market_index}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (res.status === 401) {
    signout();
  }
  return res.data;
};
export const pnlForHedge = async (
  market_index: number = 0,
  token: string,
  signout: () => void
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/position/pnl-hedge-new?market_index=${market_index}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (res.status === 401) {
    signout();
  }
  return res.data;
};
export const hedgingPosition = async (
  market_index: number = 0,
  skip: number = 0,
  token: string,
  signout: () => void
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/position/hedge?market_index=${market_index}&skip=${skip}&limit=10`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (res.status === 401) {
    signout();
  }
  return res.data;
};
export const ammUniquePositions = async (
  market_index: number = 0,
  skip: number = 0,
  token: string,
  signOut: () => void
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/position/amm-unique-position?market_index=${market_index}&skip=${skip}&limit=10`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (res.status === 401) {
    signOut();
  }
  return res.data;
};
export const marketList = async (token: string, signOut: () => void) => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/market`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    signOut();
  }
  return res.data;
};
export const getHyperliquidFees = async (signOut: () => void) => {
  const res = await axios.post(
    `https://api.hyperliquid.xyz/info`,
    {
      aggregateByTime: true,
      type: "userFills",
      user: "0x726c091873c0EDF2119E7e2D9995e5ffC8c9c002",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status === 401) {
    signOut();
  }
  console.log("feesData", res.data);
  return res.data;
};
