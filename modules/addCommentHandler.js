import { escapeHtml } from './escapeHtml.js'
import { getCurrentDate } from './formatDate.js'
import { postComment } from './api.js'
import { renderComments } from './renderComments.js'

export function setupAddCommentHandler(comments) {
    const addButton = document.querySelector('.add-form-button')
    const nameInput = document.querySelector('.add-form-name')
    const textInput = document.querySelector('.add-form-text')

    addButton.addEventListener('click', async () => {
        const userName = nameInput.value.trim()
        const commentText = textInput.value.trim()

        if (userName.length < 3 || commentText.length < 3) {
            alert('Имя и комментарий должны содержать минимум 3 символа')
            return
        }

        try {
            await postComment({
                name: userName,
                text: commentText,
            })

            comments.push({
                author: { name: escapeHtml(userName) },
                date: getCurrentDate(),
                text: escapeHtml(commentText),
                likes: 0,
                isLiked: false,
            })

            renderComments(comments)

            nameInput.value = ''
            textInput.value = ''
        } catch (error) {
            alert('Ошибка при отправке комментария')
            console.error(error)
        }
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
