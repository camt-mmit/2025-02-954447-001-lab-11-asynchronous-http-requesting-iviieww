import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-star-wars-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './star-wars-root.html',
  styleUrl: './star-wars-root.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarWarsRoot {}
