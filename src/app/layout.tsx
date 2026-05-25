"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ApolloWrapper from "@/lib/apolloWrapper";
import "./globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="pt-16">
        <ApolloWrapper>
          <Header />
          {children}
          <Footer />
        </ApolloWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
