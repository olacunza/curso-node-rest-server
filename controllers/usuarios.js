const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');


const usuariosGet = async (req = request, res) => {

    //const { q, nombre = 'no Name', apikey, page = 10, limit } = req.query;
    const { limite = 5, desde = 0 } = req.query;

    /*const usuarios = await Usuario.find({ estado: true })
        .skip(Number(desde))
        .limit(Number(limite));

    const total = await Usuario.countDocuments({ estado: true });*/

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({ estado: true }),
        Usuario.find({ estado: true })
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        msg: 'get API - Controlador',
        total,
        usuarios
    });
}

const usuariosPut = async (req, res = response) => {
    //const IDs = req.params.id;
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO validar contra BD
    if (password) {
        //Encriptar la password
        const salt = bcryptjs.genSaltSync(5);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({
        msg: 'put API - Controller',
        usuario
    });
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la password
    const salt = bcryptjs.genSaltSync(5);
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en la BD
    await usuario.save();

    res.json({
        msg: 'post API - Controlador',
        usuario
    });
}

const usuariosDelete = async (req, res) => {
    const { id } = req.params;
    //const body = req.body;
    //const query = req.query;

    // Fisicamente borra de la BD
    /*const usuario = await Usuario.findByIdAndDelete( id );*/

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    //const usuarioAutenticado = req.usuario;

    res.json({
        msg: 'delete API - controlador',
        usuario
        //,usuarioAutenticado
    });
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}