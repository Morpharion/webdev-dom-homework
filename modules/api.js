const PERSONAL_KEY = 'andrew-petrov'
const BASE_URL = `https://wedev-api.sky.pro/api/v2/${PERSONAL_KEY}`
const AUTH_URL = 'https://wedev-api.sky.pro/api/user/login'

// Получить токен из localStorage
export function getToken() {
    return localStorage.getItem('token')
}

// Сохранить токен в localStorage
function setToken(token) {
    localStorage.setItem('token', token)
}

// Удалить токен из localStorage
export function removeToken() {
    localStorage.removeItem('token')
}

// Получить информацию о текущем пользователе
export function getCurrentUser() {
    const token = getToken()
    if (!token) {
        return null
    }

    try {
        // Декодируем токен (JWT состоит из трех частей, разделенных точками)
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload
    } catch (error) {
        return null
    }
}

// Авторизация
export function login({ login, password }) {
    return fetch(AUTH_URL, {
        method: 'POST',
        body: JSON.stringify({
            login: login.trim(),
            password: password.trim(),
        }),
    })
        .then((response) => {
            if (response.status === 400) {
                return response.json().then((data) => {
                    throw new Error(data.error || 'Неверный логин или пароль')
                })
            }

            if (response.status !== 201) {
                throw new Error('Неверный логин или пароль')
            }

            return response.json()
        })
        .then((data) => {
            // Согласно документации API, ответ имеет формат: { "user": { ..., "token": "..." } }
            if (data.user && data.user.token) {
                setToken(data.user.token)
                // Сохраняем информацию о пользователе (без пароля для безопасности)
                const userData = {
                    id: data.user.id,
                    login: data.user.login,
                    name: data.user.name,
                }
                localStorage.setItem('user', JSON.stringify(userData))
                return data
            }
            throw new Error('Токен не получен')
        })
}

// Получить список комментариев
export function fetchComments() {
    const token = getToken()
    const headers = {}

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    return fetch(`${BASE_URL}/comments`, {
        method: 'GET',
        headers: headers,
    })
        .then((response) => {
            if (!response.ok) {
                return response.text().then((text) => {
                    let errorMessage = 'Ошибка при загрузке комментариев'
                    try {
                        const errorData = JSON.parse(text)
                        errorMessage = errorData.error || errorMessage
                    } catch (e) {
                        errorMessage = text || errorMessage
                    }
                    throw new Error(errorMessage)
                })
            }
            return response.json()
        })
        .then((data) => data.comments)
}

// Добавить новый комментарий (только для авторизованных)
export function postComment({ text }) {
    const token = getToken()
    if (!token) {
        throw new Error('Требуется авторизация')
    }

    return fetch(`${BASE_URL}/comments`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            text: text.trim(),
        }),
    })
        .then((response) => {
            if (response.status === 400) {
                return response.json().then((data) => {
                    throw new Error(data.error || 'Ошибка валидации')
                })
            }

            if (response.status === 401) {
                throw new Error('Требуется авторизация')
            }

            if (!response.ok) {
                return response.text().then((text) => {
                    let errorMessage = 'Ошибка при отправке комментария'
                    try {
                        const errorData = JSON.parse(text)
                        errorMessage = errorData.error || errorMessage
                    } catch (e) {
                        errorMessage = text || errorMessage
                    }
                    throw new Error(errorMessage)
                })
            }

            return response.json()
        })
        .catch((error) => {
            // Если это уже обработанная ошибка, пробрасываем её дальше
            if (
                error.message === 'Требуется авторизация' ||
                error.message === 'Ошибка валидации' ||
                error.message.includes('3 символа')
            ) {
                throw error
            }

            // Проверяем, это ошибка сети или другая ошибка
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('network')
            }

            // Иначе пробрасываем оригинальную ошибку
            throw error
        })
}
