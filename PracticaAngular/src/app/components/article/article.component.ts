import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from '../../services/global';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';



@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
  providers:[ArticleService]
})
export class ArticleComponent implements OnInit {

  public article: Article;
  public url: string;

  constructor(
    private _articleService: ArticleService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { 

    this.url = Global.url;
  }

  ngOnInit(): void {

    this._route.params.subscribe(params => {
        
        let id = params['id'];

        this._articleService.getArticle(id).subscribe(

            response =>{
             
                if(response.article){
                    this.article = response.article;  
                }else{
                  this._router.navigate(['/home']);
                }
            },
            error =>{
              console.log(error);
              this._router.navigate(['/home']);
            }
        )
    })
  }

  delete(id:any){

    Swal.fire({
      title: '¿Estas seguro?',
      text: "Si eliminas este registro no podras recuperarlo nuevamente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo'
    }).then((result) => {
      if (result.isConfirmed) {

        this._articleService.delete(id).subscribe(
          response=>{

            Swal.fire(
              'Eliminado!',
              'El registro se ha eliminado con exito.',
              'success'
            )

            this._router.navigate(['/blog']);
          },
          error =>{
            console.log(error);
          }
        )
      }
    })
  }
}
