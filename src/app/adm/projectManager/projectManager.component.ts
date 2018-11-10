import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/security/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { ProjectDataSource } from '../../data-sources/projectDataSource';
import { YesNoDialogBoxComponent } from '../../components/yes-no-dialog-box/yes-no-dialog-box.component';
import 'rxjs/add/observable/of';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-adm-project-manager',
  templateUrl: './projectManager.component.html',
  styleUrls: ['./projectManager.component.scss']
})

export class ProjectManagerComponent implements OnInit {
  displayedColumns = [];
  dataSource: ProjectDataSource | null;
  isConnected = false;

  constructor(private authService: AuthService, public router: Router, private afs: AngularFirestore,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.isConnected = this.authService.isConnected();
    if (this.isConnected) {
      this.displayedColumns = ['title', 'description', 'modify'];
    } else {
      this.displayedColumns = ['title', 'description'];
    }
    this.dataSource = new ProjectDataSource(this.afs);
  }

  modifyProject(project: any) {
    this.router.navigate(['/project', { id: project.id }]);
  }

  deleteProject(project: any) {
    const dialogRef = this.dialog.open(YesNoDialogBoxComponent, {
      width: '250px',
      data: {
        text: 'Project and all its data',
        response: undefined
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.response === true) {
        this.afs.collection('Projects').doc(project.id).delete();
        // TODO: Supprimer tout les corpus de la Database et du storage qui sont relier avec le projet supprimé.
      }
    });
  }

}
