export const getBuildEnv = () => {
  const isBuildTime =
    process.env.NODE_ENV === "production" && !process.env.MONGODB_URI;

  if (isBuildTime) {
    return {
      MONGODB_URI: "",
      NEXTAUTH_SECRET: "build-time-secret",
      NEXTAUTH_URL: "https://aimerztodo.vercel.app",
    };
  }

  return {
    MONGODB_URI: process.env.MONGODB_URI || "",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "https://aimerztodo.vercel.app",
  };
};
