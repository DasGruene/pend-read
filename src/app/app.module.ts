import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { PendantReaderComponent } from './components/PendantReader/PendantReader.component';
import { UIAngularComponentsModule } from '@universal-robots/ui-angular-components';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { HttpBackend, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import { PATH } from '../generated/contribution-constants';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule } from '@angular/forms';

export const httpLoaderFactory = (http: HttpBackend) =>
    new MultiTranslateHttpLoader(http, [
        { prefix: PATH + '/assets/i18n/', suffix: '.json' },
        { prefix: './ui/assets/i18n/', suffix: '.json' },
    ]);

@NgModule({
    declarations: [
        PendantReaderComponent
    ],
    imports: [
        BrowserModule,
        PdfViewerModule,
        FormsModule,
        BrowserAnimationsModule,
        UIAngularComponentsModule,
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useFactory: httpLoaderFactory, deps: [HttpBackend] },
            useDefaultLang: false,
        })
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi())
    ],
})

export class AppModule implements DoBootstrap {
    constructor(private injector: Injector) {
    }

    ngDoBootstrap() {
        const pendantReaderComponent = createCustomElement(PendantReaderComponent, {injector: this.injector});
        customElements.define('dasg-pend-read-pendantreader', pendantReaderComponent);
    }

    // This function is never called, because we don't want to actually use the workers, just tell webpack about them
    registerWorkersWithWebPack() {
        new Worker(new URL('./components/PendantReader/PendantReader.behavior.worker.ts'
            /* webpackChunkName: "PendantReader.worker" */, import.meta.url), {
            name: 'PendantReader',
            type: 'module'
        });
    }
}

