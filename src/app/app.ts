import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from "./components/ui/toast/toast";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html'
})
export class App {
  protected title = 'gestor-seguros-app';
}
