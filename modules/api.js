const API_URL = 'https://wedev-api.sky.pro/api/v1/andrew-petrov/comments'

export function fetchComments() {
    return fetch(API_URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке комментариев')
            }
            return response.json()
        })
        .then((data) => data.comments)
}

export function postComment({ name, text }) {
    return fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
            name: name.trim(),
            text: text.trim(),
            forceError: false, // имитация ошибки 500 при значении true
        }),
    })
        .then((response) => {
            if (response.status === 400) {
                throw new Error('400')
            }

            if (response.status === 500) {
                throw new Error('500')
            }

            if (!response.ok) {
                throw new Error('unknown error')
            }

            return response.json()
        })
        .catch((error) => {
            if (error.message === '400' || error.message === '500') {
                throw error
            }

            // Ошибка сети
            throw new Error('network')
        })
}
