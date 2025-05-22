import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './loading.interceptor'; // adjust path if needed
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExamComponent } from './exam/exam.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ResultComponent } from './admin/result/result.component';
import { LoginComponent } from './auth/login/login.component';
import { HugeiconsIconComponent } from '@hugeicons/angular';


@NgModule({
  declarations: [
    AppComponent,
    ExamComponent,
    ResultComponent,
    LoginComponent,

   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    HugeiconsIconComponent,
   
  ],
  providers: [
    provideClientHydration(),
      {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
