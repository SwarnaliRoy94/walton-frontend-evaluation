import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ApolloWrapper from "@/lib/apolloWrapper";
import "./globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="pt-16">
        <Header />
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
