import PopupWithForm from "./PopupWithForm"
import useFormValidation from "../utils/hooks/useFormValidation"

function AddPlacePopup({ isOpen, onClose, onAddPlace, isSend }) {
    const { values, errors, isValid, isInputValid, handleChange, reset } = useFormValidation()

    function resetForClose() {
        onClose()
        reset()
    }

    function handleSubmit(e) {
        e.preventDefault()
        onAddPlace({ title: values.title, link: values.link }, reset)
    }

    return(
        <PopupWithForm
          name='picture'
          title='Новое место'
          buttonText='Создать'
          isOpen = {isOpen}
          onClose = {resetForClose}
          isValid = {isValid}
          onYesButton={handleSubmit}
          isSend = {isSend}
          >
          <input
            className={`popup__input popup__input_place_name ${isInputValid.title === undefined || isInputValid.title ? '' : 'popup__input_invalid'}`}
            id="title"
            name="title"
            type="text"
            placeholder="Название"
            minLength={2}
            maxLength={30}
            required
            value={values.title ? values.title : ''}
            disabled={isSend}
            onChange={handleChange}
           />
          <span id="title-error" className="span span_type_error">{errors.title}</span>
          <input
            className={`popup__input popup__input_picture_link ${isInputValid.link === undefined || isInputValid.link ? '' : 'popup__input_invalid'}`}
            id="link"
            name="link"
            type="url"
            placeholder="Ссылка на картинку"
            required
            value={values.link ? values.link : ''}
            disabled={isSend}
            onChange={handleChange}
           />
          <span id="link-error" className="span span_type_error">{errors.link}</span>
        </PopupWithForm>
    )
}

export default AddPlacePopup