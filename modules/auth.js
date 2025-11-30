import { getToken, getCurrentUser } from './api.js'

// Проверка, авторизован ли пользователь
export function isAuthenticated() {
    return getToken() !== null
}

// Получить информацию о текущем пользователе
export function getAuthUser() {
    // Сначала пытаемся получить из localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
        try {
            return JSON.parse(storedUser)
        } catch (error) {
            // Если не удалось распарсить, получаем из токена
        }
    }

    // Если нет в localStorage, получаем из токена
    const tokenUser = getCurrentUser()
    if (tokenUser) {
        return tokenUser
    }

    return null
}

