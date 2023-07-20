import { useEffect, useState } from 'react';
import logo from '../images/logo.svg';
import { Link } from 'react-router-dom';

function Header({ name, dataUser }) {
    const [count, setCount] = useState(0)
    /* useLocation - Улучшить код с использованием хука (планируется по времени)*/

    function handleClick() {
        count === 0 ? setCount(1) : setCount(0)
    }

    function onSingnOut() {
        setCount(0);
        localStorage.removeItem('jwt')
    }

    useEffect(() => {
        function closeBurgerForResize() {
            if (document.documentElement.clientWidth > '767') {
                setCount(0)
                window.removeEventListener('resize', closeBurgerForResize)
            }
        }
            if (count === 1) {
                window.addEventListener('resize', closeBurgerForResize)
                return() => window.removeEventListener('resize', closeBurgerForResize)
            }
    }, [count])

    return(
        <header className={`header page__sizing ${count !==0 ? 'header__opened' : ''}`}>
            <img 
              className="header__logo" 
              src={logo} 
              alt="Логотип Место"
               />
            {name === 'signup' || name ==='signin' ?
            <Link to={name === 'signup' ? '/sign-in' : '/sign-up'} className="header__button">
                {name !== 'signup' ? 'Регистрация' : 'Войти'}
            </Link>
            :
            <>
              <div className={`header__account_contener ${count !== 0 ? 'header__account_contener_opened' : ''}`}>
                <p className="header__account">{dataUser}</p>
                <Link to={`/sign-in`} className="header__button header__button_type_logged" onClick={onSingnOut}>Выйти</Link>
              </div>
              <button className={`header__menu ${count !==0 ? 'header__menu_close' : ''}`} onClick={handleClick}></button>
            </>
            }            
        </header>
    );
}

export default Header;