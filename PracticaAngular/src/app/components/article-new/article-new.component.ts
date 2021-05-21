import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Article } from '../../models/article';
import { ArticleService } from '../../services/article.service';
import { Global } from '../../services/global';

@Component({
  selector: 'app-article-new',
  templateUrl: './article-new.component.html',
  styleUrls: ['./article-new.component.css'],
  providers: [ArticleService]
})
export class ArticleNewComponent implements OnInit {

  public article: Article;
  public urlApi: any;
  public status: string;
  public files: File[] = [];
  public page_title:string;
  public is_edit: boolean;
  public url:string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _articleService: ArticleService

  ) {
    this.article = new Article('', '', '', null, null),
      this.urlApi = Global.url + 'upload-image';
      this.page_title = "Crear Articulo";
      this.is_edit = false;
      this.url = Global.url;
  }

  ngOnInit(): void {

  }

  onSubmit() {
    this._articleService.create(this.article).subscribe(
      response => {
        if (response.status == 'success') {
          this.status = 'success';
          this.article = response.article;
          this._router.navigate(['/blog']);
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
}
