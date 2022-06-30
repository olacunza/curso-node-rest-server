const { response } = require("express")
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si Email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos -- email '
            })
        }

        // Verificar si usuario está activo en BD
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario no existe -- usuario inactivo'
            })
        }

        // Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos -- password'
            })
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salió mal'
        })
    }

}

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {

            // Si el usuario no existe, tengo que crearlo
            // Primero tengo que crear la data que debo de guardar

            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER_ROLE',
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en BD está en false

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT

        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Todo Ok, google Sign - In',
            usuario,
            token
        });

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'El token de google no se pudo verificar !!'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}