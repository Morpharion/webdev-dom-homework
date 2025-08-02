import { commentsData } from './data.js'
import { applyQuoteFormatting, stripQuoteTags } from './replaceQuotes.js'

export function renderComments() {
    const commentsContainer = document.querySelector('.comments')
    commentsContainer.innerHTML = ''

    commentsData.forEach((comment, index) => {
        const newComment = document.createElement('li')
        newComment.classList.add('comment')
        newComment.dataset.index = index

        const formattedText = applyQuoteFormatting(comment.text)

        newComment.innerHTML = `
      <div class=\"comment-header\">
        <div>${comment.author}</div>
        <div>${comment.date}</div>
      </div>
      <div class=\"comment-body\">
        <div class=\"comment-text\" style=\"white-space: pre-line;\">${formattedText}</div>
      </div>
      <div class=\"comment-footer\">
        <div class=\"likes\">
          <span class=\"likes-counter\">${comment.likes}</span>
          <button class=\"like-button ${comment.isLiked ? '-active-like' : ''}\" data-index=\"${index}\"></button>
        </div>
      </div>
    `

        newComment
            .querySelector('.like-button')
            .addEventListener('click', (event) => {
                event.stopPropagation()
                commentsData[index].isLiked = !commentsData[index].isLiked
                commentsData[index].likes += commentsData[index].isLiked
                    ? 1
                    : -1
                renderComments()
            })

        newComment.addEventListener('click', () => {
            const textInput = document.querySelector('.add-form-text')
            textInput.value = `QUOTE_BEGIN ${comment.author}: ${stripQuoteTags(comment.text)} QUOTE_END\\n`
        })

        commentsContainer.appendChild(newComment)
    })
}
