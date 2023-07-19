class Api {
    constructor(parameter) {
        this._url = parameter.baseUrl;
        this._headers = parameter.headers;
        this._authorization = parameter.headers.authorization;
    }

    _checkResponse(res) {        
    return res.ok ? res.json() : Promise.reject(`Ошибка сервера ${res.status}`);
    }

    _request(url, options) {
        return fetch(`${this._url}${url}`, options)
        .then(this._checkResponse)
      }

    getInfo() {
        return this._request(`/users/me`, {
            headers: {
                authorization: this._authorization
            }
        })
    }

    getCards() {
        return this._request(`/cards`, {
            headers: {
                authorization: this._authorization
            }
        })
    }

    setUserInfo(data) {
        return this._request(`/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                name: data.username,
                about: data.status,
            })
        })
    }

    setNewAvatar(data) {
        return this._request(`/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar: data.avatar,
            })
        })
    }
    
    addCard(data) {
        return this._request(`/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                name: data.title,
                link: data.link,
        })
      })
    }

    addLike(cardId) {
        return this._request(`/cards/${cardId}/likes`, {
            method: 'PUT',
            headers: {
                authorization: this._authorization
            }
        })
    }

    deleteLike(cardId) {
        return this._request(`/cards/${cardId}/likes`, {
            method: 'DELETE',
            headers: {
                authorization: this._authorization
            }
        })
    }

    deleteCard(cardId) {
        return this._request(`/cards/${cardId}`, {
            method: 'DELETE',
            headers: {
                authorization: this._authorization
            } 
        })
    }
}

const api = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-66',
    headers: {
      authorization: '0c26d4a4-f51e-405b-92e1-f55fac7bf350',
      'Content-Type': 'application/json'
    }
});

export default api;