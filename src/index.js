import {sequelize} from './database/database.js';

//models
import './models/users.js';
import './models/post.js';
import './models/like.js';
import './models/comment.js';
import './models/follower.js';
import './models/LikedPosts.js';

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';

// initilizations
const app = express();
// middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());
// Configuración de sesión
app.use(cookieParser('justatopsecret'));
app.use(session({
    secret: 'justatopsecret',
    resave: false,
    saveUninitialized: false
}));

//middlewares PASSPORT
app.use(passport.initialize());
app.use(passport.session());

//relations
import './models/relations/relations.js';


// routes
import passporT from './routes/passport.routes.js';
app.use(passporT);
import usuarios from './routes/usuarios.routes.js';
app.use(usuarios);
import pubcom from './routes/pub.com.routes.js'
app.use(pubcom);

// controllers
import './controllers/passport.js';
import './controllers/auth.js';

// vista aplicaciones
app.set('view engine', 'ejs');

const port = 3000;

app.listen(port);

async function main() {
    try {
        await sequelize.sync();
        console.log('Connection has been established');
        console.log(`Listening on port: ${port}`);
    } catch(error) {
        console.error("Unable to connect to database", error);
    }
}

main();
