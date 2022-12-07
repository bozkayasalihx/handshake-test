import { ChakraProvider, Colors, extendTheme } from "@chakra-ui/react";
import Layout from "@src/components/layout/Layout";
import "locales";
import { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "store";
import "../styles/globals.css";

const colors: Colors = {
    brand: {
        900: "#1a365d",
        800: "#153e75",
        700: "#2a69ac",
    },
};

const theme = extendTheme({ colors });

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            {/* @ts-ignore */}
            <PersistGate loading={null} persistor={persistor}>
                <ChakraProvider theme={theme}>
                    <>
                        <Head>
                            <link
                                rel="preconnect"
                                href="https://fonts.googleapis.com"
                            />
                            <link
                                rel="preconnect"
                                href="https://fonts.gstatic.com"
                            />
                            <link
                                href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
                                rel="stylesheet"
                            />
                        </Head>
                        <Layout>
                            {/* @ts-ignore */}
                            <Component {...pageProps} />
                        </Layout>
                    </>
                </ChakraProvider>
            </PersistGate>
        </Provider>
    );
}

export default MyApp;
