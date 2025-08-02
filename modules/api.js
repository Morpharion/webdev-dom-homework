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
            forceError: false,
        }),
    }).then((response) => {
        if (!response.ok) {
            return response.json().then((data) => {
                throw new Error(
                    data.error || 'Ошибка при добавлении комментария',
                )
            })
        }
        return response.json()
    })
}
