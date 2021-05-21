import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Pelicula } from '../../models/pelicula';
import { PeliculaService } from '../../services/peliculas.service';

@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.component.html',
  styleUrls: ['./peliculas.component.css'],
  providers:[PeliculaService]
})
export class PeliculasComponent implements OnInit,DoCheck {

  public titulo: string;
  public peliculas: Pelicula[];
  public favoritas: Pelicula;

  constructor(
    private _peliculaService: PeliculaService
  ) { 
      this.titulo = "Componente peliculas";
      this.peliculas = this._peliculaService.getPeliculas();

      console.log("CONSTRUCTOR LANZADO");
  }

  cambiarTitulo(){
    this.titulo = 'Este es otro titulo';
  }

  ngOnInit(): void {
    console.log("Componente iniciando");
    console.log(this.peliculas);
  }

  ngDoCheck(){
    console.log("DOCHECK LANZADO");
  }

  mostrarFavorita(event: any){
    this.favoritas = event.pelicula;
  }
}
