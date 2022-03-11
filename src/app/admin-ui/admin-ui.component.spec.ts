import { Overlay } from '@angular/cdk/overlay';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Admin, AdminUiComponent } from './admin-ui.component';
import { MatInputHarness } from '@angular/material/input/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { MatTableHarness } from '@angular/material/table/testing';

describe('AdminUiComponent', () => {
  let component: AdminUiComponent;
  let fixture: ComponentFixture<AdminUiComponent>;
  let loader: HarnessLoader;

  let testAdmin: Admin[] = [
    { select: false, id: '1', name: 'James', role: 'admin', email: 'dummy@mail.com', action: '' },
    { select: false, id: '2', name: 'John', role: 'admin', email: 'hello@mail.com', action: '' },
    { select: false, id: '3', name: 'Kelvin', role: 'member', email: 'yes@mail.com', action: '' }
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUiComponent],
      imports: [MatDialogModule],
      providers: [HttpClient, HttpHandler, MatDialog, Overlay]
    })
      .compileComponents();
    fixture = TestBed.createComponent(AdminUiComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to get type of input', async () => {
    const inputs = await loader.getAllHarnesses(MatInputHarness);
    expect(inputs.length).toBe(1);

    expect(await inputs[0].getType()).toBe('text');

  });

  it('should load all paginator harnesses', async () => {
    const paginators = await loader.getAllHarnesses(MatPaginatorHarness);
    expect(paginators.length).toBe(0);
  });

  it('should load harness for a table', async () => {
    const tables = await loader.getAllHarnesses(MatTableHarness);
    expect(tables.length).toBe(0);
  });

});

