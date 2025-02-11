import {extendTheme} from "@chakra-ui/react";

export const THEME = extendTheme({
    styles: {
        global: {
            "html, body": {
                margin: 0,
                padding: 0,
            },
        },
    },
    colors: {
        brand: {
            50: "#e3f2ff",
            100: "#b3daff",
            200: "#81c2ff",
            300: "#4faaff",
            400: "#1d92ff",
            500: "#0478e6",
            600: "#005caf",
            700: "#004178",
            800: "#002742",
            900: "#000e15",
        },
    },
    components: {
        Modal: {
            baseStyle: {
                dialog: {
                    borderRadius: "24px",
                    bg: "rgba(255,255,255,0.95)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    backdropFilter: "blur(14px)",
                },
            },
        },
        Button: {
            baseStyle: {
                borderRadius: "14px",
                fontWeight: "500",
            },
        },
    },
});


export const getRandomColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
