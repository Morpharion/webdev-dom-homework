import { applyQuoteFormatting, stripQuoteTags } from './replaceQuotes.js'
import { escapeHtml } from './escapeHtml.js'

export function renderComments(commentsData) {
    const commentsContainer = document.querySelector('.comments')
    
    if (!commentsContainer) {
        console.error('Контейнер .comments не найден!')
        return
    }
    
    if (!commentsData || !Array.isArray(commentsData)) {
        console.error('Некорректные данные комментариев:', commentsData)
        commentsContainer.innerHTML = '<p>Ошибка: некорректные данные комментариев</p>'
        return
    }
    
    commentsContainer.innerHTML = ''

    if (commentsData.length === 0) {
        commentsContainer.innerHTML = '<p>Пока нет комментариев</p>'
        return
    }

    commentsData.forEach((comment, index) => {
        const newComment = document.createElement('li')
        newComment.classList.add('comment')
        newComment.dataset.index = index

        // Если нет поля isLiked, то добавляем (локальное состояние)
        if (typeof comment.isLiked === 'undefined') {
            comment.isLiked = false
        }

        // Экранируем текст перед форматированием для защиты от XSS
        const escapedText = escapeHtml(comment.text)
        const formattedText = applyQuoteFormatting(escapedText)

        // Экранируем имя автора
        const authorName = escapeHtml(comment.author.name ?? comment.author)

        newComment.innerHTML = `
      <div class="comment-header">
        <div>${authorName}</div>
        <div>${new Date(comment.date).toLocaleString()}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text" style="white-space: pre-line;">${formattedText}</div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="like-button ${comment.isLiked ? '-active-like' : ''}" data-index="${index}"></button>
        </div>
      </div>
    `

        newComment
            .querySelector('.like-button')
            .addEventListener('click', (event) => {
                event.stopPropagation()
                comment.isLiked = !comment.isLiked
                comment.likes += comment.isLiked ? 1 : -1
                renderComments(commentsData)
            })

        newComment.addEventListener('click', () => {
            const textInput = document.querySelector('.add-form-text')
            if (textInput) {
                textInput.value = `QUOTE_BEGIN ${comment.author.name ?? comment.author}: ${stripQuoteTags(comment.text)} QUOTE_END\n`
            }
        })

        commentsContainer.appendChild(newComment)
    })
}
