import { postComment } from './api.js'

let hasListener = false

export function setupAddCommentHandler(loadComments, user) {
    const addButton = document.querySelector('.add-form-button')
    const nameInput = document.querySelector('.add-form-name')
    const textInput = document.querySelector('.add-form-text')
    const formElement = document.querySelector('.add-form')

    if (hasListener) return
    hasListener = true

    addButton.addEventListener('click', () => {
        const commentText = textInput.value.trim()

        if (commentText.length < 3) {
            alert('Комментарий должен содержать минимум 3 символа')
            return
        }

        // Скрываем форму и показываем сообщение
        formElement.style.display = 'none'

        const loadingMessage = document.createElement('p')
        loadingMessage.textContent = 'Комментарий добавляется...'
        loadingMessage.classList.add('add-loader')
        formElement.parentNode.insertBefore(loadingMessage, formElement)

        postComment({
            text: commentText,
        })
            .then(() => {
                textInput.value = ''

                // Удаляем сообщение, показываем форму
                loadingMessage.remove()
                formElement.style.display = 'flex'

                // Перезагружаем комментарии с сервера
                return loadComments(false)
            })
            .catch((error) => {
                loadingMessage.remove()
                formElement.style.display = 'flex'

                if (error.message.includes('3 символа') || error.message === 'Ошибка валидации') {
                    alert('Комментарий должен быть не короче 3 символов')
                } else if (error.message === 'Требуется авторизация') {
                    alert('Требуется авторизация. Пожалуйста, войдите снова.')
                    window.location.href = '?login=true'
                } else if (error.message === 'network') {
                    alert('Кажется, у вас сломался интернет, попробуйте позже')
                } else {
                    alert(error.message || 'Ошибка при отправке комментария')
                }

                console.error(error)
            })
    })
}
