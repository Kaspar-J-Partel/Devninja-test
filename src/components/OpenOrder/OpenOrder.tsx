import React, {useEffect, useState} from "react";
import styles from "./OpenOrder.module.css"

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

const OpenOrder = () => {
    const [itemsArr, setItemsArr] = useState<Beer[]>([]);
    const [categoriesMap, setCategoriesMap] = useState(new Map<string, Beer[]>());

    useEffect(() => {
        const items = localStorage.getItem("order");
        if (!items) return;

        const parsedItems = JSON.parse(items)

        setItemsArr(() => parsedItems);
    }, [])

    useEffect(() => {
        categoriesMap.clear()
        setCategoriesMap(() => categoriesMap)
        filterOnStyle([...itemsArr]);
    }, [itemsArr])

    // filterOnStyle filters beers into categories
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
        let arr: Beer[] = [...itemsArr];
        const index = arr.findIndex(el => el.uid === beer.uid);

        if (index >= 0) {
            if (arr[index].count > 1) {
                arr[index].count--
            } else {
                arr.splice(index, 1);
            }

            setItemsArr(() => arr);
        }

        localStorage.setItem("order", JSON.stringify(arr));
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
            setItemsArr([]);
            return
        }

        setItemsArr(JSON.parse(items));
    }

    // handleClick handles removal of beer from open order
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const history = localStorage.getItem("history");

        const setHistory = () => {
            if (history) {
                localStorage.setItem("history", JSON.stringify([...JSON.parse(history), itemsArr]))
            } else {
                localStorage.setItem("history", JSON.stringify([itemsArr]))
            }
        }

        setHistory()

        localStorage.removeItem("order");
        setItemsArr([]);
    }

    return (
        <div className={styles.order_container}>
            <h2 className={styles.header}>Open order</h2>
            <div className={styles.category_container}>
                {itemsArr.length > 0 ? Array.from(categoriesMap.keys()).map((category, index) => (
                    <div key={index} className={styles.category_wrapper}>
                        <h3>{category} <span className={styles.remove_btn} onClick={() => removeCategory(category)}>-</span></h3>
                        <ul>
                            {(categoriesMap.get(category) || []).sort(sortBeersByAlcohol).map(beer => (
                                <li className={styles.beer_item} key={beer.uid}><span
                                    className={styles.count}>{beer.count}</span> {beer.name} {beer.alcohol}
                                    <span className={styles.remove_btn} onClick={() => removeBeer(beer)}>-</span></li>
                            ))}
                        </ul>
                    </div>
                )) : <p style={{marginBottom: "1em"}}>No items yet!</p>}
            </div>

            <button disabled={itemsArr.length === 0} className={styles.submit_btn}
                    onClick={(e) => handleClick(e)}>FINALIZE ORDER
            </button>
        </div>
    )
}

export default OpenOrder;