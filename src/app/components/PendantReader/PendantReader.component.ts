import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, signal, SimpleChanges, HostListener} from '@angular/core';
import { ApplicationPresenterAPI, ApplicationPresenter, RobotSettings } from '@universal-robots/contribution-api';
import { PendantReaderNode } from './PendantReader.node';
import { PATH } from 'src/generated/contribution-constants';
import { InputValidator } from '@universal-robots/ui-models';

/**
 * The Main Class For the PendantReader 
 *
 * @export
 * @class PendantReaderComponent
 * @typedef {PendantReaderComponent}
 * @implements {ApplicationPresenter}
 * @implements {OnChanges}
 */
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
    private _applicationNode: PendantReaderNode;


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

    get applicationNode(): PendantReaderNode {
        return this._applicationNode;
    }

    @Input()
    set applicationNode(node: PendantReaderNode) {
        this._applicationNode = node;
        this.cd.detectChanges();
    }
   
    
    /** Constructs the validater used to check the page input */
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

    
    /**
     * Loads in meaningful data about the loaded PDF file
     *
     * @param {*} pdfData 
     */
    afterLoadComplete(pdfData: any) {
        this.totalPages = pdfData.numPages;
        this.isLoaded = true;
        this.applicationNode.parameters.isLoaded = this.isLoaded;
        this.saveNode()
    }

    nextPage() {
        this.page++;
        this.applicationNode.parameters.page = this.page;
        this.saveNode()
    }

    prevPage() {
        this.page--;
        this.applicationNode.parameters.page = this.page;
        this.saveNode()
    }

    onPageChange() {
        // Make sure the page is within valid bounds
        if (this.page < 1) {
          this.page = 1;
        } else if (this.page > this.totalPages) {
          this.page = this.totalPages;
        }
        this.applicationNode.parameters.page = this.page;
        this.saveNode()
      }
    

    setVariable(pageNumber: number): void {
        this.page = pageNumber;
        this.applicationNode.parameters.page = this.page;
        this.saveNode()
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          this.selectedFile = input.files[0];
          this.applicationNode.parameters.selectedFile = this.selectedFile;
          this.saveNode();
          this.loadPdf(this.selectedFile, 1)
        } else {
          console.error('No file selected or input.files is null.');
        }
    }

    loadPdf(file: File | null, page: number): void {
        if (file == null) {
            return
        }
        if (file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target && e.target.result) {
                    this.pdfSrc = e.target.result;
                    this.page = page;
                    this.applicationNode.parameters.page = this.page;
                    this.saveNode()
                    this.cd.detectChanges();  
                }
                else {
                    console.error('Error: FileReader result is null or undefined.');
                }
            };
            reader.readAsArrayBuffer(file);
          } else {
            console.log(file)
            this.resetNode();
            // TODO: display a message another way then an alert('Please select a valid PDF file.');
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
        if (changes?.applicationAPI && this.applicationAPI) {
            this.page = this.applicationNode.parameters.page;
            this.isLoaded = this.applicationNode.parameters.isLoaded;
            this.selectedFile = this.applicationNode.parameters.selectedFile;
            if (this.isLoaded && (this.selectedFile != null)) {
                try {
                    // as the pdf might have been deleted and or moved
                    // TODO: add check for if file exist instead
                    this.loadPdf(this.selectedFile, this.page);
                    return   
                } catch(e) {
                    console.log((e as Error).message);
                }
            }
            this.resetNode();
        }
    }


    resetNode() {
        this.page = 1;
        this.isLoaded = false;
        this.selectedFile = null;
        this.totalPages = 1;
        this.pdfSrc = null;
        this.applicationNode.parameters.page = this.page;
        this.applicationNode.parameters.isLoaded = this.isLoaded;
        this.applicationNode.parameters.selectedFile = this.selectedFile
        this.saveNode()
    }


    // call saveNode to save node parameters
    saveNode() {
        this.cd.detectChanges();
        this.applicationAPI.applicationNodeService.updateNode(this.applicationNode);
    }
}
