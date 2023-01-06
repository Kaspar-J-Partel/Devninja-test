import styles from "./NavBar.module.css";
import {Link} from "react-router-dom";

const NavBar = () => {
    return (
        <nav className={styles.nav}>
            <Link to="/" className={styles.nav_link}><h1 className={styles.header}>Beerbook</h1></Link>
            <div>
                <Link to="cart" className={styles.nav_link}>Cart</Link>
                <Link to="history" className={styles.nav_link}>Order history</Link>
            </div>
        </nav>
    )
};

export default NavBar;