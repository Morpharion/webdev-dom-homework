import { postComment } from './api.js'

let hasListener = false

export function setupAddCommentHandler(loadComments) {
    const addButton = document.querySelector('.add-form-button')
    const nameInput = document.querySelector('.add-form-name')
    const textInput = document.querySelector('.add-form-text')
    const formElement = document.querySelector('.add-form')

    if (hasListener) return
    hasListener = true

    addButton.addEventListener('click', () => {
        const userName = nameInput.value.trim()
        const commentText = textInput.value.trim()

        if (userName.length < 3 || commentText.length < 3) {
            alert('Имя и комментарий должны содержать минимум 3 символа')
            return
        }

        // Скрываем форму и показываем сообщение
        formElement.style.display = 'none'

        const loadingMessage = document.createElement('p')
        loadingMessage.textContent = 'Комментарий добавляется...'
        loadingMessage.classList.add('add-loader')
        formElement.parentNode.insertBefore(loadingMessage, formElement)

        postComment({
            name: userName,
            text: commentText,
        })
            .then(() => {
                nameInput.value = ''
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

                if (error.message === '400') {
                    alert('Имя и комментарий должны быть не короче 3 символов')
                } else if (error.message === '500') {
                    alert('Сервер сломался, попробуй позже')
                } else if (error.message === 'network') {
                    alert('Кажется, у вас сломался интернет, попробуйте позже')
                } else {
                    alert('Ошибка при отправке комментария')
                }

                console.error(error)
            })
    })
}
