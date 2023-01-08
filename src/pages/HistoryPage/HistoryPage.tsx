import React from "react";

import styles from "./HistoryPage.module.css";
import {OrderHistory} from "../../components";

const HistoryPage = () => {
    return (
        <main className={styles.container}>
            <OrderHistory />
        </main>
    )
}

export default HistoryPage;