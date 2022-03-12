import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
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
  isAdminSelect: boolean = false;
  adminSelected: Array<Admin> = [];
  adminDataLength!: number;
  constructor(private service: AdminService, private dialog: MatDialog,private cdr: ChangeDetectorRef) {
  }
  displayedColumns: string[] = ['select', 'id', 'name', 'role', 'email', 'action'];
  page = 1;
  pageSize = 10;
  pageSizeOptions: Array<number> = []
  pageEvent: PageEvent | undefined | { pageIndex: 0, pageSize: 0, previousPageIndex: 0, length: 0 };
  pageIndex!: number;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
}
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator


  ngOnInit(): void {
    this.getAdminData();
  }
  adminEvent(event?: PageEvent) {
    this.tableData();
    return event;
  }
  getAdminData() {
    this.service.getAdminDetails().subscribe((res: any) => {
      this.adminData = res;
      console.log(this.adminData);
      this.tableData();
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
          this.adminData[i].select = this.isAdminSelect;
      }
    }
    else {
      let checkStart = 0 * 10;
      let checkEnd = checkStart + 10;
      for (var i = checkStart; i < checkEnd; i++) {
        if (i < this.adminData.length)
          this.adminData[i].select = this.isAdminSelect;
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
    this.isAdminSelect = false;
    if (this.adminSelected.length > 0) {
      this.adminIsSelected(isSelected, id, element);
    }
    else {
      this.adminSelected.push(element);
    }
    this.collectionSize = this.adminSelected.length;
  }

  adminIsSelected(isSelected: boolean, id: string, element: Admin) {
    let isAlreadySelected = false;
    switch (isSelected) {
      case false:
        this.adminSelected = [];
        this.adminData?.forEach(data => {
          if (data.select) {
            this.adminSelected.push(data);
          }
        })
        break;
      case true:
        this.adminSelected?.forEach(data => {
          if (data.id === id)
          isAlreadySelected = true;
        })
        if (isAlreadySelected === false) {
          this.adminSelected.push(element);
        }
        break;
      default:
        for (var i = 0; i < this.adminSelected.length; i++) {
          if (this.adminSelected[i].id === id)
            this.adminSelected.splice(i, 1);
        }
    }
  }

  edit(data: Admin) {
    const dialogRef = this.dialog.open(AdminDialog, {
      width: '850px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result: Admin) => {
      console.log('The dialog was closed', result);
      let data = result;
    });
  }
  delete(data: Admin) {
    if (this.adminData.length > 0) {
      for (var i = 0; i < this.adminData.length; i++) {
        this.adminData = this.adminData.filter(d => data.id != d.id)
      }
      this.tableData();
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
      this.tableData();
      this.isAdminSelect = false;
    }
    if (this.collectionSize)
      this.collectionSize = 0;
  }
  tableData() {
    this.dataSource = new MatTableDataSource(this.adminData);
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.adminDataLength = this.adminData.length;
  }
}

@Component({
  selector: 'admin-dialog',
  templateUrl: 'admin-dialog.html',
  styleUrls: ['./admin-dialog.css']
})

export class AdminDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AdminUiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Admin,
  ) { }
  ngOnInit(): void {
    console.log(this.data);
  }

}
