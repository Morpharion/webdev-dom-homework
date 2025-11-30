import { login } from './api.js'

export function renderLoginPage() {
    const container = document.querySelector('.container')
    
    if (!container) {
        console.error('Контейнер .container не найден!')
        return
    }
    
    container.innerHTML = `
        <div class="login-form">
            <h2 class="login-title">Форма входа</h2>
            <form class="login-form-element">
                <input 
                    type="text" 
                    class="login-input" 
                    placeholder="Введите логин" 
                    autocomplete="username"
                    required
                />
                <input 
                    type="password" 
                    class="login-input" 
                    placeholder="Введите пароль" 
                    autocomplete="current-password"
                    required
                />
                <div class="login-error" style="display: none;"></div>
                <button type="submit" class="login-button">Войти</button>
            </form>
        </div>
    `

    const form = container.querySelector('.login-form-element')
    const errorDiv = container.querySelector('.login-error')
    const loginInput = container.querySelector('.login-input[type="text"]')
    const passwordInput = container.querySelector('.login-input[type="password"]')
    const submitButton = container.querySelector('.login-button')

    form.addEventListener('submit', (event) => {
        event.preventDefault()

        const userLogin = loginInput.value.trim()
        const userPassword = passwordInput.value.trim()

        if (!userLogin || !userPassword) {
            showError('Заполните все поля')
            return
        }

        // Показываем состояние загрузки
        submitButton.disabled = true
        submitButton.textContent = 'Вход...'
        errorDiv.style.display = 'none'

        login({
            login: userLogin,
            password: userPassword,
        })
            .then(() => {
                // Успешная авторизация - перенаправляем на главную страницу
                window.location.href = window.location.pathname
            })
            .catch((error) => {
                submitButton.disabled = false
                submitButton.textContent = 'Войти'
                showError(error.message || 'Ошибка при входе. Проверьте логин и пароль.')
            })
    })

    function showError(message) {
        errorDiv.textContent = message
        errorDiv.style.display = 'block'
    }
}

