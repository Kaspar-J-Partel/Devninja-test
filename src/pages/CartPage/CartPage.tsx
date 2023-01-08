import React from "react";

import styles from "./CartPage.module.css";
import {OpenOrder} from "../../components";

const CartPage = () => {
    return (
        <main className={styles.container}>
            <OpenOrder/>
        </main>
    )
}

export default CartPage;