import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "auth_users",
  password: "PASSWORD",
  port: 5432,
})

db.connect()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username
  const password = req.body.password

  try{
    const checkResult = await db.query("SELECT * FROM users where email = $1", [email])

    if(checkResult.rows.length > 0){
      console.log("bad email")
      res.send("Email Already Exists")
    } else {
      const result = await db.query("INSERT INTO users (email, password) VALUES (($1), ($2))", [email, password])
      console.log(result)
      res.render('secrets.ejs')
    }
  } catch(err) {
    console.log(err)
  }
  

});

  


app.post("/login", async (req, res) => {
  const email = req.body.username
  const password = req.body.password

  try{
    const checkCredentials= await db.query("SELECT * FROM users where email = $1", [email])
    console.log(checkCredentials.rows)

    if(checkCredentials.rows.length > 0){
      if (password === checkCredentials.rows[0].password){
        res.render('secrets.ejs')
      }
    } else {
      console.log("Invalid Credentials")
      res.redirect("/")
    }
  } catch(err) {
    console.log(err)
  }

  


});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
