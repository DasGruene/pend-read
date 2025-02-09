import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, signal, SimpleChanges, HostListener} from '@angular/core';
import { ApplicationPresenterAPI, ApplicationPresenter, RobotSettings } from '@universal-robots/contribution-api';
import { PendantReaderNode } from './PendantReader.node';
import { PATH } from 'src/generated/contribution-constants';
import { InputValidator } from '@universal-robots/ui-models';

@Component({
    templateUrl: './PendantReader.component.html',
    styleUrls: ['./PendantReader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendantReaderComponent implements ApplicationPresenter, OnChanges {
    // applicationAPI is optional
    @Input() applicationAPI: ApplicationPresenterAPI;
    // robotSettings is optional
    @Input() robotSettings: RobotSettings;
    // applicationNode is required
    @Input() applicationNode: PendantReaderNode;

    testfilepath: string = PATH + '/assets/files/LoremIpsum.pdf';
    expressionValidators = signal<Array<InputValidator>>([]);
    selectedFile: File | null = null;
    pdfSrc: string | ArrayBuffer | null = null;
    page: number = 1;
    totalPages: number = 1;
    isLoaded: boolean = false;


    constructor(
        protected readonly translateService: TranslateService,
        protected readonly cd: ChangeDetectorRef
    ) {
        this.setValidater()
    }
   
    setValidater() {
        this.expressionValidators.set([
            (input) => {
                if ((input as number) < 1) {
                    return "a pdf always starts on page 1";
                }
                else if ((input as number) > this.totalPages) {
                    return 'the pdf ends at page ' + this.totalPages;
                }
                return null;
            },
        ]);


    }

    afterLoadComplete(pdfData: any) {
        this.totalPages = pdfData.numPages;
        this.isLoaded = true;
    }

    nextPage() {
        this.page++;
    }

    prevPage() {
        this.page--;
    }

    onPageChange() {
        // Make sure the page is within valid bounds
        if (this.page < 1) {
          this.page = 1;
        } else if (this.page > this.totalPages) {
          this.page = this.totalPages;
        }
      }
    

    setVariable(pageNumber: number): void {
        this.page = pageNumber;
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          this.selectedFile = input.files[0];
      
          if (this.selectedFile.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target && e.target.result) {
                    this.pdfSrc = e.target.result;
                    this.page = 1;
                    this.cd.detectChanges();  
                }
                else {
                    console.error('Error: FileReader result is null or undefined.');
                }
            };
            reader.readAsArrayBuffer(this.selectedFile);
          } else {
            alert('Please select a valid PDF file.');
          }
        } else {
          console.error('No file selected or input.files is null.');
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.robotSettings) {
            if (!changes?.robotSettings?.currentValue) {
                return;
            }

            if (changes?.robotSettings?.isFirstChange()) {
                if (changes?.robotSettings?.currentValue) {
                    this.translateService.use(changes?.robotSettings?.currentValue?.language);
                }
                this.translateService.setDefaultLang('en');
            }

            this.translateService
                .use(changes?.robotSettings?.currentValue?.language)
                .pipe(first())
                .subscribe(() => {
                    this.cd.detectChanges();
                });
        }
    }



    // call saveNode to save node parameters
    saveNode() {
        this.cd.detectChanges();
        this.applicationAPI.applicationNodeService.updateNode(this.applicationNode);
    }
}
