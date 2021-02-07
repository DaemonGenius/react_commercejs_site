import React, {useState, useEffect} from "react";
import {Products, Navbar, Cart, Checkout } from "./components";
import {commerce} from "./lib/commerce";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState();
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const fetchProducts = async () => {
        const {data} = await commerce.products.list();
        setProducts(data);
    }
    const fetchCart = async () => {
        const data = await commerce.cart.retrieve();
        return data;
    }
    const handleAddToCart = async (productId, quantity) => {
        const { cart } = await commerce.cart.add(productId, quantity);
        setCart(cart);
    }

    const handleUpdateCartQty = async (productId, quantity) => {
        const { cart } = await commerce.cart.update(productId, {quantity});
        setCart(cart);
    }

    const handleRemoveFromCart = async (productId) => {
        const { cart } = await commerce.cart.remove(productId);

        setCart(cart);
    }

    const handleEmptyCart = async () => {
        const { cart } = await commerce.cart.empty();

        setCart(cart);
    }

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
        setCart(newCart);
    }

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
            setOrder(incomingOrder);
            refreshCart();
        }catch (error) {
            setErrorMessage(error.data.error.message);
        }
    }

    //The Effect Hook lets you perform side effects in function components:
    useEffect(() => {
        //Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.
        //Whether or not you’re used to calling these operations “side effects” (or just “effects”), you’ve likely performed them in your components before.
        fetchProducts();
        fetchCart().then(cart => (
            setCart(cart)
        ));
    }, []);

    return (
        <Router>
            <div>
                <Navbar totalItems={cart?.total_items ?? 0}/>
                <Switch>
                    <Route exact path="/">
                        <Products products={products} onAddToCart={handleAddToCart}/>
                    </Route>
                    <Route exact path="/cart">
                        {cart && <Cart
                            cart={cart}
                            handleUpdateCartQty={handleUpdateCartQty}
                            handleRemoveFromCart={handleRemoveFromCart}
                            handleEmptyCart={handleEmptyCart}
                        />}
                    </Route>
                    <Route exact path="/checkout">
                        <Checkout
                            cart={cart}
                            order={order}
                            onCaptureCheckout={handleCaptureCheckout}
                            error={errorMessage}
                        />
                    </Route>
                </Switch>
            </div>
        </Router>

    );
};

export default App;
