import React, {ComponentProps, FC} from 'react'
import styles from  "./GlobalFooter.module.css";
type Props = {}

const GlobalFooter: FC<Props> = ({}) => {
    return (
        <footer className={styles.GlobalFooter} g-component="GlobalFooter" g-options="[]">
            <div className={styles.GlobalFooter__inner} g-ref="footerInner" style={{translate: 'none', rotate: 'none', scale: 'none', opacity: 1, transform: 'translate(0px, 0px)'}}>
                <div className={styles.GlobalFooter__innerForm}>
                    <p>Join our mailing list for updates on<strong> artists, releases and more.</strong></p>
                </div>
                <div className={styles.GlobalFooter__innerLinks}>
                    <div className={styles.linkColumn}>
                        <p>©Fellowship 2023</p>
                        <p>All Rights Reserved</p>
                    </div>
                    <div className={styles.linkColumn}>
                        <h3>Follow</h3>
                        <ul>
                            <li>
                                <a href="https://twitter.com/fellowshiptrust" data-no-swup target="_blank" rel="noopener noreferrer">Twitter,</a>
                            </li>
                            <li>
                                <a href="https://discord.gg/fellowshiptrust" data-no-swup target="_blank" rel="noopener noreferrer">Discord,</a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/fellowship.xyz/?hl=en" data-no-swup target="_blank" rel="noopener noreferrer">Instagram</a>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.linkColumn}>
                        <h3>Made By:</h3>
                        <a data-no-swup href="https://www.madebysix.com/" target="_blank" rel="noopener noreferrer">SIX</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default GlobalFooter;

