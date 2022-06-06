const { response, request } = require('express');


const usuariosGet = (req = request, res) => {

    //const query = req.query;
    const { q, nombre = 'no Name', apikey, page = 10, limit } = req.query;

    res.status(403).json({
        //ok: "true",
        msg: 'get API - Controlador',
        //query
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPut = (req, res) => {
    //const IDs = req.params.id;
    const { id } = req.params;

    res.json({
        //ok: "true",
        msg: 'put API - Controller',
        id
    });
}

const usuariosPost = (req, res) => {
    const { nombre, edad } = req.body;

    res.json({
        //ok: "true",
        msg: 'post API - Controlador',
        nombre,
        edad
    });
}

const usuariosDelete = (req, res) => {
    const body = req.body;

    res.json({
        //ok: "true",
        msg: 'delete API - controlador',
        body
    });
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}