import {useEffect, useRef, useState} from "react";
import styles from "./BeerList.module.css";
import {BeerComponent, SearchBar} from "../index";

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
        mapCategories(beerList);
    }, [beerList])

    // mapCategories maps out all unique categories and corresponding beers - map[beer.style]beer
    const mapCategories = (beerList: Beer[]) => {
        beerList.forEach(beer => {
            setCategoriesMap(new Map(categoriesMap.set(beer.style, [...(categoriesMap.get(beer.style) || []), beer])))
        })
    }

    // addSingleBeerToOpenOrder adds single beer to open order
    const addSingleBeerToOpenOrder = (beer: Beer) => {
        const order = localStorage.getItem("order");

        if (order === null) {
            beer.count = 1;
            localStorage.setItem("order", JSON.stringify([beer]));
        } else {
            let items: Beer[] = JSON.parse(order);
            let itemIndex = items.findIndex(el => el.uid === beer.uid);

            if (itemIndex >= 0) {
                items[itemIndex].count!++

                localStorage.setItem("order", JSON.stringify(items));
            } else {
                beer.count = 1
                localStorage.setItem("order", JSON.stringify([...items, beer]))
            }
        }
    }

    // addCategoryToOpenOrder adds all beers of category to open order
    const addCategoryToOpenOrder = (category: Beer[]) => {
        category.forEach(beer => addSingleBeerToOpenOrder(beer));
    }

    return (
        <>
            <SearchBar beerList={beerList} setVisibleBeerList={setVisibleBeerList}
                       setSelectedCategory={setSelectedCategory}/>

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
                        <span className={styles.adding_btn}
                              onClick={(e) => {
                                  e.stopPropagation()
                                  addCategoryToOpenOrder(categoriesMap.get(key) || [])
                              }}>+</span>
                    </div>
                ))}
            </div>

            <h2>{selectedCategory}</h2>

            <div className={styles.beer_container}>
                {visibleBeerList?.map(beer => (
                    <BeerComponent key={beer.uid} beer={beer} addSingleBeerToOpenOrder={addSingleBeerToOpenOrder}/>
                ))}
            </div>
        </>
    )
}

export default BeerList;