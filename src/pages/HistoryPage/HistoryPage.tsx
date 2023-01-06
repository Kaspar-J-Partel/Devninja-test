import React, {useEffect, useState} from "react";

import styles from "./HistoryPage.module.css";

interface Beer {
    id: number
    uid: string
    brand: string
    name: string
    style: string
    hop: string
    yeast: string
    malts: string
    ibu: string
    alcohol: string
    blg: string
    count: number
}

const HistoryPage = () => {
    const [orders, setOrders] = useState<Beer[][]>([]);

    useEffect(() => {
        const history = localStorage.getItem("history");
        if (history) {
            setOrders(JSON.parse(history));
        }
    }, [])

    return (
        <main className={styles.container}>
            {orders.map((order, index) => (
                <div key={index} className={styles.order_wrapper}>
                    <h3 className={styles.order_header}>Order {index + 1}</h3>
                    <ul>
                        {order.map(beer => (
                            <li className={styles.beer_item} key={beer.uid}><span
                                className={styles.count}>{beer.count}</span> {beer.name} {beer.alcohol}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </main>
    )
}

export default HistoryPage;