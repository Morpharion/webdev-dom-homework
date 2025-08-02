import { escapeHtml } from './escapeHtml.js'
import { getCurrentDate } from './formatDate.js'
import { postComment } from './api.js'
import { renderComments } from './renderComments.js'

export function setupAddCommentHandler(comments, loadComments) {
    const addButton = document.querySelector('.add-form-button')
    const nameInput = document.querySelector('.add-form-name')
    const textInput = document.querySelector('.add-form-text')
    const formElement = document.querySelector('.add-form')

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
                return loadComments()
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

// export function setupAddCommentHandler() {
//     const addButton = document.querySelector('.add-form-button')
//     const nameInput = document.querySelector('.add-form-name')
//     const textInput = document.querySelector('.add-form-text')

//     addButton.addEventListener('click', function () {
//         const userName = nameInput.value.trim()
//         const commentText = textInput.value.trim()

//         if (userName === '' || commentText === '') {
//             alert('Пожалуйста, введите ваше имя и комментарий.')
//             return
//         }

//         const newComment = {
//             author: escapeHtml(userName),
//             date: getCurrentDate(),
//             text: escapeHtml(commentText),
//             likes: 0,
//             isLiked: false,
//         }

//         commentsData.push(newComment)
//         renderComments()

//         nameInput.value = ''
//         textInput.value = ''
//     })
// }
