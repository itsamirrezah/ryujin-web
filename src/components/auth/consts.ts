import { SignOption } from "./auth-modal";

export const authModalPrompts: Record<SignOption, { title: string, description: string }> = {
    signin: {
        title: "Sign In",
        description: "",
    },
    signup: {
        title: "Craft, Clash, Conquer!",
        description: "Immerse yourself in a world where tactics are paramount. Join us to conquer the arena!"
    },
    username: {
        title: "Choose Your Username",
        description: "to get started, please create a unique username. Your username will be how other members identify you. Let's begin your journey!"
    },
    email: {
        title: "Confirm Your Email",
        description: "Thank you for joining Ryujin! We've sent a confirmation link to your inbox. Please verify your account by clicking on the verification link we've sent you. We're excited to have you onboard!"
    }
}

