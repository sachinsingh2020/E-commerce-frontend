import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { responseToast } from "../utils/features";
import type { NewOrderRequest } from "../types/api-types";
import { resetCart } from "../redux/reducer/cartReducer";
import type { RootState } from "../redux/store";

const stripeKey = import.meta.env.VITE_STRIPE_KEY;

const stripePromise = loadStripe(stripeKey);

const CheckOutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const { user } = useSelector((state: RootState) => state.userReducer);

    const {
        shippingInfo,
        cartItems,
        subtotal,
        tax,
        discount,
        shippingCharges,
        total,
    } =
        useSelector((state: RootState) => state.cartReducer);


    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const [newOrder] = useNewOrderMutation();

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) return;
        console.log("sachin");
        setIsProcessing(true);

        const orderData: NewOrderRequest = {
            shippingInfo,
            orderItems: cartItems,
            subtotal,
            tax,
            discount,
            shippingCharges,
            total,
            user: user?._id!,
        };

        const { paymentIntent, error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin },
            redirect: "if_required",
        });

        if (error) {
            setIsProcessing(false);
            return toast.error(error.message || "Something Went Wrong");
        }

        if (paymentIntent.status === "succeeded") {
            const res = await newOrder(orderData);
            dispatch(resetCart());
            responseToast(res, navigate, "/orders");
        }
        setIsProcessing(false);
    };
    return (
        <div className="checkout-container">
            <form onSubmit={submitHandler}>
                <PaymentElement />
                <button type="submit" disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Pay"}
                </button>
            </form>
        </div>
    );
};

const Checkout = () => {
    const location = useLocation();

    const clientSecret: string | undefined = location.state;

    if (clientSecret) {
        console.log({ clientSecret });
    }

    if (!clientSecret) return <Navigate to={"/shipping"} />;

    return (
        <Elements
            options={{
                clientSecret,
                // clientSecret: "pi_3RdTAp4EhkyvX8Ka1DzZ5ame_secret_JGzQNUkNWX5zpYKwN9tMquBEA",
            }}
            stripe={stripePromise}
        >
            <CheckOutForm />
        </Elements>
    );
};

export default Checkout;
