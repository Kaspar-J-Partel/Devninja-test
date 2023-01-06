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

const BeerComponent= (beer: Beer) => {
    return (
        <div>
            {beer.name}
            {beer.style}
            {beer.alcohol}
        </div>
    )
}

export default BeerComponent;