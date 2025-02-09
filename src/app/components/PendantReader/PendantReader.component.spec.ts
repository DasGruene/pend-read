import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PendantReaderComponent} from "./PendantReader.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {Observable, of} from "rxjs";

describe('PendantReaderComponent', () => {
  let fixture: ComponentFixture<PendantReaderComponent>;
  let component: PendantReaderComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendantReaderComponent],
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader, useValue: {
            getTranslation(): Observable<Record<string, string>> {
              return of({});
            }
          }
        }
      })],
    }).compileComponents();

    fixture = TestBed.createComponent(PendantReaderComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
