import styles from "./OrderHistory.module.css";
import React, {useEffect, useState} from "react";

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

const OrderHistory = () => {
    const [orders, setOrders] = useState<Beer[][]>([]);

    useEffect(() => {
        const history = localStorage.getItem("history");
        if (history) {
            setOrders(JSON.parse(history));
        }
    }, [])

    return (
        <>
            <h2 className={styles.header}>Order history</h2>
            <div className={styles.history_container}>
                {orders.length >= 1 ? orders.map((order, index) => (
                    <div key={index} className={styles.order_wrapper}>
                        <h3 className={styles.order_header}>Order {index + 1}</h3>
                        <ul>
                            {order.map(beer => (
                                <li className={styles.beer_item} key={beer.uid}><span
                                    className={styles.count}>{beer.count}</span> {beer.name} {beer.alcohol}</li>
                            ))}
                        </ul>
                    </div>
                )) : "No orders yet!"}
            </div>
        </>
    )
}

export default OrderHistory;