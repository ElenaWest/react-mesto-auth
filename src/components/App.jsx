import Header from "./Header.jsx";
import Main from "./Main.jsx";
import Footer from "./Footer.jsx";
import PopupWithForm from "./PopupWithForm.jsx";
import ImagePopup from "./ImagePopup.jsx";
import { useCallback, useEffect, useState } from "react";
import CurrentUserContext from '../contexts/CurrentUserContext.js';
import api from '../utils/api.js';
import EditProfilePopup from "./EditProfilePopup.jsx";
import EditAvatarPopup from "./EditAvatarPopup.jsx";
import AddPlacePopup from "./AddPlacePopup.jsx";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ForProtectedRoute from "./ForProtectedRoute.jsx"
import InfoTooltip from "./InfoTooltip.jsx";
import { registration, authorization, getUserData } from "../utils/auth.js"

function App() {
  const navigate = useNavigate()
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isAnimationPopup, setIsAnimationPopup] = useState(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [isResultPopupOpen, setIsResultPopupOpen] = useState(false)
  const [selectedCard, setselectedCard] = useState({})
  const [isSend, setIsSend] = useState(false)

  const setStatesForClosePopups  = useCallback (() => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAnimationPopup(false);
    setIsDeletePopupOpen(false)
    setIsResultPopupOpen(false)
  }, [])

  const [currentUser, setCurrentUser] =  useState({})
  const [userEmail, setUserEmail] = useState('')

  const [cards, setCards] = useState([])
  console.log(cards)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteCardId, setdeleteCardId] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
 
  const [isSucsefull, setIsSucsefull] = useState(false)

  const closeAllPopupForClickOnEsc = useCallback ((e) => {
    if (e.key === 'Escape') {
      setStatesForClosePopups();
      document.addEventListener('keydown', closeAllPopupForClickOnEsc)}
    },[setStatesForClosePopups])

  function setEventListenerForDocument() {
    document.addEventListener('keydown', closeAllPopupForClickOnEsc)
  }

  const closeAllPopups = useCallback(() => {
    setStatesForClosePopups()
    document.removeEventListener('keydown', closeAllPopupForClickOnEsc)
  },[setStatesForClosePopups, closeAllPopupForClickOnEsc])

  useEffect(() => {
    if (localStorage.jwt) {
      getUserData(localStorage.jwt)
        .then(res => {
          setUserEmail(res.data.email)
          setLoggedIn(true)
          navigate('/')
        })
        .catch((error) => console.error(`Ошибка авторизации при повторном входе ${error}`))
    } else {
      setLoggedIn(false)
    }
  }, [navigate])

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
    setEventListenerForDocument();
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
    setEventListenerForDocument();
  }
  
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
    setEventListenerForDocument();
  }

  function handleCardClick(card) {
    setselectedCard(card);
    setIsAnimationPopup(true);
    setEventListenerForDocument();
  }

  function handleDeletePopupClick(cardId) {
    setdeleteCardId(cardId);
    setIsDeletePopupOpen(true);
    setEventListenerForDocument();
  }

  useEffect(() => {
    if (loggedIn) {
    setIsLoading(true)
    Promise.all([api.getInfo(), api.getCards()])
      .then(([dataUser, dataCard]) => {
        setCurrentUser(dataUser)
        setCards(dataCard)
        setIsLoading(false)
      })
      .catch((error) => console.error(`Ошибка при загрузке начальных данных страницы ${error}`))
    }
}, [loggedIn])

  function handleCardDelete(e) {
    e.preventDefault()
    setIsSend(true)
    api.deleteCard(deleteCardId)
      .then(() => {
        setCards(cards.filter(card => {
          return card._id !== deleteCardId
        }))
        closeAllPopups()
      })
      .catch((error) => console.error(`Ошибка при удалении карточки ${error}`))
      .finally(() => setIsSend(false))
  }

  function handleUpdateUser(dataUser, reset) {
    setIsSend(true)
    api.setUserInfo(dataUser)
      .then(res => {
        setCurrentUser(res)
        closeAllPopups()
        reset()
      })
      .catch((error) => console.error(`Ошибка при редактировании данных профиля ${error}`))
      .finally(() => setIsSend(false))
  }

  function handleUpdateAvatar(dataUser, reset) {
    setIsSend(true)
    api.setNewAvatar(dataUser)
      .then(res => {
        setCurrentUser(res)
        closeAllPopups()
        reset()
      })
      .catch((error) => console.error(`Ошибка при редактировании изображения ${error}`))
      .finally(() => setIsSend(false))
  }

  function handleAddPlaceSubmit(dataCard, reset) {
    setIsSend(true)
    api.addCard(dataCard)
      .then((res) => {
        setCards([res, ...cards])
        closeAllPopups()
        reset()
      })
      .catch((error) => console.error(`Ошибка при добавлении новой карточки ${error}`))
      .finally(() => setIsSend(false))
  }

  const handleLike = useCallback((card) => {
    const isLike = card.likes.some(element => currentUser._id === element._id)
    if (isLike) {
      api.deleteLike(card._id)
        .then(res => {
          setCards(cards => cards.map((item) => item._id ? res : item))
        })
        .catch((error) => console.error(`Ошибка при снятии лайка ${error}`)) 
    } else {
      api.addLike(card._id)
        .then(res => {
          setCards(cards => cards.map((item) => item._id ? res : item))
        })
        .catch((error) => console.error(`Ошибка при добавлении лайка ${error}`))
    }
  }, [currentUser._id])

  function handleLogin(password, email) {
    setIsSend(true)
    authorization(password, email)
      .then(res => {
        localStorage.setItem('jwt', res.token)
        setLoggedIn(true)
        window.scrollTo(0, 0)
        navigate('/')
      })
      .catch(error => {
        setIsResultPopupOpen(true)
        setIsSucsefull(false)
        console.error(`Ошибка при авторизации ${error}`)
      })
      .finally(() => setIsSend(false))
  }
  
  function handleRegister(password, email) {
    setIsSend(true)
    registration(password, email)
      .then(() => {
        setIsResultPopupOpen(true)
        setIsSucsefull(true)
        window.scrollTo(0, 0)
        navigate('/sign-in')
      })
      .catch(error => {
        setIsResultPopupOpen(true)
        setIsSucsefull(false)
        console.error(`Ошибка при регистрации ${error}`)
      })
      .finally(() => setIsSend(false))
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__contener">
        <Routes>
          <Route path='/' element={<ProtectedRoute
            element={ForProtectedRoute}
            userEmail={userEmail}
            onAddPlace = {handleAddPlaceClick}
            onEditProfile = {handleEditProfileClick}
            onEditAvatar = {handleEditAvatarClick}
            onCardClick = {handleCardClick}
            onDelete = {handleDeletePopupClick}
            onCardLike={handleLike}
            cards = {cards}
            isLoading = {isLoading}
            loggedIn = {loggedIn}
           />
            } />
          <Route path='/sign-up' element={
            <>
              <Header name='signup' />
              <Main name='signup' handleRegister={handleRegister} />
            </>
            } />
          <Route path='sign-in' element={
            <>
              <Header name='signin' />
              <Main name='signin' handleLogin={handleLogin} />
           </>
            } />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>

        <Footer />

          <EditProfilePopup
            onUpdateUser = {handleUpdateUser}
            isOpen = {isEditProfilePopupOpen}
            onClose = {closeAllPopups}
            isSend = {isSend}
           />
          <AddPlacePopup
            onAddPlace = {handleAddPlaceSubmit}
            isOpen = {isAddPlacePopupOpen}
            onClose = {closeAllPopups}
            isSend = {isSend}
           />
          <EditAvatarPopup
            onUpdateAvatar = {handleUpdateAvatar}
            isOpen = {isEditAvatarPopupOpen}
            onClose = {closeAllPopups}
            isSend = {isSend}         
           />
          <PopupWithForm
            name='deletecard'
            title='Вы уверены?'
            buttonText='Да'
            isOpen = {isDeletePopupOpen}
            onClose = {closeAllPopups}
            onYesButton = {handleCardDelete}
            isSend = {isSend}
          />
          <ImagePopup
            onClose = {closeAllPopups}
            card = {selectedCard}
            isOpen = {isAnimationPopup}
          />

          <InfoTooltip
            name='result'
            isSucsefull={isSucsefull}
            isOpen={isResultPopupOpen}
            onClose={closeAllPopups}
           />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;