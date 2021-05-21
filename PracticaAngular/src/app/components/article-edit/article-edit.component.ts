import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Article } from '../../models/article';
import { ArticleService } from '../../services/article.service';
import { Global } from '../../services/global';

@Component({
  selector: 'app-article-edit',
  templateUrl: '../article-new/article-new.component.html',
  styleUrls: ['../article-new/article-new.component.css'],
  providers: [ArticleService]
})
export class ArticleEditComponent implements OnInit {

  public article: Article;
  public urlApi: any;
  public status: string;
  public files: File[] = [];
  public page_title: string;
  public is_edit: boolean;
  public url:string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _articleService: ArticleService

  ) {
    this.article = new Article('', '', '', null, null);
    this.urlApi = Global.url + 'upload-image';
    this.page_title = "Editar Articulo";
    this.is_edit = true;
    this.url = Global.url;
  }

  ngOnInit(): void {

    this.getArticle();
  }

  onSubmit() {
    
    this._articleService.update(this.article._id,this.article).subscribe(
      response => {
        if (response.status == 'success') {
          this.status = 'success';
          this.article = response.article;
          this._router.navigate(['/blog/articulo/',this.article._id]);
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(error);
        this.status = 'error';
      }
    )
  }

  onSelect(event: any) {

    this.files.push(...event.addedFiles);

    const formData = new FormData();
    formData.append("file0", this.files[0]);

    this._articleService.upload(formData).subscribe(
      response => {
        this.article.image = response.image;
      }
    )
  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  getArticle() {
    this._route.params.subscribe(params => {

      let id = params['id'];

      this._articleService.getArticle(id).subscribe(

        response => {

          if (response.article) {
            this.article = response.article;
          } else {
            this._router.navigate(['/home']);
          }
        },
        error => {
          console.log(error);
          this._router.navigate(['/home']);
        }
      )
    })
  }

}
