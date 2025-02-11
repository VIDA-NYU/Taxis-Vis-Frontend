import React from "react";
import {Button, Box} from "@chakra-ui/react";

export function ConfigButton({children, className, ...props}) {
    return (
        <Button
            className={className || "config_modal_primary-button"}
            borderRadius="50px"
            fontWeight="600"
            fontSize="1rem"
            px="20px"
            py="12px"
            marginTop="10px"
            bgGradient="linear(to-r, #0A84FF, #007AFF)"
            color="white"
            _hover={{
                bgGradient: "linear(to-r, #007AFF, #005BBB)",
                transform: "translateY(-2px)",
                boxShadow: "0px 8px 20px rgba(10, 132, 255, 0.4)",
            }}
            _active={{
                bgGradient: "linear(to-r, #005BBB, #004499)",
                transform: "translateY(0)",
                boxShadow: "none",
            }}
            transition="all 0.3s ease-in-out"
            {...props}
        >
            {children}
        </Button>
    );
}

export function StepDots({steps, activeIndex}) {
    return (
        <Box className="dots_container">
            {steps.map((step, i) => (
                <Box key={i} className={`dot ${i === activeIndex ? "active" : ""}`}/>
            ))}
        </Box>
    );
}
