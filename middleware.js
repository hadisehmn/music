
const express = require('express');
const app = express();
app.use(express.json());
const port = 9090;


app.use((req, res, next)=>{
    const token = req.header('Authorization')?.replace('Bearer ', '');
            
    if (!token) {
        return res.status(401).json({ message: 'invalid token, access denied.' });
    }

    try {
        jwt.verify(token, SECRET_KEY);
        //const decode = jwt.verify(token, SECRET_KEY);
        //req.user = decode;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'invalid token, access denied.' });
    }
})

