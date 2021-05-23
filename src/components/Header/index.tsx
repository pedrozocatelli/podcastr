import { format } from 'date-fns';

import styles from './styles.module.scss';

const Header = () => {
  const currentDate = format(new Date(), 'eeeeeee, MMM do');


  return (
   <header className={styles.headerContainer}>
     <img src="/logo.svg" alt="Podcastr"/>
     <p>The best, only here</p>
     <span>{currentDate}</span>
   </header>
  );
};

export default Header;
