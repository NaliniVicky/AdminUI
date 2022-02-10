import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table'
import { AdminService } from '../admin.service';
export interface Admin {
  select: boolean;
  id: string;
  name: string;
  role: string;
  email: string;
  action: string;
}
@Component({
  selector: 'app-admin-ui',
  templateUrl: './admin-ui.component.html',
  styleUrls: ['./admin-ui.component.css']
})
export class AdminUiComponent implements OnInit {
  adminData!: Array<Admin>;
  collectionSize!: number;
  dataSource!: MatTableDataSource<Admin>;
  isMasterSel: boolean = false;
  adminSelected: Array<Admin> = [];
  resultLength!: number;
  constructor(private service: AdminService,private dialog:MatDialog) {
  }
  displayedColumns: string[] = ['select', 'id', 'name', 'role', 'email', 'action'];
  page = 1;
  pageSize = 10;
  pageSizeOptions: Array<number> = []
  pageEvent: PageEvent | undefined | { pageIndex: 0, pageSize: 0, previousPageIndex: 0, length: 0 };
  pageIndex!: number;

  /*   refreshCountries(data:Admin[]) {
      this.adminPage = data
        .map((order, i) => ({ ids: i + 1, ...order }))
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    } */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator
  ngAfterViewInit() {
    //  this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getAdminData();
  }
  adminEvent(event?: PageEvent){
    this.dataSource = new MatTableDataSource(this.adminData);
    this.dataSource.paginator = this.paginator;
    this.resultLength = this.adminData.length;
    return event;
  }
  getAdminData() {
    this.service.getAdminDetails().subscribe((res: any) => {
      this.adminData = res;
      this.dataSource = new MatTableDataSource(this.adminData);
      this.dataSource.paginator = this.paginator;
      this.resultLength = this.adminData.length;
    })
    
  }
  checkUncheckAll() {
    let pageIndex = this.pageEvent?.pageIndex;
    let pageSize = this.pageEvent?.pageSize;
    if (pageIndex && pageSize) {
      let checkStart = pageIndex * pageSize;
      let checkEnd = checkStart + pageSize;
      for (var i = checkStart; i < checkEnd; i++) {
        if (i < this.adminData.length)
          this.adminData[i].select = this.isMasterSel;
      }
    }
    else{
      let checkStart = 0 * 10;
      let checkEnd = checkStart + 10;
      for (var i = checkStart; i < checkEnd; i++) {
        if (i < this.adminData.length)
          this.adminData[i].select = this.isMasterSel;
      }
    }
    this.getCheckedItemList();
  }
  getCheckedItemList() {

    this.adminSelected = [];
    for (var i = 0; i < this.adminData.length; i++) {
      if (this.adminData[i].select)
        this.adminSelected.push(this.adminData[i]);
    }
    this.collectionSize = this.adminSelected.length;
  }
  getAdmin(isSelected: boolean, id: string, element: Admin) {
    var select = false;
    this.isMasterSel = false;
    if (this.adminSelected.length > 0 && isSelected === false) {
      this.adminSelected = [];
      this.adminData?.forEach(data => {
        if (data.select) {
          this.adminSelected.push(data);
        }
      })
    }
    if (isSelected === true) {
      if (this.adminSelected.length > 0) {
        this.adminSelected?.forEach(data => {
          if (data.id === id)
            select = true;
        })
        if (select === false) {
          this.adminSelected.push(element);
        }
      }
      else {
        this.adminSelected.push(element);
      }
      this.collectionSize = this.adminSelected.length;
    }
    else {
      if (this.adminSelected.length > 0) {
        for (var i = 0; i < this.adminSelected.length; i++) {
          if (this.adminSelected[i].id === id)
            this.adminSelected.splice(i, 1);
        }
      }
      this.collectionSize = this.adminSelected.length;
    }
  }
  edit(data: Admin) {
    const dialogRef = this.dialog.open(AdminDialog, {
      width: '850px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result:Admin) => {
      console.log('The dialog was closed',result);
      let data = result;
    });
  }
  delete(data: Admin) {
    if (this.adminData.length > 0) {
      for (var i = 0; i < this.adminData.length; i++) {
        this.adminData = this.adminData.filter(d => data.id != d.id)
      }
      this.dataSource = new MatTableDataSource(this.adminData);
      this.dataSource.paginator = this.paginator;
      this.resultLength = this.adminData.length;
      console.log(this.adminData)
    }
    if (this.collectionSize)
      this.collectionSize = 0;
  }
  deleteMultiple() {
    if (this.adminSelected.length > 0) {
      for (var i = 0; i < this.adminSelected.length; i++) {
        this.adminData = this.adminData.filter(d => this.adminSelected[i].id != d.id)
      }
      this.adminSelected = [];
      this.dataSource = new MatTableDataSource(this.adminData);
      this.dataSource.paginator = this.paginator;
      this.resultLength = this.adminData.length;
      this.isMasterSel = false;
    }
    if (this.collectionSize)
      this.collectionSize = 0;
  }
}

@Component({
  selector:'admin-dialog',
  templateUrl:'admin-dialog.html',
  styleUrls:['./admin-dialog.css']
})

export class AdminDialog implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<AdminUiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Admin,
  ) {}
  ngOnInit(): void {
      console.log(this.data);
  }
 /*  NoClick(){
    this.dialogRef.close('cancel');
  } */
}
