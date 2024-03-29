import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import Swal from "sweetalert2";

@Component({
    selector: 'recent-projects-page',
    templateUrl: './recent-projects-page.component.html',
    styleUrls: [
        './recent-projects-page.component.scss', 
        '../global-pages-styles/top-bar-styles.scss',
        '../global-pages-styles/ball-atom.scss'
    ]
})

export class RecentProjectsPageComponent implements OnInit {

    userData = JSON.parse(localStorage.getItem('user')!);
    isLoading = true;
    userProjects: any;
    originalProjects: any;
    userProjectsIds: any;
    showOrderMenu: Boolean = false;
    actualOrder: String = 'Ordenar por';
    searchValue: any;

    constructor(public router: Router, private http: HttpClient) {}

    ngOnInit() {
        setTimeout(() => {
            this.http.get(`https://schkedule-default-rtdb.firebaseio.com/proyecto.json?orderBy="id_usuario"&equalTo="${this.userData['id_usuario']}"`).subscribe(result => {
                this.userProjects = Object.values(result);
                this.originalProjects = [...this.userProjects];
                this.userProjectsIds = Object.keys(result);
            this.isLoading = false;
                console.log(this.userProjects);
            })      
        }, 900);

    }

    recentTest = [
        {
            'title': 'Proyect Integrador 1',
            'last_modified': '12/12/12'
        },
        {
            'title': 'Proyect Integrador 2',
            'last_modified': '12/12/12'
        },
        {
            'title': 'Proyect Integrador 3',
            'last_modified': '12/12/12'
        },
        {
            'title': 'Proyect Integrador 4',
            'last_modified': '12/12/12'
        },
        {
            'title': 'Proyect Integrador 5',
            'last_modified': '12/12/12'
        },
    ]
    newProject() {    
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Access-Control-Allow-Origin", "*");
        myHeaders.append("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
        myHeaders.append("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        const data = {
            id_usuario: this.userData.id_usuario,
            nombre_proyecto: "Proyect test",
            ultima_modificacion: new Date(),
            fecha_creacion: new Date(),
        }

        let params: RequestInit = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(data),
          redirect: 'follow'
        };

        const url_api = "https://schkedule-default-rtdb.firebaseio.com/";
        fetch(`${url_api}proyecto.json`, params)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            this.router.navigate(['/mainpage/project/new-project'], {queryParams: {
                project_id: JSON.parse(result)['name']
            }} );
        })
        .catch(error => console.log('error', error));

    }

    public redirectProjectPage = (project_id: any) => {
        this.router.navigate([''])
        console.log(project_id);
            this.router.navigate(['/mainpage/project/new-project'], {queryParams: {
                project_id: project_id
            }} );
    }

    formatDate(date: Date) {
        let tDate = new Date(date);
        let year = tDate.getUTCFullYear();
        let month:any = parseInt(tDate.getUTCMonth().toString()) + 1;
        let day:any = tDate.getUTCDate();
        let hours: any = tDate.getHours();
        let minutes: any = tDate.getMinutes();
        if(hours < 9) {
            hours = '0' + hours;
        }
        if(minutes < 9) {
            minutes = '0' + minutes;
        }
        if(month < 10) {
            month = '0' + month.toString();
        }
        if(day < 10) {
            day = '0' + day;
        }
        let time =  hours + ':' + minutes;
        let newDate = year + '/' + month + '/' + day + ' ' + time;
        return newDate;
    }

    // Eliminar proyecto desde tarjeta
    public delProject = (index: any) => {
        console.log(this.userProjects);
        this.userProjects = this.userProjects.filter((_: any, index_: any) => index_ != index)
        console.log(this.userProjects); 
    }

    public deleteProject = (projectId: any, index: any) => {
        Swal.fire({
            title: '¿Estas seguro?',
            text: "No podras revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminarlo!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                // Eliminar en firebase
                this.http.delete(`https://schkedule-default-rtdb.firebaseio.com/proyecto/${projectId}.json`).subscribe(result => {
                    console.log(result);
                })
              Swal.fire(
                'Eliminado!',
                '',
                'success'
              ).then(() => {
                  this.delProject(index);
              })
            }
          })
    }

    searchProject() {
        console.log(this.searchValue);
        if(this.userProjects != '') {
            this.userProjects = this.originalProjects.filter((element: any) => element['nombre_proyecto'].includes(this.searchValue));
        } else {
            this.userProjects = [...this.originalProjects];
        }    
    }

    orderProjects(mode: String) {
        if(mode == 'nombre-ascendente') {
            this.actualOrder = 'Nombre descendente ↑';
            this.userProjects.sort((a:any, b: any) => {
                let fa = a['nombre_proyecto'].toLowerCase(),
                    fb = b['nombre_proyecto'].toLowerCase();
            
                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            });
            
        }
        else if(mode == 'nombre-descendente') {
            this.actualOrder = 'Nombre descendente ↓';
            this.userProjects.sort((a:any, b: any) => {
                let fa = a['nombre_proyecto'].toLowerCase(),
                    fb = b['nombre_proyecto'].toLowerCase();
            
                if (fb < fa) {
                    return -1;
                }
                if (fb > fa) {
                    return 1;
                }
                return 0;
            });
        }
        else if(mode == 'fecha-ascendente') {
            this.actualOrder = 'Fecha ascendente ↑';
            this.userProjects.sort((a:any, b:any) => {
                let da: any = new Date(a['ultima_modificacion']),
                    db: any = new Date(b['ultima_modificacion']);
                return da - db;
            });
        }
        else if(mode == 'fecha-descendente') {
            this.actualOrder = 'Fecha descendente ↓';
            this.userProjects.sort((a:any, b:any) => {
                let da: any = new Date(a['ultima_modificacion']),
                    db: any = new Date(b['ultima_modificacion']);
                return db - da;
            });
        }
        this.showOrderMenu = false;
    }

}
