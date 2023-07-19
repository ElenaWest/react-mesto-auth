import { useEffect, useState } from "react";

function LikeButton({ card, myid, onCardLike }) {
    const [isLike, setIsLike] = useState(false)
    
    useEffect(() => {
        setIsLike(card.some(element => myid === element._id))
    }, [card, myid])

    return(
        <>
        <button className={`element__heart ${isLike ? 'element__heart_active' : ''}`} type="button" aria-label="Нравиться" onClick={() => onCardLike(card)} />
        <p className="element__number">{card.likes.length}</p>
        </>
    )
}

export default LikeButton;