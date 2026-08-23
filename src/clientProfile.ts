import { useSyncExternalStore } from "react"

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ClientIdentity {
  name: string

  initials: string

  avatarColors: [string, string]

  business: string

  barangay: string

  permit: string

  email: string

  verificationStatus: VerificationStatus
}

export type VerificationStatus = "Verified" | "Pending Review" | "Under Review" | "Rejected"

// ─── Mock data ─────────────────────────────────────────────────────────────────

const DEFAULT_CLIENT: ClientIdentity = {
  name: "Ernesto Dela Vega",

  initials: "ED",

  avatarColors: ["#ECFDF5", "#065F46"],

  business: "Apokon Hardware MSME",

  barangay: "Apokon",

  permit: "DTI-REG-2024-08812",

  email: "ernesto@apokonhardware.com.ph",

  verificationStatus: "Verified",
}

const MOCK_CLIENTS: Record<string, ClientIdentity> = {
  "ernesto@apokonhardware.com.ph": {
    name: "Ernesto Dela Vega",
    initials: "ED",
    avatarColors: ["#ECFDF5", "#065F46"],

    business: "Apokon Hardware MSME",
    barangay: "Apokon",

    permit: "DTI-REG-2024-08812",
    email: "ernesto@apokonhardware.com.ph",

    verificationStatus: "Verified",
  },

  "rvillanueva@davaofrutis.com.ph": {
    name: "Ramon Villanueva",
    initials: "RV",
    avatarColors: ["#EFF6FF", "#1E40AF"],

    business: "Davao Fruits Corp.",
    barangay: "Magugpo West",

    permit: "DTI-REG-2024-08813",
    email: "rvillanueva@davaofrutis.com.ph",

    verificationStatus: "Pending Review",
  },

  "rcamacho@citymalltagum.com": {
    name: "Rowena Camacho",
    initials: "RC",
    avatarColors: ["#F5F3FF", "#5B21B6"],

    business: "CityMall Tagum",
    barangay: "Magugpo West",

    permit: "DTI-REG-2022-11140",
    email: "rcamacho@citymalltagum.com",

    verificationStatus: "Verified",
  },
}

// ─── Store ─────────────────────────────────────────────────────────────────────

let state: ClientIdentity = { ...DEFAULT_CLIENT }

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribeClientStore(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function getClientSnapshot(): ClientIdentity {
  return state
}

export function useClientProfile(): ClientIdentity {
  return useSyncExternalStore(subscribeClientStore, getClientSnapshot)
}

export function clientIdentity(): ClientIdentity {
  return state
}

export function signInAsClient(email?: string) {
  const key = email?.trim().toLowerCase()

  const identity = key ? MOCK_CLIENTS[key] : undefined

  state = identity ? { ...DEFAULT_CLIENT, ...identity } : { ...DEFAULT_CLIENT }

  emit()
}
