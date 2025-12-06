import express, { json, Request, Response } from "express"
import {Pool} from "pg"
const app = express();
const port = 3000;
app.use(express.json());
// app.use(express.urlencoded());

const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STR}`,
});

const initDB = async()=>{
  await pool.query(`
    
    `)
}

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World! Iam saju')
})

app.post('/',(req:Request,res:Response)=>{
    console.log(req.body);
    res.status(201).json({
        success: true,
        message: "API is Running"
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
