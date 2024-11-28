import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DefaultHeader, IdeHeader } from "./headers";
import { DefaultFooter, IdeFooter } from "./footers";

const Header = () => {
  const router = useRouter();

  // Use the custom header only for `/ide`
  const isIdePage = router.pathname === "/ide";

  return isIdePage ? <IdeHeader /> : <DefaultHeader />;
};


// TODO: Fix CSS
const Footer = () => {
    const router = useRouter();

    // Use the custom header only for `/ide`
    const isIdePage = router.pathname === "/ide";
  
    return isIdePage ? <IdeFooter /> : <DefaultFooter />;
}

export { Header, Footer };