import {useEffect, useRef, useState} from "react";
import styles from "./BeerList.module.css";

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
    count?: number
}

const fetchData = async (setBeerList: any) => {
    const url = "https://random-data-api.com/api/beer/random_beer?size=20";

    try {
        const response = await fetch(url);
        const data = await response.json();
        setBeerList(data);
    } catch (e) {
        console.log(e)
    }
}

const BeerList = () => {
    const [beerList, setBeerList] = useState<Beer[]>([]);
    const [visibleBeerList, setVisibleBeerList] = useState<Beer[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categoriesMap, setCategoriesMap] = useState(new Map<string, Beer[]>());

    const dataFetchedRef = useRef(false); // strict mode runs useeffect hook twice

    useEffect(() => {
        // Extra guard to only fetch data once
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchData(setBeerList);
    }, [])

    useEffect(() => {
        setVisibleBeerList(beerList);
        filterCategories(beerList);
    }, [beerList])

    const filterCategories = (beerList: Beer[]) => {
        beerList.forEach(beer => {
            setCategoriesMap(new Map(categoriesMap.set(beer.style, [...(categoriesMap.get(beer.style) || []), beer])))
        })
    }

    const addSingleBeerToOpenOrder = (beer: Beer) => {
        const order = localStorage.getItem("order");

        if (order === null) {
            beer.count = 1;
            localStorage.setItem("order", JSON.stringify([beer]));
        } else {
            let items: Beer[] = JSON.parse(order);
            let itemIndex = items.findIndex(el => el.uid === beer.uid);

            if (itemIndex >= 0) {
                // @ts-ignore
                items[itemIndex].count++

                localStorage.setItem("order", JSON.stringify(items));
            } else {
                beer.count = 1
                localStorage.setItem("order", JSON.stringify([...items, beer]))
            }
        }
    }

    const addCategoryToOpenOrder = (category: Beer[]) => {
        category.forEach(beer => addSingleBeerToOpenOrder(beer));
    }

    return (
        <main className={styles.container}>
            <form className={styles.searchbar}>
                <input type="text" placeholder="Search for a beer"/>
            </form>

            <div className={styles.category_container}>
                <div className={styles.category_wrapper} onClick={() => {
                    setVisibleBeerList(beerList);
                    setSelectedCategory("All");
                }}>
                    <h3>All</h3>
                </div>


                {Array.from(categoriesMap.keys()).map((key, i) => (
                    <div key={i} className={styles.category_wrapper} onClick={() => {
                        setVisibleBeerList(categoriesMap.get(key) || []);
                        setSelectedCategory(key);
                    }}>
                        <h3>{key}</h3>
                        <div className={styles.category_adding__container}>
                            <span className={styles.adding_btn}
                                  onClick={() => addCategoryToOpenOrder(categoriesMap.get(key) || [])}>+</span>
                        </div>
                    </div>
                ))}
            </div>

            <h2>{selectedCategory}</h2>

            <div className={styles.beer_container}>
                {visibleBeerList?.map(beer => (
                    <div className={styles.beer_wrapper} key={beer.uid}>
                        <div className={styles.beer_info}>
                            <h3>{beer.name}</h3>
                            <p>{beer.style}</p>
                            <p><b>{beer.alcohol}</b></p>
                        </div>
                        <div className={styles.beer_adding__container}>
                            <span className={styles.adding_btn} onClick={() => addSingleBeerToOpenOrder(beer)}>+</span>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default BeerList;