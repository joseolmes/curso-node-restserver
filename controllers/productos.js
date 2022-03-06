const { response } = require("express");

const { Producto } = require('../models');


//obtenerProductos - paginado - total - populate
const obtenerProductos = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const filtroEstado = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(filtroEstado),
        Producto.find(filtroEstado)
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
}

//obtenerProducto - populate{}
const obtenerProductoPorId = async (req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        ;

    res.json(producto);
}

const crearProducto = async (req, res = response) => {
    const nombre = req.body.nombre;

    const productoDB = await Producto.findOne({ nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe.`
        });
    }

    //Generar la data a guardar:
    const data = {
        nombre,
        usuario: req.usuario._id,
        precio: req.body.precio,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
    }

    const producto = new Producto(data);

    //Guardar DB
    await producto.save();

    res.status(201).json(producto);
}

//Actualizar Producto
const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto);
}

//Borrar Producto - estado: false
const borrarProducto =async (req, res = response) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, {new: true});

    res.json( productoBorrado );
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    borrarProducto
}
