import { Request, Response } from 'express'
import {db} from '../database/banco-mongo'
import bcrypt from 'bcrypt'

class UsuariosController {
    async adicionar(req:Request, res:Response){
        const {nome, email, senha} = req.body
    if (!nome || !email || !senha) 
        return res.status(400).json({message: 'Missing required fields'})
    if (senha.length < 6) 
        return res.status(400).json({message: 'Senha must be at least 6 characters long'})
    if (email.includes('@') === false) 
        return res.status(400).json({message: 'Email must be valid'})
    if (email.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        return res.status(400).json({message: 'Email must be valid'})
    
    const senhaCript = await bcrypt.hash(senha, 10)
    const usuario = {nome, email, senhaCript}
    const result = await db.collection('usuarios').insertOne(usuario)
    res.json({
        nome,
        email,
        senhaCript,
        _id: result.insertedId
    })
    }
    async listar(req:Request, res:Response){
        const usuarios = await db.collection('usuarios').find().toArray()
        const usuariosSemSenha = usuarios.map(usuario => ({
            ...usuario,
            senha: undefined
        }))
        res.json(usuariosSemSenha)
    }
}

export default new UsuariosController()