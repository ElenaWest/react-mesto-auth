import { useContext, useEffect } from "react"
import useFormValidation from "../utils/hooks/useFormValidation"
import PopupWithForm from "./PopupWithForm"
import CurrentUserContext from "../contexts/CurrentUserContext"

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isSend }) {
    const currentUser = useContext(CurrentUserContext)
    const { values, errors, isValid, isInputValid, handleChange, reset, setValue } = useFormValidation()

    useEffect(() => {
        setValue("username", currentUser.name)
        setValue("status", currentUser.about)
    },[currentUser, setValue])
    
    function resetForClose() {
        onClose()
        reset({ username: currentUser.name, status: currentUser.about })
    }

    function handleSubmit(e) {
        e.preventDefault()
        onUpdateUser({ username: values.username, status: values.status }, reset)
    }

    return(
        <PopupWithForm
            name='profile'
            title='Редактировать профиль'
            isOpen = {isOpen}
            onClose = {resetForClose}
            isValid = {isValid}
            isSend={isSend}
            onYesButton={handleSubmit}
        >
            <input
              className={`popup__input ${isInputValid.username === undefined || isInputValid.username ? '' : 'popup__input_invalid'}`}
              id="username"
              name="username"
              type="text"
              placeholder="Имя пользователя"
              minLength={2}
              maxLength={40}
              required
              value={values.username ? values.username : ''}
              disabled={isSend}
              onChange={handleChange}
            />
            <span className="span span_type_error">{errors.username}</span>
            <input
              className={`popup__input ${isInputValid.status === undefined || isInputValid.status ? '' : 'popup__input_invalid'}`}
              id="status"
              name="status"
              type="text"
              placeholder="О себе"
              minLength={2}
              maxLength={200}
              required
              value={values.status ? values.status : ''}
              disabled={isSend}
              onChange={handleChange}
            />
            <span className="span span_type_error">{errors.status}</span>
        </PopupWithForm>
    )
}

export default EditProfilePopup