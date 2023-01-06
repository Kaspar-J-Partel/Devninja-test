import React, {useEffect, useState} from "react";

import styles from "./CartPage.module.css";

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

const CartPage = () => {
    const [items, setItems] = useState<Beer[]>([]);
    const [categoriesMap, setCategoriesMap] = useState(new Map<string, Beer[]>());

    useEffect(() => {
        const items = localStorage.getItem("order");
        if (!items) return;

        setItems(JSON.parse(items));
    }, [])

    useEffect(() => {
        setCategoriesMap(new Map<string, Beer[]>())
        filterOnStyle(items);
    }, [items])

    const filterOnStyle = (beerList: Beer[]) => {
        beerList.forEach(beer => {
            setCategoriesMap(new Map(categoriesMap.set(beer.style, [...(categoriesMap.get(beer.style) || []), beer])))
        })
    }

    // sortBeersByAlcohol sorts beers by alcohol
    const sortBeersByAlcohol = (a: Beer, b: Beer) => {
        const alcohol1 = parseFloat(a.alcohol.split("%")[0]);
        const alcohol2 = parseFloat(b.alcohol.split("%")[0]);

        return alcohol1 > alcohol2 ? 1 : -1;
    }

    // removeBeer removes single beer from open order
    const removeBeer = (beer: Beer) => {
        let arr = [...items];
        const index = arr.findIndex(el => el.uid === beer.uid);

        if (index >= 0) {
            if (arr[index].count > 1) {
                arr[index].count--
            } else {
                arr.splice(index, 1);
                console.log(arr)
            }

            setItems(() => arr);
        }

        console.log(items)

        localStorage.setItem("order", JSON.stringify(items));
    }

    // removeCategory removes whole category from open order
    const removeCategory = (categoryName: string) => {
        categoriesMap.delete(categoryName)
        setCategoriesMap(new Map(categoriesMap));

        const allMapItems: Beer[] = [];

        for (let arr of categoriesMap.values()) {
            for (let value of arr) {
                allMapItems.push(value);
            }
        }

        localStorage.setItem("order", JSON.stringify(allMapItems));

        const items = localStorage.getItem("order");
        if (!items) {
            setItems([]);
            return
        }

        setItems(JSON.parse(items));
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const history = localStorage.getItem("history");
        console.log(history)

        const setHistory = () => {
            if (history) {
                localStorage.setItem("history", JSON.stringify([...JSON.parse(history), items]))
            } else {
                localStorage.setItem("history", JSON.stringify([items]))
            }
        }

        setHistory()

        localStorage.removeItem("order");
        setItems([]);
    }

    return (
        <main className={styles.container}>

            <div className={styles.order_container}>
                <h2 className={styles.header}>Open order</h2>
                <div>
                    {items.length > 0 ? Array.from(categoriesMap.keys()).map((category, index) => (
                        <div key={index} className={styles.category_wrapper}>
                            <h3>{category} <span onClick={() => removeCategory(category)}>-</span></h3>
                            <ul>
                                {(categoriesMap.get(category) || []).sort(sortBeersByAlcohol).map(beer => (
                                    <li className={styles.beer_item} key={beer.uid}><span
                                        className={styles.count}>{beer.count}</span> {beer.name} {beer.alcohol}
                                        <span onClick={() => removeBeer(beer)}>-</span></li>
                                ))}
                            </ul>
                        </div>
                    )) : <p style={{marginBottom: "1em"}}>No items yet!</p>}
                </div>

                <button disabled={items.length === 0} className={styles.submit_btn}
                        onClick={(e) => handleClick(e)}>Finalize order
                </button>
            </div>
        </main>
    )
}

export default CartPage;