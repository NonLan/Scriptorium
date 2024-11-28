import React from "react";
import Head from "next/head";
import IDE from "./IDE";


export default function Editor() {
  return (
    <>
      <Head>
        <title>IDE</title>
      </Head>

      <main>
        <IDE />
      </main>
    </>
  );
}
