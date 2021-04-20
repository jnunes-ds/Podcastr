import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './style.module.scss';

export default function Header(){

    const currentDate = format(new Date, 'EEEEE, d MMMM', {
        locale: ptBR,
    });

    return (
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Podcastr"/>
            <p>O melhor para você ouvide, sempre</p>
            <span>{currentDate}</span>
        </header>
    );
};