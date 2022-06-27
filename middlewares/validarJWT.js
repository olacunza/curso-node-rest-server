const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No ha enviado JWT'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETOPRIVATEKEY);

        // Leer al usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en BD'
            })
        }
        // Verificar si el uid tiene estado en true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido -- uid false'
            })
        }
        req.usuario = usuario;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: ' token no valido de catch'
        });
    }
}


module.exports = {
    validarJWT
}