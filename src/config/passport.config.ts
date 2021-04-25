import passport from "passport";
import {getRepository} from "typeorm";
import {User} from "../models/user.model";
import {compare} from "bcrypt";

const LocalStrategy = require('passport-local').Strategy;


export function configure() {
    passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function (username: string, password: string, done) {
        getRepository(User).findOne({username: username}, {select: ["id", "username", "password"]})
            .then(async user => {
                if (user === undefined) {
                    return done(null, false);
                }
                if (!(await compare(password, user.password))) {
                    return done(null, false);
                }
                return done(null, user);
            }).catch(err => {
            return done(err, false);
        });
    }));

    passport.serializeUser((user: User, cb: any) => {
        cb(null, user.id);
    });

    passport.deserializeUser(function (id: string, cb) {
        getRepository(User).findOne(id, {relations: ["employee"]})
            .then(user => {
                cb(null, user);
            }).catch(err => cb(err, false));
    });
}
