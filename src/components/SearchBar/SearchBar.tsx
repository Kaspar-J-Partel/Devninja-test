import styles from "./SearchBar.module.css";
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
    count?: number
}

interface Props {
    beerList: Beer[]
    setVisibleBeerList: React.Dispatch<React.SetStateAction<Beer[]>>
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>
}

const SearchBar = ({beerList, setVisibleBeerList, setSelectedCategory}: Props) => {
    const [search, setSearch] = useState("");
    const [options, setOptions] = useState<Beer[]>([...beerList]);

    useEffect(() => {
        setVisibleBeerList(() => [...options])
        setSelectedCategory(() => `Search - ${options.length} results`)
    }, [options])

    useEffect(() => {
        if (search === "") {
            setVisibleBeerList(() => [...beerList])
            setSelectedCategory(() => `All`)
            return
        }

        filterOptions()
    }, [search])

    const handleChange = (value: string) => {
        setSearch(() => value)
    }

    const filterOptions = () => {
        const lowercaseSearch = search.toLowerCase();
        setOptions(() => beerList.filter(beer => beer.name.toLowerCase().includes(lowercaseSearch) || beer.brand.toLowerCase().includes(lowercaseSearch)));
    }

    return (
        <form className={styles.searchbar}>
            <datalist id="beerdata">
                {options.map(beer => <option>{beer.name}</option>)}
            </datalist>

            <input list="beerdata" type="text" placeholder="Search for a beer" onChange={(e) => {
                handleChange(e.target.value)
            }} value={search} autoComplete="off"/>
        </form>
    )
}

export default SearchBar;