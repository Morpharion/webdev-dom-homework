const commentsContainer = document.querySelector('.comments')
const addButton = document.querySelector('.add-form-button')
const nameInput = document.querySelector('.add-form-name')
const textInput = document.querySelector('.add-form-text')

import { commentsData } from './modules/data.js'
import { renderComments } from './modules/renderComments.js'
import { setupAddCommentHandler } from './modules/addCommentHandler.js'

renderComments()
setupAddCommentHandler()
