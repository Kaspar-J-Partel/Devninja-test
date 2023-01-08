import styles from "./BeerComponent.module.css";

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
}

interface Props {
    beer: Beer
    addSingleBeerToOpenOrder: (beer: Beer) => void
}

const BeerComponent = ({beer, addSingleBeerToOpenOrder}: Props) => {
    return (
        <div className={styles.beer_wrapper} key={beer.uid}>
            <div className={styles.beer_info}>
                <h3>{beer.name} - {beer.brand}</h3>
                <p>{beer.style}</p>
                <p><b>{beer.alcohol}</b></p>
            </div>

            <span className={styles.adding_btn} onClick={() => addSingleBeerToOpenOrder(beer)}>+</span>
        </div>
    )
}

export default BeerComponent;