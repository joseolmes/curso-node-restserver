const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT,
    validarCampos,
    esAdminRole
} = require('../middlewares');

const { crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

//Obtener todas las categorías - público
router.get('/', obtenerCategorias);

//Obtener una categoría por id - público
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], obtenerCategoria);

//Crear categoría - privado - cualquier persona con token válido.
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

//Borrar una categoría - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);

module.exports = router;