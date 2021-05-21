'use strict'

var validator = require('validator');
const article = require('../models/article');
var Article = require('../models/article');

var fs = require('fs');
var path = require('path');

var controller = {
    datosCurso: (req,res)=>{

        return res.status(200).send({
            curso:"Master Framework JS",
            autor:"Marco Melendez",
            url:"",
        });
    },

    test: (req,res)=>{
        return res.status(200).send({
            message: "Soy la accion test de mi controlador de articulo"
        });
    },

    save: (req,res)=>{

        // recorger post
        var params = req.body;
        // validar datos

        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (error) {
            return res.status(200).send({
                message: "Faltan datos por enviar!!!"
            });
        }

        if(validate_title && validate_content){
            
            // Crear el objeto a guardar
            var article = new Article(); 
            // Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = params.image;

            if(params.image){
                article.image = params.image;
            }
            
            // Guardar valores

            article.save((err,articleStore)=>{
                if(err || !articleStore){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado!!'
                    })
                }

                // Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStore
                });
            });

        }else{
              
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            });
        
        }
    },

    getArticles: (req,res)=>{

        var query = Article.find({});

        var last = req.params.last;
        console.log(last);
        if(last || last != undefined){
            query.limit(5);
        }

        query.sort('-_id').exec((err,articles) => {
           
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                });
            }

            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    },

    getArticle: (req,res) =>{

        // Recoger el id de la url
        var articleId = req.params.id;
        // Comprobar si existe
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el aritucle'
            });
        }
        // Buscar el articulo
        Article.findById(articleId,(err,article)=>{

            if(err || !article){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulo para mostrar'
                });
            }
            // Devolvero al json
            return res.status(200).send({
                status: 'success',
                article
            });
        });
    },

    update: (req,res)=>{

        // Recoger el id del articulo por la url
        var articleId = req.params.id;
        // Recoger los datos que llegan por put
        var params = req.body;
        console.log(params);
        // Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

            if(validate_title && validate_content){
                // find and update
                Article.findOneAndUpdate({_id:articleId},params,{new:true},(err,articleUpdate)=>{
                    if(err){
                       return res.status(500).send({
                           status: 'error',
                           message: 'Error al actualizar'
                       }); 
                    }
   
                    if(!articleUpdate){
                       return res.status(404).send({
                           status: 'error',
                           message: 'No exixte el articulo'
                       }); 
                    }
   
                    return res.status(200).send({
                       status: 'success',
                       article: articleUpdate
                   }); 
                });
   
           }else{
               
               return res.status(200).send({
                   status: 'error',
                   message: 'La validacion no es correcta'
               });
           }


        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
    },

    delete:(req,res)=>{

        var articleId = req.params.id;

        Article.findOneAndDelete({_id: articleId},(err,articleRemove)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar !!!'
                });
            }

            if(!articleRemove){
                return res.status(500).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, posiblemente no exista !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                article:articleRemove
            });
        });
    },

    upload:(req,res)=>{

        // Configurar el modulo connect multipary router/article.js (hecho)
        
        // Recoger el fichero de la peticion
        var file_name = 'Imagen no subida';

        // Conseguir nombre y 

        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        var file_name = file_split[2];

        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        if(file_ext !='png' && file_ext !='jpg' && file_ext !='jpeg' && file_ext != 'gif'){
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message:'La extension de la imagen no es valida !!!'
                });
            });

        }else{
            
            var articleId = req.params.id;

            if(articleId){

                Article.findOneAndUpdate({_id:articleId},{image:file_name},{new:true},(err,articleUpdate)=>{
                    if(err || !articleUpdate){
                        return res.status(200).send({
                            status: 'error',
                            article: 'Error al guardar la imagen de articulo'
                        });
                    }
    
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdate
                    });
                });

            }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
            }
        }
    },

    getImage: (req,res)=>{

        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        fs.exists(path_file,(exits)=>{
            if(exits){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    article: 'La imagen no existe !!!'
                });
            }
        });
    },

    search: (req,res)=>{

        var searchString = req.params.search;

        Article.find({ "$or":[
            { "title": { "$regex": searchString,"$options":"i"}},
            { "content": { "$regex": searchString, "$options":"i"}}
        ]})
        .sort([['date','descending']])  
        .exec((err,article) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }

            if(!article || article.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontro articulo que coincidan con su busqueda'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles: article
            });
        });
    }
};

module.exports = controller;