import React from "react";
import ReactDom from "react-dom";
import { Auth0Provider } from '@auth0/auth0-react';

import App from "./App";

const domain = process.env.REACT_APP_AUTH0_DOMAIN_KEY;
const clientIdKey = process.env.REACT_APP_AUTH0_CLIENT_ID_KEY;

ReactDom.render(
    <Auth0Provider
    domain={domain}
    clientId={clientIdKey}
    redirectUri={window.location.origin}>
        <App />
    </Auth0Provider>
    , document.getElementById("root"));
