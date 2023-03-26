import { users } from "../models/users.js";
export const getUsuarios=async (req,res)=>{
    try {
        const data=await users.findAll();
        res.render('json-viewer.ejs',{data});
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
};
export const inicio=(req,res)=>{
    res.render("Inicio");
}
export const signup=(req,res)=>{
    res.render("signup")
}
export const login=(req,res)=>{
    res.render("login");
}
