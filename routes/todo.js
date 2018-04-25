const express = require('express')
const router = express.Router()
const knex = require('../knex')

// READ / LIST all todos of a given userId
router.get('/', (req, res, next) => {
  const { userId } = req
  knex('todo')
    .select('id', 'item')
    .where('user_id', userId)
    .then((result) => res.json(result))
})

// READ a particular todoid but only if it is from the user in the JWT token.
router.get('/:id', (req, res, next) => {
  const { userId } = req
  const { id } = req.params

  knex('todo')
    .select('id', 'item')
    .where('user_id', userId)
    .andWhere('id', id)
    .then((result) => {
      if (result.length > 0) {
        res.json(result)
      }
      else {
        res.status(404).json({ error: `Item ${id} not found` })
      }
    })
})

// CREATE a new item
router.post('/', (req, res, next) => {
  const { userId } = req
  const { item } = req.body

  knex('todo')
    .insert({ item, user_id: userId })
    .returning('*')
    .then((result) => res.send(result))
})

// UPDATE an existing item
router.patch('/:id', (req, res, next) => {
  const { userId } = req
  const { id } = req.params
  const { item } = req.body

  knex('todo')
    .update({ item })
    .where('id', id)
    .andWhere('user_id', userId)
    .returning('*')
    .then((result) => res.json(result))
})

module.exports = router
