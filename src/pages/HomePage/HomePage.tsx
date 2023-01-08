import {BeerList} from "../../components";
import styles from "./HomePage.module.css";

const HomePage = () => {
    return (
        <main className={styles.container}>
            <BeerList/>
        </main>
    )
}

export default HomePage;