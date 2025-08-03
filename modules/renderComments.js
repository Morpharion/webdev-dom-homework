import { applyQuoteFormatting, stripQuoteTags } from './replaceQuotes.js'

export function renderComments(commentsData) {
    const commentsContainer = document.querySelector('.comments')
    commentsContainer.innerHTML = ''

    commentsData.forEach((comment, index) => {
        const newComment = document.createElement('li')
        newComment.classList.add('comment')
        newComment.dataset.index = index

        // Если нет поля isLiked, то добавляем (локальное состояние)
        if (typeof comment.isLiked === 'undefined') {
            comment.isLiked = false
        }

        const formattedText = applyQuoteFormatting(comment.text)

        newComment.innerHTML = `
      <div class="comment-header">
        <div>${comment.author.name ?? comment.author}</div>
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
            textInput.value = `QUOTE_BEGIN ${comment.author.name ?? comment.author}: ${stripQuoteTags(comment.text)} QUOTE_END\n`
        })

        commentsContainer.appendChild(newComment)
    })
}
