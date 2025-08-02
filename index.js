import { fetchComments } from './modules/api.js'
import { renderComments } from './modules/renderComments.js'
import { setupAddCommentHandler } from './modules/addCommentHandler.js'

fetchComments()
    .then((comments) => {
        renderComments(comments)
        setupAddCommentHandler(comments)
    })
    .catch((error) => {
        console.error('Ошибка загрузки комментариев', error)
        const commentsContainer = document.querySelector('.comments')
        commentsContainer.innerHTML = '<p>Ошибка загрузки комментариев</p>'
    })
