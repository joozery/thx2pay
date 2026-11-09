"use client";

import { createContext, useContext } from "react";
import { fallbackRates, type ExchangeRates } from "./currency";

export const RatesContext = createContext<ExchangeRates>(fallbackRates);
export const useExchangeRates = () => useContext(RatesContext);
