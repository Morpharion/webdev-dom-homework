import { fetchComments } from './modules/api.js'
import { renderComments } from './modules/renderComments.js'
import { setupAddCommentHandler } from './modules/addCommentHandler.js'

const commentsContainer = document.querySelector('.comments')

function loadComments() {
    commentsContainer.innerHTML = '<p>Загрузка комментариев...</p>'

    return fetchComments()
        .then((comments) => {
            renderComments(comments)
            setupAddCommentHandler(comments, loadComments)
        })
        .catch((error) => {
            console.error('Ошибка загрузки комментариев', error)
            commentsContainer.innerHTML = '<p>Ошибка загрузки комментариев</p>'
        })
}

loadComments()
