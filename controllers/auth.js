const { response } = require("express")
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generarJWT");


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si Email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos -- email '
            })
        }

        //Verificar si usuario está activo en BD
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario no existe -- usuario inactivo'
            })
        }

        //Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos -- password'
            })
        }

        //Generar JWT
        const token = await generarJWT( usuario.id);

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


module.exports = {
    login
}