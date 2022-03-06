const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT,
    validarCampos,
    esAdminRole
} = require('../middlewares');

const { crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    borrarProducto,
} = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

//Obtener todos los productos - público
router.get('/', obtenerProductos);

//obtenerProducto - populate{}
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], obtenerProductoPorId);

//Crear producto - privado - cualquier persona con token válido.
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoría es obligatoria').not().isEmpty(),
    check('categoria', 'La categoría No es un id de Mongo válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

//Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),    
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

//Borrar Producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router;