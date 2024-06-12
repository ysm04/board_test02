var express = require('express');
var router = express.Router();
global.moment = require("moment")

/* GET home page. */
router.get('/', async function (req, res, next) {
  var [rows] = await connection.query("select * from board order by writeDate desc")
  res.render('index', { boards: rows });
});

router.get("/write", function (req, res) {
  res.render("write")
})

router.post("/board/write", async function (req, res) {
  console.log(req.body)
  await connection.query("insert into board(title,writer,body) values(?,?,?)",
    [req.body.title, req.body.writer, req.body.body])

  res.redirect("/")
})

router.get("/view/:no", async function (req, res) {
  var no = req.params.no

  var [rows] = await connection.query("select * from board where no=?", [no])
  var board = rows[0]
  board.hits++
  await connection.query("update board set hits=? where no=?", [board.hits, no])

  res.render("view", { board: board })

})
router.get("/delete/:no", async function (req, res) {
  var no = req.params.no
  await connection.query("delete from board where no=?", [no])
  res.redirect("/")
})

router.get("/modify/:no", async function (req, res) {
  var [rows] = await connection.query("select * from board where no=?", [req.params.no])
  var board = rows[0]
  res.render("modify", { board: board })
})
router.post("/board/modify", async function (req, res) {
  var query = "update board set title=?,writer=?,body=? where no=?"
  await connection.query(query, [req.body.title, req.body.writer, req.body.body, req.body.no])
  res.redirect("/view/" + req.body.no)
})



module.exports = router;
