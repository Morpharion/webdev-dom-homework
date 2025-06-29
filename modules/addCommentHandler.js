import { escapeHtml } from './escapeHtml.js'
import { getCurrentDate } from './formatDate.js'
import { commentsData } from './data.js'
import { renderComments } from './renderComments.js'

export function setupAddCommentHandler() {
    const addButton = document.querySelector('.add-form-button')
    const nameInput = document.querySelector('.add-form-name')
    const textInput = document.querySelector('.add-form-text')

    addButton.addEventListener('click', function () {
        const userName = nameInput.value.trim()
        const commentText = textInput.value.trim()

        if (userName === '' || commentText === '') {
            alert('Пожалуйста, введите ваше имя и комментарий.')
            return
        }

        const newComment = {
            author: escapeHtml(userName),
            date: getCurrentDate(),
            text: escapeHtml(commentText),
            likes: 0,
            isLiked: false,
        }

        commentsData.push(newComment)
        renderComments()

        nameInput.value = ''
        textInput.value = ''
    })
}
