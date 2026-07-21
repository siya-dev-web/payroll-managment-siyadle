export const APP_NAME = "PayRoll Pro";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/employees", label: "Employees", icon: "group" },
  { href: "/payroll", label: "Payroll", icon: "payments" },
  { href: "/settings/profile", label: "Profile", icon: "account_circle" },
  { href: "/settings/compliance", label: "Settings", icon: "settings" },
] as const;

export const DEPARTMENTS = [
  "All Departments",
  "Engineering",
  "Product",
  "Design",
  "Marketing",
] as const;

export const EMPLOYEE_STATUSES = ["All Status", "Active", "On Leave", "Terminated"] as const;

export const DEFAULT_USER = {
  name: "Siyadle Dubale",
  role: "Admin User",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAmUcV1TwFj11aKDykuMpw6xQXLd1E3HCIdH4dfSeINckatez8xwWKDKDeYCXFCMSKKyPVxBaPDK8NX_AHmmN4pNIHVzpfCw2GqK03sPKzQE1hddHQMQXW7BgLRlq1b595OHjqD1rBHRZ6hy3WCwIbWUdaDonSwkIkEW36LIDOTa-UCgTTti7Ex_a-xgat1CGfVYNriE8aeHtDg7bLr-LqwfhJAmXwXuMPR_bRD12-arl9m8twzdtUUL1ExPaGuSbAQFAxv0qdjPHM",
};

export const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCO-XVoPCDF5erRxj2uj33-2jmnuu9otulDVKxh8AjPs4KJrqkFLKkOfS_RrRKFKIoscSaRdGCUqI7Y8udfrCkfU5H1ZU9qYpsOWOG1K2b7fxZ5V2A4uLE5WbcfDKA9wyD7fhcLW2H9hL8ZW6A7Vq6NoSqDADA6xHKjhSWnBKCmP_RVjKT2SX59xb9KTpUlOw1-S1OSY8b0RnVMcYZC5jNqPpDZIa1eXxALpITjzhSBwGb50rpRrrikGofGdyPQYv8XKfAleFstdSg";
