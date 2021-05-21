import { Injectable } from "@angular/core"
import { Pelicula } from "../models/pelicula";

@Injectable()

export class PeliculaService{

    public peliculas: Pelicula[];

    constructor(){
        this.peliculas = [
            new Pelicula("Spiderman",2018,"https://cronicaglobal.elespanol.com/uploads/s1/61/11/50/7/main-700b9bff30.jpeg"),
            new Pelicula("Los vengadores Endgame", 2019,'https://as.com/tikitakas/imagenes/2019/04/06/portada/1554566621_000164_1554566834_noticia_normal.jpg'),
            new Pelicula("Batman vs Superman 2",2015,'https://wipy.tv/wp-content/uploads/2020/06/misterio-de-batman-v-superman.jpg'),
          ];
    }

    holaMundo(){
        return 'Hola Mundo desde un servicio en Angular';
    }

    getPeliculas()
    {
        return this.peliculas;
    }
}