const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { correoExiste, esRoleValido, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete 
} = require('../controllers/usuarios');

const router = Router();


router.get('/', usuariosGet);

router.post('/', [
    check('nombre','El nombre es obligatorio.').not().isEmpty(),
    check('password','El password debe tener más de 5 letras.').isLength({ min: 6}),
    check('correo','El correo no es válido.').isEmail(),
    check('correo').custom( correoExiste ),
    check('rol').custom( esRoleValido ),
    validarCampos 
], usuariosPost);

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut);

router.patch('/',usuariosPatch);

router.delete('/:id',[
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuariosDelete);


module.exports = router;

