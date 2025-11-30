import { fetchComments } from './modules/api.js'
import { renderComments } from './modules/renderComments.js'
import { setupAddCommentHandler } from './modules/addCommentHandler.js'
import { renderLoginPage } from './modules/loginPage.js'
import { isAuthenticated, getAuthUser } from './modules/auth.js'
import { escapeHtml } from './modules/escapeHtml.js'

// Роутинг приложения
function initApp() {
    const container = document.querySelector('.container')
    
    if (!container) {
        console.error('Контейнер .container не найден!')
        return
    }

    // Проверяем, есть ли параметр ?login в URL
    const urlParams = new URLSearchParams(window.location.search)
    const isLoginPage = urlParams.get('login') === 'true'

    if (isLoginPage) {
        renderLoginPage()
    } else {
        renderCommentsPage()
    }
}

// Рендер страницы комментариев
function renderCommentsPage() {
    const container = document.querySelector('.container')
    
    if (!container) {
        console.error('Контейнер .container не найден!')
        return
    }

    const isAuth = isAuthenticated()
    const user = getAuthUser()

    container.innerHTML = `
        <ul class="comments"></ul>
        ${isAuth ? renderAddForm(user) : renderAuthLink()}
    `

    const commentsContainer = document.querySelector('.comments')
    
    if (!commentsContainer) {
        console.error('Контейнер .comments не найден!')
        return
    }

    function loadComments(showLoader = true) {
        if (showLoader) {
            commentsContainer.innerHTML = '<p>Загрузка комментариев...</p>'
        }

        return fetchComments()
            .then((comments) => {
                if (!comments || !Array.isArray(comments)) {
                    console.error('Некорректные данные комментариев:', comments)
                    commentsContainer.innerHTML = '<p>Ошибка: некорректные данные комментариев</p>'
                    return
                }
                renderComments(comments)
            })
            .catch((error) => {
                console.error('Ошибка загрузки комментариев', error)
                const errorMessage = error.message || 'Ошибка загрузки комментариев'
                commentsContainer.innerHTML = `<p style="color: #ff6b6b; padding: 20px; text-align: center;">${errorMessage}</p>`
            })
    }

    if (isAuth) {
        setupAddCommentHandler(loadComments, user)
    }

    loadComments()
}

// Рендер формы добавления комментария (для авторизованных)
function renderAddForm(user) {
    const userName = user?.name || user?.login || 'Пользователь'
    return `
        <div class="add-form">
            <input 
                type="text" 
                class="add-form-name" 
                value="${escapeHtml(userName)}" 
                readonly 
            />
            <textarea 
                class="add-form-text" 
                placeholder="Введите ваш комментарий" 
                rows="4"
            ></textarea>
            <div class="add-form-row">
                <button class="add-form-button">Написать</button>
            </div>
        </div>
    `
}

// Рендер ссылки на авторизацию (для неавторизованных)
function renderAuthLink() {
    return `
        <div class="auth-link-container">
            <a href="?login=true" class="auth-link">Чтобы добавить комментарий, авторизуйтесь</a>
        </div>
    `
}

// Инициализация приложения
try {
    // Убеждаемся, что DOM загружен
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp)
    } else {
        initApp()
    }
} catch (error) {
    console.error('Критическая ошибка при инициализации приложения:', error)
    const container = document.querySelector('.container')
    if (container) {
        container.innerHTML = `<p style="color: #ff6b6b; padding: 20px; text-align: center;">Критическая ошибка: ${error.message}</p>`
    }
}
