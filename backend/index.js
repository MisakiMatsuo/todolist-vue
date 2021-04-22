// Expressの導入
const express = require('express')
// Firestoreの導入
const { Firestore } = require('@google-cloud/firestore')
// bodyParserの導入
const bodyParser = require('body-parser')
// Expressの関数定義
const app = express()
// firestoreのインスタンスを生成
const firestore = new Firestore()
app.use(bodyParser.json())

app.get('/', async function (req, res) {
  const document = firestore.doc('tasks/3')
  const doc = await document.get()
  console.log(doc._fieldsProto)
  res.send(doc._fieldsProto)
})

app.put('/:1', async function (req, res) {
  const document = firestore.doc(`tasks/${req.body.id}`)
  // ドキュメントに対してプロパティをセット
  await document.set({
    name: req.body.name,
    id: req.body.id,
    priority: req.body.priority,
  })
  console.log(req.body)
  res.send('なーたん')
})

app.post('/', async function (req, res) {
  // データベースを登録する処理
  const document = firestore.doc(`tasks/${req.body.id}`)
  // ドキュメントに対してプロパティをセット
  await document.set({
    name: req.body.name,
    id: req.body.id,
    priority: req.body.priority,
  })
  console.log(req.body)
  res.send('舞香たん')
})

app.delete('/', async function (req, res) {
  // データベースを登録する処理
  const document = firestore.doc(`tasks/${req.body.id}`)
  // ドキュメントに対してプロパティをセット
  await document.set({
    name: req.body.name,
    id: req.body.id,
    priority: req.body.priority,
  })
  res.send('亀井絵理たん')
})

app.listen(8080)
